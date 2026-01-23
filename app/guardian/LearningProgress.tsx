import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import ProgressBar from "@/components/ProgressBar";
import TopBackButton from "@/components/TopBackButton";
import { scaleWidth } from "@/utils/scale";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

const LearningProgress = () => {
  const pieData = [
    { value: 40, color: "#D5B300" },
    { value: 20, color: "#4CAF50" },
  ];
  const data = [
    { value: 250, label: "Mon" },
    { value: 30, label: "Tue" },
    { value: 26, label: "Wed" },
    { value: 140, label: "Thu" },
    { value: 40, label: "Fri" },
    { value: 40, label: "Sat" },
  ];
  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          Learning Progress
        </Text>

        <Pressable className="bg-white rounded-[12px] p-4 flex-row items-center justify-between">
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

        <Pressable className="bg-white rounded-[12px] p-4 flex-row items-center justify-between mt-5">
          <Text className="text-[16px] font-sansMedium text-dark">
            Export Report
          </Text>
          <ICONS.Export />
        </Pressable>

        <View className="bg-white rounded-[20px] p-5 mt-5">
          <View className="flex-row justify-between mb-5">
            <Image
              style={{ width: scaleWidth(79), height: scaleWidth(79) }}
              source={IMAGES.KidProfilePlaceholder}
              className="rounded-full"
            />
            <Text className="underline text-[#3F9243] font-sansMedium">
              EDIT PROFILE
            </Text>
          </View>
          <Text className="font-sansSemiBold text-[18px] text-[#393939] mb-2">
            Alexandar Bob
          </Text>
          <Text className="text-[16px] text-[#474348] font-sans mb-2">
            @alexbob1
          </Text>
          <Text className="text-[16px] text-[#474348] font-sans mb-2">
            12 Years
          </Text>
          <View className="bg-[#FFF7CCB2] p-3 flex-row item justify-between items-center mt-4">
            <View className="flex-row items-center gap-2">
              <Image
                style={{ width: scaleWidth(28), height: scaleWidth(28) }}
                source={IMAGES.BadgeTrophy}
                className="rounded-full"
              />
              <Text className="font-sansMedium text-dark">Learner</Text>
            </View>
            <Text className="underline text-[#806C00] font-sansMedium">
              VIEW ALL
            </Text>
          </View>
          <Button className="mt-5" text="LOG IN AS USER" />
          <Button
            className="mt-5 border-2 border-[#D3D2D3] bg-white"
            textClassname="text-dark"
            text="VIEW COURSES"
          />
        </View>
        <View className="bg-white rounded-[20px] p-5 mt-5 ">
          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">
              Chapter Completion Rate
            </Text>
            <View className="mt-3 flex-row items-center  gap-5">
              <ProgressBar percent={50} />
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                80%
              </Text>
            </View>
          </View>
          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">
              Total Missions Completed
            </Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                42
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#0991371A] items-center justify-center">
                <ICONS.Check />
              </View>
            </View>
          </View>
          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">Learning Streaks</Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                7 Days in a Row!
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#FFF7CC] items-center justify-center">
                <ICONS.Fire />
              </View>
            </View>
          </View>
        </View>

        {/* performance data */}
        <View className="bg-white rounded-[20px] p-5 mt-5 ">
          <Text className="text-[18px] font-sansSemiBold text-dark mb-5">
            Performance Data
          </Text>

          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">Avg. Quiz Score</Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                80%
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#0991371A] items-center justify-center">
                <ICONS.Check />
              </View>
            </View>
          </View>

          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">Journal Entry</Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                Excellent
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#C821DE1A] items-center justify-center">
                <ICONS.Notebook />
              </View>
            </View>
          </View>

          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">Mission Complexity</Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                Difficult
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#FFF7CC] items-center justify-center">
                <ICONS.Puzzle />
              </View>
            </View>
          </View>
          {/* audio vs text */}
          <View className="bg-white rounded-[20px] p-5 mt-5  border border-[#D3D2D366]">
            <Text className="text-dark font-sansMedium text-[18px]">
              Audio vs. Text Usage {"\n"}(Read Aloud)
            </Text>
            <View className="mt-5 border border-[#D3D2D366] rounded-[24px] py-3 px-5 flex-row items-center gap-6">
              <PieChart
                donut
                textColor="black"
                radius={60}
                textSize={20}
                data={pieData}
                innerRadius={50}
              />
              <View>
                <View className="flex-row gap-2.5 items-center mb-2">
                  <View className="w-3 h-3 rounded-full bg-[#D5B300] " />
                  <Text className="font-sansMedium text-[16px] text-[#265828]">
                    Audio
                  </Text>
                </View>
                <View className="flex-row gap-2.5 items-center">
                  <View className="w-3 h-3 rounded-full bg-[#6ABC6D]" />
                  <Text className="font-sansMedium text-[16px] text-[#265828]">
                    Text
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* creative tools */}
          <View className="bg-white rounded-[20px] p-5 mt-5  border border-[#D3D2D366]">
            <Text className="font-sansMedium text-dark text-[18px] mb-5">
              Creative Tools Used
            </Text>
            <View className="flex-row items-center gap-2 px-1 mb-3">
              <View className="w-1 h-1 rounded-full bg-[#474348] " />
              <Text  className="text-[#474348] font-sans text-[16px]">Drawing Tool</Text>
            </View>
            <View className="flex-row items-center gap-2 px-1 mb-3">
              <View className="w-1 h-1 rounded-full bg-[#474348] " />
              <Text  className="text-[#474348] font-sans text-[16px]">Story Builder</Text>
            </View>
            <View className="flex-row items-center gap-2 px-1 ">
              <View className="w-1 h-1 rounded-full bg-[#474348] " />
              <Text  className="text-[#474348] font-sans text-[16px]">Audio Recorder</Text>
            </View>
          </View>
        </View>

        {/* engagement and outcome */}
        <View className="bg-white rounded-[20px] p-5 mt-5 ">
          <Text className="text-[18px] font-sansSemiBold text-dark mb-5">
            Engagement and Outcome
          </Text>
          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#D3D2D366]">
            <View className="items-center border-b border-b-[#D3D2D366] py-4">
              <Text className="font-sansSemiBold text-[18px] text-[#265828]">
                50%
              </Text>
              <Text className="font-sansMedium text-[16px] text-[#474348] mt-3">
                Creativity Score
              </Text>
            </View>
            <View className="items-center border-b border-b-[#D3D2D366] py-4">
              <Text className="font-sansSemiBold text-[18px] text-[#265828]">
                50%
              </Text>
              <Text className="font-sansMedium text-[16px] text-[#474348] mt-3">
                Comprehension
              </Text>
            </View>
            <View className="items-center py-4">
              <Text className="font-sansSemiBold text-[18px] text-[#265828]">
                Advanced
              </Text>
              <Text className="font-sansMedium text-[16px] text-[#474348] mt-3">
                Planning Ability
              </Text>
            </View>
          </View>
          <View className="flex-1">
            <Text className="font-sansMedium text-[18px] text-dark mb-6">
              Time on Task (Last 7 Days)
            </Text>

            <LineChart
              noOfSections={5}
              spacing1={50}
              hideDataPoints1
              stepValue={50}
              curved
              data={data}
              color1="#4CAF50"
              yAxisTextStyle={{
                fontFamily: "Sans-Regular",
                color: "#474348",
                fontSize: 12,
              }}
              xAxisLabelTextStyle={{
                fontFamily: "Sans-Regular",
                color: "#474348",
                fontSize: 12,
              }}
              xAxisColor={'#D3D2D366'}
              yAxisColor={'#D3D2D366'}
            />
          </View>
        </View>
      </View>
    </Container>
  );
};

export default LearningProgress;
