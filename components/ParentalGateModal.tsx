import { verifyParentPassword } from '@/actions';
import { IMAGES } from '@/assets/images';
import { LinearButton, SecondaryButton } from '@/components/Button';
import { SimpleInput } from '@/components/Input';
import { useAppSelector } from '@/hooks/redux';
import { HAPTIC } from '@/utils/haptic';
import { scaleWidth } from '@/utils/scale';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  open: boolean;
  onSuccess: () => void;
  onClose: () => void;
};

const makeChallenge = () => {
  const a = 6 + Math.floor(Math.random() * 4);
  const b = 3 + Math.floor(Math.random() * 6);
  return { question: `${a} × ${b}`, answer: String(a * b) };
};

// Apple Kids Category (Guideline 1.3) parental gate. Shown before any
// external link, web view or purchase. Signed-in users must enter the
// parent account password; signed-out users (e.g. on Sign Up) get an
// adult-level arithmetic challenge since there is no password to verify.
const ParentalGateModal: FC<Props> = ({ open, onSuccess, onClose }) => {
  const user = useAppSelector((state) => state.auth.user) as any;
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const challenge = useMemo(makeChallenge, [open]);
  const usePassword = !!user;

  useEffect(() => {
    if (!open) {
      setValue('');
      setError('');
      setLoading(false);
    }
  }, [open]);

  const handleContinue = async () => {
    if (loading) return;
    if (!value) {
      setError(usePassword ? 'Please enter password' : 'Please enter answer');
      HAPTIC.error();
      return;
    }
    setError('');

    if (!usePassword) {
      if (value.trim() !== challenge.answer) {
        setError('Incorrect answer');
        HAPTIC.error();
        return;
      }
      HAPTIC.success();
      onSuccess();
      return;
    }

    setLoading(true);
    try {
      await verifyParentPassword(value);
      HAPTIC.success();
      onSuccess();
    } catch (err: any) {
      HAPTIC.error();
      if (err?.response?.status === 401 || err?.response?.status === 400) {
        setError('Incorrect Password!');
      } else {
        setError('Please try again!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isVisible={open}
      onBackButtonPress={onClose}
      avoidKeyboard
      useNativeDriverForBackdrop
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="bg-[#DBEFDC] border-2 border-[#6CBF70] rounded-[32px] p-4">
          <View className="bg-white rounded-[24px] px-5 py-6 items-center">
            <Image
              source={IMAGES.ParentalControlLockIcon}
              style={{ width: scaleWidth(96), height: scaleWidth(96) }}
              resizeMode="contain"
            />
            <Text className="text-[#337535] text-center text-[20px] font-sansBold mt-5 mb-3">
              Parent Permission Required
            </Text>
            <Text className="text-dark text-[15px] font-sans text-center leading-[1.5] mb-5">
              {usePassword
                ? 'For security reasons, please enter the parent account password to continue.'
                : `Ask a parent to answer this question to continue.\n\nWhat is ${challenge.question}?`}
            </Text>
            <SimpleInput
              label={usePassword ? 'Password' : 'Answer'}
              placeholder={usePassword ? '********' : 'Enter answer'}
              type={usePassword ? 'password' : 'number'}
              name="parentalGate"
              value={value}
              handleChange={(text) => {
                setValue(text);
                if (error) setError('');
              }}
              error={error}
            />
          </View>
          <LinearButton
            className="mt-5"
            loading={loading}
            onPress={handleContinue}
            text="CONTINUE"
            textClassname="font-sansBold"
          />
          <SecondaryButton
            className="mt-4"
            onPress={onClose}
            text="BACK"
            textClassname="font-sansBold"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ParentalGateModal;
