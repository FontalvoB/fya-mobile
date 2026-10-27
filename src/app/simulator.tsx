import { ArtPanel, SectionHeading } from "../components/visuals";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LoanSummaryCard } from "../components/LoanSummaryCard";
import {
  ReferenceButton,
  ReferenceScreen,
  r,
  referenceColors,
} from "../components/reference-ui";
import Slider from "@react-native-community/slider";
import { router, Redirect, useLocalSearchParams } from "expo-router";
import {
  Card,
  Field,
  Segments,
  YesNo,
  LinkButton,
  Notice,
  s,
  fonts,
} from "../components/ui";
import { useSession } from "../state/session";
import {
  estimate,
  money,
  validateLoan,
  validateAccount,
  Loan,
  policy,
} from "../domain/model";
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
    <ReferenceScreen active="Crédito">
      <View style={v.primary}>
        <LoanSummaryCard
          payment={e.payment}
          months={l.months}
          monthlyRate={policy.rate}
        />
        <View style={v.tabs}>
          {(["amount", "payment"] as const).map((mode) => (
            <Pressable
              key={mode}
              accessibilityRole="radio"
              accessibilityLabel={mode === "amount" ? "Por monto" : "Por cuota"}
              accessibilityState={{ selected: l.mode === mode }}
              onPress={() => update({ mode })}
              style={[v.tab, l.mode === mode && v.selectedTab]}
            >
              <Text style={v.tabText}>
                {mode === "amount" ? "Por monto" : "Por cuota"}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={v.amount}>
          <Text style={r.eyebrow}>
            {l.mode === "amount"
              ? "MONTO SOLICITADO (COP)"
              : "CUOTA DESEADA (COP)"}
          </Text>
          <TextInput
            accessibilityLabel={
              l.mode === "amount"
                ? "Monto solicitado (COP)"
                : "Cuota deseada (COP)"
            }
            keyboardType="number-pad"
            selectTextOnFocus
            value={money(l.mode === "amount" ? l.amount : l.payment).replace(
              "$",
              "$ ",
            )}
            onChangeText={(value) =>
              update(
                l.mode === "amount"
                  ? { amount: Number(value.replace(/\D/g, "")) }
                  : { payment: Number(value.replace(/\D/g, "")) },
              )
            }
            style={v.amountInput}
          />
          {l.mode === "payment" && (
            <Text style={[r.description, { marginTop: 8 }]}>
              Monto estimado: {money(e.amount)}
            </Text>
          )}
        </View>
        <View style={v.term}>
          <View style={s.between}>
            <Text style={v.termText}>Plazo</Text>
            <Text style={v.termText}>{l.months} meses</Text>
          </View>
          <Slider
            accessibilityLabel="Plazo en meses"
            minimumValue={12}
            maximumValue={144}
            step={12}
            value={l.months}
            onValueChange={(months) => update({ months })}
            minimumTrackTintColor={referenceColors.teal}
            maximumTrackTintColor="#F4F7F2"
            thumbTintColor={referenceColors.teal}
            style={{ height: 38, marginTop: 8 }}
          />
        </View>
        <View style={{ marginHorizontal: 8, marginTop: -12 }}>
          <ReferenceButton
            title="Continuar con esta simulación"
            onPress={() => {
              const issue = validateAccount(draft) || validateLoan(l);
              if (issue) {
                setError(issue);
                return;
              }
              if (edit === "1" && router.canGoBack()) router.back();
              else
                router.push({
                  pathname: "/application",
                  params: { step: "0" },
                });
            }}
          />
        </View>
        {!!error && <Notice error>{error}</Notice>}
      </View>
      <View style={v.details}>
        <View style={s.between}>
          <Text style={s.h2}>{draft.account.customerType}</Text>
          <LinkButton
            title="Editar perfil"
            onPress={() =>
              router.push({ pathname: "/identity", params: { edit: "1" } })
            }
          />
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
        <SectionHeading number="03" title="Tu acompañamiento" />
        <Card>
          <YesNo
            label="¿Te acompaña un asesor?"
            value={l.hasAdviser}
            onChange={(hasAdviser) =>
              update({
                hasAdviser,
                adviserCode: hasAdviser ? l.adviserCode : "",
              })
            }
          />
          {l.hasAdviser === true ? (
            <>
              <Field
                label="Código del asesor *"
                value={l.adviserCode}
                maxLength={policy.adviserCodeMaxLength}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="Código entregado por tu asesor"
                onChangeText={(adviserCode) =>
                  update({ adviserCode: adviserCode.trim() })
                }
              />
              <Text style={s.small}>
                Se asociará a esta solicitud para su futura gestión de
                comisiones. En esta demo no verificamos el código contra un
                registro real.
              </Text>
            </>
          ) : l.hasAdviser === false ? (
            <Text style={s.small}>
              Realizas esta solicitud directamente, sin código de asesor.
            </Text>
          ) : null}
        </Card>
        <SectionHeading number="04" title="Detalles de tu libranza" />
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
          Estimación ilustrativa con parámetros del prototipo. No incluye
          seguros ni cargos no definidos. No es una oferta ni aprobación.
        </Notice>
      </View>
    </ReferenceScreen>
  );
}

const v = StyleSheet.create({
  primary: { paddingHorizontal: 26, gap: 24, paddingBottom: 28 },
  tabs: { flexDirection: "row", gap: 14, marginHorizontal: 8 },
  tab: {
    minHeight: 42,
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#FFFFFF40",
    backgroundColor: "#FFFFFF0C",
  },
  selectedTab: { backgroundColor: "#003F41", borderColor: "#003F41" },
  tabText: {
    fontFamily: fonts.medium,
    color: "#FFFFFF",
    fontSize: 14,
    letterSpacing: 1,
  },
  amount: { marginHorizontal: 18, gap: 22, marginTop: 2 },
  amountInput: {
    minHeight: 40,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#FFFFFF40",
    borderRadius: 28,
    backgroundColor: "#FFFFFF0A",
    fontFamily: fonts.regular,
    fontSize: 20,
    letterSpacing: 4,
    textAlign: "center",
    color: "#FFFFFF",
  },
  term: { marginHorizontal: 16 },
  termText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: "#40564E",
    letterSpacing: 0.8,
  },
  details: {
    paddingHorizontal: 26,
    paddingTop: 22,
    paddingBottom: 32,
    gap: 22,
    borderTopWidth: 1,
    borderColor: "#FFFFFF38",
  },
});
