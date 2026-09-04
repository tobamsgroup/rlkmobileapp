import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { fetchChapterPageAudio } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import { useReadSettings } from '@/context/ReadContext';
import useKidProfile from '@/hooks/useKidProfile';
import {
  AudioMark,
  ChapterPage as ChapterPageType,
  PageParagraph,
} from '@/types';
import { AudioModule, AudioPlayer, createAudioPlayer } from 'expo-audio';
import { ActivityIndicator } from 'react-native';
import { twMerge } from 'tailwind-merge';
import {
  buildKaraokeTimeline,
  buildSegments,
  KaraokeTimeline,
  normalizeNewlines,
  resolveKaraokePosition,
  resolveMarkPosition,
  Segment,
  wordStartAt,
} from '../../utils/kid';
import Button, { SecondaryButton } from '../Button';
import { KaraokeText } from './KaraokeText';

/**
 * How often native pushes playback position to JS. expo-audio defaults to
 * 500ms, which is far too coarse to drive a word-level highlight.
 */
const AUDIO_UPDATE_INTERVAL = 50;
const KARAOKE_TICK_MS = 50;
/** Never extrapolate further than this past the last native sample (seconds). */
const MAX_CLOCK_EXTRAPOLATION = 0.35;

export const Chapter = ({
  data,
  handlePageIndex,
  canGoNext,
  canGoPrev,
  title,
  chapterId,
}: {
  data: ChapterPageType | null;
  handlePageIndex: (type: 'prev' | 'next') => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  title?: string;
  chapterId?: string;
}) => {
  const { readingSettings, updateReadingSettings, saveSettings } =
    useReadSettings();

  // The backend caches synthesized audio per (chapter, page, voice), so a voice
  // change makes the URL and marks we are holding stale.
  const { data: kidProfile } = useKidProfile();
  const ttsVoice = kidProfile?.readingSettings?.voice;

  const updateFont = (type: 'increase' | 'decrease' | 'reset') => {
    updateReadingSettings({
      fontSize: {
        header:
          type === 'reset'
            ? 16
            : type === 'increase'
              ? readingSettings.fontSize.header + 2
              : readingSettings.fontSize.header - 2,
        body:
          type === 'reset'
            ? 14
            : type === 'increase'
              ? readingSettings.fontSize.body + 2
              : readingSettings.fontSize.body - 2,
      },
    });
    saveSettings();
  };

  const [openHelper, setOpenHelper] = useState(false);
  const [helper, setHelper] = useState('');

  /** Audio */
  const audioRef = useRef<AudioPlayer | null>(null);
  const karaokeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  /**
   * Real word timings from Google, when the configured voice can emit them.
   * Chirp3-HD voices return none, in which case we fall back to the estimated
   * timeline. See constants/tts-voices.constant.ts on the backend.
   */
  const marksRef = useRef<AudioMark[]>([]);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  /** Segments */
  const segments = useMemo(() => buildSegments(data), [data]);
  const timeline = useMemo(() => buildKaraokeTimeline(segments), [segments]);

  const segmentsRef = useRef<Segment[]>([]);
  const timelineRef = useRef<KaraokeTimeline | null>(null);

  useEffect(() => {
    segmentsRef.current = segments;
    timelineRef.current = timeline;
  }, [segments, timeline]);

  /** Playback state */
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSegIndex, setCurrentSegIndex] = useState(-1);
  const [currentCharIndex, setCurrentCharIndex] = useState<number | null>(null);

  const setPlayingState = (v: boolean) => {
    isPlayingRef.current = v;
    setIsPlaying(v);
  };

  const setPausedState = (v: boolean) => {
    isPausedRef.current = v;
    setIsPaused(v);
  };

  /**
   * expo-audio pushes `currentTime` from native to JS on a fixed interval
   * (AUDIO_UPDATE_INTERVAL below), so the raw value is a staircase, not a live
   * clock. Reading it directly leaves the highlight up to one interval behind
   * the audio and makes it jump rather than glide. Between native samples we
   * extrapolate with the wall clock, capped so a stalled or seeking player can
   * never let the estimate run away.
   */
  const clockRef = useRef({ nativeTime: -1, wall: 0 });

  const resetClock = () => {
    clockRef.current = { nativeTime: -1, wall: 0 };
  };

  const readPlayerTime = (player: AudioPlayer) => {
    const native = player.currentTime;
    const now = Date.now();
    const clock = clockRef.current;

    if (native !== clock.nativeTime) {
      clock.nativeTime = native;
      clock.wall = now;
      return native;
    }

    const drift = Math.min(
      (now - clock.wall) / 1000,
      MAX_CLOCK_EXTRAPOLATION,
    );
    return native + drift * (player.playbackRate || 1);
  };

  /** Karaoke: map audio currentTime → segment + char index */
  const lastWordRef = useRef({ seg: -1, start: -1 });

  const resetKaraokePosition = () => {
    lastWordRef.current = { seg: -1, start: -1 };
  };

  const updateKaraokeFromTime = (currentTime: number, duration: number) => {
    const segs = segmentsRef.current;
    if (!segs.length) return;

    // Exact timings win; the estimated timeline is only a stand-in for voices
    // that cannot report where they are.
    const resolved =
      resolveMarkPosition(marksRef.current, currentTime) ??
      (timelineRef.current && duration > 0
        ? resolveKaraokePosition(timelineRef.current, currentTime / duration)
        : null);

    if (!resolved) return;
    const { segIndex, charIndex } = resolved;
    if (segIndex >= segs.length) return;

    // KaraokeText highlights the whole word around charIndex, so re-rendering
    // for every character inside that word repaints the entire page for no
    // visible change - and on a long page that alone is enough to starve the
    // JS thread and delay the next tick.
    const start = wordStartAt(segs[segIndex].text, charIndex);
    const last = lastWordRef.current;
    if (last.seg === segIndex && last.start === start) return;

    lastWordRef.current = { seg: segIndex, start };
    setCurrentSegIndex(segIndex);
    setCurrentCharIndex(charIndex);
  };

  const stopKaraokePolling = () => {
    if (karaokeTimerRef.current) {
      clearInterval(karaokeTimerRef.current);
      karaokeTimerRef.current = null;
    }
  };

  const startKaraokePolling = () => {
    stopKaraokePolling();
    resetClock();
    //@ts-ignore
    karaokeTimerRef.current = setInterval(() => {
      const player = audioRef.current;
      if (!player) return;

      const dur = player.duration;
      const ct = player.currentTime;

      // End detection uses the raw native time; the extrapolated value may sit
      // slightly ahead of it and would cut the last word short.
      //
      // The isLoaded/ct guards matter: while a remote MP3 is still buffering,
      // `duration` can report a small positive value, making `dur - 0.15`
      // negative and `ct >= dur - 0.15` true at ct=0. That flagged the track as
      // finished the instant it started - isPlaying went false while the audio
      // kept playing, so the toggle called playTTS() and restarted the page
      // instead of pausing it.
      if (player.isLoaded && dur > 0 && ct > 0 && ct >= dur - 0.15) {
        stopKaraokePolling();
        player.pause();
        setPlayingState(false);
        setPausedState(false);
        setCurrentSegIndex(-1);
        setCurrentCharIndex(null);
        resetKaraokePosition();
        return;
      }

      if (isPlayingRef.current) {
        updateKaraokeFromTime(readPlayerTime(player), dur);
      }
    }, KARAOKE_TICK_MS);
  };

  /** STOP */
  const stopTTS = () => {
    stopKaraokePolling();
    audioRef.current?.pause();
    audioRef.current?.seekTo(0);
    setPlayingState(false);
    setPausedState(false);
    setCurrentSegIndex(-1);
    setCurrentCharIndex(null);
    resetKaraokePosition();
  };

  /** PLAY — fetches URL on first press if not yet loaded */
  const playTTS = async () => {
    if (isLoadingAudio) return;

    let url = audioUrl;

    if (!url) {
      if (!chapterId || !data || typeof data.index !== 'number') return;
      setIsLoadingAudio(true);
      try {
        const audio = await fetchChapterPageAudio(
          chapterId,
          data.index as number,
        );
        url = audio.audioUrl;
        marksRef.current = audio.marks ?? [];
        setAudioUrl(url);
      } catch (err) {
        console.log('[TTS] fetch error:', err);
        setIsLoadingAudio(false);
        return;
      }
      setIsLoadingAudio(false);
    }
    if (!url) return;

    // Narration is content the kid explicitly asked to hear, so it must survive
    // the hardware mute switch. This also clears `allowsRecording`, which
    // Journal turns on and never turns off - on iOS that leaves the session in
    // play-and-record mode, routing playback to the earpiece at low volume and
    // making the play button look broken.
    try {
      await AudioModule.setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
    } catch (err) {
      console.log('[TTS] audio mode error:', err);
    }

    audioRef.current?.pause();
    audioRef.current?.remove();
    audioRef.current = createAudioPlayer(
      { uri: url },
      { updateInterval: AUDIO_UPDATE_INTERVAL },
    );
    audioRef.current.play();

    setPlayingState(true);
    setPausedState(false);
    setCurrentSegIndex(0);
    setCurrentCharIndex(0);
    resetKaraokePosition();
    startKaraokePolling();
  };

  /** PAUSE */
  const pauseTTS = () => {
    audioRef.current?.pause();
    stopKaraokePolling();
    setPausedState(true);
    setPlayingState(false);
  };

  /** RESUME */
  const resumeTTS = () => {
    if (!isPausedRef.current || !audioRef.current) return;
    audioRef.current.play();
    setPlayingState(true);
    setPausedState(false);
    startKaraokePolling();
  };

  /** RESET */
  const resetTTS = () => {
    if (!audioUrl) return;
    stopKaraokePolling();
    audioRef.current?.pause();
    audioRef.current?.seekTo(0);
    audioRef.current?.play();
    setPlayingState(true);
    setPausedState(false);
    setCurrentSegIndex(0);
    setCurrentCharIndex(0);
    resetKaraokePosition();
    startKaraokePolling();
  };

  /** Reset audio state when the page changes */
  useEffect(() => {
    stopTTS();
    setAudioUrl(null);
    marksRef.current = [];
  }, [chapterId, data?.index]);

  /**
   * A voice change makes the loaded URL and marks stale. The first defined
   * value is skipped: that is just the kid-profile query resolving, and
   * treating it as a change would stop playback the moment it arrives.
   */
  const knownVoiceRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (ttsVoice === undefined) return;
    const previous = knownVoiceRef.current;
    knownVoiceRef.current = ttsVoice;
    if (previous === undefined || previous === ttsVoice) return;

    stopTTS();
    setAudioUrl(null);
    marksRef.current = [];
  }, [ttsVoice]);

  /** Cleanup on unmount */
  useEffect(() => {
    return () => {
      stopKaraokePolling();
      audioRef.current?.pause();
      audioRef.current?.remove();
    };
  }, []);

  const activeSeg =
    currentSegIndex >= 0 && currentSegIndex < segments.length
      ? segments[currentSegIndex]
      : null;

  return (
    <>
    
    <View
      style={{
        backgroundColor: readingSettings.highContrast ? '#FEFAEE' : '#FAFDFF',
      }}
      className="flex-1  p-8 rounded-[12px]"
    >
      <View >
        {data ? (
          <>
            {data?.title && (
              <Text
                style={{ fontSize: readingSettings.fontSize.header }}
                className="font-sansSemiBold"
              >
                <KaraokeText
                  text={data.title}
                  isActive={activeSeg?.kind === 'title'}
                  charIndex={
                    activeSeg?.kind === 'title' ? currentCharIndex : null
                  }
                />
              </Text>
            )}

            {data?.paragraphs?.map((p, i) => (
              <Paragraph
                key={i}
                data={p}
                index={i}
                active={activeSeg}
                currentCharIndex={currentCharIndex}
              />
            ))}
          </>
        ) : (
          <View className="h-[50vh] flex flex-col items-center justify-center">
            <Text className="font-sansSemiBold text-[24px] lg:text-[48px]">
              {title}
            </Text>
            <Text className="font-sansSemiBold text-[24px] lg:text-[24px]">
              Coming Soon...
            </Text>
          </View>
        )}

        {data && (
          <View className="flex-row justify-center gap-4 mt-3">
            {canGoPrev && (
              <SecondaryButton
                className="flex-1"
                onPress={() => handlePageIndex('prev')}
                text="PREVIOUS"
              />
            )}

            {canGoNext && (
              <Button
                className="flex-1"
                onPress={() => handlePageIndex('next')}
                text="NEXT"
              />
            )}
          </View>
        )}
      </View>

      {openHelper && (
        <View className="absolute z-50 shadow bg-white py-4 px-3 rounded-[16px] items-center right-[-16px] top-[143px]">
          {!helper && (
            <>
              <Pressable onPress={() => setHelper('sound')}>
                <ICONS.ReadModeSpeakerBlack />
              </Pressable>
              <View className="border border-[#D3D2D366] my-3 w-full" />
              <Pressable onPress={() => setHelper('font')}>
                <ICONS.ReadModeTt />
              </Pressable>
              <View className="border border-[#D3D2D366] my-3 w-full" />
              <Pressable onPress={() => setOpenHelper(false)}>
                <ICONS.ChevronRight width={24} height={24} />
              </Pressable>
            </>
          )}

          {helper === 'sound' && (
            <>
              <Pressable
                disabled={isLoadingAudio}
                onPress={() => {
                  if (isPlaying) pauseTTS();
                  else if (isPaused) resumeTTS();
                  else playTTS();
                }}
              >
                {isLoadingAudio ? (
                  <ActivityIndicator size="small" color="#265828" />
                ) : isPlaying ? (
                  <ICONS.PauseFilled width={64} height={51} />
                ) : (
                  <ICONS.ReadModeSpeakerYellow />
                )}
              </Pressable>
              <View className="my-3 w-full" />
              <Pressable
                disabled={isLoadingAudio || !audioUrl}
                onPress={resetTTS}
              >
                <ICONS.ReadModeReset />
              </Pressable>
              <View className="my-3 w-full" />
              <Pressable onPress={stopTTS}>
                <ICONS.ReadModePause />
              </Pressable>
              <View className="border border-[#D3D2D366] my-3 w-full" />
              <Pressable onPress={() => setHelper('')}>
                <ICONS.ReadModeCancel />
              </Pressable>
            </>
          )}

          {helper === 'font' && (
            <>
              <Pressable onPress={() => updateFont('increase')}>
                <ICONS.APlus />
              </Pressable>
              <View className="my-3 w-full" />
              <Pressable
                onPress={() => updateFont('reset')}
                className="border border-[#265828] rounded-[32px] px-4 py-3"
              >
                <Text className="text-[18px] font-sansMedium text-[#265828]">
                  RESET
                </Text>
              </Pressable>
              <View className="my-3 w-full" />
              <Pressable onPress={() => updateFont('decrease')}>
                <ICONS.AMinus />
              </Pressable>
              <View className="border border-[#D3D2D366] my-3 w-full" />
              <Pressable onPress={() => setHelper('')}>
                <ICONS.ReadModeCancel />
              </Pressable>
            </>
          )}
        </View>
      )}

    </View>
      {!openHelper && (
        <Pressable
        
          className="right-[-16px] shadow top-[143px] absolute border items-center justify-center border-[#3F9243] bg-[#F1F9F1] rounded-[16px] h-16 w-14"
          onPress={() => setOpenHelper(true)}
        >
          <ICONS.ChevronLeft stroke={'black'} width={24} height={24} />
        </Pressable>
      )}
    </>
  );
};

const Paragraph = ({
  data,
  index,
  active,
  currentCharIndex,
}: {
  data?: PageParagraph;
  index: number;
  active: any;
  currentCharIndex: number | null;
}) => {
  const { readingSettings } = useReadSettings();

  // listIndex matters: without it every list row of the same kind in this
  // paragraph reports itself active and highlights simultaneously, each one
  // applying the active row's charIndex to its own text.
  const isActive = (kind: any, listIndex?: number) =>
    !!active &&
    active.pid === index &&
    active.kind === kind &&
    (listIndex === undefined || active.listIndex === listIndex);

  const charIndexIfActive = (kind: any, listIndex?: number) =>
    isActive(kind, listIndex) ? currentCharIndex : null;

  return (
    <View className="mb-1">
      {data?.header && (
        <Text
          style={{
            fontFamily: readingSettings?.dyslexiaFriendly
              ? 'Lexend-Medium'
              : 'Sans-SemiBold',
            fontSize:
              data?.headerFont?.toLowerCase() === 'big'
                ? readingSettings.fontSize?.header + 4
                : readingSettings.fontSize?.header,
          }}
        >
          <KaraokeText
            text={data.header}
            isActive={isActive('header')}
            charIndex={charIndexIfActive('header')}
          />
        </Text>
      )}

      <View
        className={twMerge(
          'flex flex-col w-full gap-8 mt-2',
          data?.template === 'image-left' && 'lg:flex-row gap-4',
          data?.template === 'image-right' &&
            'lg:flex-row-reverse flex-col-reverse gap-4',
        )}
      >
        {data?.image && (
          <Image
            source={{ uri: data.image }}
            resizeMode={data?.imageResizeMode || "cover"}
            className="w-full h-56 rounded-xl mb-3"
          />
        )}

        {(data?.subColumnHeader || data?.content || data?.subContent) && (
          <View className="flex flex-col w-full">
            {(data?.subColumnHeader ?? (data as any)?.subHeader) && (
              <Text
                style={{
                  lineHeight: readingSettings.lineSpace,
                  fontFamily: readingSettings?.dyslexiaFriendly
                    ? 'Lexend-Medium'
                    : 'Sans-SemiBold',

                  fontSize:
                    data?.headerFont?.toLowerCase() === 'big'
                      ? readingSettings.fontSize?.header + 4
                      : readingSettings.fontSize?.header,
                }}
                className={twMerge(
                  'font-sansSemiBold text-dark p-0 mb-2',
                  data?.headerFont?.toLowerCase() === 'big' ? '' : '!mb-2',
                )}
              >
                <KaraokeText
                  text={data.subColumnHeader ?? (data as any).subHeader}
                  isActive={isActive('subColumnHeader')}
                  charIndex={charIndexIfActive('subColumnHeader')}
                />
              </Text>
            )}

            {data?.content && (
              <Text
                style={{
                  fontSize: readingSettings.fontSize.body,
                  lineHeight: readingSettings.lineSpace,
                  fontFamily: readingSettings?.dyslexiaFriendly
                    ? 'Lexend-Regular'
                    : 'Sans-Regular',
                }}
                className=" font-sans text-dark"
              >
                <KaraokeText
                  text={normalizeNewlines(data?.content)}
                  isActive={isActive('content')}
                  charIndex={charIndexIfActive('content')}
                />
              </Text>
            )}
          </View>
        )}
      </View>

      {data?.subContent && (
        <Text
          style={{
            fontSize: readingSettings.fontSize.body,
            lineHeight: readingSettings.lineSpace,
            fontFamily: readingSettings?.dyslexiaFriendly
              ? 'Lexend-Regular'
              : 'Sans-Regular',
          }}
          className="whitespace-pre-line mt-2 font-sans text-dark"
        >
          <KaraokeText
            text={normalizeNewlines(data?.subContent)}
            isActive={isActive('subContent')}
            charIndex={charIndexIfActive('subContent')}
          />
        </Text>
      )}

      {!!data?.list?.length && (
        <View
          className={twMerge(
            'list-disc ml-2 space-y-2',
            data.listPointStyle === 'numeric' && 'list-decimal',
          )}
        >
          {data?.list?.map((d, li) => (
            <View className="whitespace-pre-line flex-row gap-2 items-center" key={li}>
            { data.listPointStyle === 'numeric' ? <Text>{li + 1}.</Text> :  <View className='w-1 h-1 rounded-full bg-black/55 '/>}
            <View>

              {d?.title && (
                <Text
                  style={{
                    fontSize: readingSettings.fontSize.body,
                    lineHeight: readingSettings.lineSpace,
                    fontFamily: readingSettings?.dyslexiaFriendly
                      ? 'Lexend-Medium'
                      : 'Sans-Medium',
                  }}
                  className="font-sansMedium mr-1"
                >
                  <KaraokeText
                    text={d.title}
                    isActive={isActive('list-title', li)}
                    charIndex={charIndexIfActive('list-title', li)}
                  />
                </Text>
              )}
              {d?.content && (
                <Text
                  style={{
                    fontSize: readingSettings.fontSize.body,
                    lineHeight: readingSettings.lineSpace,
                    fontFamily: readingSettings?.dyslexiaFriendly
                      ? 'Lexend-Regular'
                      : 'Sans-Regular',
                  }}
                  className="font-sans"
                >
                  <KaraokeText
                    text={normalizeNewlines(d?.content)}
                    isActive={isActive('list-content', li)}
                    charIndex={charIndexIfActive('list-content', li)}
                  />
                </Text>
              )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
