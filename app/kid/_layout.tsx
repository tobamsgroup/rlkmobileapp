import { Stack } from "expo-router";

export default function KidLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AIPopup" />
      <Stack.Screen name="AvatarSelection" />
    </Stack>
  );
}
