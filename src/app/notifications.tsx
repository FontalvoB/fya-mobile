import React from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Screen, Card, Button, Icon, s, colors } from "../components/ui";
import { useSession } from "../state/session";
export default function Notifications() {
  const { result } = useSession();
  return (
    <Screen title="Tus novedades." eyebrow="NOTIFICACIONES">
      <Card>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 22,
            backgroundColor: colors.lime,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="bell" size={28} />
        </View>
        <Text style={s.h2}>
          {result ? "Tu simulación está lista" : "Todo está al día"}
        </Text>
        <Text style={s.text}>
          {result
            ? "Ya puedes consultar el resultado de prueba y los próximos pasos ilustrativos."
            : "Cuando completes una simulación, podrás revisar aquí su resultado. No se envían notificaciones remotas."}
        </Text>
        {result && (
          <Button
            title="Consultar resultado"
            onPress={() => router.push("/result")}
          />
        )}
      </Card>
    </Screen>
  );
}
