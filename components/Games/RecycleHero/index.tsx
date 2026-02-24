import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, ImageBackground, Text, View } from 'react-native';

// import CongratulationsPopup from "@/components/Congratulations";
import { useSound } from '@/context/SoundContext';
import { SCREEN_HEIGHT } from '@/utils/scale';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import CongratulationsPopup from '../CongratulationsPopup';
import { HAPTIC } from '@/utils/haptic';
// import CongratulationsPopup from "@/components/Congratulations";

const bin = require('../../../assets/images/bin.png');
const bin_opened = require('../../../assets/images/bin_opened.png');
const trash1 = require('../../../assets/images/trash1.png');
const trash2 = require('../../../assets/images/trash2.webp');
const trash3 = require('../../../assets/images/trash3.png');
const trash4 = require('../../../assets/images/trash4.png');
const trash5 = require('../../../assets/images/trash5.png');
const trash6 = require('../../../assets/images/trash6.png');
const trash7 = require('../../../assets/images/trash7.png');
const trash8 = require('../../../assets/images/trash8.png');
const trash9 = require('../../../assets/images/trash9.png');
const trash10 = require('../../../assets/images/trash10.png');

const rlplant = require('../../../assets/images/rlplant.jpg');

const { width, height } = Dimensions.get('window');

const IMAGES = [
  trash1,
  trash2,
  trash3,
  trash4,
  trash5,
  trash6,
  trash7,
  trash8,
  trash9,
  trash10,
];

const generateRandomPlacement = () =>
  IMAGES.map((image, i) => {
    const top = Math.random() * (height * 0.5);
    const left = Math.random() * (width * 0.8);

    return {
      id: i,
      image,
      top,
      left,
      float: Math.random() * 15 + 10,
    };
  });

/* ------------------------------------------------ */
/* DRAGGABLE ITEM */
/* ------------------------------------------------ */

function DraggableItem({ item, binLayout, onDrop, setBinOpen }:{item: any;
  binLayout: any;
  onDrop: (id: number) => void;
  setBinOpen: (v: boolean) => void;}) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const floatY = useSharedValue(0);
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-item.float, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  // Animate floating + dragging
  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: item.top,
    left: item.left,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value + floatY.value },
    ],
  }));

  // Reaction to toggle binOpen safely
  useAnimatedReaction(
    () => {
      if (!binLayout) return false;
      return (
        isDragging.value &&
        dragX.value > binLayout.x &&
        dragX.value < binLayout.x + binLayout.width &&
        dragY.value > binLayout.y &&
        dragY.value < binLayout.y + binLayout.height
      );
    },
    (hovering) => {
      runOnJS(setBinOpen)(hovering);
    },
    [binLayout]
  );

  const pan = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      dragX.value = item.left + e.translationX;
      dragY.value = item.top + e.translationY;
    })
    .onEnd(() => {
      isDragging.value = false;

      if (
        binLayout &&
        dragX.value > binLayout.x &&
        dragX.value < binLayout.x + binLayout.width &&
        dragY.value > binLayout.y &&
        dragY.value < binLayout.y + binLayout.height
      ) {
        runOnJS(onDrop)(item.id);
      }

      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle}>
        <Image
          source={item.image}
          style={{ width: 90, height: 90 }}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}


const Lesson3C = ({ onNext }: { onNext: () => void }) => {
  const initialItems = useMemo(() => generateRandomPlacement(), []);
  const [items] = useState(initialItems);
  const [droppedItems, setDroppedItems] = useState<number[]>([]);
  const [binLayout, setBinLayout] = useState<any>(null);
  const [binOpen, setBinOpen] = useState(false);

  const { play } = useSound();

  const handleDrop = (id: number) => {
    if (!droppedItems.includes(id)) {
      setDroppedItems((prev) => [...prev, id]);
      play('trashDrop');
      HAPTIC.success()
    }
  };

  

  return (
    <View className="flex-1 rounded-[20px]">
      <ImageBackground
        source={rlplant}
        className="flex-1 rounded-[20px]"
        resizeMode="cover"
        style={{
          height: SCREEN_HEIGHT * 0.7,
          borderRadius:20
        }}
      >
        <View className="absolute inset-0 bg-[#265828]/70" />

        <Text className="text-white text-xl font-sansSemiBold mt-12 text-center">
          Recycle Hero
        </Text>

        <Text className="text-white font-sansMedium text-center mt-2">
          Trash Collected: {droppedItems.length} / 10
        </Text>
         {/* BIN */}
        <View
          onLayout={(e) => {
            const layout = e.nativeEvent.layout;
            setBinLayout(layout);
          }}
          className="absolute bottom-0 self-center"
        >
          <Image
            source={binOpen ? bin_opened : bin}
            style={{ width: 220, height: 220 }}
            resizeMode="contain"
          />
        </View>

        {binLayout &&
          items
            .filter((item) => !droppedItems.includes(item.id))
            .map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                binLayout={binLayout}
                onDrop={handleDrop}
                setBinOpen={setBinOpen}
              />
            ))}

       

        {droppedItems.length === 10 && (
          <CongratulationsPopup
            title="Great Job!"
            nextLesson="687dde4757f4737df41487fd"
            onNext={onNext}
          />
        )}
      </ImageBackground>
    </View>
  );
};

export default Lesson3C;
