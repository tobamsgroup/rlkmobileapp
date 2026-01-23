import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Container from "@/components/Container";
import KidSelectionCard from "@/components/Curriculum/KidSelectionCard";
import Stepper from "@/components/Stepper";
import TopBackButton from "@/components/TopBackButton";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

const AssignChild = () => {
  return (
    <Container scrollable>
      <View className="px-6  relative flex-1">
        <TopBackButton />
        <ICONS.StarFlower
          style={{
            position: "absolute",
            bottom: scaleHeight(62),
            right: scaleWidth(55),
            zIndex: 20,
          }}
        />
        <ICONS.StarFlower
          fill={"#D5B300"}
          style={{
            position: "absolute",
            bottom: scaleHeight(46),
            left: scaleWidth(40),
            zIndex: 20,
          }}
        />
        <ICONS.HalfCloud
          style={{
            position: "absolute",
            top: scaleHeight(84),
            left: scaleWidth(40),
          }}
          height={32}
          width={94}
        />
        <ICONS.HalfCloud
          style={{
            position: "absolute",
            top: scaleHeight(57),
            right: scaleWidth(29),
          }}
          height={32}
          width={94}
        />
        <View
          style={{ marginTop: scaleHeight(96), marginBottom: scaleHeight(72) }}
        >
          {false && (
            <View className="bg-[#3F9243] rounded-[20px] p-5 w-full z-10">
              <Text className="text-[18px] font-sansSemiBold text-white leading-[1.3] mb-6">
                Assign Think Sustainability Series One: Eco Heroes to Learner
              </Text>
              <View className="rounded-[20px] bg-white w-full p-4">
                <Image
                  style={{ height: scaleHeight(168), width: "100%" }}
                  className="rounded-[20px]"
                  source={IMAGES.ProfileSelectKid}
                />
              </View>
              <View className="bg-[#FAFDFF] p-4 rounded-[20px] mt-6">
                <Text className="text-[18px] font-sansSemiBold text-[#3F9243] mb-4">
                  Course Overview
                </Text>
                <Text className="font-sansMedium text-dark text-[16px]">
                  Embark on a journey through Earth’s incredible diversity!
                </Text>
                <Text className="mt-2 text-[#474348] font-sans text-[16px] leading-[1.5] mb-6">
                  Discover the wonders of our planet as we explore rainforests,
                  oceans, deserts, and polar regions. This book introduces young
                  readers to ecosystems, endangered species, and the importance
                  of environmental stewardship. Packed with fun facts, engaging
                  activities, and inspiring stories, it’s the perfect start to
                  the Think Sustainability series.
                </Text>
                <Button text="ASSIGN NOW" />
              </View>
            </View>
          )}

          <View className="rounded-[20px] bg-[#193A1B] p-5">
            <Stepper
              totalStep={2}
              currentStep={1}
              trackColor="#D3D2D366"
              railColor="#88CA8A"
              thumbColor="#4CAF50"
              textColor="white"
            />

            <Text className="text-[18px] font-sansSemiBold text-white mt-9 mb-8">
              Select Learner
              {/* Choose Assignment Scope */}
            </Text>
            {false && (
              <>
                <FlatList
                  data={[1, 2, 3, 4, 5, 6]}
                  renderItem={({}) => <KidSelectionCard />}
                  numColumns={2}
                  contentContainerStyle={{ rowGap: 12, columnGap: 12 }}
                  columnWrapperStyle={{ gap: 12 }}
                />
              </>
            )}
            <Pressable
              className={twMerge(
                "bg-[#FAFDFF] border-[#D3D2D3] border-2 rounded-[20px] p-5 py-6 mb-5",
                true && "bg-[#CCDBEB] border-[#004D99]",
              )}
            >
              <View className="flex-row justify-between mb-5">
                <Image
                  className="rounded-full"
                  style={{ width: scaleWidth(64), height: scaleWidth(64) }}
                  source={IMAGES.BookOpened}
                />
                <Checkbox
                  check={true}
                  rounded
                  backgroundColor="#3F9243"
                  borderColor={true ? "#3F9243" : "#3F9243"}
                />
              </View>
              <Text className="text-[18px] font-sansSemiBold text-dark">
                Assign Entire Series
              </Text>
              <Text className="text-[16px] font-sans leading-[1.5] text-[#474348] mt-2">
                All chapters in this series will be assigned to the selected
                learners at once. They can learn at their own pace.
              </Text>
            </Pressable>
            <Pressable className="bg-[#FAFDFF] border-[#D3D2D3] border-2 rounded-[20px] p-5 py-6">
              <View className="flex-row justify-between mb-5">
                <Image
                  className="rounded-full"
                  style={{ width: scaleWidth(64), height: scaleWidth(64) }}
                  source={IMAGES.BookClosed}
                />
                <Checkbox
                  check={true}
                  rounded
                  backgroundColor="#3F9243"
                  borderColor={true ? "#3F9243" : "#3F9243"}
                />
              </View>
              <Text className="text-[18px] font-sansSemiBold text-dark">
                Select Chapters to Assign
              </Text>
              <Text className="text-[16px] font-sans leading-[1.5] text-[#474348] mt-2">
                Choose specific chapters from this series to assign. Great if
                you want to focus on certain topics first.
              </Text>
            </Pressable>
          </View>
          <View className="flex-row w-full my-8 gap-4">
            <Button
              textClassname="text-dark"
              className="flex-1 bg-white border-[#918E91] border-0"
              text="BACK"
            />
            <Button className="flex-1" text="NEXT" />
          </View>
        </View>
      </View>
    </Container>
  );
};

export default AssignChild;
