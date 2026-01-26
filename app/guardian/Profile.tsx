import { updateGuardianProfile } from "@/actions/more";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Button from "@/components/Button";
import Container from "@/components/Container";
import { SimpleInput } from "@/components/Input";
import Skeleton from "@/components/Skeleton";
import TopBackButton from "@/components/TopBackButton";
import useGuardian from "@/hooks/useGuardianProfile";
import { GuardianProfileProps } from "@/types";
import { ensureHttps, formatDate } from "@/utils";
import { HAPTIC } from "@/utils/haptic";
import { pickImage } from "@/utils/image";
import { invalidateQueries } from "@/utils/query";
import { scaleWidth } from "@/utils/scale";
import { showToast } from "@/utils/toast";
import Constants from "expo-constants";
import { ImagePickerAsset } from "expo-image-picker";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";

const Profile = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const { data, isLoading } = useGuardian();

  return (
    <Container scrollable>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="text-dark text-[20px] font-sansSemiBold mt-4">
          My Profile
        </Text>
        <Text className="mt-2 text-dark font-sans leading-[1.5]">
          See your personal info, preferences, and connected learners.
        </Text>
        <View className="  mt-6">
          <View className="bg-white rounded-[16px] py-6 px-5">
            <View className="items-center bg-[#0991371A] p-5 rounded-[12px]">
              {isLoading ? (
                <Skeleton
                  className="rounded-full"
                  style={{ height: scaleWidth(95), width: scaleWidth(95) }}
                />
              ) : (
                <Image
                  style={{ height: scaleWidth(95), width: scaleWidth(95) }}
                  className="rounded-full"
                  source={
                    data?.picture
                      ? { uri: ensureHttps(data?.picture) }
                      : IMAGES.KidProfilePlaceholder
                  }
                />
              )}
              {isLoading ? (
                <Skeleton className="w-2/3 rounded-full mb-2 mt-4" />
              ) : (
                <Text className="text-[20px] font-sansSemiBold mb-2 mt-4">
                  {data?.firstName} {data?.lastName}
                </Text>
              )}

              <View className="bg-[#DBEFDC] rounded-full py-1.5 px-4 mt-2">
                <Text className="text-[16px] text-[#3F9243] font-sansMedium">
                  Parent / Teacher
                </Text>
              </View>
              {isLoading ? (
                <Skeleton className="w-2/3 mt-2 mb-2" />
              ) : (
                <Text className=" text-[#474348] mt-2 text-[16px] font-sansMedium mb-2">
                  {data?.email}
                </Text>
              )}
              {isLoading ? (
                <Skeleton className="w-1/2 mt-2 mb-2" />
              ) : (
                <>
                  {data?.phoneNumber && (
                    <Text className=" text-[#474348] mt-2 text-[16px] font-sansMedium mb-2">
                      {data?.phoneNumber}
                    </Text>
                  )}
                </>
              )}
            </View>
            {isLoading ? (
              <Skeleton className="h-[48px] rounded-full mt-6" />
            ) : (
              <Button
                onPress={() => setOpenEdit(true)}
                className="gap-2.5 bg-white border-2 border-[#D3D2D3] mt-6"
              >
                <ICONS.Pencil />
                <Text className="text-dark font-sansMedium text-[16px]">
                  EDIT PROFILE
                </Text>
              </Button>
            )}
          </View>

          <View className="bg-white rounded-[16px] py-6 px-5 mt-4">
            <View className="bg-[#0991371A] p-5 rounded-[12px] mb-4">
              <View className="w-11 h-11 bg-[#099137] rounded-full items-center justify-center mb-4">
                <ICONS.Mail />
              </View>
              <Text className="text-[16px] font-sansMedium text-[#265828]">
                Child Profiles Created
              </Text>
              {isLoading ? (
                <Skeleton className="w-10 mt-5" />
              ) : (
                <Text className="text-[16px] font-sansMedium text-dark mt-5">
                  {data?.totalKids}
                </Text>
              )}
            </View>
            <View className="bg-[#D5B3001A] p-5 rounded-[12px] mb-4">
              <View className="w-11 h-11 bg-[#D5B300] rounded-full items-center justify-center mb-4">
                <ICONS.Mail />
              </View>
              <Text className="text-[16px] font-sansMedium text-[#806C00]">
                Active Tracks
              </Text>
              {isLoading ? (
                <Skeleton className="w-10 mt-5" />
              ) : (
                <Text className="text-[16px] font-sansMedium text-dark mt-5">
                  {data?.activeTrackCount}
                </Text>
              )}
            </View>
            <View className="bg-[#1671D91A] p-5 rounded-[12px] ">
              <View className="w-11 h-11 bg-[#1671D9] rounded-full items-center justify-center mb-4">
                <ICONS.Calendar2 />
              </View>
              <Text className="text-[16px] font-sansMedium text-[#00274D]">
                Date Joined
              </Text>
              {isLoading ? (
                <Skeleton className="w-10 mt-5" />
              ) : (
                <Text className="text-[16px] font-sansMedium text-dark mt-5">
                  {formatDate(data?.createdAt || "")}
                </Text>
              )}
            </View>
          </View>
        </View>
        <EditForm
          data={data}
          open={openEdit}
          onClose={() => setOpenEdit(false)}
        />
      </View>
    </Container>
  );
};

const EditForm = ({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: GuardianProfileProps | undefined;
}) => {
  const [firstName, setFirstName] = useState(data?.firstName || "");
  const [lastName, setLastName] = useState(data?.lastName || "");
  const [email, setEmail] = useState(data?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(data?.phoneNumber || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ firstName: "", lastName: "" });
  const [image, setImage] = useState<ImagePickerAsset>();

  const onSubmit = async () => {
    setError({ firstName: "", lastName: "" });
    if (!firstName || !lastName) {
      setError({
        firstName: firstName ? "" : " First Name cannot be empty",
        lastName: lastName ? "" : "Last Name cannot be empty",
      });
      HAPTIC.error();
      return;
    }
    const payload = new FormData();
    payload.append("firstName", firstName);
    payload.append("lastName", lastName);
    if (phoneNumber) {
      payload.append("phoneNumber", phoneNumber);
    }
    if (image) {
      payload.append("file", {
        uri: image.uri,
        type: image?.mimeType || "image/jpeg",
        name: image?.fileName || "photo.jpg",
      } as any);
    }

    setLoading(true);
    try {
      await updateGuardianProfile(payload);
      showToast("success", "Profile pdated Successfully");
      invalidateQueries("profile");
      invalidateQueries("guardian");
      onClose();
      HAPTIC.success();
    } catch (error) {
      console.log({ error });
      showToast("success", "Please try again!");
      HAPTIC.error();
    }
    setLoading(false);
  };

  const selectImage = async () => {
    const image = await pickImage();
    if (image) {
      setImage(image);
    }
  };

  console.log({ image });
  return (
    <ReactNativeModal isVisible={open} onBackdropPress={onClose}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, paddingTop: Constants.statusBarHeight }}
      >
        <View className="bg-[#FAFAFA] p-5 rounded-[20px] items-center">
          <Text className="text-dark text-[16px] font-sansSemiBold mb-6">
            Edit Profile
          </Text>
          <View className="relative">
            <Image
              style={{ height: scaleWidth(88), width: scaleWidth(88) }}
              className="rounded-full border border-[#D3D2D3]"
              source={
                data?.picture || image
                  ? { uri: image?.uri || ensureHttps(data?.picture || "") }
                  : IMAGES.KidProfilePlaceholder
              }
            />
            <Pressable
              onPress={selectImage}
              className="absolute bottom-0 right-0"
            >
              <ICONS.PencilEdit
                width={scaleWidth(24)}
                height={scaleWidth(24)}
              />
            </Pressable>
          </View>
          <Text className="text-[16px] text-[#474348] font-sans text-center mt-2 mx-6">
            Update your personal details and preferences anytime.
          </Text>
          <SimpleInput
            wrapperClassName="mt-4"
            name="first_name"
            label="First Name"
            handleChange={setFirstName}
            value={firstName}
            error={error?.firstName}
          />
          <SimpleInput
            wrapperClassName="mt-4"
            name="last_name"
            label="Last Name"
            handleChange={setLastName}
            value={lastName}
            error={error?.lastName}
          />
          <SimpleInput
            wrapperClassName="mt-4"
            name="email"
            label="Email Address"
            value={email}
            disabled
          />
          <SimpleInput
            wrapperClassName="mt-4"
            name="phone_number"
            label="Phone Number"
            handleChange={setPhoneNumber}
            value={phoneNumber}
          />
          <Button
            disabled={loading}
            onPress={onSubmit}
            loading={loading}
            className="w-full mt-6"
            text="SAVE CHANGES"
          />
          <Button
            onPress={onClose}
            className="w-full mt-4 border-2 border-[#D3D2D3] bg-white"
            textClassname="text-dark"
            text="CLOSE"
          />
        </View>
      </ScrollView>
    </ReactNativeModal>
  );
};

export default Profile;
