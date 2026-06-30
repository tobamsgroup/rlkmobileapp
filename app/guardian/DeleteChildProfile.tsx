import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { SimpleInput } from '@/components/Input';
import TopBackButton from '@/components/TopBackButton';
import { showToast } from '@/utils/toast';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';

const AccountDeletion = () => {
  const [openDeletion, setOpenDeletion] = useState(false);
  const [password, setPassword] = useState('');

  const { id, name } = useLocalSearchParams();

  return (
    <Container backgroundColor="white" scrollable>
      <View className="px-6 py-5">
        <TopBackButton className="border-[#EFEFF3] border " />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Delete Child's Account
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Permanently remove your child’s profile and all associated data.
        </Text>
        <View className="mt-8 border-b-4 bg-[#DE21211A] px-4 py-2 rounded-[16px] border-b-[#DE2121] border-r border-l border-[#DE21211A]">
          <Text className="text-[#221D23] font-sans leading-[1.5]">
            Before you delete your child’s account, please note that their
            login, profile, books, and active subscriptions will be permanently
            removed.{' '}
            <Text className="font-sansMedium">
              This action cannot be undone and no refunds will be issued.
            </Text>
          </Text>
        </View>

        <View className="border-[#D3D2D366] border px-3 py-4 mt-8 rounded-[12px]">
          <SimpleInput
            name="password"
            type="password"
            label="Enter your Password"
            value={password}
            handleChange={setPassword}
          />
          <Button
            text="DELETE ACCOUNT"
            onPress={() => {
              if (!password.trim()) {
                showToast('error', 'Please enter your password!');
                return;
              }
              setOpenDeletion(true);
            }}
            className="mt-4 bg-[#DE2121] border-0"
          />
        </View>
        <Text className="mt-8 font-sansMedium text-[#474348] text-[16px] text-center">
          Not ready to delete your child's account?
        </Text>
        <Pressable
          onPress={() => {
            router.push(`/guardian/LearningProgress?id=${id}`);
          }}
          className="border flex-row items-center gap-2 border-[#D3D2D366] p-4 rounded-[16px] mt-4"
        >
          <Text className="font-sansMedium text-[#221D23]">
            View Child’s Profile Instead
          </Text>
          <ICONS.ArrowUpRight />
        </Pressable>
      </View>
      <Modal
        isVisible={openDeletion}
        onBackButtonPress={() => setOpenDeletion(false)}
      >
        <View className="bg-[#FAFDFF] p-5  border-b-4 border-b-[#DE2121] rounded-[20px] items-center">
          <View className="w-20 h-20 rounded-full bg-[#DE21211A] items-center justify-center">
            <ICONS.Trash />
          </View>
          <Text className="text-center font-sansSemiBold text-[20px] mb-2 mt-6">
            Are You Sure You Want to Permanently Delete {name}’s Profile?
          </Text>
          <Text className="text-center text-[#474348] font-sans text-[16px] leading-[1.5]">
            This action will begin the process of deleting your child's account.
            Access to their account will be revoked immediately, and all
            associated data will be permanently removed.
          </Text>
          <Button
            onPress={() => {
              if (!password) {
                showToast('error', 'Enter your password');
                return;
              }
              setOpenDeletion(false);
              router.push(
                `/guardian/ChildAccountDeletionReason?password=${password}&id=${id}&name=${name}`,
              );
            }}
            className="w-full mt-6 bg-[#DE2121] border-none border-b-0"
            textClassname="text-white"
            text={'DELETE'}
          />
          <Button
            onPress={() => setOpenDeletion(false)}
            className="w-full mt-6 bg-white border-2 border-[#D3D2D3]"
            textClassname="text-[#221D23]"
            text={'CLOSE'}
          />
        </View>
      </Modal>
    </Container>
  );
};

export default AccountDeletion;
