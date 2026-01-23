import { IMAGES } from "@/assets/images";
import { scaleWidth } from "@/utils/scale";
import React from "react";
import { Image, Text, View } from "react-native";
import Button from "../Button";
import { router } from "expo-router";

const LearnerCard = () => {
  return (
    <View className="bg-[#FAFDFF] rounded-[20px] p-4 items-center mb-4">
      <Image
        style={{ width: scaleWidth(81), height: scaleWidth(81) }}
        source={IMAGES.KidProfilePlaceholder}
        className="mb-2"
      />
      <Text className="text-[#193A1B] font-sansMedium text-[16px]">
        Amara Shine
      </Text>
      <View className="bg-white rounded-full px-3 py-2 mb-5 mt-3 border border-[#DBEFDC]">
        <Text className="font-sans text-[#474348]">3 tracks</Text>
      </View>
      <Button onPress={() => router.push('/guardian/SeriesOverview')} className="w-full" text="VIEW PROGRESS" />
      <Button
        className="bg-[#DBEFDC] border-b-0 mt-2 w-full"
        textClassname="text-[#337535]"
        text="LOGIN AS HANNAH"
      />
    </View>
  );
};

export default LearnerCard;
