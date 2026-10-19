# Evidencia de QA — 16 octubre 2026

## Comprobaciones ejecutadas

- TypeScript: sin errores.
- ESLint: sin errores ni advertencias tras corregir el ciclo de vida del OTP.
- `npm test`: 10 pruebas de dominio aprobadas. Documentos obligatorios, formato/tamaño, fechas, FATCA condicional, salud/detalle, publicidad opcional, cálculo, OTP, idempotencia y resultados favorable/no viable.
- `expo-doctor`: 20/20 comprobaciones aprobadas.
- `expo export --platform all`: bundles Hermes Android e iOS y vista web generados correctamente. No equivale a ejecutar en un dispositivo.
- Playwright / Chrome: tres escenarios aprobados, repetidos después de `npm ci` contra esta entrega en localhost:8082. Registro con errores y OTP, documentos de identidad/revisión; solicitud completa con campos condicionales, errores de documentos, reemplazo/eliminación, edición, resultados favorable/no viable y seguimiento coherente; bienvenida a 320/390/768 px y navegación de créditos/perfil/ayuda.
- En el recorrido completo se capturan errores JavaScript del navegador; no se detectaron.

## Iteración visual

Se inspeccionaron capturas de bienvenida, inicio, soportes y resultado. Se corrigió el tamaño intrínseco de la fotografía en React Native Web, la superposición temporal de contenido al cambiar etapas y la conservación incorrecta del desplazamiento. Las capturas se toman después de terminar la transición.

Se optimizó la fotografía a 174 KB y se importan solo cuatro fuentes e iconos Feather. Los originales generados quedan versionados como material de origen.

Capturas revisadas: `previews/bienvenida-390.png`, `previews/soportes.png`, `previews/documentos-seleccionados.png` y `previews/resultado.png`. Son capturas reales del frontend; contienen solo datos ficticios.

## Limitaciones verificables

No hay Android SDK/emulador, dispositivos conectados ni Xcode en este equipo. No se afirma haber probado cámara, selector nativo, teclado virtual, haptics, lectores de pantalla o rendimiento en Android/iOS. La selección de archivos y el flujo se probaron en Chrome; requieren una ronda adicional nativa. El recibo se valida por metadatos y fecha declarada, no por OCR o autenticidad.

No se conecta backend. Registro, OTP, revisión de identidad, resultado de centrales, finalización y seguimiento son demostrativos. No existe firma ni desembolso real. No se usa almacenamiento persistente de información personal.

## Compilaciones nativas solicitadas

- Android APK final: https://expo.dev/accounts/fontalvob/projects/fya-mobile/builds/28f31ffd-5619-4662-8227-0b8723429f0e
- iOS simulador final: https://expo.dev/accounts/fontalvob/projects/fya-mobile/builds/fabdc6d1-5332-4595-a840-706a668eeefa

El primer intento iOS falló por dependencias opcionales ausentes en el lockfile generado con npm 11.6.2. Se regeneró con npm 11.21.1, se verificó instalación limpia y se reintentó. El primer Android se canceló en cola para usar la corrección. En el siguiente iOS se verificaron exitosamente instalación de dependencias, prebuild y CocoaPods. Esa revisión se reemplazó para incluir el último ajuste de legibilidad a 320 px. Los dos builds finales corresponden al código `8afe096118ed08548f00ae9d7bb9e93763a0eda7`.

El build iOS final terminó con estado FINISHED y produjo un archivo `.tar.gz` para simulador (23.370.208 bytes). Se descargó y se verificaron sus 274 entradas, Info.plist, identificador `com.fyasocialcapital.mobile`, versión `1.0.0` y plataforma `iphonesimulator`. Esto verifica el artefacto, no su ejecución.

El build Android final terminó con estado FINISHED. Se descargó el APK de 94.360.884 bytes y se verificó la integridad CRC de sus 1.269 entradas, la presencia de AndroidManifest.xml y classes.dex, y bibliotecas para arm64-v8a, armeabi-v7a, x86 y x86_64. No se ha ejecutado en un dispositivo ni se ha hecho una comprobación independiente de su firma. Descarga: https://expo.dev/artifacts/eas/lMIliF90I8uKZBBO6K5szi2VqBck_0ODKglly_Q-sKI.apk

Ambas compilaciones nativas finalizaron correctamente. No se ha publicado en App Store ni Google Play. iOS para dispositivos físicos requiere Apple Developer y provisión.

## Verificación del rediseño 1.1.0 · 19 octubre 2026

- TypeScript y ESLint: aprobados.
- 10 pruebas de dominio: aprobadas.
- Los 3 recorridos Playwright existentes vuelven a aprobar con el diseño final, incluyendo registro/OTP/identidad, solicitud completa, soportes inválidos y válidos, eliminación/reemplazo, edición, resultado favorable/no viable y navegación secundaria.
- Exportación de bundles Android/iOS/web: aprobada. La primera ejecución aislada de Hermes falló con código 6; fuera del sandbox la exportación terminó correctamente. No se cambió el código para ocultar el error.
- Las primeras pruebas de navegador no pudieron acceder al servidor aislado; se repitieron sobre localhost:8084 y pasaron. No se cuentan los intentos sin carga de la app como pruebas funcionales exitosas.
- Capturas nuevas en docs/previews/v2. Se inspeccionaron bienvenida 320/390, inicio 390, simulador 320/390, registro, identidad, soportes, resultado, perfil, ayuda y créditos. Se corrigió el recorte del retrato, se simplificó el progreso duplicado y se hizo más visible la zona de selección de soportes.
- Se recorrieron además siete vistas con preferencia de movimiento reducido en Chrome. Esto no sustituye una prueba de accesibilidad ni de animaciones en dispositivo físico.
- Los cuatro JPEG nuevos suman 419.946 bytes. Manrope sustituye las dos familias anteriores en la app; las dependencias de fuentes antiguas fueron retiradas.
- Siguen pendientes las pruebas físicas de teclado, selector nativo, cámara, haptics y rendimiento, así como los avisos transitivos de dependencias ya documentados.

Compilaciones 1.1.0 solicitadas sobre el código 778b4ba:
- Android: https://expo.dev/accounts/fontalvob/projects/fya-mobile/builds/b9c852e6-4a5c-4cf7-9b1a-ce80b17c88f7
- iOS simulador: https://expo.dev/accounts/fontalvob/projects/fya-mobile/builds/f60996e4-14e7-411f-96df-eded6ebd5081

El resultado de estas compilaciones se actualiza al comprobar sus artefactos. Los enlaces 1.0.0 anteriores corresponden al diseño del 16 de octubre.

Última iteración: se oscureció el texto secundario a #52665D. Contrastes calculados: 5,00:1 sobre lima, 5,33:1 sobre verde pálido, 5,70:1 sobre fondo y 5,46:1 sobre los paneles ilustrados. El inicio reduce la ilustración y ajusta el título en pantallas menores de 360 px. Las primeras compilaciones de 1.1.0 se cancelaron explícitamente para incluir estas mejoras; los IDs anteriores listados fueron sustituidos por los builds definitivos.

iOS 1.1.0 final: FINISHED. Archivo descargado de 23.619.879 bytes; las 276 entradas del tar se leyeron correctamente. Info.plist confirma versión 1.1.0, identificador com.fyasocialcapital.mobile y plataforma iphonesimulator. El build corresponde a 778b4ba6b3e978b207f287e7b0d7187578c36d41. No se ha ejecutado en Xcode ni en iPhone.

Android 1.1.0 final: FINISHED. Archivo descargado de 94.612.212 bytes; CRC de 1.272 entradas verificado, con AndroidManifest.xml, classes.dex y bibliotecas arm64-v8a, armeabi-v7a, x86 y x86_64. EAS confirma appVersion 1.1.0 y commit 778b4ba6b3e978b207f287e7b0d7187578c36d41. No se ha ejecutado en dispositivo ni se ha verificado independientemente la firma. Ambas compilaciones finales están terminadas y descargadas.
