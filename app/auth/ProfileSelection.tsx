import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const ProfileSelection = () => {
  return (
    <Container scrollable backgroundColor="#FAFDFF">
      <View className="px-6 py-5">
        <Pressable
          style={{ width: scaleWidth(32), height: scaleWidth(32) }}
          className="w-8 h-8 rounded-full border-[#EFEFF3] border items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ICONS.ChevronLeft width={14} height={14} />
        </Pressable>
        <Text className="text-dark text-[24px] font-sansSemiBold text-center">
          Who’s Logging In Today?
        </Text>
        <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-8">
          Choose your profile to continue
        </Text>
        <View className="px-6 py-4">
          <Pressable onPress={() => router.navigate('/auth/Login?profile=kid')} className="border-[0.2px] border-[#CAC4D0] rounded-[12px] p-4 bg-white">
            <Image
              style={{ height: scaleHeight(156), borderRadius: scaleWidth(16) }}
              source={IMAGES.ProfileSelectKid}
            />
            <Button onPress={() => router.navigate('/auth/Login?profile=kid')} text="I’M A KID" className="mt-3" />
          </Pressable>
          <Pressable onPress={() => router.navigate('/auth/Login?profile=adult')} className="border-[0.2px] border-[#CAC4D0] rounded-[12px] p-4 bg-white mt-5">
            <Image
              style={{ height: scaleHeight(156), borderRadius: scaleWidth(16) }}
              source={IMAGES.ProfileSelectAdult}
            />
            <Button
            onPress={() => router.navigate('/auth/Login?profile=adult')}
              text="I’M A PARENT / TEACHER"
              className="mt-3 bg-[#004D99] border-b-[#003366]"
            />
          </Pressable>
        </View>
      </View>
    </Container>
  );
};

export default ProfileSelection;
