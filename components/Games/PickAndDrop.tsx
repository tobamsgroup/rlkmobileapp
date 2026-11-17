import React, { useMemo, useState } from 'react';
import { Image, ImageBackground, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import {
  MissionImage,
  PickDropCategory,
  PickDropItem,
  PickDropMission,
} from '@/types/mission';
import { shuffleArray } from '@/utils';
import CongratulationsPopup from './CongratulationsPopup';
import {
  Draggable,
  FeedbackBanner,
  toImageSource,
  useDropTargets,
  useMissionFeedback,
} from './shared';
import { Mascot } from './ui';

const ITEM_SIZE = 90;

// Tray layout: two columns of equal cards that shrink to fit the play area
const COLUMNS = 2;
const CARD_GAP = 8;
const CARD_MAX_HEIGHT = 76;
const CARD_MIN_HEIGHT = 50;

// Left accent strip of each card, repeated
const ACCENTS = ['#D5B300', '#E86A92', '#4A90E2', '#9B6BDF', '#F28C28', '#3F9243'];

// Drop zones, one theme per category, repeated
const ZONES = [
  { bg: '#EAF6EA', active: '#CFEBD0', border: '#3F9243', text: '#265828' },
  { bg: '#E6F0FB', active: '#C9DDF5', border: '#4A90E2', text: '#1D4F8C' },
  { bg: '#FFF6DA', active: '#FBE7A6', border: '#D5B300', text: '#806C00' },
  { bg: '#F4ECFB', active: '#E2D2F5', border: '#9B6BDF', text: '#5B3A8C' },
];

type Placement = { top: number; left: number; float: number };
type Size = { width: number; height: number };

/**
 * Model 1: Pick & Drop. Children drag each item into the matching
 * container; a wrong container bounces the item back with feedback.
 */
const PickAndDrop = ({
  mission,
  onNext,
}: {
  mission: PickDropMission;
  onNext: () => void;
}) => {
  const { register, measure, rects } = useDropTargets();
  const { feedback, report } = useMissionFeedback(mission);
  const [sorted, setSorted] = useState<Record<string, string>>({});
  const [hovered, setHovered] = useState<string | null>(null);

  const items = useMemo(() => shuffleArray([...mission.items]), [mission]);

  const handleDrop = (itemId: string, categoryId: string | null) => {
    if (!categoryId) return;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const correct = item.categoryId === categoryId;
    report(correct, item.feedback);
    if (correct) setSorted((prev) => ({ ...prev, [itemId]: categoryId }));
  };

  const done = items.length > 0 && items.every((item) => sorted[item.id]);

  const scene = {
    mission,
    items,
    sorted,
    hovered,
    feedback,
    drag: {
      targets: rects,
      onDragStart: measure,
      onHover: setHovered,
      onDrop: handleDrop,
    },
    register,
  };

  return (
    <View className="flex-1 rounded-[20px] overflow-hidden">
      {mission.layout === 'scatter' ? (
        <ScatterScene {...scene} />
      ) : (
        <TrayScene {...scene} />
      )}

      {done && (
        <CongratulationsPopup
          title={mission.reward?.title || 'Great Job!'}
          message={mission.reward?.message}
          onNext={onNext}
        />
      )}
    </View>
  );
};

type SceneProps = {
  mission: PickDropMission;
  items: PickDropItem[];
  sorted: Record<string, string>;
  hovered: string | null;
  feedback: ReturnType<typeof useMissionFeedback>['feedback'];
  drag: {
    targets: ReturnType<typeof useDropTargets>['rects'];
    onDragStart: () => void;
    onHover: (id: string | null) => void;
    onDrop: (id: string, targetId: string | null) => void;
  };
  register: ReturnType<typeof useDropTargets>['register'];
};

const countIn = (sorted: Record<string, string>, categoryId: string) =>
  Object.values(sorted).filter((c) => c === categoryId).length;

/* Tray: a header card, a grid of equal item cards and drop zones below */

const TrayScene = ({
  mission,
  items,
  sorted,
  hovered,
  feedback,
  drag,
  register,
}: SceneProps) => {
  const [grid, setGrid] = useState<Size | null>(null);
  // The story card keeps its height when feedback replaces the text
  const [storyHeight, setStoryHeight] = useState<number>();

  const rows = Math.ceil(items.length / COLUMNS);
  const card = grid && {
    width: (grid.width - CARD_GAP * (COLUMNS - 1)) / COLUMNS,
    height: Math.max(
      CARD_MIN_HEIGHT,
      Math.min(CARD_MAX_HEIGHT, (grid.height - CARD_GAP * (rows - 1)) / rows),
    ),
  };
  const sortedCount = Object.keys(sorted).length;

  return (
    <View className="flex-1 bg-primary">
      <View className="absolute -top-16 -right-12 w-56 h-56 rounded-full bg-white/5" />
      <View className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-[#265828]/60" />

      {/* Title with the guide character */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        className="flex-row items-end px-3 pt-3"
      >
        {mission.mascot && (
          <Mascot image={mission.mascot} size={62} className="-mb-3 z-10" />
        )}
        <View className="flex-1 bg-[#1F4A21] rounded-t-[16px] rounded-br-[16px] px-4 py-2.5 border-b-2 border-[#163817]">
          <Text
            numberOfLines={2}
            className="text-white font-sansSemiBold text-[19px] text-center"
          >
            {mission.title}
          </Text>
        </View>
      </Animated.View>

      {/* Story card; feedback takes its place so nothing below jumps */}
      <View className="mx-3 mt-1">
        <View
          onLayout={(e) => {
            const { height } = e.nativeEvent.layout;
            setStoryHeight((prev) => prev ?? height);
          }}
          style={{ minHeight: storyHeight }}
          className={twMerge(
            'rounded-[16px] border-2 px-4 pt-2.5 pb-4 justify-center',
            !feedback && 'bg-[#FFF8E1] border-[#F2C94C]',
            feedback?.correct && 'bg-[#E6F4EB] border-[#3F9243]',
            feedback && !feedback.correct && 'bg-[#FBF1EA] border-[#E39A5C]',
          )}
        >
          <Animated.Text
            key={feedback?.text ?? 'story'}
            entering={FadeIn.duration(250)}
            className={twMerge(
              'font-sansMedium text-[12.5px] leading-[18px] text-center',
              !feedback && 'text-dark',
              feedback?.correct && 'text-[#265828]',
              feedback && !feedback.correct && 'text-[#A85A1C]',
            )}
          >
            {feedback?.text ?? mission.introduction}
          </Animated.Text>
        </View>

        <View className="absolute -bottom-3 left-0 right-0 items-center">
          <View className="flex-row items-center gap-1.5 bg-[#E6F0FB] border border-[#BFD7F2] rounded-full px-3 py-1">
            <Text className="text-[12px]">🧩</Text>
            <Text className="text-[#1D4F8C] font-sansSemiBold text-[12px]">
              {mission.counterLabel || 'Sorted'}: {sortedCount} / {items.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Items sit above the drop zones so a dragged card stays on top */}
      <View
        style={{ zIndex: 10 }}
        className="flex-1 mx-3 mt-6 mb-3"
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setGrid({ width, height });
        }}
      >
        {card && (
          <View
            className="flex-row flex-wrap"
            style={{ columnGap: CARD_GAP, rowGap: CARD_GAP }}
          >
            {items.map((item, i) => {
              const categoryId = sorted[item.id];
              if (categoryId) {
                const zone =
                  ZONES[
                    mission.categories.findIndex((c) => c.id === categoryId) %
                      ZONES.length
                  ];
                return <SortedSlot key={item.id} size={card} color={zone.border} />;
              }
              return (
                <Draggable
                  key={item.id}
                  id={item.id}
                  {...drag}
                  style={{ width: card.width, height: card.height }}
                >
                  <ItemTile
                    item={item}
                    accent={ACCENTS[i % ACCENTS.length]}
                    compact={card.height < 64}
                  />
                </Draggable>
              );
            })}
          </View>
        )}
      </View>

      <View className="flex-row gap-3 px-3 pb-3">
        {mission.categories.map((category, i) => (
          <View key={category.id} ref={register(category.id)} className="flex-1">
            <DropZone
              category={category}
              theme={ZONES[i % ZONES.length]}
              active={hovered === category.id}
              count={countIn(sorted, category.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const ItemTile = ({
  item,
  accent,
  compact,
}: {
  item: PickDropItem;
  accent: string;
  compact: boolean;
}) => (
  <View
    style={{ borderLeftColor: accent }}
    className="flex-1 flex-row items-center bg-white rounded-[14px] border-l-[5px] border-b-[3px] border-b-[#D9E8DA] pl-2 pr-2.5 gap-2"
  >
    <Icon
      image={item.image}
      icon={item.icon}
      size={compact ? 32 : 40}
      tint={`${accent}22`}
    />
    <Text
      numberOfLines={3}
      adjustsFontSizeToFit
      minimumFontScale={0.85}
      className="flex-1 text-dark font-sansMedium text-[12.5px] leading-[16px]"
    >
      {item.label}
    </Text>
  </View>
);

const SortedSlot = ({ size, color }: { size: Size; color: string }) => (
  <Animated.View
    entering={ZoomIn.springify().damping(14)}
    style={{ width: size.width, height: size.height, borderColor: color }}
    className="rounded-[14px] border-2 border-dashed bg-white/10 items-center justify-center"
  >
    <View
      style={{ backgroundColor: color }}
      className="w-7 h-7 rounded-full items-center justify-center"
    >
      <Text className="text-white font-sansSemiBold text-[14px]">✓</Text>
    </View>
  </Animated.View>
);

const DropZone = ({
  category,
  theme,
  active,
  count,
}: {
  category: PickDropCategory;
  theme: (typeof ZONES)[number];
  active: boolean;
  count: number;
}) => (
  <View
    style={{
      backgroundColor: active ? theme.active : theme.bg,
      borderColor: theme.border,
      transform: [{ scale: active ? 1.04 : 1 }],
    }}
    className={twMerge(
      'h-[84px] rounded-[18px] border-2 flex-row items-center px-2.5 gap-2',
      !active && 'border-dashed',
    )}
  >
    <Icon
      image={active && category.activeImage ? category.activeImage : category.image}
      icon={category.icon}
      size={40}
    />
    <View className="flex-1 items-center">
      <Text
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={{ color: theme.text }}
        className="font-sansSemiBold text-[13px] leading-[16px] text-center"
      >
        {category.label}
      </Text>
      <Animated.Text
        key={count}
        entering={ZoomIn.springify().damping(10)}
        style={{ color: theme.text }}
        className="font-sansSemiBold text-[22px]"
      >
        {count}
      </Animated.Text>
    </View>
  </View>
);

/** An item's picture: its image, else its emoji on a soft tile. */
const Icon = ({
  image,
  icon,
  size,
  tint,
}: {
  image?: MissionImage;
  icon?: string;
  size: number;
  tint?: string;
}) => {
  if (image) {
    return (
      <Image
        source={toImageSource(image)}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }
  if (!icon) return null;
  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: tint ?? 'rgba(255,255,255,0.7)',
      }}
      className="rounded-[12px] items-center justify-center"
    >
      <Text style={{ fontSize: size * 0.55 }}>{icon}</Text>
    </View>
  );
};

/* Scatter: items float around a scene and are dropped into bins */

const ScatterScene = ({
  mission,
  items,
  sorted,
  hovered,
  feedback,
  drag,
  register,
}: SceneProps) => {
  const [area, setArea] = useState<Size | null>(null);

  // Random spots inside the play area, fixed once it has been measured
  const placements = useMemo(() => {
    if (!area) return {};
    return Object.fromEntries(
      items.map((item): [string, Placement] => [
        item.id,
        {
          top: Math.random() * Math.max(area.height - ITEM_SIZE, 0),
          left: Math.random() * Math.max(area.width - ITEM_SIZE, 0),
          float: Math.random() * 15 + 10,
        },
      ]),
    );
  }, [area, items]);

  const remaining = items.filter((item) => !sorted[item.id]);
  const binSize = mission.categories.length === 1 ? 200 : 110;

  const content = (
    <>
      <Text className="text-white text-xl font-sansSemiBold mt-8 text-center px-4">
        {mission.title}
      </Text>
      {mission.introduction && (
        <Text className="text-white/90 font-sans text-[13px] text-center mt-2 px-6">
          {mission.introduction}
        </Text>
      )}
      <Text className="text-white font-sansMedium text-center mt-2">
        {mission.counterLabel || 'Sorted'}: {items.length - remaining.length} /{' '}
        {items.length}
      </Text>
      <FeedbackBanner feedback={feedback} />

      {/* Items sit above the containers so a dragged item stays on top */}
      <View
        style={{ zIndex: 10 }}
        className="flex-1 mt-3"
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setArea((prev) => prev ?? { width, height });
        }}
      >
        {area &&
          remaining.map((item) => (
            <Draggable
              key={item.id}
              id={item.id}
              {...drag}
              float={placements[item.id]?.float}
              style={{
                position: 'absolute',
                top: placements[item.id]?.top,
                left: placements[item.id]?.left,
              }}
            >
              <ScatterItem label={item.label} image={item.image} />
            </Draggable>
          ))}
      </View>

      <View className="flex-row justify-center gap-3 px-4 pb-4">
        {mission.categories.map((category) => (
          <View
            key={category.id}
            ref={register(category.id)}
            className={twMerge('items-center', !category.image && 'flex-1')}
          >
            <Bin
              category={category}
              size={binSize}
              active={hovered === category.id}
              count={countIn(sorted, category.id)}
            />
          </View>
        ))}
      </View>
    </>
  );

  return mission.background ? (
    <ImageBackground
      source={toImageSource(mission.background)}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-[#265828]/70" />
      {content}
    </ImageBackground>
  ) : (
    <View className="flex-1 bg-primary">{content}</View>
  );
};

const ScatterItem = ({
  label,
  image,
}: Pick<PickDropItem, 'label' | 'image'>) => {
  if (image && !label) {
    return (
      <Image
        source={toImageSource(image)}
        style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
        resizeMode="contain"
      />
    );
  }

  return (
    <View className="bg-white rounded-[15px] p-3 w-[150px] items-center">
      {image && (
        <Image
          source={toImageSource(image)}
          style={{ width: 60, height: 60 }}
          resizeMode="contain"
        />
      )}
      <Text className="font-sansMedium text-[13px] text-[#221D23] text-center">
        {label}
      </Text>
    </View>
  );
};

const Bin = ({
  category,
  size,
  active,
  count,
}: {
  category: PickDropCategory;
  size: number;
  active: boolean;
  count: number;
}) => {
  if (category.image) {
    return (
      <>
        <Image
          source={toImageSource(
            active && category.activeImage
              ? category.activeImage
              : category.image,
          )}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
        {category.label && (
          <Text className="text-white font-sansSemiBold text-center">
            {category.label}
          </Text>
        )}
      </>
    );
  }

  return (
    <View
      className={twMerge(
        'w-full min-h-[100px] rounded-[15px] border-2 border-dashed border-white/70 bg-white/10 items-center justify-center p-3',
        active && 'border-solid border-[#D5B300] bg-white/25',
      )}
    >
      <Text className="text-white font-sansSemiBold text-[15px] text-center">
        {category.label}
      </Text>
      <Text className="text-white/80 font-sansMedium mt-1">{count}</Text>
    </View>
  );
};

export default PickAndDrop;
