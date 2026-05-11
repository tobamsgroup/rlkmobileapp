import axios from '@/lib/axios';

export type KidNotificationSettingsData = {
  xpMilestoneReached: boolean;
  badgeUnlocked: boolean;
  levelUp: boolean;
  activityCompleted: boolean;
  streakReminder: boolean;
  newContentAvailable: boolean;
};

export const getKidNotificationSettings =
  async (): Promise<KidNotificationSettingsData> => {
    const res = await axios.get('/kid-notification-settings');
    const { _id, kidId, createdAt, updatedAt, ...prefs } = res.data?.data;
    return prefs as KidNotificationSettingsData;
  };

export const updateKidNotificationSettings = async (
  patch: Partial<KidNotificationSettingsData>,
): Promise<KidNotificationSettingsData> => {
  const res = await axios.patch('/kid-notification-settings', patch);
  return res.data?.data;
};
