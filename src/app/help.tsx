import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Screen, Card, Icon, Notice, s } from "../components/ui";
const items = [
  [
    "¿Cómo funciona el recorrido?",
    "Crea un perfil de prueba, selecciona tu documento, simula un crédito y completa la solicitud. Revisa el resumen y finaliza con el código de demostración.",
  ],
  [
    "¿Qué documentos necesito?",
    "Documento de identidad por ambas caras, recibo de servicio público de los últimos 90 días y desprendible de pago. PDF, JPG o PNG de máximo 5 MB por archivo.",
  ],
  [
    "¿Se envía mi información?",
    "No. Los datos están en memoria durante la sesión y los archivos se seleccionan localmente. No hay un backend conectado.",
  ],
  [
    "¿Preaprobado significa aprobado?",
    "No. Solo significa que las cifras cumplen reglas de prueba. La aprobación, firma y desembolso requieren un proceso real posterior.",
  ],
  [
    "¿Qué pasa si respondo Sí en salud?",
    "Debes añadir un detalle. La demo muestra que se necesita revisión de asegurabilidad; no rechaza automáticamente por esa respuesta.",
  ],
];
export default function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Screen title="Estamos para orientarte." eyebrow="CÓMO FUNCIONA">
      {items.map(([q, a], i) => (
        <Card key={q}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: open === i }}
            onPress={() => setOpen(open === i ? null : i)}
          >
            <View style={s.between}>
              <Text style={[s.label, { flex: 1 }]}>{q}</Text>
              <Icon name={open === i ? "minus" : "plus"} />
            </View>
          </Pressable>
          {open === i && <Text style={s.text}>{a}</Text>}
        </Card>
      ))}
      <Notice>
        No se proporcionaron canales de soporte oficiales en el material. No se
        inventan teléfonos ni direcciones de contacto.
      </Notice>
    </Screen>
  );
}
