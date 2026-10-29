import {
  KidLearningTimeControls,
  ScheduleSettings,
  WeekDay,
} from '@/types/learningTimeControls';

export const DAILY_LIMIT_OPTIONS = [20, 30, 45, 60];
export const RECOMMENDED_DAILY_LIMIT = 30;
export const BREAK_INTERVAL_OPTIONS = [15, 20, 30];
export const RECOMMENDED_BREAK_INTERVAL = 15;
// Length of the break a kid takes from the break reminder
export const BREAK_DURATION_MINUTES = 5;
// The kid is told when this much of today's learning time is left
export const TIME_LEFT_WARNING_MINUTES = 5;

export const WEEK_DAYS: { value: WeekDay; label: string }[] = [
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
  { value: 'sat', label: 'Sat' },
  { value: 'sun', label: 'Sun' },
];

// Date#getDay() index → WeekDay
const DAY_BY_INDEX: WeekDay[] = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
];

// Kid's local calendar day, shared with the reading-time heartbeat
export const localDateKey = (d = new Date()) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

// "16:00" → "4:00 PM"
export const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
};

// Every 30 minutes across the day, as "HH:mm"
export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  return `${h.toString().padStart(2, '0')}:${i % 2 ? '30' : '00'}`;
});

export const formatDays = (days: WeekDay[]) => {
  const ordered = WEEK_DAYS.filter((d) => days.includes(d.value));
  if (ordered.length === 7) return 'Every day';
  const key = ordered.map((d) => d.value).join(',');
  if (key === 'mon,tue,wed,thu,fri') return 'Mon – Fri';
  if (key === 'sat,sun') return 'Weekends';
  return ordered.map((d) => d.label).join(', ');
};

export const isWithinSchedule = (schedule: ScheduleSettings, now: Date) => {
  if (!schedule.enabled) return true;
  if (!schedule.days.includes(DAY_BY_INDEX[now.getDay()])) return false;
  const minutes = now.getHours() * 60 + now.getMinutes();
  return (
    minutes >= toMinutes(schedule.startTime) &&
    minutes < toMinutes(schedule.endTime)
  );
};

export type LearningAccess =
  | { allowed: true }
  | { allowed: false; reason: 'schedule' | 'daily_limit' };

/**
 * Whether the kid may learn right now. `extraSeconds` is learning time from
 * the current session that hasn't reached the server yet.
 */
export const getLearningAccess = (
  controls: KidLearningTimeControls | undefined,
  now = new Date(),
  extraSeconds = 0,
): LearningAccess => {
  if (!controls) return { allowed: true };
  const { schedule, dailyLimit } = controls;

  if (!isWithinSchedule(schedule, now)) {
    return { allowed: false, reason: 'schedule' };
  }

  if (
    dailyLimit.enabled &&
    dailyLimit.action === 'pause' &&
    isDailyLimitReached(controls, extraSeconds)
  ) {
    return { allowed: false, reason: 'daily_limit' };
  }

  return { allowed: true };
};

export const isDailyLimitReached = (
  controls: KidLearningTimeControls,
  extraSeconds = 0,
) => {
  const { dailyLimit, usage } = controls;
  if (!dailyLimit.enabled) return false;
  // Usage from another day means today's count starts at zero
  const today = usage.date === localDateKey() ? usage.secondsToday : 0;
  return today + extraSeconds >= dailyLimit.minutes * 60;
};

/** Seconds of today's daily limit still left, or null when no limit is set */
export const secondsLeftToday = (controls: KidLearningTimeControls) => {
  const { dailyLimit, usage } = controls;
  if (!dailyLimit.enabled) return null;
  const today = usage.date === localDateKey() ? usage.secondsToday : 0;
  return Math.max(dailyLimit.minutes * 60 - today, 0);
};

const DAY_NAMES: Record<WeekDay, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

// Kid-facing learning days: "Monday to Friday", "every day",
// "Monday, Wednesday and Friday"
export const describeLearningDays = (days: WeekDay[]) => {
  const ordered = WEEK_DAYS.map((d) => d.value).filter((d) => days.includes(d));
  if (ordered.length === 7) return 'every day';
  const indexes = ordered.map((d) => WEEK_DAYS.findIndex((w) => w.value === d));
  const consecutive = indexes.every((n, i) => i === 0 || n === indexes[i - 1] + 1);
  const names = ordered.map((d) => DAY_NAMES[d]);
  if (consecutive && names.length >= 3) {
    return `${names[0]} to ${names[names.length - 1]}`;
  }
  if (names.length === 1) return `on ${names[0]}`;
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
};
