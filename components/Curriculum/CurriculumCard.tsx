import { CurriculumStats } from "@/actions/curriculum";
import { scaleHeight } from "@/utils/scale";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import ProgressBar from "../ProgressBar";
import { ensureHttps } from "@/utils";

const CurriculumCard = (props: CurriculumStats) => {
  return (
    <Pressable
      onPress={() => router.push(`/guardian/CurriculumSeriesOverview?title=${props.title}&id=${props?.id}`)}
      className="bg-white p-5 rounded-[20px] mb-6 z-20 flex-col items-start w-full relative"
    >
      <Image
        style={{ height: scaleHeight(144), width:'100%' }}
        source={{uri: ensureHttps(props?.image)}}
        className="rounded-[20px] w-full h-full mb-5"
        alt={props?.title + 'Ccard'}
      />

      <Text className="text-[18px] text-dark font-sansMedium mb-4">
        {props?.title}
      </Text>
      <Text className=" text-dark font-sansMedium mb-4">
        {props.assignedVolumes} of {props.totalVolumes} Series Assigned
      </Text>
      <View className="w-full">
        <ProgressBar
          height={12}
          percent={(props.assignedVolumes / props.totalVolumes) * 100}
        />
      </View>
    </Pressable>
  );
};

export default CurriculumCard;
