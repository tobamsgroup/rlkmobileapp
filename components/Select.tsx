import { ICONS } from "@/assets/icons";
import { scaleHeight } from "@/utils/scale";
import React, { FC, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { twMerge } from "tailwind-merge";

type SelectProps = {
  placeholder?: string;
  onChange?: (v: string) => void;
  className?: string;
  label?: string;
  containerClassname?: string;
  wrapperClassname?:string
  options: string[];
  value?: string;
};

const Select: FC<SelectProps> = ({
  placeholder,
  onChange,
  className,
  label,
  containerClassname,
  options,
  value: inputValue,
  wrapperClassname
}) => {
  const [value, setValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  return (
    <View  className={wrapperClassname}>
      {label && (
        <Text className="mb-3 font-normal text-dark font-sans text-[16px] lg:text-[18px]">
          {label}
        </Text>
      )}
      <Pressable
        onPress={() => setOpenModal(true)}
        style={{ height: scaleHeight(48) }}
        className={`w-full bg-transparent border border-[#D3D2D3] rounded-full flex flex-row items-center justify-between px-6 relative ${containerClassname}`}
      >
        <Text
          className="flex-1  text-[16px] text-dark font-sans"
          numberOfLines={1}
        >
          {value || inputValue || placeholder || "Select"}
        </Text>
        <ICONS.ChevronDown />
      </Pressable>
      <ReactNativeModal
        onBackdropPress={() => setOpenModal(false)}
        style={{ padding: 0, margin: 0 }}
        isVisible={openModal}
      >
        <View className="bg-white h-[400px] mt-auto rounded-tr-[20px] rounded-tl-[20px] p-5 py-6">
          <View className="flex-row justify-between">
            <Text className="font-sansMedium text-[16px] text-dark mb-4">
              {label || "Select"}:
            </Text>
            <Pressable onPress={() => setOpenModal(false)}>
              <ICONS.Close width={20} height={20} />
            </Pressable>
          </View>
          <ScrollView>
            {options?.map((o, i) => (
              <Pressable
                onPress={() => {
                  onChange?.(o);
                  setValue(o);
                  setOpenModal(false);
                }}
                className={twMerge(
                  "border-b-2 border-[#D3D2D366] py-5 rounded-[8px] ",
                  i + 1 === options.length && "border-b-0"
                )}
                key={i}
              >
                <Text className="font-sans text-[16px] text-dark">{o}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ReactNativeModal>
    </View>
  );
};

export default Select;
