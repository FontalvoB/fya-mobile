# Evidencia de QA — 16 octubre 2026

## Comprobaciones ejecutadas

- TypeScript: sin errores.
- ESLint: sin errores ni advertencias tras corregir el ciclo de vida del OTP.
- `npm test`: 10 pruebas de dominio aprobadas. Documentos obligatorios, formato/tamaño, fechas, FATCA condicional, salud/detalle, publicidad opcional, cálculo, OTP, idempotencia y resultados favorable/no viable.
- `expo-doctor`: 20/20 comprobaciones aprobadas.
- `expo export --platform all`: bundles Hermes Android e iOS y vista web generados correctamente. No equivale a ejecutar en un dispositivo.
- Playwright / Chrome: tres escenarios aprobados. Registro con errores y OTP, documentos de identidad/revisión; solicitud completa con campos condicionales, errores de documentos, reemplazo/eliminación, edición, resultado y seguimiento; bienvenida a 320/390/768 px y navegación de créditos/perfil/ayuda.
- En el recorrido completo se capturan errores JavaScript del navegador; no se detectaron.

## Iteración visual

Se inspeccionaron capturas de bienvenida, inicio, soportes y resultado. Se corrigió el tamaño intrínseco de la fotografía en React Native Web, la superposición temporal de contenido al cambiar etapas y la conservación incorrecta del desplazamiento. Las capturas se toman después de terminar la transición.

Se optimizó la fotografía a 174 KB y se importan solo cuatro fuentes e iconos Feather. Los originales generados quedan versionados como material de origen.

## Limitaciones verificables

No hay Android SDK/emulador, dispositivos conectados ni Xcode en este equipo. No se afirma haber probado cámara, selector nativo, teclado virtual, haptics, lectores de pantalla o rendimiento en Android/iOS. La selección de archivos y el flujo se probaron en Chrome; requieren una ronda adicional nativa. El recibo se valida por metadatos y fecha declarada, no por OCR o autenticidad.

No se conecta backend. Registro, OTP, revisión de identidad, resultado de centrales, finalización y seguimiento son demostrativos. No existe firma ni desembolso real. No se usa almacenamiento persistente de información personal.

## Compilaciones nativas solicitadas

- Android APK: https://expo.dev/accounts/fontalvob/projects/fya-mobile/builds/78aea93d-cf9e-422b-93eb-b09e8fd9510c
- iOS simulador: https://expo.dev/accounts/fontalvob/projects/fya-mobile/builds/475ba654-d422-42e2-bd5a-4487d421df5d

El estado final se actualizará al recibir el resultado de EAS. No se ha publicado en App Store ni Google Play. iOS para dispositivos físicos requiere Apple Developer y provisión.
