import { ArtPanel } from "../components/visuals";
import React from "react";
import { View, Text } from "react-native";
import { router, Redirect } from "expo-router";
import {
  Screen,
  Button,
  Card,
  Icon,
  Notice,
  Reveal,
  s,
  colors,
} from "../components/ui";
import { useSession } from "../state/session";
import { money } from "../domain/model";
export default function Result() {
  const { result } = useSession();
  if (!result) return <Redirect href="/home" />;
  return (
    <Screen
      back={false}
      title={
        result.favorable ? "Un paso más cerca." : "Busquemos otro equilibrio."
      }
      eyebrow="RESULTADO DE PRUEBA"
      subtitle={
        result.favorable
          ? "Tu simulación tiene viabilidad preliminar favorable."
          : "La cuota supera la capacidad de descuento de esta simulación."
      }
      footer={
        <Button
          title="Ver seguimiento de prueba"
          onPress={() => router.replace("/tracking")}
        />
      }
    >
      <Reveal>
        <ArtPanel
          kind="plans"
          title={
            result.favorable
              ? "Un avance para tus planes"
              : "Ajustemos tu próximo paso"
          }
          caption="Este resultado es una simulación, no una aprobación de crédito."
        />
        <Card dark>
          <Text style={[s.kicker, { color: colors.lime }]}>
            {result.favorable
              ? "PREAPROBADO · SIMULACIÓN"
              : "NO VIABLE · SIMULACIÓN"}
          </Text>
          <Text style={[s.title, s.white]}>{money(result.amount)}</Text>
          <Text style={[s.text, { color: "#CFDDCD" }]}>
            {money(result.payment)} / mes · {result.months} meses
          </Text>
          <Text style={[s.small, { color: "#CFDDCD" }]}>{result.id}</Text>
        </Card>
        <Card>
          {[
            ["Monto y plazo", "Dentro de los rangos de prueba", true],
            [
              "Capacidad de descuento",
              money(result.capacity) + " disponibles",
              result.favorable,
            ],
            ["Centrales de riesgo", "Sin reportes: respuesta simulada", true],
            [
              "Declaración de salud",
              result.healthReview
                ? "Requiere revisión de asegurabilidad"
                : "Sin respuestas afirmativas",
              !result.healthReview,
            ],
          ].map(([label, detail, ok]) => (
            <View key={String(label)} style={s.row}>
              <Icon
                name={ok ? "check-circle" : "info"}
                color={ok ? colors.green : "#916623"}
              />
              <View style={{ flex: 1 }}>
                <Text style={s.label}>{label}</Text>
                <Text style={s.small}>{detail}</Text>
              </View>
            </View>
          ))}
        </Card>
        <Notice>
          No es una aprobación de crédito. No hubo envío, revisión documental
          oficial, firma ni desembolso.
        </Notice>
        <Button
          title="Ajustar monto o plazo"
          secondary
          onPress={() => router.push("/simulator")}
        />
      </Reveal>
    </Screen>
  );
}
