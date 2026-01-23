import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import React, { useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import Button from "../Button";

const DATA = [1, 2, 3];

const RecommendedLearningTracks = () => {
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
    <View className="bg-[#A6D7A8] rounded-[16px] pt-7 p-5 mt-7 z-20 relative">
      <ICONS.Star
        fill={"#FFDE2A"}
        style={{
          position: "absolute",
          top: scaleHeight(22),
          right: 18,
          zIndex: 0,
        }}
      />
      <ICONS.Star
        fill={"#2A6BAA"}
        style={{
          position: "absolute",
          top: scaleHeight(45),
          right: 128,
          zIndex: 0,
        }}
      />
      <ICONS.Star
        style={{
          position: "absolute",
          left: 135,
          zIndex: 0,
          bottom: 116,
        }}
        fill={"#DE2121"}
      />
      <ICONS.Star
        fill={"#2A6BAA"}
        style={{
          position: "absolute",
          left: 158,
          zIndex: 0,
          bottom: 98,
        }}
      />
      <ICONS.HalfCloud
        fill={"#2A6BAA"}
        style={{
          position: "absolute",
          right: 15,
          zIndex: 0,
          top: 46,
        }}
      />
      <ICONS.HalfCloud
        fill={"#2A6BAA"}
        style={{
          position: "absolute",
          left: 38,
          zIndex: 0,
          top: 53,
        }}
      />
      <ICONS.HalfCloud
        fill={"#2A6BAA"}
        style={{
          position: "absolute",
          left: 0,
          zIndex: 0,
          bottom: 118,
        }}
      />

      <Text className="font-sansSemiBold text-[18px] text-dark mb-7">
        Recommended Learning Tracks
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
            e.nativeEvent.contentOffset.x / scaleWidth(256)
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
          className="bg-white rounded-[32px] items-center justify-center"
        >
          <ICONS.KeyboardArrowLeft fill={"#3F9243"} width={32} height={32} />
        </Pressable>
        <Pressable
          onPress={() => scrollToIndex(currentIndex + 1)}
          style={{
            width: scaleWidth(48),
            height: scaleWidth(40),
          }}
          className="bg-white rounded-[32px] items-center justify-center"
        >
          <ICONS.KeyboardArrowRight fill={"#3F9243"} width={32} height={32} />
        </Pressable>
      </View>
      <Button
        style={{
          elevation: 2,
          shadowColor: "#000",
          shadowOpacity: 0.6,
          shadowOffset: {
            width: 5,
            height: 3,
          },
          paddingVertical: scaleHeight(12),
        }}
        textClassname="text-[#3F9243]"
        className="bg-[#FFFFFF] border-[#265828] border-0 gap-2 items-center"
      >
        <Text className="text-[#3F9243] text-[16px] font-sansMedium">DISCOVER MORE</Text>
        <ICONS.ArrowRight />
      </Button>
    </View>
  );
};

 const TrackCard = () => {
  return (
    <View
      className="bg-white p-5 rounded-[20px] flex-col items-start z-20"
      style={{
        width: scaleWidth(256),
      }}
    >
      <Image
        style={{ height: scaleHeight(144) }}
        source={IMAGES.ProfileSelectAdult}
        className="rounded-[20px] w-full h-full mb-5"
      />
      <Text className=" font-sansMedium bg-[#004D99] text-white px-3 py-1 rounded-full mb-4">
        Think Sustainability
      </Text>
      <Text className="text-[18px] font-sansMedium mb-4">
        Series 1: Eco Heros
      </Text>
      <Button
        className="w-full bg-white border-primary border-2"
        textClassname="text-primary"
        text="ASSIGN TO CHILD"
      />
    </View>
  );
};

export default RecommendedLearningTracks;
