import { getKidsOverview } from '@/actions/home';
import { getReadingOverview } from '@/actions/learner-progress';
import {
  getKidAverageQuizScore,
  getKidOverallChapterCompletionRate,
  loginKidAsGuardian,
} from '@/actions/learners';
import { ICONS } from '@/assets/icons';
import { LinearButton } from '@/components/Button';
import Container from '@/components/Container';
import {
  ActivityFeed,
  BookCard,
  BookCardSkeleton,
  BookCarousel,
  EmptyState,
  firstName,
  formatHours,
  KidAvatar,
  KidSwitcher,
  ProgressView,
  ProgressViewOption,
  SectionCard,
  SectionDropdown,
  SectionHeader,
  StatCard,
} from '@/components/LearnerProgress';
import EditChildProfile from '@/components/Learners/EditChildProfile';
import Skeleton from '@/components/Skeleton';
import TopBackButton from '@/components/TopBackButton';
import { useParentalGate } from '@/context/ParentalGateContext';
import { useAppDispatch } from '@/hooks/redux';
import { storeData } from '@/lib/storage';
import { login } from '@/redux/authSlice';
import { LearnerBookCard, SuggestedBook } from '@/types/learnerProgress';
import { getSubscriptionDaysRemaining } from '@/utils';
import { generateKidReportHtml } from '@/utils/reportGenerator';
import { scaleWidth } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const VIEW_OPTIONS: ProgressViewOption[] = [
  { value: 'read', label: 'Read Progress' },
  { value: 'play', label: 'Play & Learn Insights', locked: true },
  { value: 'activity', label: 'Activity History' },
];

const LearningProgress = () => {
  const { requireParentalGate } = useParentalGate();
  const params = useLocalSearchParams();
  const [kid, setKid] = useState(params?.id as string);
  const [view, setView] = useState<ProgressView>('read');
  const [openEdit, setOpenEdit] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [openBillingAlert, setOpenBillingAlert] = useState(true);
  const dispatch = useAppDispatch();

  const { data: overview, isLoading } = useQuery({
    queryKey: ['reading-overview', kid],
    queryFn: async () => await getReadingOverview(kid),
    enabled: !!kid,
  });

  // Legacy overview: profile editing, report export and plan banners
  const { data } = useQuery({
    queryKey: ['learning-overview', kid],
    queryFn: async () => await getKidsOverview(kid),
    enabled: !!kid,
  });

  const learner = overview?.learner;
  const stats = overview?.stats;
  const name = firstName(learner?.name);

  const openBook = (book: LearnerBookCard) =>
    router.push(
      `/guardian/BookProgress?kidId=${kid}&seriesId=${book.seriesId}&name=${encodeURIComponent(learner?.name ?? '')}`,
    );

  const assignBook = (book: SuggestedBook) =>
    router.push(
      `/guardian/AssignChild?title=${book.category?.title}&id=${book.seriesId}&seriesTitle=${book.title}`,
    );

  const handleSwitchSession = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const kidData = await loginKidAsGuardian(kid);
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
      const [completionRateDetails, averageScore] = await Promise.all([
        getKidOverallChapterCompletionRate(kid).catch(() => undefined),
        getKidAverageQuizScore(kid).catch(() => undefined),
      ]);

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
            { encoding: FileSystem.EncodingType.Base64 },
          );
          await FileSystem.deleteAsync(tmpPath, { idempotent: true });
        } catch {
          avatarBase64 = null;
        }
      }

      const html = generateKidReportHtml({
        data,
        completionRateDetails,
        averageScore,
        pieChartBase64: null,
        lineChartBase64: null,
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

  const daysRemaining = getSubscriptionDaysRemaining(
    data?.kid?.subscription?.currentPeriodEnd,
  );

  const recommended = overview?.recommendedNextRead;

  return (
    <Container scrollable>
      <TouchableWithoutFeedback onPress={() => setOpenMenu(false)}>
        <View className="px-6 py-5 pb-10">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] my-4">
            Learning Progress
          </Text>

          <KidSwitcher
            loading={isLoading}
            kid={
              learner
                ? {
                    _id: learner._id,
                    name: learner.name,
                    picture: learner.picture,
                  }
                : undefined
            }
            onSelect={(id) => {
              setKid(id);
              setView('read');
            }}
          />

          {data && daysRemaining < 1 && (
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
                style={{ position: 'absolute', right: 130, top: 4 }}
              />
              <ICONS.FlatCloud
                style={{ position: 'absolute', left: 16, bottom: 0 }}
              />
            </View>
          )}
          {data?.kid?.subscription?.plan === 'free' &&
            daysRemaining > 1 &&
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
                    Your child’s trial ends in {daysRemaining} days —
                  </Text>{' '}
                  {daysRemaining <= 2
                    ? 'Keep your child learning without interruption.'
                    : daysRemaining <= 6
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
                  style={{ position: 'absolute', right: 130, top: 4 }}
                />
                <ICONS.FlatCloud
                  style={{ position: 'absolute', left: 16, bottom: 0 }}
                />
              </View>
            )}

          {/* Profile */}
          <SectionCard className="z-20">
            <View className="flex-row justify-between items-start mb-5">
              {isLoading ? (
                <Skeleton
                  style={{ width: scaleWidth(96), height: scaleWidth(96) }}
                  className="rounded-full"
                />
              ) : (
                <KidAvatar
                  picture={learner?.picture}
                  size={scaleWidth(96)}
                />
              )}
              <Pressable
                onPress={() => setOpenMenu((prev) => !prev)}
                className="border border-[#D3D2D366] p-3 rounded-[8px]"
              >
                <Entypo name="dots-three-vertical" size={20} color="black" />
              </Pressable>
              {openMenu && (
                <View className="p-4 rounded-[20px] shadow-md bg-white absolute top-[60px] right-0 w-[70%] z-30 gap-6">
                  <Pressable
                    className="flex-row items-center gap-2"
                    onPress={() => {
                      setOpenMenu(false);
                      setOpenEdit(true);
                    }}
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
                    onPress={() => requireParentalGate(handleExportReport)}
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
                        `/guardian/DeleteChildProfile?id=${kid}&name=${name}`,
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
              <>
                <Skeleton className="w-2/3 rounded-full mb-3" />
                <Skeleton className="w-1/3 rounded-full mb-3" />
                <Skeleton className="w-2/5 rounded-full mb-3" />
              </>
            ) : (
              <>
                <Text className="font-sansSemiBold text-[20px] text-[#393939]">
                  {learner?.name}
                </Text>
                <Text className="text-[16px] text-[#474348] font-sans mt-3">
                  @{learner?.username}
                </Text>
                <View className="flex-row items-center gap-2 mt-3">
                  {learner?.age != null && (
                    <Text className="text-[16px] text-[#474348] font-sans">
                      {learner.age} Years
                    </Text>
                  )}
                  {!!learner?.gender && (
                    <>
                      <View className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                      <Text className="text-[16px] text-[#474348] font-sans capitalize">
                        {learner.gender}
                      </Text>
                    </>
                  )}
                </View>
                <View className="flex-row items-center gap-2 mt-3">
                  {!!overview?.subscription?.planName && (
                    <Text className="text-[15px] bg-[#EBEFF4] px-3 py-1 rounded-[8px] font-sansMedium text-[#3F6992] overflow-hidden">
                      {overview.subscription.planName}
                    </Text>
                  )}
                  <Text className="text-[15px] bg-[#F6F6F6] px-3 py-1 rounded-[8px] font-sansMedium text-dark overflow-hidden">
                    Read Only
                  </Text>
                </View>
              </>
            )}
            <Pressable
              onPress={handleSwitchSession}
              disabled={loading || isLoading}
              className="mt-6 border border-[#3F9243] bg-[#F1F9F1] rounded-full py-3.5 flex-row items-center justify-center gap-2"
            >
              {loading ? (
                <ActivityIndicator color="#3F9243" />
              ) : (
                <>
                  <Text className="text-[16px] font-sansMedium text-[#3F9243]">
                    LOG IN AS LEARNER
                  </Text>
                  <Feather name="external-link" size={18} color="#3F9243" />
                </>
              )}
            </Pressable>
          </SectionCard>

          {/* Summary stats */}
          <SectionCard className="pb-1">
            <StatCard
              loading={isLoading}
              iconBg="#E8F1FB"
              icon={<Ionicons name="book" size={22} color="#1671D9" />}
              label="Books Assigned"
              value={stats?.booksAssigned ?? 0}
            />
            <StatCard
              loading={isLoading}
              iconBg="#FBF7E5"
              icon={<Ionicons name="trophy" size={20} color="#D5B300" />}
              label="Badges Earned"
              value={stats?.badgesEarned ?? 0}
            />
            <StatCard
              loading={isLoading}
              iconBg="#FCE9E9"
              icon={<Ionicons name="heart" size={22} color="#DE2121" />}
              label="Learning Interest"
              value={learner?.learningInterests?.join(', ') || '-'}
            />
            <StatCard
              loading={isLoading}
              iconBg="#FBF7E5"
              icon={<ICONS.Fire />}
              label="Learning Streak"
              value={`${stats?.streakDays ?? 0} days`}
            />
          </SectionCard>

          <SectionDropdown
            options={VIEW_OPTIONS}
            value={view}
            onChange={setView}
            showSelectedIcon={false}
          />

          {view === 'read' && (
            <>
              <SectionCard className="pb-1">
                <SectionHeader
                  title="Reading Progress"
                  subtitle={`A snapshot of ${name}’s reading journey`}
                />
                <StatCard
                  loading={isLoading}
                  iconBg="#FFF7CC"
                  icon={
                    <Ionicons name="flame-outline" size={22} color="#AA8F00" />
                  }
                  label="Reading Streak"
                  value={`${stats?.streakDays ?? 0} days`}
                />
                <StatCard
                  loading={isLoading}
                  iconBg="#E8F1FB"
                  icon={<Feather name="book-open" size={20} color="#004D99" />}
                  label="Books Read"
                  value={stats?.booksRead ?? 0}
                />
                <StatCard
                  loading={isLoading}
                  iconBg="#E6F4EB"
                  icon={
                    <Ionicons
                      name="stats-chart-outline"
                      size={19}
                      color="#099137"
                    />
                  }
                  label="Books In Progress"
                  value={stats?.booksInProgress ?? 0}
                />
                <StatCard
                  loading={isLoading}
                  iconBg="#F9E9FB"
                  icon={<Feather name="clock" size={20} color="#C821DE" />}
                  label="Reading Time"
                  value={formatHours(stats?.readingTimeSeconds)}
                />
              </SectionCard>

              <SectionCard>
                <SectionHeader
                  title="Currently Reading"
                  subtitle={`${name}’s current book and progress`}
                />
                {isLoading ? (
                  <BookCardSkeleton />
                ) : overview?.currentlyReading ? (
                  <BookCard
                    book={overview.currentlyReading}
                    onPress={() => openBook(overview.currentlyReading!)}
                  />
                ) : (
                  <EmptyState text={`${name} hasn’t started a book yet.`} />
                )}
              </SectionCard>

              <SectionCard>
                <SectionHeader
                  title="Recommended Next Read"
                  subtitle={`Based on ${name}’s reading progress and interests`}
                />
                {isLoading ? (
                  <BookCardSkeleton />
                ) : recommended ? (
                  <BookCard
                    book={recommended}
                    onPress={() =>
                      recommended.isAssigned
                        ? openBook(recommended)
                        : router.push(
                            `/guardian/CurriculumSeriesOverview?title=${recommended.category?.title}&id=${recommended.category?.categoryId}`,
                          )
                    }
                  />
                ) : (
                  <EmptyState text="No recommendations yet." />
                )}
              </SectionCard>

              <SectionCard>
                <SectionHeader
                  title={`Books Assigned to ${name}`}
                  subtitle={`View books assigned to ${name} and their current progress`}
                />
                {isLoading ? (
                  <BookCardSkeleton />
                ) : overview?.assignedBooks?.items?.length ? (
                  <BookCarousel
                    key={`assigned-${kid}`}
                    items={overview.assignedBooks.items}
                    renderItem={(book) => (
                      <BookCard book={book} onPress={() => openBook(book)} />
                    )}
                  />
                ) : (
                  <EmptyState text="No books assigned yet." />
                )}
                <LinearButton
                  className="mt-6"
                  text="VIEW ALL"
                  onPress={() =>
                    router.push(`/guardian/AssignedBooks?kidId=${kid}`)
                  }
                />
              </SectionCard>

              <SectionCard>
                <SectionHeader
                  title={`Explore More Books for ${name}`}
                  subtitle="Curated book recommendations based on interests and reading level"
                />
                {isLoading ? (
                  <BookCardSkeleton />
                ) : overview?.exploreMore?.length ? (
                  <BookCarousel
                    key={`explore-${kid}`}
                    items={overview.exploreMore}
                    renderItem={(book) => (
                      <BookCard book={book} onAssign={() => assignBook(book)} />
                    )}
                  />
                ) : (
                  <EmptyState text="All available books are already assigned." />
                )}
                <LinearButton
                  className="mt-6"
                  text="VIEW ALL"
                  onPress={() => router.push('/(tabs)/curriculum')}
                />
              </SectionCard>
            </>
          )}

          {(view === 'read' || view === 'activity') && (
            <ActivityFeed
              title="Recent Learning Activity"
              subtitle={`${name}’s latest learning activity`}
              items={overview?.recentActivity ?? []}
              loading={isLoading}
            />
          )}

          {data?.kid && (
            <EditChildProfile
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              kid={data.kid}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default LearningProgress;
