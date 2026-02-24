import { getRecentActivities } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import ProgressBar from '@/components/ProgressBar';
import Skeleton from '@/components/Skeleton';
import TopBackButton from '@/components/TopBackButton';
import useKidLearningOverview from '@/hooks/useKidLearning';
import useKidProfile from '@/hooks/useKidProfile';
import { ensureHttps, formatFriendlyDate } from '@/utils';
import { calculateXpLevel, getFormattedSeriesOverview } from '@/utils/kid';
import { scaleHeight, scaleWidth, SCREEN_WIDTH } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

const Profile = () => {
  const { data, isLoading } = useKidProfile();
  const { data: overview, isLoading: isLoafingOverview } =
    useKidLearningOverview();

  const xpInfo = useMemo(() => {
    return calculateXpLevel(data?.totalXp || 0);
  }, [data]);

  const tracks = useMemo(() => {
    if (!overview) return [];
    return getFormattedSeriesOverview(overview);
  }, [overview]);

  const { data: activities } = useQuery({
    queryKey: ['kid-activities'],
    queryFn: async () => {
      return await getRecentActivities();
    },
  });

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
        ) : (
          <Image
            className="border-2 border-[#FFDE2A] rounded-full absolute "
            style={{
              width: scaleWidth(130),
              height: scaleWidth(130),
              top: scaleHeight(256) - 75,
              left: SCREEN_WIDTH / 2 - 81,
            }}
            source={
              data?.picture
                ? { uri: ensureHttps(data?.picture) }
                : IMAGES.KidProfilePlaceholder
            }
          />
        )}
        <Pressable
          onPress={() => router.push('/kid/ChangeAvatar')}
          style={{ top: scaleHeight(256) + 23, left: SCREEN_WIDTH / 2 + 35 }}
          className="w-14 absolute h-14 bg-white rounded-full items-center justify-center border-[1.5px] border-[#DBEFDC]"
        >
          <ICONS.Pencil stroke={'#3F9243'} />
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
              {data?.name}
            </Text>
            <Text className="text-[16px] text-[#474348] font-sans mt-2">
              @{data?.username}
            </Text>
            <View>
              <Text className="text-[16px] text-[#474348] font-sans mt-2">
                {data?.age} Years
              </Text>

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
                Level {xpInfo?.currentLevel}
              </Text>
            </View>
            <View className="flex-row items-center gap-2 mb-4">
              <Text className="text-[16px] text-[#6C686C] font-sans">
                Total XP:
              </Text>
              <Text className="text-[20px] text-[#265828] font-sansSemiBold">
                {xpInfo?.currentXp} XP
              </Text>
              <Image
                style={{
                  width: scaleWidth(25),
                  height: scaleWidth(25),
                }}
                source={IMAGES.Star}
              />
            </View>
            <ProgressBar height={14} percent={xpInfo?.progressPercent || 0} />
            <View className="mt-5 flex-row items-center justify-between">
              <Text className="text-[16px] text-[#6C686C] font-sans">
                Next Level at{' '}
                <Text className="text-[16px] font-sansSemiBold text-dark">
                  {xpInfo?.nextLevelXp} XP
                </Text>{' '}
              </Text>
              <Text className="text-[16px] text-[#6C686C] font-sans">
                <Text className="text-[16px] font-sansSemiBold text-dark">
                  +{xpInfo?.xpToNextLevel}
                </Text>{' '}
                to go!
              </Text>
            </View>
          </View>

          <View className="bg-white mt-6 border-[#D3D2D3] border p-5 rounded-[20px] w-full ">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[16px] text-dark font-sansSemiBold">
                Badges
              </Text>
              <Text
                onPress={() => router.push('/(tabs)/badges')}
                className="font-sansMedium text-[#337535] underline"
              >
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

            {!!!activities?.length && (
              <View>
                <Text className="font-sansSemiBold text-[#265828] text-[18px] text-center mb-4">
                  No Activity Yet
                </Text>
                <Text className="font-sans text-[#474348] leading-[1.5] text-center">
                  Your activities will appear here
                </Text>
              </View>
            )}

            {activities?.slice(0, 5).map((a) => (
              <View className="p-3 flex-row rounded-[16px] gap-3 border border-[#D3D2D3] mb-6">
                <ICONS.Star2 />
                <View className="gap-1 flex-1">
                  <Text className="text-dark font-sansMedium text-[16px] mb-2">
                    {a.activity}
                  </Text>
                  {/* <Text className="font-sans text-[#474348]">{a?.title}</Text> */}
                  <Text className="font-sans text-[#474348]">
                    {formatFriendlyDate(a.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
