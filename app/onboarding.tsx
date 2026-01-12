import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import { getData, storeData } from "@/lib/storage";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { twMerge } from "tailwind-merge";

const INTERVAL = 6000;
const data: ItemProps[] = [
  {
    title: "Welcome to Recycled Learning!",
    desc: "Discover a world of fun lessons, quizzes, and games made just for you. Let’s explore and grow together!",
    bgcolor: "#DBEFDC",
    textColor: "#337535",
    image: IMAGES.Onboarding1,
  },
  {
    title: "Learn, Play and\nWin Rewards!",
    desc: "Explore exciting topics, earn badges, play games, and level up as you learn!",
    bgcolor: "#FFF2AA",
    textColor: "#AA8F00",
    image: IMAGES.Onboarding2,
  },
  {
    title: "Teamwork Makes\nLearning Better",
    desc: "Parents and teachers can assign learning tracks, and see how you're progressing along the way!",
    bgcolor: "#CCDBEB",
    textColor: "#004D99",
    image: IMAGES.Onboarding3,
  },
];
const ITEM_WIDTH = Dimensions.get("window").width;

type ItemProps = {
  title: string;
  desc: string;
  bgcolor: string;
  textColor: string;
  image: ImageSourcePropType;
};

const Onboarding = () => {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const [isOldUser, setIsOldUser] = useState<string | null>(null);

  useEffect(() => {
    if (!data?.length) return;
    if(isOldUser) {
      setIndex(0)
      return
    }

    const timer = setInterval(() => {
      const nextIndex = index === data.length - 1 ? 0 : index + 1;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setIndex(nextIndex);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [index, data.length, isOldUser]);

  const revokeFirstTimer = async () => {
    await storeData("isOldUser", "true");
  };

  useEffect(() => {
    const loadFirstTimer = async () => {
      const value = await getData<string>("isOldUser");
      setIsOldUser(value);
    };

    loadFirstTimer();
  }, []);


  return (
    <View
      style={{
        paddingTop: Constants.statusBarHeight,
        backgroundColor: data[index].bgcolor,
      }}
      className="flex-1 "
    >
      {!isOldUser && (
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <CarouselItem data={item} index={index} />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(
              e.nativeEvent.contentOffset.x / ITEM_WIDTH
            );
            setIndex(newIndex);
          }}
          getItemLayout={(_, i) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * i,
            index: i,
          })}
        />
      )}
      {isOldUser && (
        <CarouselItem data={data[0]} index={1} isFlatlist={false} />
      )}
      <View className="bg-white px-6">
        <View className="mb-10">
          <Button
            onPress={() => {
              (router.navigate("/auth/SignUp"), revokeFirstTimer());
            }}
            className="mb-5"
            text="GET STARTED"
          />
          <Text className="text-center text-[16px] font-sansMedium text-[#6C686C]">
            Already have an account?{" "}
            <Text
              onPress={() => {
                (router.navigate("/auth/ProfileSelection"), revokeFirstTimer());
              }}
              className="text-primary font-sansSemiBold text-[16px]"
            >
              LOG IN
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const CarouselItem = ({
  data,
  index,
  isFlatlist = true,
}: {
  data: ItemProps;
  index: number;
  isFlatlist?: boolean;
}) => {
  return (
    <View
      style={{ width: Dimensions.get("window").width }}
      className="flex-1 relative overflow-hidden"
    >
      <View
        style={{
          height:
            Dimensions.get("window").height * 0.5 - Constants.statusBarHeight,
          paddingBottom: scaleHeight(60),
          paddingHorizontal: scaleWidth(40),
        }}
      >
        <Image
          source={data.image}
          resizeMode="contain"
          className="h-full w-full"
        />
      </View>
      {index === 1 && (
        <>
          <ICONS.OnboardingCloud1
            width={scaleWidth(78)}
            height={scaleWidth(78)}
            style={{
              position: "absolute",
              left: -scaleWidth(20),
              top: scaleHeight(150),
            }}
          />
          <ICONS.OnboardingCloud2
            width={scaleWidth(78)}
            height={scaleWidth(78)}
            style={{
              position: "absolute",
              right: -scaleWidth(39),
              top: scaleHeight(61),
            }}
          />
        </>
      )}
      <View className="bg-white flex-1 relative">
        <View
          style={{
            top: -scaleHeight(69),
            width: "100%",
          }}
          className="flex-row absolute w-full"
        >
          <View className="flex-row relative w-full">
            <ICONS.OnboardingCloud1
              width={scaleWidth(214)}
              height={scaleWidth(214)}
            />
            <ICONS.OnboardingCloud2
              width={scaleWidth(214)}
              height={scaleWidth(214)}
              style={{
                position: "absolute",
                right: -scaleWidth(20),
                top: scaleHeight(15),
              }}
            />
          </View>
        </View>
        <View className="px-6 flex-1">
          <Text
            style={{ color: data.textColor }}
            className="text-primary text-[32px] font-sansSemiBold mb-4"
          >
            {data.title}
          </Text>
          <Text className="text-[#221D23] font-sans text-[16px] leading-[1.5]">
            {data.desc}
          </Text>
          {isFlatlist && (
            <View className="flex-1 items-center justify-center flex-row gap-[10px]">
              {[0, 1, 2].map((key) => (
                <View
                  key={key}
                  className={twMerge(
                    "w-[10px] h-[10px] bg-[#D3D2D3] rounded-full",
                    index === key && "bg-primary"
                  )}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Onboarding;
