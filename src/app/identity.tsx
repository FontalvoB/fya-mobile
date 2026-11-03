import React, { useState } from "react";
import { View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Button,
  Notice,
  Choice,
  LinkButton,
  Card,
  Icon,
  s,
} from "../components/ui";
import { AccountDocuments } from "../components/AccountDocuments";
import { VideoRecorder } from "../components/VideoRecorder";
import {
  validateAccount,
  validateDocument,
  validateValidationVideo,
} from "../domain/model";
import { useSession } from "../state/session";

const instructions = [
  "Mira de frente a la cámara",
  "Gira lentamente la cabeza a tu izquierda",
  "Gira lentamente la cabeza a tu derecha",
  "Vuelve a mirar de frente",
];
const stages = [
  "Frente del documento",
  "Reverso del documento",
  "Documentos de cuenta",
  "Video de validación",
  "Revisión",
];

export default function Identity() {
  const { draft, setDraft, setIdentity } = useSession();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  function go(next: number) {
    setError("");
    setStep(next);
  }
  function next() {
    if (step < 2) {
      const file = draft.documents[step === 0 ? "front" : "back"];
      const issue = file
        ? validateDocument(file)
        : "Toma una foto o adjunta esta cara del documento para continuar.";
      if (issue) {
        setError(issue);
        return;
      }
    } else if (step === 2) {
      const issue = validateAccount(draft, false);
      if (issue) {
        setError(issue);
        return;
      }
    } else {
      const issue = validateAccount(draft);
      if (issue) {
        setError(issue);
        return;
      }
    }
    if (step < 4) {
      go(step + 1);
      return;
    }
    if (edit === "1") {
      router.back();
      return;
    }
    setBusy(true);
    setIdentity(true);
    router.replace("/home");
  }
  return (
    <Screen
      title={
        step === 4
          ? "Todo listo para revisar."
          : step === 3
            ? "Valida tu identidad en video."
            : "Tu cuenta, paso a paso."
      }
      eyebrow={`TU CUENTA · DOCUMENTOS ${step + 1} / ${stages.length}`}
      subtitle={stages[step]}
      progress={(step + 1) / stages.length}
      onBack={() => {
        if (!recording) {
          if (step > 0) go(step - 1);
          else router.back();
        }
      }}
      footer={
        <>
          {!!error && <Notice error>{error}</Notice>}
          <Button
            busy={busy}
            disabled={recording}
            title={
              step === 4
                ? edit === "1"
                  ? "Guardar documentos de cuenta"
                  : "Simular revisión favorable"
                : step === 2
                  ? "Continuar al video de validación"
                  : step === 3
                    ? "Continuar a revisión"
                    : "Guardar y continuar"
            }
            onPress={next}
          />
          {step > 0 && (
            <Button
              secondary
              title="Volver al paso anterior"
              disabled={recording}
              onPress={() => go(step - 1)}
            />
          )}
        </>
      }
    >
      {step < 2 && (
        <Card>
          <Icon name="camera" />
          <Text style={s.h2}>
            {step === 0 ? "Primero, el frente" : "Ahora, el reverso"}
          </Text>
          <Text style={s.text}>
            {step === 0
              ? "Coloca tu documento sobre una superficie plana. Busca buena luz, evita reflejos y deja visibles las cuatro esquinas."
              : "Da la vuelta a tu documento. Asegúrate de que el código y todos los datos se puedan leer."}
          </Text>
          <Text style={s.small}>
            Toma la foto o adjunta un archivo. Revisa que se vea completo y
            nítido antes de continuar.
          </Text>
        </Card>
      )}
      {step < 3 && (
        <AccountDocuments
          key={step}
          stage={step === 0 ? "front" : step === 1 ? "back" : "evidence"}
        />
      )}
      {step === 3 && (
        <>
          <Card>
            <Text style={s.h2}>Un video de 12 segundos</Text>
            <Text style={s.text}>
              Ubica tu rostro en el centro, con buena luz y sin cubrirlo. La
              grabación no incluye audio y termina automáticamente.
            </Text>
            {instructions.map((text, i) => (
              <Text key={text} style={s.text}>
                {i + 1}. {text}.
              </Text>
            ))}
            <Choice
              label="Autorizo el uso de mi imagen para el video de validación"
              selected={consent}
              onPress={() => {
                if (recording) return;
                setConsent(!consent);
                if (consent)
                  setDraft((d) => ({
                    ...d,
                    documents: { ...d.documents, validationVideo: undefined },
                    declaration: { ...d.declaration, reviewed: false },
                  }));
              }}
            />
          </Card>
          {draft.documents.validationVideo ? (
            <Card>
              <Icon name="check-circle" />
              <Text style={s.h2}>
                {draft.documents.validationVideo.demo
                  ? "Video ficticio de demostración"
                  : "Video grabado"}
              </Text>
              <Text style={s.text}>
                {draft.documents.validationVideo.name} ·{" "}
                {Math.round(draft.documents.validationVideo.duration || 0)}{" "}
                segundos
              </Text>
              <LinkButton
                title="Repetir video"
                onPress={() =>
                  setDraft((d) => ({
                    ...d,
                    documents: { ...d.documents, validationVideo: undefined },
                    declaration: { ...d.declaration, reviewed: false },
                  }))
                }
              />
            </Card>
          ) : (
            consent && (
              <Card>
                <Text accessibilityLiveRegion="polite" style={s.h2}>
                  {recording
                    ? instructions[Math.min(3, Math.floor(seconds / 3))]
                    : "Prepárate para mirar de frente"}
                </Text>
                {recording && (
                  <Text style={s.label}>
                    Grabando · {Math.min(12, Math.floor(seconds))} / 12 segundos
                  </Text>
                )}
                <VideoRecorder
                  instruction={
                    recording
                      ? instructions[Math.min(3, Math.floor(seconds / 3))]
                      : "Ubica tu rostro en el centro"
                  }
                  onBusy={setRecording}
                  onProgress={setSeconds}
                  onRecorded={(file) => {
                    const issue = validateValidationVideo(file);
                    if (issue) {
                      setError(issue);
                      return;
                    }
                    setError("");
                    setDraft((d) => ({
                      ...d,
                      documents: { ...d.documents, validationVideo: file },
                      declaration: { ...d.declaration, reviewed: false },
                    }));
                  }}
                />
              </Card>
            )
          )}
          <Notice>
            El video permanece en esta sesión. La demo no comprueba movimientos
            ni realiza validación biométrica automática.
          </Notice>
        </>
      )}
      {step === 4 && (
        <>
          <Card>
            {[
              "Correo y celular: códigos de prueba confirmados",
              "Documento: frente y reverso seleccionados",
              `Perfil: ${draft.account.customerType} · ${draft.account.accreditationType}`,
              "Acreditación y recibo: seleccionados localmente",
              draft.account.ownsHome
                ? "Vivienda propia declarada"
                : "Contrato de arrendamiento seleccionado",
              "Video de validación: disponible en esta sesión",
            ].map((text) => (
              <View key={text} style={s.row}>
                <Icon name="check-circle" />
                <Text style={[s.text, { flex: 1 }]}>{text}</Text>
              </View>
            ))}
          </Card>
          <Notice>
            No se ha verificado oficialmente tu identidad ni se han enviado los
            documentos o el video. La revisión que sigue es una simulación.
          </Notice>
          <LinkButton title="Revisar mis documentos" onPress={() => go(0)} />
        </>
      )}
    </Screen>
  );
}
