import { fetchKidLearning, fetchWorkbooks } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import { KidSeriesProgressCardInner } from '@/components/kid/KidSeriesProgressCard';
import TopBackButton from '@/components/TopBackButton';
import { WorkbookSeries } from '@/types';
import { getSeriesProgress } from '@/utils/kid';
import { STAUS_BAR_HEIGHT } from '@/utils/scale';
import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  findNodeHandle,
  FlatList,
  Image,
  Pressable,
  Text,
  UIManager,
  View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import Svg, { Path } from 'react-native-svg';
import { twMerge } from 'tailwind-merge';

const SeriesLearningList = () => {
  const { id } = useLocalSearchParams();
  const [tab, setTab] = useState('workbook');
  const { data, isLoading } = useQuery({
    queryKey: ['kid-learning'],
    queryFn: async () => {
      return await fetchKidLearning();
    },
  });

  const series = useMemo(() => {
    if (!data || !id) return;

    return data?.find((d) => d._id === id);
  }, [data, id]);

  const { data: workbooks, isLoading: isLodaingWorkbooks } = useQuery({
    queryKey: ['workbooks', series?.bookId?._id],
    queryFn: async () => {
      return await fetchWorkbooks(series?.bookId?._id!);
    },
    enabled: !!series?.bookId?._id,
  });

  console.log({ workbooks });
  return (
    <View className="bg-[#DBEFDC] flex-1" style={{ paddingBottom: 10 }}>
      <View
        className="bg-[#265828] p-6"
        style={{
          paddingTop: STAUS_BAR_HEIGHT + 24,
        }}
      >
        <TopBackButton />
        <Text className="text-white text-[20px] font-sansSemiBold mt-4">
          {series?.bookId?.title}
        </Text>
      </View>

      <View className="p-7 flex-1 ">
        <View className="bg-white px-4 py-2 rounded-full mb-6 flex-row ">
          <Pressable
            onPress={() => setTab('book')}
            className={twMerge(
              ' rounded-full py-3 px-6 items-center justify-center w-[50%]',
              tab === 'book' && 'bg-[#3F9243]',
            )}
          >
            <Text
              className={twMerge(
                'font-sansMedium text-[16px]',
                tab === 'book' ? 'text-white' : 'text-[#474348]',
              )}
            >
              Books
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab('workbook')}
            className={twMerge(
              ' rounded-full py-3 px-6 items-center justify-center w-[50%]',
              tab === 'workbook' && 'bg-[#3F9243]',
            )}
          >
            <Text
              className={twMerge(
                'font-sansMedium text-[16px]',
                tab === 'workbook' ? 'text-white' : 'text-[#474348]',
              )}
            >
              Workbooks
            </Text>
          </Pressable>
        </View>
        {tab === 'book' && (
          <FlatList
            data={series?.assignedSeries || []}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            contentContainerClassName="p-6 bg-[#FCFCFC] rounded-[16px] gap-4"
            renderItem={({ item }) => (
              <KidSeriesProgressCardInner
                series={item}
                chapterId={
                  series?.assignedChapters?.filter(
                    (i) => i.chapterId?.seriesId === item?.seriesId._id,
                  )?.[0]?.chapterId?._id!
                }
                lessonId={
                  series?.assignedChapters?.filter(
                    (i) => i.chapterId?.seriesId === item?.seriesId._id,
                  )?.[0]?.chapterId?.lessons?.[0]?._id!
                }
                progress={getSeriesProgress(
                  item.seriesId._id,
                  series?.assignedChapters! || [],
                )}
                full
              />
            )}
          />
        )}
        {tab === 'workbook' && (
          <FlatList
            data={workbooks || []}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            contentContainerClassName="] gap-4"
            renderItem={({ item }) => (
              <WorkbookCard {...item} bookId={series?.bookId?._id!} />
            )}
          />
        )}
      </View>
    </View>
  );
};

const WorkbookCard = (props: WorkbookSeries & { bookId: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openLock, setOpenLock] = useState(false);
  const [openLockedPosition, setOPenLockedPosition] = useState(0);

  const unlocked = useMemo(() => {
    return props?.chapters.filter((chapter) => chapter.isAccessible).length;
  }, [props?.chapters]);

  const handleLockedClicked = (e: any) => {
    const node = findNodeHandle(e.currentTarget);

    if (!node) return;

    UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
      const bottom = pageY + height;

      setOPenLockedPosition(bottom);
      setOpenLock(true);
    });
  };
  return (
    <View
      className={twMerge(
        'bg-[#F1F9F1] border-[#D3D2D366] border p-4 rounded-[20px]',
        !isExpanded && 'bg-white',
      )}
    >
      <Pressable
        onPress={() => setIsExpanded((prev) => !prev)}
        className="flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-2 flex-1">
          <Image
            source={{ uri: props?.seriesImage }}
            className="w-10 h-10 rounded-full"
          />
          <Text className="text-[18px] font-sansMedium flex-1">
            Series {props?.seriesIndex}: {props?.seriesName}
          </Text>
        </View>
        <View className="w-9 h-9 bg-white rounded-full items-center justify-center flex-shrink-0">
          {!isExpanded ? <ICONS.ChevronDown /> : <ICONS.ChevronUp />}
        </View>
      </Pressable>
      <View className="flex-row mt-3 items-center pl-4 gap-2">
        <Text className="font-sansMedium text-[#474348] ">
          {props?.chapters?.length} Workbook Exercises
        </Text>
        <View className="w-1 h-1 rounded-full bg-[#918E91]" />
        <Text className="font-sansMedium text-[#474348] ">
          {unlocked} Unlocked
        </Text>
      </View>
      {isExpanded && (
        <View className="mt-6 gap-[2px]">
          {props?.chapters?.map((c) => (
            <Pressable
              onPress={(e) => {
                if (c?.isAccessible) {
                  router?.push(
                    `/kid/WorkbookView?chapterId=${c?.chapterId}&bookId=${props?.bookId}&chapter=${JSON.stringify(c)}`,
                  );
                } else {
                  handleLockedClicked(e);
                }
              }}
              key={c.chapterId}
              className=" bg-white p-6"
            >
              <View className="flex-row items-center gap-2">
                <View className="w-10 h-10 bg-[#F1F9F1] rounded-full items-center justify-center">
                  <Text className="text-[16px] text-[#3F9243] font-sansMedium">
                    {c?.chapterIndex}
                  </Text>
                </View>
                <Text className="font-sansMedium text-[16px] text-[#221D23]">
                  {c?.chapterName}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-5">
                <View
                  className={twMerge(
                    'px-4 py-3 rounded-full flex-row items-center gap-2',
                    c?.isCompleted
                      ? 'bg-[#0991371A]'
                      : c?.isStarted
                        ? 'bg-[#1671D91A]'
                        : c?.isAccessible
                          ? 'bg-[#D5B3001A]'
                          : 'bg-[#D3D2D366]',
                  )}
                >
                  {!c?.isAccessible && <ICONS.Lock width={18} height={18} />}
                  <Text
                    className={twMerge(
                      'font-sansMedium',
                      c?.isCompleted
                        ? 'text-[#099137]'
                        : c?.isStarted
                          ? 'text-[#1671D9]'
                          : c?.isAccessible
                            ? 'text-[#D5B300]'
                            : 'text-[#6C686C]',
                    )}
                  >
                    {c?.isCompleted
                      ? 'Completed'
                      : c?.isStarted
                        ? 'In Progress'
                        : c?.isAccessible
                          ? 'Not Started'
                          : 'Locked'}
                  </Text>
                </View>
                <Pressable>
                  <Text className="font-sansMedium text-[#3F9243] text-[16px] underline">
                    View
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      )}
      <ToolTip
        top={openLockedPosition}
        open={openLock}
        onClose={() => setOpenLock(false)}
      />
    </View>
  );
};

const ToolTip = ({
  top,
  open,
  onClose,
}: {
  top: number;
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <ReactNativeModal
      onBackdropPress={onClose}
      isVisible={open}
      style={{ margin: 0, padding: 0 }}
      backdropOpacity={0.4}
    >
      <View style={{ top: top }} className="px-5 absolute w-full">
        <View className="items-center w-full  z-[100]">
          <Svg width={40} height={20} viewBox="0 0 40 20">
            <Path
              d="M0 20 L20 0 L40 20 Z"
              fill="white"
              stroke="#D3D2D3"
              strokeWidth={1}
            />
          </Svg>

          <View className="bg-white border border-[#D3D2D3] rounded-3xl w-full p-6">
            <View className=" flex-row items-start w-full gap-3">
              <ICONS.TooltipStar />
              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <Text className="text-[18px] font-sansMedium text-gray-800 mb-2">
                    Workbook Exercise locked
                  </Text>
                </View>

                <Text className="text-[16px] leading-[1.5] font-sans text-[#474348]">
                  <Text className="">
                    Complete the chapter to unlock this exercise.
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default SeriesLearningList;
