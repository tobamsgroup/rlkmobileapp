import { resendOTP, teacherSignup, verifyOtp } from "@/actions";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { SimpleInput } from "@/components/Input";
import OtpInput from "@/components/OtpInput";
import Stepper from "@/components/Stepper";
import { scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.email().min(1, "Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),
});

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async () => {
    const result = RegisterSchema.safeParse({ email, password });
    if (!result.success) {
      const errorData = { email: "", password: "" };
      result.error.issues.forEach((err) => {
        if (err.path[0] === "email") errorData.email = err.message;
        if (err.path[0] === "password") errorData.password = err.message;
      });
      setErrors(errorData);
    } else {
      setLoading(true);
      const payload = {
        ...result.data,
        role: "teacher",
      };
      try {
        await teacherSignup(payload);
        showToast("success", "OTP Sent successfully!");
        setMode("otp");
      } catch (error: any) {
        console.log({ error: error?.response });
        alert(error?.response?.data?.message || "An error occured");
      }
    }
    setErrors({ email: "", password: "" });
    setLoading(false);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      //@ts-ignore
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const resendOtp = async () => {
    if (countdown > 0) return;
    if (!email) {
      return showToast("error", "Email is required");
    }
    try {
      setCountdown(60);
      await resendOTP({ email, otpType: "email" });
      showToast("success", "OTP resent successfully");
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 400) {
        showToast("error", `${error?.response?.data?.message}`);
      } else {
        showToast("error", "An error occurred");
      }
    }
  };

  const submitOTP = async () => {
    if (otp.length < 6) {
      showToast("error", "Incomplete OTP");
      return;
    }
    if (!email) {
      return showToast("error", "Email is required");
    }

    const payload = {
      email,
      otpType: "email",
      otp,
    };
    setLoading(true);

    try {
      setCountdown(60);
      await verifyOtp(payload);
      showToast("success", "Account Created Successfully");
      setStep(2);
    } catch (error) {
      showToast("error", "An error occurred while verifying OTP");
    }
    setLoading(false);
  };
  return (
    <Container backgroundColor="#FAFDFF">
      <View className="px-6 py-5">
        <Pressable
          style={{ width: scaleWidth(32), height: scaleWidth(32) }}
          className="w-8 h-8 rounded-full border-[#EFEFF3] border items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ICONS.ChevronLeft width={14} height={14} />
        </Pressable>
        {mode === "email" && (
          <>
            <Text className="text-center font-sansSemiBold text-[24px] text-dark ">
              Let's Set Up Your Parent/{"\n"} Teacher Account.
            </Text>
            <Text className="text-center mt-3 text-[#474348] leading-[1.5] font-sans text-[16px] mb-10">
              Please use your email or phone number to create your account and
              link a child’s learning journey.
            </Text>

            <SimpleInput
              value={email}
              handleChange={setEmail}
              name="email"
              label="Email Address"
              error={errors.email}
            />
            <SimpleInput
              value={password}
              handleChange={setPassword}
              type="password"
              name="email"
              label="Password"
              wrapperClassName="mt-8 mb-8"
              error={errors.password}
            />
            <Button
              loading={loading}
              onPress={handleSubmit}
              className="mb-8"
              text="SIGN UP"
            />
            <Text className="text-center text-[16px] font-sansMedium text-[#6C686C]">
              Already have an account?{" "}
              <Text
                onPress={() => router.navigate("/auth/Login")}
                className="text-primary font-sansSemiBold text-[16px]"
              >
                LOG IN
              </Text>
            </Text>

            <Text className="font-sans text-[#6C686C] text-[14px] text-center mt-6">
              By signing up, you agree to our{" "}
              <Text
                onPress={() =>
                  Linking.openURL(
                    "https://www.recycledlearningkids.com/terms-and-conditions"
                  )
                }
                className="text-[#004D99] underline"
              >
                Terms of Use
              </Text>{" "}
              and{" "}
              <Text
                onPress={() =>
                  Linking.openURL(
                    "https://www.recycledlearningkids.com/privacy-policy"
                  )
                }
                className="text-[#004D99] underline"
              >
                Privscy Policy
              </Text>
            </Text>
          </>
        )}
        {mode !== "email" && (
          <>
            <Stepper totalStep={2} currentStep={step} />
            {step === 1 && (
              <View className="items-center justify-center mt-10">
                <Image
                  style={{ width: scaleWidth(213), height: scaleWidth(213) }}
                  className=""
                  source={IMAGES.AuthStep}
                />
                <Text className="text-dark text-[24px] font-sansSemiBold ">
                  Verify Your Account
                </Text>
                <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-8">
                  We’ve sent a 6-digit code to your email address {email} Enter
                  the code below to password.
                </Text>
                <OtpInput onComplete={(otp) => setOtp(otp)} />
                <Button
                  loading={loading}
                  onPress={submitOTP}
                  className="my-8 w-full"
                  text="VERIFY NOW"
                />
                <Text className="text-center text-[14px] font-sansMedium text-[#6C686C]">
                  Didn’t receive a code?{" "}
                  <Text
                    onPress={resendOtp}
                    className="text-primary font-sansSemiBold text-[14px]"
                  >
                    {countdown > 0
                      ? `Resend available in ${countdown}s`
                      : "RESEND OTP"}
                  </Text>
                </Text>
              </View>
            )}
            {step === 2 && (
              <View className="items-center justify-center mt-10">
                <Text className="text-dark text-[24px] font-sansSemiBold ">
                  Verification Successful!
                </Text>
                <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-8">
                  Your account has been successfully verified. You can now log
                  in to set up your profile and create your child’s profile to
                  get started.
                </Text>
                <View className="bg-[#DBEFDC80] rounded-[80px]">
                  <Image
                    style={{ width: scaleWidth(213), height: scaleWidth(213) }}
                    className=""
                    source={IMAGES.AuthSucess}
                  />
                </View>
                <Button
                  onPress={() => router.navigate("/auth/Login")}
                  className="my-8 w-full"
                  text="LOG IN"
                />

                <Text
                  onPress={() => router.back()}
                  className="text-primary font-sansSemiBold text-[14px]"
                >
                  SKIP FOR NOW
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </Container>
  );
};

export default SignUp;
