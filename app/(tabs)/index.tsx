import { ICONS } from "@/assets/icons";
import Container from "@/components/Container";
import ActiveLearningTracks from "@/components/Home/ActiveLearningTracks";
import LearnersProgress from "@/components/Home/LearnersProgress";
import RecommendedLearningTracks from "@/components/Home/RecommendedLearningTracks";
import ToastAlert from "@/components/ToastAlert";
import { useAppDispatch } from "@/hooks/redux";
import { scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const DATA = [1, 2, 3];
export default function HomeScreen() {
  const dispatch = useAppDispatch();
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
    <Container edges={["top"]} scrollable backgroundColor="#DBEFDC">
      <View className="flex-1 px-6 py-5 relative z-10">
        <View className="flex-row gap-2 items-center">
          <View
            className="border border-[#3F9243]"
            style={{
              height: scaleWidth(48),
              width: scaleWidth(48),
              borderRadius: 100,
            }}
          ></View>
          <View className="flex-1">
            <Text className="text-[16px] font-sansSemiBold text-[#474348] leading-[1.5]">
              Welcome back 👋
            </Text>
            <Text
              numberOfLines={1}
              className="text-[#221D23] text-[16px] font-sansSemiBold leading-[1.5]"
            >
              Marimasunde!
            </Text>
          </View>
          <Pressable
            // onPress={() => router.push("/notifications")}
            onPress={() => showToast('success', 'Hello There')}
            style={{
              height: scaleWidth(44),
              width: scaleWidth(44),
            }}
            className="rounded-[100px] bg-white items-center justify-center"
          >
            <ICONS.Notifications width={28} height={28} fill={"#4CAF50"} />
          </Pressable>
        </View>

        <View className="mt-7 bg-white px-4 py-3 rounded-bl-[16px] rounded-tr-[16px] rounded-[4px] border border-[#4CAF50]">
          <Text className="font-sansMedium text-[14px] leading-[1.5] text-[#221D23]">
            Let’s check in on the learners you’re{"\n"}guiding today.
          </Text>
        </View>

        <View className=" mt-7 rounded-[16px] bg-[#3F9243] py-4 px-3 flex-row justify-around items-center">
          <View className="items-center gap-2">
            <View
              style={{
                height: scaleWidth(48),
                width: scaleWidth(48),
              }}
              className=" bg-[#D3D2D333] rounded-full items-center justify-center"
            >
              <ICONS.ChildCare
                width={scaleWidth(24)}
                height={scaleWidth(24)}
                fill={"#FFFFFF"}
              />
            </View>
            <Text className="text-[16px] text-white font-sansBold">10</Text>
            <Text className="text-[14px] text-white font-sansMedium">
              Learners
            </Text>
          </View>
          <View className="items-center gap-2">
            <View
              style={{
                height: scaleWidth(48),
                width: scaleWidth(48),
              }}
              className="w-12 h-12 bg-[#D3D2D333] rounded-full items-center justify-center"
            >
              <ICONS.ChildCare
                width={scaleWidth(24)}
                height={scaleWidth(24)}
                fill={"#FFFFFF"}
              />
            </View>
            <Text className="text-[16px] text-white font-sansBold">10</Text>
            <Text className="text-[14px] text-white font-sansMedium">
              Active Tracks
            </Text>
          </View>
          <View className="items-center gap-2">
            <View
              style={{
                height: scaleWidth(48),
                width: scaleWidth(48),
              }}
              className="w-12 h-12 bg-[#D3D2D333] rounded-full items-center justify-center"
            >
              <ICONS.ChildCare
                width={scaleWidth(24)}
                height={scaleWidth(24)}
                fill={"#FFFFFF"}
              />
            </View>
            <Text className="text-[16px] text-white font-sansBold">10</Text>
            <Text className="text-[14px] text-white font-sansMedium">
              Activities
            </Text>
          </View>
        </View>
        <LearnersProgress />
        <View className="bg-white rounded-[16px] p-5 mt-7">
          <Text className="font-sansSemiBold text-[18px] text-dark mb-7">
            Quick Actions
          </Text>
          <View className="border-2 border-[#1671D9] bg-[#1671D91A] rounded-[20px] p-4 flex-row gap-4">
            <View
              className="bg-white rounded-full items-center justify-center"
              style={{
                height: scaleWidth(48),
                width: scaleWidth(48),
              }}
            >
              <ICONS.ChildCare
                width={scaleWidth(32)}
                height={scaleWidth(32)}
                fill={"#1671D9"}
              />
            </View>
            <View className="flex-1">
              <Text className="font-sansMedium text-[16px] text-dark leading-[1.5]">
                Set Up New Child{"\n"}Profile
              </Text>
              <Text className="font-sans text-dark flex-shrink text-[14px] mt-2 leading-[1.5]">
                Create a new profile to start a child's learning journey!
              </Text>
            </View>
          </View>
          <View className="border-2 border-[#D5B300] bg-[#D5B3001A] rounded-[20px] p-4 flex-row gap-4 mt-7">
            <View
              className="bg-white rounded-full items-center justify-center"
              style={{
                height: scaleWidth(48),
                width: scaleWidth(48),
              }}
            >
              <ICONS.Curriculum
                width={scaleWidth(32)}
                height={scaleWidth(32)}
                fill={"#D5B300"}
              />
            </View>
            <View className="flex-1">
              <Text className="font-sansMedium text-[16px] text-dark leading-[1.5]">
                Assign New Course
              </Text>
              <Text className="font-sans text-dark flex-shrink text-[14px] mt-2 leading-[1.5]">
                Pick a new course for a child to explore!
              </Text>
            </View>
          </View>
        </View>
        <ActiveLearningTracks />
        <RecommendedLearningTracks />
      </View>
    </Container>
  );
}
