import { loginKidAsGuardian } from '@/actions/learners';
import { IMAGES } from '@/assets/images';
import { useAppDispatch } from '@/hooks/redux';
import { storeData } from '@/lib/storage';
import { login } from '@/redux/authSlice';
import { ensureHttps, GroupedByKid } from '@/utils';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import Button from '../Button';
import Skeleton from '../Skeleton';

const LearnerCard = (props: GroupedByKid) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSwitchSession = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const kidData = await loginKidAsGuardian(props?.kid?._id);
      await storeData('user', kidData);
      dispatch(login(kidData));
      showToast('success', 'Login Successful!');
      router.replace('/(tabs)/home-kid');
    } catch (error: any) {
      console.error('Switch session error:', error);
      showToast('error', 'Login Failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="bg-[#FAFDFF] rounded-[20px] p-4 items-center mb-4">
      <Image
        style={{ width: scaleWidth(81), height: scaleWidth(81) }}
        source={
          props?.kid?.picture
            ? { uri: ensureHttps(props?.kid?.picture) }
            : IMAGES.KidProfilePlaceholder
        }
        className={twMerge(
          'mb-2 border-[#FFD700] rounded-full',
          props?.kid?.picture && 'border-[1.4px] ',
        )}
      />
      <Text className="text-[#193A1B] font-sansMedium text-[16px] mb-5">
        {props?.kid?.name}
      </Text>
      <View className="bg-white rounded-full px-3 py-2 mb-5 mt-3 border border-[#DBEFDC]">
        <Text className="font-sans text-[#474348]">
          {props?.courses?.length > 0
            ? `${props.courses.length} Track${props.courses.length !== 1 ? 's' : ''}`
            : '0 Track'}
        </Text>
      </View>
      <Button
        onPress={() =>
          router.push(`/guardian/LearningProgress?id=${props?.kid?._id}`)
        }
        className="w-full"
        text="VIEW PROGRESS"
      />
      <Button
        loading={loading}
        className="bg-[#DBEFDC] border-b-0 mt-2 w-full uppercase"
        textClassname="text-[#337535] uppercase"
        text={`LOGIN AS ${props?.kid?.name?.split(' ')[0]}`}
        onPress={handleSwitchSession}
      />
    </View>
  );
};
export const LearnerCardSkeleton = () => {
  return (
    <View className="bg-[#FAFDFF] rounded-[20px] p-4 items-center mb-4 mt-10">
      <Skeleton
        style={{ width: scaleWidth(81), height: scaleWidth(81) }}
        className=" rounded-full mb-5"
      />
      <Skeleton className="w-2/3 rounded-full mb-5" />
      <Skeleton className="w-full h-[48px] rounded-full mb-2" />
      <Skeleton className="w-full h-[48px] rounded-full " />
    </View>
  );
};

export const NoLearnersFound = () => {
  return (
    <View className="flex items-center mt-10">
      <Image
        style={{
          height: scaleHeight(70),
          width: scaleWidth(100),
        }}
        source={IMAGES.SearchGlassCartoon}
        className="mb-6"
      />
      <Text className="text-[18px] text-[#265828] font-sansSemiBold mb-4">
        No Learner Found
      </Text>
      <Text className="text-center leading-[1.5] font-sans text-[#474348]">
        We couldn’t find any learner with that {'\n'}name.{'\n'}Please check the
        spelling or try {'\n'}searching for another learner
      </Text>
    </View>
  );
};
export default LearnerCard;
