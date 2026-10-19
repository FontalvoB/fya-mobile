import { ArtPanel, SectionHeading } from "../components/visuals";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { router, Redirect, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Button,
  Card,
  Field,
  Segments,
  Notice,
  s,
  colors,
} from "../components/ui";
import { useSession } from "../state/session";
import { estimate, money, validateLoan, Loan } from "../domain/model";
export default function Simulator() {
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const { draft, setDraft, identity } = useSession();
  const [error, setError] = useState("");
  const l = draft.loan,
    e = estimate(l);
  if (!identity) return <Redirect href="/" />;
  function update(v: Partial<Loan>) {
    setDraft((d) => ({
      ...d,
      loan: { ...d.loan, ...v },
      declaration: { ...d.declaration, reviewed: false },
    }));
  }
  return (
    <Screen
      title="Imagina lo que sigue."
      eyebrow="SIMULA TU LIBRANZA"
      subtitle="Ajusta las cifras. Encuentra un punto de partida cómodo para ti."
      footer={
        <Button
          title="Continuar con esta simulación"
          onPress={() => {
            const issue = validateLoan(l);
            if (issue) {
              setError(issue);
              return;
            }
            if (edit === "1" && router.canGoBack()) router.back();
            else
              router.push({ pathname: "/application", params: { step: "0" } });
          }}
        />
      }
    >
      <SectionHeading
        number="01"
        title="Diseña tu simulación"
        detail="Elige tu perfil para comenzar"
      />
      <Segments
        items={["Pensionado", "Docente"]}
        value={l.type}
        onChange={(type) =>
          update({
            type,
            payer:
              type === "Pensionado"
                ? "FOPEP"
                : "Secretaría de Educación (prueba)",
            pensionDeduction: 0,
          })
        }
      />
      <Card dark>
        <Text style={[s.small, { color: "#CCDCCF" }]}>
          CUOTA MENSUAL ESTIMADA
        </Text>
        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[
            s.title,
            {
              fontSize: 43,
              lineHeight: 52,
              color: colors.lime,
              fontVariant: ["tabular-nums"],
            },
          ]}
        >
          {money(e.payment)}
        </Text>
        <View style={[s.divider, { backgroundColor: "#38604C" }]} />
        <View style={s.between}>
          <Text style={[s.small, s.white]}>{l.months} meses</Text>
          <Text style={[s.small, s.white]}>Tasa de prueba: 1,6% / mes</Text>
        </View>
      </Card>
      <Segments
        items={["Por monto", "Por cuota"]}
        value={l.mode === "amount" ? "Por monto" : "Por cuota"}
        onChange={(v) =>
          update({ mode: v === "Por monto" ? "amount" : "payment" })
        }
      />
      <Field
        label={
          l.mode === "amount" ? "Monto solicitado (COP)" : "Cuota deseada (COP)"
        }
        keyboardType="number-pad"
        value={String(l.mode === "amount" ? l.amount : l.payment)}
        onChangeText={(v) =>
          update(
            l.mode === "amount"
              ? { amount: Number(v.replace(/\D/g, "")) }
              : { payment: Number(v.replace(/\D/g, "")) },
          )
        }
      />
      {l.mode === "payment" && (
        <Text style={s.label}>Monto estimado: {money(e.amount)}</Text>
      )}
      <View style={{ gap: 8 }}>
        <View style={s.between}>
          <Text style={s.label}>Plazo</Text>
          <Text style={s.h2}>{l.months} meses</Text>
        </View>
        <Slider
          accessibilityLabel="Plazo en meses"
          minimumValue={12}
          maximumValue={144}
          step={12}
          value={l.months}
          onValueChange={(months) => update({ months })}
          minimumTrackTintColor={colors.green}
          maximumTrackTintColor={colors.line}
          thumbTintColor={colors.green}
        />
        <View style={s.between}>
          <Text style={s.small}>12 meses</Text>
          <Text style={s.small}>144 meses</Text>
        </View>
      </View>
      <SectionHeading
        number="02"
        title="Tu capacidad mensual"
        detail="Ingresos y deducciones, en un solo lugar"
      />
      <Card>
        <Text style={s.kicker}>TU CAPACIDAD</Text>
        {(
          [
            ["income", "Ingresos mensuales (COP)"],
            ["healthDeduction", "Deducción de salud (COP)"],
            ...(l.type === "Docente"
              ? [["pensionDeduction", "Deducción de pensión (COP)"]]
              : []),
            ["otherDeduction", "Otras deducciones (COP)"],
          ] as [keyof Loan, string][]
        ).map(([key, label]) => (
          <Field
            key={key}
            label={label}
            keyboardType="number-pad"
            value={String(l[key])}
            onChangeText={(v) =>
              update({ [key]: Number(v.replace(/\D/g, "")) })
            }
          />
        ))}
        <View style={s.between}>
          <Text style={s.small}>Capacidad estimada</Text>
          <Text style={s.label}>{money(e.capacity)}</Text>
        </View>
      </Card>
      <SectionHeading number="03" title="Detalles de tu libranza" />
      <Card>
        <Text style={s.label}>{l.product}</Text>
        <Text style={s.text}>Pagaduría: {l.payer}</Text>
        {l.type === "Pensionado" && (
          <>
            <Text style={s.label}>Modalidad de pensión</Text>
            <Segments
              items={["Otro", "Vejez", "Sobrevivencia", "Invalidez"]}
              value={l.modality}
              onChange={(modality) => update({ modality })}
            />
          </>
        )}
      </Card>
      {e.payment > e.capacity && (
        <Notice error>
          La cuota supera la capacidad estimada de prueba. Puedes reducir el
          monto o ampliar el plazo.
        </Notice>
      )}
      <ArtPanel
        kind="plans"
        title="Encuentra tu equilibrio"
        caption="Prueba diferentes montos y plazos antes de continuar."
      />
      <Notice>
        Estimación ilustrativa con parámetros del prototipo. No incluye seguros
        ni cargos no definidos. No es una oferta ni aprobación.
      </Notice>
      {!!error && <Notice error>{error}</Notice>}
    </Screen>
  );
}
