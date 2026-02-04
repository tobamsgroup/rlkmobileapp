import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import ProgressBar from "@/components/ProgressBar";
import TopBackButton from "@/components/TopBackButton";
import { scaleHeight, scaleWidth, SCREEN_WIDTH } from "@/utils/scale";
import Constants from "expo-constants";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const Profile = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#DBEFDC" }}
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-[#DBEFDC] flex-1 relative">
        <Image
          style={{ width: SCREEN_WIDTH, height: scaleHeight(256) }}
          source={IMAGES.MoreOverlay}
        />
        {/* 
        {isLoading ? (
          <Skeleton
            style={{
              width: scaleWidth(130),
              height: scaleWidth(130),
              top: scaleHeight(256) - 75,
              left: SCREEN_WIDTH / 2 - 81,
            }}
            className="border-2 border-white rounded-full absolute "
          />
        ) : ( */}
        <Image
          className="border-2 border-[#FFDE2A] rounded-full absolute "
          style={{
            width: scaleWidth(130),
            height: scaleWidth(130),
            top: scaleHeight(256) - 75,
            left: SCREEN_WIDTH / 2 - 81,
          }}
          source={
            // data?.picture
            // ? { uri: ensureHttps(data?.picture) }
            IMAGES.KidProfilePlaceholder
          }
        />
        <Pressable
          style={{ top: scaleHeight(256) + 23, left: SCREEN_WIDTH / 2 + 35 }}
          className="w-14 absolute h-14 bg-white rounded-full items-center justify-center border-[1.5px] border-[#DBEFDC]"
        >
          <ICONS.Pencil stroke={"#3F9243"} />
        </Pressable>
        {/* )} */}
        <Pressable
          style={{
            top: Constants.statusBarHeight + 20,
          }}
          className="absolute left-[24px]"
        >
          <TopBackButton />
        </Pressable>

        <Text
          style={{ top: scaleHeight(88) }}
          className="text-white text-[20px] font-sansSemiBold absolute text-center w-full"
        >
          My Profile
        </Text>

        <View
          style={{ marginTop: scaleHeight(80) }}
          className="items-center px-6 flex-1 pb-6"
        >
          <View className="bg-white border-[#C3E4C5] border-[0.5px] p-5 rounded-[20px] w-full items-center">
            <Text className="text-[18px] font-sansMedium text-dark">
              Alexandar Bob
            </Text>
            <Text className="text-[16px] text-[#474348] font-sans mt-2">
              @alexbob1
            </Text>
            <View>
              <Text className="text-[16px] text-[#474348] font-sans mt-2">
                12 Years
              </Text>
              <Text></Text>
            </View>
            <View className="p-4 rounded-[8px] bg-[#FFF7CCB2] w-full flex-row  items-center justify-center gap-3">
              <Image
                style={{
                  width: scaleWidth(28),
                  height: scaleWidth(28),
                }}
                source={IMAGES.BadgeTrophy}
              />
              <Text className="text-[16px] text-dark font-sansMedium">
                Learner
              </Text>
            </View>
          </View>

          <View className="bg-white mt-6 border-[#C3E4C5] border-[0.5px] p-5 rounded-[20px] w-full ">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="rounded-full bg-[#DBEFDC66] w-10 h-10 items-center justify-center">
                <ICONS.Trophy />
              </View>
              <Text className="text-[20px] text-dark font-sansSemiBold">
                Level 5
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-4">
              <Text className="text-[16px] text-[#6C686C] font-sans">
                Total XP:
              </Text>
              <Text className="text-[20px] text-[#265828] font-sansSemiBold">
                1000 XP
              </Text>
              <Image
                style={{
                  width: scaleWidth(25),
                  height: scaleWidth(25),
                }}
                source={IMAGES.Star}
              />
            </View>
            <ProgressBar height={14} percent={20} />
            <View className="mt-5 flex-row items-center justify-between">
              <Text className="text-[16px] text-[#6C686C] font-sans">
                Next Level at
                <Text className="text-[16px] font-sansSemiBold text-dark">
                  {" "}
                  1,500 XP
                </Text>{" "}
              </Text>
              <Text className="text-[16px] text-[#6C686C] font-sans">
                <Text className="text-[16px] font-sansSemiBold text-dark">
                  +260
                </Text>{" "}
                to go!
              </Text>
            </View>
          </View>

          <View className="bg-white mt-6 border-[#D3D2D3] border p-5 rounded-[20px] w-full ">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[16px] text-dark font-sansSemiBold">
                Badges
              </Text>
              <Text className="font-sansMedium text-[#337535] underline">
                VIEW ALL
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {[1, 2, 3, 4]?.map((i) => (
                <View
                  key={i}
                  className=" w-[48%] border-[#D3D2D366] rounded-[12px] border-[0.5px] p-3 items-center"
                >
                  <Image
                    className=" rounded-full "
                    style={{
                      width: scaleWidth(56),
                      height: scaleWidth(56),
                    }}
                    source={IMAGES.LockedTrophy}
                  />
                  <Text className="text-dark text-[12px] font-sansMedium mt-2">
                    Lesson Lover
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="bg-white mt-6 border-[#C3E4C5] border-[0.5px] p-5 rounded-[20px] w-full ">
            <Text className="text-[18px] font-sansSemiBold text-dark mb-5">
              Recent Activity
            </Text>

            <View className="p-3 flex-row rounded-[16px] gap-3 border border-[#D3D2D3] mb-6">
              <ICONS.Star2 />
              <View className="gap-1 flex-1">
                <Text className="text-dark font-sansMedium text-[16px] mb-2">
                  +20 XP – Completed Chapter Quiz
                </Text>
                {/* <Text className="font-sans text-[#474348]">{a?.title}</Text> */}
                <Text className="font-sans text-[#474348]">Today, 3:12 PM</Text>
              </View>
            </View>
            <View className="p-3 flex-row rounded-[16px] gap-3 border border-[#D3D2D3] mb-6">
              <ICONS.Star2 />
              <View className="gap-1 flex-1">
                <Text className="text-dark font-sansMedium text-[16px] mb-2">
                  +20 XP – Completed Chapter Quiz
                </Text>
                {/* <Text className="font-sans text-[#474348]">{a?.title}</Text> */}
                <Text className="font-sans text-[#474348]">Today, 3:12 PM</Text>
              </View>
            </View>
            <View className="p-3 flex-row rounded-[16px] gap-3 border border-[#D3D2D3] mb-6">
              <ICONS.Star2 />
              <View className="gap-1 flex-1">
                <Text className="text-dark font-sansMedium text-[16px] mb-2">
                  +20 XP – Completed Chapter Quiz
                </Text>
                {/* <Text className="font-sans text-[#474348]">{a?.title}</Text> */}
                <Text className="font-sans text-[#474348]">Today, 3:12 PM</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
