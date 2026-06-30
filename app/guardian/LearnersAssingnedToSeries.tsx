import {
  fetchKidsCourseBySeries,
  KidCourseWithPopulatedKid,
} from '@/actions/curriculum';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import Container from '@/components/Container';
import ProgressBar from '@/components/ProgressBar';
import Skeleton from '@/components/Skeleton';
import TrialLockModal from '@/components/Subscription/TrialLockModal';
import TopBackButton from '@/components/TopBackButton';
import useGuardian from '@/hooks/useGuardianProfile';
import { ensureHttps, formatDate, numberToWord } from '@/utils';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const LearnersAssingnedToSeries = () => {
  const params = useLocalSearchParams();
  const [search, setSearch] = useState('');
  const { data: guardian } = useGuardian();
  const [openLock, setOpenLock] = useState(false);
  const [kidsData, setKidsData] = useState<KidCourseWithPopulatedKid[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['kids-volume', params?.id],
    queryFn: async () => {
      return await fetchKidsCourseBySeries(params?.id as string);
    },
  });

  useEffect(() => {
    if (!data) return;

    if (search) {
      setKidsData(
        data?.filter((d) =>
          d.kidId?.name?.toLowerCase()?.includes(search?.toLowerCase()),
        ),
      );
      return;
    }
    setKidsData(data);
  }, [data, search]);

  return (
    <>
      <Container scrollable>
        <View className="px-6 py-5">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] my-4 mb-4">
            Learners Assigned
          </Text>
          <Text className="font-sansSemiBold text-[#474348] text-[16px] capitalize">
            Series {numberToWord(params?.index as string)} :{' '}
            {params?.seriesTitle}
          </Text>
          <View className="bg-[#000F1F] p-6  px-8 rounded-[16px] mt-8 relative">
            <ICONS.Ellipse
              style={{ position: 'absolute', top: scaleHeight(68), zIndex: 0 }}
            />
            <View className="flex-row items-center gap-[15px]">
              {!!kidsData?.length && !isLoading && (
                <Text className="text-white text-[16px] font-sansSemiBold">
                  Learners: {kidsData?.length}
                </Text>
              )}
              {kidsData?.length >= 5 && (
                <Pressable
                  onPress={() =>
                    showToast(
                      'info',
                      'All learners have been assigned to this series.',
                    )
                  }
                >
                  <ICONS.InformationCircle
                    stroke={'#1671D9'}
                    width={20}
                    height={20}
                  />
                </Pressable>
              )}
            </View>

            {!!!kidsData?.length && !isLoading && (
              <View className=" items-center justify-center  h-[464px]">
                <Text className="text-white font-sansSemiBold text-[20px] text-center mb-4">
                  No Learners Assigned Yet.
                </Text>
                <Text className="text-white text-center font-sansMedium mb-6">
                  Assign this series to one or more learners to see them listed
                  here
                </Text>
                <Button
                  onPress={() =>
                    router.push(
                      `/guardian/AssignChild?title=${params?.title}&id=${params?.id}&seriesTitle=${params?.seriesTitle}`,
                    )
                  }
                  className="px-6"
                  text="ASSIGN TO CHILD"
                />
              </View>
            )}
            {isLoading && (
              <>
                {[1, 2]?.map((i) => (
                  <KidProgessCardSkeleton key={i} />
                ))}
              </>
            )}
            {!isLoading && !!kidsData?.length && (
              <>
                {kidsData?.map((k, i) => (
                  <KidProgessCard key={k._id} {...k} />
                ))}
              </>
            )}
          </View>
        </View>
      </Container>
      {!!kidsData?.length && (
        <Pressable
          onPress={() => {
            router.push(
              `/guardian/AssignChild?title=${params?.title}&id=${params?.id}&seriesTitle=${params?.seriesTitle}`,
            );
          }}
          style={{
            position: 'absolute',
            bottom: scaleHeight(40),
          }}
          className="flex-row self-end gap-2 items-center bg-[#3F9243] border-b-primary py-3 px-6 rounded-full absolute z-50"
        >
          <ICONS.Assignmentadd />
          <Text className="text-white font-sansMedium text-[16px]">ASSIGN</Text>
        </Pressable>
      )}
      <TrialLockModal
        title="Unable to Assign Series to Child"
        desc="Upgrade your account to  assign series to child continue your child’s learning journey."
        open={openLock}
        onClose={() => setOpenLock(false)}
        buttonText1="UPGRADE PLAN"
        buttonText2="MAYBE LATER"
        onProceed={() => {
          setOpenLock(false);
          router?.push('/guardian/ChoosePlan');
        }}
      />
    </>
  );
};

const KidProgessCard = (props: KidCourseWithPopulatedKid) => {
  return (
    <View className="relative mb-3">
      <View
        style={{
          marginTop: scaleHeight(52),
        }}
        className="border-2 border-[#D3D2D366] rounded-[20px] bg-[#FAFDFF] items-center px-11 py-6"
      >
        <View
          className={twMerge(
            ' rounded-full bg-white mb-2',
            props?.kidId?.picture && ' border-[#FFD700] border-2',
          )}
          style={{
            height: 90,
            width: 90,
          }}
        >
          <Image
            className="w-full h-full rounded-full"
            source={
              props?.kidId?.picture
                ? { uri: ensureHttps(props?.kidId?.picture) }
                : IMAGES.KidProfilePlaceholder
            }
          />
        </View>
        <Text className="text-[#193A1B] font-sansMedium text-[16px]">
          {props?.kidId?.name}
        </Text>
        <Text className="font-sans text-[#474348] mt-3 mb-4">
          Assigned {formatDate(props?.assignedSeries?.[0]?.assignedAt)}
        </Text>
        <View className=" flex-row items-center mb-4  gap-2.5">
          <ProgressBar
            percent={props?.assignedSeries?.[0]?.progress}
            height={8}
          />
          <Text className="font-sansMedium text-dark flex-shrink-0 ">
            {props?.assignedSeries?.[0]?.progress}%
          </Text>
        </View>
        <Button
          onPress={() =>
            router.push(`/guardian/LearningProgress?id=${props?.kidId?._id}`)
          }
          text="VIEW PROGRESS"
          className="w-full"
        />
      </View>
    </View>
  );
};
const KidProgessCardSkeleton = () => {
  return (
    <View className="relative mb-3">
      <Skeleton
        style={{
          height: scaleWidth(104),
          width: scaleWidth(104),
          left: '33%',
        }}
        className=" border-2 border-black/15 rounded-full bg-white absolute top-0 left-0 z-30"
      />

      <View
        style={{
          //   width: scaleWidth(256),
          marginTop: scaleHeight(52),
          paddingTop: scaleHeight(58),
        }}
        className="border-2 border-primary rounded-[20px] bg-white items-center px-11 pb-5"
      >
        <Skeleton className="w-1/2 rounded-full" />
        <Skeleton className="w-2/3 rounded-full mb-4 mt-3" />
        <Skeleton className="w-full rounded-full mb-4" />
        <Skeleton className="w-full rounded-full h-[48px]" />
      </View>
    </View>
  );
};

export default LearnersAssingnedToSeries;
