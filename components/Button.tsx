import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";
import { twMerge } from "tailwind-merge";

type Props = {
  text: string;
  textClassname?: string;
  loading?: boolean;
};

const Button = ({ children, ...props }: Props & PressableProps) => {
  return (
    <Pressable  {...props} className={twMerge("py-[14.5px] flex-row items-center justify-center bg-[#3F9243] rounded-full border-b-2 border-b-[#337535]", props.className)}>
      {props?.loading ? (
        <ActivityIndicator color={"white"} size={'small'} />
      ) : (
        <>
          {children ? (
            children
          ) : (
            <Text className={twMerge("text-[16px] text-white font-sansMedium", props.textClassname)}>
              {props.text}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

export default Button;
