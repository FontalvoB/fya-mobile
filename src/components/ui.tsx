import React, { useState, useRef } from "react";
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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BrandLogo, BottomNavigation, brandHeaderTop } from "./brand";
import { BrandSurface, GlassLayer } from "./glass";
import Feather from "@expo/vector-icons/Feather";
import Animated, {
  FadeInDown,
  LinearTransition,
  useReducedMotion,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
export const colors = {
  bg: "#C1CDCA",
  ink: "#082F2E",
  green: "#00474A",
  deep: "#003638",
  muted: "#405B53",
  line: "#FFFFFF66",
  lime: "#D3E8DE",
  white: "#FFFFFF",
  error: "#A4352E",
  pale: "#FFFFFF26",
};
export const fonts = {
  regular: "Manrope",
  medium: "ManropeMedium",
  bold: "ManropeBold",
  display: "ManropeExtraBold",
};
export const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  body: {
    padding: 24,
    paddingTop: 12,
    gap: 22,
    paddingBottom: 32,
    width: "100%",
    maxWidth: 540,
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
    backgroundColor: "#FFFFFF0D",
    overflow: "hidden",
    borderRadius: 30,
    padding: 20,
    boxShadow: "0px 8px 30px rgba(15, 53, 42, 0.045)",
    borderWidth: 1,
    borderColor: colors.line,
    gap: 14,
  },
  kicker: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.green,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 31,
    lineHeight: 38,
    letterSpacing: -1.3,
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
    backgroundColor: "#FFFFFF1F",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
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
    backgroundColor: "#D3DDD254",
    gap: 8,
    width: "100%",
    maxWidth: 540,
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
  return (
    <Feather
      name={name}
      size={size}
      color={color}
      accessible={false}
      aria-hidden={true}
    />
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  busy = false,
  icon = "arrow-up-right",
  onDark = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  busy?: boolean;
  icon?: React.ComponentProps<typeof Feather>["name"];
  onDark?: boolean;
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
        borderRadius: 32,
        paddingHorizontal: 22,
        backgroundColor: onDark
          ? "#DCEEE5"
          : secondary
            ? "#FFFFFF38"
            : colors.green,
        borderWidth: 1,
        borderColor: secondary ? "#FFFFFF75" : "#FFFFFF12",
        boxShadow: secondary ? undefined : "0px 5px 14px rgba(7, 92, 75, 0.16)",
        opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      })}
    >
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 14,
          letterSpacing: 0.5,
          textAlign: "center",
          color: secondary || onDark ? colors.ink : colors.white,
          flexShrink: 1,
        }}
      >
        {title}
      </Text>
      {busy ? (
        <ActivityIndicator color={secondary ? colors.green : colors.white} />
      ) : (
        <Icon
          name={icon}
          size={18}
          color={secondary || onDark ? colors.green : "#D3E8DE"}
        />
      )}
    </Pressable>
  );
}
export function LinkButton({
  title,
  onPress,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
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
        backgroundColor: error ? "#FFE5DCB8" : "#FFFFFF18",
        borderWidth: 1,
        borderColor: error ? "#C78E7966" : colors.line,
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
  return (
    <View style={[s.card, dark && s.dark]}>
      {dark ? (
        <LinearGradient
          colors={["#075459", "#002E30"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <GlassLayer />
      )}
      {children}
    </View>
  );
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
        placeholderTextColor="#647B70"
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
        backgroundColor: selected ? "#00474A14" : "#FFFFFF18",
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
            borderRadius: 28,
            backgroundColor: item === value ? colors.green : "#FFFFFF20",
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
  assistant = true,
  autoScroll = false,
}: {
  children: React.ReactNode;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  back?: boolean;
  progress?: number;
  onBack?: () => void;
  assistant?: boolean;
  autoScroll?: boolean;
}) {
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "#D8DEDB", alignItems: "center" }}>
      <BrandSurface>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={{
              paddingHorizontal: 26,
              paddingTop: brandHeaderTop(insets.top),
              paddingBottom: 12,
              gap: 16,
            }}
          >
            <View style={s.between}>
              <BrandLogo />
              <View style={[s.row, { gap: 10 }]}>
                <View
                  style={{
                    paddingHorizontal: 17,
                    paddingVertical: 8,
                    backgroundColor: colors.deep,
                    borderRadius: 24,
                  }}
                >
                  <Text
                    accessibilityLabel="Demostración local, sin envíos"
                    style={{
                      fontFamily: fonts.regular,
                      color: "#D3E3DC",
                      fontSize: 10,
                      letterSpacing: 1,
                    }}
                  >
                    DEMO
                  </Text>
                </View>
                {assistant && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Abrir asistente de ayuda"
                    onPress={() => router.push("/chat")}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 24,
                      backgroundColor: colors.deep,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="message-circle" color="#D3E3DC" />
                  </Pressable>
                )}
              </View>
            </View>
            {(back || progress !== undefined) && (
              <View style={s.row}>
                {back && (
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
                      width: 40,
                      height: 40,
                      borderRadius: 22,
                      backgroundColor: "#FFFFFF26",
                      borderWidth: 1,
                      borderColor: colors.line,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="arrow-left" />
                  </Pressable>
                )}
                {progress !== undefined && (
                  <View style={{ flex: 1, gap: 6 }}>
                    <View style={s.between}>
                      <Text style={s.kicker}>CADA PASO, MÁS CERCA</Text>
                      <Text style={s.small}>{Math.round(progress * 100)}%</Text>
                    </View>
                    <View
                      accessibilityRole="progressbar"
                      accessibilityValue={{
                        min: 0,
                        max: 100,
                        now: Math.round(progress * 100),
                      }}
                      style={{
                        height: 4,
                        borderRadius: 8,
                        backgroundColor: "#FFFFFF50",
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: 4,
                          width: progress * 100 + "%",
                          backgroundColor: colors.green,
                          borderRadius: 8,
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
          <ScrollView
            ref={scrollRef}
            key={title}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.body}
            onContentSizeChange={() => {
              if (autoScroll)
                scrollRef.current?.scrollToEnd({ animated: false });
            }}
          >
            {title && (
              <View style={{ gap: 10, marginBottom: 2 }}>
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
        <BottomNavigation bottomInset={insets.bottom} />
      </BrandSurface>
    </View>
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
          backgroundColor: "#073C35AA",
          justifyContent: "flex-end",
        }}
      >
        <SafeAreaView
          style={{
            backgroundColor: "#D6E1DA",
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
