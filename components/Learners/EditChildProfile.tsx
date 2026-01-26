import { updateKidProfile } from "@/actions/home";
import { ICONS } from "@/assets/icons";
import { HAPTIC } from "@/utils/haptic";
import { invalidateQueries } from "@/utils/query";
import { scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Constant from "expo-constants";
import React, { useEffect, useState } from "react";
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
import Input, { SimpleInput } from "../Input";

export const childProfileSchema = z.object({
  name: z.string().regex(/^[a-zA-Z]+ [a-zA-Z]+$/, {
    message: "Kid's name must be FirstName and LastName",
  }),
  age: z
    .number({ error: "Age is required" })
    .min(7, "Age must be between 7-14")
    .max(14, "Age must be between 7-14"),
});

type ChildProfileSetupFormData = z.infer<typeof childProfileSchema>;

const EditChildProfile = ({
  open,
  onClose,
  kid,
}: {
  open: boolean;
  onClose: () => void;
  kid: {
    username: string;
    name: string;
    age: number;
    picture: string;
    id: string;
  };
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
      age: undefined,
    },
  });

  const onSubmit = async (data: ChildProfileSetupFormData) => {
    if (loading) return;
    setLoading(true);
    try {
       await updateKidProfile(kid?.id, data);
      invalidateQueries("overview");
      invalidateQueries("kids-courses");
      invalidateQueries("guardian-kids");
      invalidateQueries("kids")
      invalidateQueries("learning-overview")
      HAPTIC.success();
      onClose();
      showToast("success", "Child Profile Updated Successfully");
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

  useEffect(() => {
    if (!kid) return;
    setValue("name", kid?.name);
    setValue("age", kid?.age);
  }, [kid]);

  return (
    <ReactNativeModal style={{ padding: 0, margin: 0 }} isVisible={open}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{ paddingTop: Constant.statusBarHeight + 20 }}
          className="bg-[#DBEFDC] flex-1  pt-4"
        >
          <View className="px-6">
            <Pressable
              onPress={onClose}
              style={{
                width: scaleWidth(32),
                height: scaleWidth(32),
              }}
              className="rounded-full bg-white mb-5 items-center justify-center"
            >
              <ICONS.ChevronLeft
                width={scaleWidth(14)}
                height={scaleWidth(14)}
              />
            </Pressable>
            <Text className="font-sansSemiBold text-[24px] text-dark mb-2">
              Edit Child’s Profile
            </Text>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerClassName="flex-1"
            showsVerticalScrollIndicator={false}
          >
            <View className="bg-white p-6  rounded-[16px] mt-6 flex-1 h-full">
              <Input
                control={control}
                wrapperClassName="mb-6"
                name="name"
                label="Child’s Name"
                error={errors.name?.message}
              />
              {/* <Input
                control={control}
                wrapperClassName="mb-6"
                name="username"
                label="Child’s Username"
                error={errors.username?.message}
              /> */}
              <SimpleInput
                type="number"
                wrapperClassName="mb-6"
                error={errors.age?.message}
                name="age"
                label="Age"
                value={getValues("age")}
                handleChange={(text) => setValue("age", Number(text))}
              />
              {/* <Input
                error={errors.password?.message}
                control={control}
                name="password"
                label="Password"
              /> */}
              {/* <Text className="mb-6 text-[#918E91] text-[12px] mt-3">
                Password must be at least 8 characters long
              </Text> */}
              <Button
                loading={loading}
                onPress={handleSubmit(onSubmit)}
                text="SAVE CHANGES"
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

export default EditChildProfile;
