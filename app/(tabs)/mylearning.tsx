import KidSeriesProgressCard from '@/components/kid/KidSeriesProgressCard';
import Select from '@/components/Select';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const MyLearning = () => {
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
      <FlatList
        data={[1, 2, 3, 4]}
        keyExtractor={(_, index) => index.toString()}
        contentContainerClassName="p-6"
        renderItem={({}) => (
          <KidSeriesProgressCard
            title="Series 1: Eco Heroes"
            series="Think Sustainability"
            progress={100}
            status="completed"
            iconType="read"
          />
        )}
      />
    </View>
  );
};

export default MyLearning;
