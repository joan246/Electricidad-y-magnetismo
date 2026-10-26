# Laboratorio virtual R, C, L — Electricidad y Magnetismo 2026-2 (PUJ Cali)

Ampliación del simulador `simulador_protoboard_dc.html` del curso a un laboratorio virtual con resistencias, capacitores, inductores, fuentes DC y variable, generador de señales, voltímetros y amperímetros ilimitados y osciloscopio de varios canales. Es un solo archivo HTML, sin librerías externas ni conexión a internet.

## Archivos

| Ruta | Contenido |
|---|---|
| `simulador.html` | **simulador final** (incrementos 1 a 8) |
| `simulador_v1.html` | prototipo de la Fase 1 (incrementos 1 a 5: motor MNA, R, C y L ilimitados, generador, medidores, bancos; sin osciloscopio sobre el montaje) |
| `base/simulador_protoboard_dc.html` | archivo original del profesor, sin cambios (referencia de la regresión) |
| `informe_fase1.md` | informe de la Fase 1 |
| `plan_validacion.md` | protocolo P1–P5, criterios y primer resultado (RC) |
| `informe_final.md` | informe final (Fase 2) con resultados, análisis y anexos |
| `manual_usuario.md` | manual de uso del simulador |
| `guia_de_estudio.md` | explicación de cada bloque de código y ecuación, preguntas de sustentación |
| `bitacora.md` | registro del trabajo, decisiones, errores y correcciones |
| `docs/00_analisis_y_plan.md` | análisis del base, requisitos, modelo, arquitectura, plan y evidencia por incremento |
| `ejemplos/*.json` | los 11 montajes del protocolo (P1a … P5) con los ajustes del osciloscopio; se abren con «Cargar circuito» |
| `resultados/pruebas_motor.md` | resultados de las pruebas del motor y de la regresión (lo genera el script) |
| `resultados/validacion.md` | protocolo P1–P5: tablas de V e I de los 11 montajes, frente a la teoría del montaje y a la ideal |
| `resultados/osciloscopio/` | capturas SVG, CSV y medidas automáticas de cada ejemplo (anexos) |
| `pruebas/ejecutar_pruebas.js` | pruebas del motor, regresión del base y validación, en Node.js |
| `pruebas/generar_ejemplos.js` | regenera `ejemplos/` y `resultados/osciloscopio/` |
| `pruebas/entorno.js` | carga los bloques puros de `simulador.html` en Node, en el mismo orden que el navegador |

## Uso

Abrir `simulador.html` con doble clic en un navegador moderno (Chrome, Edge o Firefox). Lo básico:

* **Componentes y medidores** (panel izquierdo): agrega R, C, L, voltímetros, amperímetros, generadores y sondas sin límite. Aparecen en la bandeja (◀ ▶ cambia de página) y se arrastran al protoboard.
* **Circuitos de ejemplo → Ejemplos del protocolo de validación:** arma cualquiera de los 11 montajes P1a–P5 y configura el osciloscopio.
* **Osciloscopio** (debajo del protoboard): «Ejecutar» simula el montaje.
* **Protocolo de validación P1–P5:** ejecuta la validación completa y muestra las tablas.
* **Simulación temporal:** bancos RC, RL, RLC y RL–RC con fuente variable o generador.

El detalle está en `manual_usuario.md`.

## Ejecutar las pruebas

Requiere Node.js 18 o superior:

```bash
node pruebas/ejecutar_pruebas.js
```

El script prueba `simulador.html`. Termina con código 0 si todo cumple y reescribe `resultados/pruebas_motor.md` y `resultados/validacion.md`. Las mismas pruebas se pueden correr dentro de la aplicación con «Ejecutar pruebas del motor» y con «Protocolo de validación → Ejecutar».

Para regenerar los ejemplos y los anexos del osciloscopio, después de cambiar un montaje en `ModeloMontaje.EJEMPLOS`:

```bash
node pruebas/generar_ejemplos.js
```

## Historia en git

Los primeros commits se reconstruyeron a partir de los respaldos guardados al final de los incrementos 3 a 7, y solo contienen el archivo del simulador. El último commit contiene el proyecto completo. Desde aquí, cada integrante debe hacer sus propios commits con su nombre.

## Uso de IA

Este proyecto se desarrolló con la asistencia de Claude (Anthropic). Ver la declaración en `informe_final.md` y el registro en `bitacora.md`.
