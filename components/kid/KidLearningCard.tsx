import { AssignedChapter } from '@/types';
import { ensureHttps } from '@/utils';
import { calculateChapterProgress } from '@/utils/kid';
import { scaleHeight } from '@/utils/scale';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import Button from '../Button';
import ProgressBar from '../ProgressBar';

type ChapterProps = AssignedChapter & {
  bookImage: string;
  seriesTitle: string;
  bookId: string;
};

const KidLearningCard = (props: ChapterProps) => {
  const progress = calculateChapterProgress({
    currentPLIndex: props?.currentPLIndex,
    currentPageIndex: props.currentPageIndex,
    totalPages: props?.chapterId?.pages?.length,
  });

  
  return (
    <View className="bg-white p-5 rounded-[20px] flex-col items-start z-20 border border-[#D3D2D366] mb-6">
      <Image
        style={{ height: scaleHeight(144) }}
        source={{ uri: ensureHttps(props?.bookImage) }}
        className="rounded-[20px] w-full h-full mb-5"
        alt={props?.chapterId?.seriesId || 'card image'}
      />
      <View className=" rounded-full py-1.5 flex-row items-center gap-2.5 mb-4 bg-[#D3D2D333] px-3">
        <Text className="font-sans text-dark capitalize">
          {extractNameWithoutJpg(props?.bookImage)}
        </Text>
      </View>
      <Text className="text-[18px] font-sansMedium mb-2">
        Series {props?.chapterId?.index} : {props?.chapterId?.title}
      </Text>
      <View className="flex-row  mb-7 mt-5 justify-between items-center w-full ">
        <View className="w-[85%]">
          <ProgressBar percent={Number(progress) || 0} height={10} />
        </View>
        <Text>{progress || 0}%</Text>
      </View>

      <Button
        onPress={() =>
          router.push(
            `/kid/Playground?book=${props.bookId}&series=${props?.chapterId?.seriesId}&chapterId=${props?.chapterId?._id}&lessonId=${props?.chapterId?.lessons?.[0]?._id}&mode=read&page=1`,
          )
        }
        className="w-full bg-white border-primary border-2"
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

function extractNameWithoutJpg(url: string): string | null {
  if (!url) return null;

  const fileName = url.split('/').pop();
  if (!fileName) return null;

  return fileName.replace(/\.jpg$/i, '').replace(/%20/g, ' ');
}

export default KidLearningCard;
