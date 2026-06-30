import { getAllKids } from '@/actions/curriculum';
import { getKidsOverview } from '@/actions/home';
import {
  getKidAverageQuizScore,
  getKidOverallChapterCompletionRate,
  loginKidAsGuardian,
} from '@/actions/learners';
import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import Container from '@/components/Container';
import EditChildProfile from '@/components/Learners/EditChildProfile';
import ProgressBar from '@/components/ProgressBar';
import Skeleton from '@/components/Skeleton';
import TopBackButton from '@/components/TopBackButton';
import { useAppDispatch } from '@/hooks/redux';
import { storeData } from '@/lib/storage';
import { login } from '@/redux/authSlice';
import { getSubscriptionDaysRemaining } from '@/utils';
import { generateKidReportHtml } from '@/utils/reportGenerator';
import { scaleWidth } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { useQuery } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { captureRef } from 'react-native-view-shot';
import { twMerge } from 'tailwind-merge';

const LearningProgress = () => {
  const params = useLocalSearchParams();
  const [openRemaining, setOpenRemaining] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [kid, setKid] = useState(params?.id);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const pieChartContainerRef = useRef<View>(null);
  const lineChartContainerRef = useRef<View>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openBillingAlert, setOpenBillingAlert] = useState(true);
  const dispatch = useAppDispatch();
  const pieData = [
    { value: 100, color: '#9c9c9c' },
    // { value: 0, color: '#4CAF50' },
    // { value: 100, color: '#D5B300' },
    // { value: 0, color: '#4CAF50' },
  ];
  // const data = [
  //   { value: 250, label: "Mon" },
  //   { value: 30, label: "Tue" },
  //   { value: 26, label: "Wed" },
  //   { value: 140, label: "Thu" },
  //   { value: 40, label: "Fri" },
  //   { value: 40, label: "Sat" },
  // ];

  const { data, isLoading } = useQuery({
    queryKey: ['learning-overview', kid],
    queryFn: async () => {
      return await getKidsOverview(kid as string);
    },
  });

  const { data: allKids } = useQuery({
    queryKey: ['kids'],
    queryFn: async () => {
      return await getAllKids();
    },
  });

  const remainingKids = useMemo(() => {
    if (!allKids && !data) return [];
    return allKids?.filter?.((k) => k._id !== data?.kid?.id);
  }, [allKids, data, kid]);

  const { data: completionRateDetails } = useQuery({
    queryKey: ['completion-rate', kid],
    queryFn: async () => {
      return await getKidOverallChapterCompletionRate(kid as string);
    },
  });
  const { data: averageScore } = useQuery({
    queryKey: ['average-score', kid],
    queryFn: async () => {
      return await getKidAverageQuizScore(kid as string);
    },
  });

  const handleSwitchSession = async (kidId: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const kidData = await loginKidAsGuardian(kidId);
      await storeData('user', kidData);
      dispatch(login(kidData));
      showToast('success', 'Login Successful!');
      router.replace('/(tabs)/home-kid');
    } catch (error: any) {
      console.error('Switch session error:', error);
      showToast('error', 'Login Failed');
    } finally {
      setLoading(false);
    }
  };
  const handleExportReport = async () => {
    if (exportLoading || !data) return;
    setExportLoading(true);
    try {
      const generatedDate = new Date().toLocaleDateString('en-GB');

      // Fetch and base64-encode kid avatar using expo-file-system
      // (FileReader / Blob are Web APIs unavailable in React Native / Hermes)
      let avatarBase64: string | null = null;
      if (data?.kid?.picture) {
        try {
          const tmpPath = `${FileSystem.cacheDirectory}avatar_tmp.jpg`;
          const downloadResult = await FileSystem.downloadAsync(
            data.kid.picture,
            tmpPath,
          );
          avatarBase64 = await FileSystem.readAsStringAsync(
            downloadResult.uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            },
          );
          await FileSystem.deleteAsync(tmpPath, { idempotent: true });
        } catch {
          avatarBase64 = null;
        }
      }

      // Capture chart screenshots
      let pieChartBase64: string | null = null;
      let lineChartBase64: string | null = null;
      try {
        pieChartBase64 = await captureRef(pieChartContainerRef, {
          format: 'png',
          quality: 1,
          result: 'base64',
        });
      } catch {
        pieChartBase64 = null;
      }
      try {
        lineChartBase64 = await captureRef(lineChartContainerRef, {
          format: 'png',
          quality: 1,
          result: 'base64',
        });
      } catch {
        lineChartBase64 = null;
      }

      // Build HTML and generate PDF
      const html = generateKidReportHtml({
        data,
        completionRateDetails,
        averageScore,
        pieChartBase64,
        lineChartBase64,
        avatarBase64,
        generatedDate,
      });

      const { uri: tempUri } = await Print.printToFileAsync({ html });

      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        showToast('error', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(tempUri, {
        mimeType: 'application/pdf',
        dialogTitle: `${data.kid?.name ?? 'Kid'} Learning Report`,
        UTI: 'com.adobe.pdf',
      });

      await FileSystem.deleteAsync(tempUri, { idempotent: true });
    } catch (error: any) {
      console.error('Export report error:', error);
      showToast('error', 'Failed to generate report');
    } finally {
      setExportLoading(false);
    }
  };

  //  const plan = subscription?.plan ?? 'free';
  //   const planDetail = PLAN_DETAILS[plan];
  //   const statusStyle = STATUS_LABEL[subStatus] ?? STATUS_LABEL.active;
  //   const isFreePlan = plan === 'free';
  //   const isPaidPlan = !isFreePlan;

  //   useEffect(() => {
  //     if (subscription?.cancelAtPeriodEnd) {
  //       setStatus('cancelled');
  //     } else if (
  //       getSubscriptionDaysRemaining(subscription?.currentPeriodEnd) < 1
  //     ) {
  //       setStatus('expired');
  //     } else {
  //       setStatus(subscription?.status || 'active');
  //     }
  //   }, [subscription]);

  return (
    <Container scrollable>
      <TouchableWithoutFeedback onPress={() => setOpenRemaining(false)}>
        <View className="px-6 py-5">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] my-4">
            Learning Progress
          </Text>

          <View className="relative">
            <Pressable
              onPress={() => setOpenRemaining(!openRemaining)}
              className="bg-white rounded-[12px] p-4 py-[12px] flex-row items-center justify-between relative z-10"
            >
              <View className="flex-row items-center gap-3">
                {isLoading ? (
                  <Skeleton
                    style={{ width: 48, height: 48 }}
                    className="rounded-full"
                  />
                ) : (
                  <>
                    {data?.kid?.picture && (
                      <Image
                        style={{
                          width: 48,
                          height: 48,
                        }}
                        source={
                          data?.kid?.picture
                            ? { uri: data?.kid?.picture }
                            : IMAGES.KidProfilePlaceholder
                        }
                        className={twMerge(
                          'rounded-full border-[#D5B300]',
                          data?.kid?.picture && 'border',
                        )}
                      />
                    )}
                    {!data?.kid?.picture && (
                      <View className="bg-[#D3D2D366] w-12 h-12 rounded-full items-center justify-center">
                        <Text className="text-[20px] font-sansSemiBold">
                          {data?.kid?.name?.split(' ')?.[0]?.[0]}
                          {data?.kid?.name?.split(' ')?.[1]?.[0]}
                        </Text>
                      </View>
                    )}
                  </>
                )}
                {isLoading ? (
                  <Skeleton className="w-2/3 rounded-full" />
                ) : (
                  <Text className="text-[16px] font-sansMedium text-dark">
                    {data?.kid?.name}
                  </Text>
                )}
              </View>
              <ICONS.ChevronDown />
            </Pressable>
            {openRemaining && (
              <View className="p-4 rounded-[20px] shadow-md bg-white absolute top-[70px] w-full z-20">
                {remainingKids?.map((r) => (
                  <Pressable
                    key={r?._id}
                    onPress={() => {
                      setKid(r?._id);
                      setOpenRemaining(false);
                    }}
                    className="bg-white rounded-[12px] py-3 flex-row items-center justify-between relative"
                  >
                    <View key={r?._id} className="flex-row items-center gap-3">
                      {r?.picture && (
                        <Image
                          style={{
                            width: scaleWidth(36),
                            height: scaleWidth(36),
                          }}
                          source={{ uri: r?.picture }}
                          className={twMerge(
                            'rounded-full border-[#D5B300]',
                            data?.kid?.picture && 'border',
                          )}
                        />
                      )}
                      {!r?.picture && (
                        <View className="bg-[#D3D2D366] w-12 h-12 rounded-full items-center justify-center">
                          <Text className="text-[20px] font-sansSemiBold">
                            {data?.kid?.name?.split(' ')?.[0]?.[0]}
                            {data?.kid?.name?.split(' ')?.[1]?.[0]}
                          </Text>
                        </View>
                      )}
                      <Text className="text-[16px] font-sansMedium text-dark">
                        {r?.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
          {getSubscriptionDaysRemaining(
            data?.kid?.subscription?.currentPeriodEnd,
          ) < 1 && (
            <View className="px-6 py-4 bg-[#FDEC8D]/80 border-[#FFD700] border rounded-[16px] mt-6 relative">
              <Text className="text-[16px] text-[#221D23] font-sans leading-[1.5]">
                <Text className="font-sansSemiBold">Learning is paused —</Text>{' '}
                This learner needs an active plan to continue.
              </Text>
              <Pressable
                onPress={() =>
                  router.push(`/guardian/ChoosePlan?kid=${data?.kid?.id}`)
                }
                className="flex-row justify-center bg-[#FFFFFF] mt-4 rounded-[32px] items-center gap-2 py-3 shadow-md"
              >
                <Text className="text-[16px] font-sansMedium text-[#3F9243] ">
                  ACTIVATE PLAN
                </Text>
                <ICONS.ArrowRight />
              </Pressable>
              <ICONS.FlatCloud
                style={{
                  position: 'absolute',
                  right: 130,
                  top: 4,
                }}
              />
              <ICONS.FlatCloud
                style={{
                  position: 'absolute',
                  left: 16,
                  bottom: 0,
                }}
              />
            </View>
          )}
          {data?.kid?.subscription?.plan === 'free' &&
            getSubscriptionDaysRemaining(
              data?.kid?.subscription?.currentPeriodEnd,
            ) > 1 &&
            openBillingAlert && (
              <View className="px-6 py-4 bg-[#FDEC8D]/80 border-[#1671D9] border rounded-[16px] mt-6">
                <LinearGradient
                  colors={['#D8EAFF', '#BCDAFD', '#D8EAFF']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    zIndex: 0,
                    borderRadius: 16,
                  }}
                />
                <Pressable
                  onPress={() => setOpenBillingAlert(false)}
                  className="self-end bg-white rounded-full w-10 h-10 items-center justify-center mb-2"
                >
                  <ICONS.Close stroke="#221D23" width={24} height={24} />
                </Pressable>
                <Text className="text-[16px] text-[#221D23] font-sans leading-[1.5]">
                  <Text className="font-sansSemiBold">
                    Your child’s trial ends in{' '}
                    {getSubscriptionDaysRemaining(
                      data?.kid?.subscription?.currentPeriodEnd,
                    )}{' '}
                    days —
                  </Text>{' '}
                  {getSubscriptionDaysRemaining(
                    data?.kid?.subscription?.currentPeriodEnd,
                  ) <= 2
                    ? 'Keep your child learning without interruption.'
                    : getSubscriptionDaysRemaining(
                          data?.kid?.subscription?.currentPeriodEnd,
                        ) <= 6
                      ? 'Upgrade to keep their learning going.'
                      : 'Help your child explore books and build a reading habit.'}
                </Text>
                <Pressable
                  onPress={() =>
                    router.push(`/guardian/ChoosePlan?kid=${data?.kid?.id}`)
                  }
                  className="flex-row justify-center bg-[#FFFFFF] mt-4 rounded-[32px] items-center gap-2 py-3 shadow-md"
                >
                  <Text className="text-[16px] font-sansMedium text-[#3F9243] ">
                    UPGRADE PLAN
                  </Text>
                  <ICONS.ArrowRight />
                </Pressable>
                <ICONS.FlatCloud
                  style={{
                    position: 'absolute',
                    right: 130,
                    top: 4,
                  }}
                />
                <ICONS.FlatCloud
                  style={{
                    position: 'absolute',
                    left: 16,
                    bottom: 0,
                  }}
                />
              </View>
            )}

          <View className="bg-white rounded-[20px] p-5 mt-5">
            <View className="flex-row justify-between mb-5 items-center">
              {isLoading ? (
                <Skeleton
                  style={{ width: scaleWidth(79), height: scaleWidth(79) }}
                  className="rounded-full"
                />
              ) : (
                <Image
                  style={{ width: scaleWidth(79), height: scaleWidth(79) }}
                  source={
                    data?.kid?.picture
                      ? { uri: data?.kid?.picture }
                      : IMAGES.KidProfilePlaceholder
                  }
                  className={twMerge(
                    'rounded-full border-[#D5B300]',
                    data?.kid?.picture && 'border',
                  )}
                />
              )}
              <Pressable
                onPress={() => setOpenMenu(prev => !prev)}
                className="border border-[#D3D2D366]  p-3 rounded-[8px]"
              >
                <Entypo name="dots-three-vertical" size={24} color="black" />
              </Pressable>
              {openMenu && (
                <View className="p-4 rounded-[20px] shadow-md bg-white absolute top-[70px] w-full z-20 gap-6">
                  <Pressable
                    className="flex-row items-center gap-2"
                    onPress={() => setOpenEdit(true)}
                  >
                    <View className="bg-[#D3D2D366] w-7 h-7 rounded-full items-center justify-center">
                      <Feather name="user" size={16} color="#221D23" />
                    </View>
                    <Text className="text-[#221D23] font-sans text-[16px]">
                      Edit Profile
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-row items-center gap-2"
                    onPress={handleExportReport}
                    disabled={exportLoading}
                  >
                    <View className="bg-[#D3D2D366] w-7 h-7 rounded-full items-center justify-center">
                      {exportLoading ? (
                        <ActivityIndicator size="small" color="#265828" />
                      ) : (
                        <ICONS.Export width={16} height={16} />
                      )}
                    </View>
                    <Text className="text-[#221D23] font-sans text-[16px]">
                      Export Report
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      router.push(
                        `/guardian/DeleteChildProfile?id=${data?.kid?.id}&name=${data?.kid?.name?.split(' ')?.[0]}`,
                      )
                    }
                    className="flex-row items-center gap-2"
                  >
                    <View className="bg-[#DE21211A] w-7 h-7 rounded-full items-center justify-center">
                      <ICONS.Trash width={16} height={16} />
                    </View>
                    <Text className="text-[#DE2121] font-sans text-[16px]">
                      Delete Profile
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
            {isLoading ? (
              <Skeleton className="w-2/3 rounded-full mb-2" />
            ) : (
              <Text className="font-sansSemiBold text-[18px] text-[#393939] mb-2">
                {data?.kid?.name}
              </Text>
            )}
            {isLoading ? (
              <Skeleton className="w-2/3 rounded-full mb-2" />
            ) : (
              <Text className="text-[16px] text-[#474348] font-sans mb-2">
                @{data?.kid?.username}
              </Text>
            )}
            {isLoading ? (
              <Skeleton className="w-2/5 rounded-full mb-2" />
            ) : (
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-[16px] text-[#474348] font-sans mt-2 ">
                    {data?.kid?.age} Years
                  </Text>
                  {data?.kid?.gender && (
                    <>
                      <View className="w-2 h-2 rounded-full bg-[#FFD700] mt-2" />
                      <Text className="text-[16px] text-[#474348] font-sans mt-2">
                        {data?.kid?.gender}
                      </Text>
                    </>
                  )}
                  <>
                    <View className="w-2 h-2 rounded-full bg-[#FFD700] mt-2" />
                    <Text className="text-[16px]  mt-2 bg-[#3F69921A] capitalize px-2 py-0.5 rounded-[8px] font-sansMedium text-[#3F6992]">
                      {data?.kid?.subscription?.plan}
                    </Text>
                  </>
                </View>
              </View>
            )}
            <View className="bg-[#FFF7CCB2] p-3 flex-row item justify-between items-center mt-4">
              <View className="flex-row items-center gap-2">
                <Image
                  style={{ width: scaleWidth(28), height: scaleWidth(28) }}
                  source={IMAGES.BadgeTrophy}
                  className="rounded-full"
                />
                <Text className="font-sansMedium text-dark">
                  0 Badge Earned
                </Text>
              </View>
            </View>
            {isLoading ? (
              <Skeleton className="h-[48px] rounded-full mt-5" />
            ) : (
              <Button
                onPress={() => handleSwitchSession(kid as string)}
                loading={loading}
                className="mt-5"
                text="LOG IN AS USER"
              />
            )}
            {isLoading ? (
              <Skeleton className="h-[48px] rounded-full mt-5" />
            ) : (
              <Button
                onPress={() =>
                  router.push(`/guardian/LearningOverview?id=${kid}`)
                }
                className="mt-5 border-2 border-[#D3D2D3] bg-white"
                textClassname="text-dark"
                text="VIEW BOOKS"
              />
            )}
          </View>
          <View className="bg-white rounded-[20px] p-5 mt-5 ">
            <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
              <Text className="text-[#474348] font-sans">
                Chapter Completion Rate
              </Text>
              <View className="mt-3 flex-row items-center  gap-5 w-full">
                <View className="w-[80%]">
                  <ProgressBar
                    percent={completionRateDetails?.completionRate || 0}
                  />
                </View>
                <Text className="w-full text-[20px] font-sansSemiBold text-dark">
                  {completionRateDetails?.completionRate || 0}%
                </Text>
              </View>
            </View>
            <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
              <Text className="text-[#474348] font-sans">
                Total Missions Completed
              </Text>
              <View className="mt-3 flex-row items-center justify-between gap-5">
                <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                  0
                </Text>
                <View className="w-12 h-12 rounded-full bg-[#0991371A] items-center justify-center">
                  <ICONS.Check />
                </View>
              </View>
            </View>
            <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
              <Text className="text-[#474348] font-sans">Learning Streaks</Text>
              <View className="mt-3 flex-row items-center justify-between gap-5">
                <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                  0
                </Text>
                <View className="w-12 h-12 rounded-full bg-[#FFF7CC] items-center justify-center">
                  <ICONS.Fire />
                </View>
              </View>
            </View>
          </View>

          {/* performance data */}
          <View className="bg-white rounded-[20px] p-5 mt-5 ">
            <Text className="text-[18px] font-sansSemiBold text-dark mb-5">
              Performance Data
            </Text>

            <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
              <Text className="text-[#474348] font-sans">Avg. Quiz Score</Text>
              <View className="mt-3 flex-row items-center justify-between gap-5">
                <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                  0%
                </Text>
                <View className="w-12 h-12 rounded-full bg-[#0991371A] items-center justify-center">
                  <ICONS.Check />
                </View>
              </View>
            </View>

            <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
              <Text className="text-[#474348] font-sans">Journal Entry</Text>
              <View className="mt-3 flex-row items-center justify-between gap-5">
                <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                  -
                </Text>
                <View className="w-12 h-12 rounded-full bg-[#C821DE1A] items-center justify-center">
                  <ICONS.Notebook />
                </View>
              </View>
            </View>

            <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#C3E4C5]">
              <Text className="text-[#474348] font-sans">
                Mission Complexity
              </Text>
              <View className="mt-3 flex-row items-center justify-between gap-5">
                <Text className="flex-shrink-0 text-[20px] font-sansSemiBold text-dark">
                  -
                </Text>
                <View className="w-12 h-12 rounded-full bg-[#FFF7CC] items-center justify-center">
                  <ICONS.Puzzle />
                </View>
              </View>
            </View>
            {/* audio vs text */}
            <View
              ref={pieChartContainerRef}
              className="bg-white rounded-[20px] p-5 mt-5  border border-[#D3D2D366]"
            >
              <Text className="text-dark font-sansMedium text-[18px]">
                Audio vs. Text Usage {'\n'}(Read Aloud)
              </Text>
              <View className="mt-5 border border-[#D3D2D366] rounded-[24px] py-3 px-5 flex-row items-center gap-6">
                <PieChart
                  donut
                  textColor="black"
                  radius={60}
                  textSize={20}
                  data={pieData}
                  innerRadius={50}
                />
                <View>
                  <View className="flex-row gap-2.5 items-center mb-2">
                    <View className="w-3 h-3 rounded-full bg-[#D5B300] " />
                    <Text className="font-sansMedium text-[16px] text-[#265828]">
                      Audio
                    </Text>
                  </View>
                  <View className="flex-row gap-2.5 items-center">
                    <View className="w-3 h-3 rounded-full bg-[#6ABC6D]" />
                    <Text className="font-sansMedium text-[16px] text-[#265828]">
                      Text
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* creative tools */}
            <View className="bg-white rounded-[20px] p-5 mt-5  border border-[#D3D2D366]">
              <Text className="font-sansMedium text-dark text-[18px] mb-5">
                Creative Tools Used
              </Text>
              {/* <View className="flex-row items-center gap-2 px-1 mb-3">
                <View className="w-1 h-1 rounded-full bg-[#474348] " />
                <Text className="text-[#474348] font-sans text-[16px]">
                  Drawing Tool
                </Text>
              </View>
              <View className="flex-row items-center gap-2 px-1 mb-3">
                <View className="w-1 h-1 rounded-full bg-[#474348] " />
                <Text className="text-[#474348] font-sans text-[16px]">
                  Story Builder
                </Text>
              </View>
              <View className="flex-row items-center gap-2 px-1 ">
                <View className="w-1 h-1 rounded-full bg-[#474348] " />
                <Text className="text-[#474348] font-sans text-[16px]">
                  Audio Recorder
                </Text>
              </View> */}
              <Text className="text-[#474348] font-sans text-[16px]">-</Text>
            </View>
          </View>

          {/* engagement and outcome */}
          <View className="bg-white rounded-[20px] p-5 mt-5 ">
            <Text className="text-[18px] font-sansSemiBold text-dark mb-5">
              Engagement and Outcome
            </Text>
            <View className=" mb-5 border-[0.5px] p-5 rounded-[12px] border-[#D3D2D366]">
              <View className="items-center border-b border-b-[#D3D2D366] py-4">
                <Text className="font-sansSemiBold text-[18px] text-[#265828]">
                  -
                </Text>
                <Text className="font-sansMedium text-[16px] text-[#474348] mt-3">
                  Creativity Score
                </Text>
              </View>
              <View className="items-center border-b border-b-[#D3D2D366] py-4">
                <Text className="font-sansSemiBold text-[18px] text-[#265828]">
                  -
                </Text>
                <Text className="font-sansMedium text-[16px] text-[#474348] mt-3">
                  Comprehension
                </Text>
              </View>
              <View className="items-center py-4">
                <Text className="font-sansSemiBold text-[18px] text-[#265828]">
                  -
                </Text>
                <Text className="font-sansMedium text-[16px] text-[#474348] mt-3">
                  Planning Ability
                </Text>
              </View>
            </View>
            <View ref={lineChartContainerRef} className="flex-1">
              <Text className="font-sansMedium text-[18px] text-dark mb-6">
                Time on Task (Last 7 Days)
              </Text>

              <LineChart
                noOfSections={5}
                spacing1={50}
                hideDataPoints1
                stepValue={50}
                curved
                data={[
                  { value: 0, label: 'Mon' },
                  { value: 0, label: 'Tue' },
                  { value: 0, label: 'Wed' },
                  { value: 0, label: 'Thu' },
                  { value: 0, label: 'Fri' },
                  { value: 0, label: 'Sat' },
                  { value: 0, label: 'Sun' },
                ]}
                color1="#4CAF50"
                yAxisTextStyle={{
                  fontFamily: 'Sans-Regular',
                  color: '#474348',
                  fontSize: 12,
                }}
                xAxisLabelTextStyle={{
                  fontFamily: 'Sans-Regular',
                  color: '#474348',
                  fontSize: 12,
                }}
                xAxisColor={'#D3D2D366'}
                yAxisColor={'#D3D2D366'}
              />
            </View>
          </View>
          <EditChildProfile
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            kid={data?.kid!}
          />
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default LearningProgress;
