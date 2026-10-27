import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReducedMotion } from "react-native-reanimated";
import { Icon, colors, s } from "./ui";
import { normalizeSearch } from "../domain/catalogs";

function Sheet({
  title,
  visible,
  onClose,
  children,
}: {
  title: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  if (!visible) return null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType={reduced ? "none" : "fade"}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={styles.sheet} edges={["bottom", "left", "right"]}>
          <View style={styles.handle} />
          <View
            style={[s.between, { paddingHorizontal: 20, paddingBottom: 16 }]}
          >
            <Text accessibilityRole="header" style={[s.h2, { flex: 1 }]}>
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar selector"
              onPress={onClose}
              style={styles.iconButton}
            >
              <Icon name="x" />
            </Pressable>
          </View>
          {children}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = "Selecciona una opción",
  disabled = false,
  searchable = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState("");
  const visible = useMemo(
    () =>
      options.filter((o) =>
        normalizeSearch(o).includes(normalizeSearch(query)),
      ),
    [options, query],
  );
  return (
    <View style={{ gap: 7 }}>
      <Text style={s.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={
          value ? `Seleccionado: ${value}. Abre las opciones.` : placeholder
        }
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={() => {
          setQuery("");
          setOpen(true);
        }}
        style={[s.input, s.between, { opacity: disabled ? 0.55 : 1 }]}
      >
        <Text
          style={[
            s.text,
            { flex: 1, color: value ? colors.ink : colors.muted },
          ]}
        >
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={18} />
      </Pressable>
      <Sheet
        title={label.replace(" *", "")}
        visible={open}
        onClose={() => setOpen(false)}
      >
        {searchable && (
          <TextInput
            accessibilityLabel={`Buscar ${label.replace(" *", "").toLowerCase()}`}
            placeholder="Escribe para buscar…"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={[s.input, { marginHorizontal: 20, marginBottom: 12 }]}
            autoCorrect={false}
          />
        )}
        <FlatList
          data={visible}
          keyExtractor={(item) => item}
          keyboardShouldPersistTaps="handled"
          style={{ maxHeight: 420 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={s.text}>No hay opciones que coincidan.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item}
              accessibilityState={{ selected: item === value }}
              onPress={() => {
                Keyboard.dismiss();
                onChange(item);
                setOpen(false);
              }}
              style={[
                styles.option,
                item === value && { backgroundColor: colors.pale },
              ]}
            >
              <Text style={[s.text, { flex: 1, color: colors.ink }]}>
                {item}
              </Text>
              {item === value && <Icon name="check" size={18} />}
            </Pressable>
          )}
        />
      </Sheet>
    </View>
  );
}
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const dateString = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
export function DateField({
  label,
  value,
  onChange,
  minDate = "1900-01-01",
  maxDate = dateString(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  ),
}: {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  maxDate?: string;
}) {
  const [open, setOpen] = useState(false),
    [view, setView] = useState<"days" | "months" | "years">("days");
  const [yearQuery, setYearQuery] = useState("");
  const [year, setYear] = useState(new Date().getFullYear()),
    [month, setMonth] = useState(new Date().getMonth());
  const first = (new Date(year, month, 1).getDay() + 6) % 7,
    days = new Date(year, month + 1, 0).getDate();
  const minYear = Number(minDate.slice(0, 4)),
    maxYear = Number(maxDate.slice(0, 4));
  const initial = () => {
    const d = value && value >= minDate && value <= maxDate ? value : maxDate;
    setYear(Number(d.slice(0, 4)));
    setMonth(Number(d.slice(5, 7)) - 1);
    setView("days");
    setYearQuery("");
    setOpen(true);
  };
  const shift = (offset: number) => {
    const d = new Date(year, month + offset, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };
  return (
    <View style={{ gap: 7 }}>
      <Text style={s.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint="Abre el calendario. Puedes elegir año y mes."
        onPress={initial}
        style={[s.input, s.between]}
      >
        <Text style={[s.text, { color: value ? colors.ink : colors.muted }]}>
          {value
            ? value.split("-").reverse().join(" / ")
            : "Selecciona una fecha"}
        </Text>
        <Icon name="calendar" size={20} />
      </Pressable>
      <Sheet
        title={label.replace(" *", "")}
        visible={open}
        onClose={() => setOpen(false)}
      >
        <View style={{ paddingHorizontal: 20, paddingBottom: 20, gap: 16 }}>
          <View style={s.between}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mes anterior"
              disabled={dateString(year, month, 1) <= minDate}
              onPress={() => shift(-1)}
              style={styles.iconButton}
            >
              <Icon name="chevron-left" />
            </Pressable>
            <View style={s.row}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Elegir mes"
                onPress={() => setView(view === "months" ? "days" : "months")}
                style={styles.calendarTitle}
              >
                <Text style={s.label}>{months[month]}</Text>
                <Icon name="chevron-down" size={15} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Elegir año"
                onPress={() => setView(view === "years" ? "days" : "years")}
                style={styles.calendarTitle}
              >
                <Text style={s.label}>{year}</Text>
                <Icon name="chevron-down" size={15} />
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Mes siguiente"
              disabled={dateString(year, month, days) >= maxDate}
              onPress={() => shift(1)}
              style={styles.iconButton}
            >
              <Icon name="chevron-right" />
            </Pressable>
          </View>
          {view === "years" ? (
            <View style={{ gap: 10 }}>
              <TextInput
                accessibilityLabel="Buscar año"
                keyboardType="number-pad"
                placeholder="Escribe el año"
                placeholderTextColor={colors.muted}
                value={yearQuery}
                onChangeText={setYearQuery}
                maxLength={4}
                style={s.input}
              />
              <FlatList
                data={Array.from(
                  { length: maxYear - minYear + 1 },
                  (_, i) => maxYear - i,
                ).filter((year) => String(year).includes(yearQuery))}
                keyExtractor={String}
                keyboardShouldPersistTaps="handled"
                style={{ maxHeight: 300 }}
                renderItem={({ item }) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Año ${item}`}
                    onPress={() => {
                      Keyboard.dismiss();
                      setYear(item);
                      setView("months");
                    }}
                    style={styles.option}
                  >
                    <Text style={s.label}>{item}</Text>
                    {item === year && <Icon name="check" />}
                  </Pressable>
                )}
              />
            </View>
          ) : view === "months" ? (
            <View style={styles.grid}>
              {months.map((name, i) => (
                <Pressable
                  key={name}
                  accessibilityRole="button"
                  accessibilityLabel={`Mes ${name}`}
                  disabled={
                    dateString(year, i, 1) > maxDate ||
                    dateString(year, i, new Date(year, i + 1, 0).getDate()) <
                      minDate
                  }
                  onPress={() => {
                    setMonth(i);
                    setView("days");
                  }}
                  style={[
                    styles.month,
                    { backgroundColor: i === month ? "#BBCDC2" : "#FFFFFF38" },
                  ]}
                >
                  <Text style={s.label}>{name}</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <View>
              <View style={styles.grid}>
                {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                  <View key={i} style={styles.day}>
                    <Text style={s.small}>{d}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.grid}>
                {Array.from({ length: first + days }, (_, i) => {
                  const day = i - first + 1,
                    date = dateString(year, month, day),
                    disabled = date < minDate || date > maxDate;
                  return day <= 0 ? (
                    <View key={i} style={styles.day} />
                  ) : (
                    <Pressable
                      key={i}
                      accessibilityRole="button"
                      accessibilityLabel={`Seleccionar fecha ${date}`}
                      accessibilityState={{
                        disabled,
                        selected: value === date,
                      }}
                      disabled={disabled}
                      onPress={() => {
                        onChange(date);
                        setOpen(false);
                      }}
                      style={[
                        styles.day,
                        {
                          backgroundColor:
                            value === date ? colors.green : "transparent",
                          opacity: disabled ? 0.25 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          s.label,
                          { color: value === date ? "white" : colors.ink },
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
          <Text style={s.small}>
            Toca el año para saltar directamente a la fecha que necesitas.
          </Text>
        </View>
      </Sheet>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#073C3599",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#E0E8E2",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    width: "100%",
    maxWidth: 620,
    alignSelf: "center",
  },
  handle: {
    height: 4,
    width: 40,
    borderRadius: 4,
    backgroundColor: colors.line,
    alignSelf: "center",
    marginVertical: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.pale,
  },
  option: {
    minHeight: 52,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  calendarTitle: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  day: {
    width: "14.2857%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  month: {
    width: "33.333%",
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
});
