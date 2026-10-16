# FYA Mobile

Aplicación nativa de autoservicio para pensionados y docentes. Frontend de demostración para Android e iOS, con Expo SDK 58, React Native, TypeScript, Expo Router, Reanimated y selección nativa de documentos. No usa un backend ni representa aprobaciones reales.

## Desarrollo

Node >= 22.13 (desarrollado con Node 24). Repositorio privado: https://github.com/FontalvoB/fya-mobile, rama `main`.

```bash
git clone https://github.com/FontalvoB/fya-mobile.git
cd fya-mobile
npm ci
npm start
```

En Windows, usar `npm.cmd` / `npx.cmd` si PowerShell bloquea scripts. La CLI muestra un QR para abrir en un cliente Expo compatible con SDK 58. Si Expo Go instalado no soporta ese SDK, usar un development build o el APK de preview. No es una PWA ni un contenedor WebView: las pantallas usan React Native.

```bash
npm run web          # vista auxiliar en navegador
npm run android      # requiere Android SDK/emulador o dispositivo configurado
npm run ios          # simulador local: requiere macOS/Xcode
npm run typecheck
npm run lint
npm test
npx expo-doctor
npx expo export --platform all
```

Para las pruebas de interacción, iniciar `npx expo start --web --localhost --port 8081` y, en otra terminal, `npx playwright test`. Usan Chrome instalado. La configuración está en `playwright.config.ts`.

Si ese puerto está ocupado, usar `--port 8082` y establecer `FYA_BASE_URL=http://localhost:8082` para Playwright (PowerShell: `$env:FYA_BASE_URL='http://localhost:8082'`). La entrega se revisó en ese puerto para preservar otro servidor existente.

## Instaladores Android e iOS

Proyecto Expo: https://expo.dev/accounts/fontalvob/projects/fya-mobile. EAS genera las carpetas nativas; no se mantienen proyectos Android/iOS manuales.

```bash
npx eas-cli@latest login --browser
npx eas-cli@latest build --platform android --profile preview
npx eas-cli@latest build --platform ios --profile ios-simulator
npx eas-cli@latest build --platform ios --profile preview
```

El perfil Android `preview` produce un APK instalable. Instalar solo la compilación de este proyecto desde su enlace EAS; Android puede pedir permiso para instalar desde el navegador. El perfil `ios-simulator` produce una app para el simulador de Xcode, no un instalador para iPhone físico. El perfil iOS `preview` requiere Apple Developer, registro del dispositivo y firma. Distribuir por TestFlight/App Store también requiere la configuración y revisión de Apple; no se ha publicado en tiendas.

En macOS, una app de simulador descargada y extraída se instala con `xcrun simctl install booted /ruta/FYA.app`. Para una compilación de desarrollo, añadir el módulo `expo-dev-client` con `npx expo install expo-dev-client` y crear un perfil `developmentClient: true`.

## Estructura

- `src/app`: rutas y navegación.
- `src/components`: sistema de interfaz compartido.
- `src/domain`: modelos, configuración y validación.
- `src/services`: contratos y adaptador de demostración.
- `src/state`: estado de sesión en memoria.
- `assets`: recursos locales.

## Alcance

Solo cliente. Registro y OTP simulados, documentos locales, simulación de libranza, datos personales, FATCA/CRS, salud, autorizaciones, soportes obligatorios, resumen editable y seguimiento de prueba. El recibo de servicio público se solicita en Soportes, conforme a la decisión del usuario del 16 de octubre de 2026.

No hay firma electrónica, consulta de riesgo, aprobación humana, envío de archivos ni desembolso reales. Los textos y parámetros de prueba requieren confirmación antes de producción.

## Recorrido de demostración

1. Empezar un registro o elegir explícitamente el perfil ficticio desde la bienvenida. El registro ofrece rellenado de ejemplo; valida datos, contraseña y consentimiento.
2. Códigos simulados: correo `482913`, celular `735160`, confirmación `219604`. Se muestran en pantalla, tienen control de intentos, caducidad y espera de reenvío. No son mecanismos de autenticación seguros ni mensajes reales.
3. Seleccionar cédula frente/reverso. Selfie opcional con permiso y autorización. Simular revisión favorable de identidad.
4. Simular por monto o cuota, tipo pensionado/docente, ingresos y deducciones. Los parámetros del HTML son de prueba: 1,6% mensual, $1–120 millones, 12–144 meses. Se informa capacidad, sin seguros ni cargos no definidos.
5. Completar datos, FATCA/CRS, nueve respuestas de salud y detalles afirmativos; decidir canales/publicidad y aceptar autorizaciones separadas.
6. Adjuntar recibo de servicio público y desprendible. PDF/JPG/PNG, hasta 5 MB; fecha declarada del recibo hasta 90 días. Reemplazar/eliminar y validar antes de avanzar. No hay OCR ni validación de autenticidad.
7. Revisar y editar por bloques, confirmar con código y ver resultado/seguimiento de prueba. Una simulación no viable muestra que no comenzó revisión documental.

Los documentos no se envían. Las referencias se conservan en memoria; Expo Document Picker puede copiar archivos a la caché temporal del dispositivo. Cerrar/recargar elimina el borrador en memoria, no los originales del usuario. No se persisten contraseñas ni declaraciones de salud. Esto es deliberado para una demo que maneja datos sensibles.

## Diseño y arquitectura

Marfil, verde bosque y lima; Plus Jakarta Sans para lectura y DM Serif Display para títulos. Fotografía original e icono generados por IA, guardados en `assets/` y referenciados realmente por las pantallas y configuración nativa. La fotografía representa una persona ficticia, no un testimonio. El archivo optimizado pesa aproximadamente 174 KB. Prompts y procedencia: `docs/RECURSOS.txt`.

Expo Router organiza la navegación sobre React Navigation. Reanimated anima entradas y cambios de contenido; se respeta reducir movimiento, incluyendo los modales. Safe areas, desplazamiento de formularios y KeyboardAvoidingView en iOS; Android usa resize. Controles con roles/etiquetas accesibles y superficies táctiles de 44–58 puntos.

React Hook Form y Zod validan registro. `domain/model.ts` centraliza modelos, configuración y reglas del resto del flujo. `ApplicationService` permite sustituir `demoService` por un adaptador HTTP. Las simulaciones devuelven snapshots del resultado; la interfaz no consulta servicios externos. La idempotencia local evita repetir una finalización con la misma clave durante la sesión.

## Verificación y límites

Consultar `docs/QA.md` para la evidencia exacta. Se verificó la vista auxiliar en Chrome a 320, 390 y 768 px, el recorrido completo y la exportación de bundles Android/iOS/web. Una exportación JS exitosa no equivale a un instalador nativo ni a una prueba en dispositivo. El estado de las compilaciones EAS se registra por separado.

No hay Android SDK/emulador, dispositivo conectado ni Xcode en este Windows. Cámara, permisos, teclado virtual, haptics, VoiceOver/TalkBack y fluidez nativa necesitan QA en dispositivos. La previsualización de PDF muestra metadatos; las imágenes sí muestran miniatura. Los parámetros legales, financieros, pagadurías y contenido definitivo de firma siguen pendientes de aprobación del negocio.

`npm audit` reporta 26 avisos transitivos (19 altos y 7 moderados), originados en `braces`, `node-forge` y `uuid` y propagados al árbol Expo/Metro. Se ejecutó `npm audit fix` sin forzar cambios incompatibles; el informe propone degradaciones mayores que romperían el SDK. Revisar actualizaciones de proveedores antes de producción. No se declara esta demo lista para operar créditos reales.

El lockfile se regeneró con npm 11.21.1 para resolver dependencias opcionales ausentes en macOS. Se comprobó `npm ci` real en Windows y resolución limpia para macOS/Linux; no se omite ni desactiva la validación del lockfile en EAS.

## Siguiente fase

Confirmar políticas y textos; implementar autenticación/OTP en servidor; almacenamiento cifrado y validación de archivos por contenido; registro versionado de consentimientos; API idempotente de solicitudes; revisión humana; proveedores de identidad/riesgo/firma; fuente oficial de créditos. Añadir persistencia segura, pruebas nativas y observabilidad. Los permisos y reglas deben volver a validarse en servidor: los controles del frontend no son una frontera de seguridad.
