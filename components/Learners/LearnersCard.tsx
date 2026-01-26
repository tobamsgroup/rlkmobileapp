import { IMAGES } from "@/assets/images";
import { IGuardianKids } from "@/types";
import { ensureHttps } from "@/utils";
import { scaleWidth } from "@/utils/scale";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import Button from "../Button";
import Skeleton from "../Skeleton";

const LearnerCard = (props: IGuardianKids) => {
  return (
    <View className="bg-[#FAFDFF] rounded-[20px] p-4 items-center mb-4">
      <Image
        style={{ width: scaleWidth(81), height: scaleWidth(81) }}
        source={
          props?.picture
            ? { uri: ensureHttps(props?.picture) }
            : IMAGES.KidProfilePlaceholder
        }
        className="mb-2 border-[1.4px] border-[#FFD700] rounded-full"
      />
      <Text className="text-[#193A1B] font-sansMedium text-[16px] mb-5">
        {props?.name}
      </Text>
      {/* <View className="bg-white rounded-full px-3 py-2 mb-5 mt-3 border border-[#DBEFDC]">
        <Text className="font-sans text-[#474348]">{props?.} tracks</Text>
      </View> */}
      <Button
        onPress={() =>
          router.push(`/guardian/LearningProgress?id=${props?._id}`)
        }
        className="w-full"
        text="VIEW PROGRESS"
      />
      <Button
        className="bg-[#DBEFDC] border-b-0 mt-2 w-full uppercase"
        textClassname="text-[#337535] uppercase"
        text={`LOGIN AS ${props?.name?.split(" ")[0]}`}
      />
    </View>
  );
};
export const LearnerCardSkeleton = () => {
  return (
    <View className="bg-[#FAFDFF] rounded-[20px] p-4 items-center mb-4">
      <Skeleton
        style={{ width: scaleWidth(81), height: scaleWidth(81) }}
        className=" rounded-full mb-5"
      />
      <Skeleton className="w-2/3 rounded-full mb-5" />
      <Skeleton className="w-full h-[48px] rounded-full mb-2" />
      <Skeleton className="w-full h-[48px] rounded-full " />
    </View>
  );
};

export default LearnerCard;
