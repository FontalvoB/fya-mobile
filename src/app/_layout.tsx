import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useReducedMotion } from "react-native-reanimated";
import { SessionProvider } from "../state/session";
import { colors } from "../components/ui";
export default function Layout() {
  const [loaded, error] = useFonts({
    Manrope: require("@expo-google-fonts/manrope/400Regular/Manrope_400Regular.ttf"),
    ManropeMedium: require("@expo-google-fonts/manrope/500Medium/Manrope_500Medium.ttf"),
    ManropeBold: require("@expo-google-fonts/manrope/700Bold/Manrope_700Bold.ttf"),
    ManropeExtraBold: require("@expo-google-fonts/manrope/800ExtraBold/Manrope_800ExtraBold.ttf"),
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
