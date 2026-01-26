import { fetchKids } from "@/actions/learners";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import CreateChildProfile from "@/components/Home/CreateChildProfile";
import { SimpleInput } from "@/components/Input";
import LearnerCard, {
  LearnerCardSkeleton,
} from "@/components/Learners/LearnersCard";
import { IGuardianKids } from "@/types";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Learners() {
  const [filteredData, setFilteredData] = useState<IGuardianKids[]>([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["guardian-kids"],
    queryFn: async () => {
      return await fetchKids();
    },
  });

  useEffect(() => {
    if (!data) return;
    if (search) {
      setFilteredData(
        data?.filter((d) =>
          d.name?.toLowerCase()?.includes(search?.toLowerCase()),
        ),
      );
      return;
    }
    setFilteredData(data);
  }, [data, search]);

  return (
    <SafeAreaView style={{ backgroundColor: "#DBEFDC", flex: 1 }}>
      {!isLoading && !!!data?.length && (
        <View className="items-center px-12 justify-center flex-1 relative">
          <Image
            className="mb-4"
            style={{ width: scaleWidth(149), height: scaleHeight(124) }}
            source={IMAGES.LearnerPlaceholder}
          />
          <Text className="text-[#265828] font-sansSemiBold text-[20px] text-center mb-4">
            No Progress to Show Yet
          </Text>
          <Text className="text-dark text-center font-sans mb-6">
            Once you add a child and they start learning, their progress will
            appear here.
          </Text>
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
          <Button
            onPress={() => setOpenModal(true)}
            className="w-full"
            text="ADD KID PROFILE"
          />
        </View>
      )}
      {(isLoading || !!data?.length) && (
        <FlatList
          ListHeaderComponent={
            <>
              <Text className="text-[24px] font-sansSemiBold text-center text-dark leading-[1.3]">
                Choose a Learner Profile to Continue
              </Text>
              <Text className="text-[16px] font-sans text-dark text-center leading-[1.5] mt-4">
                Pick from the profiles below to view learning progress or access
                the platform as a learner.
              </Text>
              <Button
                onPress={() => setOpenModal(true)}
                className="mt-8"
                text="ADD CHILD PROFILE"
              />
              <SimpleInput
                displayIcon={<ICONS.Search />}
                placeholderColor="#918E91"
                containerClass="bg-white border-0 mt-6"
                placeholder="Search by name..."
                name="search"
                value={search}
                handleChange={setSearch}
              />
              <Text className="text-dark font-sansMedium mt-3 text-[16px] mb-6">
                Total Kids: {filteredData?.length || 0}
              </Text>
            </>
          }
          ListEmptyComponent={isLoading ? <LearnerCardSkeleton /> : null}
          data={filteredData}
          renderItem={({ item }) => <LearnerCard {...item} />}
          className="flex-1 mt-6 px-6 py-5"
          showsVerticalScrollIndicator={false}
        />
      )}
      <CreateChildProfile
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </SafeAreaView>
  );
}
