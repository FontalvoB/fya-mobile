import React from "react";
import { Text, View } from "react-native";
import {
  FilingDraft,
  FilingEntry,
  filingCalculations,
  obligationTypes,
} from "../domain/filing";
import { Result, money } from "../domain/model";
import { Button, Card, Field, LinkButton, Notice, s, colors } from "./ui";
import { SelectField } from "./SelectionFields";

export function FilingFinancials({
  filing,
  result,
  kind,
  onChange,
}: {
  filing: FilingDraft;
  result: Result;
  kind: "capacity" | "obligations";
  onChange: (patch: Partial<FilingDraft>) => void;
}) {
  const c = filingCalculations(filing, result);
  function moneyInput(
    label: string,
    value: string,
    onChangeText: (value: string) => void,
  ) {
    return (
      <Field
        label={label}
        value={value}
        keyboardType="number-pad"
        onChangeText={onChangeText}
        placeholder="0"
      />
    );
  }
  function entries(key: "deductions" | "purchases") {
    const isDeduction = key === "deductions";
    const items = filing[key];
    function update(id: string, patch: Partial<FilingEntry>) {
      onChange({
        [key]: items.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      });
    }
    return (
      <>
        <Text style={s.h2}>
          {isDeduction ? "Deducciones adicionales" : "Compra de cartera"}
        </Text>
        {!items.length && (
          <Text style={s.text}>
            {isDeduction
              ? "No has agregado deducciones adicionales."
              : "No has agregado carteras a comprar."}
          </Text>
        )}
        {items.map((item, index) => (
          <Card key={item.id}>
            <Text style={s.kicker}>
              {isDeduction ? "DEDUCCIÓN" : "CARTERA"} {index + 1}
            </Text>
            {isDeduction && (
              <SelectField
                label={`Tipo de deducción ${index + 1}`}
                options={["Regular", "Cartera", "Saneamiento"]}
                value={item.type || "Regular"}
                onChange={(type) => update(item.id, { type })}
              />
            )}
            <Field
              label={`${isDeduction ? "Concepto" : "Entidad"} ${index + 1} *`}
              value={item.name}
              onChangeText={(name) => update(item.id, { name })}
            />
            {moneyInput(
              `${isDeduction ? "Cuota mensual" : "Saldo a pagar"} ${index + 1} (COP) *`,
              item.amount,
              (amount) => update(item.id, { amount }),
            )}
            <LinkButton
              title={`Quitar ${isDeduction ? "deducción" : "cartera"} ${index + 1}`}
              onPress={() =>
                onChange({ [key]: items.filter((row) => row.id !== item.id) })
              }
            />
          </Card>
        ))}
        <Button
          secondary
          title={
            isDeduction ? "Agregar deducción" : "Agregar cartera a comprar"
          }
          onPress={() =>
            onChange({
              [key]: [
                ...items,
                {
                  id:
                    Date.now().toString(36) +
                    Math.random().toString(36).slice(2, 6),
                  name: "",
                  amount: "",
                  ...(isDeduction ? { type: "Regular" } : {}),
                },
              ],
            })
          }
        />
      </>
    );
  }
  return (
    <>
      {kind === "capacity" ? (
        <>
          <Card dark>
            <Text style={[s.kicker, { color: colors.lime }]}>
              MARGEN DE DESCUENTO
            </Text>
            <Text style={[s.title, s.white]}>{money(c.margin)}</Text>
            <Text style={[s.text, { color: "#CFDDCD" }]}>
              {c.usedPercent.toFixed(1)}% del tope de referencia utilizado
            </Text>
          </Card>
          <Card>
            <Text style={s.h2}>El cálculo, a la vista</Text>
            <Text style={s.text}>
              Ingreso bruto: {money(Number(filing.values.income) || 0)}
            </Text>
            <Text style={s.text}>
              Descuentos de referencia (
              {filing.values.activity === "Pensionado"
                ? "12%"
                : "salud 4% + pensión 4%"}
              ): {money(c.statutory)}
            </Text>
            <Text style={s.text}>
              Tope: 50% del ingreso después de esos descuentos ·{" "}
              {money(c.limit)}
            </Text>
            <Text style={s.text}>
              Cuota del crédito: {money(result.payment)}
            </Text>
            <Text style={s.text}>Otras deducciones: {money(c.deductions)}</Text>
          </Card>
          <Notice>
            Este cálculo usa los parámetros de prueba del prototipo. El estudio
            final debe confirmar las deducciones que corresponden a tu régimen.
          </Notice>
          {entries("deductions")}
          {entries("purchases")}
          <Card>
            <Text style={s.h2}>Valor estimado a desembolsar</Text>
            <Text style={s.title}>{money(c.payout)}</Text>
            <Text style={s.small}>
              Monto preaprobado menos los saldos de compra de cartera.
            </Text>
          </Card>
        </>
      ) : (
        <>
          <Card dark>
            <Text style={[s.kicker, { color: colors.lime }]}>
              CAPACIDAD DISPONIBLE
            </Text>
            <Text style={[s.title, s.white]}>{money(c.available)}</Text>
          </Card>
          <Card>
            <Text style={s.text}>Ingresos: {money(c.income)}</Text>
            <Text style={s.text}>
              Descuentos de referencia: − {money(c.statutory)}
            </Text>
            <Text style={s.text}>
              Gastos básicos estimados (25%): − {money(c.basicExpenses)}
            </Text>
            <Text style={s.text}>
              Cuotas de otras deudas: − {money(c.debtPayment)}
            </Text>
          </Card>
          {obligationTypes.map((label) => {
            const value = filing.obligations[label] || {
              payment: "",
              balance: "",
            };
            return (
              <Card key={label}>
                <Text style={s.h2}>{label}</Text>
                {moneyInput(
                  `Cuota mensual de ${label.toLowerCase()} (COP)`,
                  value.payment,
                  (payment) =>
                    onChange({
                      obligations: {
                        ...filing.obligations,
                        [label]: { ...value, payment },
                      },
                    }),
                )}
                {moneyInput(
                  `Saldo de ${label.toLowerCase()} (COP)`,
                  value.balance,
                  (balance) =>
                    onChange({
                      obligations: {
                        ...filing.obligations,
                        [label]: { ...value, balance },
                      },
                    }),
                )}
              </Card>
            );
          })}
          <View style={{ gap: 8 }}>
            <Text style={s.label}>
              Endeudamiento estimado: {c.debtPercent.toFixed(1)}%
            </Text>
            <Text style={s.text}>
              Saldos / ingreso: {c.salaryRatio.toFixed(2)}
            </Text>
          </View>
          <Notice>
            El porcentaje de endeudamiento incluye la cuota de este crédito.
          </Notice>
        </>
      )}
    </>
  );
}
