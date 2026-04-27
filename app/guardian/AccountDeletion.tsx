import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Input, { SimpleInput } from '@/components/Input';
import TopBackButton from '@/components/TopBackButton';
import { scheduleAccountDeletion } from '@/actions';
import { handleLogout } from '@/actions/logout';
import { useAppDispatch } from '@/hooks/redux';
import { showToast } from '@/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Modal from 'react-native-modal';

const AccountDeletion = () => {
  const dispatch = useAppDispatch();
  const [openDeletion, setOpenDeletion] = useState(false);
  const [password, setPassword] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => scheduleAccountDeletion(password),
    onSuccess: () => {
      setOpenDeletion(false);
      router.push('/guardian/AccountDeletionReason');
    },
    onError: (err: any) => {
      setOpenDeletion(false);
      showToast(
        'error',
        err?.response?.data?.message ?? 'Something went wrong',
      );
    },
  });

  return (
    <Container backgroundColor="white" scrollable>
      <View className="px-6 py-5">
        <TopBackButton className="border-[#EFEFF3] border " />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Delete Account
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Permanently remove your account and all associated data.
        </Text>
        <View className="mt-8 border-b-4 bg-[#DE21211A] px-4 py-2 rounded-[16px] border-b-[#DE2121] border-r border-l border-[#DE21211A]">
          <Text className="text-[#221D23] font-sans ">
            Before you delete your account, please note that your login,
            profile, preferences, all children's data, and subscriptions will be{' '}
            <Text className="font-sansMedium">
              permanently removed with no refunds.
            </Text>
          </Text>
        </View>

        <View className="border-[#D3D2D366] border px-3 py-4 mt-8 rounded-[12px]">
          <SimpleInput
            name="password"
            type="password"
            label="Password"
            value={password}
            handleChange={setPassword}
          />
          <Button
            text="DELETE ACCOUNT"
            onPress={() => {
              if (!password.trim()) return;
              setOpenDeletion(true);
            }}
            className="mt-4 bg-[#DE2121] border-0"
          />
        </View>
        <Text className="mt-8 font-sansMedium text-[#474348]">
          Not ready to delete your account?
        </Text>
        <Pressable
          onPress={() => {
            handleLogout(dispatch);
            router.replace('/auth/Login');
          }}
          className="border flex-row items-center gap-2 border-[#D3D2D366] p-4 rounded-[16px] mt-4"
        >
          <Text className="font-sansMedium text-[#221D23]">
            Log Out Instead
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
            Are you sure you want to permanently delete your Account?
          </Text>
          <Text className="text-center text-[#474348] font-sans text-[16px] leading-[1.5]">
            This action will start your account deletion process. You will have
            3 days to restore your account, after which all your data will be
            permanently removed.
          </Text>
          <Button
            onPress={() => mutate()}
            disabled={isPending}
            className="w-full mt-6 bg-[#DE2121] border-none border-b-0"
            textClassname="text-white"
            text={isPending ? 'DELETING...' : 'DELETE'}
            loading={isPending}
          />
          <Button
            onPress={() => setOpenDeletion(false)}
            disabled={isPending}
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
