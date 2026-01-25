import { getSeriesVolume } from "@/actions/curriculum";
import { ICONS } from "@/assets/icons";
import CheckDropdown from "@/components/CheckDropdown";
import Container from "@/components/Container";
import SeriesOverviewCard from "@/components/Curriculum/SeriesOverviewCard";
import { SimpleInput } from "@/components/Input";
import ProgressBar from "@/components/ProgressBar";
import TopBackButton from "@/components/TopBackButton";
import { VolumeStat } from "@/types";
import { scaleHeight } from "@/utils/scale";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TouchableWithoutFeedback, View } from "react-native";

const CurriculumSeriesOverview = () => {
  const params = useLocalSearchParams();
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [openStatus, setOpenStatus] = useState(false);
  const [openSort, setOpenSort] = useState(false);
  const [volumeData, setVolumeData] = useState<VolumeStat[]>([]);
  const { data } = useQuery({
    queryKey: ["series-volume", params?.id],
    queryFn: async () => {
      return await getSeriesVolume(params?.id as string);
    },
  });

useEffect(() => {
  if (!data?.volumeStats) return;

  let result = [...data.volumeStats];

  if (search?.trim()) {
    const query = search.toLowerCase();
    result = result.filter((v) =>
      v.title?.toLowerCase().includes(query),
    );
  }

  if (status === "Assigned") {
    result = result.filter((v) => v.assignedCount > 0);
  }

  if (status === "Unassigned") {
    result = result.filter((v) => v.assignedCount < 1);
  }

  if (sort === "A-Z") {
    result.sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }

  setVolumeData(result);
}, [data, search, status, sort]);


  return (
    <Container scrollable>
      <TouchableWithoutFeedback
        onPress={() => {
          setOpenStatus(false);
          setOpenSort(false);
        }}
      >
        <View className="px-6 py-5 relative">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] my-4 mb-8">
            {params?.title} Series
          </Text>
          <SimpleInput
            name="search"
            containerClass="bg-white border-0"
            displayIcon={<ICONS.Search />}
            placeholder="Search by name..."
            value={search}
            handleChange={setSearch}
          />
          <View className="flex-row gap-4 w-full mt-5 relative">
            <Pressable
              onPress={() => {
                setOpenSort(false);
                setOpenStatus((prev) => !prev);
              }}
              className="bg-[#4CAF50] flex-1 border border-[#6ABC6D] items-center px-6 py-3 justify-between flex-row rounded-[12px]"
            >
              <ICONS.LibraryBooks />
              <Text className="text-[16px] text-white font-sansMedium">
                Status
              </Text>
              <ICONS.ChevronDown stroke={"white"} />
            </Pressable>
            <Pressable
              onPress={() => {
                setOpenStatus(false);
                setOpenSort((prev) => !prev);
              }}
              className="bg-[#4CAF50] flex-1 border border-[#6ABC6D] items-center px-6 py-3 justify-between flex-row rounded-[12px]"
            >
              <ICONS.Sort />
              <Text className="text-[16px] text-white font-sansMedium">
                Sort
              </Text>
              <ICONS.ChevronDown stroke={"white"} />
            </Pressable>
            {openStatus && (
              <CheckDropdown
                selected={status}
                onSelect={setStatus}
                options={["All", "Assigned", "Unassigned"]}
              />
            )}
            {openSort && (
              <CheckDropdown
                selected={sort}
                onSelect={setSort}
                options={["A-Z", "Most Popular", "Recently Added"]}
              />
            )}
          </View>
          <View className="bg-[#000F1F] rounded-[16px] p-6 mt-8 relative">
            <ICONS.Ellipse
              style={{ position: "absolute", top: scaleHeight(68), zIndex: 0 }}
            />
            <ICONS.Star
              style={{
                position: "absolute",
                top: scaleHeight(9),
                right: 8,
                zIndex: 0,
              }}
            />
            <ICONS.Flower
              style={{
                position: "absolute",
                top: scaleHeight(57),
                right: 37,
                zIndex: 0,
              }}
            />
            <ICONS.Flower
              style={{
                position: "absolute",
                bottom: scaleHeight(78),
                left: 0,
                zIndex: 0,
              }}
            />
            <ICONS.Star
              style={{
                position: "absolute",
                top: scaleHeight(89),
                left: 0,
                zIndex: 0,
              }}
              fill={"#FFDE2A"}
            />
            <ProgressBar percent={30} height={18} />
            <Text className="font-sansSemiBold text-white text-[16px] mt-4 mb-8">
              {data?.assignedVolumes} of {data?.totalVolumes} Series Assigned
            </Text>

            {volumeData?.map((s) => (
              <SeriesOverviewCard key={s.index} {...s} />
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default CurriculumSeriesOverview;
