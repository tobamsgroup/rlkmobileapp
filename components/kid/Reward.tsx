import { BadgeCard } from '@/app/(tabs)/badges';
import { ICONS } from '@/assets/icons';
import React from 'react';
import { Text, View } from 'react-native';
import Button from '../Button';
import { router } from 'expo-router';

const BADGES = [
  {
    _id: '698a7089ad8bfe6740fdd9c1',
    name: 'Earth’s Explorer',
    description: 'Sustainability',
    type: 'All Series',
    category: 'Sustainability',
    subcategory: 'Series 1',
    imageUrl:
      'https://res.cloudinary.com/dddiqpeib/image/upload/v1770188262/rl4kids/badges/earth%20explorer.png',
    createdAt: '2026-02-09T23:40:57.722Z',
    updatedAt: '2026-02-09T23:40:57.722Z',
  },
  {
    _id: '698a70abad8bfe6740fdd9c3',
    name: 'Guardian',
    description: 'Sustainability',
    type: 'All Series',
    category: 'Sustainability',
    subcategory: 'Series 2',
    imageUrl:
      'https://res.cloudinary.com/dddiqpeib/image/upload/v1770188262/rl4kids/badges/earth%20explorer.png',
    createdAt: '2026-02-09T23:41:31.675Z',
    updatedAt: '2026-02-09T23:41:31.675Z',
  },
  {
    _id: '698a70ddad8bfe6740fdd9c5',
    name: 'Resource Rookie',
    description: 'Sustainability',
    type: 'All Series',
    category: 'Sustainability',
    subcategory: 'Series 3',
    imageUrl:
      'https://res.cloudinary.com/dddiqpeib/image/upload/v1770188262/rl4kids/badges/earth%20explorer.png',
    createdAt: '2026-02-09T23:42:21.023Z',
    updatedAt: '2026-02-09T23:42:21.023Z',
  },
];

const Reward = () => {
  return (
    <View className="bg-[#193A1B] p-6">
      <View className="flex-row items-center gap-2">
        <ICONS.PartyPopper />
        <Text className="text-[20px] leading-[1.5] font-sansSemiBold text-white">
          Hooray! You finished the{'\n'}course!
        </Text>
      </View>
      <View className="border border-[#265828] my-4" />
      <Text className="text-white leading-[1.5] font-sansMedium text-[16px]">
        You did great completing all lessons! More badges, XP, and adventures
        await.
      </Text>
      <View className="border border-[#265828] my-4" />
      <View className="bg-[#FFFFFF26] rounded-[16px] py-6 px-4 mb-14">
        <View className="bg-white rounded-[12px] py-4 px-6">
          <Text className="text-dark text-[16px] font-sansMedium">
            Course Completion Status
          </Text>
          <View className="h-4 w-full bg-[#3F9243] rounded-full my-4" />
          <Text className="text-[20px] font-sansSemiBold text-dark">100%</Text>
        </View>
        <View className="border border-[#3F9243] my-4" />
        <View className="bg-white rounded-[12px] py-4 px-6">
          <Text className="text-dark text-[16px] font-sansMedium">
            Badges Unlocked
          </Text>
          <View className='flex-row flex-wrap gap-2 mt-4'>
            {BADGES?.map((b) => (
              <BadgeCard {...b} />
            ))}
          </View>
        </View>
      </View>
      <Button onPress={() => router.push('/(tabs)/mylearning')} className="gap-2.5">
        <Text className="text-[16px] font-sansSemiBold text-white">
          BACK TO DASHBOARD
        </Text>
        <ICONS.ChevronRight stroke={'white'} />
      </Button>
    </View>
  );
};

export default Reward;
