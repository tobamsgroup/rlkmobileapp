import Button from '@/components/Button';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const Settings = () => {
  return (
    <Container>
      <View className="p-6 flex-1">
        <TopBackButton />
        <Text className="text-dark font-sansSemiBold text-[20px] mt-4">
          Settings
        </Text>
        <View className="bg-white rounded-[20px] p-8 mt-6 flex-1">
          <Button
            onPress={() => router.push('/kid/AccentSelection')}
            className="border-[#C3E4C5] bg-white border mb-5"
            textClassname="text-dark text-[16px]"
            text="Accent Settings"
          />
          <Button
            onPress={() => router.push('/kid/VoiceStyleSettings')}
            className="border-[#C3E4C5] bg-white border mb-5"
            textClassname="text-dark text-[16px]"
            text="Voice Style Settings"
          />
          <Button
            onPress={() => router.push('/kid/ReadingSettings')}
            className="border-[#C3E4C5] bg-white border"
            textClassname="text-dark text-[16px]"
            text="Reading Settings"
          />
        </View>
      </View>
    </Container>
  );
};

export default Settings;
