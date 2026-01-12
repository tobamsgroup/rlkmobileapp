import { scaleHeight, scaleWidth, SCREEN_WIDTH } from "@/utils/scale";
import React from "react";
import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

const Stepper = ({
  totalStep,
  currentStep,
}: {
  totalStep: number;
  currentStep: number;
}) => {
  return (
    <View className="w-full">
      <View className="flex-row w-full gap-[12px]">
        {Array.from({ length: totalStep }).map((_, index) => (
          <Step
            index={index + 1}
            key={index}
            currentStep={currentStep}
            totalStep={totalStep}
          />
        ))}
      </View>
    </View>
  );
};

const Step = ({
  index,
  currentStep,
  totalStep,
}: {
  index: number;
  currentStep: number;
  totalStep: number;
}) => {
  return (
    <View
      style={{ height: scaleHeight(12) }}
      className={twMerge(
        " rounded-full relative flex-1",
        index <= currentStep ? "bg-primary" : "bg-[#D3D2D3]"
      )}
    >
      {index === currentStep && (
        <View
          className="bg-[#DBEFDC] absolute rounded-full items-center justify-center"
          style={{
            height: scaleWidth(32),
            width: scaleWidth(32),
            top: -scaleWidth(10),
            left: (SCREEN_WIDTH / totalStep) * 0.5 - 32,
          }}
        >
          <Text className="text-[16px] font-sansSemiBold text-[#0F2310] ">
            {index}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Stepper;
