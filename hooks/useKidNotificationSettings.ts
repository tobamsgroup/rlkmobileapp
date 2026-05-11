import {
  getKidNotificationSettings,
  updateKidNotificationSettings,
} from '@/actions/kid-notification-settings';
import { queryClient } from '@/app/_layout';
import { showToast } from '@/utils/toast';
import { useMutation, useQuery } from '@tanstack/react-query';

const QUERY_KEY = ['kidNotificationSettings'];

export const useKidNotificationSettings = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: getKidNotificationSettings,
  });

export const useUpdateKidNotificationSettings = () =>
  useMutation({
    mutationFn: updateKidNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      showToast('success', 'Settings Updated Successfully');
    },
    onError: () => {
      showToast('error', 'Please Try Again!');
    },
  });
