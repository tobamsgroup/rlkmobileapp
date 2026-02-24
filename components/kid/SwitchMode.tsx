import React, { useMemo } from 'react';
import { Image, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button, { SecondaryButton } from '../Button';

const TEXT_MAP = [
  {
    mode: 'play',
    header: 'Time for Some Fun?',
    body: 'You’ve done great, reading! Try Play & Learn to explore this story through games and challenges.',
    button1: 'SWITCH TO PLAY & LEARN',
    button2: 'MAYBE LATER',
    image: IMAGES.SwitchKid_Male,
  },
  {
    mode: 'read',
    header: 'Ready to Read?',
    body: 'You’ve had a fun start! Now it’s time to read so you can learn more, solve challenges, and earn your Reading Streak XP.',
    button1: 'SWITCH TO READ MODE',
    button2: 'MAYBE LATER',
    image: IMAGES.SwitchKid_Female_1,
  },
  {
    mode: 'timebound',
    header: 'Wait, You Only Have 9 Minutes to Go!',
    body: 'You’ve read for 6 minutes. Read a little more to earn your Reading Streak XP!',
    button1: 'KEEP READING',
    button2: 'SWITCH ANYWAY',
    image: IMAGES.SwitchKid_Female_2,
  },
  {
    mode: 'continue',
    header: 'Continue to Play & Learn Mode?',
    body: 'You’ve completed your Reading Streak for today! Want to continue in Play & Learn Mode now?',
    button1: 'SWITCH TO PLAY & LEARN',
    button2: 'MAYBE LATER',
    image: IMAGES.SwitchKid_Female_3,
  },
];

export const SwitchMode = ({
  onClose,
  mode = 'play',
  onSubmit,
}: {
  onClose: () => void;
  mode: 'play' | 'timebound' | 'continue' | 'read';
  onSubmit: () => void;
}) => {
  const targetText = useMemo(() => {
    return TEXT_MAP?.find((t) => t.mode === mode);
  }, [mode]);

  return (
    <View className="flex-1 items-center justify-center px-4">
      <View className="rounded-[32px] bg-[#DBEFDC] px-6 py-6 w-full max-w-[720px] relative">
        {/* Card */}
        <View className="bg-white w-full rounded-[24px] items-center p-6 relative">
          <Image
            source={targetText?.image}
            resizeMode="contain"
            style={{ width: 103, height: 103 }}
          />

          <Text className="text-[#265828] font-sansSemiBold text-[20px] text-center mt-4">
            {targetText?.header}
          </Text>

          <Text className="text-[#221D23] text-[16px] font-sans text-center mt-2">
            {targetText?.body}
          </Text>

          {/* Decorations */}

          {/* <View className="absolute top-[18%] left-[15%] rotate-90">
            <ICONS.Confetti gradientStart="#FF9214" gradientStop="#FF4E0D" />
          </View>

          <View className="absolute bottom-[35%] right-[10%]">
            <ICONS.Confetti gradientStart="#80DAFE" gradientStop="#008EE6" />
          </View> */}

          <ICONS.Star
            width={18}
            height={18}
            style={{ position: 'absolute', top: '37%', left: '10%' }}
            fill="#AAC4DD"
          />

          <ICONS.Star
            width={18}
            height={18}
            style={{ position: 'absolute', top: '40%', left: '25%' }}
            fill="#FFE455"
          />

          <ICONS.Star
            width={18}
            height={18}
            style={{ position: 'absolute', top: '10%', right: '10%' }}
            fill="#FFE455"
          />

          <ICONS.Star
            width={18}
            height={18}
            style={{ position: 'absolute', top: '40%', right: '15%' }}
            fill="#FFE455"
          />

          <View className="w-[14px] h-[13px] border-[#09913766] border-2 rounded-full absolute top-[10%] left-[30%]" />
          <View className="w-[14px] h-[13px] border-[#DE21214D] border-2 rounded-full absolute top-[30%] right-[25%]" />
        </View>

        <Button
        className='mt-6'
          onPress={() => {
            onSubmit();
            onClose();
          }}
          text={targetText?.button1}
        />

        {/* Secondary Button */}
        <SecondaryButton className='mt-6' onPress={onClose} text={targetText?.button2} />
      </View>
    </View>
  );
};
