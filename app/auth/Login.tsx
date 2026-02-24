import { attachTokenOnLogin } from "@/actions";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Input from "@/components/Input";
import { useAppDispatch } from "@/hooks/redux";
import axios from "@/lib/axios";
import { storeData } from "@/lib/storage";
import { login } from "@/redux/authSlice";
import { scaleHeight, scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Image, Pressable, Text, View } from "react-native";
import { z } from "zod";

const KidLoginSchema = z.object({
  email: z.string().optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const GuardianLoginSchema = z.object({
  username: z.string().optional(),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = {
  email?: string | undefined;
  username?: string | undefined;
  password: string;
};

const Login = () => {
  const { profile } = useLocalSearchParams();
  // console.log(pt)
  const [isLoading, setIsLoading] = useState(false);
  const [incorrectError, setIncorrectError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      profile === "kid" ? KidLoginSchema : GuardianLoginSchema,
    ),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const dispatch = useAppDispatch();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setIncorrectError(false);
    try {
      let res = null;
      if (profile === "kid") {
        res = await axios.post("/auth/login/kid", {
          username: data.username,
          password: data.password,
          rememberMe: true,
        });
      } else {
        res = await axios.post("/auth/login/guardian", {
          email: data.email,
          password: data.password,
          rememberMe: true,
        });
      }
      showToast("success", "Login Successful!");
      await storeData("user", res?.data?.data);
      dispatch(login(res?.data?.data));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // if (profile === "kid") {
      //   router.navigate("/kid/AvatarSelection");
      // }
       attachTokenOnLogin().catch(console.log);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (error?.response?.data?.statusCode === 401) {
        setIncorrectError(true);
      } else {
        showToast("error", "Please try again!");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container scrollable backgroundColor="#FAFDFF">
      <View className="px-6 py-5">
        <Pressable
          style={{ width: scaleWidth(32), height: scaleWidth(32) }}
          className="w-8 h-8 rounded-full border-[#EFEFF3] border items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ICONS.ChevronLeft width={14} height={14} />
        </Pressable>
        <View className="items-center justify-center mb-6">
          <Image
            style={{ height: scaleHeight(166), width: scaleHeight(166) }}
            source={IMAGES.Login}
          />
        </View>
        <Text className="text-primary text-[24px] font-sansSemiBold text-center">
          {profile === "kid" ? "Hi There! Ready to Learn?" : "Welcome Back!"}
        </Text>
        <Text className="text-center text-[16px] text-[#474348] font-sans leading-[1.5] mt-2 mb-8">
          {profile === "kid"
            ? "Enter your details below to begin your adventure."
            : "  Log in to manage a child’s learning journey."}
        </Text>
        {incorrectError && (
          <View className="flex-row gap-3 p-3 bg-[#DE21211A] rounded-[8px] mb-8">
            <ICONS.InformationCircle />
            <Text className="text-[#DE2121] text-[14px] font-sans">
              Invalid login credentials, try again
            </Text>
          </View>
        )}
        {profile === "kid" && (
          <Input
            control={control}
            error={errors?.username?.message}
            name="username"
            label="Username"
          />
        )}
        {profile === "adult" && (
          <Input
            control={control}
            error={errors?.email?.message}
            name="email"
            label="Email Address"
            type="email-address"
          />
        )}
        <Input
          control={control}
          error={errors?.password?.message}
          type="password"
          name="password"
          label="Password"
          wrapperClassName="mt-8 mb-3"
        />
        <View className="items-end">
          <Text
            onPress={() =>
              router.navigate(`/auth/ForgotPassword?profile=${profile}`)
            }
            className="text-[#004D99] font-sansMedium text-[12px] mb-7 text-end "
          >
            FORGOT PASSWORD?
          </Text>
        </View>
        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          className="mb-8"
          text="SIGN IN"
        />
        {profile !== "kid" && (
          <Text className="text-center text-[14px] font-sansMedium text-[#6C686C]">
            Don't have an account?{" "}
            <Text
              onPress={() => router.navigate("/auth/SignUp")}
              className="text-primary font-sansSemiBold text-[14px]"
            >
              CREATE ONE NOW
            </Text>
          </Text>
        )}
        {profile === "kid" && (
          <Text className="text-center text-[14px] font-sans text-[#6C686C]">
            Don't have an account? Ask your parent or teacher to set one up for
            you.
          </Text>
        )}
      </View>
    </Container>
  );
};

export default Login;
