import { ArtPanel } from "../components/visuals";
import React from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { Screen, Card, Icon, Button, Notice, s } from "../components/ui";
import { useSession } from "../state/session";
import { money } from "../domain/model";
export default function Credits() {
  const { result, filingReceipt } = useSession();
  return (
    <Screen title="Tus créditos." eyebrow="TODO EN UN LUGAR">
      <ArtPanel
        kind="plans"
        title="Espacio para lo que viene"
        caption="Aquí podrás consultar tus créditos cuando estén disponibles."
      />
      {result?.favorable && (
        <Card>
          <Icon name="file-text" size={30} />
          <Text style={s.h2}>
            {filingReceipt
              ? "Radicación de prueba completada"
              : "Tienes una preaprobación de prueba"}
          </Text>
          <Text style={s.text}>
            {money(result.amount)} · {result.months} meses · {result.id}
          </Text>
          <Button
            title={
              filingReceipt
                ? "Ver radicación de prueba"
                : "Completar mi radicación"
            }
            onPress={() => router.push("/filing")}
          />
        </Card>
      )}
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
