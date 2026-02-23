import { ICONS } from '@/assets/icons';
import { IMAGES } from '@/assets/images';
import { scaleHeight, scaleWidth } from '@/utils/scale';
import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Button from '../Button';

const ReadMode = () => {
  const [openHelper, setOpenHelper] = useState(true);
  const [helper, setHelper] = useState('');
  return (
    <View className="relative z-10">
      <View className="bg-white px-6 py-8 rounded-[12px]">
        <Text className="text-[20px] font-sansSemiBold">
          Welcome to the Adventure!
        </Text>
        <Image
          style={{
            width: scaleWidth(295),
            height: scaleHeight(204),
          }}
          source={IMAGES.AccentAdultFemale}
          className="my-6"
        />
        <Text className="font-sans leading-[1.5] text-dark text-[16px]">
          Hey there, future Eco Explorer! Are you ready to start an amazing
          journey to discover the  wonders of our planet? Imagine you’re about
          to go on the most exciting treasure hunt  ever—but instead of
          searching for gold or jewels, you’re going to find something even 
          more valuable: the beauty and secrets of the Earth!  But wait—what
          exactly is an Eco Explorer? Let’s find out together!
        </Text>
      </View>
      <View className="flex-row justify-between mt-8">
        <Button className="w-[48%] gap-3 bg-[#FFEB80] border-[#D5B300] border border-b-4 ">
          <ICONS.ChevronLeft stroke={'#806C00'} />
          <Text className="text-[#806C00] text-[16px] font-sansSemiBold">
            PREVIOUS
          </Text>
        </Button>
        <Button className="w-[48%] gap-3 bg-[#337535] border-[#265828] border border-b-4 ">
          <Text className="text-[#FFFFFF] text-[16px] font-sansSemiBold">
            NEXT
          </Text>
          <ICONS.ChevronRight stroke={'#FFFFFF'} />
        </Button>
      </View>
      {openHelper && (
        <View
          style={SHADOW}
          className="absolute z-50 bg-white py-4 px-3 rounded-[16px] items-center right-[-16px] top-[143px]"
        >
          {!helper && (
            <>
              <Pressable onPress={() => setHelper("sound")}>
                <ICONS.ReadModeSpeakerBlack />
              </Pressable>
              <View className="border border-[#D3D2D366] my-3 w-full" />
              <Pressable onPress={() => setHelper("font")}>
                <ICONS.ReadModeTt />
              </Pressable>
              <View className="border border-[#D3D2D366] my-3 w-full" />
              <Pressable onPress={() => setOpenHelper(false)}>
                <ICONS.ChevronRight width={24} height={24} />
              </Pressable>
            </>
          )}
          {helper === 'sound' && (
            <>
              <Pressable>
                <ICONS.ReadModeSpeakerYellow />
              </Pressable>
              <View className=" my-3 w-full" />
              <Pressable>
                <ICONS.ReadModeReset />
              </Pressable>
              <View className=" my-3 w-full" />

              <Pressable>
                <ICONS.ReadModePause />
              </Pressable>
              <View className="border border-[#D3D2D366] my-3 w-full" />
              <Pressable onPress={() => setHelper("")}>
                <ICONS.ReadModeCancel />
              </Pressable>
            </>
          )}
          {helper === 'font' && (
            <>
              <Pressable>
                <ICONS.APlus />
              </Pressable>
              <View className=" my-3 w-full" />
              <Pressable className="border border-[#265828] rounded-[32px] px-4 py-3">
                <Text className="text-[18px] font-sansMedium text-[#265828]">
                  RESET
                </Text>
              </Pressable>
              <View className=" my-3 w-full" />

              <Pressable>
                <ICONS.AMinus />
              </Pressable>
              <View className="border border-[#D3D2D366] my-3 w-full" />
              <Pressable onPress={() => setHelper("")}>
                <ICONS.ReadModeCancel />
              </Pressable>
            </>
          )}
        </View>
      )}
      {!openHelper && (
        <Pressable
          style={SHADOW}
          className="right-[-16px] top-[143px] absolute border items-center justify-center border-[#3F9243] bg-[#F1F9F1] rounded-[16px] h-16 w-14"
          onPress={() => setOpenHelper(true)}
        >
          <ICONS.ChevronLeft width={24} height={24} />
        </Pressable>
      )}
    </View>
  );
};

const SHADOW = {
  shadowColor: 'black',
  elevation: 5,
  shadowRadius: 5,
  shadowOpacity: 0.4,
  shadowOffset: {
    width: 4,
    height: 4,
  },
};

export default ReadMode;
