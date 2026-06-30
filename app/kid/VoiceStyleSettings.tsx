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
import { AccentCard, VOICES } from './AccentSelection';

// Maps accent display name → API country code
const ACCENT_CODE: Record<string, string> = {
  British: 'uk',
  American: 'us',
  Australian: 'au',
  Indian: 'in',
};

// Full matrix: voiceKey × accent → local sound file
const VOICE_SOUND_MAP: Record<string, Record<string, any>> = {
  'young-male': {
    American: require('../../assets/sounds/young-male-us.mp3'),
    British: require('../../assets/sounds/young-male-uk.mp3'),
    Australian: require('../../assets/sounds/young-male-au.mp3'),
    Indian: require('../../assets/sounds/young-male-in.mp3'),
  },
  'young-female': {
    American: require('../../assets/sounds/young-female-us.mp3'),
    British: require('../../assets/sounds/young-female-uk.mp3'),
    Australian: require('../../assets/sounds/young-female-au.mp3'),
    Indian: require('../../assets/sounds/young-female-in.mp3'),
  },
  'adult-male': {
    American: require('../../assets/sounds/adult-male-us.mp3'),
    British: require('../../assets/sounds/adult-male-uk.mp3'),
    Australian: require('../../assets/sounds/adult-male-au.mp3'),
    Indian: require('../../assets/sounds/adult-male-in.mp3'),
  },
  'adult-female': {
    American: require('../../assets/sounds/adult-us-female.mp3'),
    British: require('../../assets/sounds/adult-female-uk.mp3'),
    Australian: require('../../assets/sounds/adult-female-au.mp3'),
    Indian: require('../../assets/sounds/adult-female-in.mp3'),
  },
};

// Maps voiceStyle label (stored in AsyncStorage) → voiceKey for the selection state
const VOICE_STYLE_LABEL: Record<string, string> = {
  'kid Male': 'young-male',
  'kid Female': 'young-female',
  'adult Male': 'adult-male',
  'adult Female': 'adult-female',
};

const VoiceStyleSettings = () => {
  const [voiceStyle, setVoiceStyle] = useState('');
  const [selectedAccent, setSelectedAccent] = useState('American');
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState('');
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    getData<string>('kid_accent').then((saved) => {
      if (saved) setSelectedAccent(saved);
    });
    getData<string>('kid_voice_style').then((saved) => {
      if (saved) setVoiceStyle(saved);
    });

    return () => {
      playerRef.current?.pause();
      playerRef.current?.remove();
    };
  }, []);

  const handlePlaySound = (voiceKey: string, name:string) => {
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
    const soundFile =
      VOICE_SOUND_MAP[voiceKey]?.[selectedAccent] ??
      VOICE_SOUND_MAP[voiceKey]?.['American'];
    if (!soundFile) return;
    playerRef.current = createAudioPlayer(soundFile);
    playerRef.current.play();
    setIsPlaying(name);
  };

  const handleSave = async () => {
    if (!voiceStyle || isSaving) return;
    setIsSaving(true);
    try {
      await storeData('kid_voice_style', voiceStyle);

      const voiceKey = VOICE_STYLE_LABEL[voiceStyle] ?? 'adult-female';
      // Use saved accent if available, otherwise default to us
      const accentCode = ACCENT_CODE[selectedAccent] ?? 'us';

      await updateReadingSettings(`${voiceKey}-${accentCode}`);
      HAPTIC.success();
      showToast('success', 'Voice style saved successfully!');
    } catch {
      HAPTIC.error();
      showToast('error', 'Failed to save voice style. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };



  return (
    <Container scrollable>
      <View className="p-6 flex-1">
        <TopBackButton />
        <Text className="text-[24px] font-sansSemiBold text-[#212121] mt-3">
          Choose Your Voice Style
        </Text>
        <Text className="text-[16px] text-[#6C686C] font-sans leading-[1.5] mt-2">
          Now pick the voice style you'd like to hear during lessons and
          activities
        </Text>

        <View className="p-4 bg-[#F1F9F1] rounded-[16px] mt-6 mb-9">
          <Text className="text-[16px] font-sansMedium text-dark mb-4">
            AI Child
          </Text>
          {VOICES?.slice(0, 2).map((a) => (
            <AccentCard
              isSelected={'kid ' + a.name === voiceStyle}
              key={'kid-' + a.name}
              accent={a}
              onPress={() => setVoiceStyle('kid ' + a.name)}
              onPlaySound={() => handlePlaySound(a.voiceKey!, a.name)}
              isPlaying={isPlaying}
            />
          ))}
          <View className="border border-[#D3D2D366] mb-4 mt-1" />
          <Text className="text-[16px] font-sansMedium text-dark mb-4">
            Adult Mentor
          </Text>
          {VOICES?.slice(2, 4).map((a) => (
            <AccentCard
              isSelected={'adult ' + a.name === voiceStyle}
              key={'adult-' + a.name}
              accent={a}
              onPress={() => setVoiceStyle('adult ' + a.name)}
              onPlaySound={() => handlePlaySound(a.voiceKey!, a.name)}
              isPlaying={isPlaying}
            />
          ))}
        </View>
        <Button
        disabled={!voiceStyle}
          onPress={handleSave}
          text={isSaving ? 'SAVING...' : 'SAVE MY SETTINGS'}
        />
      </View>
    </Container>
  );
};

export default VoiceStyleSettings;
