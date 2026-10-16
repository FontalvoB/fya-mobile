import React from "react";
import { Text, View, ImageBackground, Pressable } from "react-native";
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
export default function Home() {
  const { draft, identity, result } = useSession();
  if (!identity) return <Redirect href="/" />;
  return (
    <Screen
      back={false}
      footer={
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {[
            ["home", "Inicio", "/home"],
            ["file-text", "Solicitudes", "/tracking"],
            ["credit-card", "Créditos", "/credits"],
            ["user", "Perfil", "/profile"],
          ].map(([icon, label, path]) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={() => router.push(path as any)}
              style={{
                minHeight: 54,
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <Icon
                name={icon as any}
                color={label === "Inicio" ? colors.green : colors.muted}
              />
              <Text
                style={[
                  s.small,
                  { color: label === "Inicio" ? colors.green : colors.muted },
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
          <View style={{ gap: 6 }}>
            <Text style={s.kicker}>QUÉ BUENO TENERTE AQUÍ</Text>
            <Text style={s.title}>Hola, {draft.profile.firstName}.</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver notificaciones"
            onPress={() => router.push("/notifications")}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="bell" />
          </Pressable>
        </View>
        <View style={{ height: 280, borderRadius: 28, overflow: "hidden" }}>
          <ImageBackground
            source={require("../../assets/welcome.jpg")}
            style={{ flex: 1 }}
            imageStyle={{ resizeMode: "cover" }}
          >
            <LinearGradient
              colors={["#0D342920", "#0D3429F5"]}
              style={{
                flex: 1,
                justifyContent: "flex-end",
                padding: 24,
                gap: 10,
              }}
            >
              <Text style={[s.kicker, { color: colors.lime }]}>
                UN NUEVO CAPÍTULO
              </Text>
              <Text
                style={[
                  s.title,
                  { fontSize: 32, lineHeight: 36, color: "white" },
                ]}
              >
                Tus planes merecen{"\n"}el siguiente paso.
              </Text>
              <Text style={[s.small, { color: "#E4EBDD" }]}>
                Libranza para pensionados y docentes.
              </Text>
            </LinearGradient>
          </ImageBackground>
        </View>
        <Card dark>
          <View style={s.between}>
            <Text style={[s.label, { color: colors.lime }]}>
              LIBRE INVERSIÓN
            </Text>
            <Icon name="arrow-up-right" color={colors.lime} />
          </View>
          <Text style={[s.h2, s.white]}>Dale forma a tu próximo plan</Text>
          <Text style={[s.text, { color: "#BED0C3" }]}>
            Explora un monto y conoce una cuota estimada antes de comenzar.
          </Text>
          <Button
            title="Simular mi crédito"
            secondary
            onPress={() => router.push("/simulator")}
          />
        </Card>
        {result ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver mi solicitud"
            onPress={() => router.push("/tracking")}
          >
            <Card>
              <View style={s.between}>
                <Text style={s.h2}>Tu solicitud de prueba</Text>
                <Icon name="arrow-right" />
              </View>
              <Text style={s.text}>
                {result.favorable
                  ? "Viabilidad preliminar favorable"
                  : "Ajusta tu simulación"}{" "}
                · {result.id}
              </Text>
            </Card>
          </Pressable>
        ) : (
          <View style={s.row}>
            <Icon name="compass" />
            <Text style={[s.text, { flex: 1 }]}>
              Tú eliges el ritmo. Puedes revisar y editar antes de finalizar.
            </Text>
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cómo funciona"
          onPress={() => router.push("/help")}
        >
          <View style={[s.between, { paddingVertical: 12 }]}>
            <Text style={s.label}>¿Cómo funciona FYA?</Text>
            <Icon name="arrow-right" />
          </View>
        </Pressable>
        <Notice>
          Perfil habilitado en modo de prueba. Ningún crédito, tasa o resultado
          representa una oferta real.
        </Notice>
      </Reveal>
    </Screen>
  );
}
