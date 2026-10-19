import { ArtPanel } from "../components/visuals";
import React from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { Screen, Card, Icon, Button, Notice, s } from "../components/ui";
export default function Credits() {
  return (
    <Screen title="Tus créditos." eyebrow="TODO EN UN LUGAR">
      <ArtPanel
        kind="plans"
        title="Espacio para lo que viene"
        caption="Aquí podrás consultar tus créditos cuando estén disponibles."
      />
      <Card>
        <Icon name="credit-card" size={36} />
        <Text style={s.h2}>Aún no hay créditos para mostrar</Text>
        <Text style={s.text}>
          Una solicitud con viabilidad preliminar no es un crédito aprobado o
          desembolsado.
        </Text>
        <Button
          title="Simular un crédito"
          onPress={() => router.push("/simulator")}
        />
      </Card>
      <Notice>
        La conexión con la fuente oficial de créditos se implementará en la
        siguiente fase.
      </Notice>
    </Screen>
  );
}
