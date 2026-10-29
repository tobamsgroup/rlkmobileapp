import { updateGuardianProfile } from '@/actions/more';
import { IMAGES } from '@/assets/images';
import Button from '@/components/Button';
import { SimpleInput } from '@/components/Input';
import { useAppDispatch } from '@/hooks/redux';
import { getData, storeData } from '@/lib/storage';
import { login } from '@/redux/authSlice';
import { GuardianLoginSession } from '@/types';
import { HAPTIC } from '@/utils/haptic';
import { invalidateQueries } from '@/utils/query';
import { scaleWidth } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import Feather from '@expo/vector-icons/Feather';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Modal from 'react-native-modal';

// "RLKids" in the brand colours
const BRAND_LETTERS: [string, string][] = [
  ['R', '#0B4F9C'],
  ['L', '#0B4F9C'],
  ['K', '#F5C800'],
  ['i', '#3F9243'],
  ['d', '#3F9243'],
  ['s', '#3F9243'],
];

/**
 * Sign-up only asks for an email, so a guardian without a name is asked for
 * one the first time they reach the dashboard. Can't be dismissed.
 */
const NameCollectionModal = ({ open }: { open: boolean }) => {
  const dispatch = useAppDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState({ firstName: '', lastName: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (loading) return;
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last) {
      setError({
        firstName: first ? '' : 'First Name cannot be empty',
        lastName: last ? '' : 'Last Name cannot be empty',
      });
      HAPTIC.error();
      return;
    }
    setError({ firstName: '', lastName: '' });

    const payload = new FormData();
    payload.append('firstName', first);
    payload.append('lastName', last);

    setLoading(true);
    try {
      await updateGuardianProfile(payload);
      // Keep the saved session in step with the profile
      const session = await getData<GuardianLoginSession>('user');
      if (session) {
        const updated = { ...session, firstName: first, lastName: last };
        await storeData('user', updated);
        dispatch(login(updated));
      }
      invalidateQueries('guardian');
      invalidateQueries('profile');
      HAPTIC.success();
    } catch {
      showToast('error', 'Could not save your name. Please try again.');
      HAPTIC.error();
    }
    setLoading(false);
  };

  return (
    <Modal
      isVisible={open}
      avoidKeyboard
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="fadeOut"
    >
      <View className="bg-[#FAFDFF] rounded-[24px] px-6 pt-6 pb-8 border-b-4 border-b-[#F5D90A]">
        <Image
          source={IMAGES.WelcomeBookMascot}
          resizeMode="contain"
          style={{ width: scaleWidth(150), height: scaleWidth(134) }}
        />
        <Text className="text-[26px] font-sansSemiBold text-[#221D23] mt-6">
          Welcome to{' '}
          {BRAND_LETTERS.map(([letter, color], i) => (
            <Text key={i} style={{ color }}>
              {letter}
            </Text>
          ))}
        </Text>
        <Text className="text-[16px] leading-[1.6] font-sans text-[#474348] mt-3">
          Your account is ready. Let’s personalise your dashboard before you
          continue.
        </Text>

        <SimpleInput
          wrapperClassName="mt-6"
          name="firstName"
          label="First Name"
          value={firstName}
          handleChange={setFirstName}
          error={error.firstName}
        />
        <SimpleInput
          wrapperClassName="mt-5"
          name="lastName"
          label="Last Name"
          value={lastName}
          handleChange={setLastName}
          error={error.lastName}
        />

        <Button
          className="mt-8 gap-2"
          haptic
          loading={loading}
          onPress={onSubmit}
        >
          <Text className="text-[16px] text-white font-sansMedium">
            CONTINUE
          </Text>
          <Feather name="arrow-right" size={20} color="#FFFFFF" />
        </Button>
      </View>
    </Modal>
  );
};

export default NameCollectionModal;
