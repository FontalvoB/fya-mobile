import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { GlassLayer } from "../components/glass";
import { Icon, Notice, fonts } from "../components/ui";
import {
  ReferenceBack,
  ReferenceButton,
  ReferenceScreen,
  r,
} from "../components/reference-ui";
import { DemoOtp, demoService } from "../services/demo";
import { useSession } from "../state/session";
export default function Otp() {
  const { phase = "email" } = useLocalSearchParams<{ phase: string }>();
  return <OtpForm key={phase} phase={phase} />;
}
function OtpForm({ phase }: { phase: string }) {
  const { draft, setResult } = useSession();
  const [code, setCode] = useState("");
  const [codeFocused, setCodeFocused] = useState(false);
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
    <ReferenceScreen>
      <View style={o.content}>
        <View style={{ marginLeft: 14, marginBottom: 23 }}>
          <ReferenceBack />
        </View>
        <View style={o.heading}>
          <Text style={r.eyebrow}>CÓDIGO DE PRUEBA</Text>
          <Text accessibilityRole="header" style={r.title}>
            {phase === "submit"
              ? "Un último paso."
              : phase === "email"
                ? "Tu correo, confirmado."
                : "Ahora, tu celular."}
          </Text>
          <Text style={r.description}>
            En esta demo no enviamos mensajes. Introduce el código que aparece
            abajo.
          </Text>
        </View>
        <View style={o.card}>
          <GlassLayer intensity={16} />
          <View style={o.mail}>
            <Icon
              name={phase === "sms" ? "smartphone" : "mail"}
              size={25}
              color="#C6DCD5"
            />
          </View>
          <Text style={o.label}>
            {phase === "sms" ? draft.profile.phone : draft.profile.email}
          </Text>
          <Text style={[o.label, { marginTop: 10, marginBottom: 18 }]}>
            Código de 6 dígitos
          </Text>
          <TextInput
            accessibilityLabel="Código de 6 dígitos"
            accessibilityHint="Escribe o pega los seis dígitos del código de prueba."
            value={code}
            onChangeText={(value) => {
              setCode(value.replace(/\D/g, "").slice(0, 6));
              setError("");
            }}
            onFocus={() => setCodeFocused(true)}
            onBlur={() => setCodeFocused(false)}
            editable={!busy}
            keyboardType="number-pad"
            inputMode="numeric"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            autoCorrect={false}
            placeholder="······"
            placeholderTextColor="#657E73"
            selectionColor="#00474A"
            style={[
              o.codeInput,
              codeFocused && {
                borderColor: "#00474A",
                backgroundColor: "#FFFFFF40",
              },
            ]}
          />
          <Text style={[r.description, { marginTop: 12, fontSize: 11 }]}>
            Código de prueba: {challenge.code}
          </Text>
          <Text style={o.validity}>
            Vigencia de prueba: 15 minutos · 3 intentos
          </Text>
        </View>
        {!!error && (
          <View style={{ marginTop: 16 }}>
            <Notice error>{error}</Notice>
          </View>
        )}
        <View style={o.verify}>
          <ReferenceButton
            title={
              phase === "submit"
                ? "Finalizar solicitud de prueba"
                : "Verificar código"
            }
            busy={busy}
            onPress={verify}
          />
        </View>
        <View style={o.utilities}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Usar código de prueba"
            onPress={() => setCode(challenge.code)}
            style={o.utility}
          >
            <Text style={o.utilityText}>Usar código de prueba</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={remaining > 0 || busy}
            accessibilityState={{ disabled: remaining > 0 || busy }}
            onPress={() => {
              setChallenge(new DemoOtp(challenge.code));
              setRemaining(30);
              setError("");
              setCode("");
            }}
            style={o.utility}
          >
            <Text style={o.utilityText}>
              {remaining
                ? "Nuevo código en " + remaining + " s"
                : "Generar nuevo código de prueba"}
            </Text>
          </Pressable>
          <Text style={[r.description, { fontSize: 10, textAlign: "center" }]}>
            Confirmar este código simulado no constituye una firma electrónica.
          </Text>
        </View>
      </View>
    </ReferenceScreen>
  );
}
const o = StyleSheet.create({
  content: { paddingHorizontal: 34, paddingTop: 10, paddingBottom: 25 },
  heading: { gap: 10, marginHorizontal: 14, marginBottom: 18 },
  card: {
    borderRadius: 36,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF45",
    backgroundColor: "#FFFFFF0A",
    padding: 26,
    paddingTop: 22,
    paddingBottom: 32,
  },
  mail: {
    height: 48,
    width: 48,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003D3F",
    marginBottom: 21,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 12,
    minHeight: 17,
    color: "#4F645C",
  },
  codeInput: {
    position: "relative",
    zIndex: 1,
    minHeight: 60,
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FFFFFF60",
    backgroundColor: "#FFFFFF20",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#082F2E",
    fontFamily: fonts.medium,
    fontSize: 26,
    letterSpacing: 8,
    textAlign: "center",
  },
  validity: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: "#E0E9E1",
    marginTop: 18,
  },
  verify: { marginTop: 34, marginHorizontal: 30 },
  utilities: { marginTop: 22, alignItems: "center", gap: 2 },
  utility: { minHeight: 44, justifyContent: "center" },
  utilityText: { fontFamily: fonts.medium, fontSize: 11, color: "#345C53" },
});
