import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Container from "@/components/Container";
import TopBackButton from "@/components/TopBackButton";
import { scaleWidth } from "@/utils/scale";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const LearningOverview = () => {
  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          Learning Overview
        </Text>
        <Pressable className="bg-white rounded-[12px] p-3 flex-row items-center justify-between border border-[#C3E4C5]">
          <View className="flex-row items-center gap-3">
            <Image
              style={{ width: scaleWidth(36), height: scaleWidth(36) }}
              source={IMAGES.KidProfilePlaceholder}
              className="rounded-full"
            />
            <Text className="text-[16px] font-sansMedium text-dark">
              Alexander Bob
            </Text>
          </View>
          <ICONS.ChevronDown />
        </Pressable>

        <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5] mt-4">
          <Text className="text-[#474348] font-sans">Last Log In</Text>
          <View className="mt-3 flex-row items-center justify-between gap-5">
            <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
              12/02/24
            </Text>
            <View className="w-12 h-12 rounded-full bg-[#FFF7CC] items-center justify-center">
              <ICONS.Clock />
            </View>
          </View>
        </View>
        <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="text-[#474348] font-sans">Lessons Completed</Text>
          <View className="mt-3 flex-row items-center justify-between gap-5">
            <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
              5
            </Text>
            <View className="w-12 h-12 rounded-full bg-[#0991371A] items-center justify-center">
              <ICONS.Check stroke={"#099137"} />
            </View>
          </View>
        </View>
        <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="text-[#474348] font-sans">Quiz Passed</Text>
          <View className="mt-3 flex-row items-center justify-between gap-5">
            <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
              3/5
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
            <View className="w-12 h-12 rounded-full bg-[#C821DE1A] items-center justify-center">
              <ICONS.Clock stroke={"#004D99"} />
            </View>
          </View>
        </View>

        <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="flex-shrink-0 text-[18px] font-sansSemiBold text-dark">
            Assigned Courses
          </Text>
          <View className="p-3 border border-[#D3D2D3] rounded-[16px] mt-5">
            <View className="flex-row items-center gap-2 mb-4">
              <ICONS.Leaf />
              <Text className="font-sansMedium text-[16px] text-dark">
                Series 1: Eco Heroes
              </Text>
            </View>
            <Text className="font-sans text-[#474348] mb-4">
              Think Sustainability
            </Text>
            <View className="flex-row gap-3 flex-1">
              <View className=" flex-row items-center px-3 py-2 flex-1 border border-[#D3D2D3] rounded-full justify-between">
                <Text className="font-sansMedium text-[#265828]">50%</Text>
                <Text className="font-sans text-[12px]">Complete</Text>
              </View>
              <View className=" flex-row items-center px-3 py-2 border flex-1 border-[#D3D2D3] rounded-full justify-between">
                <Text className="font-sansMedium text-[#265828]">3/5</Text>
                <Text className="font-sans text-[12px]">Assignment</Text>
              </View>
            </View>
          </View>
        </View>

        <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
          <Text className="flex-shrink-0 text-[18px] font-sansSemiBold text-dark">
            Recent Activities
          </Text>
          <View className="p-3 flex-row rounded-[16px] mt-5 gap-2">
            <View className="w-11 h-11 rounded-full items-center justify-center bg-[#1671D91A]">
              <ICONS.Video />
            </View>
            <View className="gap-1 flex-1">
              <Text className="text-dark font-sansMedium text-[16px]">Chapter 1: Video Lesson</Text>
              <Text className="font-sans text-[#474348]">Leadership</Text>
            </View>
            <Text className="font-sans text-[#474348]">20 mins ago</Text>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default LearningOverview;
