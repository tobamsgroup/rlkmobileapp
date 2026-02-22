import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import TopBackButton from "@/components/TopBackButton";
import { scaleWidth } from "@/utils/scale";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

const AccentSelection = () => {
  const [step, setStep] = useState(1);
  const [selectedAccent, setSelectedAccent] = useState("");
  const [voiceStyle, setVoiceStyle] = useState("");
  return (
    <Container scrollable>
      <View className="px-6 py-10">
        {step === 1 && (
          <>
            <View className="bg-[#265828] rounded-[16px] px-6 pt-[68px] pb-[148px] mb-10 relative overflow-hidden">
              <Image
                alt="oberlay"
                // resizeMode="contain"
                style={{
                  // width:89,
                  height: 431,
                }}
                className="absolute top-[-50px] left-[0px] w-full "
                source={IMAGES.RectangleOverlay}
              />
              <Text className="text-[28px] text-white font-sansSemiBold leading-[1.3]">
                Pick Your Learning {"\n"}Voice!
              </Text>

              <View className="mt-[102px]">
                <Pressable className="flex-row gap-2 items-center bg-[#3C693E] px-3 py-2.5 rounded-[19px]">
                  <View className="w-12 h-12 rounded-full bg-[#C3E4C5] items-center justify-center">
                    <ICONS.Web />
                  </View>
                  <View>
                    <Text className="text-[#C3E4C5] leading-[1.5] font-sans text-[16px]">
                      Step 1
                    </Text>
                    <Text className="text-[16px] font-sansMedium text-white leading-[1.5]">
                      Accent Selection
                    </Text>
                  </View>
                </Pressable>
                <View className="h-[37px] border-l-2 border-l-[#3C693E] ml-[28px] mt-2" />
                <Pressable className="flex-row gap-2 items-center  px-3 rounded-[19px]">
                  <View className="w-12 h-12 rounded-full bg-[#C3E4C5] items-center justify-center">
                    <ICONS.RecordVoice />
                  </View>
                  <View>
                    <Text className="text-[#C3E4C5] leading-[1.5] font-sans text-[16px]">
                      Step 2
                    </Text>
                    <Text className="text-[16px] font-sansMedium text-white leading-[1.5]">
                      Voice Type Selection
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
            <Button onPress={() => setStep(2)} text="CONTINUE" />
          </>
        )}
        {step == 2 && (
          <>
            <Text className="text-[24px] font-sansSemiBold text-[#212121]">
              Choose Your Accent
            </Text>
            <Text className="text-[16px] text-[#6C686C] font-sans leading-[1.5] mt-2">
              Pick the accent you understand and enjoy the most. Tap the play
              button to hear a preview
            </Text>
            <View className="p-4 bg-[#F1F9F1] rounded-[16px] mt-6 mb-9">
              {ACCENTS?.map((a) => (
                <AccentCard
                  isSelected={a.name === selectedAccent}
                  key={a.name}
                  accent={a}
                  onPress={() => setSelectedAccent(a.name)}
                />
              ))}
            </View>
            <Button onPress={() => setStep(3)} text="PROCEED TO VOICE TYPE" />
          </>
        )}
        {step == 3 && (
          <>
            <TopBackButton onPress={() => setStep((step) => step - 1)} />
            <Text className="text-[24px] font-sansSemiBold text-[#212121] mt-3">
              Choose Your Voice Style
            </Text>
            <Text className="text-[16px] text-[#6C686C] font-sans leading-[1.5] mt-2">
              Now choose the voice style you want for your learning journey
            </Text>

            <View className="p-4 bg-[#F1F9F1] rounded-[16px] mt-6 mb-9">
              <Text className="text-[16px] font-sansMedium text-dark mb-4">
                AI Child
              </Text>
              {VOICES?.slice(0, 2).map((a) => (
                <AccentCard
                  isSelected={"kid " + a.name === voiceStyle}
                  key={a.name}
                  accent={a}
                  onPress={() => setVoiceStyle("kid " + a.name)}
                />
              ))}
              <View className="border border-[#D3D2D366] mb-4 mt-1" />
              <Text className="text-[16px] font-sansMedium text-dark mb-4">
                Adult Mentor
              </Text>
              {VOICES?.slice(2, 5).map((a) => (
                <AccentCard
                  isSelected={"adult " + a.name === voiceStyle}
                  key={a.name}
                  accent={a}
                  onPress={() => setVoiceStyle("adult " + a.name)}
                />
              ))}
            </View>
            <Button text="SAVE MY CHOICE" />
          </>
        )}
        <Button
          onPress={() => router.push("/(tabs)/home-kid")}
          text="SKIP"
          textClassname="text-[#3F9243] underline"
          className="bg-transparent border-0"
        />
      </View>
    </Container>
  );
};

export const AccentCard = ({
  isSelected,
  accent,
  onPress,
}: {
  isSelected: boolean;
  accent: {
    image: any;
    name: string;
  };
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={twMerge(
        "bg-white rounded-[12px] p-4 mb-3",
        isSelected && "bg-[#193A1B]",
      )}
    >
      <Image
        style={{ width: scaleWidth(32), height: scaleWidth(32) }}
        source={accent.image}
        className="rounded-full"
      />
      <View className="flex-row justify-between items-center mt-5">
        <Text
          className={twMerge(
            "text-[16px] text-dark font-sansMedium ",
            isSelected && "text-white",
          )}
        >
          {accent.name}
        </Text>
        <View
          className={twMerge(
            "bg-[#193A1B] w-10 h-10 items-center justify-center rounded-[12px] border-t-[1.58px] border-t-[#3F9243]",
            isSelected && "bg-[#6ABC6D] border-[2.24px] border-[#A6D7A8]",
          )}
        >
          <ICONS.Play />
        </View>
      </View>
    </Pressable>
  );
};

export const ACCENTS = [
  {
    image: IMAGES.FlagGB,
    name: "British",
  },
  {
    image: IMAGES.FlagUSA,
    name: "American",
  },
  {
    image: IMAGES.FlagAU,
    name: "Australian",
  },
  {
    image: IMAGES.FlagNG,
    name: "Nigerian",
  },
  {
    image: IMAGES.FlagSA,
    name: "South African",
  },
  {
    image: IMAGES.FlagIND,
    name: "Indian",
  },
];

export const VOICES = [
  {
    image: IMAGES.AccentKidMale,
    name: "Male",
  },
  {
    image: IMAGES.AccentKidFemale,
    name: "Female",
  },
  {
    image: IMAGES.AccentAdultMale,
    name: "Male",
  },
  {
    image: IMAGES.AccentAdultFemale,
    name: "Female",
  },
  {
    image: IMAGES.AccentAdultMale,
    name: "Cartoon Style",
  },
];

export default AccentSelection;
