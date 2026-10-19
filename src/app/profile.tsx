import React, { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import {
  Screen,
  Card,
  Button,
  InfoModal,
  Notice,
  s,
  colors,
  Icon,
} from "../components/ui";
import { useSession } from "../state/session";
export default function Profile() {
  const { draft, reset } = useSession();
  const [confirm, setConfirm] = useState(false);
  return (
    <Screen title="Tu espacio." eyebrow="PERFIL DE DEMOSTRACIÓN">
      <Card>
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 24,
            backgroundColor: colors.lime,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={[s.title, { fontSize: 26 }]}>
            {draft.profile.firstName.slice(0, 1)}
            {draft.profile.lastName.slice(0, 1)}
          </Text>
        </View>
        <Text style={s.h2}>
          {draft.profile.firstName} {draft.profile.lastName}
        </Text>
        <Text style={s.text}>{draft.profile.email}</Text>
        <Text style={s.text}>{draft.profile.phone}</Text>
        <Text style={s.small}>
          Documento terminado en {draft.profile.docNumber.slice(-4)}
        </Text>
      </Card>
      <Card>
        <View style={s.row}>
          <Icon name="sliders" />
          <Text style={s.h2}>Tus decisiones</Text>
        </View>
        <Text style={s.text}>
          Canales: {draft.declaration.channels.join(", ") || "Sin definir"}
        </Text>
        <Text style={s.text}>
          Publicidad:{" "}
          {draft.declaration.commercial === null
            ? "Sin decidir"
            : draft.declaration.commercial
              ? "Autorizada"
              : "No autorizada"}
        </Text>
        <Button
          secondary
          title="Editar datos de mi solicitud"
          onPress={() =>
            router.push({ pathname: "/application", params: { step: "0" } })
          }
        />
      </Card>
      <Notice>
        El borrador vive en memoria durante esta sesión. Cerrar o recargar la
        app lo elimina; los archivos seleccionados pueden quedar temporalmente
        en la caché del sistema.
      </Notice>
      <Button
        secondary
        title="Ayuda y preguntas frecuentes"
        onPress={() => router.push("/help")}
      />
      <Button
        secondary
        title="Cerrar sesión de prueba"
        onPress={() => setConfirm(true)}
      />
      <InfoModal
        visible={confirm}
        onClose={() => setConfirm(false)}
        title="¿Cerrar esta sesión?"
      >
        <View style={{ gap: 20 }}>
          <Text style={s.text}>
            Se eliminará el borrador de la memoria de la app y tendrás que
            seleccionar nuevamente los documentos. No se borrarán los archivos
            originales del dispositivo.
          </Text>
          <Button
            title="Sí, cerrar y eliminar borrador"
            onPress={() => {
              reset();
              setConfirm(false);
              router.replace("/");
            }}
          />
        </View>
      </InfoModal>
    </Screen>
  );
}
