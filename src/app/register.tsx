import { SelectField } from "../components/SelectionFields";
import { docTypes } from "../domain/catalogs";
import { ArtPanel, SectionHeading } from "../components/visuals";
import React, { useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Screen,
  Button,
  Card,
  Field,
  Choice,
  Notice,
  LinkButton,
  s,
} from "../components/ui";
import { useSession } from "../state/session";
import { demoProfile } from "../domain/model";
const schema = z.object({
  firstName: z.string().trim().min(2, "Escribe tu primer nombre."),
  secondName: z.string(),
  lastName: z.string().trim().min(2, "Escribe tu primer apellido."),
  secondLastName: z.string(),
  docType: z.string(),
  docNumber: z.string().regex(/^\d{6,12}$/, "Usa de 6 a 12 dígitos."),
  email: z.string().email("Escribe un correo válido."),
  phone: z.string().regex(/^\d{10}$/, "Escribe 10 dígitos."),
  password: z
    .string()
    .min(12, "Mínimo 12 caracteres.")
    .regex(/[A-Z]/, "Incluye una mayúscula.")
    .regex(/[a-z]/, "Incluye una minúscula.")
    .regex(/[0-9]/, "Incluye un número.")
    .regex(/[^A-Za-z0-9]/, "Incluye un símbolo."),
});
export default function Register() {
  const { draft, setDraft } = useSession();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...draft.profile, password: "" },
  });
  const fields = [
    ["firstName", "Primer nombre *"],
    ["secondName", "Segundo nombre (opcional)"],
    ["lastName", "Primer apellido *"],
    ["secondLastName", "Segundo apellido (opcional)"],
    ["docNumber", "Número de documento *"],
    ["email", "Correo electrónico *"],
    ["phone", "Celular *"],
    ["password", "Contraseña de demostración *"],
  ] as const;
  return (
    <Screen
      title="Empecemos por ti."
      eyebrow="TU CUENTA · 01 / 03"
      subtitle="Usa datos ficticios para explorar esta demostración."
      progress={0.15}
      footer={
        <Button
          title="Continuar al código"
          onPress={handleSubmit((v) => {
            if (!consent) {
              setError("Acepta la autorización para continuar.");
              return;
            }
            const { password, ...profile } = v;
            setDraft((d) => ({ ...d, profile: { ...d.profile, ...profile } }));
            router.push({ pathname: "/otp", params: { phase: "email" } });
          })}
        />
      }
    >
      <ArtPanel
        kind="plans"
        title="Un nuevo comienzo"
        caption="Crea tu perfil y explora tus posibilidades."
      />
      <SectionHeading number="01" title="Tu información" />
      <Card>
        <LinkButton
          title="Completar con datos de ejemplo"
          onPress={() => reset({ ...demoProfile, password: "DemoFya#2026!" })}
        />
        <Controller
          control={control}
          name="docType"
          render={({ field }) => (
            <SelectField
              label="Tipo de documento *"
              options={docTypes}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {fields.map(([name, label]) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field, fieldState }) => (
              <Field
                label={label}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                secureTextEntry={name === "password"}
                autoCapitalize={
                  name === "email"
                    ? "none"
                    : name === "password"
                      ? "none"
                      : "words"
                }
                keyboardType={
                  name === "phone" || name === "docNumber"
                    ? "number-pad"
                    : name === "email"
                      ? "email-address"
                      : "default"
                }
              />
            )}
          />
        ))}
      </Card>
      <Text style={s.small}>
        Contraseña: 12 caracteres, mayúscula, minúscula, número y símbolo. No se
        almacena ni crea una cuenta real.
      </Text>
      <Choice
        label="Autorizo el tratamiento de datos y el contacto de registro"
        detail="Texto de prueba v1.0. Permite representar el registro en esta sesión; no se envía información."
        selected={consent}
        onPress={() => setConsent(!consent)}
      />
      {!!error && <Notice error>{error}</Notice>}
    </Screen>
  );
}
