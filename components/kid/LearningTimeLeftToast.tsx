import { ICONS } from '@/assets/icons';
import { scaleWidth, SCREEN_WIDTH } from '@/utils/scale';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export const LEARNING_TIME_LEFT_TOAST = 'learningTimeLeft';

/** Tells the kid how much of today's learning time is left */
export const showLearningTimeLeftToast = (minutes: number) => {
  const unit = minutes === 1 ? 'minute' : 'minutes';
  Toast.show({
    type: LEARNING_TIME_LEFT_TOAST,
    text1: `${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'} Left!`,
    text2: `You have ${minutes} ${unit} of learning time left today.`,
    visibilityTime: 6000,
  });
};

const LearningTimeLeftToast = ({
  title,
  message,
}: {
  title?: string;
  message?: string;
}) => (
  <View
    style={{ width: SCREEN_WIDTH * 0.9 }}
    className="bg-white rounded-[16px] p-4 flex-row items-start gap-3 border-b-[4px] border-l border-r border-b-[#1671D9] border-l-[#1671D9]/10 border-r-[#1671D9]/10"
  >
    <View
      style={{ width: scaleWidth(48), height: scaleWidth(48) }}
      className="bg-[#E3ECF5] rounded-full items-center justify-center"
    >
      <Feather name="clock" size={scaleWidth(24)} color="#0F4C8A" />
    </View>
    <View className="flex-1">
      <Text className="text-[18px] font-sansSemiBold text-[#221D23]">
        {title}
      </Text>
      <Text className="text-[16px] leading-[1.5] font-sans text-[#221D23] mt-1">
        {message}
      </Text>
    </View>
    <Pressable hitSlop={8} onPress={() => Toast.hide()}>
      <ICONS.Close />
    </Pressable>
  </View>
);

export default LearningTimeLeftToast;
