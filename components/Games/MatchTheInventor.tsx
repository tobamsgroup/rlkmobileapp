'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { findNodeHandle, LayoutRectangle, Image as RNImage, Text, UIManager, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { useSound } from '@/context/SoundContext';
import { shuffleArray } from '@/utils';
import { ScrollView } from 'react-native';
import CongratulationsPopup from './CongratulationsPopup';

const INVERNTORS = [
  {
    name: 'Elon Musk',
    inventorImage: require('../../assets/images/elonmusk.jpg'),
    invention: 'Cyber Truck',
    inventionImage: require('../../assets/images/cybertruck.avif'),
  },
  {
    name: 'Thomas Edison',
    inventorImage: require('../../assets/images/Edison.jpg'),
    invention: 'Light Bulb',
    inventionImage: require('../../assets/images/lightbulb.webp'),
  },
  {
    name: 'Mark Zuckerberg',
    inventorImage: require('../../assets/images/zuckerberg.jpg'),
    invention: 'Facebook',
    inventionImage: require('../../assets/images/facebook.png'),
  },
  {
    name: 'Markus Persson',
    inventorImage: require('../../assets/images/Notch.webp'),
    invention: 'Minecraft',
    inventionImage: require('../../assets/images/minecraft.png'),
  },
  {
    name: 'Wright Brothers',
    inventorImage: require('../../assets/images/Wright.jpeg'),
    invention: 'Airplane',
    inventionImage: require('../../assets/images/airplane.jpg'),
  },
];

interface DropZoneInfo {
  name: string;
  ref: View;
}

interface Lesson3TEProps {
  onNext: () => void;
}

const Lesson3TE: React.FC<Lesson3TEProps> = ({ onNext }) => {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [dropZones, setDropZones] = useState<DropZoneInfo[]>([]);
  const { play} = useSound();

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (Object.keys(matches).length === INVERNTORS.length) {
      play("cheers");
    }
  }, [matches]);

  const { inventors, inventions } = useMemo(() => {
    const inventors = shuffleArray(INVERNTORS);
    const inventions = shuffleArray(INVERNTORS.map((i) => ({ ...i })));
    return { inventors, inventions };
  }, []);

  // Called when draggable is released
  const handleDrop = (draggedItem: string, absoluteX: number, absoluteY: number) => {
    dropZones.forEach((zone) => {
      const node = findNodeHandle(zone.ref);
      if (!node) return;

      UIManager.measure(node, (x, y, width, height, pageX, pageY) => {
        if (
          absoluteX >= pageX &&
          absoluteX <= pageX + width &&
          absoluteY >= pageY &&
          absoluteY <= pageY + height
        ) {
          const expectedInvention = inventors.find((i) => i.name === zone.name)?.invention;
          if (expectedInvention === draggedItem) {
            setMatches((prev) => ({ ...prev, [zone.name]: draggedItem }));
            play("correct");
          } else {
            play("wrong");
          }
        }
      });
    });
  };

  return (
    <View className="p-6 flex-1 items-center bg-primary rounded-[20px] relative">
      {Object.keys(matches).length === INVERNTORS.length && (
        <CongratulationsPopup nextLesson="687dfb11f7aab891a588ad1e" className='top' onNext={onNext} />
     )}

      <Text className="text-[24px] text-white font-sansSemiBold">Match the Inventor</Text>

      <View className="w-full mt-6 flex-1">
        {/* Scrollable Drop Zones */}
        <ScrollView
          horizontal
          ref={scrollRef}
          scrollEventThrottle={16}
          contentContainerClassName="gap-4"
        >
          {inventors.map((i) => (
            <DropZone
              key={i.name}
              inventor={i.name}
              image={i.inventorImage}
              matchedInvention={matches[i.name]}
              onRef={(ref) => {
                if (!ref) return;
                setDropZones((prev) => [...prev.filter((d) => d.name !== i.name), { name: i.name, ref }]);
              }}
            />
          ))}
        </ScrollView>
        <View className='border border-gray-300 mt-6'/>

        {/* Draggable Items */}
        <View className="flex-row flex-wrap justify-center gap-2 mt-4">
          {inventions
            .filter((i) => !Object.values(matches).includes(i.invention))
            .map((i) => (
              <DraggableItem
                key={i.invention}
                name={i.invention}
                image={i.inventionImage}
                onDrop={handleDrop}
              />
            ))}
        </View>
      </View>
    </View>
  );
};

// DropZone Component
interface DropZoneProps {
  inventor: string;
  image: any;
  matchedInvention?: string;
  onRef: (ref: View | null) => void;
}

const DropZone = React.forwardRef<View, DropZoneProps>(({ inventor, image, matchedInvention, onRef }, ref) => {
  const viewRef = useRef<View>(null);

  useEffect(() => {
    onRef(viewRef.current);
  }, [viewRef.current]);

  return (
    <View
      ref={viewRef}
      className={twMerge(
        "bg-white p-2 rounded-[15px] w-[140px] h-[180px] items-center border-2",
        matchedInvention ? "border-green-500" : "border-transparent"
      )}
    >
      <RNImage
        source={image}
        className="w-full h-[120px] object-contain"
        resizeMode="contain"
      />
      <Text className="font-sansMedium mt-2">{inventor}</Text>
      {matchedInvention && <Text className="text-sm mt-2">✅ Correct!</Text>}
    </View>
  );
});

/* =========================
   DRAGGABLE ITEM
========================= */
interface DraggableItemProps {
  name: string;
  image: any;
  onDrop: (name: string, x: number, y: number) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ name, image, onDrop }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      // Call onDrop with absolute screen coordinates
      runOnJS(onDrop)(name, e.absoluteX, e.absoluteY);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={animatedStyle}
        className="bg-white p-2 rounded-[15px] w-28 h-36 items-center justify-center m-1"
      >
        <RNImage
          source={image}
          className="w-full h-full object-contain"
          resizeMode="contain"
        />
        <Text className="font-medium hidden">{name}</Text>
      </Animated.View>
    </GestureDetector>
  );
};



export default Lesson3TE;