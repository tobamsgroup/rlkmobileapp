import { Stack } from "expo-router";

// Groups the guardian screens into one route, so the root layout can drop
// all of them when the guardian logs out or a kid logs in
export default function GuardianLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
