import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import TopBackButton from "@/components/TopBackButton";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import Constants from "expo-constants";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

const AssignChildSuccess = () => {
  return (
    <View
      style={{
        paddingTop: Constants.statusBarHeight + 20,
      }}
      className="bg-[#193A1B] flex-1 px-6"
    >
      <TopBackButton />

      <ICONS.HalfCloud
        fill={"#FFFFFF80"}
        style={{
          position: "absolute",
          top: scaleHeight(104),
          left: scaleWidth(40),
        }}
        height={32}
        width={94}
      />
      <ICONS.HalfCloud
        fill={"#FFFFFF80"}
        style={{
          position: "absolute",
          top: scaleHeight(77),
          right: scaleWidth(29),
        }}
        height={32}
        width={94}
      />
      <Image
        source={IMAGES.GreenOverlay}
        className="w-full h-full absolute top-0 opacity-15"
      />
      <ScrollView contentContainerClassName="pb-10" showsVerticalScrollIndicator={false} className="flex-1">
        <View
          style={{
            paddingTop: scaleHeight(76),
          }}
        >
          <Text className="text-white text-[18px] font-sansSemiBold leading-[1.5]">
            🚀 Hooray! Series Successfully{"\n"}Assigned
          </Text>

          <View style={{ marginTop: scaleHeight(82) }} className="relative">
            <Image
              className="absolute top-0"
              style={{
                height: scaleHeight(126),
                width: scaleWidth(211),
                top: -scaleHeight(66),
                right: scaleWidth(20),
              }}
              resizeMode="contain"
              source={IMAGES.ChatboxLeft}
            />
            <Text
              style={{
                height: scaleHeight(126),
                width: scaleWidth(211),
                top: -scaleHeight(47),
                right: scaleWidth(12),
              }}
              className="text-[#265828] text-[14px] font-sansMedium text-center leading-[1.5] absolute"
            >
              Your selected series/{"\n"}chapter(s) have been {"\n"}successfully
              assigned to [X {"\n"}learner(s)]🚀
            </Text>
            <Image
              style={{ height: scaleHeight(182), width: scaleWidth(200) }}
              source={IMAGES.AILeft}
            />
          </View>
          <View className="bg-[#FAFDFF] rounded-[20px] border-b-4 border-[#FFD700] py-5 px-4">
            <Text className="text-dark font-sansSemiBold text-[16px]">
              Details Summary
            </Text>
            <View className="border border-[#FFD700] bg-[#FFF7CC] p-2 rounded-[8px] mt-5">
              <View>
                <View className="flex-row items-center gap-2">
                  <ICONS.BooksStacked />
                  <Text className="text-dar text-[16px] font-sansMedium">
                    Series
                  </Text>
                </View>
                <Text className="text-[16px] font-sans leading-[1.5] text-dark mt-2">
                  Think Sustainability Series One:{"\n"} Eco Heroes
                </Text>
                <View className="flex-row items-center gap-2 mt-2 pt-2 border-t border-t-[#FFEB80CC]">
                  <ICONS.BookOpenedSmall />
                  <Text className="text-dar text-[16px] font-sansMedium">
                    Chapters Assigned
                  </Text>
                </View>
                <Text className="text-[16px] font-sans leading-[1.5] text-dark mt-2">
                  All Chapters
                </Text>
              </View>
            </View>
            <View className="border border-[#004D99] bg-[#CCDBEB] p-2 rounded-[8px] mt-5">
              <View>
                <View className="flex-row items-center gap-2">
                  <ICONS.ChildCare fill={"#004D99"} />
                  <Text className="text-dar text-[16px] font-sansMedium">
                    Kids Assigned
                  </Text>
                </View>

                <View className="flex-row items-center gap-3 mt-3">
                  <Text className="text-[16px] font-sans leading-[1.5] text-dark">
                    Ella Smiling,
                  </Text>
                  <View className="bg-[#FFFFFF] rounded-full py-1 px-3">
                    <Text className="text-[16px] font-sans leading-[1.5] text-dark">
                      +16 Learners
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View className="border border-[#4CAF50] bg-[#DBEFDC] p-2 rounded-[8px] mt-5">
              <View>
                <View className="flex-row items-center gap-2">
                  <ICONS.Calender />
                  <Text className="text-dar text-[16px] font-sansMedium">
                    Date of Assignment
                  </Text>
                </View>
                <Text className="text-[16px] font-sans leading-[1.5] text-dark mt-2">
                  12th September, 2025
                </Text>
              </View>
            </View>
          </View>
          <Button className="mt-8" text="VIEW LEARNERS"/>
          <Button className="mt-4 bg-white" textClassname="text-dark" text="CLOSE"/>
        </View>
      </ScrollView>
    </View>
  );
};

export default AssignChildSuccess;
