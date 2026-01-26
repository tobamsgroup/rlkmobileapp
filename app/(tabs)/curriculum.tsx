import { getCurriculumStats } from "@/actions/curriculum";
import { ICONS } from "@/assets/icons";
import Container from "@/components/Container";
import CurriculumCard, {
  CurriculumCardSkeleton,
} from "@/components/Curriculum/CurriculumCard";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { useQuery } from "@tanstack/react-query";
import { Text, View } from "react-native";

export default function Curriculum() {
  const { data, isLoading } = useQuery({
    queryKey: ["curriculum"],
    queryFn: async () => {
      return await getCurriculumStats();
    },
  });

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

          {isLoading && (
            <>
              {[1, 2, 3, 4, 5]?.map((i) => (
                <CurriculumCardSkeleton key={i} />
              ))}
            </>
          )}
          {!isLoading && !!data?.length && (
            <>
              {data?.map((d, i) => (
                <CurriculumCard key={i} {...d} />
              ))}
            </>
          )}
        </View>
      </View>
    </Container>
  );
}
