import { ICONS } from '@/assets/icons';
import { BillingStatus } from '@/actions/subscription';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { formatDate } from '@/utils';

type BillingCardProps = {
  planName: string;
  amount: number;
  currency: string;
  status: BillingStatus;
  date: string;
  receiptUrl: string | null;
  onDownload: (url: string) => void;
};

const STATUS_STYLES: Record<BillingStatus, { bg: string; text: string }> = {
  Paid: { bg: '#0D8A3E1A', text: '#0D8A3E' },
  Pending: { bg: '#D5B3001A', text: '#D5B300' },
  Failed: { bg: '#DE21211A', text: '#DE2121' },
};

const formatAmount = (amount: number, currency: string): string => {
  const value = (amount / 100).toFixed(2);
  const symbols: Record<string, string> = { gbp: '£', usd: '$', eur: '€' };
  const symbol = symbols[currency.toLowerCase()] ?? currency.toUpperCase() + ' ';
  return `${symbol}${value}`;
};

const BillingCard = ({
  planName,
  amount,
  currency,
  status,
  date,
  receiptUrl,
  onDownload,
}: BillingCardProps) => {
  const { bg, text } = STATUS_STYLES[status];

  return (
    <View className="border border-[#D3D2D366] rounded-[4px]">
      <View className="bg-[#D3D2D366] py-2 px-4">
        <Text className="text-[16px] font-sansMedium text-[#221D23]">
          {planName}
        </Text>
      </View>
      <View className="p-4 gap-5">
        <View className="flex-row items-center justify-between">
          <Text className="font-sans text-[#221D23] text-[16px]">
            {formatAmount(amount, currency)}
          </Text>
          <View style={{ backgroundColor: bg }} className="px-4 rounded-full py-2">
            <Text style={{ color: text }} className="font-sansMedium">
              {status}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-sans text-[#221D23] text-[16px]">
            {formatDate(date)}
          </Text>
          <Pressable
            onPress={() => receiptUrl && onDownload(receiptUrl)}
            disabled={!receiptUrl}
            style={{ opacity: receiptUrl ? 1 : 0.35 }}
            className="w-12 h-12 items-center justify-center border border-[#D3D2D366] rounded-[4px]"
          >
            <ICONS.Download />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default BillingCard;
