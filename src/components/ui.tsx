import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInputProps,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Animated, {
  FadeInDown,
  LinearTransition,
  useReducedMotion,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
export const colors = {
  bg: "#F7F7EF",
  ink: "#183D32",
  green: "#174F3C",
  deep: "#0D3429",
  muted: "#63736B",
  line: "#DDE3D8",
  lime: "#DCF19A",
  white: "#FFFFFF",
  error: "#A4352E",
  pale: "#EDF1E6",
};
export const fonts = {
  regular: "Jakarta",
  medium: "JakartaMedium",
  bold: "JakartaBold",
  display: "Editorial",
};
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  body: {
    padding: 24,
    paddingTop: 12,
    gap: 22,
    paddingBottom: 32,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 14,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.green,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 43,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    color: colors.ink,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.muted,
  },
  small: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink,
  },
  input: {
    minHeight: 56,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.ink,
  },
  error: {
    color: colors.error,
    fontFamily: fonts.medium,
    fontSize: 13,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
    gap: 8,
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
  },
  link: { fontFamily: fonts.bold, fontSize: 14, color: colors.green },
  divider: { height: 1, backgroundColor: colors.line },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: colors.pale,
  },
  dark: { backgroundColor: colors.deep, borderColor: colors.deep },
  white: { color: colors.white },
});
export function Icon({
  name,
  size = 20,
  color = colors.green,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  size?: number;
  color?: string;
}) {
  return <Feather name={name} size={size} color={color} />;
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  busy = false,
  icon = "arrow-up-right",
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  busy?: boolean;
  icon?: React.ComponentProps<typeof Feather>["name"];
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={() => {
        if (Platform.OS !== "web")
          void Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => ({
        minHeight: 58,
        borderRadius: 18,
        paddingHorizontal: 22,
        backgroundColor: secondary ? colors.pale : colors.green,
        opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      })}
    >
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 15,
          color: secondary ? colors.ink : colors.white,
          flexShrink: 1,
        }}
      >
        {title}
      </Text>
      {busy ? (
        <ActivityIndicator color={secondary ? colors.green : colors.white} />
      ) : (
        <Icon name={icon} color={secondary ? colors.green : colors.lime} />
      )}
    </Pressable>
  );
}
export function LinkButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        justifyContent: "center",
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <Text style={s.link}>{title}</Text>
    </Pressable>
  );
}
export function Notice({
  children,
  error = false,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <View
      accessibilityLiveRegion="polite"
      style={{
        backgroundColor: error ? "#FBEDE8" : colors.pale,
        padding: 15,
        borderRadius: 16,
        flexDirection: "row",
        gap: 10,
      }}
    >
      <Icon
        name={error ? "alert-circle" : "info"}
        size={18}
        color={error ? colors.error : colors.green}
      />
      <Text style={[s.small, { flex: 1 }, error && { color: colors.error }]}>
        {children}
      </Text>
    </View>
  );
}
export function Card({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return <View style={[s.card, dark && s.dark]}>{children}</View>;
}
export function Field({
  label,
  error,
  ...props
}: TextInputProps & { label: string; error?: string }) {
  const [focus, setFocus] = useState(false);
  return (
    <View style={{ gap: 7 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#89948C"
        {...props}
        onFocus={(e) => {
          setFocus(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          props.onBlur?.(e);
        }}
        style={[
          s.input,
          focus && { borderColor: colors.green, borderWidth: 2 },
          error && { borderColor: colors.error },
          props.multiline && { minHeight: 108, textAlignVertical: "top" },
          props.style,
        ]}
      />
      {!!error && (
        <Text accessibilityLiveRegion="polite" style={s.error}>
          {error}
        </Text>
      )}
    </View>
  );
}
export function Choice({
  label,
  selected,
  onPress,
  detail,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  detail?: string;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        borderWidth: 1.5,
        borderColor: selected ? colors.green : colors.line,
        backgroundColor: selected ? "#EEF3E3" : "#FFF",
        borderRadius: 17,
        padding: 16,
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View
        style={{
          width: 23,
          height: 23,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: selected ? colors.green : "#AFBBAF",
          backgroundColor: selected ? colors.green : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <Icon name="check" size={16} color="white" />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.label}>{label}</Text>
        {!!detail && <Text style={[s.small, { marginTop: 4 }]}>{detail}</Text>}
      </View>
    </Pressable>
  );
}
export function Segments({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {items.map((item) => (
        <Pressable
          key={item}
          accessibilityRole="radio"
          accessibilityLabel={item}
          accessibilityState={{ selected: item === value }}
          onPress={() => onChange(item)}
          style={{
            minHeight: 48,
            paddingHorizontal: 16,
            paddingVertical: 13,
            borderRadius: 13,
            backgroundColor: item === value ? colors.green : colors.white,
            borderWidth: 1,
            borderColor: item === value ? colors.green : colors.line,
          }}
        >
          <Text
            style={[s.label, { color: item === value ? "white" : colors.ink }]}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={s.label}>{label}</Text>
      <Segments
        items={["No", "Sí"]}
        value={value === null ? "" : value ? "Sí" : "No"}
        onChange={(v) => onChange(v === "Sí")}
      />
    </View>
  );
}
export function Reveal({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      entering={reduced ? undefined : FadeInDown.duration(260)}
      layout={reduced ? undefined : LinearTransition.duration(200)}
      style={{ gap: 22 }}
    >
      {children}
    </Animated.View>
  );
}
export function Screen({
  children,
  title,
  eyebrow,
  subtitle,
  footer,
  back = true,
  progress,
  onBack,
}: {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  back?: boolean;
  progress?: number;
  onBack?: () => void;
}) {
  return (
    <SafeAreaView style={s.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 620,
            alignSelf: "center",
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: 16,
            gap: 16,
          }}
        >
          <View style={s.between}>
            {back ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Volver"
                onPress={
                  onBack ||
                  (() =>
                    router.canGoBack()
                      ? router.back()
                      : router.replace("/home"))
                }
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 22,
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: colors.line,
                }}
              >
                <Icon name="arrow-left" />
              </Pressable>
            ) : (
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 25,
                  letterSpacing: -1.5,
                  color: colors.ink,
                }}
              >
                fya<Text style={{ color: "#7D9B45" }}>•</Text>
              </Text>
            )}
            <View style={s.pill}>
              <Text style={[s.small, { fontSize: 10, letterSpacing: 1 }]}>
                DEMO · SIN ENVÍOS
              </Text>
            </View>
          </View>
          {progress !== undefined && (
            <View
              accessibilityRole="progressbar"
              accessibilityValue={{
                min: 0,
                max: 100,
                now: Math.round(progress * 100),
              }}
              style={{
                height: 5,
                backgroundColor: colors.line,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  height: 5,
                  width: `${progress * 100}%`,
                  backgroundColor: colors.green,
                  borderRadius: 10,
                }}
              />
            </View>
          )}
        </View>
        <ScrollView
          key={title}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.body}
          showsVerticalScrollIndicator={false}
        >
          {title && (
            <View style={{ gap: 10 }}>
              {eyebrow && <Text style={s.kicker}>{eyebrow}</Text>}
              <Text accessibilityRole="header" style={s.title}>
                {title}
              </Text>
              {subtitle && <Text style={s.text}>{subtitle}</Text>}
            </View>
          )}
          {children}
        </ScrollView>
        {footer && <View style={s.footer}>{footer}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function InfoModal({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduced ? "none" : "fade"}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#0D3429AA",
          justifyContent: "flex-end",
        }}
      >
        <SafeAreaView
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 24,
            maxHeight: "85%",
            gap: 18,
          }}
        >
          <Text style={s.h2}>{title}</Text>
          <ScrollView>{children}</ScrollView>
          <Button title="Entendido" onPress={onClose} />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
