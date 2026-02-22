import { IMAGES } from "@/assets/images";
import { scaleHeight } from "@/utils/scale";
import React from "react";
import { Image, Text, View } from "react-native";
import Button from "../Button";
import ProgressBar from "../ProgressBar";
import { router } from "expo-router";

const KidLearningCard = () => {
  return (
    <View className="bg-white p-5 rounded-[20px] flex-col items-start z-20 border border-[#D3D2D366] mb-6">
      <Image
        style={{ height: scaleHeight(144) }}
        source={IMAGES.ProfileSelectKid}
        className="rounded-[20px] w-full h-full mb-5"
      />
      <View className=" rounded-full py-1.5 flex-row items-center gap-2.5 mb-4 bg-[#D3D2D333] px-3">
        <Text className="font-sans text-dark">Think Sustainability</Text>
      </View>
      <Text className="text-[18px] font-sansMedium mb-2">
        Series 1: Energy Explorers
      </Text>
      <View className="flex-row  mb-7 mt-5 justify-between items-center w-full ">
        <View className="w-[85%]">
          <ProgressBar percent={80} height={10} />
        </View>
        <Text>80%</Text>
      </View>

      <Button
      onPress={() => router.push}
        className="w-full bg-white border-primary border-2"
        textClassname="text-primary"
        text="CONTINUE"
      />
    </View>
  );
};

export default KidLearningCard;
