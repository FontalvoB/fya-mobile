import React from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
} from "react-native";
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
        source={artwork[kind]}
        accessible={false}
        style={{ width: "38%", height: 144, alignSelf: "center" }}
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
    <ImageBackground
      source={artwork.learning}
      style={v.photo}
      imageStyle={{ width: "100%", height: "100%", resizeMode: "cover" }}
      accessible={false}
    >
      <LinearGradient
        colors={["#052F2B00", "#052F2BEF"]}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "flex-end", padding: 20, gap: 5 },
        ]}
      >
        <Text style={[s.h2, s.white]}>{title}</Text>
        <Text style={[s.small, { color: "#E1F1E8" }]}>{caption}</Text>
      </LinearGradient>
    </ImageBackground>
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
          backgroundColor: accent ? colors.lime : colors.white,
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
    backgroundColor: "#EAF4EE",
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 144,
    borderWidth: 1,
    borderColor: "#DCECE2",
  },
  photo: {
    height: 210,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.pale,
  },
  sectionNumber: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.pale,
    alignItems: "center",
    justifyContent: "center",
  },
  tile: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    gap: 25,
    minHeight: 142,
    borderWidth: 1,
    borderColor: colors.line,
  },
});
