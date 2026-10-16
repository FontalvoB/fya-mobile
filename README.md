# FYA Mobile

Aplicación nativa de autoservicio para pensionados y docentes. Frontend de demostración para Android e iOS, con Expo SDK 58, React Native, TypeScript, Expo Router, Reanimated y selección nativa de documentos. No usa un backend ni representa aprobaciones reales.

## Desarrollo

Node >= 22.13. Instalar con `npm ci`, iniciar con `npm start`. Vista auxiliar: `npm run web`. Las instrucciones completas y los resultados de QA se incorporan durante la implementación.

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
