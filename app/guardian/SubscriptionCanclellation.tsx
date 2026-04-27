import { cancelSubscription } from '@/actions/subscription';
import Button from '@/components/Button';
import Container from '@/components/Container';
import CustomizedAlert from '@/components/CustomizedAlert';
import TopBackButton from '@/components/TopBackButton';
import { showToast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const SubscriptionCanclellation = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [periodEnd, setPeriodEnd] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: (reason?: string) => cancelSubscription(reason),
    onSuccess: (data) => {
      setPeriodEnd(data?.currentPeriodEnd ?? '');
      setOpenModal(true);
    },
    onError: (err: any) => {
      showToast(
        'error',
        err?.response?.data?.message ?? 'Failed to cancel subscription. Please try again.',
      );
    },
  });

  const handleSubmit = () => {
    if (!selectedReason && !customReason.trim()) {
      showToast('info', 'Please select or describe a reason before submitting.');
      return;
    }
    const reason = selectedReason
      ? customReason.trim()
        ? `${selectedReason} — ${customReason.trim()}`
        : selectedReason
      : customReason.trim();
    mutate(reason);
  };

  return (
    <Container scrollable backgroundColor="#FAFDFF">
      <View className="px-6 py-5 pb-10">
        <TopBackButton className="border border-[#EFEFF3]" />
        <Text className="font-sansMedium text-[#221D23] text-[16px] mt-4 mb-2">
          Step 2 of 2
        </Text>
        <Text className="text-[#265828] font-sansSemiBold text-[20px]">
          Help Us Understand Why
        </Text>
        <View className="gap-5 mt-8">
          {REASONS.map((r) => (
            <Pressable
              onPress={() => setSelectedReason(r)}
              key={r}
              className={twMerge(
                'border rounded-[8px] py-4 px-6 w-full flex-row gap-4 items-center',
                selectedReason === r
                  ? 'border-[#3F9243] bg-[#F1F9F199]'
                  : 'border-[#D3D2D3]',
              )}
            >
              <View
                className={twMerge(
                  'w-6 h-6 rounded-full border items-center justify-center',
                  selectedReason === r ? 'border-[#3F9243]' : 'border-[#3C3C3C]',
                )}
              >
                {selectedReason === r && (
                  <View className="w-3 h-3 bg-[#3F9243] rounded-full" />
                )}
              </View>
              <Text className="text-[#221D23] text-[16px] font-sans">{r}</Text>
            </Pressable>
          ))}
        </View>
       {selectedReason === 'Other' && <TextInput
          style={{ shadowColor: '#1671D9', shadowOpacity: 0.4, shadowRadius: 3 }}
          multiline
          placeholder="Tell us more (optional)"
          placeholderTextColor="#918E91"
          value={customReason}
          onChangeText={setCustomReason}
          className="border-[#1671D9] border w-full mt-4 p-6 rounded-[8px] h-[124px] bg-[#FAFDFF]"
        />}
        <Button
          onPress={handleSubmit}
          loading={isPending}
          disabled={isPending}
          text="SUBMIT & CANCEL"
          className="mt-10"
        />
      </View>

      <CustomizedAlert
        title="Thank You for Your Feedback!"
        desc={
          periodEnd
            ? `You'll continue to have access until ${formatDate(periodEnd)}.\nAfter that, access to learning content will be removed, and you won't be able to assign books to your child.`
            : `You'll retain access until the end of your current billing period.\nAfter that, access to learning content will be removed.`
        }
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          router.replace('/(tabs)');
        }}
      />
    </Container>
  );
};

const REASONS = [
  'Too expensive',
  'Not using it enough',
  'Child not interested',
  'Technical issues',
  'Other',
];

export default SubscriptionCanclellation;
