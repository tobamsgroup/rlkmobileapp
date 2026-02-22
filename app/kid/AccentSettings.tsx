import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AccentCard, ACCENTS } from './AccentSelection';
import Button from '@/components/Button';

const AccentSettings = () => {
  const [selectedAccent, setSelectedAccent] = useState('');
  return (
    <Container scrollable>
      <View className="p-6 flex-1">
        <TopBackButton />
        <Text className="text-[24px] mt-5 font-sansSemiBold text-[#212121]">
          Choose Your Accent
        </Text>
        <Text className="text-[16px] text-[#6C686C] font-sans leading-[1.5] mt-2">
          Select the accent you like best. Tap ▶️ to hear how it sounds
        </Text>
        <View className="p-4 bg-[#F1F9F1] rounded-[16px] mt-6 mb-9">
          {ACCENTS?.map((a) => (
            <AccentCard
              isSelected={a.name === selectedAccent}
              key={a.name}
              accent={a}
              onPress={() => setSelectedAccent(a.name)}
            />
          ))}
        </View>
        <Button  text="SAVE MY SETTINGS" />
      </View>
    </Container>
  );
};

export default AccentSettings;
