import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Container from "@/components/Container";
import { SimpleInput } from "@/components/Input";
import TopBackButton from "@/components/TopBackButton";
import { scaleHeight } from "@/utils/scale";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ParentAccess = () => {
  return (
    <Container backgroundColor="#FAFDFF">
      <View className="px-5 py-6">
        <TopBackButton />
        <Text className="text-[#337535] text-center text-[24px] font-sansSemiBold mb-2 mt-8">
          Parent Access Required
        </Text>
        <Text className="text-dark text-[16px] font-sans text-center leading-[1.5]">
          For security reasons, please enter your{"\n"} password to return to
          your{"\n"}
          dashboard.
        </Text>

        <View style={{height:scaleHeight(314)}} className="relative w-full  p-1 mt-6">
          <LinearGradient
            colors={[ "#004D99",  "#FFD700", "#3F9243"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              ...StyleSheet.absoluteFillObject,
              zIndex: 0,
              borderRadius: 20,
            }}
          />
          <View
            style={{ borderRadius: 17 }}
            className="bg-white h-full w-full px-4 py-6"
          >
            <SimpleInput
              label="Password"
              placeholder="********"
              type="password"
              name="password"
            />
            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row gap-2 items-center">
                <Checkbox />
                <Text className=" text-dark font-sans">Remember Me</Text>
              </View>
              <Text className="text-[12px] text-[#004D99] font-sansMedium">
                FORGOT PASSWORD?
              </Text>
            </View>
            <Button className="mt-8" text="Continue" />
            <View className="w-full border border-[#DBEFDC] mt-5" />
            <View className="bg-[#1671D91A] px-4 py-2 rounded-[8px] mt-6">
              <Text className="font-sans text-[#1671D9] text-center">
                Need help?{" "}
                <Text className="text-[#004D99]">Contact support</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default ParentAccess;
