import {
  assignKidsToCourse,
  getAllKids,
  getKidAssignedToSeries,
  getVolume,
} from "@/actions/curriculum";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Container from "@/components/Container";
import KidSelectionCard, {
  KidSelectionCardSkeleton,
} from "@/components/Curriculum/KidSelectionCard";
import Skeleton from "@/components/Skeleton";
import Stepper from "@/components/Stepper";
import TopBackButton from "@/components/TopBackButton";
import { BookMeta } from "@/types";
import { ensureHttps } from "@/utils";
import { HAPTIC } from "@/utils/haptic";
import { invalidateQueries } from "@/utils/query";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

const AssignChild = () => {
  const params = useLocalSearchParams();
  const [step, setStep] = useState(1);
  const [selectedKids, setSelectedKids] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedScope, setSelectedScope] = useState("entire");
  const [selectedModule, setSelectedModule] = useState<
    { id: string; title: string; index: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["assign-volume", params?.id],
    queryFn: async () => {
      return await getVolume(params?.id as string);
    },
  });
  const { data: kids, isLoading: isLoadingKids } = useQuery({
    queryKey: ["kids"],
    queryFn: async () => {
      return await getAllKids();
    },
  });

  const { data: assignedKids } = useQuery({
    queryKey: ["assigned-kids", params?.id],
    queryFn: async () => {
      return await getKidAssignedToSeries(params?.id as string);
    },
  });

  const handlePress = async () => {
    if (step === 3) {
      const assigned = getAlreadyAssignedKidNames(
        selectedKids,
        assignedKids?.[0]?.assignedKids!,
      );

      if (assigned?.length > 0) {
        alert(
          `${assigned.join(", ")} is already assigned to this series, Please remove them to continue!`,
        );
        return;
      }
      await onSubmit();
      return;
    }
    setStep((step) => step + 1);
  };

  const selectModule = (id: string, title: string, index: number) => {
    setSelectedModule((prev) => {
      const isExist = selectedModule?.find((c) => c.id === id);
      if (isExist) {
        return prev?.filter((c) => c.id !== id);
      } else {
        return [...prev, { id, title, index }];
      }
    });
  };

  const onSubmit = async () => {
    const payload = {
      kidIds: selectedKids?.map((s) => s.id),
      bookId: (data?.bookId as BookMeta)?._id!,
      seriesIds: [params?.id! as string],
      chapterIds:
        selectedScope === "entire"
          ? data?.chapters?.map((s) => s._id)!
          : selectedModule?.map((s) => s.id),
    };

    setLoading(true);
    try {
      await assignKidsToCourse(payload);
      HAPTIC.success();
      router.push(
        `/guardian/AssignChildSuccess?selectedKids=${JSON.stringify(selectedKids)}&selectedModule=${JSON.stringify(selectedScope === "entire" ? [] : selectedModule)}&title=${params?.title}&seriesTitle=${params?.seriesTitle}`,
      );
      invalidateQueries("curriculum");
      invalidateQueries(`series-volume`);
      invalidateQueries("kids-volume");
      invalidateQueries("activities");
    } catch (error) {
      showToast("error", "An error occured, Try again!");
      HAPTIC.error();
      console.log({ error });
    }
    setLoading(false);
  };

  const toggleSelection = (kidId: string, name: string) => {
    setSelectedKids((prev) =>
      prev.find((s) => s.id === kidId)
        ? prev.filter((p) => p.id !== kidId)
        : [...prev, { id: kidId, name }],
    );
  };
  return (
    <Container scrollable={step !== 2}>
      <View className="px-6  relative flex-1">
        <TopBackButton />
        <ICONS.StarFlower
          style={{
            position: "absolute",
            bottom: scaleHeight(62),
            right: scaleWidth(55),
            zIndex: 20,
          }}
        />
        <ICONS.StarFlower
          fill={"#D5B300"}
          style={{
            position: "absolute",
            bottom: scaleHeight(46),
            left: scaleWidth(40),
            zIndex: 20,
          }}
        />
        <ICONS.HalfCloud
          style={{
            position: "absolute",
            top: scaleHeight(84),
            left: scaleWidth(40),
          }}
          height={32}
          width={94}
        />
        <ICONS.HalfCloud
          style={{
            position: "absolute",
            top: scaleHeight(57),
            right: scaleWidth(29),
          }}
          height={32}
          width={94}
        />
        <View
          style={{ marginTop: scaleHeight(96), marginBottom: scaleHeight(72) }}
        >
          {step === 1 && (
            <View className="bg-[#3F9243] rounded-[20px] p-5 w-full z-10">
              <Text className="text-[18px] font-sansSemiBold text-white leading-[1.3] mb-6">
                Assign {params?.title}:{" "}
                <Text className="text-[#FFD700]">{params?.seriesTitle}</Text> to
                Learner
              </Text>
              <View className="rounded-[20px] bg-white w-full p-4">
                {isLoading ? (
                  <Skeleton
                    style={{ height: scaleHeight(168), width: "100%" }}
                    className="rounded-[20px]"
                  />
                ) : (
                  <Image
                    style={{ height: scaleHeight(168), width: "100%" }}
                    className="rounded-[20px]"
                    source={{ uri: ensureHttps(data?.image || "") }}
                  />
                )}
              </View>
              <View className="bg-[#FAFDFF] p-4 rounded-[20px] mt-6">
                <Text className="text-[18px] font-sansSemiBold text-[#3F9243] mb-4">
                  Course Overview
                </Text>
                {isLoading ? (
                  <Skeleton className="w-full rounded-full" />
                ) : (
                  <Text className="font-sansMedium text-dark text-[16px]">
                    {data?.overview?.catchPhrase}
                  </Text>
                )}
                {isLoading ? (
                  <Skeleton className="w-full h-[200px] " />
                ) : (
                  <Text className="mt-2 text-[#474348] font-sans text-[16px] leading-[1.5] mb-6">
                    {data?.overview?.description}
                  </Text>
                )}
                {isLoading ? (
                  <Skeleton className="h-[50px] rounded-full w-full" />
                ) : (
                  <Button onPress={() => setStep(2)} text="ASSIGN NOW" />
                )}
              </View>
            </View>
          )}
          {step > 1 && (
            <View className="rounded-[20px] bg-[#193A1B] p-5">
              <Stepper
                totalStep={2}
                currentStep={step - 1}
                trackColor="#D3D2D366"
                railColor="#88CA8A"
                thumbColor="#4CAF50"
                textColor="white"
              />

              <Text className="text-[18px] font-sansSemiBold text-white mt-9 mb-8">
                {step === 2 ? "Select Learner" : "Choose Assignment Scope"}
              </Text>
              {step === 2 && (
                <>
                  {isLoadingKids ? (
                    <FlatList
                      data={[1, 2, 3, 4]}
                      renderItem={({ item }) => <KidSelectionCardSkeleton />}
                      numColumns={2}
                      contentContainerStyle={{ rowGap: 12, columnGap: 12 }}
                      columnWrapperStyle={{ gap: 12 }}
                    />
                  ) : (
                    <FlatList
                      data={kids}
                      renderItem={({ item }) => (
                        <KidSelectionCard
                          selected={
                            !!selectedKids?.find((s) => s.id === item._id)
                          }
                          onSelect={() => toggleSelection(item._id, item.name)}
                          kid={item}
                        />
                      )}
                      numColumns={2}
                      contentContainerStyle={{ rowGap: 12, columnGap: 12 }}
                      columnWrapperStyle={{ gap: 12 }}
                    />
                  )}
                </>
              )}
              {step === 3 && (
                <>
                  <Pressable
                    className={twMerge(
                      "bg-[#FAFDFF] border-[#D3D2D3] border-2 rounded-[20px] p-5 py-6 mb-5",
                      selectedScope === "entire" &&
                        "bg-[#CCDBEB] border-[#004D99]",
                    )}
                    onPress={() => setSelectedScope("entire")}
                  >
                    <View className="flex-row justify-between mb-5">
                      <Image
                        className="rounded-full"
                        style={{
                          width: scaleWidth(64),
                          height: scaleWidth(64),
                        }}
                        source={IMAGES.BookOpened}
                      />
                      <Checkbox
                        check={selectedScope === "entire"}
                        rounded
                        backgroundColor="#3F9243"
                        borderColor={
                          selectedScope === "entire" ? "#3F9243" : "#3F9243"
                        }
                      />
                    </View>
                    <Text className="text-[18px] font-sansSemiBold text-dark">
                      Assign Entire Series
                    </Text>
                    <Text className="text-[16px] font-sans leading-[1.5] text-[#474348] mt-2">
                      All chapters in this series will be assigned to the
                      selected learners at once. They can learn at their own
                      pace.
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setSelectedScope("some")}
                    className={twMerge(
                      "bg-[#FAFDFF] border-[#D3D2D3] border-2 rounded-[20px] p-5 py-6",
                      selectedScope === "some" &&
                        "bg-[#CCDBEB] border-[#004D99]",
                    )}
                  >
                    <View className="flex-row justify-between mb-5">
                      <Image
                        className="rounded-full"
                        style={{
                          width: scaleWidth(64),
                          height: scaleWidth(64),
                        }}
                        source={IMAGES.BookClosed}
                      />
                      <Checkbox
                        check={selectedScope === "some"}
                        rounded
                        backgroundColor="#3F9243"
                        borderColor={
                          selectedScope === "some" ? "#3F9243" : "#3F9243"
                        }
                      />
                    </View>
                    <Text className="text-[18px] font-sansSemiBold text-dark">
                      Select Chapters to Assign
                    </Text>
                    <Text className="text-[16px] font-sans leading-[1.5] text-[#474348] mt-2">
                      Choose specific chapters from this series to assign. Great
                      if you want to focus on certain topics first.
                    </Text>
                    {selectedScope === "some" && (
                      <View className="bg-white p-6 rounded-[8px] mt-4">
                        {data?.chapters?.map((c) => (
                          <Pressable
                            key={c?._id}
                            onPress={(e) => {
                              e.stopPropagation();
                              selectModule(c._id, c.title, c.index);
                            }}
                            className="flex-row items-center gap-3 mb-4"
                          >
                            <Checkbox
                              onCheck={() => {
                                selectModule(c._id, c.title, c.index);
                              }}
                              check={
                                !!selectedModule?.find((s) => s.id === c._id)
                                  ?.id
                              }
                            />
                            <Text className="text-[16px] font-sans text-dark flex-shrink">
                              {c.title}
                            </Text>
                          </Pressable>
                        ))}
                      </View>
                    )}
                  </Pressable>
                </>
              )}
            </View>
          )}
          {step > 1 && (
            <View className="flex-row w-full my-8 gap-4">
              <Button
                onPress={() => setStep((step) => step - 1)}
                textClassname="text-dark"
                className="flex-1 bg-white border-[#918E91] border-0"
                text="BACK"
              />
              <Button
                disabled={(step === 2 && selectedKids?.length < 1) || loading}
                loading={loading}
                onPress={handlePress}
                className="flex-1"
                text={step === 3 ? "ASSIGN" : "NEXT"}
              />
            </View>
          )}
        </View>
      </View>
    </Container>
  );
};

function getAlreadyAssignedKidNames(
  selectedKids: { id: string; name: string }[],
  assignedKidIds: string[],
): string[] {
  return selectedKids
    .filter((kid) => assignedKidIds.includes(kid.id))
    .map((kid) => kid.name);
}

export default AssignChild;
