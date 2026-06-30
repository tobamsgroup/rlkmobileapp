import { updateReadingSettings } from '@/actions/kid';
import Button from '@/components/Button';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import { getData, storeData } from '@/lib/storage';
import { HAPTIC } from '@/utils/haptic';
import { showToast } from '@/utils/toast';
import { AudioPlayer, createAudioPlayer } from 'expo-audio';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { AccentCard, ACCENTS } from './AccentSelection';

// Maps accent display name → API country code
const ACCENT_CODE: Record<string, string> = {
  British: 'uk',
  American: 'us',
  Australian: 'au',
  Indian: 'in',
};

// Maps stored voiceStyle → API voice-type prefix
const VOICE_STYLE_KEY: Record<string, string> = {
  'kid Male': 'young-male',
  'kid Female': 'young-female',
  'adult Male': 'adult-male',
  'adult Female': 'adult-female',
};

const AccentSettings = () => {
  const [selectedAccent, setSelectedAccent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState('');
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    getData<string>('kid_accent').then((saved) => {
      if (saved) setSelectedAccent(saved);
    });

    return () => {
      playerRef.current?.pause();
      playerRef.current?.remove();
    };
  }, []);

  const handlePlaySound = (soundFile: any, name: string) => {
    if (isPlaying === name) {
      playerRef?.current?.pause();
      playerRef?.current?.remove();
      setIsPlaying('');
      return;
    }
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.remove();
    }
    playerRef.current = createAudioPlayer(soundFile);
    playerRef.current.play();
    setIsPlaying(name);
  };

  const handleSave = async () => {
    if (!selectedAccent || isSaving) return;
    setIsSaving(true);
    try {
      await storeData('kid_accent', selectedAccent);

      const accentCode = ACCENT_CODE[selectedAccent] ?? 'us';

      // Use already-saved voice style if present, else default to adult-female
      const savedVoiceStyle = await getData<string>('kid_voice_style');
      const voiceTypeKey = savedVoiceStyle
        ? (VOICE_STYLE_KEY[savedVoiceStyle] ?? 'adult-female')
        : 'adult-female';

      await updateReadingSettings(`${voiceTypeKey}-${accentCode}`);
      HAPTIC.success();
      showToast('success', 'Accent saved successfully!');
    } catch {
      HAPTIC.error();
      showToast('error', 'Failed to save accent. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
              isPlaying={isPlaying}
              isSelected={a.name === selectedAccent}
              key={a.name}
              accent={a}
              onPress={() => setSelectedAccent(a.name)}
              onPlaySound={() => handlePlaySound(a.sound, a.name)}
            />
          ))}
        </View>
        <Button
          onPress={handleSave}
          disabled={!selectedAccent}
          text={isSaving ? 'SAVING...' : 'SAVE MY SETTINGS'}
        />
      </View>
    </Container>
  );
};

export default AccentSettings;
