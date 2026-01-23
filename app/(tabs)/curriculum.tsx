import { ICONS } from "@/assets/icons";
import Container from "@/components/Container";
import CurriculumCard from "@/components/Curriculum/CurriculumCard";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { StyleSheet, Text, View } from "react-native";

export default function Curriculum() {
  return (
    <Container scrollable edges={["top"]}>
      <View className="px-6 py-5 relative z-20">
        <ICONS.Star
          width={27}
          height={27}
          style={{ position: "absolute", zIndex: 10, bottom: "20%" }}
          fill={"#FFD700"}
        />
        <ICONS.Star
          width={27}
          height={27}
          style={{
            position: "absolute",
            zIndex: 10,
            right: scaleWidth(11),
            top: scaleHeight(80),
          }}
          fill={"#1671D9"}
        />
        <Text className="text-[24px] font-sansSemiBold  text-dark leading-[1.3]">
          Curriculum
        </Text>
        <Text className="text-[16px] font-sansMedium text-dark  leading-[1.5] mt-2">
          Browse and manage learning tracks for learners.
        </Text>
        <View className="bg-[#000F1F] px-8 py-4 rounded-[16px] mt-8 z-20">
          <Text className="font-sansSemiBold text-white text-[18px] mb-6">
            Explore Our Think Series
          </Text>

          <CurriculumCard />
          <CurriculumCard />
        </View>
      </View>
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
