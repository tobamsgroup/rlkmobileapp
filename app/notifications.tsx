import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Container from "@/components/Container";
import { scaleWidth } from "@/utils/scale";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

const Notifications = () => {
  const [type, setType] = useState("all");
  return (
    <Container backgroundColor="#DBEFDC">
      <View className="px-6 py-5 flex-1">
        <Pressable
          onPress={() => router.back()}
          style={{
            width: scaleWidth(32),
            height: scaleWidth(32),
          }}
          className="rounded-full bg-white items-center justify-center"
        >
          <ICONS.ChevronLeft width={scaleWidth(14)} height={scaleWidth(14)} />
        </Pressable>
        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          Notifications
        </Text>
        <View className="bg-white rounded-[16px] flex-row px-5">
          <Pressable
            onPress={() => setType("all")}
            className={twMerge(
              " border-b-[#3F9243] py-4 flex-1 items-center justify-center",
              type === "all" && "border-b"
            )}
          >
            <Text
              className={twMerge(
                "text-[16px] font-sansSemiBold text-dark",
                type === "all" && "text-primary"
              )}
            >
              ALL
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setType("unread")}
            className={twMerge(
              " border-b-[#3F9243] py-4 flex-1 items-center justify-center",
              type === "unread" && "border-b"
            )}
          >
            <Text
              className={twMerge(
                "text-[16px] font-sansSemiBold text-dark",
                type === "unread" && "text-primary"
              )}
            >
              UNREAD
            </Text>
          </Pressable>
        </View>

        <Pressable className="mt-6 flex-row items-center gap-2.5">
          <Text className="underline font-sansMedium text-primary">
            MARK ALL AS READ
          </Text>
          <ICONS.Check />
        </Pressable>

        <View
          className="bg-white rounded-[8px] p-5 mt-5 flex-1"
        >
          <FlatList
            scrollEnabled
            data={[1, 2]}
            renderItem={() => <NotificationCard />}
            contentContainerClassName="gap-4 "
            keyExtractor={(_, index) => index.toString()}
            className="flex-grow "
          />
          {/* <View className="w-full h-full items-center justify-center">
            <Text className="font-sansSemiBold text-dark text-[16px] mb-4">
              You’re all caught up!
            </Text>
            <Image
              style={{ width: scaleWidth(181), height: scaleWidth(148) }}
              source={IMAGES.NoNotification}
            />
          </View> */}
        </View>
      </View>
    </Container>
  );
};

const NotificationCard = () => {
  return (
    <View className="border-b border-b-[#D3D2D366] pb-6">
      <Image
        style={{ width: scaleWidth(40), height: scaleWidth(40) }}
        source={IMAGES.KidProfilePlaceholder}
        className="rounded-full"
      />
      <View className="flex-row items-center gap-3 justify-between">
        <Text className="leading-[1.5] font-sans text-dark text-[16px] flex-shrink mt-4">
          Alex completed ‘Understanding Needs vs Wants njdjndjwndjwd
        </Text>
        <View className="w-2.5 h-2.5 rounded-full bg-[#DE2121]" />
      </View>
      <Text className="leading-[1.5] font-sans text-dark mt-2">2 Mins ago</Text>
    </View>
  );
};

export default Notifications;
