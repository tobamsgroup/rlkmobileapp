import { ICONS } from "@/assets/icons";
import { scaleWidth } from "@/utils/scale";
import Constant from "expo-constants";
import React from "react";
import { useForm } from "react-hook-form";
import { Pressable, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";

const CreateChildProfile = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(
    //   profile === "kid" ? KidLoginSchema : GuardianLoginSchema
    // ),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });
  return (
    <ReactNativeModal style={{ padding: 0, margin: 0 }} isVisible={open}>
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
            <Input wrapperClassName="mb-6" name="name" label="Child’s Name" />
            <Input
              wrapperClassName="mb-6"
              name="username"
              label="Child’s Username"
            />
            <Input wrapperClassName="mb-6" name="age" label="Age" />
            <Select
              wrapperClassname="mb-6"
              label="Prefferred Topic"
              options={[
                "Think Sustainability",
                "Think Entrepreneurship",
                "Think Leadership",
                "Think Strategy",
                "Think Financial Literacy",
              ]}
            />
            <Input name="password" label="Password" />
            <Text className="mb-6 text-[#918E91] text-[12px] mt-3">
              Password must be at least 8 characters long
            </Text>
            <Button text="CREATE PROFILE" />
          </View>
        </ScrollView>
      </View>
    </ReactNativeModal>
  );
};

export default CreateChildProfile;
