import { ICONS } from '@/assets/icons';
import React from 'react';
import { Text, View } from 'react-native';

const BillingCard = () => {
  return (
    <View className="border border-[#D3D2D366] roundeed-[4px]">
      <View className="bg-[#D3D2D366] py-2 px-4">
        <Text className="text-[16px] font-sansMedium text-[#221D23]">
          Starter
        </Text>
      </View>
      <View className="p-4 gap-5">
        <View className="flex-row items-center justify-between">
          <Text className="font-sans text-[#221D23] text-[16px]">£7.99</Text>
          <View className="bg-[#D5B3001A] px-4 rounded-full py-2">
            <Text className="font-sansMedium text-[#D5B300]">Pending</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-sans text-[#221D23] text-[16px]">December 18, 2026</Text>
          <View className=" w-12 h-12 items-center justify-center border border-[#D3D2D366] rounded-[4px]">
            <ICONS.Download/>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BillingCard;
