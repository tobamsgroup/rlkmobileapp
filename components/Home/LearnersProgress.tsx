import { fetchKidsCourses } from "@/actions/curriculum";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import { ensureHttps, groupByKid, GroupedByKid } from "@/utils";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import Button from "../Button";
import Skeleton from "../Skeleton";
import { twMerge } from "tailwind-merge";

const LearnersProgress = ({ onAddChild }: { onAddChild: () => void }) => {
  const flatListRef = useRef<FlatList<GroupedByKid>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["kids-courses"],
    queryFn: async () => {
      return await fetchKidsCourses();
    },
  });

  const groupedData = useMemo(() => {
    if (!data) return [];
    return groupByKid(data);
  }, [data]);

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= groupedData?.length) return;

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });

    setCurrentIndex(index);
  };

  return (
    <View className="bg-white rounded-[16px] p-5 mt-7 relative z-10">
      <Text className="font-sansSemiBold text-[18px] text-dark mb-7">
        Track Learners' Progress
      </Text>

      {isLoading && (
        <FlatList
          data={[1, 2, 3]}
          horizontal
          renderItem={() => <KidProgessCardSkeleton />}
          keyExtractor={(_, index) => index.toString()}
          contentContainerClassName="gap-4"
        />
      )}
      {groupedData?.length > 0 && (
        <>
          <FlatList
            ref={flatListRef}
            data={groupedData}
            getItemLayout={(_, index) => ({
              length: scaleWidth(256),
              offset: scaleWidth(256) * index,
              index,
            })}
            snapToInterval={scaleWidth(256)}
            decelerationRate="fast"
            renderItem={({ item }) => <KidProgessCard {...item} />}
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
          <View className="flex-row items-center justify-center gap-[20px] my-7">
            <Pressable
              onPress={() => scrollToIndex(currentIndex - 1)}
              style={{
                width: scaleWidth(48),
                height: scaleWidth(40),
              }}
              className="bg-[#DBEFDC] rounded-[32px] items-center justify-center"
            >
              <ICONS.KeyboardArrowLeft
                fill={"#3F9243"}
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
              className="bg-[#DBEFDC] rounded-[32px] items-center justify-center"
            >
              <ICONS.KeyboardArrowRight
                fill={"#3F9243"}
                width={32}
                height={32}
              />
            </Pressable>
          </View>
          <Button
            onPress={() => router.push("/(tabs)/learners")}
            textClassname="text-[16px]"
            text="VIEW ALL LEARNERS"
          />
        
        </>
      )}

      {groupedData?.length < 1 && !isLoading && (
        <View className="items-center">
          <Image
            style={{
              height: scaleWidth(72),
              width: scaleWidth(72),
            }}
            className="rounded-full border-[1.8px] border-[#FFD700] mb-6"
            source={IMAGES.Superkid}
          />
          <Text className="text-[#265828] font-sansSemiBold text-[20px] text-center mb-4">
            No Learners Added Yet{" "}
          </Text>
          <Text className="text-dark text-center font-sans mb-6">
            Start by adding a child to begin tracking their learning progress.
          </Text>
          <Button
            className="w-full"
            onPress={onAddChild}
            text="ADD KID PROFILE"
          />
        </View>
      )}
    </View>
  );
};

const KidProgessCardSkeleton = () => {
  return (
    <View className="relative">
      <Skeleton
        style={{
          height: scaleWidth(104),
          width: scaleWidth(104),
          left: scaleWidth(78),
        }}
        className="border-2 border-[#D3D2D366] rounded-full bg-white absolute top-0 left-0 z-30"
      />

      <View
        style={{
          width: scaleWidth(256),
          height: scaleHeight(189),
          marginTop: scaleHeight(52),
          paddingTop: scaleHeight(58),
        }}
        className="border-2 border-[#D3D2D366] animate-pulse bg-[#D3D2D366]/15 rounded-[20px] items-center px-11 "
      >
        <Skeleton className="w-2/3 mb-4" />
        <Skeleton className="w-1/2 mb-4" />
        <Skeleton className="w-full h-[48px] rounded-full" />
      </View>
    </View>
  );
};

const KidProgessCard = (props: GroupedByKid) => {
  return (
    <View className="relative">
      <View
        className={twMerge("border-2 border-[#FFD700] rounded-full bg-white absolute top-0 left-0 z-30")}
        style={{
          height: scaleWidth(104),
          width: scaleWidth(104),
          left: scaleWidth(78),
        }}
      >
        <Image
          className="w-full h-full rounded-full"
          source={
            props?.kid?.picture
              ? { uri: ensureHttps(props?.kid?.picture) }
              : IMAGES.KidProfilePlaceholder
          }
        />
      </View>
      <View
        style={{
          width: scaleWidth(256),
          // height: scaleHeight(240),
          marginTop: scaleHeight(52),
          paddingTop: scaleHeight(58),
          paddingBottom: scaleHeight(20),
        }}
        className="border-2 border-primary rounded-[20px] bg-[#DBEFDC] items-center px-11 "
      >
        <Text className="text-[#193A1B] font-sansMedium text-[16px]">
          {props?.kid?.name}
        </Text>
        <View className="bg-white rounded-full px-3 py-2 mb-5 mt-3">
          <Text className="font-sans text-[#474348]">
            {props?.courses?.length} tracks
          </Text>
        </View>
        <Button
          onPress={() =>
            router.push(`/guardian/LearningProgress?id=${props?.kid?._id}`)
          }
          text="VIEW PROGRESS"
          className="w-full"
        />
      </View>
    </View>
  );
};

export default LearnersProgress;
