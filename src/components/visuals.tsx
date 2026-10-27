import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, s, Icon } from "./ui";

export const artwork = {
  lifestyle: require("../../assets/lifestyle-v2.jpg"),
  documents: require("../../assets/documents-v2.jpg"),
  plans: require("../../assets/plans-v2.jpg"),
  learning: require("../../assets/learning-v2.jpg"),
};

export function ArtPanel({
  kind,
  title,
  caption,
}: {
  kind: "documents" | "plans";
  title: string;
  caption: string;
}) {
  return (
    <View style={v.artPanel}>
      <View style={{ flex: 1, gap: 8, paddingVertical: 20, paddingLeft: 20 }}>
        <Text style={s.kicker}>
          {kind === "documents" ? "TU EXPEDIENTE" : "A TU RITMO"}
        </Text>
        <Text style={[s.h2, { fontSize: 19, lineHeight: 25 }]}>{title}</Text>
        <Text style={s.small}>{caption}</Text>
      </View>
      <Image
        source={require("../../assets/Espiral_moneda.png")}
        accessible={false}
        style={{
          width: "32%",
          height: 164,
          alignSelf: "center",
          opacity: 0.65,
          transform: [{ rotate: "180deg" }],
        }}
        resizeMode="cover"
      />
    </View>
  );
}

export function PhotoBanner({
  title,
  caption,
}: {
  title: string;
  caption: string;
}) {
  return (
    <LinearGradient
      colors={["#17585A", "#003638"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={v.photo}
    >
      <Image
        source={require("../../assets/Espiral_moneda.png")}
        accessible={false}
        resizeMode="cover"
        style={{
          position: "absolute",
          width: 145,
          height: 320,
          right: -10,
          top: -40,
          opacity: 0.32,
          transform: [{ rotate: "180deg" }],
        }}
      />
      <View style={{ padding: 24, gap: 10, maxWidth: "80%" }}>
        <View
          style={{
            alignSelf: "flex-start",
            borderRadius: 24,
            padding: 10,
            backgroundColor: "#FFFFFF16",
            borderWidth: 1,
            borderColor: "#FFFFFF38",
          }}
        >
          <Icon name="trending-up" color="#D8EDE2" />
        </View>
        <Text style={[s.h2, s.white]}>{title}</Text>
        <Text style={[s.small, { color: "#D8EDE2" }]}>{caption}</Text>
      </View>
    </LinearGradient>
  );
}

export function SectionHeading({
  number,
  title,
  detail,
}: {
  number: string;
  title: string;
  detail?: string;
}) {
  return (
    <View style={[s.row, { marginTop: 4, marginBottom: 0 }]}>
      <View style={v.sectionNumber}>
        <Text style={[s.label, { color: colors.green }]}>{number}</Text>
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={s.h2}>{title}</Text>
        {detail && <Text style={s.small}>{detail}</Text>}
      </View>
    </View>
  );
}

export function ActionTile({
  title,
  detail,
  icon,
  onPress,
  accent = false,
}: {
  title: string;
  detail: string;
  icon: React.ComponentProps<typeof Icon>["name"];
  onPress: () => void;
  accent?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        v.tile,
        {
          backgroundColor: accent ? "#FFFFFF38" : "#FFFFFF18",
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View style={s.between}>
        <Icon name={icon} size={24} />
        <Icon name="arrow-up-right" size={18} />
      </View>
      <View style={{ gap: 4 }}>
        <Text style={s.label}>{title}</Text>
        <Text style={s.small}>{detail}</Text>
      </View>
    </Pressable>
  );
}

const v = StyleSheet.create({
  artPanel: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF18",
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 144,
    borderWidth: 1,
    borderColor: "#FFFFFF66",
  },
  photo: {
    minHeight: 210,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.pale,
  },
  sectionNumber: {
    width: 38,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#FFFFFF24",
    alignItems: "center",
    justifyContent: "center",
  },
  tile: {
    flex: 1,
    borderRadius: 28,
    padding: 18,
    gap: 25,
    minHeight: 142,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
