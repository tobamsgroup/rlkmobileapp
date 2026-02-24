import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import Container from '@/components/Container';
import TopBackButton from '@/components/TopBackButton';
import { scaleWidth } from '@/utils/scale';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Tts from 'react-native-tts';

/* ---------------- ACCENT → LANGUAGE MAP ---------------- */

const ACCENT_LANGUAGE_MAP: Record<string, string> = {
  British: 'en-GB',
  American: 'en-US',
  Australian: 'en-AU',
  Nigerian: 'en-NG',
  'South African': 'en-ZA',
  Indian: 'en-IN',
};

const getDummyText = (accent: string) =>
  `Hello! This is a sample ${accent} voice for your learning journey.`;

/* ---------------- MAIN COMPONENT ---------------- */

const AccentSelection = () => {
  const [step, setStep] = useState(1);
  const [selectedAccent, setSelectedAccent] = useState('');
  const [voiceStyle, setVoiceStyle] = useState('');
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);

  /* -------- Load device voices -------- */
  useEffect(() => {
    // iOS-safe version
    try {
      Tts.setDefaultRate(0.5, true); // <-- pass `true` as 2nd param on iOS
      Tts.setDefaultPitch(1.0);
    } catch (e) {
      console.log('TTS setup error', e);
    }

    // Load voices
    Tts.voices().then((voices) => {
      const filtered = voices.filter((v) => !v.networkConnectionRequired);
      setAvailableVoices(filtered);
    });
  }, []);

  /* -------- Preview Speaker -------- */

  const speakPreview = (accentName: string, style?: string) => {
    Tts.speak('Hello, world my name is mht!', {
      iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
      rate: 0.5,
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.5,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
  })
    // Tts.speak(getDummyText(accentName));
  };

  return (
    <Container scrollable>
      <View className="px-6 py-10">
        {step === 1 && (
          <>
            <View className="bg-[#265828] rounded-[16px] px-6 pt-[68px] pb-[148px] mb-10 relative overflow-hidden">
              <Image
                alt="overlay"
                style={{ height: 431 }}
                className="absolute top-[-50px] left-[0px] w-full"
                source={IMAGES.RectangleOverlay}
              />
              <Text className="text-[28px] text-white font-sansSemiBold leading-[1.3]">
                Pick Your Learning {'\n'}Voice!
              </Text>

              <View className="mt-[102px]">
                <Pressable className="flex-row gap-2 items-center bg-[#3C693E] px-3 py-2.5 rounded-[19px]">
                  <View className="w-12 h-12 rounded-full bg-[#C3E4C5] items-center justify-center">
                    <ICONS.Web />
                  </View>
                  <View>
                    <Text className="text-[#C3E4C5] font-sans text-[16px]">
                      Step 1
                    </Text>
                    <Text className="text-[16px] font-sansMedium text-white">
                      Accent Selection
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
            <Button onPress={() => setStep(2)} text="CONTINUE" />
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-[24px] font-sansSemiBold text-[#212121]">
              Choose Your Accent
            </Text>
            <Text className="text-[16px] text-[#6C686C] font-sans leading-[1.5] mt-2">
              Pick the accent you understand and enjoy the most. Tap the play
              button to hear a preview
            </Text>
            <View className="p-4 bg-[#F1F9F1] rounded-[16px] mt-6 mb-9">
              {ACCENTS.map((a) => (
                <AccentCard
                  key={a.name}
                  isSelected={a.name === selectedAccent}
                  accent={a}
                  onPress={() => {
                    setSelectedAccent(a.name);
                    speakPreview(a.name);
                  }}
                />
              ))}
            </View>

            <Button onPress={() => setStep(3)} text="PROCEED TO VOICE TYPE" />
          </>
        )}

        {step === 3 && (
          <>
            <TopBackButton onPress={() => setStep(2)} />

            <Text className="text-[24px] font-sansSemiBold text-[#212121] mt-3">
              Choose Your Voice Style
            </Text>
            <Text className="text-[16px] text-[#6C686C] font-sans leading-[1.5] mt-2">
              Now choose the voice style you want for your learning journey
            </Text>

            <View className="p-4 bg-[#F1F9F1] rounded-[16px] mt-6 mb-9">
              <Text className="text-[16px] font-sansMedium mb-4">AI Child</Text>

              {VOICES.slice(0, 2).map((a) => (
                <AccentCard
                  key={'kid' + a.name}
                  isSelected={'kid ' + a.name === voiceStyle}
                  accent={a}
                  onPress={() => {
                    const style = 'kid ' + a.name;
                    setVoiceStyle(style);
                    speakPreview(selectedAccent, style);
                  }}
                />
              ))}

              <View className="border border-[#D3D2D366] mb-4 mt-1" />

              <Text className="text-[16px] font-sansMedium mb-4">
                Adult Mentor
              </Text>

              {VOICES.slice(2).map((a) => (
                <AccentCard
                  key={'adult' + a.name}
                  isSelected={'adult ' + a.name === voiceStyle}
                  accent={a}
                  onPress={() => {
                    const style = 'adult ' + a.name;
                    setVoiceStyle(style);
                    speakPreview(selectedAccent, style);
                  }}
                />
              ))}
            </View>

            <Button text="SAVE MY CHOICE" />
          </>
        )}

        <Button
          onPress={() => router.push('/(tabs)/home-kid')}
          text="SKIP"
          textClassname="text-[#3F9243] underline"
          className="bg-transparent border-0"
        />
      </View>
    </Container>
  );
};

/* ---------------- Accent Card ---------------- */

export const AccentCard = ({
  isSelected,
  accent,
  onPress,
}: {
  isSelected: boolean;
  accent: { image: any; name: string };
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={twMerge(
        'bg-white rounded-[12px] p-4 mb-3',
        isSelected && 'bg-[#193A1B]',
      )}
    >
      <Image
        style={{ width: scaleWidth(32), height: scaleWidth(32) }}
        source={accent.image}
        className="rounded-full"
      />

      <View className="flex-row justify-between items-center mt-5">
        <Text
          className={twMerge(
            'text-[16px] font-sansMedium',
            isSelected && 'text-white',
          )}
        >
          {accent.name}
        </Text>

        <View
          className={twMerge(
            'bg-[#193A1B] w-10 h-10 items-center justify-center rounded-[12px]',
            isSelected && 'bg-[#6ABC6D]',
          )}
        >
          <ICONS.Play />
        </View>
      </View>
    </Pressable>
  );
};

/* ---------------- DATA ---------------- */

export const ACCENTS = [
  { image: IMAGES.FlagGB, name: 'British' },
  { image: IMAGES.FlagUSA, name: 'American' },
  { image: IMAGES.FlagAU, name: 'Australian' },
  { image: IMAGES.FlagNG, name: 'Nigerian' },
  { image: IMAGES.FlagSA, name: 'South African' },
  { image: IMAGES.FlagIND, name: 'Indian' },
];

export const VOICES = [
  { image: IMAGES.AccentKidMale, name: 'Male' },
  { image: IMAGES.AccentKidFemale, name: 'Female' },
  { image: IMAGES.AccentAdultMale, name: 'Male' },
  { image: IMAGES.AccentAdultFemale, name: 'Female' },
  { image: IMAGES.AccentAdultMale, name: 'Cartoon Style' },
];

export default AccentSelection;
