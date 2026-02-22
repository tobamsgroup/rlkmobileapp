import { KidSeriesProgressCardInner } from '@/components/kid/KidSeriesProgressCard';
import TopBackButton from '@/components/TopBackButton';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const SeriesLearningList = () => {
  return (
    <View
      className="bg-[#DBEFDC] flex-1"
      style={{ paddingBottom: 10 }}
    >
      <View
        className="bg-[#265828] p-6"
        style={{
          paddingTop: STAUS_BAR_HEIGHT + 24,
        }}
      >
        <TopBackButton />
        <Text className="text-white text-[20px] font-sansSemiBold mt-4">
          Think Sustainability
        </Text>
      </View>
      <View className="p-7 flex-1 ">
        <FlatList
          data={[1, 2, 3, 4]}
          showsVerticalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          contentContainerClassName="p-6 bg-[#FCFCFC] rounded-[16px] gap-4"
          renderItem={({}) => <KidSeriesProgressCardInner full />}
        />
      </View>
    </View>
  );
};

export default SeriesLearningList;
