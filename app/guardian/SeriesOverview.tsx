import { fetchKidsCourses, getSeriesChapters } from '@/actions/curriculum';
import { getKidsOverview } from '@/actions/home';
import { fetchKidWorkbooks } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import Container from '@/components/Container';
import ProgressBar from '@/components/ProgressBar';
import Skeleton from '@/components/Skeleton';
import TopBackButton from '@/components/TopBackButton';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const SeriesOverview = () => {
  const params = useLocalSearchParams<{
    seriesId: string;
    kidId: string;
    title: string;
    book: string;
    bookId: string;
    index: string;
    progress: string;
    completed: string;
    total: string;
  }>();

  const [tab, setTab] = useState('All');
  const {
    seriesId,
    kidId,
    title,
    book,
    bookId,
    index,
    progress,
    completed,
    total,
  } = params;

  const { data: chapters, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['series-chapters', seriesId],
    queryFn: () => getSeriesChapters(seriesId),
    enabled: !!seriesId,
  });

  const { data: kidCourses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['kids-courses'],
    queryFn: fetchKidsCourses,
  });

  const { data } = useQuery({
    queryKey: ['learning-overview', kidId],
    queryFn: async () => {
      return await getKidsOverview(kidId as string);
    },
  });

  const chapterProgressMap = useMemo(() => {
    if (!kidCourses || !kidId) return {};
    const kidRecords = kidCourses.filter((c) => c.kidId._id === kidId);
    const allAssignedChapters = kidRecords.flatMap((c) => c.assignedChapters);
    return allAssignedChapters.reduce<Record<string, number>>((acc, ac) => {
      acc[ac.chapterId] = ac.progress;
      return acc;
    }, {});
  }, [kidCourses, kidId]);

  const { data: workbooks, isLoading: isLoadingWorkbooks } = useQuery({
    queryKey: ['kid-workbooks', bookId],
    queryFn: async () => {
      return await fetchKidWorkbooks(bookId, kidId);
    },
    enabled: !!bookId,
  });

  const filteredWorkbooks = useMemo(() => {
    const assignedWorkbooks =
      workbooks?.filter((w) => {
        return data?.assignedCourses?.find((as) => as.seriesId === w.seriesId);
      }) || [];

    const targetWorkbook = assignedWorkbooks?.find(
      (a) => a.seriesId === seriesId,
    );
    return targetWorkbook;
  }, [workbooks, data, seriesId]);

  const isLoading = isLoadingChapters || isLoadingCourses;

  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          {book} Series {index}: {title}
        </Text>

        <View className="mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="text-[#474348] font-sans mb-6">
            Learning Progress
          </Text>
          <View className="mt-3 flex-row items-center  gap-5">
            <View className="w-full flex-shrink">
              <ProgressBar height={8} percent={Number(progress) || 0} />
            </View>
            <Text className="flex-shrink-0 flex-1 text-[16px] font-sansMedium text-dark">
              {progress || 0}%
            </Text>
          </View>
        </View>

        <View className="mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="text-[#474348] font-sans">Assignments</Text>
          <View className="mt-3 flex-row items-center justify-between gap-5">
            <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
              {completed}/{total}
            </Text>
            <View className="w-12 h-12 rounded-full bg-[#1671D91A] items-center justify-center">
              <ICONS.Check stroke="#004D99" />
            </View>
          </View>
        </View>

        {/* <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          Chapters
        </Text>

        <View className="bg-white border-[0.5px] border-[#C3E4C5] rounded-[16px] p-4">
          {isLoading &&
            [1, 2, 3].map((i) => (
              <View key={i} className="border-b border-b-[#D3D2D366] pb-4 mb-4">
                <Skeleton className="w-2/3 rounded-full mb-2" />
                <Skeleton className="w-1/3 rounded-full mb-3" />
                <Skeleton className="w-full h-[8px] rounded-full" />
              </View>
            ))}

          {!isLoading && (!chapters || chapters.length === 0) && (
            <Text className="font-sans text-[#474348] text-center py-6">
              No chapters found
            </Text>
          )}

          {!isLoading &&
            chapters?.map((chapter, i) => {
              const chapterProgress = chapterProgressMap[chapter._id] ?? 0;
              const isLast = i + 1 === chapters.length;
              return (
                <View
                  key={chapter._id}
                  className={`pb-4 mb-4 ${!isLast ? 'border-b border-b-[#D3D2D366]' : ''}`}
                >
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-[16px] font-sansMedium text-dark">
                      Chapter {chapter.index}: {chapter.title}
                    </Text>
                  </View>
                  <Text className="text-[14px] font-sans text-[#474348] mb-3">
                    {chapter.lessons?.length ?? 0} Lesson
                    {chapter.lessons?.length !== 1 ? 's' : ''}
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <View className="flex-1">
                      <ProgressBar height={6} percent={chapterProgress} />
                    </View>
                    <Text className="text-[13px] font-sansMedium text-dark">
                      {chapterProgress}%
                    </Text>
                  </View>
                </View>
              );
            })}
        </View> */}
      </View>
      <View className="bg-[#FAFDFF]  py-4">
        <View className="flex-row items-center gap-2 pb-6 pt-2 px-6 mb-4 border-b border-b-[#D3D2D3]">
          {['All', 'Chapters', 'Workbooks']?.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              className={twMerge(
                'border flex-1 border-[#D3D2D3] rounded-[24px] py-2.5 items-center',
                t === tab && 'border-0 bg-[#3F9243]',
              )}
            >
              <Text
                className={twMerge(
                  'font-sans text-[#474348] ',
                  t === tab && 'text-white font-sansMedium',
                )}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="px-6">
          <Text className="text-[20px] font-sansSemiBold mb-6 mt-2">
            {tab === 'All'
              ? 'All Activities'
              : tab === 'Chapters'
                ? 'Chapters'
                : 'Workbooks'}
          </Text>
          {tab !== 'Workbooks' && (
            <View className="bg-white border-[0.5px] border-[#C3E4C5] rounded-[16px] p-4">
              {isLoading &&
                [1, 2, 3].map((i) => (
                  <View
                    key={i}
                    className="border-b border-b-[#D3D2D366] pb-4 mb-4"
                  >
                    <Skeleton className="w-2/3 rounded-full mb-2" />
                    <Skeleton className="w-1/3 rounded-full mb-3" />
                    <Skeleton className="w-full h-[8px] rounded-full" />
                  </View>
                ))}

              {!isLoading && (!chapters || chapters.length === 0) && (
                <Text className="font-sans text-[#474348] text-center py-6">
                  No chapters found
                </Text>
              )}

              {!isLoading &&
                chapters?.map((chapter, i) => {
                  const chapterProgress = chapterProgressMap[chapter._id] ?? 0;
                  const isLast = i + 1 === chapters.length;
                  return (
                    <View
                      key={chapter._id}
                      className={`pb-4 mb-4 ${!isLast ? 'border-b border-b-[#D3D2D366]' : ''}`}
                    >
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-[16px] font-sansMedium text-dark">
                          Chapter {chapter.index}: {chapter.title}
                        </Text>
                      </View>
                      <Text className="text-[14px] font-sans text-[#474348] mb-3">
                        {chapter.lessons?.length ?? 0} Lesson
                        {chapter.lessons?.length !== 1 ? 's' : ''}
                      </Text>
                      <View className="flex-row items-center gap-3">
                        <View className="flex-1">
                          <ProgressBar height={6} percent={chapterProgress} />
                        </View>
                        <Text className="text-[13px] font-sansMedium text-dark">
                          {chapterProgress}%
                        </Text>
                      </View>
                    </View>
                  );
                })}
            </View>
          )}
          {tab === 'Workbooks' && (
            <View>
              <View className="flex-row pb-4 border-b border-b-[#D3D2D366] items-center mb-6 gap-2">
                <Text className="font-sansMedium text-[#474348] ">
                  {filteredWorkbooks?.chapters?.length} Workbook Exercises
                </Text>
                <View className="w-1 h-1 rounded-full bg-[#918E91]" />
                <Text className="font-sansMedium text-[#474348] ">
                  {
                    filteredWorkbooks?.chapters.filter(
                      (chapter) => chapter.isAccessible,
                    ).length
                  }{' '}
                  Unlocked
                </Text>
              </View>
              {filteredWorkbooks?.chapters?.map((c) => (
                <Pressable
                  key={c.chapterId}
                  className=" bg-white border-b border-b-[#D3D2D366] p-6"
                >
                  <View className="flex-row items-center gap-2">
                    <View className="w-10 h-10 bg-[#F1F9F1] rounded-full items-center justify-center">
                      <Text className="text-[16px] text-[#3F9243] font-sansMedium">
                        {c?.chapterIndex}
                      </Text>
                    </View>
                    <Text className="font-sansMedium text-[16px] text-[#221D23]">
                      {c?.chapterName}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center mt-5">
                    <View
                      className={twMerge(
                        'px-4 py-3 rounded-full flex-row items-center gap-2',
                        c?.isCompleted
                          ? 'bg-[#0991371A]'
                          : c?.isStarted
                            ? 'bg-[#1671D91A]'
                            : c?.isAccessible
                              ? 'bg-[#D5B3001A]'
                              : 'bg-[#D3D2D366]',
                      )}
                    >
                      {!c?.isAccessible && (
                        <ICONS.Lock width={18} height={18} />
                      )}
                      <Text
                        className={twMerge(
                          'font-sansMedium',
                          c?.isCompleted
                            ? 'text-[#099137]'
                            : c?.isStarted
                              ? 'text-[#1671D9]'
                              : c?.isAccessible
                                ? 'text-[#D5B300]'
                                : 'text-[#6C686C]',
                        )}
                      >
                        {c?.isCompleted
                          ? 'Completed'
                          : c?.isStarted
                            ? 'In Progress'
                            : c?.isAccessible
                              ? 'Not Started'
                              : 'Locked'}
                      </Text>
                    </View>
                    <Pressable>
                      <Text className="font-sansMedium text-[#3F9243] text-[16px] underline">
                        View
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
      {tab === 'All' && (
        <View className="bg-[#FAFDFF] px-6 mt-6 py-6">
          <Text className="text-[20px] font-sansSemiBold mb-6 mt-2">
            Workbooks
          </Text>
          <View className="flex-row pb-4 border-b border-b-[#D3D2D366] items-center mb-6 gap-2">
            <Text className="font-sansMedium text-[#474348] ">
              {filteredWorkbooks?.chapters?.length} Workbook Exercises
            </Text>
            <View className="w-1 h-1 rounded-full bg-[#918E91]" />
            <Text className="font-sansMedium text-[#474348] ">
              {
                filteredWorkbooks?.chapters.filter(
                  (chapter) => chapter.isAccessible,
                ).length
              }{' '}
              Unlocked
            </Text>
          </View>
          {filteredWorkbooks?.chapters?.map((c) => (
            <Pressable
              key={c.chapterId}
              className=" bg-white border-b border-b-[#D3D2D366] p-6"
            >
              <View className="flex-row items-center gap-2">
                <View className="w-10 h-10 bg-[#F1F9F1] rounded-full items-center justify-center">
                  <Text className="text-[16px] text-[#3F9243] font-sansMedium">
                    {c?.chapterIndex}
                  </Text>
                </View>
                <Text className="font-sansMedium text-[16px] text-[#221D23]">
                  {c?.chapterName}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-5">
                <View
                  className={twMerge(
                    'px-4 py-3 rounded-full flex-row items-center gap-2',
                    c?.isCompleted
                      ? 'bg-[#0991371A]'
                      : c?.isStarted
                        ? 'bg-[#1671D91A]'
                        : c?.isAccessible
                          ? 'bg-[#D5B3001A]'
                          : 'bg-[#D3D2D366]',
                  )}
                >
                  {!c?.isAccessible && <ICONS.Lock width={18} height={18} />}
                  <Text
                    className={twMerge(
                      'font-sansMedium',
                      c?.isCompleted
                        ? 'text-[#099137]'
                        : c?.isStarted
                          ? 'text-[#1671D9]'
                          : c?.isAccessible
                            ? 'text-[#D5B300]'
                            : 'text-[#6C686C]',
                    )}
                  >
                    {c?.isCompleted
                      ? 'Completed'
                      : c?.isStarted
                        ? 'In Progress'
                        : c?.isAccessible
                          ? 'Not Started'
                          : 'Locked'}
                  </Text>
                </View>
                <Pressable>
                  <Text className="font-sansMedium text-[#3F9243] text-[16px] underline">
                    View
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Container>
  );
};

export default SeriesOverview;
