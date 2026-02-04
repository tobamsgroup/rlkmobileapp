import { createKidProfile } from "@/actions/home";
import { ICONS } from "@/assets/icons";
import { HAPTIC } from "@/utils/haptic";
import { invalidateQueries } from "@/utils/query";
import { scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Constant from "expo-constants";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import ReactNativeModal from "react-native-modal";
import { z } from "zod";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";

export const childProfileSchema = z.object({
  name: z.string().regex(/^[a-zA-Z]+ [a-zA-Z]+$/, {
    message: "Kid's name must be FirstName and LastName",
  }),
  username: z.string().min(1, "Username is required"),
  age: z
    .number({ error: "Age is required" })
    .min(7, "Age must be between 7-14")
    .max(14, "Age must be between 7-14"),
  preferredLearningTopics: z
    .string()
    .min(1, "Preferred learning topics is required"),
  gender: z
    .string()
    .min(1, "Please select a gender"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type ChildProfileSetupFormData = z.infer<typeof childProfileSchema>;

const CreateChildProfile = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ChildProfileSetupFormData>({
    resolver: zodResolver(childProfileSchema),
    defaultValues: {
      name: "",
      username: "",
      age: undefined,
      preferredLearningTopics: "",
      password: "",
      gender:""
    },
  });

  const onSubmit = async (data: ChildProfileSetupFormData) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await createKidProfile(data);
      invalidateQueries("overview");
      invalidateQueries("kids-courses");
      invalidateQueries("guardian-kids");
      invalidateQueries("kids");
      invalidateQueries("learning-overview");
      invalidateQueries("guardian")
      HAPTIC.success();
      onClose();
      showToast("success", "Child Added Successfully");
    } catch (err: any) {
      console.log(err);
      HAPTIC.error();
      alert(
        (err.response?.data as any)?.message ||
          err.message ||
          "Something went wrong",
      );
    }

    setLoading(false);
  };
  return (
    <ReactNativeModal style={{ padding: 0, margin: 0 }} isVisible={open}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{ paddingTop: Constant.statusBarHeight + 20 }}
          className="bg-[#3F9243] flex-1 px-6 py-4"
        >
          <Pressable
            onPress={onClose}
            style={{
              width: scaleWidth(32),
              height: scaleWidth(32),
            }}
            className="rounded-full bg-white mb-5 items-center justify-center"
          >
            <ICONS.ChevronLeft width={scaleWidth(14)} height={scaleWidth(14)} />
          </Pressable>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="font-sansSemiBold text-[24px] text-white mb-2">
              Set Up
              <Text className="text-[#FFD700]"> Child’s Profile</Text>
            </Text>
            <Text className="leading-[1.5] font-sans text-white text-[16px]">
              Tell us a bit about the child so we can create a fun and engaging
              experience tailored just for them.
            </Text>
            <View className="bg-white p-5 rounded-[16px] mt-10">
              <Input
                control={control}
                wrapperClassName="mb-6"
                name="name"
                label="Child’s Name"
                error={errors.name?.message}
              />
              <Input
                control={control}
                wrapperClassName="mb-6"
                name="username"
                label="Child’s Username"
                error={errors.username?.message}
              />
              <Input
                control={control}
                type="number"
                wrapperClassName="mb-6"
                error={errors.age?.message}
                name="age"
                label="Age"
              />
              <Select
                error={errors?.gender?.message}
                wrapperClassname="mb-6"
                label="Gender"
                options={[
                  "Male",
                  "Female"
                ]}
                value={getValues("gender")}
                onChange={(text) => setValue("gender", text)}
              />
              <Select
                error={errors?.preferredLearningTopics?.message}
                wrapperClassname="mb-6"
                label="Prefferred Topic"
                options={[
                  "Think Sustainability",
                  "Think Entrepreneurship",
                  "Think Leadership",
                  "Think Strategy",
                  "Think Financial Literacy",
                ]}
                value={getValues("preferredLearningTopics")}
                onChange={(text) => setValue("preferredLearningTopics", text)}
              />
              <Input
                error={errors.password?.message}
                control={control}
                name="password"
                label="Password"
              />
              <Text className="mb-6 text-[#918E91] text-[12px] mt-3">
                Password must be at least 8 characters long
              </Text>
              <Button
                loading={loading}
                onPress={handleSubmit(onSubmit)}
                text="CREATE PROFILE"
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

export default CreateChildProfile;
