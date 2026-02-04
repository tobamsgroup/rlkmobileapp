import { handleLogout } from "@/actions/logout";
import { ICONS } from "@/assets/icons";
import { IMAGES } from "@/assets/images";
import Skeleton from "@/components/Skeleton";
import { useAppDispatch } from "@/hooks/redux";
import useGuardian from "@/hooks/useGuardianProfile";
import { ensureHttps } from "@/utils";
import { scaleHeight, scaleWidth, SCREEN_WIDTH } from "@/utils/scale";
import { router } from "expo-router";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function More() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGuardian();
  return (
    <View className="bg-[#DBEFDC] flex-1 relative">
      <Image
        style={{ width: SCREEN_WIDTH, height: scaleHeight(256) }}
        source={IMAGES.MoreOverlay}
      />

      {isLoading ? (
        <Skeleton
          style={{
            width: scaleWidth(130),
            height: scaleWidth(130),
            top: scaleHeight(256) - 75,
            left: SCREEN_WIDTH / 2 - 81,
          }}
          className="border-2 border-white rounded-full absolute "
        />
      ) : (
        <Image
          className="border-2 border-white rounded-full absolute "
          style={{
            width: scaleWidth(130),
            height: scaleWidth(130),
            top: scaleHeight(256) - 75,
            left: SCREEN_WIDTH / 2 - 65,
          }}
          source={
            data?.picture
              ? { uri: ensureHttps(data?.picture) }
              : IMAGES.KidProfilePlaceholder
          }
        />
      )}

      <Text
        style={{ top: scaleHeight(88) }}
        className="text-white text-[20px] font-sansSemiBold absolute text-center w-full"
      >
        Account
      </Text>
      <View
        style={{ marginTop: scaleHeight(80) }}
        className="items-center px-6 flex-1 pb-6"
      >
        {isLoading ? (
          <Skeleton className="w-1/2 rounded-full" />
        ) : (
          <Text numberOfLines={3} className="text-[20px] font-sansSemiBold text-center text-dark">
            Hi, {data?.firstName || "There"}
          </Text>
        )}
        <View className="bg-[#FAFDFF] rounded-full py-1 px-4 mt-2">
          <Text className="text-[16px] text-[#3F9243] font-sansMedium">
            Parent / Teacher
          </Text>
        </View>
        <View className="w-full bg-[#FFFFFF] rounded-[20px] p-5 mt-5 flex-1">
          <Pressable
            onPress={() => router.push("/guardian/Profile")}
            className="flex-row items-center gap-2 pb-6 border-b border-b-[#D3D2D366]"
          >
            <View className="items-center justify-center w-10 h-10 rounded-full bg-[#0991371A]">
              <ICONS.User />
            </View>
            <Text className="text-dark text-[16px] font-sansMedium flex-1">
              Profile
            </Text>
            <ICONS.ChevronRight />
          </Pressable>
          <Pressable
            onPress={() => handleLogout(dispatch)}
            className="flex-row items-center gap-2 pt-6"
          >
            <View className="items-center justify-center w-10 h-10 rounded-full bg-[#DE21211A]">
              <ICONS.Logout />
            </View>
            <Text className="text-dark text-[16px] font-sansMedium flex-1">
              Log Out
            </Text>
            <ICONS.ChevronRight />
          </Pressable>
          <View className="flex-1" />
          <View className="flex-row items-center justify-around">
            <Text
              onPress={() =>
                Linking.openURL("https://rlkids.ai/privacy-policy")
              }
              className="text-[#474348] font-sansMedium "
            >
              Privacy Policy
            </Text>
            <View className="w-1 h-1 rounded-full bg-[#474348]" />
            <Text
              onPress={() =>
                Linking.openURL("https://rlkids.ai/terms-and-conditions")
              }
              className="text-[#474348] font-sansMedium "
            >
              Terms of Service
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}


