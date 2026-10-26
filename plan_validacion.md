# Plan de validación del laboratorio virtual R, C, L

Electricidad y Magnetismo · 2026-2 · Pontificia Universidad Javeriana Cali
Grupo: [NOMBRES DE LOS INTEGRANTES]

Este plan define qué circuitos se arman, con qué valores, qué magnitudes se miden, cómo se miden y con qué criterio se acepta el resultado. Cada prueba tiene un montaje guardado en `ejemplos/<id>.json` y se ejecuta de tres formas que dan el mismo resultado:

* en la app, con «Protocolo de validación P1–P5 → Ejecutar validación»;
* en Node.js, con `node pruebas/ejecutar_pruebas.js`, que escribe `resultados/validacion.md`;
* a mano: se abre el ejemplo («Circuitos de ejemplo → Ejemplos del protocolo») y se mide con el osciloscopio, los cursores y los medidores.

> **Tres tipos de valor que nunca se mezclan**
> * **Valor calculado por el motor:** lo que devuelve el simulador (columna «Simulado»).
> * **Valor analítico de referencia:** la fórmula. Se usan dos versiones: la *teoría del montaje*, con las resistencias parásitas del montaje, y la *teoría ideal* del libro.
> * **Valor medido por el usuario:** lo que el grupo anote en el laboratorio virtual con los instrumentos, o en un laboratorio real. Este plan no incluye medidas de laboratorio real: esa columna la llena el grupo.

---

## 1. Criterios de aceptación

| Clase de magnitud | Criterio | Justificación |
|---|---|---|
| Régimen estable (DC, valor final, amplitud en régimen senoidal) | error < **1 %** | Exigido por el enunciado. En régimen estable no hay error de discretización acumulado: solo quedan el redondeo y GMIN (~10⁻⁶). |
| Transitorio (valor en un instante, τ, picos, f_d, α) | error < **2 %** | Exigido por el enunciado. El error de un método de orden p con Δt = τ/50 es ≈ (Δt/τ)^p: 2 % para Euler y 0,01 % para el trapezoidal. |
| Fase | error absoluto < **0,5°** | El error relativo de una fase no sirve cerca de 0° (resonancia). 0,5° es el 1 % de 45°, la fase de un filtro en f_c. |
| Convergencia (Δt frente a Δt/2) | cambio < **1 %** | Por extrapolación de Richardson, error(Δt) ≈ Δ·2^p/(2^p − 1) ≤ 2Δ: si Δ < 1 %, el error es < 2 % incluso con Euler (p = 1). |

**Definiciones de error**

* Error puntual = |x_motor − x_teórico| / |x_teórico| · 100 %.
* Error máximo normalizado de una señal = máx_k |x_motor(t_k) − x_teórico(t_k)| / máx_k |x_teórico(t_k)| · 100 %. Se normaliza con la amplitud porque el error relativo puntual no tiene sentido donde la señal tiende a 0, como i(t → ∞) en un RC.
* Las cantidades que valen 0 en la teoría (v_L en régimen estable, el mínimo de v_C con onda cuadrada) se informan normalizadas por la excursión de la señal.

**Contra qué teoría se aplica el criterio.** Se aplica contra la **teoría del montaje**, que describe exactamente el circuito armado: r interna de las fuentes del base (0,5 Ω), r_int del generador (50 Ω), cables (0,02 Ω), shunts (0,1 Ω), sondas (1 MΩ) y voltímetros (10 MΩ). La teoría ideal se informa al lado. Su error **no** es un error del simulador: mide el peso físico de cada idealización.

---

## 2. Pruebas

Valores comunes: C = 1 µF, L = 10 mH. Las resistencias están en su valor nominal (dev = 0); en el uso normal de la app tienen la tolerancia aleatoria del simulador base.

### P1 · RC

| Ejemplo | Montaje | Magnitudes y cómo se miden | Teoría |
|---|---|---|---|
| **P1a** | Fuente 1 (10 V) → R1 = 1 kΩ → C. CH1 sobre C, CH2 en la fuente. Modo encendido, 1 ms/div. | v_C(1 ms) y v_R(1 ms) (cursores); τ al 63,2 % del valor final de CH1; i(0⁺) e i_C(1 ms); v_C final; energía ½Cv_C²; error máximo de v_C(t) e i(t) | v_C = V(1 − e^(−t/τ)), i = (V/R)e^(−t/τ), τ = RC = 1 ms, ½CV² = 50 µJ |
| **P1b** | Generador cuadrado 0–10 V, 50 Hz, r_int 50 Ω → R1 → C. CH1 = generador, CH2 = v_C. Disparo CH1 ↑ 5 V, 2 ms/div. | v_C máx y mín del régimen periódico; τ en el flanco de bajada; i_R después del flanco; tensión en bornes del generador | 1.er orden por tramos; τ = (R + r_int)·C; extremos del régimen periódico (sección 3) |

### P2 · RL

| Ejemplo | Montaje | Magnitudes | Teoría |
|---|---|---|---|
| **P2a** | Fuente 1 (10 V) → R = 100 Ω → L. CH1 sobre L, CH2 sobre R. Encendido, 100 µs/div. | v_L(0⁺); i_L(0,1 ms); τ al 63,2 % de i_L; v_R e i_R(0,1 ms); i_L final; \|v_L\| final (el inductor es un corto en DC); energía ½Li² | i = (V/R)(1 − e^(−t/τ)), v_L = V e^(−t/τ), τ = L/R = 0,1 ms |
| **P2b** | Generador cuadrado 0–10 V, 500 Hz → R = 100 Ω → L. CH1 = generador, CH2 = v_L. | i_L máx periódico; τ en el flanco; v_L tras el flanco de subida; tensión mínima en bornes del generador | τ = L/(R + r_int) |

### P3 · RLC serie con escalón (fuente 1, 10 V; CH1 = v_C, CH2 = v_R)

| Ejemplo | R | Magnitudes | Teoría |
|---|---|---|---|
| **P3a** | 20 Ω (subamortiguado) | f_d (cruces de v_C alrededor del valor final); α (recta de ln(picos)); Q; primer sobrepico y su instante; i_L máx y su instante; v_R en ese instante; v_C final | ω0 = 1/√(LC) = 10⁴ rad/s (f0 ≈ 1 591,5 Hz); α = R/2L; ω_d = √(ω0² − α²); Q = ω0/(2α) = 5 |
| **P3b** | 200 Ω (crítico) | i_L máx (V/(L·α·e)) y su instante (1/α); sobrepico (debe ser 0); v_C final | R_crít = 2√(L/C) = 200 Ω |
| **P3c** | 1 kΩ (sobreamortiguado) | i_L máx y su instante; constante lenta −1/s₁; sobrepico 0; v_C final | s₁,₂ = −α ± √(α² − ω0²) |

### P4 · Régimen senoidal (amplitud y fase por DFT en 5 períodos, relativas a CH1; fase también por Δt entre cruces)

| Ejemplo | Montaje | Magnitudes | Teoría |
|---|---|---|---|
| **P4a** | Generador seno 1 V en f_c = 1/(2πRC) ≈ 159,15 Hz → R1 → C | amplitud y fase de v_C (pasa-bajas), v_R (pasa-altas) e i; \|v_C\|/\|v_gen\| | H = 1/(1 + jωRC): en f_c, \|H\| = 1/√2 (−3 dB) y φ = −45° |
| **P4b** | Generador seno 1 V en f0 → R = 20 Ω → L → C | amplitud y fase de v_C, v_R, v_L e i; \|v_C\|/\|v_gen\| | en f0, Z = R; v_C/v_gen = −jQ |
| **P4c** | Generador seno 1 V, 1 kHz → R1 = 100 Ω → (L ‖ (R2 = 100 Ω + C)) | amplitud y fase de v_a, v_C, i_R1, i_L e i_C; KCL fasorial en el nodo a | divisor de impedancias Z_p = Z_L ‖ (R2 + Z_C) |

### P5 · DC con varias fuentes y medidores

| Ejemplo | Montaje | Magnitudes | Teoría |
|---|---|---|---|
| **P5** | Fuente 1 (12 V) → AM1 → R1 (1 kΩ) → nodo a ← R2 (2,2 kΩ) ← AM2 ← fuente 2 (5 V); a → AM3 → R3 (3,3 kΩ) → tierra; VM1 sobre R1, VM2 sobre R3 | lecturas de AM1–AM3, VM1 y VM2; V e I de R1–R3 (motor); potencia entregada; balance de potencia (Tellegen); KCL con los amperímetros | V_a = (V1/R1 + V2/R2)/(1/R1 + 1/R2 + 1/R3) = 8,1207 V; I1 = 3,879 mA; I2 = −1,418 mA (la fuente 2 recibe corriente); I3 = 2,461 mA |

Además, como parte de P5:

* **C abierto y L en corto en DC:** con un C en serie con R2 la rama 2 queda abierta; con un L en serie con R3 nada cambia. También se comprueba que el **transitorio termina** en ese punto DC.
* **Efecto de carga:** un voltímetro de 10 kΩ en el nodo a lee 5,38 % de menos, que es R_th/(R_in + R_th).
* **Regresión:** los 4 ejemplos del simulador base (serie, paralelo, mixto, divisor) no cambiaron (valores dorados, < 10⁻⁹).

### Rendimiento (RNF-06)

Una red de 301 elementos (escalera de 75 tramos R–L–C–R) se simula 20 000 pasos trapezoidales. Criterio: menos de 10 s.

---

## 3. Fórmulas de la teoría del montaje (resumen; derivación en `guia_de_estudio.md`)

* **Thévenin de una fuente real con una sonda en sus bornes:** k = R_in/(R_in + r), R = r ‖ R_in.
* **1.er orden con onda cuadrada de niveles Hi y Lo** (D = ciclo útil, q1 = e^(−D·T/τ), q2 = e^(−(1−D)·T/τ)):
  x_máx = [Hi(1 − q1) + q1·Lo(1 − q2)]/(1 − q1·q2) y x_mín = Lo(1 − q2) + q2·x_máx.
* **RLC con la sonda R_p en paralelo con C:** L·C·v'' + (L/R_p + R_t·C)·v' + (1 + R_t/R_p)·v = V, de donde α = (L/R_p + R_t·C)/(2LC), ω0² = (1 + R_t/R_p)/(LC) y v∞ = V/(1 + R_t/R_p).
* **Régimen senoidal:** divisor de impedancias con Z_R = R, Z_L = jωL, Z_C = 1/(jωC), r_int del generador y las sondas en paralelo.
* **P5:** análisis nodal con la resistencia completa de cada rama: R + r interna + cables + shunt, con los voltímetros en paralelo con R1 y R3.

---

## 4. Primer resultado: prueba RC (incremento 1, banco RC)

Valores **calculados por el motor** frente a la **solución analítica** v_C = V(1 − e^(−t/τ)), con V = 10 V, R = 1 kΩ, C = 1 µF, τ = 1 ms y Δt = τ/50 = 20 µs. Fuente ideal (sin r interna). Fuente: `resultados/pruebas_motor.md`, grupo «P1 RC escalón».

| Magnitud | Teórico | Euler hacia atrás | Error | Trapezoidal | Error |
|---|---|---|---|---|---|
| v_C(τ) | 6,32121 V | 6,28472 V | 0,577 % | 6,32133 V | 0,0019 % |
| v_R(τ) | 3,67879 V | 3,71528 V | 0,992 % | 3,67867 V | 0,0033 % |
| i(0⁺) | 10 mA | 10 mA | 0 % | 10 mA | 0 % |
| τ al 63,2 % | 1 ms | 1,00993 ms | 0,993 % | 0,99989 ms | 0,011 % |
| v_C(10τ) | 9,99955 V | 9,99949 V | 0,0006 % | 9,99954 V | 0,0001 % |
| Error máx. normalizado de v_C(t) | — | 0,365 % | < 2 % ✔ | 0,0012 % | < 2 % ✔ |
| Cambio al pasar a Δt/2 | — | 0,182 % | < 1 % ✔ | 0,0009 % | < 1 % ✔ |
| Orden de convergencia observado | 1 y 2 | 0,994 | ✔ | 2,089 | ✔ |

Además, la salida del motor coincide con la recurrencia exacta de cada método (v_k = V[1 − (1+h)^(−k)] para Euler y v_k = V[1 − r^k] para el trapezoidal) con un error ≤ 7·10⁻¹⁵. Así se confirma que el error frente a la teoría es solo de discretización, no de programación.

---

## 5. Resultados finales

* `resultados/validacion.md`: las 99 magnitudes de los 11 montajes, con la teoría del montaje, la teoría ideal y las capturas. **99/99 cumplen.**
* `resultados/pruebas_motor.md`: 308 pruebas del motor frente a la teoría y 86 de regresión.
* `resultados/osciloscopio/`: capturas SVG, CSV y medidas automáticas de cada montaje.

Resumen en `informe_final.md`, sección 5.
