import { ICONS } from '@/assets/icons';
import { AssignedSeries, KidLearningOverview } from '@/types';
import { ensureHttps } from '@/utils';
import { getSeriesProgress } from '@/utils/kid';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Button from '../Button';
import ProgressBar from '../ProgressBar';

const KidSeriesProgressCard = ({ item }: { item: KidLearningOverview }) => {
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const dataLength = item?.assignedSeries?.length;

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= dataLength || 0) return;

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });

    setCurrentIndex(index);
  };

  return (
    <View className="bg-white rounded-[16px] p-6 border border-[#D3D2D366] mb-5">
      <Text className="font-sansSemiBold text-[20px] mb-6 text-[#1F4B22] mt-2">
        {item.bookId?.title}
      </Text>
      <FlatList
        horizontal
        data={item?.assignedSeries}
        ref={flatListRef}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4"
        keyExtractor={(_, i) => i.toString() + 'inner'}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / scaleWidth(279),
          );
          setCurrentIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: scaleWidth(279),
          offset: scaleWidth(279) * index,
          index,
        })}
        snapToInterval={scaleWidth(279)}
        decelerationRate="fast"
        renderItem={({ item: seriesh }) => (
          <KidSeriesProgressCardInner
            series={seriesh}
            chapterId={item?.assignedChapters?.filter(i => i.chapterId?.seriesId === seriesh.seriesId._id)?.[0]?.chapterId?._id!}
            progress={getSeriesProgress(
              seriesh.seriesId._id,
              item.assignedChapters,
            )}
          />
        )}
      />

      <View className="flex-row items-center gap-8 justify-end pt-4 pb-6">
        <Pressable
          onPress={() => scrollToIndex(currentIndex - 1)}
          style={{ width: scaleWidth(32), height: scaleWidth(32) }}
          className={twMerge(
            'w-10 h-10 rounded-full items-center justify-center',
            currentIndex === 0 ? 'bg-[#D3D2D333] ' : 'bg-[#DBEFDC]',
          )}
        >
          <ICONS.ChevronLeft
            stroke={currentIndex === 0 ? '#474348' : '#3F9243'}
          />
        </Pressable>
        <Pressable
          onPress={() => scrollToIndex(currentIndex + 1)}
          style={{ width: scaleWidth(32), height: scaleWidth(32) }}
          className={twMerge(
            'w-10 h-10 rounded-full items-center justify-center',
            currentIndex === dataLength - 1
              ? 'bg-[#D3D2D333] '
              : 'bg-[#DBEFDC]',
          )}
        >
          <ICONS.ChevronRight
            stroke={currentIndex === dataLength - 1 ? '#474348' : '#3F9243'}
          />
        </Pressable>
      </View>
      <Button
        onPress={() => router.push(`/kid/SeriesLearningList?id=${item._id}`)}
        className="w-full mt-4"
        text={'VIEW ALL'}
      />
    </View>
  );
};

export const KidSeriesProgressCardInner = ({
  series,
  full = false,
  progress,
  chapterId
}: {
  series: AssignedSeries;
  full?: boolean;
  progress: number;
  chapterId:string
}) => {
  return (
    <View
      style={{ width: full ? '100%' : scaleWidth(279) }}
      className="border border-[#D3D2D366] rounded-[20px] p-4"
    >
      <View className="rounded-[20px] w-full items-center relative">
        {/* <View
          className={twMerge(
            'absolute left-3 top-3 w-[28px] h-[28px] rounded-[6px] items-center justify-center',
            iconType === 'read' ? 'bg-[#2E6F32]' : 'bg-[#2F5CC8]',
          )}
        >
          {iconType === 'read' ? (
            <ICONS.BookOpenedSmall width={16} height={16} />
          ) : (
            <ICONS.Puzzle width={16} height={16} />
          )}
        </View> */}
        <Image
          source={{ uri: ensureHttps(series?.seriesId?.image) }}
          style={{ height: scaleHeight(164) }}
          className="w-full rounded-[20px]"
        />
        {/* {status === 'completed' && (
          <View className="absolute inset-0 items-center justify-center">
            <View className="bg-white/90 w-[92px] h-[92px] rounded-full items-center justify-center">
              <View className="w-[32px] h-[32px] rounded-full bg-[#E6F3E6] items-center justify-center">
                <ICONS.Check width={14} height={14} />
              </View>
              <Text className="font-sansBold text-[#1F4B22] mt-2">
                COMPLETED
              </Text>
            </View>
          </View>
        )} */}
      </View>
      <Text className="text-[18px] font-sansSemiBold text-dark mt-4">
        Series {series?.seriesId?.index}: {series?.seriesId?.title}
      </Text>
      <View className="flex-row items-center gap-3 mt-4">
        <View className="flex-1">
          <ProgressBar percent={progress || 0} height={10} />
        </View>
        <Text className=" text-[#221D23] font-sansSemiBold">{progress}%</Text>
      </View>
      <Button
        onPress={() =>
            // console.log(

            //     `/kid/Playground?book=${series.seriesId.bookId}&series=${series?.seriesId._id}&chapterId=${series?.seriesId?.chapters?.[0]}&mode=play&page=1`,
            //     series
            // )
          router.push(
            `/kid/Playground?book=${series.seriesId.bookId}&series=${series?.seriesId._id}&chapterId=${chapterId}&lessonId=${series?.seriesId?.chapters?.[0]}&mode=read&page=1`,
          )
        }
        className="w-full mt-4 bg-white border-primary border-2"
        textClassname="text-primary"
        text={
          Number(progress) === 0
            ? 'START'
            : Number(progress) === 100
              ? 'VIEW'
              : 'CONTINUE'
        }
      />
    </View>
  );
};

export default KidSeriesProgressCard;
