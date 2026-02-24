import { fetchKidLearning } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import { KidLearningCardSkeleton } from '@/components/kid/KidLearningCard';
import KidSeriesProgressCard from '@/components/kid/KidSeriesProgressCard';
import Select from '@/components/Select';
import { KidLearningOverview } from '@/types';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const MyLearning = () => {
  const [search, setSearch] = useState('All Categories');
  const [filteredSeries, setFilteredSeries] = useState<KidLearningOverview[]>(
    [],
  );
  const { data, isLoading } = useQuery({
    queryKey: ['kid-learning'],
    queryFn: async () => {
      return await fetchKidLearning();
    },
  });

  useEffect(() => {
    if (!data) {
      setFilteredSeries([]);
      return;
    }

    if (!search || search === 'All Categories') {
      setFilteredSeries(data);
    } else {
      const term = search.trim().toLowerCase();
      const filtered = data.filter((entry) => {
        const bookTitleMatches = entry.bookId.title
          .toLowerCase()
          .includes(term);
        const seriesTitleMatches = entry.assignedSeries.some((series) =>
          series.seriesId.title.toLowerCase().includes(term),
        );
        return bookTitleMatches || seriesTitleMatches;
      });
      setFilteredSeries(filtered);
    }
  }, [search, data]);

  return (
    <View className="bg-[#DBEFDC] flex-1" style={{}}>
      <View
        className="bg-[#265828] p-6"
        style={{
          paddingTop: STAUS_BAR_HEIGHT + 24,
        }}
      >
        <Text className="text-white text-[18px] font-sansSemiBold mb-10">
          My Learning
        </Text>
        <Select
          value={search}
          onChange={(text) => setSearch(text)}
          containerClassname="bg-white"
          options={[
            'All Categories',
            'Think Sustainability',
            'Think Entrepreneurship',
            'Think Finance',
            'Think Strategy',
            'Think Leadership',
          ]}
        />
      </View>
      {isLoading && (
        <View className="p-6">
          <KidLearningCardSkeleton />
          <KidLearningCardSkeleton />
        </View>
      )}
      {!isLoading && (
        <FlatList
          ListEmptyComponent={() => (
            <View className=" h-[40vh] items-center justify-center">
              <ICONS.CircledClipboard />
              <Text className="font-sansSemiBold text-[#265828] text-[18px] text-center my-4">
                No Courses Yet
              </Text>
              <Text className="font-sans text-[#474348] leading-[1.5] text-center px-10">
                Hang tight! Your parent/teacher will assign some fun courses for
                you soon.
              </Text>
            </View>
          )}
          data={filteredSeries}
          keyExtractor={(_, index) => index.toString()}
          contentContainerClassName="p-6"
          renderItem={({ item }) => <KidSeriesProgressCard item={item} />}
        />
      )}
    </View>
  );
};

export default MyLearning;
