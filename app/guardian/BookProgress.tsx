import { getBookProgress } from '@/actions/learner-progress';
import { loginKidAsGuardian } from '@/actions/learners';
import { IMAGES } from '@/assets/images';
import Container from '@/components/Container';
import {
  ActivityFeed,
  BookCover,
  BookProgressBar,
  bookTitle,
  EmptyState,
  firstName,
  formatDuration,
  ProgressView,
  ProgressViewOption,
  SectionDropdown,
  StatCard,
  StatusRows,
  UPGRADE_COLOR,
} from '@/components/LearnerProgress';
import TrialLockModal from '@/components/Subscription/TrialLockModal';
import Skeleton from '@/components/Skeleton';
import TopBackButton from '@/components/TopBackButton';
import { useAppDispatch } from '@/hooks/redux';
import { storeData } from '@/lib/storage';
import { login } from '@/redux/authSlice';
import { scaleWidth } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const VIEW_OPTIONS: ProgressViewOption[] = [
  { value: 'read', label: 'Read Progress', selectedLabel: 'Chapters' },
  { value: 'play', label: 'Play & Learn Insights', locked: true },
  { value: 'exercises', label: 'Exercises' },
  { value: 'activity', label: 'Activity History' },
];

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <Pressable onPress={onPress} className="flex-row items-center gap-3">
    <View className="bg-[#D3D2D366] w-8 h-8 rounded-full items-center justify-center">
      {icon}
    </View>
    <Text className="text-[#221D23] font-sans text-[16px]">{label}</Text>
  </Pressable>
);

const UPGRADE_COPY = {
  chapter: {
    title: 'Upgrade to Access This Chapter',
    desc: 'This chapter is not available on the learner’s current plan. Upgrade their plan to unlock more chapters in this book.',
  },
  book: {
    title: 'Upgrade to Assign the Full Book',
    desc: 'The learner’s current plan includes a single chapter. Upgrade their plan to assign every chapter in this book.',
  },
};

const ListCard = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}) => (
  <View className="bg-white rounded-[24px] border border-[#C3E4C5] mt-5 overflow-hidden">
    <View className="bg-[#FAFDFF] px-5 pt-6 pb-5">
      <Text className="text-[20px] font-sansSemiBold text-dark">{title}</Text>
      <View className="mt-2">{subtitle}</View>
    </View>
    {children}
  </View>
);

const TipRow = ({
  icon,
  iconBg,
  title,
  text,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  text: string;
}) => (
  <View className="border-b border-b-[#EDEDED] py-6">
    <View
      style={{ backgroundColor: iconBg }}
      className="w-12 h-12 rounded-full items-center justify-center"
    >
      {icon}
    </View>
    <Text className="text-[16px] font-sansMedium text-dark mt-5">{title}</Text>
    <Text className="text-[14px] font-sans text-[#474348] mt-2 leading-[1.5]">
      {text}
    </Text>
  </View>
);

const BookProgress = () => {
  const params = useLocalSearchParams<{
    kidId: string;
    seriesId: string;
    name?: string;
  }>();
  const kidId = params.kidId;
  const name = firstName(params.name) || 'your learner';
  const [view, setView] = useState<ProgressView>('read');
  const [openMenu, setOpenMenu] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [upgradeFor, setUpgradeFor] = useState<'chapter' | 'book' | null>(
    null,
  );
  const dispatch = useAppDispatch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['book-progress', kidId, params.seriesId],
    queryFn: async () => await getBookProgress(kidId, params.seriesId),
    enabled: !!kidId && !!params.seriesId,
  });

  const book = data?.book;
  const stats = data?.stats;
  const hasWorkbook = !!data?.exercises?.available;
  const isFreePlan = data?.subscription?.plan === 'free';

  const seriesParams = book
    ? `title=${encodeURIComponent(book.category?.title ?? '')}&id=${book.seriesId}&seriesTitle=${encodeURIComponent(book.title)}`
    : '';

  const handleAssignFullBook = () => {
    setOpenMenu(false);
    if (!book) return;
    if (isFreePlan) {
      setUpgradeFor('book');
      return;
    }
    router.push(
      `/guardian/AssignChild?${seriesParams}&kidId=${kidId}&kidName=${encodeURIComponent(params.name ?? '')}&scope=entire`,
    );
  };

  const handleViewDetails = () => {
    setOpenMenu(false);
    if (book) router.push(`/guardian/AssignChild?${seriesParams}`);
  };

  const handleUpgrade = () => {
    setUpgradeFor(null);
    router.push(`/guardian/Subscription?kidId=${kidId}`);
  };

  const handleLoginAsLearner = async () => {
    if (switching) return;
    setOpenMenu(false);
    setSwitching(true);
    try {
      const kidData = await loginKidAsGuardian(kidId);
      await storeData('user', kidData);
      dispatch(login(kidData));
      showToast('success', 'Login Successful!');
      router.replace('/(tabs)/home-kid');
    } catch {
      showToast('error', 'Login Failed');
    } finally {
      setSwitching(false);
    }
  };

  return (
    <Container scrollable>
      <TouchableWithoutFeedback onPress={() => setOpenMenu(false)}>
        <View className="px-6 py-5 pb-10">
          <TopBackButton />
          <Text className="font-sansSemiBold text-dark text-[20px] my-4">
            Book Progress
          </Text>

          {/* Book summary */}
          <View className="bg-white rounded-[24px] border border-[#C3E4C5] p-5 z-20">
            <View className="flex-row justify-between items-start">
              {isLoading ? (
                <Skeleton
                  style={{ width: scaleWidth(64), height: scaleWidth(64) }}
                  className="rounded-[12px]"
                />
              ) : (
                <BookCover
                  image={book?.image ?? null}
                  height={scaleWidth(64)}
                  width={scaleWidth(64)}
                  className="rounded-[12px]"
                />
              )}
              <Pressable
                onPress={() => setOpenMenu((prev) => !prev)}
                className="border border-[#D3D2D366] p-3 rounded-[8px]"
              >
                <Entypo name="dots-three-vertical" size={20} color="black" />
              </Pressable>
              {openMenu && (
                <View className="p-5 rounded-[20px] shadow-md bg-white absolute top-[56px] right-0 w-[75%] z-30 gap-6">
                  <MenuItem
                    icon={<Feather name="user" size={16} color="#221D23" />}
                    label="Log in as Learner"
                    onPress={handleLoginAsLearner}
                  />
                  {book?.accessType !== 'full' && (
                    <MenuItem
                      icon={
                        <Feather name="book-open" size={15} color="#221D23" />
                      }
                      label="Assign Full Book"
                      onPress={handleAssignFullBook}
                    />
                  )}
                  <MenuItem
                    icon={<Feather name="share" size={15} color="#221D23" />}
                    label="View Book Details"
                    onPress={handleViewDetails}
                  />
                </View>
              )}
            </View>
            {isLoading ? (
              <>
                <Skeleton className="w-1/3 rounded-full mt-5" />
                <Skeleton className="w-2/3 rounded-full mt-3" />
                <Skeleton className="w-full h-2 rounded-full mt-6" />
              </>
            ) : (
              <>
                <Text className="text-[18px] font-sansSemiBold text-dark mt-5">
                  {book?.category?.title}
                </Text>
                <Text className="text-[16px] font-sans text-[#474348] mt-2">
                  {bookTitle(book)}
                </Text>
                <Text className="text-[16px] font-sans text-[#474348] mt-5 mb-3">
                  Reading Progress
                </Text>
                <BookProgressBar percent={book?.progressPercentage ?? 0} />
                <Text className="text-[14px] font-sans text-[#474348] mt-3">
                  Chapter {book?.currentChapter?.position ?? 0} of{' '}
                  {book?.totalChapters ?? 0}
                </Text>
              </>
            )}
            {switching && (
              <ActivityIndicator className="mt-4" color="#3F9243" />
            )}
          </View>

          {isError && (
            <View className="mt-5">
              <EmptyState text="We couldn’t load this book’s progress. Please try again." />
            </View>
          )}

          {/* Stats */}
          <View className="bg-white rounded-[24px] border border-[#C3E4C5] p-5 pb-1 mt-5">
            <StatCard
              loading={isLoading}
              iconBg="#E8F1FB"
              icon={<Ionicons name="book" size={22} color="#1671D9" />}
              label="Chapters Completed"
              value={stats?.chaptersCompleted ?? 0}
              suffix={`of ${stats?.totalChapters ?? 0}`}
            />
            <StatCard
              loading={isLoading}
              iconBg="#FBF7E5"
              icon={<Ionicons name="flame" size={22} color="#F2700D" />}
              label="Total Time Spent"
              value={formatDuration(stats?.timeSpentSeconds)}
            />
            <StatCard
              loading={isLoading}
              iconBg="#F6EEF8"
              icon={<Feather name="file-text" size={20} color="#A33BB3" />}
              label="Workbook Exercises"
              value={
                hasWorkbook ? (stats?.workbookExercises?.completed ?? 0) : (
                  <Text className="text-[16px] font-sans text-[#474348]">
                    No workbook yet
                  </Text>
                )
              }
              suffix={
                hasWorkbook
                  ? `of ${stats?.workbookExercises?.total ?? 0}`
                  : undefined
              }
            />
            {/* Play & Learn activities aren't tracked here yet */}
            <StatCard
              comingSoon
              iconBg="#EDEDED"
              icon={
                <Ionicons name="game-controller" size={22} color="#918E91" />
              }
              label="Activities Completed"
            />
          </View>

          <SectionDropdown
            options={VIEW_OPTIONS}
            value={view}
            onChange={setView}
          />

          {view === 'read' && (
            <ListCard
              title={`Chapters (${data?.chapters?.length ?? 0})`}
              subtitle={
                <Text className="text-[16px] font-sans text-[#474348] leading-[1.5]">
                  Track progress for each chapter in this book
                </Text>
              }
            >
              {isLoading ? (
                <View className="p-5 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-12 rounded-[12px]" />
                  ))}
                </View>
              ) : data?.chapters?.length ? (
                <StatusRows
                  rows={data.chapters.map((c) => ({
                    key: String(c.chapterId),
                    position: c.position,
                    title: c.title,
                    status: c.status,
                  }))}
                  onUpgrade={() => setUpgradeFor('chapter')}
                />
              ) : (
                <View className="p-5">
                  <EmptyState text="No chapters in this book yet." />
                </View>
              )}
            </ListCard>
          )}

          {view === 'exercises' && (
            <ListCard
              title="Workbook Exercises"
              subtitle={
                hasWorkbook || isLoading ? (
                  <View className="flex-row items-center gap-2">
                    <Text className="text-[16px] font-sans text-[#474348]">
                      {data?.exercises?.total ?? 0} Exercises
                    </Text>
                    <View className="w-1.5 h-1.5 rounded-full bg-[#474348]" />
                    <Text className="text-[16px] font-sans text-[#474348]">
                      {data?.exercises?.unlocked ?? 0} Unlocked
                    </Text>
                  </View>
                ) : (
                  <Text className="text-[16px] font-sans text-[#474348]">
                    No workbook yet
                  </Text>
                )
              }
            >
              {isLoading ? (
                <View className="p-5 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-12 rounded-[12px]" />
                  ))}
                </View>
              ) : data?.exercises?.available && data.exercises.items.length ? (
                <StatusRows
                  rows={data.exercises.items.map((e) => ({
                    key: String(e.chapterId),
                    position: e.position,
                    title: e.title,
                    status: e.status,
                  }))}
                  onUpgrade={() => setUpgradeFor('chapter')}
                />
              ) : (
                <View className="p-5">
                  <EmptyState
                    text={
                      hasWorkbook
                        ? 'No exercises in this workbook yet.'
                        : 'No workbook yet'
                    }
                  />
                </View>
              )}
            </ListCard>
          )}

          {view === 'activity' && (
            <ActivityFeed
              title="Recent Learning Activity"
              subtitle={`${name.charAt(0).toUpperCase()}${name.slice(1)}’s latest learning activity`}
              items={data?.activityHistory ?? []}
              loading={isLoading}
            />
          )}

          {/* Helpful tips */}
          <View className="bg-white rounded-[24px] border border-[#C3E4C5] mt-5 overflow-hidden">
            <View className="px-5 pt-6 pb-5 border-b border-b-[#EDEDED]">
              <Text className="text-[20px] font-sansSemiBold text-dark">
                Helpful Tips
              </Text>
              <Text className="text-[16px] font-sans text-[#474348] mt-2 leading-[1.5]">
                Understand this book progress at a glance.
              </Text>
            </View>
            <View className="px-5 pb-5">
              <TipRow
                iconBg="#E8F1FB"
                icon={<Ionicons name="book" size={22} color="#1671D9" />}
                title="Track Chapter Progress"
                text="See assigned, unlocked, completed, and in-progress chapters."
              />
              <TipRow
                iconBg="#F6EEF8"
                icon={<Feather name="file-text" size={20} color="#A33BB3" />}
                title="Follow Workbook Progress"
                text="Workbook exercises are completed offline, but tracked here."
              />
              <View className="bg-[#E8F1FB] rounded-[16px] p-4 mt-6">
                <View className="w-9 h-9 rounded-full bg-[#DDE3EA] items-center justify-center">
                  <Ionicons name="bulb" size={18} color="#D5B300" />
                </View>
                <Text className="text-[18px] font-sansMedium text-[#004D99] mt-3">
                  Tip for Parents
                </Text>
                <Text className="text-[14px] font-sans text-dark mt-2 leading-[1.5]">
                  For a fuller breakdown, log in as learner to view the
                  activities, exercises, and learning experience connected to
                  this book.
                </Text>
                <Image
                  source={IMAGES.TipKidReading}
                  style={{ width: scaleWidth(90), height: scaleWidth(100) }}
                  resizeMode="contain"
                  className="mt-3 ml-4"
                />
              </View>
            </View>
          </View>

          {/* Explore more */}
          <View className="bg-[#EDF6EE] rounded-[24px] border border-[#DBEFDC] p-5 mt-5">
            <Image
              source={IMAGES.ExploreBooksStack}
              style={{ width: scaleWidth(64), height: scaleWidth(64) }}
              className="rounded-full"
            />
            <Text className="text-[18px] font-sansMedium text-[#1E3D1F] mt-4">
              Explore More Books
            </Text>
            <Text className="text-[16px] font-sans text-dark mt-2 leading-[1.5]">
              Find other books {name} may enjoy.
            </Text>
            <Pressable
              onPress={() => router.push('/(tabs)/curriculum')}
              className="self-start bg-[#3F9243] border-b-2 border-b-[#265828] rounded-full px-6 py-3 mt-5"
            >
              <Text className="text-white font-sansMedium text-[16px]">
                EXPLORE BOOKS
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TrialLockModal
        open={!!upgradeFor}
        title={UPGRADE_COPY[upgradeFor ?? 'chapter'].title}
        desc={UPGRADE_COPY[upgradeFor ?? 'chapter'].desc}
        icon={
          <MaterialCommunityIcons
            name="crown-outline"
            size={32}
            color={UPGRADE_COLOR}
          />
        }
        iconBg="#FBF1EA"
        buttonText1="UPGRADE PLAN"
        buttonText2="MAYBE LATER"
        onProceed={handleUpgrade}
        onClose={() => setUpgradeFor(null)}
      />
    </Container>
  );
};

export default BookProgress;
