import { scaleHeight, scaleWidth, SCREEN_WIDTH } from "@/utils/scale";
import React from "react";
import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

const Stepper = ({
  totalStep,
  currentStep,
  trackColor,
  railColor,
  textColor,
  thumbColor,
}: {
  totalStep: number;
  currentStep: number;
  trackColor?: string;
  railColor?: string;
  thumbColor?: string;
  textColor?: string;
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
            thumbColor={thumbColor}
            railColor={railColor}
            trackColor={trackColor}
            textColor={textColor}
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
  trackColor,
  railColor,
  textColor,
  thumbColor,
}: {
  index: number;
  currentStep: number;
  totalStep: number;
  trackColor?: string;
  railColor?: string;
  thumbColor?: string;
  textColor?: string;
}) => {
  return (
    <View
      style={{
        height: scaleHeight(12),
        backgroundColor:
          index <= currentStep
            ? railColor || "#337535"
            : trackColor || "#D3D2D3",
      }}
      className={twMerge(
        " rounded-full relative flex-1"
      )}
    >
      {index === currentStep && (
        <View
          className={twMerge(
            " absolute rounded-full items-center justify-center",
          )}
          style={{
            height: scaleWidth(32),
            width: scaleWidth(32),
            top: -scaleWidth(10),
            left: (SCREEN_WIDTH / totalStep) * 0.5 - 32,
            backgroundColor: thumbColor || "#DBEFDC",
          }}
        >
          <Text
            style={{
              color: textColor || "#0F2310",
            }}
            className="text-[16px] font-sansSemiBold text-[#0F2310] "
          >
            {index}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Stepper;
