import React from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Button,
  Card,
  Icon,
  Notice,
  s,
  colors,
} from "../components/ui";
import { useSession } from "../state/session";
import { money } from "../domain/model";
export default function Tracking() {
  const { result } = useSession();
  const timeline = result
    ? [
        ["Solicitud de prueba creada", "Referencia local. No enviada.", true],
        [
          result.favorable
            ? "Viabilidad preliminar favorable"
            : "Simulación no viable",
          result.favorable
            ? "Calculada con parámetros de prueba."
            : "Ajusta monto o plazo para volver a evaluar.",
          true,
        ],
        [
          "Revisión documental",
          result.favorable ? "Pendiente de un analista real." : "No iniciada.",
          false,
        ],
        ["Decisión de FYA", "No disponible en esta demostración.", false],
        ["Firma y desembolso", "Requieren proveedores reales.", false],
      ]
    : [];
  return (
    <Screen
      title="Cada paso, a la vista."
      eyebrow="MIS SOLICITUDES"
      footer={
        <Button
          title="Volver al inicio"
          onPress={() => router.replace("/home")}
        />
      }
    >
      {result ? (
        <>
          <Card dark>
            <Text style={[s.kicker, { color: colors.lime }]}>{result.id}</Text>
            <Text style={[s.title, s.white]}>{money(result.amount)}</Text>
            <Text style={[s.small, { color: "#CEDDCD" }]}>
              Creada en esta sesión · demostración
            </Text>
          </Card>
          <Card>
            {timeline.map(([title, detail, done], i) => (
              <View
                key={String(title)}
                style={{ flexDirection: "row", gap: 16 }}
              >
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: done ? colors.lime : colors.pale,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name={done ? "check" : "clock"} size={17} />
                  </View>
                  {i < 4 && (
                    <View
                      style={{
                        width: 1,
                        flex: 1,
                        minHeight: 36,
                        backgroundColor: colors.line,
                      }}
                    />
                  )}
                </View>
                <View style={{ flex: 1, paddingBottom: 25, gap: 6 }}>
                  <Text style={s.label}>{title}</Text>
                  <Text style={s.small}>{detail}</Text>
                </View>
              </View>
            ))}
          </Card>
          <Button
            secondary
            title="Ver detalle del resultado"
            onPress={() => router.push("/result")}
          />
        </>
      ) : (
        <Card>
          <Icon name="file-text" size={32} />
          <Text style={s.h2}>Tu próximo plan empieza aquí</Text>
          <Text style={s.text}>
            Aún no has completado una solicitud en esta sesión.
          </Text>
          <Button
            title="Explorar una simulación"
            onPress={() => router.push("/simulator")}
          />
        </Card>
      )}
      <Notice>
        El seguimiento es ilustrativo. Ningún analista ha recibido información.
      </Notice>
    </Screen>
  );
}
