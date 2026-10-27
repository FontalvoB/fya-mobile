import React, { createContext, useContext, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import { BlurTargetView, BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type BlurTarget = React.ComponentRef<typeof BlurTargetView>;
const GlassTarget = createContext<
  React.RefObject<BlurTarget | null> | undefined
>(undefined);

export function BrandSurface({
  children,
  welcome = false,
}: {
  children: React.ReactNode;
  welcome?: boolean;
}) {
  const target = useRef<BlurTarget | null>(null);
  return (
    <GlassTarget.Provider value={target}>
      <View style={g.frame}>
        <BlurTargetView
          ref={target}
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        >
          <LinearGradient
            colors={["#C5CFCE", "#ACBCB3", "#9AADA2"]}
            locations={[0, 0.65, 1]}
            style={StyleSheet.absoluteFill}
          >
            <Image
              source={require("../../assets/Espiral_moneda.png")}
              accessible={false}
              resizeMode="cover"
              style={welcome ? g.welcomeCoins : g.subtleCoins}
            />
            {welcome && (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: "#8E9D9D33" },
                ]}
              />
            )}
          </LinearGradient>
        </BlurTargetView>
        {children}
      </View>
    </GlassTarget.Provider>
  );
}

export function GlassLayer({ intensity = 18 }: { intensity?: number }) {
  const target = useContext(GlassTarget);
  return (
    <>
      <BlurView
        pointerEvents="none"
        accessible={false}
        blurTarget={target}
        blurMethod="dimezisBlurViewSdk31Plus"
        intensity={intensity}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: "#DCE6DD18" }]}
      />
    </>
  );
}
const g = StyleSheet.create({
  frame: { flex: 1, width: "100%", maxWidth: 540, overflow: "hidden" },
  welcomeCoins: {
    width: "100%",
    height: "100%",
    transform: [{ rotate: "180deg" }],
    opacity: 0.85,
  },
  subtleCoins: {
    position: "absolute",
    right: -140,
    top: 180,
    width: 340,
    height: 760,
    borderRadius: 170,
    opacity: 0.055,
    transform: [{ rotate: "180deg" }],
  },
});
