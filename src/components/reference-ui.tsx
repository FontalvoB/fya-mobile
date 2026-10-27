import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Icon, fonts } from "./ui";
import { BrandLogo, BottomNavigation, brandHeaderTop } from "./brand";
import { BrandSurface } from "./glass";

export const referenceColors = {
  ink: "#062E2D",
  teal: "#004347",
  white: "#F8FAF8",
  muted: "#566661",
  glass: "#FFFFFF16",
  border: "#FFFFFF38",
};
export const coinArtwork = require("../../assets/Espiral_moneda.png");

export function ReferenceButton({
  title,
  onPress,
  busy = false,
}: {
  title: string;
  onPress: () => void;
  busy?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: busy, busy }}
      disabled={busy}
      onPress={onPress}
      style={({ pressed }) => [
        r.button,
        { opacity: pressed || busy ? 0.7 : 1 },
      ]}
    >
      <LinearGradient
        colors={["#075459", "#002E30"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={r.buttonFill}
      >
        {busy ? (
          <ActivityIndicator color={referenceColors.white} />
        ) : (
          <Text style={r.buttonText}>{title.toLocaleUpperCase("es-CO")}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
export function ReferenceBack() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver"
      onPress={() =>
        router.canGoBack() ? router.back() : router.replace("/register")
      }
      style={r.roundButton}
    >
      <Icon name="arrow-left" size={26} color="#E3ECE6" />
    </Pressable>
  );
}
export function ReferenceScreen({
  children,
  welcome = false,
  active = "Inicio",
}: {
  children: React.ReactNode;
  welcome?: boolean;
  active?: string;
}) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const headerTop = brandHeaderTop(insets.top);
  const headerHeight = headerTop + 70;
  return (
    <View style={r.outer}>
      <BrandSurface welcome={welcome}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View
              style={[r.header, { paddingTop: headerTop, paddingBottom: 22 }]}
            >
              <BrandLogo />
              {!welcome && (
                <View style={r.headerActions}>
                  <View style={r.demo}>
                    <Text
                      accessibilityLabel="Demostración local, sin envíos"
                      style={r.demoText}
                    >
                      DEMO
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Abrir asistente de ayuda"
                    onPress={() => router.push("/chat")}
                    style={r.roundButton}
                  >
                    <Icon name="message-circle" size={22} color="#D1DEDA" />
                  </Pressable>
                </View>
              )}
            </View>
            <View
              style={{
                flexGrow: 1,
                minHeight: Math.max(
                  0,
                  height - Math.max(insets.bottom, 12) - headerHeight - 64,
                ),
              }}
            >
              {children}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <BottomNavigation bottomInset={insets.bottom} />
      </BrandSurface>
    </View>
  );
}
export const r = StyleSheet.create({
  outer: { flex: 1, backgroundColor: "#D8DEDB", alignItems: "center" },
  frame: { flex: 1, width: "100%", maxWidth: 540, overflow: "hidden" },
  header: {
    marginHorizontal: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  logoCrop: {
    position: "absolute",
    left: 0,
    width: 120,
    height: 48,
    overflow: "hidden",
  },
  logo: { position: "absolute", width: 126, height: 126, top: -41, left: -3 },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  demo: {
    backgroundColor: "#003D3F",
    borderRadius: 30,
    paddingHorizontal: 21,
    paddingVertical: 9,
  },
  demoText: { color: "#D3DFDA", fontFamily: fonts.regular, fontSize: 11 },
  roundButton: {
    width: 46,
    height: 46,
    borderRadius: 25,
    backgroundColor: "#003D3F",
    alignItems: "center",
    justifyContent: "center",
  },
  button: { borderRadius: 40, overflow: "hidden", minHeight: 50 },
  buttonFill: {
    minHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: referenceColors.white,
    fontFamily: fonts.bold,
    fontSize: 14,
    letterSpacing: 1.4,
    textAlign: "center",
  },
  nav: {
    flexDirection: "row",
    paddingTop: 15,
    paddingHorizontal: 16,
    minHeight: 76,
  },
  navItem: {
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },
  navText: {
    color: "#C3D5D0",
    fontFamily: fonts.regular,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  coinIcon: {
    width: 19,
    height: 19,
    borderWidth: 1,
    borderColor: "#B8CFCA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 34 },
  eyebrow: {
    fontFamily: fonts.medium,
    color: "#3C514B",
    fontSize: 10,
    letterSpacing: 1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -1,
    color: referenceColors.ink,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: referenceColors.muted,
  },
});
