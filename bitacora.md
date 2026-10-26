# Bitácora del proyecto

Registro de lo que se hizo, se decidió, falló y se corrigió. Las fechas y horas de las entradas automáticas vienen de las marcas de tiempo de los archivos del proyecto y de los respaldos de cada incremento. **Las secciones marcadas [completar] las llena el grupo**: no se inventaron reuniones, roles ni horas de trabajo.

Convenciones:
* «IA» = sesión de trabajo con el asistente Claude (Anthropic) en Claude Code. Ver la declaración de uso de IA en `informe_final.md`.
* Cada entrada indica la **evidencia**: el archivo o la prueba que respalda lo que se afirma.

---

## 1. Registro técnico

### 14-oct-2026 · Análisis del simulador base e incremento 1 (IA)
* Se copió el archivo del profesor a `base/simulador_protoboard_dc.html` (22:22). SHA-256 `869e47e1…64b06be9`: no se volvió a modificar.
* Análisis del base: 1 149 líneas. Solo resuelve DC con R. El solver es `gauss()` con pivoteo y no tiene tierra (fuga `LEAK` de 10⁹ Ω). Las mediciones van con ruido de instrumento. → `docs/00_analisis_y_plan.md`, secciones 1–2.
* **Decisión:** un motor MNA nuevo, separado del DOM, para que las mismas funciones corran en el navegador y en Node.js. GMIN = 1/LEAK para reproducir el base.
* **Decisión:** las pruebas comparan contra soluciones analíticas, no contra otro simulador.
* Incremento 1: motor MNA con R, V, I y C; Euler hacia atrás y trapezoidal; estado t = 0⁺; banco RC.
* **Problema:** comparar tensiones absolutas de nodo con el base daba diferencias de µV. **Causa:** sin tierra, el modo común está mal condicionado. **Solución:** comparar diferencias de tensión entre terminales y corrientes. → `resultados/pruebas_motor.md`, sección B.

### 14/15-oct-2026 · Incremento 2: inductor, RL, RLC y RL–RC (IA)
* Modelos compañeros del inductor (Euler y trapezoidal). Bancos RL, RLC (3 regímenes) y R1–(L‖(R2+C)).
* **Problema:** el orden observado del trapezoidal salió 1,69 y no 2. **Causa:** GMIN crea un piso de error de 10⁻⁶ que domina con Δt pequeño. **Solución:** la prueba de orden usa `gmin: 0`.
* **Problema:** el error relativo de Euler en mínimos cercanos a 0 se dispara. **Solución:** error normalizado con la amplitud de la señal.

### 15-oct-2026 · Incrementos 3, 4 y 5 (IA)
* 08:17 — **Incremento 3**: generador (seno, cuadrada con ciclo útil, triangular), fuente variable con deslizador, Δt automático por la matriz de estado y verificación Δt frente a Δt/2.
  * **Problema:** el trapezoidal perdía un orden en los flancos de la onda cuadrada (0,68 %). **Solución:** reinicio del estado t = 0⁺ en cada flanco (0,0004 %).
  * **Problema:** con N = 1001 pasos los flancos no caían en la grilla por redondeo. **Solución:** tolerancia `TOL_REDONDEO_N` = 10⁻⁵.
  * Respaldo: `/tmp/v1_respaldo_inc3.html`.
* 08:47 — **Incremento 4**: R, C y L ilimitados en el protoboard, resueltos por el motor. Avisos de terminales en el aire y de componentes sin fuente. JSON v2 compatible con el del base. Respaldo: `inc4`.
  * **Problema:** R = 0 solo producía un error de Δt confuso. **Solución:** `crearSimulacion` reporta primero los errores del circuito.
* 09:03 — **Incremento 5**: voltímetros y amperímetros ilimitados con R_in y R_shunt configurables, y prueba P5 (dos mallas, Kirchhoff, potencia). Respaldo: `inc5` = `simulador_v1.html` (prototipo de la fase 1).
  * **Problema:** el amperímetro y la corriente de la fuente diferían en 5·10⁻⁶. **Causa:** la fuga GMIN. **Solución:** tolerancia `TOL_FUGA_PCT` documentada.

### 20-oct-2026 · Incrementos 6, 7 y 8 y documentos (IA)
* 19:44 — **Incremento 6**: osciloscopio de N canales sobre el montaje (sondas de 1 MΩ, retícula 10 × 8, t/div, V/div, tierra, disparo, cursores, PNG, SVG y CSV).
  * **Problema:** la simulación por lotes con `requestAnimationFrame` se detenía con la pestaña oculta. **Solución:** lotes con `setTimeout` de 15 ms.
  * **Problema:** los ceros de los ejes de las gráficas no coincidían. **Solución:** `rangosAlineados`.
* 19:57 — **Incremento 7**: generador dentro del protoboard (fuente ideal + r_int), medidas automáticas, ejemplos JSON y anexos SVG y CSV. Prueba de ida y vuelta: guardar y cargar da las mismas trazas.
  * **Problema:** un comentario con la cadena `<script>` rompía la extracción de bloques del ejecutor de pruebas. **Solución:** se reescribió el comentario.
* ~20:04 — **Incremento 8**: protocolo P1–P5 sobre los 11 montajes, con teoría del montaje e ideal, y prueba de rendimiento (301 elementos, 20 000 pasos).
  * **Problema:** en el navegador el bloque de validación se cargaba antes que `ModeloMontaje`, cosa que en Node no pasaba porque cargaba los bloques en un orden fijo. **Solución:** se movió el bloque, y `entorno.js` ahora carga los bloques en el orden del HTML, igual que el navegador.
  * **Hallazgos físicos:** r_int = 50 Ω cambia los resultados entre 5 y 71 %; el «crítico» de P3b es sobreamortiguado por 0,54 Ω de más; Euler amortigua un 9,8 % de más. → `resultados/validacion.md`.
* 20:10–20:20 — `simulador.html` final, `simulador_v1.html` (fase 1), `plan_validacion.md`, `informe_fase1.md`, `informe_final.md`, `manual_usuario.md`, `guia_de_estudio.md` y esta bitácora.
  * **Corrección:** el manual decía que «Valores por defecto» deja los valores nominales. En realidad restaura las bandas pero sortea de nuevo la desviación; solo los ejemplos del protocolo usan los valores nominales.
* Estado final: pruebas 308/308, regresión 86/86 y validación 99/99 (`node pruebas/ejecutar_pruebas.js`).

---

## 2. Reuniones del grupo [completar]

| Fecha | Asistentes | Temas | Decisiones | Tareas asignadas |
|---|---|---|---|---|
| | | | | |
| | | | | |

## 3. Roles por semana [completar]

Roles: **L** líder/integración, **M** motor y pruebas, **I** interfaz, **D** documentación y validación (ver el cronograma de `informe_fase1.md`).

| Semana | [A] | [B] | [C] | [D] |
|---|---|---|---|---|
| 10 | | | | |
| 11 | | | | |
| 12 | | | | |
| 13 | | | | |
| 14 | | | | |
| 15 | | | | |
| 16 | | | | |
| 17 | | | | |

## 4. Verificaciones hechas por el grupo [completar]

Lo que cada integrante comprobó por su cuenta: por ejemplo, el cálculo a mano de τ en P1a, las pruebas en otro navegador o la revisión de una derivación de `guia_de_estudio.md`.

| Fecha | Quién | Qué verificó | Resultado |
|---|---|---|---|
| | | | |

## 5. Uso de IA

| Fecha | Herramienta | Para qué | Qué se revisó o cambió después |
|---|---|---|---|
| 14 a 20-oct-2026 | Claude (Anthropic), Claude Code | análisis del base, código del motor, interfaz, pruebas y borradores de los documentos | [completar: qué revisó cada integrante] |
