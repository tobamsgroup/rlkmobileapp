import { ICONS } from "@/assets/icons";
import React, { FC } from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import Button from "./Button";

type Props = {
  open: boolean;
  title?: string;
  desc?: string;
  buttonText?: string;
  onClose?: () => void;
};

const CustomizedAlert: FC<Props> = (props) => {
  return (
    <Modal isVisible={props?.open} onBackButtonPress={props?.onClose}>
      <View className="bg-[#FAFDFF] p-5  border-b-4 border-b-[#099137] rounded-[20px] items-center">
        <ICONS.AlertSucess />
        <Text className="text-center font-sansSemiBold text-[20px] mb-2 mt-6">
          {props?.title}
        </Text>
        <Text className="text-center text-[#474348] font-sans text-[16px] leading-[1.5]">
          {props?.desc}
        </Text>
        <Button
          onPress={props.onClose}
          className="w-full mt-6 bg-[#0991371A] border-2 border-[#C3E4C5]"
          textClassname="text-[#099137]"
          text={props?.buttonText || "CLOSE"}
        />
      </View>
    </Modal>
  );
};

export default CustomizedAlert;
