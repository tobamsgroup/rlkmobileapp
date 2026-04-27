import Button, { LinearButton, SecondaryButton } from '@/components/Button';
import Container from '@/components/Container';
import CustomizedAlert from '@/components/CustomizedAlert';
import TopBackButton from '@/components/TopBackButton';
import { updateDeletionReason } from '@/actions';
import { handleLogout } from '@/actions/logout';
import { useAppDispatch } from '@/hooks/redux';
import { showToast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const AccountDeletionReason = () => {
  const dispatch = useAppDispatch();
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [openModal, setOpenModal] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (reason: string) => updateDeletionReason(reason),
    onSuccess: () => {
      setOpenModal(true);
    },
    onError: (err: any) => {
      showToast(
        'error',
        err?.response?.data?.message ?? 'Something went wrong',
      );
    },
  });

  const handleSubmit = () => {
    const reason = selectedReason
      ? customReason.trim()
        ? `${selectedReason} — ${customReason.trim()}`
        : selectedReason
      : customReason.trim();

    if (!reason) {
      showToast('info', 'Please select a reason or describe why you are leaving');
      return;
    }

    mutate(reason);
  };

  const handleClose = () => {
    setOpenModal(false);
    handleLogout(dispatch);
    router.replace('/auth/Login');
  };

  return (
    <Container backgroundColor="white" scrollable>
      <View className="px-6 py-5">
        <TopBackButton className="border-[#EFEFF3] border " />
        <Text className="font-sansSemiBold text-[#265828] text-[20px] mt-4">
          Reason For Leaving (Optional)
        </Text>
        <View className="gap-5 mt-8">
          {REASONS?.map((r) => (
            <Pressable
              onPress={() => setSelectedReason(r)}
              key={r}
              className={twMerge(
                'border  rounded-[8px] py-4 px-6 w-full flex-row gap-4 items-center',
                selectedReason === r
                  ? 'border-[#3F9243] bg-[#F1F9F199]'
                  : ' border-[#D3D2D3]',
              )}
            >
              <View
                className={twMerge(
                  'w-6 h-6 rounded-full border  items-center justify-center',
                  selectedReason === r
                    ? 'border-[#3F9243]'
                    : 'border-[#3C3C3C]',
                )}
              >
                {selectedReason === r && (
                  <View className="w-3 h-3 bg-[#3F9243] rounded-full" />
                )}
              </View>
              <Text className="text-[#221D23] text-[16px] font-sans">{r}</Text>
            </Pressable>
          ))}
          <TextInput
            style={{
              shadowColor: '#1671D9',
              shadowOpacity: 0.4,
              shadowRadius: 3,
            }}
            multiline
            placeholder="Tell us more (optional)"
            placeholderClassName="font-sans"
            placeholderTextColor={'#918E91'}
            value={customReason}
            onChangeText={setCustomReason}
            className="border-[#1671D9] border w-full mt-4 p-6 rounded-[8px] h-[124px]  bg-[#FAFDFF] shadow-[#1671D9] "
          />
        </View>
          <LinearButton
            onPress={handleSubmit}
            text="SUBMIT"
            className="mt-10"
            loading={isPending}
          />
          <SecondaryButton
            onPress={() => {
              handleLogout(dispatch);
              router.replace('/auth/Login');
            }}
            text="SKIP"
            className="mt-4"
          />
      </View>
      <CustomizedAlert
        title="Your Account Deletion Is In Progress"
        desc={
          'Your account deletion is in progress.\nYou can restore your account anytime within the next 3 days by logging back in. After this period, all your data will be permanently removed.'
        }
        open={openModal}
        onClose={handleClose}
      />
    </Container>
  );
};

const REASONS = [
  'The subscription is too expensive',
  "My child doesn't use it enough",
  'Technical issues or bugs',
  'Switching to another service',
  'Other',
];

export default AccountDeletionReason;
