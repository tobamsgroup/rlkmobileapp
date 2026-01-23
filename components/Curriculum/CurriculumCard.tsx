import { IMAGES } from "@/assets/images";
import { scaleHeight } from "@/utils/scale";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import ProgressBar from "../ProgressBar";

const CurriculumCard = () => {
  return (
    <Pressable
      onPress={() => router.push("/guardian/AssignChildSuccess")}
      className="bg-white p-5 rounded-[20px] mb-6 z-20 flex-col items-start w-full relative"
    >
      <Image
        style={{ height: scaleHeight(144) }}
        source={IMAGES.ProfileSelectAdult}
        className="rounded-[20px] w-full h-full mb-5"
      />

      <Text className="text-[18px] text-dark font-sansMedium mb-4">
        Think Sustainability
      </Text>
      <Text className=" text-dark font-sansMedium mb-4">
        1 of 12 Series Assigned
      </Text>
      <View className="w-full">
        <ProgressBar height={12} percent={30} />
      </View>
    </Pressable>
  );
};

export default CurriculumCard;
