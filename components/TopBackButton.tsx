import { ICONS } from "@/assets/icons";
import { scaleWidth } from "@/utils/scale";
import { router } from "expo-router";
import React from "react";
import { Pressable } from "react-native";

const TopBackButton = () => {
  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        width: scaleWidth(32),
        height: scaleWidth(32),
      }}
      className="rounded-full bg-white items-center justify-center z-10"
    >
      <ICONS.ChevronLeft width={scaleWidth(14)} height={scaleWidth(14)} />
    </Pressable>
  );
};

export default TopBackButton;
