# Historial de la entrega

Repositorio privado: https://github.com/FontalvoB/fya-mobile. Rama principal: `main`.

- `2ef5324`: inspección funcional del HTML y decisiones de arquitectura nativa.
- `27bad27`: sistema visual, imágenes integradas, modelos, documentos y servicios de prueba.
- `8e04c70`: registro, identidad, simulador, solicitud completa, resumen, resultados y seguimiento.
- `977c386`: iteración visual, fuentes optimizadas, encuadre y navegación comprobada.
- `edcfcda`: instalación reproducible entre Windows/macOS/Linux y documentación de ejecución.
- `a9cd3c1`: evidencia de QA, capturas reales e instrucciones.
- `8afe096`: corrección de legibilidad a 320 px, verificada en las pruebas de navegador.
- `351cb0d`: entrega y comprobación del artefacto iOS para simulador.

La entrega final también incluye el APK Android generado correctamente en EAS y comprobado por integridad. Los enlaces de descarga y el alcance de las verificaciones están en README y docs/QA.md. Ambos builds usan el código de `8afe096`; los commits posteriores actualizan únicamente documentación.

Los cambios se publicaron durante el desarrollo, después de cada bloque. Se verificó el SHA remoto de main. No se modificaron los repositorios existentes frontend-fya ni backend-fya.

Los instaladores se construyen en Expo EAS; no contienen un backend. La firma Android se gestiona en EAS y ninguna clave de firma se guarda en Git. El artefacto iOS de esta entrega es para simulador: no equivale a un IPA para iPhone físico.

## Rediseño solicitado el 19 de octubre

- `ddecd76`: nueva dirección fintech, Manrope, cuatro recursos generados e integración por módulos.
- `7a33ad1`: iteración del encuadre, formularios, soportes y versión 1.1.0; capturas adicionales en el recorrido automatizado.
