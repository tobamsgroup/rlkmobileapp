import Button from '@/components/Button';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const Settings = () => {
  return (
    <Container>
      <View className="px-6 py-5 flex-1">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] my-4">
          Settings
        </Text>
        <View className="bg-white rounded-[20px] p-8 mt-6 flex-1">
          <Button
            onPress={() => router.push('/guardian/Subscription')}
            className="border-[#C3E4C5] bg-white border mb-5"
            textClassname="text-dark text-[16px]"
            text="Subscription"
          />
          <Button
            onPress={() => router.push('/guardian/ChangePassword')}
            className="border-[#C3E4C5] bg-white border mb-5"
            textClassname="text-dark text-[16px]"
            text="Password"
          />
          <Button
            // onPress={() => router.push('/kid/AccentSettings')}
            className="border-[#C3E4C5] bg-white border mb-5"
            textClassname="text-dark text-[16px]"
            text="Notifications"
          />
          <Button
            // onPress={() => router.push('/kid/VoiceStyleSettings')}
            className="border-[#C3E4C5] bg-white border mb-5"
            textClassname="text-dark text-[16px]"
            text="Help & Support"
          />
          <Button
            onPress={() => router.push('/guardian/AccountDeletion')}
            className="border-[#C3E4C5] bg-white border-none border-b-0"
            textClassname="text-[#DE2121] text-[16px]"
            text="Delete Account"
          />

        </View>
      </View>
    </Container>
  );
};

export default Settings;
