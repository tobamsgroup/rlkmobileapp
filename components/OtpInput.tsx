import { scaleHeight, scaleWidth } from "@/utils/scale";
import React, { useCallback, useRef, useState } from "react";
import { TextInput, View } from "react-native";

const OTP_LENGTH = 6;

const OtpInput = ({
  length = OTP_LENGTH,
  onComplete,
}: {
  length?: number;
  onComplete?: (otp: string) => void;
}) => {
  const [otp, setOtp] = useState<string[]>(() =>
    Array.from({ length }, () => "")
  );

  const inputsRef = useRef<TextInput[]>([]);

  const focusInput = useCallback((index: number) => {
    inputsRef.current[index]?.focus();
  }, []);

  const handleChange = useCallback(
    (value: string, index: number) => {
      if (!/^\d*$/.test(value)) return;

      // Paste full OTP
      if (value.length > 1) {
        const pasted = value.slice(0, length).split("");
        setOtp(pasted);

        if (pasted.length === length) {
          onComplete?.(pasted.join(""));
        }

        focusInput(Math.min(pasted.length, length - 1));
        return;
      }

      setOtp((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });

      if (value && index < length - 1) {
        focusInput(index + 1);
      }

      const finalOtp = [...otp];
      finalOtp[index] = value;

      if (finalOtp.every(Boolean)) {
        onComplete?.(finalOtp.join(""));
      }
    },
    [focusInput, length, onComplete, otp]
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === "Backspace" && otp[index] === "" && index > 0) {
        focusInput(index - 1);
      }
    },
    [focusInput, otp]
  );

  return (
    <View className="flex-row gap-[8px]">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputsRef.current[index] = ref;
          }}
          value={digit}
          maxLength={1}
          inputMode="numeric"
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          onChangeText={(value) => handleChange(value, index)}
          onKeyPress={({ nativeEvent }) =>
            handleKeyPress(nativeEvent.key, index)
          }
          style={{
            height: scaleHeight(48),
            width: scaleWidth(43),
          }}
          className="border border-[#D3D2D366] rounded-[8] text-center px-2 font-sansSemiBold text-dark text-[18px]"
        />
      ))}
    </View>
  );
};

export default OtpInput;
