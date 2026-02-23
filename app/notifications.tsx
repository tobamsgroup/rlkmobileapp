import { getAllNotifications, updateMarkallRead } from "@/actions/notification";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Skeleton from "@/components/Skeleton";
import { NotificationProp } from "@/types";
import { timeAgo } from "@/utils";
import { HAPTIC } from "@/utils/haptic";
import { invalidateQueries } from "@/utils/query";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

const Notifications = () => {
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<NotificationProp[]>([]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notificationssmfimiofmr"],
    queryFn: async () => {
      return await getAllNotifications();
    },
  });


  useEffect(() => {
    if (!notifications) return;

    if (type === "all") {
      setData(notifications);
    } else {
      setData(notifications.filter((n) => !n.isRead));
    }
  }, [notifications, type]);

  const markAll = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await updateMarkallRead();
      invalidateQueries("notifications");
      showToast("success", "All notifications marked as read");
      HAPTIC.success();
    } catch (error) {
      console.error("Failed to mark all as read", error);
      showToast("error", "Please try again!");
      HAPTIC.error();
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#DBEFDC" }}>
      <View className="px-6 py-5 bg-[#DBEFDC] flex-1">
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
              type === "all" && "border-b",
            )}
          >
            <Text
              className={twMerge(
                "text-[16px] font-sansSemiBold text-dark",
                type === "all" && "text-primary",
              )}
            >
              ALL
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setType("unread")}
            className={twMerge(
              " border-b-[#3F9243] py-4 flex-1 items-center justify-center",
              type === "unread" && "border-b",
            )}
          >
            <Text
              className={twMerge(
                "text-[16px] font-sansSemiBold text-dark",
                type === "unread" && "text-primary",
              )}
            >
              UNREAD
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={markAll}
          className="mt-6 flex-row items-center gap-2.5"
        >
          <Text className="underline font-sansMedium text-primary">
            {!loading ? "MARK ALL AS READ" : "MARKING...."}
          </Text>
          <ICONS.Check />
        </Pressable>

        <View className="bg-white rounded-[8px] p-5 mt-5 flex-1">
          {isLoading ? (
            <FlatList
              data={[1, 2, 3]}
              renderItem={() => <NotificationCardSkeleton />}
              contentContainerClassName="gap-4 "
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              className="flex-1"
            />
          ) : (
            <FlatList
              data={data}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center">
                  <View
                    style={{ marginTop: scaleHeight(150) }}
                    className="w-full h-full items-center justify-center"
                  >
                    <Text className="font-sansSemiBold text-dark text-[16px] mb-4">
                      You’re all caught up!
                    </Text>
                    <Image
                      style={{
                        width: scaleWidth(181),
                        height: scaleWidth(148),
                      }}
                      source={IMAGES.NoNotification}
                    />
                  </View>
                </View>
              }
              renderItem={({ item }) => <NotificationCard {...item} />}
              contentContainerClassName="gap-4 "
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              className="flex-1"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const NotificationCard = (props: NotificationProp) => {
  return (
    <View className="border-b border-b-[#D3D2D366] pb-6">
      <Image
        style={{ width: scaleWidth(40), height: scaleWidth(40) }}
        source={IMAGES.KidProfilePlaceholder}
        className="rounded-full"
      />
      <View className="flex-row items-center gap-3 justify-between">
        <Text className="leading-[1.5] font-sans text-dark text-[16px] flex-shrink mt-4">
          {props?.message}
        </Text>
        {!props?.isRead && (
          <View className="w-2.5 h-2.5 rounded-full bg-[#DE2121]" />
        )}
      </View>
      <Text className="leading-[1.5] font-sans text-dark mt-2">
        {timeAgo(props?.createdAt!)}
      </Text>
    </View>
  );
};
const NotificationCardSkeleton = () => {
  return (
    <View className="border-b border-b-[#D3D2D366] pb-6">
      <Skeleton
        className="rounded-full mt-4"
        style={{ width: scaleWidth(40), height: scaleWidth(40) }}
      />
      <Skeleton className="h-[100px] w-full mt-4" />
      <Skeleton className="w-1/2 mt-2" />
    </View>
  );
};

export default Notifications;
