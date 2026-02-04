import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import TopBackButton from "@/components/TopBackButton";
import { formatWithOrdinal } from "@/utils";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import Constants from "expo-constants";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Image, ScrollView, Text, View } from "react-native";

const AssignChildSuccess = () => {
  const params = useLocalSearchParams();
  const { selectedKids, selectedModule } = useMemo(() => {
    let selectedKids: { id: string; name: string }[] = [];
    let selectedModule: { id: string; title: string; index: number }[] = [];
    if (params) {
      selectedKids = JSON.parse(params?.selectedKids as string);
      selectedModule = JSON.parse(params?.selectedModule as string);
    }
    return { selectedKids, selectedModule };
  }, [params]);

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
      <ScrollView
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
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
              assigned to [{selectedKids?.length} {"\n"}learner{" "}
              {selectedKids?.length > 1 ? "s" : ""}]🚀
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
                  {params?.title} :{"\n"} {params?.seriesTitle}
                </Text>
                <View className="flex-row items-center gap-2 mt-2 pt-2 border-t border-t-[#FFEB80CC]">
                  <ICONS.BookOpenedSmall />
                  <Text className="text-dar text-[16px] font-sansMedium">
                    Chapters Assigned
                  </Text>
                </View>
                <View className="flex-row items-center gap-3 mt-3">
                  <Text className="text-[16px] font-sans leading-[1.5] text-dark">
                    {selectedModule?.length < 1
                      ? "All Chapters"
                      : `Chapter ${selectedModule?.[0]?.index} ${selectedModule?.length > 1 ? "," : ""}`}
                  </Text>
                  {selectedModule?.length > 1 && (
                    <View className="bg-[#FFFFFF] rounded-full py-1 px-3">
                      <Text className="text-[16px] font-sans leading-[1.5] text-dark">
                        +{selectedModule?.length - 1} Others
                      </Text>
                    </View>
                  )}
                </View>
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
                    {selectedKids?.[0]?.name}{" "}
                    {selectedModule?.length > 1 ? "," : ""}
                  </Text>
                  {selectedKids?.length > 1 && (
                    <View className="bg-[#FFFFFF] rounded-full py-1 px-3">
                      <Text className="text-[16px] font-sans leading-[1.5] text-dark">
                        +{selectedKids?.length - 1} Others
                      </Text>
                    </View>
                  )}
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
                  {formatWithOrdinal(new Date())}
                </Text>
              </View>
            </View>
          </View>
          <Button onPress={() => router.push('/(tabs)/learners')} className="mt-8" text="VIEW LEARNERS" />
          <Button
          onPress={() => router.push('/(tabs)/curriculum')}
            className="mt-4 bg-white"
            textClassname="text-dark"
            text="CLOSE"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AssignChildSuccess;
