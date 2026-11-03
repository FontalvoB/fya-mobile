import React, { useRef, useState } from "react";
import { AppState, View, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { File } from "expo-file-system";
import { useFocusEffect } from "expo-router";
import { LocalDocument } from "../domain/model";
import { Button, Notice, s } from "./ui";

export type VideoRecorderProps = {
  onRecorded: (file: LocalDocument) => void;
  onProgress: (seconds: number) => void;
  onBusy: (busy: boolean) => void;
  instruction: string;
};

export function VideoRecorder({
  onRecorded,
  onProgress,
  onBusy,
  instruction,
}: VideoRecorderProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(true);
  const active = useRef(true);
  const interrupted = useRef(false);
  const duration = useRef(0);
  useFocusEffect(
    React.useCallback(() => {
      active.current = true;
      setFocused(true);
      const sub = AppState.addEventListener("change", (state) => {
        if (state !== "active") {
          interrupted.current = true;
          camera.current?.stopRecording();
        }
      });
      return () => {
        active.current = false;
        setFocused(false);
        setReady(false);
        setRecording(false);
        interrupted.current = true;
        camera.current?.stopRecording();
        sub.remove();
        onBusy(false);
      };
    }, [onBusy]),
  );
  async function record() {
    if (!camera.current || recording) return;
    setError("");
    setRecording(true);
    onBusy(true);
    duration.current = 0;
    interrupted.current = false;
    onProgress(0);
    try {
      const result = await camera.current.recordAsync({
        maxDuration: 12,
        maxFileSize: 30 * 1024 * 1024,
      });
      if (!active.current) return;
      if (!result || interrupted.current || duration.current < 11)
        throw new Error(
          "La grabación se interrumpió. Repite los 12 segundos completos.",
        );
      onRecorded({
        uri: result.uri,
        name: "validacion.mp4",
        mimeType: "video/mp4",
        size: new File(result.uri).size,
        duration: duration.current,
      });
    } catch (e) {
      if (active.current)
        setError(
          e instanceof Error
            ? e.message
            : "No se pudo grabar el video. Intenta nuevamente.",
        );
    } finally {
      if (active.current) {
        setRecording(false);
        onBusy(false);
      }
    }
  }
  return (
    <View style={{ gap: 16 }}>
      {!permission?.granted ? (
        <>
          <Notice>
            Permite el acceso a la cámara para grabar el video sin audio.
          </Notice>
          <Button
            title="Permitir cámara"
            onPress={async () => {
              try {
                const p = await requestPermission();
                if (!p.granted)
                  setError(
                    "Activa el permiso de cámara en los ajustes del dispositivo.",
                  );
              } catch {
                setError("No se pudo solicitar acceso a la cámara.");
              }
            }}
          />
        </>
      ) : (
        <>
          {focused && (
            <View>
              <CameraView
                ref={camera}
                facing="front"
                mode="video"
                mute
                videoQuality="480p"
                style={{ height: 300, borderRadius: 24, overflow: "hidden" }}
                onCameraReady={() => setReady(true)}
                onMountError={() => {
                  setReady(false);
                  setError("No se pudo iniciar la cámara. Intenta nuevamente.");
                }}
                onRecordingProgress={({ duration: seconds }) => {
                  duration.current = seconds;
                  onProgress(seconds);
                }}
              />
              <Text
                accessibilityLiveRegion="polite"
                style={[
                  s.label,
                  {
                    position: "absolute",
                    bottom: 16,
                    left: 12,
                    right: 12,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: "#002E30DD",
                    color: "white",
                    textAlign: "center",
                  },
                ]}
              >
                {instruction}
              </Text>
            </View>
          )}
          <Button
            title={recording ? "Grabando…" : "Grabar video de 12 segundos"}
            disabled={!ready || recording}
            onPress={record}
          />
          {recording && (
            <Button
              secondary
              title="Cancelar grabación"
              onPress={() => {
                interrupted.current = true;
                camera.current?.stopRecording();
              }}
            />
          )}
        </>
      )}
      {!!error && <Notice error>{error}</Notice>}
    </View>
  );
}
