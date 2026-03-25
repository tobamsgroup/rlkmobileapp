import { fetchKidsCourses, getSeriesChapters } from '@/actions/curriculum';
import { ICONS } from '@/assets/icons';
import Container from '@/components/Container';
import ProgressBar from '@/components/ProgressBar';
import Skeleton from '@/components/Skeleton';
import TopBackButton from '@/components/TopBackButton';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

const SeriesOverview = () => {
  const params = useLocalSearchParams<{
    seriesId: string;
    kidId: string;
    title: string;
    book: string;
    index: string;
    progress: string;
    completed: string;
    total: string;
  }>();

  const { seriesId, kidId, title, book, index, progress, completed, total } = params;

  const { data: chapters, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['series-chapters', seriesId],
    queryFn: () => getSeriesChapters(seriesId),
    enabled: !!seriesId,
  });

  const { data: kidCourses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['kids-courses'],
    queryFn: fetchKidsCourses,
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

  const isLoading = isLoadingChapters || isLoadingCourses;

  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          {book} Series {index}: {title}
        </Text>

        <View className="mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="text-[#474348] font-sans mb-6">Learning Progress</Text>
          <View className="mt-3 flex-row items-center  gap-5">
            <View className='w-full flex-shrink'>

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

        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
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
        </View>
      </View>
    </Container>
  );
};

export default SeriesOverview;
