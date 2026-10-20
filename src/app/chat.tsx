import React, { useRef, useState } from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Screen, Icon, Notice, colors, s, fonts } from "../components/ui";
import { useSession } from "../state/session";
import { supportService } from "../services/support";
type Message = { id: number; role: "user" | "assistant"; text: string };
export default function Chat() {
  const { result } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hola, soy el asistente de FYA. ¿Qué necesitas resolver? Puedo guiarte con los documentos, el registro y tu simulación.",
    },
  ]);
  const [input, setInput] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const locked = useRef(false),
    next = useRef(1);
  const [suggestions, setSuggestions] = useState([
    "¿Qué documentos necesito?",
    "¿Puedo solicitar sin asesor?",
    "¿Cómo uso el calendario?",
  ]);
  async function send(value = input) {
    const text = value.trim();
    if (!text || locked.current) return;
    locked.current = true;
    setBusy(true);
    setInput("");
    setError("");
    setMessages((m) => [...m, { id: next.current++, role: "user", text }]);
    try {
      const response = await supportService.reply(text, { result });
      setMessages((m) => [
        ...m,
        { id: next.current++, role: "assistant", text: response.text },
      ]);
      setSuggestions(response.suggestions);
    } catch {
      setError("No pude responder en este momento. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
      locked.current = false;
    }
  }
  return (
    <Screen
      title="Conversemos."
      eyebrow="ASISTENTE FYA"
      subtitle="Respuestas automáticas sobre esta app."
      assistant={false}
      autoScroll
      footer={
        <View style={{ gap: 8 }}>
          {!!error && <Notice error>{error}</Notice>}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TextInput
              accessibilityLabel="Escribe tu pregunta"
              placeholder="¿En qué puedo ayudarte?"
              placeholderTextColor={colors.muted}
              value={input}
              onChangeText={setInput}
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={() => void send()}
              style={[s.input, { flex: 1, minHeight: 52, fontSize: 14 }]}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enviar pregunta"
              accessibilityState={{ disabled: busy || !input.trim() }}
              disabled={busy || !input.trim()}
              onPress={() => void send()}
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                backgroundColor: colors.green,
                alignItems: "center",
                justifyContent: "center",
                opacity: busy || !input.trim() ? 0.5 : 1,
              }}
            >
              <Icon name="arrow-up" color="white" />
            </Pressable>
          </View>
          <Text style={[s.small, { fontSize: 10 }]}>
            Ayuda local · sin agente humano ni envío de mensajes
          </Text>
        </View>
      }
    >
      <Notice>
        Este asistente usa una base de ayuda local. No consulta datos externos
        ni ejecuta trámites. Usa preguntas generales, sin documentos ni datos
        sensibles.
      </Notice>
      {messages.map((message) => (
        <View
          key={message.id}
          style={{
            alignSelf: message.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "94%",
            gap: 6,
          }}
        >
          {message.role === "assistant" && (
            <View style={[s.row, { gap: 6 }]}>
              <Icon name="message-circle" size={15} />
              <Text style={s.kicker}>FYA TE ORIENTA</Text>
            </View>
          )}
          <View
            style={{
              backgroundColor: message.role === "user" ? colors.green : "white",
              borderRadius: 22,
              borderBottomRightRadius: message.role === "user" ? 6 : 22,
              borderBottomLeftRadius: message.role === "assistant" ? 6 : 22,
              padding: 18,
              borderWidth: 1,
              borderColor: message.role === "user" ? colors.green : colors.line,
            }}
          >
            <Text
              accessibilityLiveRegion={
                message.role === "assistant" ? "polite" : "none"
              }
              style={[
                s.text,
                { color: message.role === "user" ? "white" : colors.ink },
              ]}
            >
              {message.text}
            </Text>
          </View>
        </View>
      ))}
      {busy ? (
        <ActivityIndicator color={colors.green} />
      ) : (
        <View style={{ gap: 8 }}>
          <Text style={s.small}>También puedes preguntar</Text>
          {suggestions.map((question) => (
            <Pressable
              key={question}
              accessibilityRole="button"
              accessibilityLabel={question}
              onPress={() => void send(question)}
              style={({ pressed }) => ({
                padding: 14,
                minHeight: 48,
                borderRadius: 16,
                backgroundColor: pressed ? colors.lime : colors.pale,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 13,
                  color: colors.green,
                  flex: 1,
                }}
              >
                {question}
              </Text>
              <Icon name="arrow-up-left" size={17} />
            </Pressable>
          ))}
        </View>
      )}
    </Screen>
  );
}
