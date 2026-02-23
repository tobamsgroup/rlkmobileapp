import { IMAGES } from '@/assets/images';
import { scaleHeight } from '@/utils/scale';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';
import Button from '../Button';
import ProgressBar from '../ProgressBar';
import { AssignedChapter } from '@/types';
import { ensureHttps } from '@/utils';


type ChapterProps = AssignedChapter & {
  bookImage: string;
  seriesTitle: string;
  bookId: string;
};

const KidLearningCard = (props: ChapterProps) => {
  return (
    <View className="bg-white p-5 rounded-[20px] flex-col items-start z-20 border border-[#D3D2D366] mb-6">
      <Image
        style={{ height: scaleHeight(144) }}
        source={{uri: ensureHttps(props?.bookImage)}}
        className="rounded-[20px] w-full h-full mb-5"
        alt={props?.chapterId?.seriesId || "card image"}
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
          <ProgressBar percent={80} height={10} />
        </View>
        <Text>80%</Text>
      </View>

      <Button
        onPress={() => router.push('/kid/Playground')}
        className="w-full bg-white border-primary border-2"
        textClassname="text-primary"
        text="CONTINUE"
      />
    </View>
  );
};

function extractNameWithoutJpg(url: string): string | null {
  if (!url) return null;

  const fileName = url.split("/").pop();
  if (!fileName) return null;

  return fileName.replace(/\.jpg$/i, "").replace(/%20/g, " "); 
}

export default KidLearningCard;
