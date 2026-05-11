import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getNotificationSettings,
  NotificationSettingsData,
  updateNotificationSettings,
} from '@/actions/notification-settings';
import { queryClient } from '@/app/_layout';
import { showToast } from '@/utils/toast';

const QUERY_KEY = ['notificationSettings'];

export const useNotificationSettings = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: getNotificationSettings,
  });

export const useUpdateNotificationSettings = () =>
  useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      showToast('success', 'Settings Updated Successfully')
    },
  });
