import { ICONS } from "@/assets/icons";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { SimpleInput } from "@/components/Input";
import LearnerCard from "@/components/Learners/LearnersCard";
import AllLearners from "@/components/Learners/LearnersCard";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Learners() {
  return (
    <Container edges={["top"]}  backgroundColor="#DBEFDC">
    <FlatList
      ListHeaderComponent={
        <>
          <Text className="text-[24px] font-sansSemiBold text-center text-dark leading-[1.3]">
            Choose a Learner Profile to Continue
          </Text>
          <Text className="text-[16px] font-sans text-dark text-center leading-[1.5] mt-4">
            Pick from the profiles below to view learning progress or access the
            platform as a learner.
          </Text>
          <Button className="mt-8" text="ADD CHILD PROFILE" />
          <SimpleInput
            displayIcon={<ICONS.Search />}
            placeholderColor="#918E91"
            containerClass="bg-white border-0 mt-6"
            placeholder="Search by name..."
            name="search"
          />
          <Text className="text-dark font-sansMedium mt-2 text-[16px]">
            Total Kids: 8
          </Text>
        </>
      }
      data={[1, 2, 3, 4, 5]}
      renderItem={() => <LearnerCard />}
      className="flex-1 mt-6 px-6 py-5"
      showsVerticalScrollIndicator={false}
    />
    </Container>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
