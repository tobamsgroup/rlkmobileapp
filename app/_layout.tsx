import ToastAlert from "@/components/ToastAlert";
import { SoundProvider } from "@/context/SoundContext";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getData } from "@/lib/storage";
import { login, logout } from "@/redux/authSlice";
import store from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast, { ToastConfig } from "react-native-toast-message";
import { Provider } from "react-redux";
import "./global.css";

SplashScreen.preventAutoHideAsync();
export const queryClient = new QueryClient();

const toastConfig: ToastConfig = {
  success: (props) => <ToastAlert type="success" text={props?.text1} />,
  error: (props) => <ToastAlert type="error" text={props?.text1} />,
};

function AppContent() {
  const [loaded, error] = useFonts({
    "Sans-Black": require("../assets/fonts/WorkSans-Black.ttf"),
    "Sans-Bold": require("../assets/fonts/WorkSans-Bold.ttf"),
    "Sans-Medium": require("../assets/fonts/WorkSans-Medium.ttf"),
    "Sans-Regular": require("../assets/fonts/WorkSans-Regular.ttf"),
    "Sans-SemiBold": require("../assets/fonts/WorkSans-SemiBold.ttf"),
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
