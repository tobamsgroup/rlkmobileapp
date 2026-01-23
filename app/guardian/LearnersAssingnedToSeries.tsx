import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { SimpleInput } from "@/components/Input";
import ProgressBar from "@/components/ProgressBar";
import TopBackButton from "@/components/TopBackButton";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const LearnersAssingnedToSeries = () => {
  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] my-4 mb-8">
          Learners Assigned to Think Strategy Series Two
        </Text>
        <SimpleInput
          name="search"
          containerClass="bg-white border-0"
          displayIcon={<ICONS.Search />}
          placeholder="Search by kid’s name..."
        />
        <Text className="text-[16px] font-sansSemiBold text-dark mt-4 mb-8">
          Total Kids: 8
        </Text>
        <View className="bg-[#000F1F] p-6  px-8 rounded-[16px] mt-8 relative">
          <Pressable
            style={{
              top: scaleHeight(343),
            }}
            className="flex-row self-end gap-2 items-center bg-[#3F9243] border-b-primary py-3 px-6 rounded-full absolute z-50"
          >
            <ICONS.Assignmentadd />
            <Text className="text-white font-sansMedium text-[16px]">
              ASSIGN
            </Text>
          </Pressable>
          <ICONS.Ellipse
            style={{ position: "absolute", top: scaleHeight(68), zIndex: 0 }}
          />
          <ICONS.Star
            style={{
              position: "absolute",
              top: scaleHeight(9),
              right: 8,
              zIndex: 0,
            }}
          />
          <ICONS.Flower
            style={{
              position: "absolute",
              top: scaleHeight(57),
              right: 37,
              zIndex: 0,
            }}
          />
          <ICONS.Flower
            style={{
              position: "absolute",
              bottom: scaleHeight(78),
              left: 0,
              zIndex: 0,
            }}
          />
          <ICONS.Star
            style={{
              position: "absolute",
              top: scaleHeight(89),
              left: 0,
              zIndex: 0,
            }}
            fill={"#FFDE2A"}
          />
          <KidProgessCard />
          <KidProgessCard />
          <KidProgessCard />
        </View>
      </View>
    </Container>
  );
};

const KidProgessCard = () => {
  return (
    <View className="relative mb-3">
      <View
        className="border-2 border-[#FFD700] rounded-full bg-white absolute top-0 left-0 z-30"
        style={{
          height: scaleWidth(104),
          width: scaleWidth(104),
          left: "33%",
        }}
      >
        <Image
          className="w-full h-full rounded-full"
          source={IMAGES.KidProfilePlaceholder}
        />
      </View>
      <View
        style={{
          //   width: scaleWidth(256),
          marginTop: scaleHeight(52),
          paddingTop: scaleHeight(58),
        }}
        className="border-2 border-primary rounded-[20px] bg-white items-center px-11 pb-5"
      >
        <Text className="text-[#193A1B] font-sansMedium text-[16px]">
          Amara Shine
        </Text>
        <Text className="font-sans text-[#474348] mt-3 mb-4">
          Assigned 24th Jan, 2025
        </Text>
        <View className=" flex-row items-center mb-4  gap-2.5">
          <ProgressBar percent={80} height={8} />
          <Text className="font-sansMedium text-dark flex-shrink-0 ">80%</Text>
        </View>
        <Button text="VIEW PROGRESS" className="w-full" />
      </View>
    </View>
  );
};

export default LearnersAssingnedToSeries;
