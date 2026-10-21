import { getAllKids } from '@/actions/curriculum';
import { IMAGES } from '@/assets/images';
import Skeleton from '@/components/Skeleton';
import {
  ActivityEvent,
  ActivityEventType,
  ExerciseStatus,
  LearnerBookCard,
  SuggestedBook,
} from '@/types/learnerProgress';
import { ensureHttps, timeAgo } from '@/utils';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import React, { ReactNode, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

// ─── Helpers ────────────────────────────────────────────────────────────────

export const formatHours = (seconds = 0) => {
  const hours = seconds / 3600;
  if (hours >= 1) return `${Number(hours.toFixed(1))} hrs`;
  return `${Math.round(seconds / 60)} mins`;
};

export const formatDuration = (seconds = 0) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h) return `${h}hr ${m}m`;
  return `${m}m`;
};

export const firstName = (name?: string) => name?.split(' ')?.[0] ?? '';

// ─── Avatar & kid switcher ──────────────────────────────────────────────────

export const KidAvatar = ({
  picture,
  name,
  size,
}: {
  picture?: string;
  name?: string;
  size: number;
}) => {
  if (picture) {
    return (
      <Image
        source={{ uri: ensureHttps(picture) }}
        style={{ width: size, height: size }}
        className="rounded-full border border-[#D5B300]"
      />
    );
  }
  if (!name) {
    return (
      <Image
        source={IMAGES.KidProfilePlaceholder}
        style={{ width: size, height: size }}
        className="rounded-full border border-[#D5B300]"
      />
    );
  }
  return (
    <View
      style={{ width: size, height: size }}
      className="bg-[#D3D2D366] rounded-full items-center justify-center border border-[#D5B300]"
    >
      <Text
        style={{ fontSize: size / 2.6 }}
        className="font-sansSemiBold text-dark"
      >
        {name
          .split(' ')
          .slice(0, 2)
          .map((n) => n[0])
          .join('')}
      </Text>
    </View>
  );
};

type KidOption = { _id: string; name: string; picture?: string };

export const KidSwitcher = ({
  kid,
  loading,
  onSelect,
}: {
  kid?: KidOption;
  loading?: boolean;
  onSelect: (kidId: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { data: allKids } = useQuery({
    queryKey: ['kids'],
    queryFn: async () => await getAllKids(),
  });
  const others = (allKids ?? []).filter((k: any) => k?._id !== kid?._id);

  return (
    <View className="relative z-30">
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        className="bg-[#FAFDFF] border border-[#C3E4C5] rounded-[12px] px-4 py-3 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3 flex-1">
          {loading ? (
            <>
              <Skeleton
                style={{ width: scaleWidth(40), height: scaleWidth(40) }}
                className="rounded-full"
              />
              <Skeleton className="w-1/2 rounded-full" />
            </>
          ) : (
            <>
              <KidAvatar
                picture={kid?.picture}
                name={kid?.name}
                size={scaleWidth(40)}
              />
              <Text className="text-[16px] font-sansMedium text-dark">
                {kid?.name}
              </Text>
            </>
          )}
        </View>
        <Feather
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#221D23"
        />
      </Pressable>
      {open && (
        <View className="p-4 rounded-[20px] shadow-md bg-white absolute top-[70px] w-full z-40">
          {others.length ? (
            others.map((k: any) => (
              <Pressable
                key={k._id}
                onPress={() => {
                  setOpen(false);
                  onSelect(k._id);
                }}
                className="py-3 flex-row items-center gap-3"
              >
                <KidAvatar
                  picture={k.picture}
                  name={k.name}
                  size={scaleWidth(36)}
                />
                <Text className="text-[16px] font-sansMedium text-dark">
                  {k.name}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text className="text-[#474348] font-sans text-[14px] py-2">
              No other learners
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// ─── Cards ──────────────────────────────────────────────────────────────────

export const SectionCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <View
    className={twMerge(
      'bg-white rounded-[24px] border border-[#C3E4C5] p-5 mt-5',
      className,
    )}
  >
    {children}
  </View>
);

export const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <View className="mb-5">
    <Text className="text-[20px] font-sansSemiBold text-dark">{title}</Text>
    {!!subtitle && (
      <Text className="text-[16px] font-sans text-[#474348] mt-2 leading-[1.5]">
        {subtitle}
      </Text>
    )}
  </View>
);

export const StatCard = ({
  icon,
  iconBg,
  label,
  value,
  suffix,
  loading,
}: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: ReactNode;
  suffix?: string;
  loading?: boolean;
}) => (
  <View className="border border-[#EDEDED] rounded-[16px] p-5 mb-4 flex-row items-center gap-5 bg-white">
    <View
      style={{ backgroundColor: iconBg }}
      className="w-14 h-14 rounded-full items-center justify-center"
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-[14px] font-sans text-[#474348] mb-3">
        {label}
      </Text>
      {loading ? (
        <Skeleton className="w-1/3 rounded-full" />
      ) : (
        <Text className="text-[22px] font-sansSemiBold text-dark">
          {value}
          {!!suffix && (
            <Text className="text-[15px] font-sans text-[#474348]">
              {' '}
              {suffix}
            </Text>
          )}
        </Text>
      )}
    </View>
  </View>
);

export const BookProgressBar = ({ percent }: { percent: number }) => (
  <View className="flex-row items-center gap-4">
    <View className="flex-1 h-2 rounded-full bg-[#EDEDED] overflow-hidden">
      <View
        style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
        className="h-2 rounded-full bg-[#4CAF50]"
      />
    </View>
    <Text className="text-[14px] font-sansMedium text-dark">{percent}%</Text>
  </View>
);

export const BookCover = ({
  image,
  height,
  width,
  className,
}: {
  image: string | null;
  height: number;
  width?: number;
  className?: string;
}) => (
  <View
    style={{ height, width }}
    className={twMerge(
      'rounded-[16px] overflow-hidden bg-[#EDEDED] items-center justify-center',
      className,
    )}
  >
    {image ? (
      <Image
        source={{ uri: ensureHttps(image) }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    ) : (
      <Feather name="book" size={32} color="#918E91" />
    )}
  </View>
);

const isProgressBook = (
  book: LearnerBookCard | SuggestedBook,
): book is LearnerBookCard => 'progressPercentage' in book;

export const BookCard = ({
  book,
  onPress,
  onAssign,
  className,
}: {
  book: LearnerBookCard | SuggestedBook;
  onPress?: () => void;
  onAssign?: () => void;
  className?: string;
}) => {
  const progress = isProgressBook(book) ? book : null;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={twMerge(
        'border border-[#EDEDED] rounded-[20px] p-4 bg-white',
        className,
      )}
    >
      <BookCover image={book.image} height={scaleHeight(170)} />
      <Text className="text-[18px] font-sansMedium text-dark mt-4">
        {book.category?.title}
      </Text>
      <Text className="text-[16px] font-sans text-[#474348] mt-2 mb-4">
        {book.title}
      </Text>
      {onAssign ? (
        <Pressable
          onPress={onAssign}
          className="bg-[#CCDBEB] border-b-2 border-b-[#7FA6CF] rounded-full py-2.5 items-center"
        >
          <Text className="text-[#004D99] font-sansMedium text-[14px]">
            ASSIGN TO LEARNER
          </Text>
        </Pressable>
      ) : (
        <>
          <BookProgressBar percent={progress?.progressPercentage ?? 0} />
          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-[14px] font-sans text-[#474348]">
              Chapter {progress?.currentChapter?.position ?? 0} of{' '}
              {book.totalChapters}
            </Text>
            <Feather name="chevron-right" size={22} color="#221D23" />
          </View>
        </>
      )}
    </Pressable>
  );
};

export const BookCardSkeleton = () => (
  <View className="border border-[#EDEDED] rounded-[20px] p-4 bg-white">
    <Skeleton
      style={{ height: scaleHeight(170) }}
      className="rounded-[16px] w-full"
    />
    <Skeleton className="w-1/3 rounded-full mt-4" />
    <Skeleton className="w-2/3 rounded-full mt-3" />
    <Skeleton className="w-full h-2 rounded-full mt-4" />
  </View>
);

// Single card at a time with prev / next arrows, as in the design.
export function BookCarousel<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const current = Math.min(index, Math.max(items.length - 1, 0));
  if (!items.length) return null;

  const ArrowButton = ({
    direction,
    disabled,
  }: {
    direction: 'left' | 'right';
    disabled: boolean;
  }) => (
    <Pressable
      disabled={disabled}
      onPress={() =>
        setIndex((i) => (direction === 'left' ? i - 1 : i + 1))
      }
      style={{ opacity: disabled ? 0.4 : 1 }}
      className="w-11 h-11 rounded-full bg-[#F6F6F6] items-center justify-center"
    >
      <Feather name={`chevron-${direction}`} size={20} color="#221D23" />
    </Pressable>
  );

  return (
    <View>
      {renderItem(items[current])}
      {items.length > 1 && (
        <View className="flex-row justify-end gap-4 mt-4">
          <ArrowButton direction="left" disabled={current === 0} />
          <ArrowButton
            direction="right"
            disabled={current === items.length - 1}
          />
        </View>
      )}
    </View>
  );
}

export const EmptyState = ({ text }: { text: string }) => (
  <View className="border border-dashed border-[#D3D2D3] rounded-[16px] p-5 items-center">
    <Text className="text-[#474348] font-sans text-[14px] text-center">
      {text}
    </Text>
  </View>
);

// ─── Section dropdown (Read Progress / Exercises / Activity History) ────────

export type ProgressView = 'read' | 'play' | 'exercises' | 'activity';

const VIEW_ICONS: Record<ProgressView, (color: string) => ReactNode> = {
  read: (c) => <Feather name="book-open" size={20} color={c} />,
  play: (c) => (
    <Ionicons name="game-controller-outline" size={21} color={c} />
  ),
  exercises: (c) => <Feather name="file-text" size={20} color={c} />,
  activity: (c) => <Ionicons name="stats-chart-outline" size={19} color={c} />,
};

export type ProgressViewOption = {
  value: ProgressView;
  label: string;
  // Label shown on the green pill when selected (defaults to `label`)
  selectedLabel?: string;
  locked?: boolean;
};

export const SectionDropdown = ({
  options,
  value,
  onChange,
  showSelectedIcon = true,
}: {
  options: ProgressViewOption[];
  value: ProgressView;
  onChange: (view: ProgressView) => void;
  showSelectedIcon?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <View className="mt-5 z-20">
      <View className="bg-[#FAFDFF] rounded-full p-1.5">
        <Pressable
          onPress={() => setOpen((prev) => !prev)}
          className="bg-[#3F9243] rounded-full px-5 py-3 flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            {showSelectedIcon && VIEW_ICONS[selected.value]('#FFFFFF')}
            <Text className="text-white font-sansMedium text-[16px]">
              {selected.selectedLabel ?? selected.label}
            </Text>
          </View>
          <Feather
            name={open ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
      {open && (
        <View className="bg-white rounded-[16px] shadow-md px-5 py-2 mt-2">
          {options.map((option) => {
            const color = option.locked ? '#918E91' : '#221D23';
            return (
              <Pressable
                key={option.value}
                disabled={option.locked}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="flex-row items-center gap-3 py-3.5"
              >
                {VIEW_ICONS[option.value](color)}
                <Text
                  style={{ color }}
                  className={twMerge(
                    'text-[16px] font-sans',
                    option.value === value && 'font-sansMedium',
                  )}
                >
                  {option.label}
                </Text>
                {option.locked && (
                  <Feather name="lock" size={16} color={color} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

// ─── Activity feed ──────────────────────────────────────────────────────────

const ACTIVITY_STYLE: Record<
  ActivityEventType,
  { bg: string; icon: (color: string) => ReactNode; color: string }
> = {
  quiz: {
    bg: '#E6F4EB',
    color: '#3F9243',
    icon: (c) => (
      <MaterialCommunityIcons
        name="message-question-outline"
        size={18}
        color={c}
      />
    ),
  },
  video_lesson: {
    bg: '#E8F1FB',
    color: '#1671D9',
    icon: (c) => <Feather name="video" size={17} color={c} />,
  },
  game: {
    bg: '#FBF7E5',
    color: '#D5B300',
    icon: (c) => (
      <Ionicons name="extension-puzzle-outline" size={18} color={c} />
    ),
  },
  chapter_completed: {
    bg: '#E8F1FB',
    color: '#1671D9',
    icon: (c) => <Feather name="book-open" size={17} color={c} />,
  },
  book_completed: {
    bg: '#FBF7E5',
    color: '#D5B300',
    icon: (c) => <Ionicons name="trophy-outline" size={18} color={c} />,
  },
  workbook_exercise: {
    bg: '#F6EEF8',
    color: '#C821DE',
    icon: (c) => <Feather name="file-text" size={17} color={c} />,
  },
  lesson_activity: {
    bg: '#E6F4EB',
    color: '#3F9243',
    icon: (c) => <Feather name="activity" size={17} color={c} />,
  },
};

export const ActivityFeed = ({
  title,
  subtitle,
  items,
  loading,
  className,
}: {
  title: string;
  subtitle: string;
  items: ActivityEvent[];
  loading?: boolean;
  className?: string;
}) => (
  <SectionCard className={className}>
    <SectionHeader title={title} subtitle={subtitle} />
    {loading ? (
      [1, 2, 3].map((i) => (
        <View key={i} className="flex-row gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="w-1/2 rounded-full" />
            <Skeleton className="w-1/3 rounded-full" />
          </View>
        </View>
      ))
    ) : items.length ? (
      items.map((item, i) => {
        const style = ACTIVITY_STYLE[item.type] ?? ACTIVITY_STYLE.lesson_activity;
        return (
          <View
            key={`${item.type}-${item.occurredAt}-${i}`}
            className={twMerge('flex-row gap-3', i < items.length - 1 && 'mb-6')}
          >
            <View
              style={{ backgroundColor: style.bg }}
              className="w-10 h-10 rounded-full items-center justify-center"
            >
              {style.icon(style.color)}
            </View>
            <View className="flex-1">
              <Text className="text-[16px] font-sansMedium text-dark leading-[1.4]">
                {item.title}
              </Text>
              <Text className="text-[14px] font-sans text-[#474348] mt-1.5">
                {item.category || item.description}
              </Text>
              <Text className="text-[14px] font-sans text-[#474348] mt-3">
                {timeAgo(item.occurredAt)}
              </Text>
            </View>
          </View>
        );
      })
    ) : (
      <EmptyState text="No learning activity yet." />
    )}
  </SectionCard>
);

// ─── Chapter / exercise status rows ─────────────────────────────────────────

const STATUS_CHIP: Record<
  ExerciseStatus,
  { label: string; bg: string; color: string }
> = {
  completed: { label: 'Completed', bg: '#E6F4EB', color: '#099137' },
  in_progress: { label: 'In Progress', bg: '#E8F1FB', color: '#1671D9' },
  not_started: { label: 'Not Started', bg: '#FBF7E5', color: '#AA8F00' },
  not_assigned: { label: 'Not Assigned', bg: '#F6EEF8', color: '#A33BB3' },
  locked: { label: 'Locked', bg: '#EDEDED', color: '#474348' },
};

export const StatusChip = ({ status }: { status: ExerciseStatus }) => {
  const chip = STATUS_CHIP[status] ?? STATUS_CHIP.not_started;
  return (
    <View
      style={{ backgroundColor: chip.bg }}
      className="self-start rounded-full px-3 py-1.5 flex-row items-center gap-1.5"
    >
      {status === 'locked' && (
        <Feather name="lock" size={13} color={chip.color} />
      )}
      <Text style={{ color: chip.color }} className="text-[13px] font-sans">
        {chip.label}
      </Text>
    </View>
  );
};

export const StatusRows = ({
  rows,
}: {
  rows: { key: string; position: number; title: string; status: ExerciseStatus }[];
}) => (
  <View className="bg-white">
    {rows.map((row, i) => {
      const muted = row.status === 'locked' || row.status === 'not_assigned';
      return (
        <View
          key={row.key}
          className={twMerge(
            'px-4 py-5',
            i < rows.length - 1 && 'border-b border-b-[#EDEDED]',
          )}
        >
          <View className="flex-row items-center gap-3 mb-3">
            <View
              style={{ backgroundColor: muted ? '#F6F6F6' : '#F1F9F1' }}
              className="w-9 h-9 rounded-full items-center justify-center"
            >
              <Text
                style={{ color: muted ? '#474348' : '#3F9243' }}
                className="text-[15px] font-sansMedium"
              >
                {row.position}
              </Text>
            </View>
            <Text
              style={{ color: muted ? '#474348' : '#221D23' }}
              className="flex-1 text-[16px] font-sansMedium leading-[1.4]"
            >
              {row.title}
            </Text>
          </View>
          <StatusChip status={row.status} />
        </View>
      );
    })}
  </View>
);
