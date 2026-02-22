import Button from '@/components/Button';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AccentCard, VOICES } from './AccentSelection';

const VoiceStyleSettings = () => {
  const [voiceStyle, setVoiceStyle] = useState('');

  return (
    <Container scrollable>
      <View className="p-6 flex-1">
        <TopBackButton />
        <Text className="text-[24px] font-sansSemiBold text-[#212121] mt-3">
          Choose Your Voice Style
        </Text>
        <Text className="text-[16px] text-[#6C686C] font-sans leading-[1.5] mt-2">
          Now pick the voice style you’d like to hear during lessons and
          activities
        </Text>

        <View className="p-4 bg-[#F1F9F1] rounded-[16px] mt-6 mb-9">
          <Text className="text-[16px] font-sansMedium text-dark mb-4">
            AI Child
          </Text>
          {VOICES?.slice(0, 2).map((a) => (
            <AccentCard
              isSelected={'kid ' + a.name === voiceStyle}
              key={a.name}
              accent={a}
              onPress={() => setVoiceStyle('kid ' + a.name)}
            />
          ))}
          <View className="border border-[#D3D2D366] mb-4 mt-1" />
          <Text className="text-[16px] font-sansMedium text-dark mb-4">
            Adult Mentor
          </Text>
          {VOICES?.slice(2, 5).map((a) => (
            <AccentCard
              isSelected={'adult ' + a.name === voiceStyle}
              key={a.name}
              accent={a}
              onPress={() => setVoiceStyle('adult ' + a.name)}
            />
          ))}
        </View>
        <Button text="SAVE MY SETTINGS" />
      </View>
    </Container>
  );
};

export default VoiceStyleSettings;
