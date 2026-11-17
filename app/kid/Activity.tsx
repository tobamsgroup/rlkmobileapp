import MissionGame from '@/components/Games/MissionGame';
import { Mascot } from '@/components/Games/ui';
import VideoPlayer from '@/components/kid/VideoPlayer';
import { IMAGES } from '@/assets/images';
import { getPlayLearnContent } from '@/constants/playLearn';
import { Chapter } from '@/types';
import { MissionFormat } from '@/types/mission';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

const FLOWING_MODELS: MissionFormat[] = ['match', 'mystery', 'adventure'];

/** Introduction (page 1) and Mission Challenge (page 5) of a chapter. */
const Activity = ({
  chapters,
  onNext,
}: {
  chapters: Chapter[] | undefined;
  onNext: () => void;
}) => {
  const { chapterId, page = '1' } = useLocalSearchParams();

  const { introVideoUrl, mission } = useMemo(
    () => getPlayLearnContent(chapters?.find((ch) => ch._id === chapterId)),
    [chapterId, chapters],
  );

  const isMission = page === '5';
  // Story games grow with their content so the page is the only scroll;
  // the rest need a fixed play area to lay out and drag within.
  const flowing = isMission && !!mission && FLOWING_MODELS.includes(mission.model);

  return (
    <View
      className={twMerge(
        'w-full mb-[5px] relative',
        flowing ? 'min-h-[65vh]' : 'h-[65vh] rounded-[20px] bg-[#265828]',
      )}
    >
      {isMission ? (
        mission ? (
          <MissionGame
            key={chapterId as string}
            mission={mission}
            onNext={onNext}
          />
        ) : (
          <ComingSoon
            title="Mission Challenge is coming soon!"
            message="Robo is still building this chapter's mission. Tap NEXT to keep going with the Mastery Quiz."
          />
        )
      ) : introVideoUrl ? (
        <VideoPlayer key={introVideoUrl} src={introVideoUrl} />
      ) : (
        <ComingSoon
          title="The intro video is coming soon!"
          message="Tap NEXT to jump into the Learning Module."
        />
      )}
    </View>
  );
};

const ComingSoon = ({ title, message }: { title: string; message: string }) => (
  <View className="flex-1 items-center justify-center px-8 gap-5 overflow-hidden rounded-[20px]">
    <View className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
    <View className="absolute -bottom-20 -left-12 w-56 h-56 rounded-full bg-white/5" />

    <Mascot image={IMAGES.PlayComing} size={120} />
    <Animated.View entering={FadeInDown.springify().damping(16)} className="items-center gap-2">
      <View className="bg-[#D5B300] rounded-full px-3 py-1">
        <Text className="text-[#265828] font-sansSemiBold text-[12px] tracking-[1px]">
          COMING SOON
        </Text>
      </View>
      <Text className="text-white font-sansSemiBold text-[20px] text-center">
        {title}
      </Text>
      <Text className="text-white/80 font-sans text-[15px] leading-[22px] text-center">
        {message}
      </Text>
    </Animated.View>
  </View>
);

export default Activity;
