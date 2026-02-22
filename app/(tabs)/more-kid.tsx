import { handleLogout } from '@/actions/logout';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import { useAppDispatch } from '@/hooks/redux';
import { scaleHeight, scaleWidth, SCREEN_WIDTH } from '@/utils/scale';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

const MoreKid = () => {
  const dispatch = useAppDispatch();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#DBEFDC' }}
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
        {/* )} */}

        <Text
          style={{ top: scaleHeight(88) }}
          className="text-white text-[20px] font-sansSemiBold absolute text-center w-full"
        >
          Account
        </Text>
        <View
          style={{ marginTop: scaleHeight(80) }}
          className="items-center px-6 flex-1 pb-6"
        >
          {/* {isLoading ? (
          <Skeleton className="w-1/2 rounded-full" />
        ) : ( */}
          <Text className="text-[20px] font-sansSemiBold text-dark">
            Hi, Alexandar Bob!
          </Text>
          {/* )} */}
          <View className="flex-row items-center gap-2 rounded-full py-1 px-4 mt-2">
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
          <View className="w-full bg-[#FFFFFF] rounded-[20px] p-5 mt-5 flex-1">
            <Pressable
              onPress={() => router.push('/kid/Profile')}
              className="flex-row items-center gap-2 pb-6 border-b border-b-[#D3D2D366]"
            >
              <View className="items-center justify-center w-10 h-10 rounded-full bg-[#0991371A]">
                <ICONS.User />
              </View>
              <Text className="text-dark text-[16px] font-sansMedium flex-1">
                Profile
              </Text>
              <ICONS.ChevronRight />
            </Pressable>
            <Pressable
              onPress={() => router.push('/kid/ParentAccess')}
              className="flex-row items-center gap-2 py-6 border-b border-b-[#D3D2D366]"
            >
              <View className="items-center justify-center w-10 h-10 rounded-full bg-[#D5B3001A]">
                <ICONS.User fill={'#D5B300'} />
              </View>
              <Text className="text-dark text-[16px] font-sansMedium flex-1">
                Parent/Teacher View
              </Text>
              <ICONS.ChevronRight />
            </Pressable>
            <Pressable
              onPress={() => router.push('/kid/Settings')}
              className="flex-row items-center gap-2 py-6 border-b border-b-[#D3D2D366]"
            >
              <View className="items-center justify-center w-10 h-10 rounded-full bg-[#1671D91A]">
                <ICONS.Settings />
              </View>
              <Text className="text-dark text-[16px] font-sansMedium flex-1">
                Settings
              </Text>
              <ICONS.ChevronRight />
            </Pressable>
            <Pressable
              onPress={() => handleLogout(dispatch)}
              className="flex-row items-center gap-2 pt-6"
            >
              <View className="items-center justify-center w-10 h-10 rounded-full bg-[#DE21211A]">
                <ICONS.Logout />
              </View>
              <Text className="text-dark text-[16px] font-sansMedium flex-1">
                Log Out
              </Text>
              <ICONS.ChevronRight />
            </Pressable>
            <View className="flex-row items-center justify-around mt-12">
              <Text
                onPress={() =>
                  Linking.openURL('https://rlkids.ai/privacy-policy')
                }
                className="text-[#474348] font-sansMedium "
              >
                Privacy Policy
              </Text>
              <View className="w-1 h-1 rounded-full bg-[#474348]" />
              <Text
                onPress={() =>
                  Linking.openURL('https://rlkids.ai/terms-and-conditions')
                }
                className="text-[#474348] font-sansMedium "
              >
                Terms of Service
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MoreKid;
