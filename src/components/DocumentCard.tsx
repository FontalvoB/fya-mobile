import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { LocalDocument, policy, validateDocument } from "../domain/model";
import { Icon, LinkButton, Notice, colors, s } from "./ui";
export function DocumentCard({
  title,
  hint,
  value,
  onChange,
  required = true,
}: {
  title: string;
  hint: string;
  value?: LocalDocument;
  onChange: (v: LocalDocument | undefined) => void;
  required?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function pick() {
    setError("");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: policy.mimeTypes,
        copyToCacheDirectory: true,
        multiple: false,
        base64: false,
      });
      if (result.canceled) return;
      setBusy(true);
      const a = result.assets[0];
      const ext = a.name.split(".").pop()?.toLowerCase();
      const mime =
        a.mimeType ||
        {
          pdf: "application/pdf",
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
        }[ext || ""] ||
        "";
      const size = a.size ?? (Platform.OS !== "web" ? new File(a.uri).size : 0);
      const file: LocalDocument = {
        name: a.name,
        uri: a.uri,
        size,
        mimeType: mime,
      };
      const problem = validateDocument(file);
      if (problem) throw new Error(problem);
      onChange(file);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "No se pudo abrir el archivo. Inténtalo de nuevo.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: value ? "#B7D7C4" : colors.line,
        boxShadow: "0px 6px 20px rgba(15,53,42,0.035)",
        borderRadius: 24,
        padding: 20,
        backgroundColor: "#FFFFFF20",
        gap: 16,
      }}
    >
      <View style={s.between}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: colors.pale,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={value ? "check-circle" : "file-plus"} />
        </View>
        <Text style={s.kicker}>{required ? "Obligatorio" : "Opcional"}</Text>
      </View>
      <Text style={s.h2}>{title}</Text>
      <Text style={s.small}>{hint}</Text>
      {busy ? (
        <ActivityIndicator color={colors.green} />
      ) : value ? (
        <View style={{ gap: 10 }}>
          {value.mimeType.startsWith("image/") && (
            <Image
              source={{ uri: value.uri }}
              accessibilityLabel={"Vista previa de " + title}
              style={{ height: 130, width: "100%", borderRadius: 12 }}
              resizeMode="contain"
            />
          )}
          <Text style={s.label} numberOfLines={2}>
            {value.name}
          </Text>
          <Text style={s.small}>
            {value.mimeType} ·{" "}
            {value.size < 1024
              ? `${value.size} B`
              : `${(value.size / 1024).toFixed(0)} KB`}
          </Text>
          <Text style={[s.small, { color: colors.green }]}>
            {value.demo
              ? "Archivo ficticio de demostración · sin enviar"
              : "Seleccionado en este dispositivo · sin enviar"}
          </Text>
          <View style={s.between}>
            <LinkButton
              title="Reemplazar"
              accessibilityLabel={"Reemplazar " + title.toLowerCase()}
              onPress={pick}
            />
            <LinkButton
              title="Eliminar"
              accessibilityLabel={"Eliminar " + title.toLowerCase()}
              onPress={() => {
                onChange(undefined);
                setError("");
              }}
            />
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={"Seleccionar " + title.toLowerCase()}
          onPress={pick}
          style={({ pressed }) => ({
            borderWidth: 1.5,
            borderStyle: "dashed",
            borderColor: "#A4BEB0",
            borderRadius: 18,
            minHeight: 136,
            padding: 18,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: pressed ? "#FFFFFF50" : "#FFFFFF20",
          })}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 15,
              backgroundColor: colors.lime,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="upload" size={21} />
          </View>
          <Text style={[s.label, { textAlign: "center" }]}>
            Toca para elegir tu archivo
          </Text>
          <Text style={[s.small, { textAlign: "center" }]}>
            Desde los archivos de tu dispositivo
          </Text>
        </Pressable>
      )}
      <Text style={s.small}>
        PDF, JPG o PNG · máximo {policy.maxBytes / 1024 / 1024} MB
      </Text>
      {!!error && <Notice error>{error}</Notice>}
    </View>
  );
}
