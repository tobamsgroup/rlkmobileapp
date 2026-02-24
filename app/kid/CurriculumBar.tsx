'use client';
import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import {
  AssignedSeries,
  Chapter,
  ChapterPage,
  ReadingProgressProps,
} from '@/types';
import {
  filterAssignedChapters,
  getPLProgress,
  handleParams,
  isPageAccessible,
  isPlayandLearnPageAccessible,
} from '@/utils/kid';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  findNodeHandle,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Svg, { Path } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';
import { getPageName, PLAY_LEARN_PROGRESS_KEY } from '../../constants';
import {
  addExtraPagesToActivity,
  addExtraPagesToChapters,
  formatActivityPages,
  retrieveFromLocalStorage,
} from '../../utils/kid';

const CurriculumBar = ({
  open,
  onClose,
  className,
  series,
  chapters,
  isLoadingChapters,
  allSeriesPages,
  readingProgress,
  closeMenu,
}: {
  open: boolean;
  onClose: () => void;
  className?: string;
  series: AssignedSeries;
  chapters: Chapter[];
  isLoadingChapters: boolean;
  allSeriesPages: {
    _id: string;
    chapterTitle: string;
    chapterIndex: number;
    pages: ChapterPage[];
  }[];
  readingProgress?: ReadingProgressProps[];
  closeMenu?: () => void;
}) => {
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});
  const [openLockedModal, setOPenLockedModal] = useState(false);
  const [openLockedPosition, setOPenLockedPosition] = useState(0);

  const {
    series: seriesId,
    chapterId,
    lessonId,
    mode,
    page: pageIndex,
  } = useLocalSearchParams();

  const isActiveScene = (targetChapterId: string, targetLessonId: string) => {
    return pageIndex === targetLessonId && chapterId === targetChapterId;
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  useEffect(() => {
    if (chapterId && !expandedModules[chapterId as string]) {
      toggleModule(chapterId as string);
    }
  }, [chapterId]);

  const onSelectLesson = (
    chapterId: string,
    mode: 'play' | 'read',
    lessonId?: string,
    index?: string,
  ) => {
    if (mode === 'play') {
      handleParams([
        ['chapterId', chapterId],
        ['lessonId', lessonId || ''],
        ['page', index || ''],
      ]);
    } else {
      handleParams([
        ['chapterId', chapterId],
        ['page', lessonId || ''],
      ]);
    }
  };

  const currentBookProgress = useMemo(() => {
    if (!readingProgress && !seriesId) return null;
    return readingProgress?.find((r) => r.seriesId === seriesId);
  }, [readingProgress, seriesId]);

  const handleLockedClicked = (e: any) => {
    const node = findNodeHandle(e.currentTarget);

    if (!node) return;

    UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
      const bottom = pageY + height;

      setOPenLockedPosition(bottom);
      setOPenLockedModal(true);
    });
  };

  const seriesPages = useMemo(() => {
    if (!allSeriesPages) return;
    return addExtraPagesToChapters(allSeriesPages);
  }, [allSeriesPages, addExtraPagesToChapters]);

  const activityPages = useMemo(() => {
    if (!chapters) return;
    return addExtraPagesToActivity(chapters);
  }, [chapters, addExtraPagesToActivity]);

  const newActivityPages = useMemo(() => {
    if (!chapters) return;
    return formatActivityPages(chapters);
  }, [chapters, formatActivityPages]);

  // Get play progress for the current chapter
  const getPlayChapterProgress = (chapterId: string) => {
    return parseInt(
      retrieveFromLocalStorage(PLAY_LEARN_PROGRESS_KEY + chapterId) || '0',
    );
  };

  // Get play progress text for display
  const getProgressText = (
    mode: string | null,
    pages: ChapterPage[] | { index: string | number }[],
    currentProgress?: {
      currentPageIndex?: string | number;
      currentPLIndex?: string | number;
    },
  ) => {
    if (mode === 'play') {
      const progress = currentProgress?.currentPLIndex ?? 0;
      const total = 8;
      const current = Math.min(Number(progress || 0), total);
      return `${current}/${total}`;
    }

    // Read mode
    const total = pages.length;
    const current = currentProgress?.currentPageIndex ?? 0;
    return `${Number(current)}/${total}`;
  };

  return (
    <ReactNativeModal
      style={{ padding: 0, margin: 0 }}
      className="p-0 m-0"
      isVisible={open}
    >
      <ScrollView
        style={{ paddingTop: STAUS_BAR_HEIGHT + 20 }}
        className="bg-white flex-1 "
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between px-6 border-b border-b-[#D3D2D366] pb-5">
          <Text className="text-dark text-[20px] font-sansSemiBold">
            Curriculum
          </Text>
          <Pressable
            onPress={onClose}
            className="w-12 h-12 bg-[#C3E4C5] items-center justify-center rounded-full"
          >
            <ICONS.Close width={24} height={24} stroke={'#221D23'} />
          </Pressable>
        </View>
        <View className="flex-row items-center justify-between p-6 border-b border-b-[#D3D2D366]">
          <Text className="text-dark text-[20px] font-sansSemiBold">
            Series {series?.seriesId?.index} : {series?.seriesId?.title}
          </Text>
        </View>
        {mode === 'read' && (
          <>
            {filterAssignedChapters(allSeriesPages, currentBookProgress!)?.map(
              (module, index) => {
                const accessible = isPageAccessible(
                  currentBookProgress!,
                  module._id,
                  module.chapterIndex,
                  module?.pages?.length,
                );
                return (
                  <View className="" key={module._id}>
                    <Pressable
                      onPress={() => toggleModule(module._id)}
                      className="bg-[#DBEFDC80] py-5 px-3 flex-row items-center gap-3"
                    >
                      {expandedModules[module._id] ? (
                        <View className="rotate-180">
                          <ICONS.ChevronDown />
                        </View>
                      ) : (
                        <ICONS.ChevronDown
                          strokeWidth="1.5"
                          className="mt-2 shrink-0"
                        />
                      )}

                      <Text className="flex-1 text-dark text-[18px] font-sansMedium">
                        {module.chapterIndex < 10
                          ? '0' + module.chapterIndex
                          : module.chapterIndex}
                        : {module.chapterTitle}
                      </Text>
                      {!!module.pages?.length && (
                        <Text className="font-sansMedium text-[#474348]">
                          {module.pages?.length
                            ? getProgressText(
                                'read',
                                module.pages,
                                accessible ?? undefined,
                              )
                            : ''}
                        </Text>
                      )}
                    </Pressable>
                    {expandedModules[module._id] && (
                      <View>
                        {!!!module?.pages?.length && (
                          <View
                            className={twMerge(
                              'p-5 text-black flex items-center gap-4 cursor-pointer',
                            )}
                          >
                            <View
                              className={twMerge(
                                'rounded-full p-2',
                                'bg-[#EDF7ED]',
                              )}
                            >
                              <ICONS.LibraryBooks
                                width={16}
                                height={16}
                                stroke={'#3F9243'}
                              />
                            </View>
                            <Text> Coming Soon...</Text>
                          </View>
                        )}
                        {module?.pages?.map((p, i) => {
                          const accessible = isPageAccessible(
                            currentBookProgress!,
                            module._id,
                            p.index,
                            module?.pages?.length,
                          );
                          const status = getPageStatus(
                            module.pages,
                            accessible?.currentPageIndex,
                            p.index,
                          );
                          const finishedPage = status.isFinished;
                          const lockedPage = status.isLocked;
                          const accessiblePage = status.isAccessible;
                          const currentPage = status.isCurrent;
                          return (
                            <>
                              <Pressable
                                onPress={(e) => {
                                  if (!lockedPage) {
                                    onSelectLesson(
                                      module._id,
                                      'read',
                                      p.index.toString(),
                                    );
                                    onClose();
                                  } else {
                                    handleLockedClicked(e);
                                  }
                                }}
                                className={twMerge(
                                  ' py-5 px-3 flex-row items-center gap-3',
                                  isActiveScene(
                                    module._id,
                                    p.index.toString(),
                                  ) && 'bg-[#337535] text-white font-medium',
                                )}
                              >
                                <View
                                  className={twMerge(
                                    'w-10 h-10 rounded-full bg-[#1671D91A] items-center justify-center',
                                    lockedPage
                                      ? 'bg-[#D3D2D366]'
                                      : // : p.index === "mid"
                                        // ? "bg-[#DE21211A]"
                                        // : p.index === "end"
                                        // ? "bg-[#DF9B121A]"
                                        getPageName(p as ChapterPage)
                                            ?.toLowerCase()
                                            ?.includes('activity')
                                        ? 'bg-[#DE21211A]'
                                        : 'bg-[#1671D91A]',
                                    isActiveScene(
                                      module._id,
                                      p.index.toString(),
                                    )
                                      ? 'bg-[#FFFFFF1A]'
                                      : '',
                                  )}
                                >
                                  {getPageName(p as ChapterPage)
                                    ?.toLowerCase()
                                    ?.includes('activity') ? (
                                    <ICONS.QuestionMark
                                      width={16}
                                      height={16}
                                      stroke={
                                        lockedPage
                                          ? '#6C686C'
                                          : isActiveScene(
                                                module._id,
                                                p.index.toString(),
                                              )
                                            ? 'white'
                                            : '#DE2121'
                                      }
                                    />
                                  ) : (
                                    <ICONS.Clipboard
                                      width={16}
                                      height={16}
                                      stroke={
                                        lockedPage
                                          ? '#6C686C'
                                          : isActiveScene(
                                                module._id,
                                                p.index.toString(),
                                              )
                                            ? 'white'
                                            : '#1671D9'
                                      }
                                    />
                                  )}
                                </View>
                                <Text
                                  className={twMerge(
                                    'flex-1 text-dark text-[16px] font-sans',
                                    isActiveScene(
                                      module._id,
                                      p.index.toString(),
                                    ) && 'text-white',
                                  )}
                                >
                                  {getPageName(p as ChapterPage)}
                                </Text>
                                {/* <ICONS.PadLock/> */}
                                {accessiblePage && (
                                  <View className="flex items-center justify-end">
                                    <ICONS.CheckCircle
                                    // stroke={
                                    //   isActiveScene(
                                    //     module._id,
                                    //     p.index.toString(),
                                    //   )
                                    //     ? 'white'
                                    //     : '#099137'
                                    // }
                                    />
                                  </View>
                                )}
                                {lockedPage && (
                                  <View className="flex items-center justify-end">
                                    <ICONS.PadLock stroke="#6C686C" />
                                  </View>
                                )}
                              </Pressable>
                            </>
                          );
                        })}
                      </View>
                    )}
                  </View>
                );
              },
            )}
          </>
        )}
        {mode === 'play' && (
          <>
            {newActivityPages?.map((module, index) => {
              return (
                <View className="" key={module._id}>
                  <Pressable
                    onPress={() => toggleModule(module._id)}
                    className="bg-[#DBEFDC80] py-5 px-3 flex-row items-center gap-3"
                  >
                    {expandedModules[module._id] ? (
                      <View className="rotate-180">
                        <ICONS.ChevronDown />
                      </View>
                    ) : (
                      <ICONS.ChevronDown
                        strokeWidth="1.5"
                        className="mt-2 shrink-0"
                      />
                    )}

                    <Text className="flex-1 text-dark text-[18px] font-sansMedium">
                      {module.title}
                    </Text>
                    <Text className="font-sansMedium text-[#474348]">
                      {getPLProgress(currentBookProgress!, module._id!) || 0}/8
                    </Text>
                  </Pressable>
                  {expandedModules[module._id] && (
                    <View>
                      {module.lessons?.map((item, i) => {
                        const {
                          isAccessible: accessible,
                          currentPageIndex,
                          completedIndex,
                        } = isPlayandLearnPageAccessible(
                          currentBookProgress!,
                          item.index?.toString(),
                          module._id,
                        );

                        return (
                          <>
                            <Pressable
                              onPress={(e) => {
                                if (accessible) {
                                  onSelectLesson(
                                    module._id,
                                    'play',
                                    item._id,
                                    item.index.toString(),
                                  );
                                  onClose();
                                } else {
                                  handleLockedClicked(e);
                                }
                              }}
                              className={twMerge(
                                ' py-5 px-3 flex-row items-center gap-3',
                                isActiveScene(
                                  module._id,
                                  item.index.toString(),
                                ) && 'bg-[#337535] text-white font-medium',
                              )}
                            >
                              <View
                                className={twMerge(
                                  'w-10 h-10 rounded-full bg-[#1671D91A] items-center justify-center',
                                  !accessible
                                    ? 'bg-[#D3D2D366]'
                                    : item.index === 'mid'
                                      ? 'bg-[#DE21211A]'
                                      : item.index === 'end'
                                        ? 'bg-[#DF9B121A]'
                                        : item.index === 'learn'
                                          ? 'bg-[#1671D91A]'
                                          : item.index === 'scenario'
                                            ? 'bg-[#DE21211A]'
                                            : item.index === 'journal'
                                              ? 'bg-[#C821DE1A]'
                                              : item.index === 'rewards'
                                                ? 'bg-[#0991371A]'
                                                : item.index?.toString() === '5'
                                                  ? 'bg-[#0991371A]'
                                                  : 'bg-[#1671D91A]',
                                  isActiveScene(
                                    module._id,
                                    item.index.toString(),
                                  )
                                    ? 'bg-[#FFFFFF1A]'
                                    : '',
                                )}
                              >
                                {item.index === 'mid' ||
                                item.index === 'end' ? (
                                  <ICONS.QuestionMark
                                    width={16}
                                    height={16}
                                    stroke={
                                      !accessible
                                        ? '#6C686C'
                                        : isActiveScene(
                                              module._id,
                                              item.index.toString(),
                                            )
                                          ? 'white'
                                          : '#DE2121'
                                    }
                                  />
                                ) : item.index === 'scenario' ? (
                                  <ICONS.Bulb
                                    width={16}
                                    height={16}
                                    stroke={
                                      !accessible
                                        ? '#6C686C'
                                        : isActiveScene(
                                              module._id,
                                              item.index.toString(),
                                            )
                                          ? 'white'
                                          : '#DF9B12'
                                    }
                                  />
                                ) : item.index === 'journal' ? (
                                  <ICONS.Clipboard
                                    width={16}
                                    height={16}
                                    stroke={
                                      !accessible
                                        ? '#6C686C'
                                        : isActiveScene(
                                              module._id,
                                              item.index.toString(),
                                            )
                                          ? 'white'
                                          : '#DF9B12'
                                    }
                                  />
                                ) : item.index === 5 ? (
                                  <ICONS.CookieMan
                                    width={16}
                                    height={16}
                                    stroke={
                                      !accessible
                                        ? '#6C686C'
                                        : isActiveScene(
                                              module._id,
                                              item.index.toString(),
                                            )
                                          ? 'white'
                                          : '#1671D9'
                                    }
                                  />
                                ) : item.index === 'rewards' ? (
                                  <ICONS.Badges
                                    width={16}
                                    height={16}
                                    color={accessible ? '#265828' : '#6C686C'}
                                  />
                                ) : (
                                  <ICONS.Clipboard
                                    width={16}
                                    height={16}
                                    stroke={
                                      !accessible
                                        ? '#6C686C'
                                        : isActiveScene(
                                              module._id,
                                              item.index.toString(),
                                            )
                                          ? 'white'
                                          : '#1671D9'
                                    }
                                  />
                                )}
                              </View>
                              <Text
                                className={twMerge(
                                  'flex-1 text-dark text-[16px] font-sansMedium',
                                  isActiveScene(
                                    module._id,
                                    item.index.toString(),
                                  ) && ' text-white ',
                                )}
                              >
                                {item.title}
                              </Text>
                              {/* <ICONS.PadLock/> */}
                              {completedIndex >= currentPageIndex && (
                                <View className="flex items-center justify-end">
                                  <ICONS.CheckCircle
                                  // stroke={
                                  //   isActiveScene(
                                  //     module._id,
                                  //     p.index.toString(),
                                  //   )
                                  //     ? 'white'
                                  //     : '#099137'
                                  // }
                                  />
                                </View>
                              )}
                              {!accessible && (
                                <View className="flex items-center justify-end">
                                  <ICONS.PadLock stroke="#6C686C" />
                                </View>
                              )}
                            </Pressable>
                          </>
                        );
                      })}
                      {module.lessons?.length < 1 && (
                        <View
                          className={twMerge(
                            'p-5 text-black flex-row items-center gap-4 cursor-pointer',
                          )}
                        >
                          <View
                            className={twMerge(
                              'rounded-full p-2',
                              'bg-[#EDF7ED]',
                            )}
                          >
                            <ICONS.Message2Question
                              width={16}
                              height={16}
                              stroke={'#3F9243'}
                            />
                          </View>
                          <Text className="text-[16px] font-sansMedium text-dark">
                            Coming Soon...
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </>
        )}

        <ToolTip
          top={openLockedPosition}
          open={openLockedModal}
          onClose={() => setOPenLockedModal(false)}
        />
      </ScrollView>
    </ReactNativeModal>
  );
};

const ToolTip = ({
  top,
  open,
  onClose,
}: {
  top: number;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <ReactNativeModal
      onBackdropPress={onClose}
      isVisible={open}
      style={{ margin: 0, padding: 0 }}
    >
      <View style={{ top: top }} className="px-5 absolute w-full">
        <View className="items-center w-full  z-[100]">
          <Svg width={40} height={20} viewBox="0 0 40 20">
            <Path
              d="M0 20 L20 0 L40 20 Z"
              fill="white"
              stroke="#D3D2D3"
              strokeWidth={1}
            />
          </Svg>

          <View className="bg-white border border-[#D3D2D3] rounded-3xl w-full p-6">
            <View className=" flex-row items-start w-full gap-3">
              <ICONS.TooltipStar />
              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <Text className="text-[18px] font-sansMedium text-gray-800 mb-2">
                    Coming Soon
                  </Text>
                  <View className="border border-[#6C686C] rounded-[4px] py-0.5 px-1 flex-grow-0">
                    <Text className="text-[18px] font-sansSemiBold text-[#6C686C]">
                      UNLOCK
                    </Text>
                  </View>
                </View>

                <Text className="text-[16px] leading-[1.5] font-sans text-[#474348]">
                  <Text className="">
                    Finish your current lesson to open this one. Step by step,
                    you’re leveling up!
                  </Text>
                </Text>
              </View>
            </View>

            <Button
              text="LOCKED"
              className="w-full border-0 bg-[#D3D2D366] mt-4"
              textClassname="text-[#6C686C]"
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default CurriculumBar;

const getPageStatus = (
  pages: Array<{ index: string | number }>,
  currentPageIndex: string | number | undefined,
  targetPageIndex: string | number,
) => {
  const currentPos = pages.findIndex(
    (p) => p.index.toString() === (currentPageIndex?.toString() ?? '0'),
  );
  const targetPos = pages.findIndex(
    (p) => p.index.toString() === targetPageIndex.toString(),
  );
  const effectiveCurrentPos = currentPos === -1 ? -1 : currentPos;
  const end = effectiveCurrentPos === pages.length - 2;

  return {
    isFinished: targetPos < effectiveCurrentPos || end,
    isCurrent: targetPos === effectiveCurrentPos,
    isLocked: targetPos > effectiveCurrentPos && !end,
    isAccessible: targetPos <= effectiveCurrentPos,
  };
};
