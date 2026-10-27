import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { ReferenceButton, ReferenceScreen } from "../components/reference-ui";
import { GlassLayer } from "../components/glass";
import { fonts } from "../components/ui";
import { useSession } from "../state/session";

export default function Welcome() {
  const { demo } = useSession();
  const { height } = useWindowDimensions();
  const panelHeight = Math.max(440, Math.min(540, height * 0.55));
  return (
    <ReferenceScreen welcome>
      <View style={w.content}>
        <View style={[w.panel, { minHeight: panelHeight }]}>
          <GlassLayer intensity={16} />
          <View style={w.badge}>
            <Text style={w.badgeText}>Tu próximo capítulo</Text>
          </View>
          <Text accessibilityRole="header" style={w.title}>
            Tus planes.{"\n"}
            <Text style={{ color: "#002E2D" }}>Más cerca.</Text>
          </Text>
          <Text style={w.description}>
            Tu libranza, con claridad desde el primer paso. Para pensionados y
            docentes.
          </Text>
          <View style={w.primary}>
            <ReferenceButton
              title="Comenzar mi registro"
              onPress={() => router.push("/register")}
            />
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Explorar con un perfil de prueba"
          onPress={() => {
            demo();
            router.replace("/home");
          }}
          style={({ pressed }) => [w.explore, { opacity: pressed ? 0.65 : 1 }]}
        >
          <Text style={w.exploreText}>Explorar con un perfil de prueba</Text>
        </Pressable>
      </View>
    </ReferenceScreen>
  );
}
const w = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingBottom: 72, flexGrow: 1 },
  panel: {
    borderRadius: 38,
    borderWidth: 1,
    borderColor: "#FFFFFF70",
    boxShadow: "0px 12px 35px rgba(9, 52, 45, 0.09)",
    padding: 28,
    paddingBottom: 24,
    overflow: "hidden",
    alignItems: "flex-start",
  },
  badge: {
    backgroundColor: "#003D3F",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 30,
    marginTop: 6,
    marginBottom: 16,
  },
  badgeText: {
    color: "#F0F4EE",
    fontFamily: fonts.regular,
    fontSize: 14,
    letterSpacing: 1.1,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 38,
    lineHeight: 40,
    letterSpacing: -1.6,
    color: "#FFFFFF",
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 25,
    color: "#FFFFFF",
    textShadowColor: "#133E3670",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
    marginTop: 7,
    maxWidth: 245,
    letterSpacing: -0.5,
  },
  primary: {
    width: "100%",
    marginTop: "auto",
    paddingTop: 70,
    paddingHorizontal: 14,
  },
  explore: {
    alignSelf: "center",
    minHeight: 44,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B9C7C375",
    borderRadius: 30,
    paddingHorizontal: 13,
    marginTop: 22,
    backgroundColor: "#FFFFFF09",
  },
  exploreText: {
    fontFamily: fonts.medium,
    color: "#FFFFFF",
    fontSize: 13,
    letterSpacing: 1,
  },
});
