import { ICONS } from '@/assets/icons';
import { VolumeStat } from '@/types';
import { ensureHttps } from '@/utils';
import { scaleHeight } from '@/utils/scale';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import Button from '../Button';
import Skeleton from '../Skeleton';

const SeriesOverviewCard = (
  props: VolumeStat & { canAssign: boolean; onOpenLock: () => void },
) => {
  return (
    <View className="bg-white p-5 rounded-[20px] flex-col items-start z-20 mb-6">
      <Image
        style={{ height: scaleHeight(144) }}
        source={{ uri: ensureHttps(props?.image) }}
        className="rounded-[20px] w-full h-full mb-5"
      />
      <Text className="text-[18px] font-sansMedium mb-2">
        Series {props?.index}: {props.title}
      </Text>
      <View className=" rounded-full py-1.5 flex-row items-end gap-2.5 mb-4">
        <ICONS.User3/>
        <Text className="font-sansMedium text-[#474348]">
          {props?.assignedCount} Learners
        </Text>
      </View>
      <Button
        onPress={() => {
          if (props?.canAssign) {
            router.push(
              `/guardian/AssignChild?title=${props?.book?.title}&id=${props?.seriesId}&seriesTitle=${props?.title}&index=${props?.index}`,
            );
          } else {
            props?.onOpenLock();
          }
        }}
          className="w-full bg-white border-[#3F9243] border mb-5"
        textClassname="text-[#3F9243]"
        text="ASSIGN TO CHILD"
      />
      <Button
        onPress={() =>
          router.push(
            `/guardian/LearnersAssingnedToSeries?index=${props?.index}&id=${props?.seriesId}&seriesTitle=${props?.title}&title=${props?.book?.title} Series ${props?.index}`,
          )
        }
        className="w-full bg-white border-[#3F9243] border"
        textClassname="text-[#3F9243]"
        text="VIEW LEARNERS"
      />
    </View>
  );
};

export const SeriesOverviewCardSkeleton = () => {
  return (
    <View className="bg-white p-5 rounded-[20px] flex-col items-start z-20 mb-6">
      <Skeleton
        style={{ height: scaleHeight(144) }}
        className="rounded-[20px] w-full h-full mb-5"
      />
      <Skeleton className="w-2/3 mb-2" />
      <Skeleton className="w-1/2 mb-4" />
      <Skeleton className="w-full h-[48px] rounded-full mb-5" />
      <Skeleton className="w-full h-[48px] rounded-full" />
    </View>
  );
};

export default SeriesOverviewCard;
