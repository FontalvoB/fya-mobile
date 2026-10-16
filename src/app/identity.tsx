import React, { useState } from "react";
import { View, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Screen,
  Button,
  Notice,
  Choice,
  LinkButton,
  Card,
  Icon,
  Reveal,
  s,
} from "../components/ui";
import { DocumentCard } from "../components/DocumentCard";
import { useSession } from "../state/session";
export default function Identity() {
  const { draft, setDraft, setIdentity } = useSession();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false);
  async function selfie() {
    setError("");
    try {
      const p = await ImagePicker.requestCameraPermissionsAsync();
      if (!p.granted) {
        setError("La cámara no tiene permiso. Puedes continuar sin selfie.");
        return;
      }
      const r = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.65,
        cameraType: ImagePicker.CameraType.front,
      });
      if (!r.canceled) {
        const a = r.assets[0];
        setDraft((d) => ({
          ...d,
          documents: {
            ...d.documents,
            selfie: {
              uri: a.uri,
              name: "selfie.jpg",
              size: a.fileSize || 0,
              mimeType: "image/jpeg",
            },
          },
        }));
      }
    } catch {
      setError("No se pudo abrir la cámara. Puedes continuar sin selfie.");
    }
  }
  return (
    <Screen
      title={review ? "Todo listo para revisar." : "Tu identidad, paso a paso."}
      eyebrow="TU CUENTA · 03 / 03"
      progress={review ? 1 : 0.7}
      subtitle={
        review
          ? "Este expediente permanece en tu dispositivo. La revisión que sigue es una simulación."
          : "Adjunta ambas caras de tu documento. El recibo de servicio público se solicitará más adelante."
      }
      footer={
        <Button
          busy={busy}
          title={review ? "Simular revisión favorable" : "Continuar a revisión"}
          onPress={async () => {
            if (!draft.documents.front || !draft.documents.back) {
              setError("Selecciona las dos caras de tu documento.");
              return;
            }
            if (!review) {
              setReview(true);
              setError("");
              return;
            }
            setBusy(true);
            await new Promise((r) => setTimeout(r, 700));
            setIdentity(true);
            router.replace("/home");
          }}
        />
      }
    >
      {review ? (
        <Reveal>
          <Card>
            {[
              "Correo: código de prueba confirmado",
              "Celular: código de prueba confirmado",
              "Documento: archivos seleccionados localmente",
              "Revisión del analista: pendiente de simulación",
            ].map((v, i) => (
              <View key={v} style={s.row}>
                <Icon name={i === 3 ? "clock" : "check-circle"} />
                <Text style={[s.text, { flex: 1 }]}>{v}</Text>
              </View>
            ))}
          </Card>
          <Notice>
            No se ha verificado oficialmente tu identidad ni se han enviado los
            documentos.
          </Notice>
          <LinkButton
            title="Revisar mis documentos"
            onPress={() => setReview(false)}
          />
        </Reveal>
      ) : (
        <>
          <DocumentCard
            title="Frente del documento"
            hint="Buena luz, sin reflejos y con las cuatro esquinas visibles."
            value={draft.documents.front}
            onChange={(v) =>
              setDraft((d) => ({
                ...d,
                documents: { ...d.documents, front: v },
              }))
            }
          />
          <DocumentCard
            title="Reverso del documento"
            hint="Asegúrate de que el código y el texto se puedan leer."
            value={draft.documents.back}
            onChange={(v) =>
              setDraft((d) => ({
                ...d,
                documents: { ...d.documents, back: v },
              }))
            }
          />
          <Card>
            <Text style={s.h2}>Una selfie, si quieres</Text>
            <Text style={s.text}>
              Opcional. No realizamos comparación facial en esta demo.
            </Text>
            <Choice
              label="Autorizo el uso de mi imagen en esta demostración"
              selected={consent}
              onPress={() => {
                setConsent(!consent);
                if (consent)
                  setDraft((d) => ({
                    ...d,
                    documents: { ...d.documents, selfie: undefined },
                  }));
              }}
            />
            {draft.documents.selfie && (
              <Image
                source={{ uri: draft.documents.selfie.uri }}
                style={{ height: 180, borderRadius: 18 }}
              />
            )}
            <Button
              title={
                draft.documents.selfie
                  ? "Repetir selfie"
                  : "Tomar selfie opcional"
              }
              secondary
              disabled={!consent}
              onPress={selfie}
              icon="camera"
            />
            {draft.documents.selfie && (
              <LinkButton
                title="Eliminar selfie"
                onPress={() =>
                  setDraft((d) => ({
                    ...d,
                    documents: { ...d.documents, selfie: undefined },
                  }))
                }
              />
            )}
          </Card>
        </>
      )}
      {!!error && <Notice error>{error}</Notice>}
    </Screen>
  );
}
