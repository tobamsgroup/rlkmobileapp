import { IMAGES } from '@/assets/images';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type OptionType = {
  id: string;
  label: string;
};

const OPTIONS: OptionType[] = [
  { id: '1', label: 'Does what they say they will do' },
  { id: '2', label: 'Forgets to finish tasks' },
];

export default function Matching() {
  const [droppedOption, setDroppedOption] = useState<OptionType | null>(null);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-[#FFFFFF] p-6 py-8 rounded-[20px] relative z-30">
     
        <Text className="text-[18px] font-sansMedium text-center font-semibold text-dark mb-8 z-30">
          Match each word with its child-friendly meaning
        </Text>

        {/* Word */}
        <View className="bg-[#3F9243] border-b border-b-[#88CA8A] self-center px-8 py-6 rounded-xl   mb-10">
          <Text className="text-white text-[18px] font-sansMedium ">
            RESPONSIBLE
          </Text>
        </View>

        {/* Drop Zone */}
        <View className=" border-2 border-dashed border-[#D3D2D3] rounded-[16px] py-8 px-2 justify-center items-center mb-8 bg-[#D3D2D31A]">
          <Text className="text-center px-4 font-sans text-[#474348]">
            {droppedOption
              ? droppedOption.label
              : 'Drag the correct option here..'}
          </Text>
        </View>

        {/* Options */}
        <View className="gap-6 z-30">
          {OPTIONS.map((option) => (
            <DraggableOption
              key={option.id}
              option={option}
              droppedOption={droppedOption}
              onDrop={(opt) => setDroppedOption(opt)}
            />
          ))}
        </View>
           <Image
          source={IMAGES.Scenario_Corner_3}
          alt="corner3"
          className="absolute top-0 right-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
        />
        <Image
          source={IMAGES.Scenario_Corner_1}
          alt="corner1"
          className="absolute bottom-0 left-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
        />
        <Image
          source={IMAGES.Scenario_Corner_2}
          alt="corner2"
          className="absolute top-0 left-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
        />
        <Image
          source={IMAGES.Scenario_Corner_4}
          alt="corner4"
          className="absolute bottom-0 right-0  w-[55px] h-[55px] rounded-[20px]  z-[10] "
        />
        
      </View>
    </GestureHandlerRootView>
  );
}

function DraggableOption({
  option,
  droppedOption,
  onDrop,
}: {
  option: OptionType;
  droppedOption: OptionType | null;
  onDrop: (option: OptionType) => void;
}) {
  const translateY = useSharedValue(0);

  const isDropped = droppedOption?.id === option.id;

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      // If dragged upward enough → consider dropped
      if (e.translationY < -120) {
        runOnJS(onDrop)(option);
      }

      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={animatedStyle}
        className={`p-5 py-8 rounded-2xl  border border-b-2 border-b-[#88CA8A] border-[#F1F9F1] bg-[#F1F9F1] ${
          isDropped ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <Text className=" text-center font-sans text-dark">{option.label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}
