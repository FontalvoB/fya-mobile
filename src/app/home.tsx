import React from "react";
import {
  Text,
  View,
  Image,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { router, Redirect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSession } from "../state/session";
import {
  Screen,
  Button,
  Card,
  Icon,
  Reveal,
  Notice,
  s,
  colors,
} from "../components/ui";
import { ActionTile, PhotoBanner } from "../components/visuals";
export default function Home() {
  const { draft, identity, result } = useSession();
  const { width } = useWindowDimensions();
  const compact = width < 360;
  if (!identity) return <Redirect href="/" />;
  return (
    <Screen back={false}>
      <Reveal>
        <View style={s.between}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={s.kicker}>TU ESPACIO FYA</Text>
            <Text style={s.title}>Hola, {draft.profile.firstName}.</Text>
            <Text style={s.text}>¿Qué plan tienes en mente?</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver notificaciones"
            onPress={() => router.push("/notifications")}
            style={{
              width: 48,
              height: 48,
              borderRadius: 18,
              backgroundColor: "#FFFFFF26",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.line,
            }}
          >
            <Icon name="bell" />
          </Pressable>
        </View>
        <LinearGradient
          colors={["#075459", "#002E30"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 28, padding: 22, gap: 18, overflow: "hidden" }}
        >
          <View style={s.between}>
            <Text style={[s.kicker, { color: "#D3E8DE" }]}>
              LIBRANZA · LIBRE INVERSIÓN
            </Text>
            <Icon name="arrow-up-right" color={colors.lime} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1, gap: 10 }}>
              <Text
                style={[
                  s.title,
                  {
                    fontSize: compact ? 26 : 30,
                    lineHeight: compact ? 31 : 35,
                    color: "white",
                  },
                ]}
              >
                Tus planes.{"\n"}Más cerca.
              </Text>
              <Text style={[s.small, { color: "#D3E8DD" }]}>
                Explora una cuota que se ajuste a tus planes.
              </Text>
            </View>
            <Image
              source={require("../../assets/Espiral_moneda.png")}
              accessible={false}
              style={{
                width: compact ? 88 : 112,
                height: 180,
                borderRadius: 60,
                opacity: 0.8,
                transform: [{ rotate: "180deg" }],
              }}
            />
          </View>
          <Button
            title="Simular mi crédito"
            onDark
            onPress={() => router.push("/simulator")}
          />
        </LinearGradient>
        <View style={{ gap: 12 }}>
          <Text style={s.h2}>Todo a la mano</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <ActionTile
              title="Mi solicitud"
              detail={
                result ? "Consulta tu avance" : "Prepara tu siguiente paso"
              }
              icon="file-text"
              accent
              onPress={() => router.push("/tracking")}
            />
            <ActionTile
              title="Cómo funciona"
              detail="Resuelve tus dudas"
              icon="compass"
              onPress={() => router.push("/help")}
            />
          </View>
        </View>
        {result && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver mi solicitud"
            onPress={() => router.push("/tracking")}
          >
            <Card>
              <View style={s.between}>
                <Text style={s.label}>Tu solicitud de prueba</Text>
                <Icon name="arrow-right" />
              </View>
              <Text style={s.small}>
                {result.favorable
                  ? "Viabilidad preliminar favorable"
                  : "Ajusta tu simulación"}{" "}
                · {result.id}
              </Text>
            </Card>
          </Pressable>
        )}
        <View style={{ gap: 12 }}>
          <View style={s.between}>
            <Text style={s.h2}>Tu próxima etapa</Text>
            <Text style={s.kicker}>CONTIGO</Text>
          </View>
          <PhotoBanner
            title="Más tiempo para tus planes."
            caption="Pensionados y docentes · FYA Social Capital"
          />
        </View>
        <Notice>
          Perfil habilitado en modo de prueba. Ningún crédito, tasa o resultado
          representa una oferta real.
        </Notice>
      </Reveal>
    </Screen>
  );
}
