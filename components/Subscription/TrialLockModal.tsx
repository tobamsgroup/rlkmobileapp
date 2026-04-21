import { ICONS } from '@/assets/icons';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import { twMerge } from 'tailwind-merge';
import { LinearButton, SecondaryButton } from '../Button';

type Props = {
  open: boolean;
  title?: string;
  desc?: string;
  buttonText1?: string;
  buttonText2?: string;
  onClose?: () => void;
  onProceed?: () => void;
  showChevron?: boolean;
  isAlert?: boolean;
};

const TrialLockModal: FC<Props> = (props) => {
  return (
    <Modal isVisible={props?.open} onBackdropPress={props?.onClose}>
      <View className="bg-[#DBEFDC] p-[18px]    rounded-[24px] items-center">
        <View className="bg-white rounded-[12px] p-5 items-center  w-full">
          <View
            className={twMerge(
              'w-16 h-16 rounded-full bg-[#1671D91A] items-center justify-center',
              props?.isAlert && 'bg-[#DE21211A]',
            )}
          >
            <ICONS.LockOff
              width={32}
              height={32}
              stroke={props?.isAlert ? '#DE2121' : '#1671D9'}
            />
          </View>

          <Text className="text-center font-sansSemiBold text-[#265828] text-[20px] mb-2 mt-6">
            {props?.title}
          </Text>
          <Text className="text-center text-[#221D23] font-sans text-[16px] leading-[1.5]">
            {props?.desc}
          </Text>
        </View>
        <LinearButton
          onPress={props.onProceed}
          className="w-full mt-4 "
          text={props?.buttonText1 || 'CLOSE'}
        >
          <View className="flex-row items-center gap-1">
            <Text className="text-[16px] text-white font-sansMedium">
              {props?.buttonText1 || 'CLOSE'}
            </Text>
            {props?.showChevron && <ICONS.ChevronRight stroke={'#FFFFFF'} />}
          </View>
        </LinearButton>
        {props?.buttonText2 && (
          <SecondaryButton
            onPress={props.onClose}
            className="w-full mt-4"
            text={props?.buttonText2 || 'CANCEL'}
          />
        )}
      </View>
    </Modal>
  );
};

export default TrialLockModal;
