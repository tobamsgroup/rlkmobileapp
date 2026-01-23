import { ICONS } from "@/assets/icons";
import React from "react";
import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";

const Checkbox = ({
  rounded,
  check,
  onCheck,
  backgroundColor = "transparent",
  checkColor = "#221D23",
  borderColor = "#918E91",
}: {
  rounded?: boolean;
  check?: boolean;
  onCheck?: () => void;
  backgroundColor?: string;
  checkColor?: string;
  borderColor?: string;
}) => {
  return (
    <Pressable
      onPress={() => onCheck?.()}
      style={{
        backgroundColor: check && !rounded ? backgroundColor : "",
        borderColor: borderColor,
      }}
      className={twMerge("w-8 h-8 rounded-[8px] border items-center justify-center", rounded && `rounded-full border-[2.6px] border-[${borderColor}]`)}
    >
      {check && !rounded && <ICONS.Check color={checkColor} />}
      {check && rounded && (
        <View style={{ backgroundColor }} className="w-4 h-4 rounded-full" />
      )}
    </Pressable>
  );
};

export default Checkbox;
