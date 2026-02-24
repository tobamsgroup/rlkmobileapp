import * as Speech from 'expo-speech';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons';
import { useReadSettings } from '@/context/ReadContext';
import { ChapterPage as ChapterPageType, PageParagraph } from '@/types';
import { twMerge } from 'tailwind-merge';
import { buildSegments, createManualKaraoke, Segment } from '../../utils/kid';
import Button, { SecondaryButton } from '../Button';
import { KaraokeText } from './KaraokeText';

export const Chapter = ({
  data,
  handlePageIndex,
  canGoNext,
  canGoPrev,
  title
}: {
  data: ChapterPageType | null;
  handlePageIndex: (type: 'prev' | 'next') => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  title?:string
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

  /** Segments */
  const segments = useMemo(() => buildSegments(data), [data]);
  const segmentsRef = useRef<Segment[]>([]);

  useEffect(() => {
    segmentsRef.current = segments;
    queueIndexRef.current = 0;
  }, [segments]);

  /** Session + State refs */
  const sessionIdRef = useRef(0);
  const queueIndexRef = useRef(0);
  const lastCharIndexRef = useRef(0);

  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);

  const manualKaraokeRef = useRef<any>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSegIndex, setCurrentSegIndex] = useState(-1);
  const [currentCharIndex, setCurrentCharIndex] = useState<number | null>(null);

  /** Helpers */
  const setPlayingState = (v: boolean) => {
    isPlayingRef.current = v;
    setIsPlaying(v);
  };

  const setPausedState = (v: boolean) => {
    isPausedRef.current = v;
    setIsPaused(v);
  };

  const invalidateSession = () => {
    sessionIdRef.current += 1;
  };

  /** STOP */
  const stopTTS = () => {
    invalidateSession();

    Speech.stop();

    manualKaraokeRef.current?.stopManualTiming?.();

    queueIndexRef.current = 0;
    lastCharIndexRef.current = 0;

    setPlayingState(false);
    setPausedState(false);
    setCurrentSegIndex(-1);
    setCurrentCharIndex(null);
  };

  /** PLAY NEXT SEGMENT */
  const playNext = (resumeFromChar = 0) => {
    const list = segmentsRef.current;
    const idx = queueIndexRef.current;

    if (!list || idx >= list.length) {
      stopTTS();
      return;
    }

    setCurrentSegIndex(idx);

    const seg = list[idx];

    let textToSpeak = seg.text;
    let charOffset = 0;

    if (resumeFromChar > 0 && resumeFromChar < seg.text.length) {
      textToSpeak = seg.text.slice(resumeFromChar);
      charOffset = resumeFromChar;
    }

    const mySession = sessionIdRef.current;

    /** Karaoke timing */
    const manualKaraoke = createManualKaraoke(
      textToSpeak,
      1,
      (charIndex: number) => {
        if (mySession !== sessionIdRef.current) return;

        const actual = charIndex + charOffset;

        lastCharIndexRef.current = actual;
        setCurrentCharIndex(actual);
      },
    );

    manualKaraokeRef.current = manualKaraoke;
    manualKaraoke.startManualTiming();

    /** Speak */
    Speech.speak(textToSpeak, {
      language: 'en-US',
      rate: 0.5,
      pitch: 1,
      onDone: finish,
      onStopped: finish,
      onError: finish,
    });

    function finish() {
      manualKaraoke.stopManualTiming();

      if (mySession !== sessionIdRef.current) return;

      queueIndexRef.current += 1;
      lastCharIndexRef.current = 0;

      if (!isPausedRef.current) {
        setTimeout(() => playNext(), 30);
      }
    }
  };

  /** SPEAK FROM INDEX */
  const speakFrom = (startIdx = 0) => {
    invalidateSession();
    Speech.stop();

    setTimeout(() => {
      queueIndexRef.current = startIdx;

      setPlayingState(true);
      setPausedState(false);

      playNext();
    }, 30);
  };

  /** PAUSE (simulated) */
  const pauseTTS = async () => {
    try {
      await Speech.stop();

      manualKaraokeRef.current?.pauseManualTiming?.();

      setPausedState(true);
      setPlayingState(false);
    } catch {}
  };

  /** RESUME */
  const resumeTTS = () => {
    if (!isPausedRef.current) return;

    invalidateSession();

    setTimeout(() => {
      setPlayingState(true);
      setPausedState(false);

      playNext(lastCharIndexRef.current);
    }, 30);
  };

  /** RESET */
  const resetTTS = () => {
    invalidateSession();
    Speech.stop();

    queueIndexRef.current = 0;
    lastCharIndexRef.current = 0;

    setPlayingState(true);
    setPausedState(false);

    playNext();
  };

  /** Cleanup */
  useEffect(() => {
    return () => stopTTS();
  }, [data]);

  const activeSeg =
    currentSegIndex >= 0 && currentSegIndex < segmentsRef.current.length
      ? segmentsRef.current[currentSegIndex]
      : null;

  return (
    <View className="flex-1 bg-[#FAFDFF] p-8 rounded-[12px]">
      <View className="gap-6">
{data ?
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
        </>:
         <View className="h-[50vh] flex flex-col items-center justify-center">
            <Text className="font-sansSemiBold text-[24px] lg:text-[48px]">{title}</Text>
            <Text className="font-sansSemiBold text-[24px] lg:text-[24px]">
              Coming Soon...
            </Text>
          </View>
        }

       {data && <View className="flex-row justify-center gap-4">
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
        </View>}

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
                onPress={() => {
                  if (isPlaying) pauseTTS();
                  else if (isPaused) resumeTTS();
                  else speakFrom(0);
                }}
              >
                <ICONS.ReadModeSpeakerYellow />
              </Pressable>
              <View className=" my-3 w-full" />
              <Pressable     onPress={resetTTS}>
                <ICONS.ReadModeReset />
              </Pressable>
              <View className=" my-3 w-full" />

              <Pressable     onPress={stopTTS}>
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
              <View className=" my-3 w-full" />
              <Pressable
                onPress={() => updateFont('reset')}
                className="border border-[#265828] rounded-[32px] px-4 py-3"
              >
                <Text className="text-[18px] font-sansMedium text-[#265828]">
                  RESET
                </Text>
              </Pressable>
              <View className=" my-3 w-full" />

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
      {!openHelper && (
        <Pressable
          className="right-[-16px] shadow top-[143px] absolute border items-center justify-center border-[#3F9243] bg-[#F1F9F1] rounded-[16px] h-16 w-14"
          onPress={() => setOpenHelper(true)}
        >
          <ICONS.ChevronLeft width={24} height={24} />
        </Pressable>
      )}
    </View>
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
    <View className="mb-6">
      {data?.header && (
        <Text
          style={{
            fontSize:
              data?.headerFont?.toLowerCase() === 'big'
                ? readingSettings.fontSize?.header + 4
                : readingSettings.fontSize?.header,
          }}
          className="font-sansSemiBold"
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
          'flex flex-col w-full gap-8 mt-6',
          data?.template === 'image-left' && 'lg:flex-row gap-4',
          data?.template === 'image-right' &&
            'lg:flex-row-reverse flex-col-reverse gap-4',
        )}
      >
        {data?.image && (
          <Image
            source={{ uri: data.image }}
            resizeMode="cover"
            className="w-full h-56 rounded-xl mt-4"
          />
        )}

        {(data?.subColumnHeader || data?.content || data?.subContent) && (
          <View className="flex flex-col w-full">
            {(data?.subColumnHeader ?? (data as any)?.subHeader) && (
              <Text
                style={{
                  lineHeight: readingSettings.lineSpace,
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
                }}
                className="mt-2 font-sans text-dark"
              >
                <KaraokeText
                  text={data.content}
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
          }}
          className="whitespace-pre-line mt-2 font-sans text-dark"
        >
          <KaraokeText
            text={data.subContent}
            isActive={isActive('subContent')}
            charIndex={charIndexIfActive('subContent')}
          />
        </Text>
      )}

      {!!data?.list?.length && (
        <View
          className={twMerge(
            'list-disc ml-8 space-y-2',
            data.listPointStyle === 'numeric' && 'list-decimal',
          )}
        >
          {data?.list?.map((d, li) => (
            <View className="whitespace-pre-line" key={li}>
              {d?.title && (
                <Text
                  style={{
                    fontSize: readingSettings.fontSize.body,
                    lineHeight: readingSettings.lineSpace,
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
                  }}
                  className="font-sans"
                >
                  <KaraokeText
                    text={d.content}
                    isActive={isActive('list-content')}
                    charIndex={charIndexIfActive('list-content')}
                  />
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
