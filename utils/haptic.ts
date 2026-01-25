import * as Haptics from "expo-haptics";

export const HAPTIC = {
  error: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
};
