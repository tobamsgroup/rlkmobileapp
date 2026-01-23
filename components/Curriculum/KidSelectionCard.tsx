import { IMAGES } from "@/assets/images";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import Checkbox from "../Checkbox";

const KidSelectionCard = ({
  selected = false,
  onSelect,
}: {
  selected?: boolean;
  onSelect?: () => void;
}) => {
  return (
    <Pressable
      onPress={() => onSelect?.()}
      className={twMerge(
        "bg-[#FAFDFF] pt-2 pb-6 px-4 rounded-[16px] items-center w-[49%]",
        selected && "border-2 border-[#3F9243] bg-[#C3E4C5]",
      )}
    >
      <View className="self-end">
        <Checkbox
          checkColor="white"
          backgroundColor="#3F9243"
          borderColor="#3F9243"
          check={selected}
          onCheck={() => onSelect?.()}
        />
      </View>
      <Image
        style={{ width: scaleWidth(88), height: scaleHeight(88) }}
        source={IMAGES.KidProfilePlaceholder}
        className="rounded-full"
      />
      <Text className="text-[16px] text-dark font-sansMedium mt-2.5">
        Alexander Bob
      </Text>
    </Pressable>
  );
};

export default KidSelectionCard;
