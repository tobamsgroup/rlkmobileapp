import { loginGuardianAsKid } from '@/actions/kid';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Container from '@/components/Container';
import { SimpleInput } from '@/components/Input';
import TopBackButton from '@/components/TopBackButton';
import { useAppDispatch } from '@/hooks/redux';
import useKidProfile from '@/hooks/useKidProfile';
import { storeData } from '@/lib/storage';
import { login } from '@/redux/authSlice';
import { HAPTIC } from '@/utils/haptic';
import { scaleHeight } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ParentAccess = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { data } = useKidProfile();

  const dispatch = useAppDispatch();
  const loginGuardian = async () => {
    if(loading) return
    if (!password) {
      showToast('error', 'Please enter password');
      HAPTIC.error();

      return;
    }
    setLoading(true);
    try {
      const resp = await loginGuardianAsKid(data?._id!, password);
      await storeData('user', resp);
      showToast('success', 'Login Successful!');
      dispatch(login(resp));
      router.push('/(tabs)');
      HAPTIC.success();
    } catch (error: any) {
      HAPTIC.error();
      if (error?.response?.data?.statusCode === 401) {
        showToast('error', 'Incorrect Password!');
      } else {
        showToast('error', 'Please try again!');
      }
    }
    setLoading(false);
  };
  return (
    <Container backgroundColor="#FAFDFF">
      <View className="px-5 py-6">
        <TopBackButton />
        <Text className="text-[#337535] text-center text-[24px] font-sansSemiBold mb-2 mt-8">
          Parent Access Required
        </Text>
        <Text className="text-dark text-[16px] font-sans text-center leading-[1.5]">
          For security reasons, please enter your{'\n'} password to return to
          your{'\n'}
          dashboard.
        </Text>

        <View
          style={{ height: scaleHeight(314) }}
          className="relative w-full  p-1 mt-6"
        >
          <LinearGradient
            colors={['#004D99', '#FFD700', '#3F9243']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 0,
              borderRadius: 20,
            }}
          />
          <View
            style={{ borderRadius: 17 }}
            className="bg-white h-full w-full px-4 py-6"
          >
            <SimpleInput
              label="Password"
              placeholder="********"
              type="password"
              name="password"
              value={password}
              handleChange={setPassword}
            />
            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row gap-2 items-center">
                <Checkbox />
                <Text className=" text-dark font-sans">Remember Me</Text>
              </View>
              <Text className="text-[12px] text-[#004D99] font-sansMedium">
                FORGOT PASSWORD?
              </Text>
            </View>
            <Button
              loading={loading}
              onPress={loginGuardian}
              className="mt-8"
              text="Continue"
            />
            <View className="w-full border border-[#DBEFDC] mt-5" />
            <View className="bg-[#1671D91A] px-4 py-2 rounded-[8px] mt-6">
              <Text className="font-sans text-[#1671D9] text-center">
                Need help?{' '}
                <Text className="text-[#004D99]">Contact support</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default ParentAccess;
