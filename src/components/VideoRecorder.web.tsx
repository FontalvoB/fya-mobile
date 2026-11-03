import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import type { VideoRecorderProps } from "./VideoRecorder";
import { Button, Notice, s } from "./ui";

export function VideoRecorder({
  onRecorded,
  onProgress,
  onBusy,
  instruction,
}: VideoRecorderProps) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const active = useRef(true);
  const interrupted = useRef(false);
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  useFocusEffect(
    React.useCallback(() => {
      active.current = true;
      function stop() {
        interrupted.current = true;
        if (recorder.current?.state === "recording") recorder.current.stop();
        if (timer.current) clearInterval(timer.current);
        stream.current?.getTracks().forEach((track) => track.stop());
        stream.current = null;
        setReady(false);
        setRecording(false);
        onBusy(false);
      }
      function visibility() {
        if (document.hidden) stop();
      }
      document.addEventListener("visibilitychange", visibility);
      return () => {
        active.current = false;
        stop();
        document.removeEventListener("visibilitychange", visibility);
      };
    }, [onBusy]),
  );
  async function enable() {
    setError("");
    try {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined"
      )
        throw new Error(
          "Este navegador no permite grabar. Abre la app en tu celular o usa un navegador compatible con HTTPS.",
        );
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      if (!active.current) {
        media.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = media;
      if (video.current) {
        video.current.srcObject = media;
        await video.current.play();
      }
      setReady(true);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Permite el acceso a la cámara e intenta nuevamente.",
      );
    }
  }
  function record() {
    if (!stream.current || recording) return;
    setError("");
    interrupted.current = false;
    try {
      const mimeType = [
        "video/webm;codecs=vp8",
        "video/mp4;codecs=avc1.42E01E",
        "video/webm",
        "video/mp4",
      ].find((type) => MediaRecorder.isTypeSupported(type));
      if (!mimeType)
        throw new Error(
          "Este navegador no admite un formato de video compatible.",
        );
      const rec = new MediaRecorder(stream.current, {
        mimeType,
        videoBitsPerSecond: 1000000,
      });
      recorder.current = rec;
      const chunks: Blob[] = [];
      let started = 0;
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      rec.onerror = () => {
        interrupted.current = true;
        setError("La grabación falló. Intenta nuevamente.");
      };
      rec.onstop = () => {
        if (timer.current) clearInterval(timer.current);
        if (!active.current) return;
        setRecording(false);
        onBusy(false);
        const duration = (performance.now() - started) / 1000;
        if (interrupted.current || duration < 11) {
          setError(
            "La grabación se interrumpió. Repite los 12 segundos completos.",
          );
          return;
        }
        const baseType = mimeType.split(";")[0];
        const blob = new Blob(chunks, { type: baseType });
        const uri = URL.createObjectURL(blob);
        onRecorded({
          uri,
          name: baseType === "video/mp4" ? "validacion.mp4" : "validacion.webm",
          size: blob.size,
          mimeType: baseType,
          duration,
        });
      };
      rec.onstart = () => {
        started = performance.now();
        onProgress(0);
        timer.current = setInterval(() => {
          const elapsed = (performance.now() - started) / 1000;
          onProgress(elapsed);
          if (elapsed >= 12 && rec.state === "recording") rec.stop();
        }, 200);
      };
      rec.start();
      setRecording(true);
      onBusy(true);
    } catch (e) {
      onBusy(false);
      setError(e instanceof Error ? e.message : "No se pudo grabar el video.");
    }
  }
  return (
    <View style={{ gap: 16 }}>
      <View>
        {React.createElement("video", {
          ref: video,
          autoPlay: true,
          muted: true,
          playsInline: true,
          "aria-label": "Vista previa de cámara frontal",
          style: {
            width: "100%",
            height: 300,
            objectFit: "cover",
            borderRadius: 24,
            transform: "scaleX(-1)",
          },
        })}
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
      {!ready ? (
        <Button title="Permitir cámara" onPress={enable} />
      ) : (
        <Button
          title={recording ? "Grabando…" : "Grabar video de 12 segundos"}
          disabled={recording}
          onPress={record}
        />
      )}
      {recording && (
        <Button
          secondary
          title="Cancelar grabación"
          onPress={() => {
            interrupted.current = true;
            recorder.current?.stop();
          }}
        />
      )}
      {!!error && <Notice error>{error}</Notice>}
    </View>
  );
}
