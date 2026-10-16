import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import { useReducedMotion } from "react-native-reanimated";
import { SessionProvider } from "../state/session";
import { colors } from "../components/ui";
export default function Layout() {
  const [loaded, error] = useFonts({
    Jakarta: PlusJakartaSans_400Regular,
    JakartaMedium: PlusJakartaSans_500Medium,
    JakartaBold: PlusJakartaSans_700Bold,
    Editorial: DMSerifDisplay_400Regular,
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
