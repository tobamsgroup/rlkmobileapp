import { ICONS } from "@/assets/icons";
import { scaleWidth, SCREEN_WIDTH } from "@/utils/scale";
import React from "react";
import { Pressable, Text, View } from "react-native";

const ToastAlert = ({
  type = "success",
  text,
  onClose,
}: {
  type?: "success" | "error";
  text?: string;
  onClose?: () => void;
}) => {
  const borderColor =
    type === "success"
      ? "border-b-[#337535] border-l-[#337535]/40 border-r-[#337535]/40"
      : "border-b-[#DE2121] border-l-[#DE2121]/10 border-r-[#DE2121]/10";
  return (
    <View
    style={{width:SCREEN_WIDTH * 0.8}}
      className={`bg-[#FFFFFF]  rounded-[16px] p-4 items-start flex-row gap-2 border-b-[10px] border-l border-r ${borderColor}`}
    >
      {type === "success" ? (
        <ICONS.AlertSucess width={scaleWidth(44)} height={scaleWidth(44)} />
      ) : (
        <View
          style={{ width: scaleWidth(44), height: scaleWidth(44) }}
          className="bg-[#DE21211A] rounded-full items-center justify-center"
        >
          <ICONS.Close strokeWidth={1} stroke={"#DE2121"} />
        </View>
      )}
      <Text
        style={{
          color: type === "error" ? "#221D23" : "#265828",
        }}
        className="text-[16px] flex-1 font-sansMedium py-2"
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
