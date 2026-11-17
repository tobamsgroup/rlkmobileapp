import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageSourcePropType,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { useSound } from '@/context/SoundContext';
import { Mission, MissionFeedback, MissionImage } from '@/types/mission';
import { HAPTIC } from '@/utils/haptic';

// Backend images are URLs; dummy configs use bundled require() images
export const toImageSource = (image: MissionImage): ImageSourcePropType =>
  typeof image === 'string' ? { uri: image } : image;

export type DropRect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const hitTest = (rects: DropRect[], x: number, y: number) => {
  'worklet';
  for (const r of rects) {
    if (x >= r.x && x <= r.x + r.width && y >= r.y && y <= r.y + r.height) {
      return r.id;
    }
  }
  return null;
};

/**
 * Drop targets measured in window coordinates when a drag starts, so hit
 * testing still works after the screen or a target list has scrolled.
 */
export const useDropTargets = () => {
  const refs = useRef<Record<string, View | null>>({});
  const rects = useSharedValue<DropRect[]>([]);

  const register = useCallback(
    (id: string) => (ref: View | null) => {
      refs.current[id] = ref;
    },
    [],
  );

  const measure = useCallback(() => {
    Promise.all(
      Object.entries(refs.current).map(
        ([id, ref]) =>
          new Promise<DropRect | null>((resolve) => {
            if (!ref) return resolve(null);
            ref.measureInWindow((x, y, width, height) =>
              resolve({ id, x, y, width, height }),
            );
          }),
      ),
    ).then((list) => {
      rects.value = list.filter((r): r is DropRect => !!r);
    });
  }, [rects]);

  return { register, measure, rects };
};

const noop = () => {};

type DraggableProps = {
  id: string;
  targets: SharedValue<DropRect[]>;
  onDragStart: () => void;
  onDrop: (id: string, targetId: string | null) => void;
  onHover?: (targetId: string | null) => void;
  // Idle bobbing height in px
  float?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
  children: React.ReactNode;
};

export const Draggable = ({
  id,
  targets,
  onDragStart,
  onDrop,
  onHover = noop,
  float,
  style,
  className,
  children,
}: DraggableProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const floatY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const hovered = useSharedValue<string | null>(null);

  useEffect(() => {
    if (!float) return;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-float, { duration: 1500 }),
        withTiming(0, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, [float, floatY]);

  const animatedStyle = useAnimatedStyle(() => ({
    zIndex: dragging.value ? 100 : 1,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value + floatY.value },
      // Lift the item while it's held
      { scale: withSpring(dragging.value ? 1.06 : 1) },
    ],
  }));

  const pan = Gesture.Pan()
    .onStart(() => {
      dragging.value = true;
      runOnJS(onDragStart)();
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
      const hit = hitTest(targets.value, e.absoluteX, e.absoluteY);
      if (hit !== hovered.value) {
        hovered.value = hit;
        runOnJS(onHover)(hit);
      }
    })
    .onEnd((e) => {
      runOnJS(onDrop)(id, hitTest(targets.value, e.absoluteX, e.absoluteY));
    })
    .onFinalize(() => {
      dragging.value = false;
      if (hovered.value !== null) {
        hovered.value = null;
        runOnJS(onHover)(null);
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[style, animatedStyle]} className={className}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

type FeedbackState = { correct: boolean; text: string } | null;

/** Sound, haptics and feedback text for each attempt. */
export const useMissionFeedback = (mission: Mission) => {
  const { play } = useSound();
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const report = (correct: boolean, itemFeedback?: MissionFeedback) => {
    const text = correct
      ? itemFeedback?.correct ?? mission.feedback?.correct
      : itemFeedback?.incorrect ?? mission.feedback?.incorrect;
    setFeedback(text ? { correct, text } : null);

    if (correct) {
      play(mission.correctSound ?? 'correct');
      HAPTIC.success();
    } else {
      play('wrong');
      HAPTIC.error();
    }
  };

  return { feedback, report };
};

export const FeedbackBanner = ({ feedback }: { feedback: FeedbackState }) => {
  if (!feedback) return null;
  return (
    <View
      className={twMerge(
        'mx-4 mt-3 px-4 py-2.5 rounded-[12px]',
        feedback.correct ? 'bg-[#E6F4EB]' : 'bg-[#FBF1EA]',
      )}
    >
      <Text
        className={twMerge(
          'font-sansMedium text-[14px] text-center',
          feedback.correct ? 'text-[#265828]' : 'text-[#C8702A]',
        )}
      >
        {feedback.text}
      </Text>
    </View>
  );
};
