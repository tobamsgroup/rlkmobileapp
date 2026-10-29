export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type LimitReachedAction = 'reminder' | 'pause';

export type DailyLimitSettings = {
  enabled: boolean;
  minutes: number;
  action: LimitReachedAction;
};

export type BreakReminderSettings = {
  enabled: boolean;
  intervalMinutes: number;
};

export type ScheduleSettings = {
  enabled: boolean;
  days: WeekDay[];
  // Learner's local time, 24h "HH:mm"
  startTime: string;
  endTime: string;
};

export type LearningNotificationSettings = {
  sessionStarted: boolean;
  dailyLimitReached: boolean;
  breakReminderSent: boolean;
};

export type LearningTimeControls = {
  kidId: string;
  dailyLimit: DailyLimitSettings;
  breakReminder: BreakReminderSettings;
  schedule: ScheduleSettings;
  notifications: LearningNotificationSettings;
};

export type LearningTimeControlsUpdate = Partial<{
  dailyLimit: Partial<DailyLimitSettings>;
  breakReminder: Partial<BreakReminderSettings>;
  schedule: Partial<ScheduleSettings>;
  notifications: Partial<LearningNotificationSettings>;
}>;

export type DailyUsage = {
  date: string;
  secondsToday: number;
  limitSeconds: number | null;
  limitReached: boolean;
};

export type KidLearningTimeControls = LearningTimeControls & {
  usage: DailyUsage;
};
