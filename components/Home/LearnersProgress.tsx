import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import React, { useRef, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import Button from "../Button";
import CreateChildProfile from "./CreateChildProfile";

const DATA = [1, 2, 3];

const LearnersProgress = () => {
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

  const [openModal, setOpenModal] = useState(false);
  return (
    <View className="bg-white rounded-[16px] p-5 mt-7 relative z-10">
      <Text className="font-sansSemiBold text-[18px] text-dark mb-7">
        Track Learners' Progress
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
        renderItem={() => <KidProgessCard />}
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
      <View className="flex-row items-center justify-center gap-[20px] my-7">
        <Pressable
          onPress={() => scrollToIndex(currentIndex - 1)}
          style={{
            width: scaleWidth(48),
            height: scaleWidth(40),
          }}
          className="bg-[#DBEFDC] rounded-[32px] items-center justify-center"
        >
          <ICONS.KeyboardArrowLeft fill={"#3F9243"} width={32} height={32} />
        </Pressable>
        <Pressable
          onPress={() => scrollToIndex(currentIndex + 1)}
          style={{
            width: scaleWidth(48),
            height: scaleWidth(40),
          }}
          className="bg-[#DBEFDC] rounded-[32px] items-center justify-center"
        >
          <ICONS.KeyboardArrowRight fill={"#3F9243"} width={32} height={32} />
        </Pressable>
      </View>
      <Button textClassname="text-[16px]" text="VIEW ALL LEARNERS" />
      <Pressable
        onPress={() => setOpenModal(true)}
        style={{
          bottom: scaleHeight(134),
        }}
        className="flex-row self-end gap-2 items-center bg-[#3F9243] border-b-primary py-3 px-6 rounded-full absolute z-50"
      >
        <ICONS.Add />
        <Text className="text-white font-sansMedium text-[16px]">
          ADD CHILD
        </Text>
      </Pressable>
      <CreateChildProfile
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </View>
  );
};

const KidProgessCard = () => {
  return (
    <View className="relative">
      <View
        className="border-2 border-[#FFD700] rounded-full bg-white absolute top-0 left-0 z-30"
        style={{
          height: scaleWidth(104),
          width: scaleWidth(104),
          left: scaleWidth(78),
        }}
      >
        <Image
          className="w-full h-full rounded-full"
          source={IMAGES.KidProfilePlaceholder}
        />
      </View>
      <View
        style={{
          width: scaleWidth(256),
          height: scaleHeight(189),
          marginTop: scaleHeight(52),
          paddingTop: scaleHeight(58),
        }}
        className="border-2 border-primary rounded-[20px] bg-[#DBEFDC] items-center px-11 "
      >
        <Text className="text-[#193A1B] font-sansMedium text-[16px]">
          Amara Shine
        </Text>
        <View className="bg-white rounded-full px-3 py-2 mb-5 mt-3">
          <Text className="font-sans text-[#474348]">3 tracks</Text>
        </View>
        <Button text="VIEW PROGRESS" className="w-full" />
      </View>
    </View>
  );
};

export default LearnersProgress;
