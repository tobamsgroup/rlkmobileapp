import React, { useRef, useState } from "react";
import { View, Text, findNodeHandle, UIManager } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Letter = {
  id: string;
  value: string;
  placedSlotId: number | null;
};

type Slot = {
  id: number;
  layout: { x: number; y: number; width: number; height: number };
  letterId: string | null;
};

const WORD = ["L", "D", "E", "R", "E", "A", "S", "P", "H", "I"];

export default function UnscrambleGame() {
  const [letters, setLetters] = useState<Letter[]>(
    WORD.map((l, i) => ({
      id: String(i),
      value: l,
      placedSlotId: null,
    }))
  );

  const [slots, setSlots] = useState<Slot[]>(
    Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      layout: { x: 0, y: 0, width: 0, height: 0 },
      letterId: null,
    }))
  );

  const slotRefs = useRef<View[]>([]);

  /** Measure slot in screen coordinates */
  const measureSlot = (index: number) => {
    const ref = slotRefs.current[index];
    if (!ref) return;

    const handle = findNodeHandle(ref);
    if (!handle) return;

    UIManager.measureInWindow(
      handle,
      (x: number, y: number, width: number, height: number) => {
        setSlots((prev) =>
          prev.map((s) =>
            s.id === index ? { ...s, layout: { x, y, width, height } } : s
          )
        );
      }
    );
  };

  /** Place or remove letter with swap support */
  const handleDrop = (letterId: string, absX: number, absY: number) => {
    let targetSlot: Slot | null = null;

    for (const slot of slots) {
      const { x, y, width, height } = slot.layout;
      if (absX > x && absX < x + width && absY > y && absY < y + height) {
        targetSlot = slot;
        break;
      }
    }

    setLetters((prevLetters) => {
      const draggedLetter = prevLetters.find((l) => l.id === letterId);
      if (!draggedLetter) return prevLetters;

      let newLetters = [...prevLetters];

      if (targetSlot) {
        const existingLetterId = targetSlot.letterId;

        if (existingLetterId) {
          // Swap letters
          newLetters = newLetters.map((l) => {
            if (l.id === existingLetterId)
              return { ...l, placedSlotId: draggedLetter.placedSlotId };
            if (l.id === letterId) return { ...l, placedSlotId: targetSlot.id };
            return l;
          });
        } else {
          // Move dragged letter to empty slot
          newLetters = newLetters.map((l) =>
            l.id === letterId ? { ...l, placedSlotId: targetSlot.id } : l
          );
        }
      } else {
        // Dropped outside, return to tray
        newLetters = newLetters.map((l) =>
          l.id === letterId ? { ...l, placedSlotId: null } : l
        );
      }

      return newLetters;
    });

    // Update slots
    setSlots((prevSlots) => {
      return prevSlots.map((s) => {
        if (s.letterId === letterId) return { ...s, letterId: null };

        if (targetSlot && s.id === targetSlot.id) return { ...s, letterId };

        // If swapping, update previous slot of existing letter
        if (targetSlot) {
          const draggedLetter = letters.find((l) => l.id === letterId);
          if (draggedLetter?.placedSlotId === s.id) {
            return { ...s, letterId: targetSlot.letterId };
          }
        }

        return s;
      });
    });
  };

  return (
    <View className="flex-1 bg-[#A6D7A8] rounded-[20px]">
      <View className="bg-white p-4 py-6 mb-4 rounded-tr-[20px] rounded-tl-[20px]">
        <Text className="text-[18px]  font-sansMedium text-dark text-center">
          Unscramble the word below
        </Text>
      </View>

      <View className="p-6">


      {/* LETTER TRAY */}
      <View className="flex-row flex-wrap justify-center mb-6">
        {letters.map((letter) => (
          <DraggableLetter
            key={letter.id}
            letter={letter}
            onDrop={handleDrop}
          />
        ))}
      </View>

      {/* DROP ZONE */}
      <View className="bg-white rounded-[16px] p-6 border-2 border-[#88CA8A]">
        <View className="flex-row flex-wrap justify-center">
          {slots.map((slot, i) => {
            const letter = letters.find((l) => l.id === slot.letterId);

            return (
              <View
                key={slot.id}
                ref={(ref) => {
                  if (ref) {
                    slotRefs.current[i] = ref;
                    setTimeout(() => measureSlot(i), 50);
                  }
                }}
                className="w-16 h-16 m-2 rounded-2xl border-2 border-dashed border-[#88CA8A] bg-[#DBEFDC1A] items-center justify-center"
              >
                {letter && (
                  <Text className="text-xl font-bold">{letter.value}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
      </View>

    </View>
  );
}

/* ---------------- DRAGGABLE LETTER ---------------- */

type DragProps = {
  letter: Letter;
  onDrop: (id: string, x: number, y: number) => void;
};

const DraggableLetter: React.FC<DragProps> = ({ letter, onDrop }) => {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const dragging = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      dragging.value = true;
    })
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      dragging.value = false;
      runOnJS(onDrop)(letter.id, e.absoluteX, e.absoluteY);
      tx.value = withSpring(0);
      ty.value = withSpring(0);
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
    zIndex: dragging.value ? 999 : 1,
  }));

  const isPlaced = letter.placedSlotId !== null;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={style}
        className={`w-16 h-16 m-2 rounded-2xl items-center justify-center shadow
          ${isPlaced ? "bg-gray-300" : "bg-white"}`}
      >
        <Text
          className={`text-xl font-bold ${
            isPlaced ? "text-gray-400" : "text-gray-800"
          }`}
        >
          {letter.value}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};