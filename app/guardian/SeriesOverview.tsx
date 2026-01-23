import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Container from "@/components/Container";
import ProgressBar from "@/components/ProgressBar";
import TopBackButton from "@/components/TopBackButton";
import { scaleHeight } from "@/utils/scale";
import React from "react";
import { Image, Text, View } from "react-native";

const SeriesOverview = () => {
  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          Think Sustainability Series 1 : Eco Heroes
        </Text>
        <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="text-[#474348] font-sans mb-6">
            Learning Progress
          </Text>
          <View className="mt-3 flex-row items-center justify-between gap-5">
            <ProgressBar height={8} percent={80} />
            <Text className="flex-shrink-0 text-[16px] font-sansMedium text-dark">
              80%
            </Text>
          </View>
        </View>
        <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="text-[#474348] font-sans">Average Score</Text>
          <View className="mt-3 flex-row items-center justify-between gap-5">
            <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
              50%
            </Text>
            <View className="w-12 h-12 rounded-full bg-[#1671D91A] items-center justify-center">
              <ICONS.Check stroke={"#004D99"} />
            </View>
          </View>
        </View>
        <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="text-[#474348] font-sans">Total Time Spent</Text>
          <View className="mt-3 flex-row items-center justify-between gap-5">
            <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
              68%
            </Text>
            <View className="w-12 h-12 rounded-full bg-[#FFF7CC] items-center justify-center">
              <ICONS.Clock stroke={"#004D99"} />
            </View>
          </View>
        </View>
        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          All Assignments
        </Text>
        <View className="bg-white border-[0.5px] border-[#C3E4C5] rounded-[16px] p-4">
          <View className="flex-row gap-2.5 border-b border-b-[#D3D2D366] pb-2.5">
            <Image
              style={{ height: scaleHeight(47), width: scaleHeight(51) }}
              source={IMAGES.ProfileSelectAdult}
              className="rounded-[7px]"
            />
            <View>
              <Text className="text-[18px] font-sansMedium text-dark mb-2">
                Money Smart: Save the Day
              </Text>
              <Text className="text-[16px] font-sans text-[#221D23]">
                Chapter 1
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center pt-3">
            <Text className="font-sans text-dark text-[16px]">Mid-Chapter Quiz</Text>
            <Text className="text-[18px] text-dark font-sansMedium">52/100</Text>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default SeriesOverview;
