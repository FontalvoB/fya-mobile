import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname, type Href } from "expo-router";
import { useSession } from "../state/session";

export function brandHeaderTop(safeTop: number) {
  return Math.max(safeTop, 20) + 10;
}

export function BrandLogo({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <View style={[b.logoCrop, compact && { width: 78, height: 32 }]}>
      <Image
        source={require("../../assets/FyaLogoVerde.png")}
        accessibilityLabel="FYA Social Capital"
        style={[
          b.logo,
          compact && { width: 82, height: 82, top: -27, left: -2 },
          light && { tintColor: "#DFEEE6" },
        ]}
      />
    </View>
  );
}
export function BottomNavigation({
  bottomInset = 0,
}: {
  bottomInset?: number;
}) {
  const { identity } = useSession();
  const pathname = usePathname();
  const creditRoutes = [
    "/simulator",
    "/application",
    "/result",
    "/tracking",
    "/credits",
  ];
  const items: {
    label: string;
    icon: React.ComponentProps<typeof Feather>["name"];
    path: Href;
    selected: boolean;
  }[] = [
    {
      label: "Inicio",
      icon: "flag",
      path: identity ? "/home" : "/",
      selected: ["/", "/home"].includes(pathname),
    },
    {
      label: "Crédito",
      icon: "dollar-sign",
      path: identity ? "/credits" : "/register",
      selected: creditRoutes.includes(pathname),
    },
    { label: "Pagos", icon: "file-text", path: "/credits", selected: false },
    {
      label: "Más",
      icon: "info",
      path: "/help",
      selected: ["/help", "/chat"].includes(pathname),
    },
    {
      label: "Ajustes",
      icon: "settings",
      path: identity ? "/profile" : "/register",
      selected: pathname === "/profile",
    },
  ];
  return (
    <LinearGradient
      colors={["#06494B", "#002C2D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[b.nav, { paddingBottom: Math.max(bottomInset, 12) }]}
    >
      {items.map(({ label, icon, path, selected }) => (
        <Pressable
          key={label}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected }}
          onPress={() => router.push(path)}
          style={({ pressed }) => [b.item, { opacity: pressed ? 0.65 : 1 }]}
        >
          <View style={[b.icon, selected && b.selected]}>
            <Feather
              name={icon}
              size={20}
              color={selected ? "#F0FFF7" : "#B8CFCA"}
            />
          </View>
          <Text style={[b.text, selected && { color: "#F0FFF7" }]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </LinearGradient>
  );
}
const b = StyleSheet.create({
  logoCrop: { width: 120, height: 48, overflow: "hidden" },
  logo: { position: "absolute", width: 126, height: 126, top: -41, left: -3 },
  nav: {
    flexDirection: "row",
    paddingTop: 10,
    paddingHorizontal: 14,
    minHeight: 76,
  },
  item: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  icon: { paddingHorizontal: 13, paddingVertical: 4, borderRadius: 20 },
  selected: { backgroundColor: "#FFFFFF14" },
  text: {
    color: "#C3D5D0",
    fontFamily: "Manrope",
    fontSize: 10,
    letterSpacing: 1,
  },
});
