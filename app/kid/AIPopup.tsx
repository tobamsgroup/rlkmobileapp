import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import { useUser } from "@/hooks/useUser";
import {
  scaleHeight,
  scaleWidth,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "@/utils/scale";
import Constants from "expo-constants";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const AIPopup = () => {
    const data = useUser()
  return (
    <ImageBackground
      source={IMAGES.KidSelectionOverlay}
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        paddingVertical: Constants.statusBarHeight,
        flex: 1,
      }}
    >
      <View className="py-20 px-6  flex-1">
        <View className="flex-1 items-end justify-end relative">
          <Image
            style={{ height: scaleHeight(249), width: scaleWidth(233) }}
            resizeMode="contain"
            source={IMAGES.Chatbox}
            className="top-0  left-[20%] absolute"
          />
          <View
            style={{
              height: scaleHeight(249),
              width: scaleWidth(233),
              top: scaleHeight(80),
            }}
            className="absolute top-0  left-[20%] "
          >
            <Text numberOfLines={1} className="text-dark text-[24px] font-sansSemiBold text-center">
              Hey there, {data?.user?.username}
            </Text>
            <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-12">
              Ready to unlock today’s{"\n"} mission?
            </Text>
          </View>
          <Image
            style={{
              height: scaleHeight(249),
              width: scaleWidth(233),
              marginBottom: scaleHeight(117),
            }}
            resizeMode="contain"
            source={IMAGES.AI}
          />
        </View>
        <Button onPress={() => router.navigate('/(tabs)')} text="YES, LETS GO! 🚀" />
      </View>
    </ImageBackground>
  );
};

export default AIPopup;
