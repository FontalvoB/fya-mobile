import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { BrandLogo } from "./brand";
import { money } from "../domain/model";

export function LoanSummaryCard({
  payment,
  months,
  monthlyRate,
}: {
  payment: number;
  months: number;
  monthlyRate: number;
}) {
  const rate = (monthlyRate * 100).toLocaleString("es-CO", {
    maximumFractionDigits: 2,
  });
  return (
    <LinearGradient
      colors={["#14656A", "#004348", "#002C30"]}
      locations={[0, 0.45, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={c.card}
    >
      <View
        pointerEvents="none"
        accessible={false}
        aria-hidden
        style={StyleSheet.absoluteFill}
      >
        <View
          style={[c.orbit, { width: 240, height: 240, right: -120, top: -82 }]}
        />
        <View
          style={[c.orbit, { width: 300, height: 300, right: -150, top: -112 }]}
        />
        <View
          style={[c.orbit, { width: 360, height: 360, right: -180, top: -142 }]}
        />
        <LinearGradient
          colors={["#FFFFFF12", "#FFFFFF00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={c.row}>
        <BrandLogo light compact />
        <View accessible={false} aria-hidden style={c.hardware}>
          <LinearGradient
            colors={["#D7DEBC", "#9CB89F", "#DCE6C8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={c.chip}
          >
            <View style={c.chipHorizontal} />
            <View style={c.chipVertical} />
          </LinearGradient>
          <Feather
            name="wifi"
            size={18}
            color="#BCD7C9"
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        </View>
      </View>
      <View style={{ marginTop: 12 }}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={c.label}>CUOTA MENSUAL ESTIMADA</Text>
          <Text adjustsFontSizeToFit numberOfLines={1} style={c.payment}>
            {money(payment)}
          </Text>
        </View>
      </View>
      <View style={c.footer}>
        <View style={{ gap: 4 }}>
          <Text style={c.metaLabel}>PLAZO</Text>
          <Text style={c.metaValue}>{months} meses</Text>
        </View>
        <View style={{ gap: 4, alignItems: "flex-end" }}>
          <Text style={c.metaLabel}>TASA DE PRUEBA</Text>
          <Text style={c.metaValue}>{rate}% / mes</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
const c = StyleSheet.create({
  card: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#C5E1D65C",
    overflow: "hidden",
    padding: 22,
    minHeight: 220,
    boxShadow: "0px 12px 25px rgba(0, 47, 47, 0.17)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  orbit: {
    position: "absolute",
    borderRadius: 200,
    borderWidth: 1,
    borderColor: "#CBE4D916",
    backgroundColor: "#CBE4D903",
  },
  label: {
    color: "#CCE1D7",
    fontFamily: "ManropeMedium",
    fontSize: 9,
    letterSpacing: 0.5,
  },
  payment: {
    color: "#FFFFFF",
    fontFamily: "ManropeBold",
    fontSize: 35,
    lineHeight: 46,
    fontVariant: ["tabular-nums"],
    letterSpacing: 0.5,
    marginTop: 3,
  },
  hardware: { flexDirection: "row", gap: 7, alignItems: "center" },
  chip: {
    width: 33,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D8E6C580",
    overflow: "hidden",
  },
  chipHorizontal: {
    position: "absolute",
    top: 11,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#3B665D70",
  },
  chipVertical: {
    position: "absolute",
    left: 10,
    top: 0,
    bottom: 0,
    width: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#3B665D70",
    borderRadius: 4,
  },
  footer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#FFFFFF29",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaLabel: {
    color: "#AFCBC0",
    fontFamily: "ManropeMedium",
    fontSize: 8,
    letterSpacing: 1,
  },
  metaValue: { color: "#F2FAF5", fontFamily: "ManropeMedium", fontSize: 12 },
});
