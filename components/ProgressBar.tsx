import { scaleHeight } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";

const ProgressBar = ({percent, height}:{percent:number, height?:number}) => {
  return (
    <View  className="w-full bg-[#D3D2D366] rounded-full relative">
      <LinearGradient
        style={{
          height: scaleHeight(height || 20),
          borderRadius: 100,
          width:`${Math.min(percent, 100) || 0}%`
        }}
        colors={["#FFD700", "#3F9243"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </View>
  );
};

export default ProgressBar;
