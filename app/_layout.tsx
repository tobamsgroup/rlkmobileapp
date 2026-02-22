import { savePushToken } from "@/actions";
import ToastAlert from "@/components/ToastAlert";
import { SoundProvider } from "@/context/SoundContext";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getData } from "@/lib/storage";
import { registerForPushNotificationsAsync } from "@/notification";
import { login, logout } from "@/redux/authSlice";
import store from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Toast, { ToastConfig } from "react-native-toast-message";
import { Provider } from "react-redux";
import "./global.css";
import { Platform } from "react-native";
import { getDeviceId } from "@/utils";

SplashScreen.preventAutoHideAsync();
export const queryClient = new QueryClient();

const toastConfig: ToastConfig = {
  success: (props) => <ToastAlert type="success" text={props?.text1} />,
  error: (props) => <ToastAlert type="error" text={props?.text1} />,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function AppContent() {
  const [loaded, error] = useFonts({
    "Sans-Black": require("../assets/fonts/WorkSans-Black.ttf"),
    "Sans-Bold": require("../assets/fonts/WorkSans-Bold.ttf"),
    "Sans-Medium": require("../assets/fonts/WorkSans-Medium.ttf"),
    "Sans-Regular": require("../assets/fonts/WorkSans-Regular.ttf"),
    "Sans-SemiBold": require("../assets/fonts/WorkSans-SemiBold.ttf"),
    "Sans-Italic": require("../assets/fonts/WorkSans-Italic.ttf"),
  });

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const restoreSession = async () => {
      const user = await getData("user");
      if (user) {
        dispatch(login(user));
      } else {
        dispatch(logout());
      }
    };
    restoreSession();
  }, [dispatch]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="kid" options={{ headerShown: false }} />
          <Stack.Screen options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="dark" />
      <Toast
        position="top"
        bottomOffset={50}
        topOffset={80}
        config={toastConfig}
      />
    </>
  );
}

export default function RootLayout() {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    let isMounted = true;

    const registerAndSaveToken = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (!token || !isMounted) return;
        const storedToken = await AsyncStorage.getItem("PUSH_TOKEN");
        if (storedToken === token) return;
        const deviceId = await getDeviceId()
        if(!deviceId) return
        await savePushToken({ token, deviceType:Platform.OS, deviceId });
        await AsyncStorage.setItem("PUSH_TOKEN", token);
      } catch (error) {
        console.error("Failed to register/save push token", error);
      }
    };

    registerAndSaveToken();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log({ notification });
      },
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      isMounted = false;
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SoundProvider>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </SoundProvider>
    </QueryClientProvider>
  );
}
