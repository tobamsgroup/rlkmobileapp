import React, { ReactNode } from "react";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { Edges, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

type ContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
  backgroundColor?: string;
  edges?: Edges
};

const Container = ({
  children,
  scrollable = false,
  backgroundColor = "#DBEFDC",
  edges
}: ContainerProps) => {
  const Content = scrollable ? ScrollView : View;

  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor }}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Content
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={scrollable ? { flexGrow: 1 } : undefined}
            style={{ flex: 1 }}
          >
            {children}
          </Content>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Container;
