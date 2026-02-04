import {
  kidForgotPassword,
  parentForgotPassword,
  parentResetPassword,
  resendOTP,
  verifyOtp,
} from "@/actions";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import CustomizedAlert from "@/components/CustomizedAlert";
import { SimpleInput } from "@/components/Input";
import OtpInput from "@/components/OtpInput";
import Stepper from "@/components/Stepper";
import { maskEmail } from "@/utils";
import { scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const ForgotPassword = () => {
  const { profile } = useLocalSearchParams();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const onResetPassword = async () => {
    if (profile !== "kid" && !emailRegex.test(email)) {
      // showToast("error", "Please enter a valid email address", "", "top");
      setError("Enter a valid email");
      return;
    }

    if(profile === "kid" && !username){
      setError("Enter a valid username")
      return
    }
    setLoading(true);
    try {
      if (profile === "kid") {
        await kidForgotPassword(username);
        setOpenModal(true);
        setUsername("")
        setError("")
      } else {
        await parentForgotPassword(email);
        showToast("success", "Reset OTP sent successfully");
        setMode("otp");
      }
    } catch (error: any) {
      console.error(error);
      showToast(
        "error",
        error?.response?.data?.message || "Invalid email address",
        "",
        "top"
      );
    }
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

  const submitOTP = async () => {
    if (otp.length < 6) {
      showToast("error", "Incomplete OTP");
      return;
    }

    const payload = {
      email,
      otpType: "forgot-password",
      otp,
    };
    setLoading(true);
    try {
      setCountdown(60);
      const res = await verifyOtp(payload);
      const resetToken = res.data.resetToken;
      setResetToken(resetToken);
      showToast("success", "OTP verified successfully");
      setStep(2);
    } catch (error: any) {
      console.log(error?.response);

     
      showToast(
        "error",
        error?.response?.data?.message ||
          "An error occurred while verifying OTP"
      );
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    if (countdown > 0) return;
    if (!email) {
      return showToast("error", "Email is required");
    }

    try {
      setCountdown(60);
      await resendOTP({ email, otpType: "forgot-password" });
      showToast("success", "OTP resent successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 400) {
        showToast("error", `${error?.response?.data?.message}`);
      } else {
        showToast("error", "An error occurred");
      }
    }
  };

  const handleSubmit = async () => {
    if (!resetToken) {
      return;
    }

    const result = ResetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const errorData = { newPassword: "", confirmPassword: "" };
      result.error.issues.forEach((err) => {
        if (err.path[0] === "newPassword") errorData.newPassword = err.message;
        if (err.path[0] === "confirmPassword")
          errorData.confirmPassword = err.message;
      });
      setErrors(errorData);
      return;
    } else {
      setLoading(true);
      const payload = {
        resetToken,
        newPassword,
      };
      try {
        await parentResetPassword(payload);
        showToast("success", "Password reset successfully");
        setEmail("");
        setResetToken("");
        setStep(3);
      } catch (error: any) {
        console.error(error);
        showToast(
          "error",
          error?.response?.data?.message ||
            "An error occurred while reseting the password"
        );
      }
      setLoading(false);
      setErrors({ newPassword: "", confirmPassword: "" });
    }
  };

  return (
    <Container backgroundColor="#FAFDFF" scrollable>
      <View style={{ paddingHorizontal: scaleWidth(24) }} className=" py-5">
        <Pressable
          style={{ width: scaleWidth(32), height: scaleWidth(32) }}
          className="w-8 h-8 rounded-full border-[#EFEFF3] border items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ICONS.ChevronLeft width={14} height={14} />
        </Pressable>
        <Stepper totalStep={3} currentStep={step} />
        {step === 1 && mode === "email" && (
          <View className="items-center justify-center mt-10">
            <Image
              style={{ width: scaleWidth(213), height: scaleWidth(213) }}
              className=""
              source={IMAGES.AuthStep}
            />
            <Text className="text-dark text-[24px] font-sansSemiBold ">
              Reset Password
            </Text>
            <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-8">
              {profile === "kid"
                ? "Please enter your username. Let’s get your Parent/Teacher to help."
                : "Enter your registered email address to reset your password."}
            </Text>
            {profile !== "kid" && (
              <SimpleInput
                value={email}
                handleChange={setEmail}
                name="email"
                label="Parent or Teacher Email"
                error={error}
              />
            )}
            {profile === "kid" && (
              <SimpleInput
                value={username}
                handleChange={setUsername}
                name="username"
                label="Username"
                error={error}
              />
            )}

            <Button
              loading={loading}
              onPress={onResetPassword}
              className="my-8 w-full"
              text={profile === "kid" ? "GET PASSWORD HELP" : "RESET PASSWORD"}
            />
          </View>
        )}
        {step === 1 && mode === "otp" && (
          <View className="items-center justify-center mt-10">
            <Image
              style={{ width: scaleWidth(213), height: scaleWidth(213) }}
              className=""
              source={IMAGES.AuthStep}
            />
            <Text className="text-dark text-[24px] font-sansSemiBold ">
              Enter OTP
            </Text>
            <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-8">
              We’ve sent a 6-digit code to {maskEmail(email)}. Please enter it below
              to reset your password.
            </Text>
            <OtpInput onComplete={(otp) => setOtp(otp)} />

            <Button
              loading={loading}
              onPress={submitOTP}
              className="my-8 w-full"
              text=" VERIFY NOW"
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
          <View className=" mt-10">
            <Text className="text-dark text-[24px] font-sansSemiBold text-center">
              Create New Password
            </Text>
            <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-8">
              Create a new password for your account.
            </Text>
            <SimpleInput
              name="newPassword"
              value={newPassword}
              handleChange={setNewPassword}
              type="password"
              label="New Password"
              wrapperClassName="mb-3"
              error={errors.newPassword}
            />
            <Text className="text-[12px] text-[#474348] font-sans mb-5">
              Password must be at least 8 character long
            </Text>
            <SimpleInput
              type="password"
              label="Confirm New Password"
              name="confirmPassword"
              value={confirmPassword}
              error={errors.confirmPassword}
              handleChange={setConfirmPassword}
            />

            <Button
              onPress={handleSubmit}
              loading={loading}
              className="my-8 w-full"
              text="CREATE PASSWORD"
            />
          </View>
        )}
        {step === 3 && (
          <View className="items-center justify-center mt-10">
            <Image
              style={{ width: scaleWidth(213), height: scaleWidth(213) }}
              className=""
              source={IMAGES.AuthStep}
            />
            <Text className="text-dark text-[24px] font-sansSemiBold ">
              Password Reset Successful!
            </Text>
            <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-8">
              You can now log in with your new password.
            </Text>

            <Button
              onPress={() => router.navigate("/auth/Login?profile=adult")}
              className="my-8 w-full"
              text="GO TO LOGIN"
            />
          </View>
        )}
      </View>
      <CustomizedAlert
        open={openModal}
        title="Password Reset Link Sent"
        desc="A password reset link has been sent to the parent or teacher’s
         email linked to this account."
        onClose={() => setOpenModal(false)}
      />
    </Container>
  );
};

export default ForgotPassword;
