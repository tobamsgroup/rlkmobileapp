import { restoreAccount } from '@/actions';
import { handleLogout } from '@/actions/logout';
import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { getData, storeData } from '@/lib/storage';
import { clearDeletionWarning } from '@/redux/authSlice';
import { GuardianLoginSession } from '@/types';
import { showToast } from '@/utils/toast';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

const getDaysRemaining = (scheduledAt: string) => {
  const ms = new Date(scheduledAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

const RestoreAccount = () => {
  const dispatch = useAppDispatch();
  const [isRestoring, setIsRestoring] = useState(false);

  const user = useAppSelector((state) => state.auth.user) as GuardianLoginSession | null;
  const deletionWarning = user?.deletionWarning;
  const daysLeft = deletionWarning ? getDaysRemaining(deletionWarning.scheduledAt) : 0;

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restoreAccount();
      dispatch(clearDeletionWarning());
      const stored = await getData<GuardianLoginSession>('user');
      if (stored) {
        const { deletionWarning: _, ...rest } = stored as any;
        await storeData('user', rest);
      }
      showToast('success', 'Your account has been restored successfully')
      router.replace('/(tabs)');
    } catch {
      showToast('error', 'Failed to restore account. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Container backgroundColor="#3F9243">
      <View className="px-6 items-center justify-center flex-1">
        <View className="bg-[#FAFDFF] p-6 rounded-[20px] items-center w-full">
          <View className="w-20 h-20 rounded-full bg-[#1671D91A] items-center justify-center">
            <ICONS.ExclamationCircle strokeWidth={1} stroke="##1671D9" width={30} height={30} />
          </View>
          <Text className="text-[20px] text-dark font-sansSemiBold text-center mt-6">
            Your Account Is Scheduled for Deletion
          </Text>
          <Text className="text-center font-sans text-[#474348] mb-2 mt-6 leading-[1.5] text-[16px]">
            You requested to delete your account. You have{' '}
            <Text className="font-sansMedium">
              {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left
            </Text>{' '}
            to restore it before all your data is permanently removed. If you'd
            like to continue your child's learning journey, you can restore your
            account now.
            
          </Text>
          <Button
            onPress={handleRestore}
            disabled={isRestoring}
            loading={isRestoring}
            className="w-full mt-6 bg-[#3F9243] border-none border-b-0"
            textClassname="text-white"
            text="RESTORE ACCOUNT"
          />
          <Button
            onPress={() => handleLogout(dispatch)}
            disabled={isRestoring}
            className="w-full mt-4 bg-white border-2 border-[#D3D2D3]"
            textClassname="text-[#221D23]"
            text="LOGOUT"
          />
        </View>
      </View>
    </Container>
  );
};

export default RestoreAccount;
