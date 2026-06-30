import { ICONS } from '@/assets/icons';
import { scaleWidth, SCREEN_WIDTH } from '@/utils/scale';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const ToastAlert = ({
  type = 'success',
  text,
  onClose,
}: {
  type?: 'success' | 'error' | 'info';
  text?: string;
  onClose?: () => void;
}) => {
  const borderColor =
    type === 'success'
      ? 'border-b-[#337535] border-l-[#337535]/10 border-r-[#337535]/10'
      : type === 'info'
        ? 'border-b-[#1671D9] border-l-[#1671D9]/10 border-r-[#1671D9]/10'
        : 'border-b-[#DE2121] border-l-[#DE2121]/10 border-r-[#DE2121]/10';
  return (
    <View
      style={{ width: SCREEN_WIDTH * 0.8 }}
      className={`bg-[#FFFFFF]  rounded-[16px] p-4 items-start flex-row gap-2 border-b-[4px] border-l border-r ${borderColor}`}
    >
      {type === 'success' ? (
        <ICONS.AlertSucess width={scaleWidth(44)} height={scaleWidth(44)} />
      ) : type === 'info' ? (
        <View
          style={{ width: scaleWidth(44), height: scaleWidth(44) }}
          className="bg-[#1671D91A] rounded-full items-center justify-center"
        >
          <ICONS.InformationCircle  stroke={'#1671D9'} width={24} height={24}/>
        </View>
      ) : (
        <View
          style={{ width: scaleWidth(44), height: scaleWidth(44) }}
          className="bg-[#DE21211A] rounded-full items-center justify-center"
        >
          <ICONS.Close strokeWidth={1} stroke={'#DE2121'} />
        </View>
      )}
      <Text
        className="text-[16px] flex-1 text-[#221D23] font-sansMedium py-2"
      >
        {text}
      </Text>
      <Pressable onPress={() => onClose?.()}>
        <ICONS.Close />
      </Pressable>
    </View>
  );
};

export default ToastAlert;
