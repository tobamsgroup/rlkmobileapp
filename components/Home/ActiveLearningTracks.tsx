import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import React, { useRef, useState } from "react";
import {
  DimensionValue,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import Button from "../Button";

const DATA = [1, 2, 3];

const ActiveLearningTracks = () => {
  const flatListRef = useRef<FlatList<number>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= DATA.length) return;

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });

    setCurrentIndex(index);
  };
  return (
    <View className="bg-[#000F1F] rounded-[16px] p-5 mt-7 z-20 relative">
      <ICONS.Ellipse
        style={{ position: "absolute", top: scaleHeight(68), zIndex: 0 }}
      />
      <ICONS.Star
        style={{
          position: "absolute",
          top: scaleHeight(22),
          right: 18,
          zIndex: 0,
        }}
      />
      <ICONS.Flower
        style={{
          position: "absolute",
          top: scaleHeight(22),
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
      <Text className="font-sansSemiBold text-[18px] text-white mb-7">
        Active Learning Tracks
      </Text>
      <FlatList
        ref={flatListRef}
        data={[1, 2, 4]}
        getItemLayout={(_, index) => ({
          length: scaleWidth(256),
          offset: scaleWidth(256) * index,
          index,
        })}
        snapToInterval={scaleWidth(256)}
        decelerationRate="fast"
        renderItem={() => <TrackCard />}
        keyExtractor={(_, index) => index.toString()}
        contentContainerClassName="gap-4"
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / scaleWidth(256),
          );
          setCurrentIndex(index);
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <View className="flex-row items-center justify-end gap-[20px] my-7">
        <Pressable
          onPress={() => scrollToIndex(currentIndex - 1)}
          style={{
            width: scaleWidth(48),
            height: scaleWidth(40),
          }}
          className="bg-[#CCDBEB] rounded-[32px] items-center justify-center"
        >
          <ICONS.KeyboardArrowLeft fill={"#004D99"} width={32} height={32} />
        </Pressable>
        <Pressable
          onPress={() => scrollToIndex(currentIndex + 1)}
          style={{
            width: scaleWidth(48),
            height: scaleWidth(40),
          }}
          className="bg-[#CCDBEB] rounded-[32px] items-center justify-center"
        >
          <ICONS.KeyboardArrowRight fill={"#004D99"} width={32} height={32} />
        </Pressable>
      </View>
      <Button className="bg-[#004D99] border-[#003366]" text="VIEW ALL" />
    </View>
  );
};

export const TrackCard = ({
  width,
}: {
  width?: DimensionValue | undefined;
}) => {
  return (
    <View
      className="bg-white p-5 rounded-[20px] flex-col items-start z-20"
      style={{
        width: width || scaleWidth(256),
      }}
    >
      <Image
        style={{ height: scaleHeight(144) }}
        source={IMAGES.ProfileSelectAdult}
        className="rounded-[20px] w-full h-full mb-4"
      />
      <Text className="text-[18px] font-sansMedium bg-[#1671D91A] text-[#1671D9] px-2 py-1 rounded-full mb-4">
        Think Sustainability
      </Text>
      <Text className="text-[18px] font-sansMedium">Series 1: Eco Heros</Text>
      <View className="bg-[#D3D2D333] rounded-full py-1.5 px-3 flex-row items-center gap-2.5 my-4">
        <ICONS.ChildCare fill={"#3F9243"} />
        <Text className="font-sansMedium text-[#474348]">15 Learners</Text>
      </View>
      <Button className="w-full" text="VIEW LEARNERS" />
    </View>
  );
};

export default ActiveLearningTracks;
