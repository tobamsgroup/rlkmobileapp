import { ICONS } from '@/assets/icons';
import React, { FC } from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import Button, { SecondaryButton } from '../Button';

type Props = {
  open: boolean;
  title?: string;
  desc?: string;
  buttonText1?: string;
  buttonText2?: string;
  onClose?: () => void;
  onProceed?: () => void;
};

const SubscriptionModal: FC<Props> = (props) => {
  return (
    <Modal isVisible={props?.open}  onBackdropPress={props?.onClose}>
      <View className="bg-[#DBEFDC] p-6  border-2 border-[#6ABC6D] rounded-[24px] items-center">
        <View className="bg-white rounded-[24px] p-5 items-center mb-6 w-full">
          <View className="w-16 h-16 rounded-full bg-[#1671D91A] items-center justify-center">
            <ICONS.InformationCircle
              width={32}
              height={32}
              stroke={'#1671D9'}
            />
          </View>
          <View className="absolute top-[58px] right-[62px] ">
            <ICONS.Ellipse width={20} height={20} stroke={'#09913766'} />
          </View>
          <View className="absolute top-[47px] left-[65px] ">
            <ICONS.Confetto />
          </View>
          <View  className="absolute bottom-[27px] right-[46px] ">
            <ICONS.Shape />
          </View>
          <Text className="text-center font-sansSemiBold text-[#265828] text-[20px] mb-2 mt-6">
            {props?.title}
          </Text>
          <Text className="text-center text-[#221D23] font-sans text-[16px] leading-[1.5]">
            {props?.desc}
          </Text>
        </View>
        <Button
          onPress={props.onProceed}
          className="w-full mt-6"
          text={props?.buttonText1 || 'CLOSE'}
        />
        <SecondaryButton
          onPress={props.onClose}
          className="w-full mt-4"
          text={props?.buttonText2 || 'CANCEL'}
        />
      </View>
    </Modal>
  );
};

export default SubscriptionModal;
