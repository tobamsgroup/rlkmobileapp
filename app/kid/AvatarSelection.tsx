import { ICONS } from "@/assets/icons";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { useKidAvatars } from "@/hooks/useKidAvatars";
import { IAvatar } from "@/types";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

const AvatarSelection = () => {
  const { data, isLoading } = useKidAvatars();
  const [selected, setSelected] = useState("");

  const onSave = () => {
    if (!selected) {
      showToast("error", "Please select an Avatar!");
      return;
    }
    router.navigate("/kid/AIPopup");
  };
  return (
    <Container backgroundColor="#DBEFDC">
      <View
        style={{ paddingHorizontal: scaleWidth(24) }}
        className=" py-5 z-10"
      >
        <Pressable
          style={{ width: scaleWidth(32), height: scaleWidth(32) }}
          className="w-8 h-8 rounded-full border-[#EFEFF3] bg-[#FFFFFF] border items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ICONS.ChevronLeft width={14} height={14} />
        </Pressable>
        <Text className="text-dark text-[24px] font-sansSemiBold text-center">
          Select Your Avatar
        </Text>
        <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-12">
          Swipe to pick a character to guide you on your learning adventure. You
          can always change it later.
        </Text>
        <FlatList
          data={data}
          showsHorizontalScrollIndicator={false}
          horizontal
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <AvatarCard
              item={item}
              isSelected={selected === item.id}
              onSelect={() => setSelected(item.id)}
            />
          )}
          contentContainerStyle={{ gap: scaleWidth(12) }}
        />

        <Button
          onPress={onSave}
          style={{ marginTop: scaleHeight(72) }}
          text="SAVE"
        />
        <Button
          onPress={() => router.navigate("/kid/AIPopup")}
          text="SKIP FOR LATER"
          className="bg-white border-2 border-[#D3D2D3] mt-4"
          textClassname="text-[#221D23]"
        />
      </View>
      <View className="absolute top-0 right-0 z-0">
        <ICONS.HalfCircle />
      </View>
      <View className="absolute bottom-[25%] right-0 z-0">
        <ICONS.HalfCircle />
      </View>
      <View className="absolute top-[18%] left-0 z-0 rotate-180">
        <ICONS.HalfCircle />
      </View>
      <View className="absolute bottom-0 left-0 z-0 rotate-180">
        <ICONS.HalfCircle />
      </View>
    </Container>
  );
};

const AvatarCard = ({
  item,
  isSelected,
  onSelect,
}: {
  isSelected: boolean;
  item: IAvatar;
  onSelect: () => void;
}) => {
  return (
    <Pressable
      onPress={onSelect}
      style={{
        height: scaleHeight(148),
        width: scaleHeight(141),
        borderRadius: scaleWidth(20),
      }}
      className={twMerge(
        "bg-white items-center justify-center relative",
        isSelected && "bg-[#A6D7A8]"
      )}
    >
      <Image
        style={{ height: scaleWidth(100), width: scaleWidth(100) }}
        className={twMerge(
          "w-full h-full rounded-full border-2 border-[#FFD700]",
          isSelected && " border-[#099137]"
        )}
        source={{ uri: item.url }}
      />
      {isSelected && (
        <View
          style={{ top: scaleHeight(26), right: scaleHeight(17) }}
          className="bg-white border border-primary rounded-full absolute"
        >
          <ICONS.AlertSucess width={33} height={33} />
        </View>
      )}
    </Pressable>
  );
};

export default AvatarSelection;
