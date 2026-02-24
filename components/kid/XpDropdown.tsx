import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import useKidProfile from '@/hooks/useKidProfile';
import { calculateXpLevel } from '@/utils/kid';
import { scaleWidth } from '@/utils/scale';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Svg, { Path } from 'react-native-svg';
import ProgressBar from '../ProgressBar';

const XpDropdown = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { data: profile } = useKidProfile();

  const xpInfo = useMemo(() => {
    return calculateXpLevel(profile?.totalXp || 0);
  }, [profile]);

  return (
    <ReactNativeModal
      isVisible={open}
      style={{ margin: 0, padding: 0 }}
      backdropColor="#0000004D"
    >
      <Pressable className="flex-1 bg-black/40 justify-center items-center px-6">
        <View
          style={{ paddingRight: scaleWidth(100) }}
          className="w-full items-end"
        >
          <Svg width={40} height={20} viewBox="0 0 40 20">
            <Path
              d="M0 20 L20 0 L40 20 Z"
              fill="#193A1B"
              stroke="#193A1B"
              strokeWidth={1}
            />
          </Svg>
        </View>
        <Pressable className="bg-[#193A1B] py-5 px-6 rounded-3xl w-full">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row justify-between items-center">
              <Text className="font-sansSemiBold text-[20px] text-white">
                Your XP Tracker ✨
              </Text>
              <Pressable
                onPress={onClose}
                className="bg-[#FFFFFFCC] rounded-full items-center justify-center"
                style={{
                  width: scaleWidth(32),
                  height: scaleWidth(32),
                }}
              >
                <ICONS.Close width={scaleWidth(17)} height={scaleWidth(17)} />
              </Pressable>
            </View>

            <View className="my-6 h-[1px] bg-[#265828]" />

            {/* Total XP */}
            <View className="flex-row items-center">
              <Text className="text-[18px] font-sansSemiBold text-white">
                Total XP:
              </Text>
              <Text className="text-[24px] text-[#DBEFDC] font-sansSemiBold ml-4 mr-1.5">
                {profile?.totalXp} XP
              </Text>
              <Image
                source={IMAGES.Badge}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </View>

            {/* Level Card */}
            <View className="mt-6 bg-white rounded-xl p-4">
              <View className="flex-row items-center justify-between">
                <Text className="font-sansMedium text-[18px] text-black">
                  🏅 Level {xpInfo?.currentLevel}
                </Text>
                <Text className="font-sansMedium text-[18px] text-black">
                  {profile?.totalXp}/{xpInfo?.nextLevelXp} XP
                </Text>
              </View>

              <View className="flex-row items-center justify-between w-full gap-5 mt-3">
                <View className="flex-1">
                  <ProgressBar
                    percent={xpInfo?.progressPercent || 0}
                    height={12}
                  />
                </View>

                <View className="rounded-sm w-10 h-10 bg-[#D3D2D366] flex items-center justify-center">
                  <Image
                    source={IMAGES.LearnerTrophy}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                </View>
              </View>

              <Text className="font-sansMedium text-lg text-black mt-3">
                Next Level at {xpInfo?.nextLevelXp} XP (+
                {xpInfo?.xpToNextLevel} to go!)
              </Text>
            </View>

            {/* Badges Section */}
            <View className="mt-6 bg-[#FFF7CC] rounded-xl p-4 border-2 border-b-4 border-[#FFDE2A]">
              <Text className="text-black text-[16px] font-sansMedium">
                🏅 Badges to Unlock
              </Text>

              <View className="mt-4 gap-3">
                {[1, 2, 3].map((item) => (
                  <View
                    key={item}
                    className="bg-[#FAFDFF] rounded-lg p-3 flex-row items-center gap-3"
                  >
                    <Image
                      style={{
                        width: scaleWidth(48),
                        height: scaleWidth(48),
                      }}
                      source={IMAGES.NoBadge}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />

                    <View>
                      <Text className="font-sansMedium text-[16px] text-black">
                        Deep Thinker
                      </Text>
                      <Text className="text-[#474348] font-sans ">
                        Unlock at {xpInfo?.nextLevelXp} XP
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </ReactNativeModal>
  );
};

export default XpDropdown;
