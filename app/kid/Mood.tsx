import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { useUser } from "@/hooks/useUser";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const Mood = () => {
  const data = useUser();
  const [step, setStep] = useState(0);
  const [mood, setMood] = useState<keyof typeof MOODMAP | "">("");
  return (
    <Container backgroundColor={step === 1 ? "white" : "#DBEFDC"}>
      {step !== 0 && (
        <View className="absolute bottom-[-68px] w-full">
          <Image
            style={{ width: "100%", height: scaleHeight(168) }}
            source={IMAGES.Cloud}
            alt="cloud"
          />
        </View>
      )}
      <View className="px-6 pt-[80px] relative">
        {step === 0 && (
          <View>
            <View className="bg-white p-5 rounded-[16px] mb-12 relative">
              <ICONS.Star
                fill={"#CCDBEB"}
                style={{
                  position: "absolute",
                  left: 44,
                  bottom: "50%",
                }}
              />
              <ICONS.Star
                fill={"#FFEB80"}
                style={{
                  position: "absolute",
                  top: 25,
                  right: 38,
                }}
              />
              <View className="absolute left-[72px] top-[22px]  w-[9px] h-[9px] rounded-full border-2 border-[#DE21214D] bg-[#DE212133]" />
              <View className="absolute right-[32px] top-[50%]  w-[15px] h-[15px] rounded-full border-[1.35px] border-[#DE212133]" />
              <Image
                resizeMode="contain"
                style={{
                  height: scaleHeight(182),
                  width: scaleWidth(287),
                }}
                source={IMAGES.AI}
              />
              <Text className="text-center text-[#337535] text-[20px] font-sansSemiBold mb-3 mt-8">
                Welcome Back!
              </Text>
              <Text className="text-center text-dark font-sans text-[16px] leading-[1.5]">
                Ready to continue from where you left off
              </Text>
            </View>
            <Button className="gap-1">
              <Text className="text-[16px] text-white font-sansSemiBold">
                CONTINUE LEARNING
              </Text>
              <ICONS.ChevronRight stroke={"#FFFFFF"} />
            </Button>
          </View>
        )}
        {step === 1 && (
          <>
            <Text className="text-dark text-center text-[20px] font-sansSemiBold">
              Hello {data?.user?.username}
            </Text>
            <Text className="text-dark text-center text-[20px] font-sansSemiBold mt-2">
              How are you feeling today?
            </Text>
            <View className="my-8">
              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => {
                    setStep(2);
                    setMood("confident");
                  }}
                  className="items-center gap-2 bg-[#FFF7CC] rounded-[14px] py-5 px-8 w-[48%]"
                >
                  <Image
                    style={{ width: scaleWidth(80), height: scaleWidth(80) }}
                    source={IMAGES.EmojiConfident}
                  />
                  <Text className="text-[16px] font-sansMedium text-dark">
                    Confident
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setStep(2);
                    setMood("anxious");
                  }}
                  className="items-center gap-2 bg-[#DBEFDC] rounded-[14px] py-5 px-8 w-[48%]"
                >
                  <Image
                    style={{ width: scaleWidth(80), height: scaleWidth(80) }}
                    source={IMAGES.EmojiAnxious}
                  />
                  <Text className="text-[16px] font-sansMedium text-dark">
                    Anxious
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row justify-between mt-5">
                <Pressable
                  onPress={() => {
                    setStep(2);
                    setMood("tired");
                  }}
                  className="items-center gap-2 bg-[#DBEFDC] rounded-[14px] py-5 px-8 w-[48%]"
                >
                  <Image
                    style={{ width: scaleWidth(80), height: scaleWidth(80) }}
                    source={IMAGES.EmojiTired}
                  />
                  <Text className="text-[16px] font-sansMedium text-dark">
                    Tired
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setStep(2);
                    setMood("curious");
                  }}
                  className="items-center gap-2 bg-[#FFF7CC] rounded-[14px] py-5 px-8 w-[48%]"
                >
                  <Image
                    style={{ width: scaleWidth(80), height: scaleWidth(80) }}
                    source={IMAGES.EmojiCurious}
                  />
                  <Text className="text-[16px] font-sansMedium text-dark">
                    Curious
                  </Text>
                </Pressable>
              </View>
            </View>
            <Button onPress={() => router.push("/home-kid")} text="Skip" />
          </>
        )}
        {step === 2 && (
          <>
            <View className="flex-row items-center justify-center">
              <Image
                style={{ width: scaleWidth(40), height: scaleWidth(40) }}
                source={IMAGES.EmojiConfident}
              />
              <Text className="text-dark text-center text-[20px] font-sansSemiBold capitalize">
                {mood}
                {(mood === "anxious" || mood === "tired") && "?"}
              </Text>
            </View>
            <View className="rounded-[16px] bg-white px-4 py-14 mt-8 relative">
              <ICONS.Star
                fill={"#AAC4DD"}
                style={{
                  position: "absolute",
                  left: 44,
                  bottom: 22,
                }}
              />
              <ICONS.Star
                fill={"#FFEB80"}
                style={{
                  position: "absolute",
                  top: 25,
                  right: 38,
                }}
              />
              <View className="absolute left-[36px] top-[36px] w-[15px] h-[15px] rounded-full border-[1.35px] border-[#09913766]" />
              <View className="absolute left-[50%] bottom-[33px]  w-[15px] h-[15px] rounded-full border-[1.35px] border-[#DE212133]" />
              <View className="absolute left-[50%] top-[22px]  w-[9px] h-[9px] rounded-full border-2 border-[#DE21214D] bg-[#DE212133]" />
              <View className=" absolute right-[35px] bottom-[27px] w-[9px] h-[9px] rounded-full border-2 border-[#DE21214D] bg-[#DE212133]" />
              <Text className="text-dark font-sansMedium text-[16px] text-center leading-[1.5]">
                {MOODMAP[mood as keyof typeof MOODMAP].text1}
              </Text>
              <Text className="text-dark font-sansMedium text-[16px] text-center leading-[1.5] mt-8">
                {MOODMAP[mood as keyof typeof MOODMAP].text2}
              </Text>
            </View>
            <Button
              onPress={() => router.push("/home-kid")}
              textClassname="font-sansSemiBold text-[16px]"
              className="mt-8"
              text={
                mood === "anxious" || mood === "tired"
                  ? "CONTINUE"
                  : "YES, LET’S GO"
              }
            />
          </>
        )}
      </View>
    </Container>
  );
};

const MOODMAP = {
  confident: {
    text1: "You’re back!",
    text2: "I always feel like something amazing will happen when you show up.",
  },
  anxious: {
    text1: "No rush.",
    text2:
      "Some adventures begin with a deep breath. Let’s walk through this together.",
  },
  tired: {
    text1:
      "Some days feel a bit slow, but even slow thinkers make BIG discoveries.",
    text2: "Let’s begin when you’re ready.",
  },
  curious: {
    text1: "You’re here again… must be something exciting waiting.",
    text2: "Shall we uncover it together?",
  },
};

export default Mood;
