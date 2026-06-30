import axios from '@/lib/axios';

export type ChannelPref = { inApp?: boolean; email?: boolean };

export type NotificationSettingsData = {
  accountVerified: ChannelPref;
  childProfileCreated: ChannelPref;
  newLearnerProfile: ChannelPref;
  preferencesSaved: ChannelPref;
  passwordChange: ChannelPref;
  childPinUpdate: ChannelPref;
  newDeviceLogin: ChannelPref;
  suspiciousLoginActivity: ChannelPref;
  weeklyLearningReport: ChannelPref;
  workbookUpdates: ChannelPref;
  ideaWall: ChannelPref;
  submissionApproved: ChannelPref;
  policyTermsUpdate: ChannelPref;
};

export const getNotificationSettings =
  async (): Promise<NotificationSettingsData> => {
    const res = await axios.get('/notification-settings');
    const { _id, guardianId, createdAt, updatedAt, ...prefs } = res.data?.data;
    return prefs as NotificationSettingsData;
  };

export const updateNotificationSettings = async (
  patch: Partial<NotificationSettingsData>,
): Promise<NotificationSettingsData> => {
  const res = await axios.patch('/notification-settings', patch);
  return res.data?.data;
};
