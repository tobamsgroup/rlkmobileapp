import { Tabs, Redirect } from "expo-router";
import React from "react";

import { handleLogout } from "@/actions/logout";
import { ICONS } from "@/assets/icons";
import Button from "@/components/Button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useKidProfile from "@/hooks/useKidProfile";
import { GuardianLoginSession, KidLoginSession } from "@/types";
import { SCREEN_WIDTH } from "@/utils/scale";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import { twMerge } from "tailwind-merge";

const isSubscriptionExpired = (currentPeriodEnd: string | null | undefined) => {
  if (!currentPeriodEnd) return true;
  return new Date(currentPeriodEnd) < new Date();
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);

  const isKid = (user  as unknown as  KidLoginSession)?.role?.toLowerCase() === "kid";
  const { data: kidProfile, isLoading: isLoadingKidProfile } = useKidProfile();

  if (!isLoggedIn) return null;

  if ((user as unknown as GuardianLoginSession)?.deletionWarning) {
    return <Redirect href="/guardian/RestoreAccount" />;
  }

  const subscriptionExpired =
    isKid &&
    !isLoadingKidProfile &&
    isSubscriptionExpired(kidProfile?.guardianSubscription?.currentPeriodEnd);

  return (
    <>
    
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0F2310",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          paddingTop: 10,
          height: 136,
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
      <Tabs.Protected guard={(user as any)?.role?.toLowerCase() !== "kid"}>
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

      <Tabs.Protected guard={(user as any)?.role?.toLowerCase() === "kid"}>
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
{/* 
      <Modal isVisible={subscriptionExpired} backdropOpacity={0.85}>
        <View className="bg-[#FAFDFF] p-6 rounded-[20px] items-center">
          <View className="w-20 h-20 rounded-full bg-[#FFF3E0] items-center justify-center">
            <ICONS.ExclamationCircle strokeWidth={1} stroke="#E65100" width={36} height={36} />
          </View>
          <Text className="text-[20px] font-sansSemiBold text-dark text-center mt-6">
            Learning Paused
          </Text>
          <Text className="text-center font-sans text-[#474348] leading-[1.5] mt-4">
            Your parent's subscription has ended. Ask your parent to renew it so
            you can continue your learning journey!
          </Text>
          <Button
            onPress={() => handleLogout(dispatch)}
            className="w-full mt-8 bg-primary border-none border-b-0"
            textClassname="text-white"
            text="LOG OUT"
          />
        </View>
      </Modal> */}
    </>
  );
}
