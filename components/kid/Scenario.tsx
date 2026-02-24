import { IMAGES } from "@/assets/images";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

type QuestionProps = {
  title: string;
  scenario: string;
  question: string;
  options: Record<string, string>;
};



const useHandleParams = () => {
  return (params: [string, string][]) => {
    console.log("Params:", params);
  };
};

export default function Scenario({
  question,
  selected,
  isCorrect,
  setSelected,
  isSubmitted,
  showSubmit,
  index,
}: {
  question: QuestionProps;
  isCorrect?: boolean;
  isSubmitted: boolean;
  setSelected: React.Dispatch<
    React.SetStateAction<string | boolean | null>
  >;
  selected: string | boolean | null;
  showSubmit: number | null;
  index: number;
}) {
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowBubble(true);
    }, 2000);

    const cancelTimeout = setTimeout(() => {
      setShowBubble(false);
    }, 10000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(cancelTimeout);
    };
  }, []);

  const handleParams = useHandleParams();

  // 🎈 Floating animation
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (showBubble) {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: 1000 }),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [showBubble]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View className=" z-[150] rounded-2xl px-8 py-8 bg-white">

      <View className="flex-col items-center gap-4 bg-[#DBEFDC99] py-6 px-5 rounded-[16px]">
        <Text className="font-sansSemiBold text-[24px] text-[#337535] capitalize w-full">
          {question?.title}
        </Text>

        <Image
          source={IMAGES.Scenario_Avatar_1}
          className="w-[100px] h-[174px]"
          resizeMode="contain"
        />

        <View className="flex flex-col">
          {true && (
            <Text className="text-[16px] font-sansMedium text-[#221D23] mt-6">
              {question?.scenario}
            </Text>
          )}

          {showSubmit === index && (
            <>
              <Text className="text-[16px] font-sansMedium text-[#221D23] mt-6 mb-8">
                {question?.question}
              </Text>

              {Object.entries(question.options).map(([key, text]) => (
                <TouchableOpacity
                  key={key}
                  activeOpacity={0.8}
                  onPress={() =>
                    !isSubmitted && setSelected(key)
                  }
                  className={`
                    border-[#88CA8A] border border-dashed rounded-xl p-4 mb-4
                    ${
                      selected === key
                        ? "border-solid border-[1.5px] bg-[#F1F9F1]"
                        : ""
                    }
                    ${
                      selected === key &&
                      isCorrect &&
                      isSubmitted
                        ? "border-b-4"
                        : ""
                    }
                    ${
                      selected === key &&
                      !isCorrect &&
                      isSubmitted
                        ? "bg-[#DE21210D] border-b-4 border-[#DE212133]"
                        : ""
                    }
                  `}
                >
                  <Text className="font-sansMedium text-[16px] text-[#221D23]">
                    {key}. {text}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </View>

      {/* Floating Bubble */}
      {false && (
        <Animated.View
          style={animatedStyle}
          className="absolute right-[10px] bottom-[30px]"
        >
          <View className="w-[200px]">
            <Image
              source={IMAGES.Chat}
              className="w-[200px] h-[120px]"
              resizeMode="contain"
            />

            <View className="absolute top-0 py-4 px-4 w-full">
              <Text className="font-sansMedium text-[14px]">
                Would you like to do better in this scenario lesson?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  handleParams([
                    ["mode", "read"],
                    ["lessonId", ""],
                    ["page", "1"],
                  ])
                }
                className="mt-2"
              >
                <Text className="text-[#3F9243] underline">
                  👉 CLICK HERE
                </Text>
              </TouchableOpacity>
            </View>

            <Image
              source={IMAGES.AI}
              className="w-[138px] h-[150px] absolute right-[-40px] bottom-[-100px]"
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}