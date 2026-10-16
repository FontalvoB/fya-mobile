import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useReducedMotion } from "react-native-reanimated";
import { SessionProvider } from "../state/session";
import { colors } from "../components/ui";
export default function Layout() {
  const [loaded, error] = useFonts({
    Jakarta: require("@expo-google-fonts/plus-jakarta-sans/400Regular/PlusJakartaSans_400Regular.ttf"),
    JakartaMedium: require("@expo-google-fonts/plus-jakarta-sans/500Medium/PlusJakartaSans_500Medium.ttf"),
    JakartaBold: require("@expo-google-fonts/plus-jakarta-sans/700Bold/PlusJakartaSans_700Bold.ttf"),
    Editorial: require("@expo-google-fonts/dm-serif-display/400Regular/DMSerifDisplay_400Regular.ttf"),
  });
  const reduced = useReducedMotion();
  if (!loaded && !error) return null;
  return (
    <SessionProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: reduced ? "none" : "slide_from_right",
        }}
      />
    </SessionProvider>
  );
}
