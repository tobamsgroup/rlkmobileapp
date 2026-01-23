import React from "react";
import { Pressable, Text, View } from "react-native";
import Checkbox from "./Checkbox";

const CheckDropdown = ({
  options,
  onSelect,
  selected
}: {
  options: string[];
  onSelect?: (option: string) => void;
  selected:string
}) => {
  return (
    <View className="absolute top-[50px] bg-white w-full p-4 rounded-[8px] z-30">
      {options?.map((option) => (
        <Pressable onPress={() => onSelect?.(option)} key={option} className="flex-row items-center gap-3 mb-4">
          <Checkbox check={selected === option} onCheck={() => onSelect?.(option)}  />
          <Text className="font-sans text-[16px] text-dark">{option}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default CheckDropdown;
