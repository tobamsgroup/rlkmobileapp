import Button from '@/components/Button';
import Container from '@/components/Container';
import Select from '@/components/Select';
import BillingCard from '@/components/Subscription/BillingCard';
import TopBackButton from '@/components/TopBackButton';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

const BillingHistory = () => {
  const [status, setStatus] = useState('All');
  return (
    <Container scrollable>
      <View className="px-6 py-5  pb-10">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Billing History
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          View all your past payments and receipts.
        </Text>
      </View>
      <View className=" bg-white p-6">
        <Select
          options={[
            'All time',
            'Last 3 months',
            'Last 6 months',
            'Last 12 months',
          ]}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          horizontal
          className="flex-row gap-2 mt-4"
          contentContainerClassName="gap-2"
        >
          {['All', 'Paid', 'Pending', 'Failed']?.map((b) => (
            <Button
              onPress={() => setStatus(b)}
              text={b}
              key={b}
              textClassname={twMerge(
                'font-sans',
                status === b ? 'text-white' : 'text-[#474348]',
              )}
              className={twMerge(
                'px-7 border-0',
                status === b
                  ? 'bg-primary'
                  : 'bg-white border border-[#D3D2D3]',
              )}
            />
          ))}
        </ScrollView>
        <View className="gap-6 mt-8">
          {[1, 2, 3]?.map((v) => (
            <BillingCard key={v} />
          ))}
        </View>
      </View>
    </Container>
  );
};

export default BillingHistory;
