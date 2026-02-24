import { useSound } from '@/context/SoundContext';
import Lottie from 'lottie-react-native';
import React, { FC, useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import ReactNativeModal from 'react-native-modal';
import { twMerge } from 'tailwind-merge';
import congrats from '../../assets/lottie/congratulations.json';
import cyborg from '../../assets/lottie/cyborg.json';
import robot from '../../assets/lottie/robot.json';
import Button from '../Button';

type PopupProps = {
  animation?: 'robot' | 'congrats' | 'cyborg';
  title?: string;
  message?: string;
  onClick?: () => void;
  buttonText?: string;
  sound?: boolean;
  nextLesson: string;
  onNext?: () => void;
  className?: string;
};

const animations = {
  cyborg,
  robot,
  congrats,
};

const { width, height } = Dimensions.get('window');

const CongratulationsPopup: FC<PopupProps> = ({
  animation = 'congrats',
  title,
  message,
  onClick,
  buttonText,
  sound = true,
  nextLesson,
  onNext,
  className,
}) => {
  const { play } = useSound();

  useEffect(() => {
    if (sound) {
      play('cheers');
    }
  }, [sound]);

  return (
    <ReactNativeModal isVisible>
      <View
        className={twMerge(
          'absolute top-0 left-0 w-full h-full flex items-center justify-center p-6 z-[100] ',
          className,
        )}
      >
        {/* Confetti */}
        <ConfettiCannon count={200} origin={{ x: width / 2, y: 0 }} fadeOut />

        {/* Popup container */}
        <View className="border-4 border-[#265828] rounded-[20px] shadow-2xl flex items-center p-4 bg-primary/90">
          <Text className="text-white font-semibold text-[20px] mb-2">
            {title || 'Lesson Completed'}
          </Text>

          <Lottie
            source={animations[animation]}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />

          {message && (
            <Text className="text-white font-medium text-[20px] mb-4 text-center">
              {message}
            </Text>
          )}

          <View className="flex flex-row items-center gap-5">
            <Button onPress={onNext} text="Continue" className="w-full" />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default CongratulationsPopup;
