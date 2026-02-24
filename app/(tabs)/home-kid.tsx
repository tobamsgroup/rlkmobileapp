import { fetchKidLearning } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import Container from '@/components/Container';
import KidLearningCard, {
  KidLearningCardSkeleton,
} from '@/components/kid/KidLearningCard';
import Skeleton from '@/components/Skeleton';
import useKidProfile from '@/hooks/useKidProfile';
import { ensureHttps } from '@/utils';
import { getTopTwoChapters } from '@/utils/kid';
import { scaleWidth } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const HomeKid = () => {
  const { data: profile, isLoading: isLoadingProfile } = useKidProfile();
  const { data, isLoading } = useQuery({
    queryKey: ['kid-learning'],
    queryFn: async () => {
      return await fetchKidLearning();
    },
  });

  const latestChapters = useMemo(() => {
    if (!data) return [];
    return getTopTwoChapters(data);
  }, [data]);

  return (
    <Container edges={['top']} scrollable>
      <View className="px-6 py-5">
        <View className="flex-row gap-2 items-center mb-5">
          {isLoadingProfile ? (
            <Skeleton
              style={{
                height: scaleWidth(48),
                width: scaleWidth(48),
                borderRadius: 100,
              }}
            />
          ) : (
            <View
              className="border border-[#3F9243]"
              style={{
                height: scaleWidth(48),
                width: scaleWidth(48),
                borderRadius: 100,
              }}
            >
              <Image
                source={
                  profile?.picture
                    ? { uri: ensureHttps(profile?.picture) }
                    : IMAGES.KidProfilePlaceholder
                }
                className="w-full h-full rounded-full"
              />
            </View>
          )}

          <View className="flex-1">
            <Text className="text-[16px] font-sansSemiBold text-[#474348] leading-[1.5]">
              Welcome back
            </Text>
            {isLoadingProfile ? (
              <Skeleton className="rounded-full w-2/3" />
            ) : (
              <Text
                numberOfLines={1}
                className="text-[#221D23] text-[16px] font-sansSemiBold leading-[1.5]"
              >
                {profile?.username} 👋
              </Text>
            )}
          </View>
          <Pressable
            onPress={() => router.push('/notifications')}
            style={{
              height: scaleWidth(44),
              width: scaleWidth(44),
            }}
            className="rounded-[100px] bg-white items-center justify-center"
          >
            <ICONS.Notifications width={20} height={20} fill={'#4CAF50'} />
          </Pressable>
        </View>

        <View className="  rounded-[20px] py-6 px-4 mb-5 w-full relative ">
          <LinearGradient
            colors={['#337535', '#265828']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 0,
              borderRadius: 20,
            }}
          />
          <Text className="text-[#FAFDFF] text-[16px] font-sansMedium leading-[1.5]">
            Let’s Keep Learning{'\n'}and Having Fun!
          </Text>
          <Button
            textClassname="text-[#265828]"
            className="bg-white border-b-[#FFD700] w-[50%] mt-6"
            text="EXPLORE TRACKS"
          />
          <Image
            className="absolute right-0 bottom-0 z-20"
            style={{ height: scaleWidth(125), width: scaleWidth(131) }}
            source={IMAGES.KidDashboardWelcome}
          />
          <Image
            className="absolute right-0 bottom-[-26px] z-10"
            resizeMode="contain"
            style={{ height: scaleWidth(125), width: scaleWidth(131) }}
            source={IMAGES.KidDashboardOverlay}
          />
        </View>

        <View className="p-5 bg-white rounded-[20px] ">
          <View className="flex-row justify-between items-center mb-7">
            <Text className="text-[18px] font-sansSemiBold text-dark ">
              Continue Learning
            </Text>
            <Pressable onPress={() => router.push('/mylearning')}>
              <Text className="font-sansMedium underline text-[#337535]">
                VIEW ALL
              </Text>
            </Pressable>
          </View>
          {latestChapters?.length < 1 && !isLoading && (
            <>
              <View className=" h-[40vh] items-center justify-center">
                <ICONS.CircledClipboard />
                <Text className="font-sansSemiBold text-[#265828] text-[18px] text-center my-4">
                  No Courses Yet
                </Text>
                <Text className="font-sans text-[#474348] leading-[1.5] text-center px-10">
                  Hang tight! Your parent/teacher will assign some fun courses
                  for you soon.
                </Text>
              </View>
            </>
          )}
          {isLoading && (
            <>
              {[1, 2]?.map((r) => (
                <KidLearningCardSkeleton key={r} />
              ))}
            </>
          )}
          {latestChapters?.map((l, i) => (
            <KidLearningCard {...l} key={i} />
          ))}
        </View>
      </View>
    </Container>
  );
};

export default HomeKid;
