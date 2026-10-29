import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { KidSwitcher } from '@/components/LearnerProgress';
import Skeleton from '@/components/Skeleton';
import TopBackButton from '@/components/TopBackButton';
import { LearnerOption } from '@/hooks/useLearningTimeControls';
import { formatTime, TIME_OPTIONS } from '@/utils/learningTime';
import { scaleWidth } from '@/utils/scale';
import Feather from '@expo/vector-icons/Feather';
import * as Haptics from 'expo-haptics';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { ReactNode, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { twMerge } from 'tailwind-merge';

// ─── Control meta (shared by overview cards and detail screens) ────────────

export type ControlKey = 'dailyLimit' | 'breakReminder' | 'schedule' | 'notifications';

export const CONTROL_META: Record<
  ControlKey,
  { title: string; iconBg: string; icon: (size: number) => ReactNode }
> = {
  dailyLimit: {
    title: 'Daily Learning Limit',
    iconBg: '#FBF7E5',
    icon: (size) => <Feather name="clock" size={size} color="#D5B300" />,
  },
  breakReminder: {
    title: 'Break Reminders',
    iconBg: '#E8F1FB',
    icon: (size) => (
      <MaterialCommunityIcons name="coffee" size={size + 2} color="#1671D9" />
    ),
  },
  schedule: {
    title: 'Learning Schedule',
    iconBg: '#F6EAFB',
    icon: (size) => (
      <MaterialCommunityIcons
        name="calendar-month"
        size={size}
        color="#A44CC2"
      />
    ),
  },
  notifications: {
    title: 'Learning Notifications',
    iconBg: '#FAEEE7',
    icon: (size) => (
      <MaterialCommunityIcons name="bell" size={size} color="#C96F2D" />
    ),
  },
};

export const ControlIcon = ({
  control,
  size = 56,
}: {
  control: ControlKey;
  size?: number;
}) => (
  <View
    style={{
      width: scaleWidth(size),
      height: scaleWidth(size),
      backgroundColor: CONTROL_META[control].iconBg,
    }}
    className="rounded-full items-center justify-center"
  >
    {CONTROL_META[control].icon(scaleWidth(size * 0.43))}
  </View>
);

// ─── Header: back, title, learner switcher, "applies to" banner ────────────

export const ControlsHeader = ({
  title,
  learner,
  loading,
  onSelectKid,
  right,
}: {
  title: string;
  learner?: LearnerOption;
  loading?: boolean;
  onSelectKid: (kidId: string) => void;
  right?: ReactNode;
}) => (
  <View className="px-6 pt-5 pb-6 z-30">
    <TopBackButton />
    <View className="flex-row items-center justify-between mt-5 mb-5 z-40">
      <Text className="font-sansMedium text-dark text-[22px]">{title}</Text>
      {right}
    </View>
    <KidSwitcher loading={loading} kid={learner} onSelect={onSelectKid} />
    <View className="bg-[#FEF6CD] border border-[#F6E9A6] rounded-[16px] mt-5 pl-5 py-5 flex-row items-center">
      <View className="flex-1 pr-2">
        {loading ? (
          <>
            <Skeleton className="w-4/5 rounded-full mb-3" />
            <Skeleton className="w-3/5 rounded-full" />
          </>
        ) : (
          <>
            <Text className="text-[17px] font-sansMedium text-dark leading-[1.6]">
              These controls apply to {learner?.name} only.
            </Text>
            <Text className="text-[15px] font-sans text-dark leading-[1.6] mt-2">
              Manage healthy learning habits for this learner. You can set
              different learning time rules for each learner.
            </Text>
          </>
        )}
      </View>
      <Image
        source={IMAGES.TipKidReading}
        style={{ width: scaleWidth(100), height: scaleWidth(100) }}
        resizeMode="contain"
      />
    </View>
  </View>
);

// ─── Toggle ────────────────────────────────────────────────────────────────

export const Toggle = ({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => (
  <Pressable
    accessibilityRole="switch"
    accessibilityState={{ checked: value, disabled }}
    disabled={disabled}
    onPress={() => {
      Haptics.selectionAsync();
      onChange(!value);
    }}
    style={{ width: scaleWidth(54), height: scaleWidth(32) }}
    className={twMerge(
      'rounded-full justify-center px-[3px] border-2',
      value
        ? 'bg-[#3F9243] border-[#3F9243] items-end'
        : 'bg-[#8E8B8E] border-[#8E8B8E] items-start',
    )}
  >
    <View
      style={{ width: scaleWidth(24), height: scaleWidth(24) }}
      className="rounded-full bg-white"
    />
  </Pressable>
);

// ─── Detail screen intro (icon, title + toggle, description) ───────────────

export const ControlIntro = ({
  control,
  description,
  enabled,
  onToggle,
}: {
  control: ControlKey;
  description: string;
  enabled?: boolean;
  onToggle?: (value: boolean) => void;
}) => (
  <View className="pb-5 border-b border-[#E5E5E5] mb-6">
    <ControlIcon control={control} size={48} />
    <View className="flex-row items-center justify-between mt-5">
      <Text className="text-[17px] font-sansSemiBold text-dark">
        {CONTROL_META[control].title}
      </Text>
      {onToggle && <Toggle value={!!enabled} onChange={onToggle} />}
    </View>
    <Text className="text-[16px] font-sans text-[#474348] leading-[1.6] mt-3 pr-6">
      {description}
    </Text>
  </View>
);

// ─── "Off" state cards ─────────────────────────────────────────────────────

export const OffStateCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <View className="bg-[#F5F5F5] rounded-[16px] p-4">
    <View
      style={{ width: scaleWidth(44), height: scaleWidth(44) }}
      className="bg-[#E5E5E5] rounded-full items-center justify-center"
    >
      <Feather name="clock" size={scaleWidth(20)} color="#474348" />
    </View>
    <Text className="text-[17px] font-sansMedium text-dark mt-4">{title}</Text>
    <Text className="text-[16px] font-sans text-[#474348] leading-[1.6] mt-3">
      {description}
    </Text>
  </View>
);

export const WhyCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <View className="bg-white border border-[#D9EBDA] rounded-[24px] p-6 mt-6">
    <View
      style={{ width: scaleWidth(64), height: scaleWidth(64) }}
      className="bg-[#E6F4EB] rounded-full items-center justify-center"
    >
      <MaterialCommunityIcons
        name="flower"
        size={scaleWidth(34)}
        color="#099137"
      />
    </View>
    <Text className="text-[17px] font-sansSemiBold text-dark mt-5">
      {title}
    </Text>
    <Text className="text-[16px] font-sans text-[#474348] leading-[1.6] mt-3">
      {description}
    </Text>
  </View>
);

const CLOUD_COLORS = {
  purple: '#F5EDF7',
  green: '#E6F2E8',
  blue: '#E8EFF9',
};

export const CloudCard = ({
  tone,
  illustration,
  title,
  description,
}: {
  tone: keyof typeof CLOUD_COLORS;
  illustration: ReactNode;
  title: string;
  description: string;
}) => {
  const color = CLOUD_COLORS[tone];
  return (
    <View className="mt-14">
      {/* Cloud bumps above the card */}
      <View
        style={{ backgroundColor: color, width: '44%', aspectRatio: 1.6 }}
        className="absolute -top-10 left-[30%] rounded-full"
      />
      <View
        style={{ backgroundColor: color, width: '36%', aspectRatio: 1.8 }}
        className="absolute -top-4 left-[14%] rounded-full"
      />
      <View
        style={{ backgroundColor: color, width: '36%', aspectRatio: 1.8 }}
        className="absolute -top-4 right-[14%] rounded-full"
      />
      <View style={{ backgroundColor: color }} className="rounded-[24px] p-6">
        {illustration}
        <Text className="text-[17px] font-sansSemiBold text-dark mt-5">
          {title}
        </Text>
        <Text className="text-[16px] font-sans text-[#474348] leading-[1.6] mt-3">
          {description}
        </Text>
      </View>
    </View>
  );
};

export const CloudIllustration = {
  calendar: (
    <MaterialCommunityIcons
      name="calendar-month"
      size={scaleWidth(64)}
      color="#A44CC2"
    />
  ),
  books: (
    <Image
      source={IMAGES.BookStack as ImageSourcePropType}
      style={{ width: scaleWidth(72), height: scaleWidth(64) }}
      resizeMode="contain"
    />
  ),
  alarm: (
    <MaterialCommunityIcons
      name="alarm"
      size={scaleWidth(72)}
      color="#0A4D9C"
    />
  ),
};

// ─── Form pieces ───────────────────────────────────────────────────────────

export const SectionLabel = ({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) => (
  <View className={twMerge('mb-4', className)}>
    <Text className="text-[16px] font-sansSemiBold text-dark">{title}</Text>
    {!!subtitle && (
      <Text className="text-[15px] font-sans text-[#474348] leading-[1.6] mt-2">
        {subtitle}
      </Text>
    )}
  </View>
);

const Radio = ({ selected }: { selected: boolean }) => (
  <View
    style={{ width: scaleWidth(22), height: scaleWidth(22) }}
    className={twMerge(
      'rounded-full border-[1.5px] items-center justify-center',
      selected ? 'border-[#3F9243]' : 'border-[#474348]',
    )}
  >
    {selected && (
      <View
        style={{ width: scaleWidth(12), height: scaleWidth(12) }}
        className="rounded-full bg-[#3F9243]"
      />
    )}
  </View>
);

export const RecommendedChip = () => (
  <View className="bg-[#E6F4EB] rounded-[8px] px-3 py-1">
    <Text className="text-[14px] font-sansMedium text-[#099137]">
      Recommended
    </Text>
  </View>
);

export const RadioOption = ({
  label,
  description,
  selected,
  recommended,
  onPress,
}: {
  label: string;
  description?: string;
  selected: boolean;
  recommended?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    onPress={onPress}
    className={twMerge(
      'border border-[#E5E5E5] rounded-[20px] px-5 py-4 mb-4 flex-row gap-4',
      description ? 'items-start' : 'items-center',
    )}
  >
    <View className={description ? 'mt-0.5' : undefined}>
      <Radio selected={selected} />
    </View>
    <View className="flex-1">
      <View className="flex-row items-center gap-4">
        <Text className="text-[15px] font-sansMedium text-dark">{label}</Text>
        {recommended && <RecommendedChip />}
      </View>
      {!!description && (
        <Text className="text-[15px] font-sans text-[#474348] leading-[1.6] mt-3">
          {description}
        </Text>
      )}
    </View>
  </Pressable>
);

export const CheckOption = ({
  title,
  description,
  checked,
  disabled,
  onPress,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="checkbox"
    accessibilityState={{ checked, disabled }}
    disabled={disabled}
    onPress={onPress}
    className={twMerge(
      'border rounded-[20px] p-5 mb-4 flex-row items-start gap-4',
      disabled ? 'border-[#F2F2F2]' : 'border-[#E5E5E5]',
    )}
  >
    <View className="flex-1">
      <Text
        className={twMerge(
          'text-[16px] font-sansMedium',
          disabled ? 'text-[#A8A6A8]' : 'text-dark',
        )}
      >
        {title}
      </Text>
      <Text
        className={twMerge(
          'text-[15px] font-sans leading-[1.6] mt-3',
          disabled ? 'text-[#A8A6A8]' : 'text-[#474348]',
        )}
      >
        {description}
      </Text>
    </View>
    <View
      style={{ width: scaleWidth(28), height: scaleWidth(28) }}
      className={twMerge(
        'rounded-[8px] border-[1.5px] items-center justify-center',
        checked
          ? 'bg-[#3F9243] border-[#3F9243]'
          : disabled
            ? 'border-[#D3D2D3]'
            : 'border-[#474348]',
      )}
    >
      {checked && <Feather name="check" size={scaleWidth(16)} color="white" />}
    </View>
  </Pressable>
);

export const InfoNote = ({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) => (
  <View
    className={twMerge(
      'bg-[#E8F0FB] rounded-[16px] p-4 flex-row gap-3 mt-2',
      className,
    )}
  >
    <View
      style={{ width: scaleWidth(26), height: scaleWidth(26) }}
      className="bg-[#1671D9] rounded-full items-center justify-center mt-0.5"
    >
      <Text className="text-white font-sansBold text-[12px]">i</Text>
    </View>
    <View className="flex-1">
      <Text
        className={twMerge(
          'text-[15px] text-dark leading-[1.6]',
          description ? 'font-sansMedium' : 'font-sans',
        )}
      >
        {title}
      </Text>
      {!!description && (
        <Text className="text-[15px] font-sans text-dark leading-[1.6] mt-2">
          {description}
        </Text>
      )}
    </View>
  </View>
);

export const DayChip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    accessibilityRole="checkbox"
    accessibilityState={{ checked: selected }}
    onPress={onPress}
    className={twMerge(
      'rounded-[16px] px-6 py-4',
      selected ? 'bg-[#3F9243]' : 'bg-[#EDEDED]',
    )}
  >
    <Text
      className={twMerge(
        'text-[15px] font-sans',
        selected ? 'text-white' : 'text-dark',
      )}
    >
      {label}
    </Text>
  </Pressable>
);

export const TimeSelect = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View className="flex-1">
      <Text className="text-[15px] font-sansMedium text-dark mb-3">
        {label}
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        className="border border-[#E5E5E5] rounded-[16px] px-5 py-4 flex-row items-center justify-between bg-white"
      >
        <Text className="text-[15px] font-sans text-dark">
          {formatTime(value)}
        </Text>
        <Feather name="chevron-down" size={22} color="#221D23" />
      </Pressable>
      <Modal
        isVisible={open}
        onBackdropPress={() => setOpen(false)}
        onBackButtonPress={() => setOpen(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        useNativeDriverForBackdrop
      >
        <View className="bg-white rounded-t-[24px] pt-5 pb-10 max-h-[60%]">
          <Text className="text-[17px] font-sansSemiBold text-dark px-6 mb-3">
            {label}
          </Text>
          <ScrollView>
            {TIME_OPTIONS.map((time) => (
              <Pressable
                key={time}
                onPress={() => {
                  onChange(time);
                  setOpen(false);
                }}
                className={twMerge(
                  'px-6 py-3.5 flex-row items-center justify-between',
                  time === value && 'bg-[#F1F9F1]',
                )}
              >
                <Text
                  className={twMerge(
                    'text-[16px] font-sans text-dark',
                    time === value && 'font-sansMedium text-[#337535]',
                  )}
                >
                  {formatTime(time)}
                </Text>
                {time === value && (
                  <Feather name="check" size={20} color="#337535" />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

// ─── Layout ────────────────────────────────────────────────────────────────

export const DetailBody = ({ children }: { children: ReactNode }) => (
  <View className="bg-white px-6 pt-6 pb-8">{children}</View>
);

export const DetailBodySkeleton = () => (
  <DetailBody>
    <Skeleton
      style={{ width: scaleWidth(48), height: scaleWidth(48) }}
      className="rounded-full mb-5"
    />
    <Skeleton className="w-1/2 rounded-full mb-4" />
    <Skeleton className="w-4/5 rounded-full mb-8" />
    <Skeleton style={{ height: 120 }} className="w-full rounded-[16px] mb-4" />
    <Skeleton style={{ height: 120 }} className="w-full rounded-[16px]" />
  </DetailBody>
);

export const FooterActions = ({
  dirty,
  saving,
  onSave,
  onCancel,
}: {
  dirty: boolean;
  saving?: boolean;
  onSave: () => void;
  onCancel: () => void;
}) => (
  <View className="border-t border-[#C3E4C5] px-6 pt-6 pb-8 gap-4">
    <Button
      text="SAVE CHANGES"
      disabled={!dirty || saving}
      loading={saving}
      onPress={onSave}
      textClassname={twMerge(!dirty && 'text-[#8E8B8E]')}
    />
    <Button
      text="CANCEL"
      disabled={!dirty || saving}
      onPress={onCancel}
      className="bg-white border-b-2 border-b-[#918E91]"
      textClassname={twMerge('text-dark', !dirty && 'text-[#8E8B8E]')}
    />
  </View>
);

export const DetailScreen = ({ children }: { children: ReactNode }) => (
  <Container scrollable>
    <View className="flex-1">{children}</View>
  </Container>
);

// ─── Reset flow (compact confirmation modals) ──────────────────────────────

const RESET_EFFECTS = [
  'Turn off Daily Learning Limit',
  'Turn off Break Reminders',
  'Turn off Learning Schedules',
  'Clear all Notification Preferences',
];

const CompactModal = ({
  open,
  onClose,
  accent,
  children,
}: {
  open: boolean;
  onClose: () => void;
  accent: string;
  children: ReactNode;
}) => (
  <Modal
    isVisible={open}
    onBackdropPress={onClose}
    onBackButtonPress={onClose}
    useNativeDriverForBackdrop
  >
    <View
      style={{ borderBottomColor: accent }}
      className="bg-[#F9FBFD] rounded-[24px] border-b-4 px-6 pt-6 pb-7 items-center"
    >
      {children}
    </View>
  </Modal>
);

export const ResetControlsModal = ({
  open,
  loading,
  onConfirm,
  onClose,
}: {
  open: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) => (
  <CompactModal open={open} onClose={onClose} accent="#DE2121">
    <View
      style={{ width: scaleWidth(72), height: scaleWidth(72) }}
      className="bg-[#F9E5E7] rounded-full items-center justify-center"
    >
      <Feather name="rotate-ccw" size={scaleWidth(30)} color="#DE2121" />
    </View>
    <Text className="text-[20px] font-sansBold text-dark text-center mt-5">
      Reset Learning Time Controls
    </Text>
    <Text className="text-[15px] font-sans text-[#474348] text-center leading-[1.6] mt-3">
      This will reset all learning time controls for this learner to their
      default settings. You can set them up again at any time.
    </Text>
    <View className="bg-[#F9E5E7] rounded-[16px] p-4 mt-5 w-full">
      <Text className="text-[15px] font-sansSemiBold text-dark mb-2">
        This will:
      </Text>
      {RESET_EFFECTS.map((effect) => (
        <View key={effect} className="flex-row items-start gap-3 mt-2">
          <View className="w-2 h-2 rounded-full bg-[#DE2121] mt-2" />
          <Text className="flex-1 text-[15px] font-sans text-[#474348] leading-[1.6]">
            {effect}
          </Text>
        </View>
      ))}
    </View>
    <Button
      text="RESET TO DEFAULT"
      loading={loading}
      disabled={loading}
      onPress={onConfirm}
      className="bg-[#DE2121] border-0 w-full mt-6"
    />
    <Button
      text="CANCEL"
      disabled={loading}
      onPress={onClose}
      className="bg-white border-2 border-[#D3D2D3] w-full mt-4"
      textClassname="text-dark"
    />
  </CompactModal>
);

export const ResetSuccessModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => (
  <CompactModal open={open} onClose={onClose} accent="#099137">
    <View
      style={{ width: scaleWidth(72), height: scaleWidth(72) }}
      className="bg-[#E3F1E7] rounded-full items-center justify-center"
    >
      <View
        style={{ width: scaleWidth(36), height: scaleWidth(36) }}
        className="bg-[#099137] rounded-full items-center justify-center"
      >
        <Feather name="check" size={scaleWidth(20)} color="white" />
      </View>
    </View>
    <Text className="text-[20px] font-sansBold text-dark text-center mt-6">
      Learning Time Controls Reset
    </Text>
    <Text className="text-[15px] font-sans text-[#474348] text-center leading-[1.6] mt-3">
      All learning time controls for this learner have been reset to their
      default settings.
    </Text>
    <Pressable
      onPress={onClose}
      className="bg-[#E3F1E7] border-2 border-[#C3E4C5] rounded-full py-4 w-full items-center mt-6"
    >
      <Text className="text-[16px] font-sansMedium text-[#099137]">DONE</Text>
    </Pressable>
  </CompactModal>
);
