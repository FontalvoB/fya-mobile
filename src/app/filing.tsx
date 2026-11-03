import React, { useCallback, useMemo, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text } from "react-native";
import { Redirect, router, useFocusEffect } from "expo-router";
import { useSession } from "../state/session";
import {
  activeFilingSteps,
  changeFilingValues,
  fieldOptions,
  filingCalculations,
  filingSections,
  FilingDraft,
  FilingField,
  validateFiling,
  validateFilingStep,
  visibleFilingFields,
} from "../domain/filing";
import { money, policy } from "../domain/model";
import {
  Screen,
  Button,
  Card,
  Choice,
  Field,
  Icon,
  LinkButton,
  Notice,
  s,
  colors,
} from "../components/ui";
import { DateField, SelectField } from "../components/SelectionFields";
import { DocumentCard } from "../components/DocumentCard";
import { FilingFinancials } from "../components/FilingFinancials";
import { FilingReview } from "../components/FilingReview";

export default function Filing() {
  const { identity, draft, result, filing, setFiling, filingReceipt } =
    useSession();
  const [error, setError] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const steps = useMemo(
    () => (filing ? activeFilingSteps(filing) : []),
    [filing],
  );
  const index = Math.max(
    0,
    steps.findIndex((step) => step.id === filing?.step),
  );
  const step = steps[index];
  const submitted = !!filingReceipt && filingReceipt.resultId === result?.id;
  const go = useCallback(
    (id: string) => {
      setError("");
      setFiling((current) =>
        current
          ? { ...current, step: id, savedAt: new Date().toISOString() }
          : current,
      );
    },
    [setFiling],
  );
  const back = useCallback(() => {
    if (!submitted && index > 0) go(steps[index - 1].id);
    else if (router.canGoBack()) router.back();
    else router.replace("/result");
  }, [go, index, steps, submitted]);
  useFocusEffect(
    useCallback(() => {
      const listener = BackHandler.addEventListener("hardwareBackPress", () => {
        back();
        return true;
      });
      return () => listener.remove();
    }, [back]),
  );
  if (!identity) return <Redirect href="/" />;
  if (!result?.favorable || !filing || filing.resultId !== result.id)
    return <Redirect href={result ? "/result" : "/home"} />;
  function update(values: Record<string, string>) {
    setError("");
    setFiling((current) =>
      current ? changeFilingValues(current, values) : current,
    );
  }
  function patch(values: Partial<FilingDraft>) {
    setError("");
    setFiling((current) =>
      current
        ? {
            ...current,
            ...values,
            values: { ...current.values, reviewed: "No" },
            savedAt: new Date().toISOString(),
          }
        : current,
    );
  }
  function next() {
    if (!filing || !result || !step) return;
    const issue = validateFilingStep(filing, step, result);
    if (issue) {
      setError(issue);
      return;
    }
    if (index < steps.length - 1) {
      go(steps[index + 1].id);
      return;
    }
    const allIssue = validateFiling(filing, result, draft.profile);
    if (allIssue) {
      const invalid = steps.find((item) =>
        validateFilingStep(filing, item, result),
      );
      if (invalid) go(invalid.id);
      setError(allIssue);
      return;
    }
    router.push({ pathname: "/otp", params: { phase: "filing" } });
  }
  function fieldControl(field: FilingField) {
    if (!filing) return null;
    const value = filing.values[field.key] || "";
    const label = field.label + (field.required && !field.locked ? " *" : "");
    const onChange = (text: string) => update({ [field.key]: text });
    if (field.kind === "select")
      return (
        <SelectField
          key={field.key}
          label={label}
          value={value}
          options={fieldOptions(field, filing.values)}
          searchable={fieldOptions(field, filing.values).length > 10}
          disabled={!!field.parent && !filing.values[field.parent]}
          onChange={onChange}
        />
      );
    if (field.kind === "date")
      return (
        <DateField
          key={field.key}
          label={label}
          value={value}
          minDate={filing.values.birthDate || "1900-01-01"}
          onChange={onChange}
        />
      );
    if (field.kind === "check")
      return (
        <Choice
          key={field.key}
          label={field.label}
          selected={value === "Sí"}
          onPress={() => onChange(value === "Sí" ? "No" : "Sí")}
        />
      );
    return (
      <Field
        key={field.key}
        label={label}
        value={value}
        editable={!field.locked}
        onChangeText={onChange}
        keyboardType={
          ["money", "digits"].includes(field.kind || "")
            ? "number-pad"
            : field.kind === "decimal"
              ? "decimal-pad"
              : field.key.toLowerCase().includes("email")
                ? "email-address"
                : "default"
        }
        autoCapitalize={
          field.key.toLowerCase().includes("email") ? "none" : "sentences"
        }
        multiline={field.kind === "area"}
        maxLength={field.kind === "area" ? 2000 : 250}
        placeholder={field.kind === "money" ? "0" : undefined}
      />
    );
  }
  if (submitted && filingReceipt)
    return (
      <Screen
        title="Tu radicación, preparada."
        eyebrow="RADICACIÓN DE PRUEBA"
        onBack={back}
        subtitle="Completaste la información para el estudio final."
        footer={
          <Button
            title="Ver seguimiento"
            onPress={() => router.replace("/tracking")}
          />
        }
      >
        <Card dark>
          <Icon name="check-circle" color={colors.lime} size={36} />
          <Text style={[s.kicker, { color: colors.lime }]}>
            {filingReceipt.id}
          </Text>
          <Text style={[s.title, s.white]}>
            {money(filingReceipt.credit.amount)}
          </Text>
          <Text style={[s.text, { color: "#CFDDCD" }]}>
            {new Date(filingReceipt.date).toLocaleString("es-CO")}
          </Text>
        </Card>
        <Card>
          <Text style={s.h2}>Lo que sigue</Text>
          {[
            "Radicación de prueba: completa",
            "Estudio final: pendiente de un analista",
            "Firma electrónica: pendiente",
            "Desembolso: pendiente",
          ].map((text) => (
            <Text key={text} style={s.text}>
              {text}
            </Text>
          ))}
        </Card>
        <Notice>
          Esta referencia es local. No se han enviado datos a FYA ni se han
          realizado firma o desembolso.
        </Notice>
        <Button
          secondary
          title={
            showReceipt
              ? "Ocultar mis datos radicados"
              : "Ver mis datos radicados"
          }
          onPress={() => setShowReceipt(!showReceipt)}
        />
        {showReceipt && (
          <FilingReview
            filing={filingReceipt.snapshot}
            result={filingReceipt.credit}
          />
        )}
      </Screen>
    );
  const firstInvalid = steps.findIndex((item) =>
    validateFilingStep(filing, item, result),
  );
  const calc = filingCalculations(filing, result);
  return (
    <Screen
      title={step.title}
      eyebrow={`RADICACIÓN · ${filingSections[step.section].toUpperCase()} · ${step.section + 1} / 8`}
      subtitle={step.description}
      onBack={back}
      progress={index / steps.length}
      footer={
        <>
          <Text style={s.small}>
            Paso {index + 1} de {steps.length} · Avance guardado durante esta
            sesión
          </Text>
          {!!error && <Notice error>{error}</Notice>}
          <Button
            title={
              step.kind === "summary"
                ? "Confirmar radicación con código"
                : "Guardar y continuar"
            }
            onPress={next}
          />
          <LinkButton
            title={
              index > 0 ? "Volver al paso anterior" : "Volver al resultado"
            }
            onPress={back}
          />
        </>
      }
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {filingSections.map((label, section) => {
          const items = steps.filter((item) => item.section === section);
          const complete = items.every(
            (item) => !validateFilingStep(filing, item, result),
          );
          const first = steps.findIndex((item) => item.section === section);
          const disabled =
            !items.length ||
            (!complete && first > firstInvalid && firstInvalid >= 0);
          return (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={`Sección ${label}`}
              accessibilityState={{
                disabled,
                selected: section === step.section,
              }}
              disabled={disabled}
              onPress={() => go(items[0].id)}
              style={{
                padding: 12,
                minHeight: 44,
                borderRadius: 16,
                backgroundColor:
                  section === step.section ? colors.green : colors.pale,
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <Text
                style={[
                  s.small,
                  { color: section === step.section ? "white" : colors.ink },
                ]}
              >
                {section + 1}. {label}
                {!items.length ? " · No aplica" : complete ? " ✓" : ""}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {step.id === "identity" && (
        <Notice>
          Referencia de preaprobación: {result.id}. Puedes salir y retomar
          durante esta sesión. Cerrar sesión o recargar elimina el borrador.
        </Notice>
      )}
      {!!step.fields.some((field) => !field.locked && field.demo) && (
        <LinkButton
          title="Completar este paso con datos de ejemplo"
          onPress={() => {
            // Apply selectors before dependent cities, then conditional fields.
            let current = filing;
            for (const field of step.fields)
              if (!field.locked && (!field.when || field.when(current.values)))
                current = changeFilingValues(current, {
                  [field.key]: field.demo || "",
                });
            setError("");
            setFiling(current);
          }}
        />
      )}
      {!!step.fields.length && (
        <Card>{visibleFilingFields(step, filing).map(fieldControl)}</Card>
      )}
      {step.id === "health" && (
        <Card>
          <Text style={s.h2}>Tu declaración anterior</Text>
          {draft.declaration.health.some(Boolean) ? (
            draft.declaration.health.map(
              (value, i) =>
                value && (
                  <Text key={i} style={s.text}>
                    Pregunta {i + 1}: {draft.declaration.details[i]}
                  </Text>
                ),
            )
          ) : (
            <Text style={s.text}>
              No reportaste enfermedades en la declaración. Si hubo cambios,
              descríbelos en Comentarios.
            </Text>
          )}
        </Card>
      )}
      {step.id === "cashflow" && (
        <Card dark>
          <Text style={[s.kicker, { color: colors.lime }]}>
            FLUJO NETO MENSUAL
          </Text>
          <Text style={[s.title, s.white]}>{money(calc.net)}</Text>
          <Text style={[s.small, { color: "#CFDDCD" }]}>
            Ingresos {money(calc.income)} menos egresos {money(calc.expenses)}
          </Text>
        </Card>
      )}
      {step.id === "assets" && (
        <Card dark>
          <Text style={[s.kicker, { color: colors.lime }]}>
            PATRIMONIO NETO
          </Text>
          <Text style={[s.title, s.white]}>{money(calc.equity)}</Text>
        </Card>
      )}
      {step.id === "bank" && (
        <Card dark>
          <Text style={[s.kicker, { color: colors.lime }]}>
            TU PREAPROBACIÓN DE PRUEBA
          </Text>
          <Text style={[s.title, s.white]}>{money(result.amount)}</Text>
          <Text style={[s.text, { color: "#CFDDCD" }]}>
            {result.months} meses · {money(result.payment)} / mes · Tasa de
            referencia {(policy.rate * 100).toFixed(2)}% M.V.
          </Text>
          <Text style={[s.small, { color: "#CFDDCD" }]}>
            A desembolsar después de compras de cartera: {money(calc.payout)}
          </Text>
        </Card>
      )}
      {(step.kind === "capacity" || step.kind === "obligations") && (
        <FilingFinancials
          filing={filing}
          result={result}
          kind={step.kind}
          onChange={patch}
        />
      )}
      {step.kind === "documents" && (
        <>
          {draft.documents.front && draft.documents.back && (
            <Button
              secondary
              title="Usar ambas caras del registro"
              onPress={() =>
                patch({
                  documents: {
                    ...filing.documents,
                    front: draft.documents.front,
                    back: draft.documents.back,
                  },
                })
              }
            />
          )}
          {(
            [
              ["front", "Frente del documento de identidad"],
              ["back", "Reverso del documento de identidad"],
              ["income", "Comprobante de ingresos"],
              ["bank", "Certificado bancario"],
            ] as const
          ).map(([key, title]) => (
            <DocumentCard
              key={key}
              allowCamera={key === "front" || key === "back"}
              title={title}
              hint={
                key === "income"
                  ? "Adjunta el último desprendible de nómina o mesada para esta radicación."
                  : key === "bank"
                    ? "A tu nombre y emitido en los últimos 30 días."
                    : "Ambas caras deben estar completas y legibles."
              }
              value={filing.documents[key]}
              onChange={(value) =>
                patch({ documents: { ...filing.documents, [key]: value } })
              }
            />
          ))}
          <Card>
            <DateField
              label="Fecha de emisión del certificado bancario *"
              value={filing.values.bankCertificateDate || ""}
              onChange={(value) => update({ bankCertificateDate: value })}
            />
            <Choice
              label="El certificado y la cuenta bancaria están a mi nombre"
              selected={filing.values.accountOwner === "Sí"}
              onPress={() =>
                update({
                  accountOwner:
                    filing.values.accountOwner === "Sí" ? "No" : "Sí",
                })
              }
            />
          </Card>
          <Card>
            <Text style={s.h2}>Soportes que gestiona FYA</Text>
            <Text style={s.text}>
              Reporte de centrales: restringido; requiere tu autorización y la
              consulta de FYA.
            </Text>
            <Text style={s.text}>
              Certificado de firma: pendiente del proveedor de firma
              electrónica.
            </Text>
            <Text style={s.text}>
              Autorización de datos:{" "}
              {draft.declaration.dataConsent
                ? "aceptada en la solicitud de prueba"
                : "pendiente"}
              .
            </Text>
          </Card>
        </>
      )}
      {step.kind === "summary" && (
        <>
          <FilingReview filing={filing} result={result} onEdit={go} />
          <Notice>
            El código confirma esta radicación de prueba. No constituye la firma
            del pagaré ni envía información a FYA.
          </Notice>
        </>
      )}
    </Screen>
  );
}
