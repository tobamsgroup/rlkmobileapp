import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import { scaleHeight } from "@/utils/scale";
import React from "react";
import { Image, Text, View } from "react-native";
import Button from "../Button";
import { router } from "expo-router";

const SeriesOverviewCard = () => {
  return (
    <View className="bg-white p-5 rounded-[20px] flex-col items-start z-20">
      <Image
        style={{ height: scaleHeight(144) }}
        source={IMAGES.ProfileSelectAdult}
        className="rounded-[20px] w-full h-full mb-5"
      />
      <Text className="text-[18px] font-sansMedium mb-2">
        Series 1: Eco Heros
      </Text>
      <View className=" rounded-full py-1.5 flex-row items-center gap-2.5 mb-4">
        <ICONS.ChildCare fill={"#3F9243"} />
        <Text className="font-sansMedium text-[#474348]">0 Learners Assigned</Text>
      </View>
      <Button className="w-full mb-5" text="ASSIGN TO CHILD" />
      <Button
      onPress={() => router.push('/guardian/LearnersAssingnedToSeries')}
        className="w-full bg-white border-primary border-2"
        textClassname="text-primary"
        text="VIEW LEARNERS"
      />
    </View>
  );
};

export default SeriesOverviewCard;
