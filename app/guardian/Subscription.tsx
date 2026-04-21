import { ICONS } from '@/assets/icons';
import Button, { SecondaryButton } from '@/components/Button';
import Container from '@/components/Container';
import BillingCard from '@/components/Subscription/BillingCard';
import TopBackButton from '@/components/TopBackButton';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

const Subscription = () => {
  const [openCancellation, setOpenCancellation] = useState(false);
  return (
    <Container scrollable edges={['top']}>
      <View className="px-6 py-5  pb-10">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Subscription
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Manage your plan and billing details.
        </Text>
      </View>
      <View className=" bg-white p-6">
        <View className="border border-[#C3E4C5] border-b-4 p-4 rounded-[16px] bg-[#F1F9F199]">
          <View className="flex-row justify-between items-center">
            <Text className="text-[20px] font-sansMedium text-[#221D23]">
              Starter
            </Text>
            <View className="flex-row items-center gap-1 bg-[#0991371A] rounded-[4px] px-2 py-1">
              <View className="w-1.5 h-1.5 bg-[#099137] rounded-full" />
              <Text className="text-[16px] text-[#099137] font-sansMedium">
                Active
              </Text>
            </View>
          </View>
          <Text className="text-[32px] font-sansSemiBold text-[#221D23] leading-[1.3] mt-8">
            £7.99
            <Text className="text-[16px] text-[#474348] font-sans">/month</Text>
          </Text>
          <Text className="text-[16px] font-sansMedium text-[#221D23] leading-[1.3] mt-4">
            1 Child
          </Text>
          <View className="border-t border-[#D3D2D366] my-6" />
          <Button
            onPress={() => router.push('/guardian/ChoosePlan')}
            text="CHANGE PLAN"
          />
        </View>
        <View className="border border-[#C3E4C5] border-b-4 p-4 rounded-[16px] mt-5">
          <Text className="text-[16px] font-sansMedium text-[#221D23] leading-[1.3] ">
            Next Billing
          </Text>
          <View className="mt-6">
            <Text className="text-[16px] font-sans text-[#474348] leading-[1.5] ">
              Next Charge
            </Text>
            <Text className="text-[16px] font-sans text-[#221D23] leading-[1.5] mt-1">
              £7.99
            </Text>
          </View>
          <View className="mt-6">
            <Text className="text-[16px] font-sans text-[#474348] leading-[1.5] ">
              Billing Date
            </Text>
            <Text className="text-[16px] font-sans text-[#221D23] leading-[1.5] mt-1">
              December 16, 2026
            </Text>
          </View>
          <View className="mt-6">
            <Text className="text-[16px] font-sans text-[#474348] leading-[1.5] ">
              Billing Cycle
            </Text>
            <Text className="text-[16px] font-sans text-[#221D23] leading-[1.5] mt-1">
              Dec 16, 2026 – Jan 16, 2027
            </Text>
          </View>
          <View className="border-t border-[#D3D2D366] my-6" />
          <Text
            onPress={() => setOpenCancellation(true)}
            className="text-[16px] font-sansMedium text-[#DE2121] leading-[1.5] mt-1"
          >
            CANCEL SUBSCRIPTION
          </Text>
        </View>

        <View className="px-4 py-6 relative rounded-[16px] mt-8">
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 0,
              borderRadius: 16,
            }}
            colors={['#D5B300', '#806C00']}
          />
          <View className="flex-row gap-3">
            <Text className="text-white text-[20px] font-sansSemiBold flex-1">
              Take Your Child Even Further
            </Text>
            <Pressable className="bg-[#FFFFFF66] w-8 h-8 rounded-full items-center justify-center">
              <ICONS.Close width={20} height={20} stroke={'#FFFFFF'} />
            </Pressable>
          </View>
          <Text className="text-[#FAFDFF] mt-2 font-sans text-[16px]">
            Your child is already learning, now give them even more to grow
            with.
          </Text>
          <View className="mt-8">
            <View className="flex-row gap-2">
              <View className="bg-[#FFFFFF66] w-8 h-8 rounded-full items-center justify-center">
                <ICONS.Check color={'#FFFFFF'} />
              </View>
              <Text className="flex-1 text-white text-[16px] font-sansMedium">
                Give access to multiple children in your household
              </Text>
            </View>
            <View className="flex-row gap-2 mt-6">
              <View className="bg-[#FFFFFF66] w-8 h-8 rounded-full items-center justify-center">
                <ICONS.Check color={'#FFFFFF'} />
              </View>
              <Text className="flex-1 text-white text-[16px] font-sansMedium">
                Expand their learning across more topics
              </Text>
            </View>
            <View className="flex-row gap-2 mt-6">
              <View className="bg-[#FFFFFF66] w-8 h-8 rounded-full items-center justify-center">
                <ICONS.Check color={'#FFFFFF'} />
              </View>
              <Text className="flex-1 text-white text-[16px] font-sansMedium">
                Unlock deeper insights into their progress
              </Text>
            </View>
            <View className="border-t border-[#D3D2D366] my-6" />
            <View className="flex-row gap-6 items-center">
              <Text className="text-[32px]">👉</Text>
              <Button
                text="CHANGE PLAN"
                textClassname="text-[#3F9243]"
                className="bg-white border-0 px-6"
              />
            </View>
          </View>
        </View>
      </View>
      <View className=" bg-white p-6 my-6">
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Billing History
        </Text>
        <Text className="mt-2 text-[16px] text-[#474348] font-sans leading-[1.5] mb-5">
          View your past payments and receipts.
        </Text>
        <View className="flex-row">
          <Button
            onPress={() => router.push('/guardian/BillingHistory')}
            text="VIEW ALL"
            className="px-10"
          />
        </View>
        <View className="gap-6 mt-10">
          {[1, 2, 3]?.map((v) => (
            <BillingCard key={v} />
          ))}
        </View>
      </View>
      <CancellationModal
        open={openCancellation}
        onClose={() => setOpenCancellation(false)}
      />
    </Container>
  );
};

const CancellationModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isVisible={open} onBackdropPress={onClose}>
      <View className="bg-[#DBEFDC] p-6  border-2 border-[#6ABC6D] rounded-[24px] items-center">
        <View className="bg-white rounded-[24px] p-5 items-center mb-6 w-full">
          <View className="w-16 h-16 rounded-full bg-[#EF43531A] items-center justify-center">
            <ICONS.AlertTriangle width={32} height={32} />
          </View>
          <View className="absolute top-[58px] right-[62px] ">
            <ICONS.Ellipse width={20} height={20} stroke={'#09913766'} />
          </View>
          <View className="absolute top-[47px] left-[65px] ">
            <ICONS.Confetto />
          </View>
          <View className="absolute bottom-[27px] right-[46px] ">
            <ICONS.Shape />
          </View>
          <Text className="text-center font-sansSemiBold text-[#265828] text-[20px] mb-2 mt-6">
            Are you sure you want to cancel your plan?
          </Text>
          <Text className="text-center text-[#221D23] font-sans text-[16px] leading-[1.5]">
            You’ll continue to have access until May 16, 2026. After that, your
            child will lose access to all learning content.
          </Text>
          <Text
            onPress={() => {
              router.push('/guardian/ChoosePlan');
              onClose();
            }}
            className="text-center text-[#3F9243] font-sansMedium underline text-[16px] leading-[1.5]"
          >
            You can also switch to a lower plan instead.
          </Text>
        </View>
        <Button
          onPress={onClose}
          className="w-full mt-6"
          text={'KEEP SUBSCRIPTION'}
        />
        <SecondaryButton
          onPress={() => {
            router.push('/guardian/SubscriptionCanclellation');
            onClose();
          }}
          className="w-full mt-4"
          text={'CONTINUE TO CANCEL'}
        />
      </View>
    </Modal>
  );
};

export default Subscription;
