import { fetchKidLearning } from '@/actions/kid';
import { KidSeriesProgressCardInner } from '@/components/kid/KidSeriesProgressCard';
import TopBackButton from '@/components/TopBackButton';
import { getSeriesProgress } from '@/utils/kid';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';

const SeriesLearningList = () => {
  const { id } = useLocalSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: ['kid-learning'],
    queryFn: async () => {
      return await fetchKidLearning();
    },
  });

  const series = useMemo(() => {
    if (!data || !id) return;

    return data?.find((d) => d._id === id);
  }, [data, id]);
  return (
    <View className="bg-[#DBEFDC] flex-1" style={{ paddingBottom: 10 }}>
      <View
        className="bg-[#265828] p-6"
        style={{
          paddingTop: STAUS_BAR_HEIGHT + 24,
        }}
      >
        <TopBackButton />
        <Text className="text-white text-[20px] font-sansSemiBold mt-4">
          {series?.bookId?.title}
        </Text>
      </View>
      <View className="p-7 flex-1 ">
        <FlatList
          data={series?.assignedSeries || []}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerClassName="p-6 bg-[#FCFCFC] rounded-[16px] gap-4"
          renderItem={({ item }) => (
            <KidSeriesProgressCardInner
              series={item}
              chapterId={
                series?.assignedChapters?.filter(
                  (i) => i.chapterId?.seriesId === item?.seriesId._id,
                )?.[0]?.chapterId?._id!
              }
              progress={getSeriesProgress(
                item.seriesId._id,
                series?.assignedChapters! || [],
              )}
              full
            />
          )}
        />
      </View>
    </View>
  );
};

export default SeriesLearningList;
