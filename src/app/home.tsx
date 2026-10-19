import React from "react";
import { Text, View, Image, Pressable } from "react-native";
import { router, Redirect, Href } from "expo-router";
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
import { artwork, ActionTile, PhotoBanner } from "../components/visuals";
export default function Home() {
  const { draft, identity, result } = useSession();
  if (!identity) return <Redirect href="/" />;
  const tabs: {
    icon: React.ComponentProps<typeof Icon>["name"];
    label: string;
    path: Href;
  }[] = [
    { icon: "home", label: "Inicio", path: "/home" },
    { icon: "file-text", label: "Solicitudes", path: "/tracking" },
    { icon: "credit-card", label: "Créditos", path: "/credits" },
    { icon: "user", label: "Perfil", path: "/profile" },
  ];
  return (
    <Screen
      back={false}
      footer={
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {tabs.map(({ icon, label, path }, i) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: i === 0 }}
              onPress={() => router.push(path)}
              style={{
                flex: 1,
                minHeight: 60,
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: i === 0 ? colors.lime : "transparent",
                  paddingHorizontal: 17,
                  paddingVertical: 5,
                  borderRadius: 18,
                }}
              >
                <Icon name={icon} color={i === 0 ? colors.ink : colors.muted} />
              </View>
              <Text
                style={[
                  s.small,
                  { fontSize: 11, color: i === 0 ? colors.ink : colors.muted },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      }
    >
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
              backgroundColor: colors.white,
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
          colors={["#075C4B", "#052F2B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 28, padding: 22, gap: 18, overflow: "hidden" }}
        >
          <View style={s.between}>
            <Text style={[s.kicker, { color: colors.lime }]}>
              LIBRANZA · LIBRE INVERSIÓN
            </Text>
            <Icon name="arrow-up-right" color={colors.lime} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ flex: 1, gap: 10 }}>
              <Text
                style={[
                  s.title,
                  { fontSize: 30, lineHeight: 35, color: "white" },
                ]}
              >
                Dale impulso{"\n"}a lo que sigue.
              </Text>
              <Text style={[s.small, { color: "#D3E8DD" }]}>
                Explora una cuota que se ajuste a tus planes.
              </Text>
            </View>
            <Image
              source={artwork.plans}
              accessible={false}
              style={{ width: 112, height: 142, borderRadius: 22 }}
            />
          </View>
          <Button
            title="Simular mi crédito"
            secondary
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
