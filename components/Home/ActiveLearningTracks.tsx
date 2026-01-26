import { getActiveVolume } from "@/actions/curriculum";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import { VolumeStat } from "@/types";
import { ensureHttps } from "@/utils";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
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
import Skeleton from "../Skeleton";

const ActiveLearningTracks = () => {
  const flatListRef = useRef<FlatList<VolumeStat>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["active-volumes"],
    queryFn: async () => {
      return await getActiveVolume();
    },
  });

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= (data?.volumeStats?.length || 0)) return;

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
      {isLoading && (
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => <TrackCardSkeleton />}
          keyExtractor={(_, index) => index.toString()}
          contentContainerClassName="gap-4"
          horizontal
        />
      )}
      {!!data?.volumeStats?.length && (
        <>
          <FlatList
            ref={flatListRef}
            data={data?.volumeStats}
            getItemLayout={(_, index) => ({
              length: scaleWidth(256),
              offset: scaleWidth(256) * index,
              index,
            })}
            snapToInterval={scaleWidth(256)}
            decelerationRate="fast"
            renderItem={({ item }) => <TrackCard item={item} />}
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
              <ICONS.KeyboardArrowLeft
                fill={"#004D99"}
                width={32}
                height={32}
              />
            </Pressable>
            <Pressable
              onPress={() => scrollToIndex(currentIndex + 1)}
              style={{
                width: scaleWidth(48),
                height: scaleWidth(40),
              }}
              className="bg-[#CCDBEB] rounded-[32px] items-center justify-center"
            >
              <ICONS.KeyboardArrowRight
                fill={"#004D99"}
                width={32}
                height={32}
              />
            </Pressable>
          </View>
          <Button
            onPress={() => router.push("/(tabs)/curriculum")}
            className="bg-[#004D99] border-[#003366]"
            text="VIEW ALL"
          />
        </>
      )}

      {!!!data?.volumeStats?.length && !isLoading && (
        <View className="items-center">
          <View
            style={{
              height: scaleWidth(72),
              width: scaleWidth(72),
            }}
            className="rounded-full bg-white mb-6 items-center justify-center"
          >
            <Image
              style={{
                height: scaleWidth(44),
                width: scaleWidth(44),
              }}
              source={IMAGES.BookStack}
            />
          </View>
          <Text className="text-white font-sansSemiBold text-[20px] text-center mb-4">
            No Active Learning Tracks
          </Text>
          <Text className="text-white text-center font-sans mb-6">
            You haven’t assigned a course to a child yet. Assign a course to a
            child to track their learning journey.
          </Text>
          <Button
            onPress={() => router.push("/(tabs)/curriculum")}
            className="w-full bg-[#004D99] border-[#003366]"
            text="ASSIGN CHILD"
          />
        </View>
      )}
    </View>
  );
};

export const TrackCard = ({
  width,
  item,
}: {
  width?: DimensionValue | undefined;
  item: VolumeStat;
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
        source={{ uri: ensureHttps(item?.book?.image!) }}
        className="rounded-[20px] w-full h-full mb-4"
      />
      <Text className="text-[18px] font-sansMedium bg-[#1671D91A] text-[#1671D9] px-2 py-1 rounded-full mb-4">
        {item?.book?.title}
      </Text>
      <Text className="text-[18px] font-sansMedium">
        Series {item?.index}: {item?.title}
      </Text>
      <View className="bg-[#D3D2D333] rounded-full py-1.5 px-3 flex-row items-center gap-2.5 my-4">
        <ICONS.ChildCare fill={"#3F9243"} />
        <Text className="font-sansMedium text-[#474348]">
          {item?.assignedCount} Learners
        </Text>
      </View>
      <Button
        onPress={() =>
          router.push(
            `/guardian/LearnersAssingnedToSeries?title=${item?.book?.title} Series ${item?.index}&id=${item?.seriesId}&seriesTitle=${item?.title}`,
          )
        }
        className="w-full"
        text="VIEW LEARNERS"
      />
    </View>
  );
};

export const TrackCardSkeleton = () => {
  return (
    <View
      className="bg-white p-5 rounded-[20px] flex-col items-start z-20"
      style={{
        width: scaleWidth(256),
      }}
    >
      <Skeleton
        style={{ height: scaleHeight(144) }}
        className="rounded-[20px] w-full h-full mb-4"
      />
      <Skeleton className="w-2/3 mb-4" />
      <Skeleton className="w-1/2 mb-4" />
      <Skeleton className="w-2/3 mb-4" />
      <Skeleton className="w-full h-[48px] " />
    </View>
  );
};

export default ActiveLearningTracks;
