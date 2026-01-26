import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";

import { ICONS } from "@/assets/icons";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getData } from "@/lib/storage";
import { GuardianLoginSession } from "@/types";
import { SCREEN_WIDTH } from "@/utils/scale";
import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<GuardianLoginSession | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getData<GuardianLoginSession>("user");
      setUser(data);
    };
    fetchUser();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0F2310",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 12,
          height: 126,
        },
        tabBarLabelStyle: {
          fontFamily: "Sans-Medium",
          color: "white",
          fontSize: 12,
        },
        tabBarItemStyle: {
          flex: 1,
        },
        tabBarLabel: () => null,
      }}
    >
      <Tabs.Protected guard={user?.role?.toLowerCase() !== "kid"}>
        <Tabs.Screen
          name="index"
          options={() => ({
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.25,
                }}
                className="items-center flex-1"
              >
                <View
                  className={twMerge(
                    "w-[46px] h-[46px] rounded-[32px] border-r border-l border-[#3F9243] items-center justify-center border-t-4 border-t-[#3F9243] bg-[#265828]",
                    focused && "border-2 border-[#A6D7A8] bg-[#6ABC6D]",
                  )}
                >
                  <ICONS.Home fill={focused ? "#193A1B" : "#96D41B"} />
                </View>
                <Text className="font-sansMedium text-[12px] text-white mt-1">
                  Home
                </Text>
              </View>
            ),
          })}
        />
        <Tabs.Screen
          name="learners"
          options={{
            title: "learners",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.25,
                }}
                className="items-center flex-1"
              >
                <View
                  className={twMerge(
                    "w-[46px] h-[46px] rounded-[32px] border-r border-l border-[#3F9243] items-center justify-center border-t-4 border-t-[#3F9243] bg-[#265828]",
                    focused && "border-2 border-[#A6D7A8] bg-[#6ABC6D]",
                  )}
                >
                  <ICONS.ChildCare fill={focused ? "#193A1B" : "#FFD700"} />
                </View>
                <Text className="font-sansMedium text-[12px] text-white mt-1">
                  Learners
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="curriculum"
          options={{
            title: "curriculum",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.25,
                }}
                className="items-center flex-1"
              >
                <View
                  className={twMerge(
                    "w-[46px] h-[46px] rounded-[32px] border-r border-l border-[#3F9243] items-center justify-center border-t-4 border-t-[#3F9243] bg-[#265828]",
                    focused && "border-2 border-[#A6D7A8] bg-[#6ABC6D]",
                  )}
                >
                  <ICONS.Curriculum fill={focused ? "#193A1B" : "#EE9922"} />
                </View>
                <Text className="font-sansMedium text-[12px] text-white mt-1">
                  Curriculum
                </Text>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="more"
          options={{
            title: "more",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.25,
                }}
                className="items-center flex-1"
              >
                <View
                  className={twMerge(
                    "w-[46px] h-[46px] rounded-[32px] border-r border-l border-[#3F9243] items-center justify-center border-t-4 border-t-[#3F9243] bg-[#265828]",
                    focused && "border-2 border-[#A6D7A8] bg-[#6ABC6D]",
                  )}
                >
                  <ICONS.More fill={focused ? "#193A1B" : "#DBEFDC"} />
                </View>
                <Text className="font-sansMedium text-[12px] text-white mt-1">
                  More
                </Text>
              </View>
            ),
          }}
        />
      </Tabs.Protected>

      <Tabs.Protected guard={user?.role?.toLowerCase() === "kid"}>
        <Tabs.Screen
          name="home-kid"
          options={() => ({
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.25,
                }}
                className="items-center flex-1"
              >
                <View
                  className={twMerge(
                    "w-[46px] h-[46px] rounded-[32px] border-r border-l border-[#3F9243] items-center justify-center border-t-4 border-t-[#3F9243] bg-[#265828]",
                    focused && "border-2 border-[#A6D7A8] bg-[#6ABC6D]",
                  )}
                >
                  <ICONS.Home fill={focused ? "#193A1B" : "#96D41B"} />
                </View>
                <Text className="font-sansMedium text-[12px] text-white mt-1">
                  Home
                </Text>
              </View>
            ),
          })}
        />
        <Tabs.Screen
          name="mylearning"
          options={() => ({
            title: "My Learning",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.25,
                }}
                className="items-center flex-1"
              >
                <View
                  className={twMerge(
                    "w-[46px] h-[46px] rounded-[32px] border-r border-l border-[#3F9243] items-center justify-center border-t-4 border-t-[#3F9243] bg-[#265828]",
                    focused && "border-2 border-[#A6D7A8] bg-[#6ABC6D]",
                  )}
                >
                  <ICONS.Curriculum fill={focused ? "#193A1B" : "#EE9922"} />
                </View>
                <Text className="font-sansMedium text-[12px] text-white mt-1">
                  My Learning
                </Text>
              </View>
            ),
          })}
        />
        <Tabs.Screen
          name="badges"
          options={() => ({
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.25,
                }}
                className="items-center flex-1"
              >
                <View
                  className={twMerge(
                    "w-[46px] h-[46px] rounded-[32px] border-r border-l border-[#3F9243] items-center justify-center border-t-4 border-t-[#3F9243] bg-[#265828]",
                    focused && "border-2 border-[#A6D7A8] bg-[#6ABC6D]",
                  )}
                >
                  <ICONS.AwardStar fill={focused ? "#193A1B" : "#FFD700"} />
                </View>
                <Text className="font-sansMedium text-[12px] text-white mt-1">
                  Badges
                </Text>
              </View>
            ),
          })}
        />

        <Tabs.Screen
          name="more-kid"
          options={{
            title: "more",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: SCREEN_WIDTH * 0.25,
                }}
                className="items-center flex-1"
              >
                <View
                  className={twMerge(
                    "w-[46px] h-[46px] rounded-[32px] border-r border-l border-[#3F9243] items-center justify-center border-t-4 border-t-[#3F9243] bg-[#265828]",
                    focused && "border-2 border-[#A6D7A8] bg-[#6ABC6D]",
                  )}
                >
                  <ICONS.More fill={focused ? "#193A1B" : "#DBEFDC"} />
                </View>
                <Text className="font-sansMedium text-[12px] text-white mt-1">
                  More
                </Text>
              </View>
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
