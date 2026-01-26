import React, { ReactNode, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ICONS } from "@/assets/icons";
import { scaleHeight } from "@/utils/scale";
import { twMerge } from "tailwind-merge";

export type InputProps<T extends FieldValues> = {
  name: Path<T>;
  control?: Control<T>;
  error?: string;
  disabled?: boolean;
  textarea?: boolean;
  label?: string;
  placeholder?: string;
  type?: "text" | "number" | "password";
  icon?: ReactNode;
  displayIcon?: ReactNode;
  optionalLabel?: string;
  className?: string;
  wrapperClassName?: string;
  containerClass?: string;
  textareaClass?: string;
  placeholderColor?:string
};

const Input = <T extends FieldValues>({
  name,
  control,
  error,
  type = "text",
  textarea = false,
  ...props
}: InputProps<T>) => {
  if (!control) {
    return (
      <SimpleInput
        name={name}
        type={type}
        textarea={textarea}
        {...props}
      />
    );
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value } }) => {
        const handleChange = (text: string) => {
          let newValue: string | number | null = text;

          if (type === "number") {
            if (text === "") newValue = null;
            else {
              const parsed = Number(text);
              newValue = isNaN(parsed) ? null : parsed;
            }
          }

          onChange(newValue);
        };

        return (
          <SimpleInput
            {...props}
            name={name}
            value={value}
            onBlur={onBlur}
            handleChange={handleChange}
            type={type}
            textarea={textarea}
            error={error}
          />
        );
      }}
    />
  );
};

export const SimpleInput = <T extends FieldValues>({
  name,
  label,
  optionalLabel,
  placeholder,
  type = "text",
  textarea = false,
  icon,
  displayIcon,
  value,
  error,
  handleChange,
  onBlur,
  className,
  containerClass,
  textareaClass,
  wrapperClassName,
  disabled,
  placeholderColor
}: InputProps<T> & {
  value?: any;
  handleChange?: (text: string) => void;
  onBlur?: () => void;
  
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <View className={twMerge("w-full", wrapperClassName)}>
      {label && (
        <Text className="mb-3 font-normal text-dark font-sans text-[16px] lg:text-[18px]">
          {label}
          {optionalLabel && (
            <Text className="text-subdued ml-2">{optionalLabel}</Text>
          )}
        </Text>
      )}

      {textarea ? (
        <TextInput
          multiline
          textAlignVertical="top"
          className={`min-h-[155px] py-4 rounded-[4px] bg-transparent p-4 w-full border border-[#D3D2D3] text-[14px] lg:text-[16px] ${textareaClass}`}
          placeholder={placeholder}
          value={value ?? ""}
          onBlur={onBlur}
          onChangeText={handleChange}
          editable={!disabled}
          autoCapitalize={"none"}
        />
      ) : (
        <View
        style={{height:scaleHeight(48)}}
          className={`w-full bg-transparent border border-[#D3D2D3] rounded-full flex flex-row items-center justify-between px-6 relative ${containerClass}`}
        >
          <View className="flex-row items-center gap-2 flex-1">
            {displayIcon}

            <TextInput
              className={`flex-1 bg-transparent font-sans text-[16px] text-mainText mr-2 ${className}`}
              placeholder={placeholder}
              placeholderTextColor={placeholderColor}
              value={value ?? ""}
              onBlur={onBlur}
              onChangeText={handleChange}
              editable={!disabled}
              secureTextEntry={isPassword && !showPassword}
              keyboardType={type === "number" ? "numeric" : "default"}
            />
          </View>

          {isPassword ? (
            <Pressable
              className="absolute right-4"
              onPress={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <ICONS.EyeOpened/> : <ICONS.EyesClosed />}
            </Pressable>
          ) : (
            icon && <View>{icon}</View>
          )}
        </View>
      )}

      {error && <View className="flex-row gap-1 mt-1 items-center">
        <ICONS.InformationCircle/>
        <Text className="text-[#DE2121] font-sans ">{error}</Text>
        </View>}
    </View>
  );
};

export default Input;
