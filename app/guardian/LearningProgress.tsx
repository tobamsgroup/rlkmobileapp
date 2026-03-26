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
import { scaleWidth } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { twMerge } from 'tailwind-merge';
import * as FileSystem from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import { captureRef } from 'react-native-view-shot';
import { generateKidReportHtml } from '@/utils/reportGenerator';

const LearningProgress = () => {
  const params = useLocalSearchParams();
  const [openRemaining, setOpenRemaining] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [kid, setKid] = useState(params?.id);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const pieChartContainerRef = useRef<View>(null);
  const lineChartContainerRef = useRef<View>(null);
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
          avatarBase64 = await FileSystem.readAsStringAsync(downloadResult.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
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

      // Save to Documents/rlk-reports/
      const reportsDir = `${FileSystem.documentDirectory}rlk-reports/`;
      await FileSystem.makeDirectoryAsync(reportsDir, { intermediates: true });

      const safeName = (data.kid?.name ?? 'Kid').replace(/\s+/g, '-');
      const dateStamp = generatedDate.replace(/\//g, '-');
      const destUri = `${reportsDir}${safeName}-report-${dateStamp}.pdf`;

      await FileSystem.copyAsync({ from: tempUri, to: destUri });

      showToast('success', 'Report saved to Documents');
    } catch (error: any) {
      console.error('Export report error:', error);
      showToast('error', 'Failed to generate report');
    } finally {
      setExportLoading(false);
    }
  };

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
                    style={{ width: scaleWidth(36), height: scaleWidth(36) }}
                    className="rounded-full"
                  />
                ) : (
                  <Image
                    style={{ width: scaleWidth(36), height: scaleWidth(36) }}
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
                    onPress={() => {
                      setKid(r?._id);
                      setOpenRemaining(false);
                    }}
                    className="bg-white rounded-[12px] py-3 flex-row items-center justify-between relative"
                  >
                    <View key={r?._id} className="flex-row items-center gap-3">
                      <Image
                        style={{
                          width: scaleWidth(36),
                          height: scaleWidth(36),
                        }}
                        source={
                          r?.picture
                            ? { uri: r?.picture }
                            : IMAGES.KidProfilePlaceholder
                        }
                        className={twMerge(
                          'rounded-full border-[#D5B300]',
                          data?.kid?.picture && 'border',
                        )}
                      />
                      <Text className="text-[16px] font-sansMedium text-dark">
                        {r?.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <Pressable
            onPress={handleExportReport}
            disabled={exportLoading}
            className="bg-white rounded-[12px] p-4 py-[18px] flex-row items-center justify-between mt-5"
          >
            <Text className="text-[16px] font-sansMedium text-dark">
              {exportLoading ? 'Generating...' : 'Export Report'}
            </Text>
            {exportLoading ? (
              <ActivityIndicator size="small" color="#265828" />
            ) : (
              <ICONS.Export />
            )}
          </Pressable>

          <View className="bg-white rounded-[20px] p-5 mt-5">
            <View className="flex-row justify-between mb-5">
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

              <Text
                onPress={() => setOpenEdit(true)}
                className="underline text-[#3F9243] font-sansMedium"
              >
                EDIT PROFILE
              </Text>
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
                  0 Badged Earned
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
                text="VIEW COURSES"
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
            <View ref={pieChartContainerRef} className="bg-white rounded-[20px] p-5 mt-5  border border-[#D3D2D366]">
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
