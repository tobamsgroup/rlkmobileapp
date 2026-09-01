import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { fetchChapterPageAudio } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import { useReadSettings } from '@/context/ReadContext';
import { ChapterPage as ChapterPageType, PageParagraph } from '@/types';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import { ActivityIndicator } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { buildSegments, Segment } from '../../utils/kid';
import Button, { SecondaryButton } from '../Button';
import { KaraokeText } from './KaraokeText';

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
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  /** Segments */
  const segments = useMemo(() => buildSegments(data), [data]);
  const segmentsRef = useRef<Segment[]>([]);

  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

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

  /** Karaoke: map audio currentTime → segment + char index */
  const updateKaraokeFromTime = (currentTime: number, duration: number) => {
    const segs = segmentsRef.current;
    if (!segs.length || duration <= 0) return;

    const ratio = Math.min(currentTime / duration, 1);
    const totalChars = segs.reduce((s, seg) => s + seg.text.length + 1, 0);
    const targetOffset = Math.floor(ratio * totalChars);

    let charCount = 0;
    for (let i = 0; i < segs.length; i++) {
      const segLen = segs[i].text.length + 1;
      if (charCount + segLen > targetOffset) {
        setCurrentSegIndex(i);
        setCurrentCharIndex(targetOffset - charCount);
        return;
      }
      charCount += segLen;
    }
  };

  const stopKaraokePolling = () => {
    if (karaokeTimerRef.current) {
      clearInterval(karaokeTimerRef.current);
      karaokeTimerRef.current = null;
    }
  };

  const startKaraokePolling = () => {
    stopKaraokePolling();
    //@ts-ignore
    karaokeTimerRef.current = setInterval(() => {
      const player = audioRef.current;
      if (!player) return;

      const ct = player.currentTime;
      const dur = player.duration;

      if (dur > 0 && ct >= dur - 0.15) {
        // Reached end — reset state
        stopKaraokePolling();
        setPlayingState(false);
        setPausedState(false);
        setCurrentSegIndex(-1);
        setCurrentCharIndex(null);
        return;
      }

      if (isPlayingRef.current) {
        updateKaraokeFromTime(ct, dur);
      }
    }, 100);
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
  };

  /** PLAY — fetches URL on first press if not yet loaded */
  const playTTS = async () => {
    if (isLoadingAudio) return;

    let url = audioUrl;

    if (!url) {
      if (!chapterId || !data || typeof data.index !== 'number') return;
      setIsLoadingAudio(true);
      try {
        url = await fetchChapterPageAudio(chapterId, data.index as number);
        setAudioUrl(url);
      } catch (err) {
        console.log('[TTS] fetch error:', err);
        setIsLoadingAudio(false);
        return;
      }
      setIsLoadingAudio(false);
    }

    audioRef.current?.pause();
    audioRef.current?.remove();
    audioRef.current = createAudioPlayer({ uri: url });
    audioRef.current.play();

    setPlayingState(true);
    setPausedState(false);
    setCurrentSegIndex(0);
    setCurrentCharIndex(0);
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
    startKaraokePolling();
  };

  /** Reset audio state when page changes */
  useEffect(() => {
    stopTTS();
    setAudioUrl(null);
  }, [chapterId, data?.index]);

  /** Cleanup on unmount */
  useEffect(() => {
    return () => {
      stopKaraokePolling();
      audioRef.current?.pause();
      audioRef.current?.remove();
    };
  }, []);

  const activeSeg =
    currentSegIndex >= 0 && currentSegIndex < segmentsRef.current.length
      ? segmentsRef.current[currentSegIndex]
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
                {data.title}
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

  const isActive = (kind: any) =>
    !!active && active.pid === index && active.kind === kind;

  const charIndexIfActive = (kind: any) =>
    isActive(kind) ? currentCharIndex : null;

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
                    isActive={isActive('list-title')}
                    charIndex={charIndexIfActive('list-title')}
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
                    isActive={isActive('list-content')}
                    charIndex={charIndexIfActive('list-content')}
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


function normalizeNewlines(text: string): string {
  if(!text) return '';
  return text.replace(/\n+/g, "\n");
}