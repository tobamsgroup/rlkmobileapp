import Button from '@/components/Button';
import Container from '@/components/Container';
import CustomizedAlert from '@/components/CustomizedAlert';
import TopBackButton from '@/components/TopBackButton';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const SubscriptionCanclellation = () => {
  const [selectedReason, setSelectedReason] = useState('');
  const [openModal, setOpenModal] = useState(false);
  return (
    <Container scrollable backgroundColor="#FAFDFF">
      <View className="px-6 py-5  pb-10">
        <TopBackButton className="border border-[#EFEFF3]" />
        <Text className="font-sansMedium text-[#221D23] text-[16px] mt-4 mb-2">
          Step 2 of 2
        </Text>
        <Text className="text-[#265828] font-sansSemiBold text-[20px]">
          Help Us Understand Why
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
        </View>
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
          className="border-[#1671D9] border w-full mt-4 p-6 rounded-[8px] h-[124px]  bg-[#FAFDFF] shadow-[#1671D9] "
        />
        <Button
          onPress={() => setOpenModal(true)}
          text="SUBMIT & CANCEL"
          className="mt-10"
        />
      </View>
      <CustomizedAlert
        title="Thank You for Your Feedback!"
        desc={
          'You’ll continue to have access until May 16, 2026.\n After that, access to learning content will be removed, and you won’t be able to assign books to your child.'
        }
        open={openModal}
        onClose={() => setOpenModal(false)}
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
