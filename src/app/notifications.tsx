import React from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { Screen, Card, Button, Icon, s } from "../components/ui";
import { useSession } from "../state/session";
export default function Notifications() {
  const { result } = useSession();
  return (
    <Screen title="Tus novedades." eyebrow="NOTIFICACIONES">
      <Card>
        <Icon name="bell" />
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
