import { getAllKids } from "@/actions/curriculum";
import { getKidsOverview } from "@/actions/home";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Container from "@/components/Container";
import TopBackButton from "@/components/TopBackButton";
import { formatDateSlash, timeAgo } from "@/utils";
import { scaleWidth } from "@/utils/scale";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const LearningOverview = () => {
  const params = useLocalSearchParams();
  const [openRemaining, setOpenRemaining] = useState(false);
  const [kid, setKid] = useState(params?.id);

  const { data } = useQuery({
    queryKey: ["learning-overview", kid],
    queryFn: async () => {
      return await getKidsOverview(kid as string);
    },
  });

  const { data: allKids } = useQuery({
    queryKey: ["kids"],
    queryFn: async () => {
      return await getAllKids();
    },
  });

  const remainingKids = useMemo(() => {
    if (!allKids && !data) return [];
    return allKids?.filter?.((k) => k._id !== data?.kid?.id);
  }, [allKids, data, kid]);
  return (
    <Container scrollable>
      <TouchableWithoutFeedback onPress={() => setOpenRemaining(false)}>
        <View className="px-6 py-5">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] my-4">
            Learning Overview
          </Text>

          <View className="relative">
            <Pressable
              onPress={() => setOpenRemaining(!openRemaining)}
              className="bg-white rounded-[12px] p-4 flex-row items-center justify-between relative z-10"
            >
              <View className="flex-row items-center gap-3">
                <Image
                  style={{ width: scaleWidth(36), height: scaleWidth(36) }}
                  source={
                    data?.kid?.picture
                      ? { uri: data?.kid?.picture }
                      : IMAGES.KidProfilePlaceholder
                  }
                  className="rounded-full border border-[#D5B300]"
                />
                <Text className="text-[16px] font-sansMedium text-dark">
                  {data?.kid?.name}
                </Text>
              </View>
              <ICONS.ChevronDown />
            </Pressable>
            {openRemaining && (
              <View
                style={{
                  elevation: 2,
                  shadowColor: "black",
                  shadowOpacity: 0.3,
                  shadowOffset: {
                    width: 5,
                    height: 2,
                  },
                }}
                className="p-4 rounded-[20px] bg-white absolute top-[70px] w-full z-20"
              >
                {remainingKids?.map((r) => (
                  <Pressable
                  key={r._id}
                    onPress={() => {
                      setKid(r?._id);
                      setOpenRemaining(false);
                    }}
                    className="bg-white rounded-[12px] py-3 flex-row items-center justify-between relative"
                  >
                    <View className="flex-row items-center gap-3">
                      <Image
                        style={{
                          width: scaleWidth(36),
                          height: scaleWidth(36),
                        }}
                        source={
                          r?.picture
                            ? { uri: r?.picture }
                            : IMAGES.KidProfilePlaceholder
                        }
                        className="rounded-full border border-[#D5B300]"
                      />
                      <Text className="text-[16px] font-sansMedium text-dark">
                        {r?.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5] mt-4">
            <Text className="text-[#474348] font-sans">Last Log In</Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                {data?.thisWeek?.lastLogin
                  ? formatDateSlash(data?.thisWeek?.lastLogin)
                  : "-"}
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#FFF7CC] items-center justify-center">
                <ICONS.Clock />
              </View>
            </View>
          </View>
          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">Lessons Completed</Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                {data?.thisWeek.lessonsCompleted || "-"}
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#0991371A] items-center justify-center">
                <ICONS.Check stroke={"#099137"} />
              </View>
            </View>
          </View>
          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">Quiz Passed</Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                {data?.thisWeek.assignmentsPassed !== "0/0" ? data?.thisWeek.assignmentsPassed : '-'}
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#1671D91A] items-center justify-center">
                <ICONS.Check stroke={"#004D99"} />
              </View>
            </View>
          </View>
          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
            <Text className="text-[#474348] font-sans">Total Time Spent</Text>
            <View className="mt-3 flex-row items-center justify-between gap-5">
              <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                {data?.thisWeek.totalTimeSpent === "0m" ? '-' : data?.thisWeek.totalTimeSpent}
              </Text>
              <View className="w-12 h-12 rounded-full bg-[#C821DE1A] items-center justify-center">
                <ICONS.Clock stroke={"#004D99"} />
              </View>
            </View>
          </View>

          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
            <Text className="flex-shrink-0 text-[18px] font-sansSemiBold text-dark">
              Assigned Courses
            </Text>
            {data?.assignedCourses?.map((d, index) => (
              <View
                key={index}
                className="p-3 border border-[#D3D2D3] rounded-[16px] mt-5"
              >
                <View className="flex-row items-center gap-2 mb-4">
                  <ICONS.Leaf />
                  <Text className="font-sansMedium text-[16px] text-dark">
                    Series {d.index}: {d.title}
                  </Text>
                </View>
                <Text className="font-sans text-[#474348] mb-4">{d.book}</Text>
                <View className="flex-row gap-3 flex-1">
                  <View className=" flex-row items-center px-3 py-2 flex-1 border border-[#D3D2D3] rounded-full justify-between">
                    <Text className="font-sansMedium text-[#265828]">
                      {d?.progress}%
                    </Text>
                    <Text className="font-sans text-[12px]">Complete</Text>
                  </View>
                  <View className=" flex-row items-center px-3 py-2 border flex-1 border-[#D3D2D3] rounded-full justify-between">
                    <Text className="font-sansMedium text-[#265828]">
                      {d?.assignmentStatus?.completed}/
                      {d?.assignmentStatus?.total}
                    </Text>
                    <Text className="font-sans text-[12px]">Assignment</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] bg-white border-[#C3E4C5]">
            <Text className="flex-shrink-0 text-[18px] font-sansSemiBold text-dark">
              Recent Activities
            </Text>
            {data?.activityService?.activities?.map((a, i) => (
              <View key={i} className="p-3 flex-row rounded-[16px] mt-5 gap-2">
                <View className="w-11 h-11 rounded-full items-center justify-center bg-[#D5B3001A]">
                  <ICONS.Puzzle />
                </View>
                <View className="gap-1 flex-1">
                  <Text className="text-dark font-sansMedium text-[16px]">
                   {a.activity}
                  </Text>
                  <Text className="font-sans text-[#474348]">{a?.title}</Text>
                </View>
                <Text className="font-sans text-[#474348]"> {timeAgo(a.timestamp)}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default LearningOverview;
