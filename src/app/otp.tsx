import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Screen,
  Button,
  Field,
  Notice,
  LinkButton,
  Card,
  Icon,
  s,
  colors,
} from "../components/ui";
import { DemoOtp, demoService } from "../services/demo";
import { useSession } from "../state/session";
export default function Otp() {
  const { phase = "email" } = useLocalSearchParams<{ phase: string }>();
  return <OtpForm key={phase} phase={phase} />;
}
function OtpForm({ phase }: { phase: string }) {
  const { draft, setResult } = useSession();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState(30);
  const [challenge, setChallenge] = useState(
    () =>
      new DemoOtp(
        phase === "submit" ? "219604" : phase === "sms" ? "735160" : "482913",
      ),
  );
  const [submission] = useState(() => "demo-" + Date.now());
  useEffect(() => {
    const t = setInterval(() => setRemaining((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  async function verify() {
    if (busy) return;
    const issue = challenge.verify(code);
    if (issue) {
      setError(issue);
      return;
    }
    if (phase === "submit") {
      setBusy(true);
      try {
        setResult(await demoService.submit(draft, submission));
        router.replace("/result");
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "No se pudo completar la simulación.",
        );
        setChallenge(new DemoOtp(challenge.code));
      } finally {
        setBusy(false);
      }
    } else if (phase === "email")
      router.replace({ pathname: "/otp", params: { phase: "sms" } });
    else router.replace("/identity");
  }
  return (
    <Screen
      title={
        phase === "submit"
          ? "Un último paso."
          : phase === "email"
            ? "Tu correo, confirmado."
            : "Ahora, tu celular."
      }
      eyebrow="CÓDIGO DE PRUEBA"
      subtitle="En esta demo no enviamos mensajes. Introduce el código que aparece abajo."
      footer={
        <Button
          title={
            phase === "submit"
              ? "Finalizar solicitud de prueba"
              : "Verificar código"
          }
          busy={busy}
          onPress={verify}
        />
      }
    >
      <Card>
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: colors.lime,
            padding: 18,
            borderRadius: 20,
          }}
        >
          <Icon name={phase === "sms" ? "smartphone" : "mail"} size={30} />
        </View>
        <Text style={s.label}>
          {phase === "sms" ? draft.profile.phone : draft.profile.email}
        </Text>
        <Field
          label="Código de 6 dígitos"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          autoComplete="one-time-code"
          style={{
            fontSize: 30,
            letterSpacing: 7,
            textAlign: "center",
            minHeight: 76,
            backgroundColor: "#F3F8F4",
            borderRadius: 18,
          }}
        />
        <Text style={s.small}>Vigencia de prueba: 15 minutos · 3 intentos</Text>
      </Card>
      <Notice>
        Código simulado: {challenge.code}. Confirmarlo no constituye una firma
        electrónica.
      </Notice>
      <LinkButton
        title="Usar código de prueba"
        onPress={() => setCode(challenge.code)}
      />
      <Button
        secondary
        title={
          remaining
            ? `Nuevo código en ${remaining} s`
            : "Generar nuevo código de prueba"
        }
        disabled={remaining > 0 || busy}
        onPress={() => {
          setChallenge(new DemoOtp(challenge.code));
          setRemaining(30);
          setError("");
          setCode("");
        }}
      />
      {!!error && <Notice error>{error}</Notice>}
    </Screen>
  );
}
