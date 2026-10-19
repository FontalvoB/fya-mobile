import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Screen,
  Button,
  LinkButton,
  Icon,
  Reveal,
  colors,
  s,
} from "../components/ui";
import { artwork } from "../components/visuals";
import { useSession } from "../state/session";
export default function Welcome() {
  const { demo } = useSession();
  return (
    <Screen
      back={false}
      footer={
        <>
          <Button
            title="Comenzar mi registro"
            onPress={() => router.push("/register")}
          />
          <View style={{ alignItems: "center" }}>
            <LinkButton
              title="Explorar con un perfil de prueba"
              onPress={() => {
                demo();
                router.replace("/home");
              }}
            />
          </View>
        </>
      }
    >
      <Reveal>
        <View style={{ gap: 12 }}>
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: colors.lime,
              paddingVertical: 7,
              paddingHorizontal: 12,
              borderRadius: 30,
            }}
          >
            <Text style={s.kicker}>TU PRÓXIMO CAPÍTULO</Text>
          </View>
          <Text
            accessibilityRole="header"
            style={[
              s.title,
              { fontSize: 43, lineHeight: 47, letterSpacing: -2 },
            ]}
          >
            Más vida.{"\n"}
            <Text style={{ color: colors.green }}>Más posibilidades.</Text>
          </Text>
          <Text style={[s.text, { maxWidth: 350 }]}>
            Tu libranza, con claridad desde el primer paso. Para pensionados y
            docentes.
          </Text>
        </View>
        <View
          style={{
            height: 320,
            borderRadius: 30,
            overflow: "hidden",
            backgroundColor: colors.pale,
          }}
        >
          <ImageBackground
            source={artwork.lifestyle}
            style={{ flex: 1 }}
            imageStyle={{ resizeMode: "cover", width: "100%", height: "100%" }}
          >
            <View
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                backgroundColor: "#FFFFFFEB",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 30,
              }}
            >
              <Text style={[s.small, { color: colors.ink }]}>
                Hecho para tu nueva etapa
              </Text>
            </View>
            <LinearGradient
              colors={["transparent", "#073C35ED"]}
              style={[
                StyleSheet.absoluteFill,
                { justifyContent: "flex-end", padding: 20 },
              ]}
            >
              <View style={s.between}>
                <View style={{ flex: 1, gap: 5 }}>
                  <Text style={[s.h2, s.white]}>
                    Tus planes siguen creciendo.
                  </Text>
                  <Text style={[s.small, { color: "#E5F4E8" }]}>
                    Explora. Simula. Decide.
                  </Text>
                </View>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.lime,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="arrow-up-right" size={25} />
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
          {(["A tu ritmo", "Cada paso, claro", "Tú decides"] as const).map(
            (label, i) => (
              <View key={label} style={[s.row, { gap: 6 }]}>
                <Icon
                  name={(["smartphone", "eye", "sliders"] as const)[i]}
                  size={16}
                />
                <Text style={s.small}>{label}</Text>
              </View>
            ),
          )}
        </View>
      </Reveal>
    </Screen>
  );
}
