import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

const ConfirmPlan = () => {
  return (
    <Container scrollable>
      <View className="px-6 py-5  pb-10">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Confirm Your Plan
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Just one step to go! Review your plan and complete your subscription.
        </Text>
        <View className="bg-white rounded-[12px] p-4 mt-6 items-start">
          <Text className="text-[18px] font-sansSemiBold text-[#221D23] mb-8">
            Plan Summary
          </Text>
          <View className="bg-[#FFF7CC] rounded-[17px] p-1.5 border-[0.9px] border-[#FFF2AA] mb-4">
            <Image source={IMAGES.DollarCoin} className="w-[84px] h-[84px]" />
          </View>
          <Text
            style={{ color: '#3F6992', backgroundColor: '#3F69921A' }}
            className="text-[16px] font-sansSemiBold  rounded-[8px] px-4 py-1.5"
          >
            Starter
          </Text>
          <Text className="text-[20px] font-sansSemiBold text-[#221D23] leading-[1.3] mt-4">
            £7.99
            <Text className="text-[16px] text-[#474348] font-sans">/month</Text>
          </Text>
          <View className="flex-row items-center gap-2 mt-3">
            <Text className="text-[#474348] font-sansMedium text-[16px]">
              52 Books
            </Text>
            <View className="bg-[#D9D9D9] w-2 h-2 rounded-full" />
            <Text className="text-[#474348] font-sansMedium text-[16px]">
              5 Children
            </Text>
          </View>
          <Text className="font-sansItalic text-[#474348] mt-6">
            Billed monthly. Cancel anytime.
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="flex-row border-b border-b-[#3F9243] gap-2 mt-5"
          >
            <Text className="text-[16px] text-[#3F9243] font-sansMedium">
              CHANGE PLAN
            </Text>
            <ICONS.Pencil width={20} height={20} stroke={'#3F9243'} />
          </Pressable>
          <View className="border border-[#D3D2D366] rounded-[12px] mt-8 bg-[#D3D2D31A] p-4 w-full">
            <Text className="font-sansMedium text-[#221D23] text-[16px] mb-4">
              Features
            </Text>

            <View className="flex-row gap-3 items-center mb-4">
              <View className="w-8 h-8 rounded-full items-center justify-center bg-[#D3D2D333]">
                <ICONS.Check color={'#474348'} />
              </View>
              <Text className="text-[#474348] font-sans text-[16px] flex-1">
                Add more children to your account
              </Text>
            </View>
            <View className="flex-row gap-3 items-center mb-4">
              <View className="w-8 h-8 rounded-full items-center justify-center bg-[#D3D2D333]">
                <ICONS.Check color={'#474348'} />
              </View>
              <Text className="text-[#474348] font-sans text-[16px] flex-1">
                Track detailed learning progress
              </Text>
            </View>
            <View className="flex-row gap-3 items-center ">
              <View className="w-8 h-8 rounded-full items-center justify-center bg-[#D3D2D333]">
                <ICONS.Check color={'#474348'} />
              </View>
              <Text className="text-[#474348] font-sans text-[16px] flex-1">
                etc...
              </Text>
            </View>
          </View>
          <View className="border-b border-b-[#D3D2D366] my-8 w-full" />
          <View className="w-full flex-row justify-between items-center">
            <Text className="text-[18px] font-sansMedium text-[#221D23]">
              Amount to pay today
            </Text>
            <Text className="text-[18px] font-sansMedium text-[#221D23]">
              £11.99
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-[12px] p-5 mt-6 items-start">
          <Text className="font-sansSemiBold text-dark text-[18px] ">
            Billing Summary
          </Text>
          <View className="gap-4 mt-6">
            <View className="w-full flex-row justify-between items-center">
              <Text className="text-[16px] font-sans text-[#474348]">
                Amount to pay today
              </Text>
              <Text className="text-[16px] font-sans text-[#474348]">
                £11.99
              </Text>
            </View>
            <View className="w-full flex-row justify-between items-center">
              <Text className="text-[16px] font-sans text-[#474348]">
                Billing cycle
              </Text>
              <Text className="text-[16px] font-sans text-[#474348]">
                Monthly
              </Text>
            </View>
            <View className="w-full flex-row justify-between items-center">
              <Text className="text-[16px] font-sans text-[#474348]">
                Next Billing Date
              </Text>
              <Text className="text-[16px] font-sans text-[#474348]">
                Jan 16, 2027
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-[12px] p-5 mt-6 items-start">
          <Text className="font-sansSemiBold text-dark text-[18px] mb-4">
            Payment Method
          </Text>
          <Pressable className="border border-[#3F9243] rounded-full py-4 px-6 w-full flex-row gap-4 items-center">
            <View className="w-6 h-6 rounded-full border border-[#3F9243] items-center justify-center">
              <View className="w-3 h-3 bg-[#3F9243] rounded-full" />
            </View>
            <Text className="text-[#221D23] text-[16px] font-sans">
              PAY VIA STRIPE
            </Text>
          </Pressable>
          <View className="border-b border-b-[#D3D2D366] my-6 w-full" />
          <Button text="COMPLETE PAYMENT" className="w-full" />
          <Text className="mt-4 font-sansItalic text-[#474348] text-[12px]">
            Secure payment powered by Stripe. You’ll be redirected to complete
            your payment.
          </Text>
        </View>
      </View>
    </Container>
  );
};

export default ConfirmPlan;
