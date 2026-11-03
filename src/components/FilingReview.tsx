import React, { useState } from "react";
import { Text } from "react-native";
import {
  FilingDraft,
  activeFilingSteps,
  filingSections,
  visibleFilingFields,
  validateFilingStep,
  filingCalculations,
} from "../domain/filing";
import { Result, money } from "../domain/model";
import { Button, Card, LinkButton, s } from "./ui";

export function FilingReview({
  filing,
  result,
  onEdit,
}: {
  filing: FilingDraft;
  result: Result;
  onEdit?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const steps = activeFilingSteps(filing);
  const calc = filingCalculations(filing, result);
  return (
    <>
      {filingSections.map((section, index) => {
        const items = steps.filter((step) => step.section === index);
        const issue = items
          .map((step) => validateFilingStep(filing, step, result))
          .find(Boolean);
        return (
          <Card key={section}>
            <Text style={s.kicker}>
              {String(index + 1).padStart(2, "0")} ·{" "}
              {items.length
                ? index === 7
                  ? "REVISIÓN FINAL"
                  : issue
                    ? "PENDIENTE"
                    : "COMPLETA"
                : "NO APLICA"}
            </Text>
            <Text style={s.h2}>{section}</Text>
            {items.length > 0 && (
              <LinkButton
                title={
                  (expanded === index ? "Ocultar " : "Ver ") +
                  section.toLowerCase()
                }
                onPress={() => setExpanded(expanded === index ? null : index)}
              />
            )}
            {expanded === index && (
              <>
                {items
                  .flatMap((step) => visibleFilingFields(step, filing))
                  .filter((field) => field.key !== "reviewed")
                  .map((field) => (
                    <Text key={field.key} style={s.text}>
                      {field.label}:{" "}
                      {filing.values[field.key] || "Sin registrar"}
                    </Text>
                  ))}
                {index === 5 && (
                  <>
                    <Text style={s.text}>
                      Preaprobado: {money(result.amount)} · {result.months}{" "}
                      meses · {money(result.payment)} / mes
                    </Text>
                    <Text style={s.text}>
                      Margen de descuento: {money(calc.margin)} · Desembolso
                      estimado: {money(calc.payout)}
                    </Text>
                    {filing.deductions.map((row) => (
                      <Text key={row.id} style={s.text}>
                        Deducción: {row.type} · {row.name} ·{" "}
                        {money(Number(row.amount))}
                      </Text>
                    ))}
                    {filing.purchases.map((row) => (
                      <Text key={row.id} style={s.text}>
                        Compra de cartera: {row.name} ·{" "}
                        {money(Number(row.amount))}
                      </Text>
                    ))}
                    {Object.entries(filing.obligations).map(([key, value]) => (
                      <Text key={key} style={s.text}>
                        {key}: cuota {money(Number(value.payment))} · saldo{" "}
                        {money(Number(value.balance))}
                      </Text>
                    ))}
                  </>
                )}
                {index === 6 && (
                  <>
                    {Object.entries(filing.documents).map(([key, file]) => (
                      <Text key={key} style={s.text}>
                        {
                          (
                            {
                              front: "Frente de identidad",
                              back: "Reverso de identidad",
                              income: "Comprobante de ingresos",
                              bank: "Certificado bancario",
                            } as Record<string, string>
                          )[key]
                        }
                        : {file?.name}
                      </Text>
                    ))}
                    <Text style={s.text}>
                      Fecha del certificado:{" "}
                      {filing.values.bankCertificateDate || "Pendiente"}
                    </Text>
                    <Text style={s.text}>
                      Cuenta a tu nombre:{" "}
                      {filing.values.accountOwner || "Pendiente"}
                    </Text>
                  </>
                )}
              </>
            )}
            {!!onEdit && items.length > 0 && (
              <Button
                secondary
                title={`Editar ${section.toLowerCase()}`}
                onPress={() => onEdit(items[0].id)}
              />
            )}
          </Card>
        );
      })}
    </>
  );
}
