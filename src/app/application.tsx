import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import {
  Screen,
  Button,
  Card,
  Field,
  Segments,
  YesNo,
  Choice,
  Notice,
  Reveal,
  Icon,
  LinkButton,
  InfoModal,
  s,
  colors,
} from "../components/ui";
import { DocumentCard } from "../components/DocumentCard";
import { useSession } from "../state/session";
import {
  Declaration,
  Profile,
  steps,
  healthQuestions,
  validateStep,
  validateAll,
  estimate,
  money,
  age,
} from "../domain/model";
const titles = [
  "Hablemos de ti.",
  "Tu residencia fiscal.",
  "Tu bienestar importa.",
  "Tú tienes el control.",
  "Tus soportes, aquí.",
  "Todo en su lugar.",
];
const subtitles = [
  "Completa los datos que acompañarán tu solicitud.",
  "Dos preguntas para completar tu declaración FATCA / CRS.",
  "Responde cada pregunta. Un Sí necesita contexto, no implica un rechazo automático.",
  "Elige cómo contactarte y revisa las autorizaciones de prueba.",
  "Adjunta el recibo de servicio público y tu último desprendible.",
  "Revisa cada sección. Puedes volver y cambiar lo que necesites.",
];
export default function Application() {
  const { draft, setDraft, identity } = useSession();
  const params = useLocalSearchParams<{ step?: string; edit?: string }>();
  const step = Math.min(5, Math.max(0, Number(params.step) || 0));
  const [error, setError] = useState("");
  const [legal, setLegal] = useState("");
  const p = draft.profile,
    a = draft.declaration,
    e = estimate(draft.loan);
  if (!identity) return <Redirect href="/" />;
  function update(v: Partial<Declaration>) {
    setDraft((d) => ({
      ...d,
      declaration: {
        ...d.declaration,
        ...v,
        reviewed: "reviewed" in v ? !!v.reviewed : false,
      },
    }));
    setError("");
  }
  function profile(v: Partial<Profile>) {
    setDraft((d) => ({
      ...d,
      profile: { ...d.profile, ...v },
      declaration: { ...d.declaration, reviewed: false },
    }));
  }
  function go(n: number, edit = false) {
    setError("");
    router.setParams({ step: String(n), edit: edit ? "1" : "" });
  }
  function next() {
    const issue = step === 5 ? validateAll(draft) : validateStep(draft, step);
    if (issue) {
      setError(issue);
      return;
    }
    if (step === 5)
      router.push({ pathname: "/otp", params: { phase: "submit" } });
    else go(params.edit === "1" ? 5 : step + 1);
  }
  const summaries = [
    {
      label: "Tus datos",
      value: `${p.firstName} ${p.secondName} ${p.lastName} ${p.secondLastName}\n${p.docType} ${p.docNumber}\n${p.email} · ${p.phone}\n${p.address}, ${p.city}, ${p.department}\nNacimiento: ${p.birthDate} · ${age(p.birthDate)} años\nExpedición: ${p.expDate}\n${p.gender} · ${p.civil} · ${p.occupation}`,
    },
    {
      label: "Residencia fiscal",
      value: `EE. UU.: ${a.us ? "Sí · " + a.tin : "No"}\nOtros países: ${a.other ? a.countries : "No"}`,
    },
    {
      label: "Declaración de salud",
      value: `${a.health.filter((v) => v !== null).length} de 9 respondidas · ${a.health.filter(Boolean).length} respuestas Sí\n${a.health.map((v, i) => `${i + 1}. ${v === null ? "Pendiente" : v ? "Sí: " + a.details[i] : "No"}`).join("\n")}`,
    },
    {
      label: "Autorizaciones",
      value: `Contacto: ${a.channels.join(", ")}\nPublicidad: ${a.commercial ? "Sí" : "No"}\nCentrales: ${a.riskConsent ? "autorizado" : "pendiente"} · Datos: ${a.dataConsent ? "autorizado" : "pendiente"}`,
    },
    {
      label: "Soportes",
      value: `Servicio público: ${draft.documents.utility?.name || "Pendiente"}\n${a.utilityType} · ${a.utilityDate}\nDesprendible: ${draft.documents.payslip?.name || "Pendiente"}`,
    },
  ];
  return (
    <Screen
      title={titles[step]}
      eyebrow={`TU SOLICITUD · ${String(step + 1).padStart(2, "0")} / 06`}
      subtitle={subtitles[step]}
      progress={(step + 1) / 6}
      footer={
        <>
          <View style={s.between}>
            <Text style={s.small}>{steps[step]}</Text>
            <Text style={s.small}>{step + 1} de 6</Text>
          </View>
          {!!error && <Notice error>{error}</Notice>}
          <Button
            title={
              step === 5
                ? "Confirmar con código de prueba"
                : params.edit === "1"
                  ? "Guardar y volver al resumen"
                  : "Guardar y continuar"
            }
            onPress={next}
          />
          {step > 0 && (
            <LinkButton
              title="Volver al paso anterior"
              onPress={() => go(step - 1)}
            />
          )}
        </>
      }
    >
      <Reveal key={step}>
        {step === 0 && (
          <>
            <Notice>
              Los datos se conservan mientras esta sesión esté abierta. Usa
              información ficticia.
            </Notice>
            {(
              [
                ["firstName", "Primer nombre *"],
                ["secondName", "Segundo nombre (opcional)"],
                ["lastName", "Primer apellido *"],
                ["secondLastName", "Segundo apellido (opcional)"],
                ["docNumber", "Número de documento *"],
                ["email", "Correo electrónico *"],
                ["phone", "Celular *"],
              ] as [keyof Profile, string][]
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={p[key]}
                onChangeText={(v) => profile({ [key]: v })}
                keyboardType={
                  key === "phone" || key === "docNumber"
                    ? "number-pad"
                    : key === "email"
                      ? "email-address"
                      : "default"
                }
                autoCapitalize={key === "email" ? "none" : "words"}
              />
            ))}
            <Text style={s.label}>Tipo de documento</Text>
            <Segments
              items={["CC", "CE"]}
              value={p.docType}
              onChange={(docType) => profile({ docType })}
            />
            <Text style={s.label}>Género *</Text>
            <Segments
              items={["Femenino", "Masculino", "Otro"]}
              value={p.gender}
              onChange={(gender) => profile({ gender })}
            />
            <Field
              label="Fecha de nacimiento * (AAAA-MM-DD)"
              placeholder="1965-05-20"
              value={p.birthDate}
              onChangeText={(birthDate) => profile({ birthDate })}
            />
            {Number.isFinite(age(p.birthDate)) && (
              <Text style={s.small}>
                Edad calculada: {age(p.birthDate)} años
              </Text>
            )}
            <Field
              label="Fecha de expedición * (AAAA-MM-DD)"
              value={p.expDate}
              placeholder="1985-06-10"
              onChangeText={(expDate) => profile({ expDate })}
            />
            {(
              [
                ["address", "Dirección de residencia *"],
                ["city", "Ciudad *"],
                ["department", "Departamento *"],
                ["civil", "Estado civil *"],
                ["occupation", "Ocupación *"],
              ] as [keyof Profile, string][]
            ).map(([key, label]) => (
              <Field
                key={key}
                label={label}
                value={p[key]}
                onChangeText={(v) => profile({ [key]: v })}
              />
            ))}
          </>
        )}
        {step === 1 && (
          <>
            <Card>
              <YesNo
                label="¿Eres residente fiscal en Estados Unidos?"
                value={a.us}
                onChange={(us) => update({ us, tin: us ? a.tin : "" })}
              />
              {a.us && (
                <Field
                  label="Número TIN o SSN *"
                  value={a.tin}
                  onChangeText={(tin) => update({ tin })}
                />
              )}
            </Card>
            <Card>
              <YesNo
                label="¿Tienes residencia fiscal en otro país distinto a Colombia?"
                value={a.other}
                onChange={(other) =>
                  update({ other, countries: other ? a.countries : "" })
                }
              />
              {a.other && (
                <Field
                  label="Países y números de identificación tributaria *"
                  multiline
                  placeholder="Un país y su TIN por línea"
                  value={a.countries}
                  onChangeText={(countries) => update({ countries })}
                />
              )}
            </Card>
            <Choice
              label="Declaro que la información fiscal es correcta"
              detail="Autorización FATCA / CRS de prueba v1.0."
              selected={a.taxConsent}
              onPress={() => update({ taxConsent: !a.taxConsent })}
            />
            <LinkButton
              title="Leer declaración de prueba"
              onPress={() => setLegal("FATCA / CRS")}
            />
          </>
        )}
        {step === 2 && (
          <>
            <Card>
              <View style={s.row}>
                <Icon name="heart" />
                <Text style={s.label}>
                  {a.health.filter((v) => v !== null).length} de 9 preguntas
                  respondidas
                </Text>
              </View>
              <Text style={s.small}>
                Para representar el seguro de vida deudores. La evaluación de
                asegurabilidad está pendiente de un proveedor real.
              </Text>
            </Card>
            {healthQuestions.map((q, i) => (
              <Card key={q}>
                <Text style={s.kicker}>
                  PREGUNTA {String(i + 1).padStart(2, "0")}
                </Text>
                <YesNo
                  label={q}
                  value={a.health[i]}
                  onChange={(v) =>
                    update({
                      health: a.health.map((x, n) => (n === i ? v : x)),
                      details: a.details.map((x, n) =>
                        n === i && !v ? "" : x,
                      ),
                    })
                  }
                />
                {a.health[i] && (
                  <Field
                    label={`Detalle de salud ${i + 1} *`}
                    multiline
                    placeholder="Diagnóstico, desde cuándo y tratamiento"
                    value={a.details[i]}
                    onChangeText={(v) =>
                      update({
                        details: a.details.map((x, n) => (n === i ? v : x)),
                      })
                    }
                  />
                )}
              </Card>
            ))}
          </>
        )}
        {step === 3 && (
          <>
            <Card>
              <Text style={s.h2}>Tus canales de contacto</Text>
              <Text style={s.text}>
                Elige al menos uno. La decisión sobre publicidad es
                independiente.
              </Text>
              {["Llamada", "Correo", "SMS", "WhatsApp"].map((channel) => (
                <Choice
                  key={channel}
                  label={channel}
                  selected={a.channels.includes(channel)}
                  onPress={() =>
                    update({
                      channels: a.channels.includes(channel)
                        ? a.channels.filter((c) => c !== channel)
                        : [...a.channels, channel],
                    })
                  }
                />
              ))}
            </Card>
            <Card>
              <YesNo
                label="¿Autorizas recibir ofertas y publicidad?"
                value={a.commercial}
                onChange={(commercial) => update({ commercial })}
              />
              <Text style={s.small}>
                Elegir No te permite continuar con tu solicitud.
              </Text>
            </Card>
            <Choice
              label="Autorizo la consulta de centrales de riesgo"
              detail="Solo se representa una respuesta de prueba; no hay consultas externas."
              selected={a.riskConsent}
              onPress={() => update({ riskConsent: !a.riskConsent })}
            />
            <LinkButton
              title="Leer autorización de centrales"
              onPress={() => setLegal("Centrales de riesgo")}
            />
            <Choice
              label="Autorizo el tratamiento de datos de la solicitud"
              detail="Para representar el estudio y gestión de mi solicitud. Texto de prueba v1.0."
              selected={a.dataConsent}
              onPress={() => update({ dataConsent: !a.dataConsent })}
            />
            <LinkButton
              title="Leer autorización de datos"
              onPress={() => setLegal("Tratamiento de datos")}
            />
            <Notice>
              La firma electrónica y el pagaré se incorporarán en una fase
              posterior. Estas selecciones no constituyen una firma.
            </Notice>
          </>
        )}
        {step === 4 && (
          <>
            <Notice>
              Los archivos se seleccionan localmente. No se suben a un servidor
              ni se validan oficialmente.
            </Notice>
            <DocumentCard
              title="Recibo de servicio público"
              hint="Un recibo de energía, agua, gas u otro servicio, con tu dirección y fecha de los últimos 90 días."
              value={draft.documents.utility}
              onChange={(utility) =>
                setDraft((d) => ({
                  ...d,
                  documents: { ...d.documents, utility },
                  declaration: { ...d.declaration, reviewed: false },
                }))
              }
            />
            <Card>
              <Text style={s.label}>Tipo de servicio</Text>
              <Segments
                items={["Energía", "Agua", "Gas", "Otro"]}
                value={a.utilityType}
                onChange={(utilityType) => update({ utilityType })}
              />
              <Field
                label="Fecha de emisión del recibo * (AAAA-MM-DD)"
                placeholder="AAAA-MM-DD"
                value={a.utilityDate}
                onChangeText={(utilityDate) => update({ utilityDate })}
              />
              <Text style={s.small}>
                Se comprueba la fecha declarada; no se lee automáticamente el
                contenido del recibo.
              </Text>
              <Choice
                label="El recibo corresponde a mi dirección de residencia"
                detail={`${p.address}, ${p.city}`}
                selected={a.addressConfirmed}
                onPress={() =>
                  update({ addressConfirmed: !a.addressConfirmed })
                }
              />
            </Card>
            <DocumentCard
              title="Desprendible de pago"
              hint="Tu último desprendible de mesada pensional o nómina. El contenido debe estar completo y ser legible."
              value={draft.documents.payslip}
              onChange={(payslip) =>
                setDraft((d) => ({
                  ...d,
                  documents: { ...d.documents, payslip },
                  declaration: { ...d.declaration, reviewed: false },
                }))
              }
            />
          </>
        )}
        {step === 5 && (
          <>
            <Card dark>
              <Text style={[s.kicker, { color: colors.lime }]}>
                {draft.loan.product}
              </Text>
              <Text style={[s.title, s.white]}>{money(e.amount)}</Text>
              <Text style={[s.text, { color: "#CFDDCD" }]}>
                {draft.loan.months} meses · {money(e.payment)} / mes
              </Text>
              <Text style={[s.small, { color: "#CFDDCD" }]}>
                {draft.loan.type} · {draft.loan.payer}
              </Text>
              <Button
                title="Editar simulación"
                secondary
                onPress={() => router.push("/simulator")}
              />
            </Card>
            {summaries.map((item, i) => (
              <Card key={item.label}>
                <View style={s.between}>
                  <Text style={s.h2}>{item.label}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={"Editar " + item.label.toLowerCase()}
                    onPress={() => go(i, true)}
                    style={{ padding: 12 }}
                  >
                    <Icon name="edit-2" size={18} />
                  </Pressable>
                </View>
                <Text style={s.text}>{item.value}</Text>
              </Card>
            ))}
            <Choice
              label="Revisé y confirmo la información de prueba"
              selected={a.reviewed}
              onPress={() => update({ reviewed: !a.reviewed })}
            />
            <Notice>
              Al finalizar se genera una referencia local DEMO. No se radica una
              solicitud real ante FYA.
            </Notice>
          </>
        )}
      </Reveal>
      <InfoModal
        visible={!!legal}
        title={legal + " · texto de prueba v1.0"}
        onClose={() => setLegal("")}
      >
        <Text style={s.text}>
          {legal === "FATCA / CRS"
            ? "Declaro que los datos de residencia fiscal ingresados son correctos y autorizo a FYA SOCIAL CAPITAL S.A.S. a tratarlos para representar la declaración FATCA / CRS."
            : legal === "Centrales de riesgo"
              ? "Autorizo a FYA SOCIAL CAPITAL S.A.S. a consultar, reportar y actualizar información financiera y crediticia para estudiar la solicitud. En esta demostración no se realiza ninguna consulta."
              : "Autorizo a FYA SOCIAL CAPITAL S.A.S. a tratar la información de esta solicitud para su estudio y gestión. En esta demostración los datos permanecen solo en memoria y no se transmiten."}
          {"\n\n"}Texto ilustrativo basado en el prototipo. Debe ser reemplazado
          por la versión aprobada antes de producción. No constituye
          asesoramiento jurídico ni firma electrónica.
        </Text>
      </InfoModal>
    </Screen>
  );
}
