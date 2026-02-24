import { updateKidProfile } from '@/actions/kid';
import { ICONS } from '@/assets/icons';
import Button from '@/components/Button';
import Container from '@/components/Container';
import { useKidAvatars } from '@/hooks/useKidAvatars';
import { useUser } from '@/hooks/useUser';
import { IAvatar } from '@/types';
import { HAPTIC } from '@/utils/haptic';
import { invalidateQueries } from '@/utils/query';
import { scaleWidth } from '@/utils/scale';
import { showToast } from '@/utils/toast';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { AvatarCard } from './AvatarSelection';

const AvatarSelection = () => {
  const { user } = useUser();
  const { data, isLoading } = useKidAvatars();
  const [selected, setSelected] = useState('');
  const [avatar, setAavatar] = useState<IAvatar>();
  const [isUploading, setIsUploading] = useState(false);

  const onSave = async () => {
    if (!selected || !avatar) {
      showToast('error', 'Please select an avatar to proceed!');
      return;
    }
    setIsUploading(true);
    try {
      await updateKidProfile(user?._id!, {
        picture: avatar?.url,
      });
      HAPTIC.success();
      invalidateQueries(['kid']);
      router.back()
    } catch (error) {
      HAPTIC.error();
      showToast('error', 'Please try again!');
      console.log(error);
    }
    setIsUploading(false);
  };
  return (
    <Container backgroundColor="white">
      <View
        style={{ paddingHorizontal: scaleWidth(24) }}
        className=" py-5 z-10 flex-1"
      >
        <Pressable
          style={{ width: scaleWidth(32), height: scaleWidth(32) }}
          className="w-8 h-8 rounded-full border-[#EFEFF3] bg-[#FFFFFF] border items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ICONS.ChevronLeft width={14} height={14} />
        </Pressable>
        <Text className="text-dark text-[24px] font-sansSemiBold ">
          Choose Your Avatar
        </Text>
        <View className="bg-[#3F9243] rounded-[16px] p-5 mt-5 flex-1">
          <FlatList
            data={data}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <AvatarCard
                item={item}
                isSelected={selected === item.id}
                onSelect={() => {
                  setSelected(item.id);
                  setAavatar(item);
                }}
              />
            )}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{
              gap: scaleWidth(12),
              columnGap: 12,
              rowGap: 20,
            }}
          />
        </View>

        <Button
          loading={isUploading}
          disabled={isUploading}
          onPress={onSave}
          text="SAVE"
          className="mt-10"
        />
        <Button
          onPress={() => router.back()}
          text="CANCEL"
          className="bg-white border-2 border-[#D3D2D3] mt-4"
          textClassname="text-[#221D23]"
        />
      </View>
    </Container>
  );
};

export default AvatarSelection;
