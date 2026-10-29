import { queryClient } from '@/app/_layout';
import {
  getKidLearningTimeControls,
  reportBreakReminder,
} from '@/actions/learning-time-controls';
import { showLearningTimeLeftToast } from '@/components/kid/LearningTimeLeftToast';
import {
  getLearningTimeScreen,
  showLearningTimeScreen,
} from '@/hooks/useLearningTimeOverlay';
import { getData, storeData } from '@/lib/storage';
import { DailyUsage, KidLearningTimeControls } from '@/types/learningTimeControls';
import {
  getLearningAccess,
  isDailyLimitReached,
  LearningAccess,
  localDateKey,
  secondsLeftToday,
  TIME_LEFT_WARNING_MINUTES,
} from '@/utils/learningTime';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

export const KID_LEARNING_TIME_KEY = ['kid-learning-time-controls'];

const TICK_MS = 10_000;
// Each is shown at most once per day, tracked by the day it was last shown
const LIMIT_REMINDER_KEY = 'learning-limit-reminded';
const TIME_LEFT_WARNING_KEY = 'learning-time-left-warned';

export const useKidLearningTimeControls = () =>
  useQuery({
    queryKey: KID_LEARNING_TIME_KEY,
    queryFn: async () => await getKidLearningTimeControls(localDateKey()),
    staleTime: 60_000,
  });

// Reading heartbeats return today's usage; keep the cached copy current so
// the daily limit is enforced without polling
export const applyUsageUpdate = (usage?: DailyUsage | null) => {
  if (!usage) return;
  queryClient.setQueryData(KID_LEARNING_TIME_KEY, (prev: any) =>
    prev ? { ...prev, usage } : prev,
  );
};

const showBlockedScreen = (
  access: Extract<LearningAccess, { allowed: false }>,
) =>
  showLearningTimeScreen({
    kind: access.reason === 'schedule' ? 'not_available' : 'limit_paused',
  });

// Runs `show` unless it already ran today
const oncePerDay = async (key: string, show: () => void) => {
  const today = localDateKey();
  if ((await getData<string>(key)) === today) return;
  await storeData(key, today);
  show();
};

/**
 * For entry points (e.g. a START button): returns whether learning is allowed
 * now, and shows the screen explaining why when it isn't.
 */
export const useLearningAccess = () => {
  const { data: controls } = useKidLearningTimeControls();
  const canLearn = () => {
    const access = getLearningAccess(controls);
    if (!access.allowed) showBlockedScreen(access);
    return access.allowed;
  };
  return { controls, canLearn };
};

/**
 * Kid home: tells the kid once per app launch when they open the app outside
 * their learning hours.
 */
let notAvailableShown = false;
export const useLearningHoursNotice = () => {
  const { data: controls } = useKidLearningTimeControls();
  useEffect(() => {
    if (!controls || notAvailableShown) return;
    const access = getLearningAccess(controls);
    if (!access.allowed && access.reason === 'schedule') {
      notAvailableShown = true;
      showLearningTimeScreen({ kind: 'not_available' });
    }
  }, [controls]);
};

const checkDailyLimit = (controls: KidLearningTimeControls) => {
  const { dailyLimit } = controls;
  if (!dailyLimit.enabled) return;

  if (dailyLimit.action === 'reminder' && isDailyLimitReached(controls)) {
    oncePerDay(LIMIT_REMINDER_KEY, () =>
      showLearningTimeScreen({ kind: 'limit_reminder' }),
    );
    return;
  }

  const left = secondsLeftToday(controls);
  if (left && left <= TIME_LEFT_WARNING_MINUTES * 60) {
    oncePerDay(TIME_LEFT_WARNING_KEY, () =>
      showLearningTimeLeftToast(Math.ceil(left / 60)),
    );
  }
};

/**
 * Enforces the guardian's learning time controls while a learning screen is
 * open: stops learning outside the schedule or when the daily limit pauses
 * it, warns when a few minutes are left, shows the friendly reminder once
 * the limit is reached, and suggests breaks.
 */
const useLearningTimeGuard = () => {
  const { data: controls, refetch } = useKidLearningTimeControls();
  const [now, setNow] = useState(() => new Date());
  const activeSecondsRef = useRef(0);

  // Fresh rules on open, in case the guardian just changed them
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Clock + active-time counter for break reminders. Time spent on a learning
  // time screen (a break, a reminder) or in the background doesn't count.
  useEffect(() => {
    let last = Date.now();
    const interval = setInterval(() => {
      const current = Date.now();
      if (AppState.currentState === 'active' && !getLearningTimeScreen()) {
        activeSecondsRef.current += (current - last) / 1000;
      }
      last = current;
      setNow(new Date(current));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!controls) return;

    const access = getLearningAccess(controls, now);
    if (!access.allowed) {
      const blocking = getLearningTimeScreen()?.kind;
      if (blocking !== 'not_available' && blocking !== 'limit_paused') {
        showBlockedScreen(access);
      }
      return;
    }

    if (getLearningTimeScreen()) return;
    checkDailyLimit(controls);

    const { breakReminder } = controls;
    if (
      breakReminder.enabled &&
      activeSecondsRef.current >= breakReminder.intervalMinutes * 60
    ) {
      activeSecondsRef.current = 0;
      showLearningTimeScreen({ kind: 'short_break' });
      reportBreakReminder().catch(() => {
        // Guardian notification is best-effort
      });
    }
  }, [controls, now]);
};

export default useLearningTimeGuard;
