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
          <Text style={s.kicker}>FYA SOCIAL CAPITAL</Text>
          <Text style={[s.title, { fontSize: 44, lineHeight: 48 }]}>
            Lo que viene,{"\n"}también es tuyo.
          </Text>
          <Text style={s.text}>
            Una nueva etapa. Nuevos planes. Tu crédito por libranza, paso a
            paso.
          </Text>
        </View>
        <View
          style={{
            height: 310,
            borderRadius: 28,
            overflow: "hidden",
            backgroundColor: colors.pale,
          }}
        >
          <ImageBackground
            source={require("../../assets/welcome.jpg")}
            style={{ flex: 1 }}
            imageStyle={{ resizeMode: "cover" }}
          >
            <LinearGradient
              colors={["transparent", "#0D3429DD"]}
              style={[
                StyleSheet.absoluteFill,
                { justifyContent: "flex-end", padding: 22 },
              ]}
            >
              <View style={s.row}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: colors.lime,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon name="sun" size={18} />
                </View>
                <View>
                  <Text style={[s.label, s.white]}>
                    Más espacio para tus planes
                  </Text>
                  <Text style={[s.small, { color: "#DCE7DA" }]}>
                    Pensionados y docentes
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
        <View style={s.between}>
          <View style={s.row}>
            <Icon name="smartphone" size={18} />
            <Text style={s.small}>A tu ritmo</Text>
          </View>
          <View style={s.row}>
            <Icon name="eye" size={18} />
            <Text style={s.small}>Cada paso, claro</Text>
          </View>
          <View style={s.row}>
            <Icon name="lock" size={18} />
            <Text style={s.small}>Tú decides</Text>
          </View>
        </View>
      </Reveal>
    </Screen>
  );
}
