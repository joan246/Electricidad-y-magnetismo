# Resultados de las pruebas del motor — incrementos 1 a 11

Generado automáticamente por `pruebas/ejecutar_pruebas.js` el 2026-11-12T22:31:25.319Z con Node v22.21.1.
Todos los valores "motor" son **calculados por el motor** (no son medidas de laboratorio). Los valores "teórico" son la **solución analítica de referencia**.

**Resumen:** pruebas del motor 308/308 · regresión del base 96/96 · protocolo P1–P5 99/99 · rendimiento cumple · tiempo 2037 ms

## A. Motor frente a la teoría


### P1 RC escalón (R = 1 kΩ, C = 1 µF) · Euler hacia atrás · Δt = 2.000e-5 s

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| i(0⁺) | 0,01 | 0,01 | A | 0 % | < 2 % | ✅ |
| v_C(τ) | 6,28472 | 6,32121 | V | 0,577 % | < 2 % | ✅ |
| v_R(τ) | 3,71528 | 3,67879 | V | 0,992 % | < 2 % | ✅ |
| i(τ) | 0,00371528 | 0,00367879 | A | 0,992 % | < 2 % | ✅ |
| τ medido al 63,2 % de v_C final | 0,00100993 | 0,001 | s | 0,993 % | < 2 % | ✅ |
| v_C(t_fin) régimen estable | 9,99949 | 9,99955 | V | 5,7100e-4 % | < 1 % | ✅ |
| energía almacenada ½Cv_C²(t_fin) | 4,9995e-5 | 4,9995e-5 | J | 0,00114 % | < 1 % | ✅ |
| energía disipada en R, W_R(t_fin) | 4,9505e-5 | 5,0000e-5 | J | 0,99 % | < 1 % | ✅ |
| error máx. normalizado de v_C(t) | 0,364887 | — | % | 0,365 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,364808 | — | % | 0,365 % | < 2 % | ✅ |
| balance: (W_fuente − W_R − ΔE) / W_fuente | 0,496914 | — | % | 0,497 % | < 1 % | ✅ |
| KCL en el nodo c: máx \|i_R1 − i_C1\| | 9,9995e-9 | ≈ 0 (solo la fuga GMIN, ~10⁻⁸ A) |  | — | < 1·10⁻⁷ A | ✅ |

### P1 RC escalón (R = 1 kΩ, C = 1 µF) · Trapezoidal · Δt = 2.000e-5 s

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| i(0⁺) | 0,01 | 0,01 | A | 0 % | < 2 % | ✅ |
| v_C(τ) | 6,32133 | 6,32121 | V | 0,0019 % | < 2 % | ✅ |
| v_R(τ) | 3,67867 | 3,67879 | V | 0,00326 % | < 2 % | ✅ |
| i(τ) | 0,00367867 | 0,00367879 | A | 0,00343 % | < 2 % | ✅ |
| τ medido al 63,2 % de v_C final | 9,9989e-4 | 0,001 | s | 0,0111 % | < 2 % | ✅ |
| v_C(t_fin) régimen estable | 9,99954 | 9,99955 | V | 9,8400e-5 % | < 1 % | ✅ |
| energía almacenada ½Cv_C²(t_fin) | 4,9995e-5 | 4,9995e-5 | J | 1,9700e-4 % | < 1 % | ✅ |
| energía disipada en R, W_R(t_fin) | 5,0000e-5 | 5,0000e-5 | J | 1,0000e-4 % | < 1 % | ✅ |
| error máx. normalizado de v_C(t) | 0,00120044 | — | % | 0,0012 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00126311 | — | % | 0,00126 % | < 2 % | ✅ |
| balance: (W_fuente − W_R − ΔE) / W_fuente | 0,00185006 | — | % | 0,00185 % | < 1 % | ✅ |
| KCL en el nodo c: máx \|i_R1 − i_C1\| | 9,9995e-9 | ≈ 0 (solo la fuga GMIN, ~10⁻⁸ A) |  | — | < 1·10⁻⁷ A | ✅ |

### P2 RL escalón (R = 100 Ω, L = 10 mH) · Euler hacia atrás · Δt = 2.000e-6 s

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| v_L(0⁺) (el inductor frena el cambio de i) | 10 | 10 | V | 1,0000e-5 % | < 2 % | ✅ |
| i(τ) | 0,0628472 | 0,0632121 | A | 0,577 % | < 2 % | ✅ |
| v_R(τ) | 6,28472 | 6,32121 | V | 0,577 % | < 2 % | ✅ |
| v_L(τ) | 3,71528 | 3,67879 | V | 0,992 % | < 2 % | ✅ |
| τ medido al 63,2 % de i final | 1,0099e-4 | 1,0000e-4 | s | 0,993 % | < 2 % | ✅ |
| i(t_fin) régimen estable | 0,099995 | 0,0999955 | A | 4,7100e-4 % | < 1 % | ✅ |
| \|v_L(t_fin)\| / V (inductor ≈ cortocircuito) | 0,00501089 | — | % | 0,00501 % | < 1 % | ✅ |
| energía almacenada ½Li²(t_fin) | 4,9995e-5 | 4,9995e-5 | J | 9,4200e-4 % | < 1 % | ✅ |
| energía disipada en R, W_R(t_fin) | 8,4951e-4 | 8,5001e-4 | J | 0,0581 % | < 1 % | ✅ |
| error máx. normalizado de i(t) | 0,364864 | — | % | 0,365 % | < 2 % | ✅ |
| error máx. normalizado de v_L(t) | 0,364844 | — | % | 0,365 % | < 2 % | ✅ |
| balance: (W_fuente − W_R − ΔE) / W_fuente | 0,0550168 | — | % | 0,055 % | < 1 % | ✅ |

### P2 RL escalón (R = 100 Ω, L = 10 mH) · Trapezoidal · Δt = 2.000e-6 s

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| v_L(0⁺) (el inductor frena el cambio de i) | 10 | 10 | V | 1,0000e-5 % | < 2 % | ✅ |
| i(τ) | 0,0632133 | 0,0632121 | A | 0,00193 % | < 2 % | ✅ |
| v_R(τ) | 6,32133 | 6,32121 | V | 0,00194 % | < 2 % | ✅ |
| v_L(τ) | 3,67867 | 3,67879 | V | 0,00333 % | < 2 % | ✅ |
| τ medido al 63,2 % de i final | 9,9989e-5 | 1,0000e-4 | s | 0,011 % | < 2 % | ✅ |
| i(t_fin) régimen estable | 0,0999955 | 0,0999955 | A | 1,5100e-6 % | < 1 % | ✅ |
| \|v_L(t_fin)\| / V (inductor ≈ cortocircuito) | 0,00453848 | — | % | 0,00454 % | < 1 % | ✅ |
| energía almacenada ½Li²(t_fin) | 4,9995e-5 | 4,9995e-5 | J | 3,0200e-6 % | < 1 % | ✅ |
| energía disipada en R, W_R(t_fin) | 8,5001e-4 | 8,5001e-4 | J | 9,4300e-7 % | < 1 % | ✅ |
| error máx. normalizado de i(t) | 0,00122269 | — | % | 0,00122 % | < 2 % | ✅ |
| error máx. normalizado de v_L(t) | 0,00122632 | — | % | 0,00123 % | < 2 % | ✅ |
| balance: (W_fuente − W_R − ΔE) / W_fuente | 1,1667e-5 | — | % | 1,1700e-5 % | < 1 % | ✅ |

### P3a RLC subamortiguado (R = 20 Ω) · Trapezoidal · Δt = 2.000e-6 s

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| v_L(0⁺) = V (i no puede saltar) | 10 | 10 | V | 2,0000e-6 % | < 2 % | ✅ |
| f_d medida (cruces por cero de i) | 1583,52 | 1583,57 | Hz | 0,00318 % | < 2 % | ✅ |
| α medida (recta ln(picos), 8 picos) | 999,9 | 1000 | s⁻¹ | 0,01 % | < 2 % | ✅ |
| ω0 = √(ω_d² + α²) medida | 9999,68 | 10000 | rad/s | 0,00325 % | < 2 % | ✅ |
| Q = ω0/(2α) medido | 5,00034 | 5 |  | 0,00676 % | < 2 % | ✅ |
| v_C máx (primer sobrepico) = V(1 + e^(−απ/ω_d)) | 17,2926 | 17,2925 | V | 8,7600e-4 % | < 2 % | ✅ |
| instante del sobrepico = π/ω_d | 3,1575e-4 | 3,1574e-4 | s | 0,00382 % | < 2 % | ✅ |
| v_C(t_fin) régimen estable | 9,99981 | 9,99981 | V | 7,2700e-6 % | < 1 % | ✅ |
| energía disipada en R, W_R(t_fin) (→ ½CV² sin importar R) | 5,0000e-5 | 5,0000e-5 | J | 4,6000e-5 % | < 1 % | ✅ |
| error máx. normalizado de v_C(t) | 0,00709707 | — | % | 0,0071 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,0142435 | — | % | 0,0142 % | < 2 % | ✅ |
| error máx. normalizado de v_L(t) | 0,012294 | — | % | 0,0123 % | < 2 % | ✅ |
| balance: (W_fuente − W_R − ΔE) / W_fuente | 0,00301897 | — | % | 0,00302 % | < 1 % | ✅ |

### P3b RLC crítico (R = 200 Ω) · Trapezoidal · Δt = 2.000e-6 s

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| v_L(0⁺) = V (i no puede saltar) | 10 | 10 | V | 2,0000e-5 % | < 2 % | ✅ |
| i máx | 0,0367904 | 0,0367879 | A | 0,00666 % | < 2 % | ✅ |
| instante de i máx = 1/α | 1,0001e-4 | 1,0000e-4 | s | 0,01 % | < 2 % | ✅ |
| sobrepico de v_C: máx(0, v_C máx − V)/V | 0 | — | % | 0 % | < 1 % | ✅ |
| v_C(t_fin) régimen estable | 9,995 | 9,99501 | V | 2,7500e-5 % | < 1 % | ✅ |
| energía disipada en R, W_R(t_fin) (→ ½CV² sin importar R) | 5,0000e-5 | 5,0000e-5 | J | 3,4900e-5 % | < 1 % | ✅ |
| error máx. normalizado de v_C(t) | 0,00153987 | — | % | 0,00154 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00723626 | — | % | 0,00724 % | < 2 % | ✅ |
| error máx. normalizado de v_L(t) | 0,003836 | — | % | 0,00384 % | < 2 % | ✅ |
| balance: (W_fuente − W_R − ΔE) / W_fuente | 2,4265e-4 | — | % | 2,4300e-4 % | < 1 % | ✅ |

### P3c RLC sobreamortiguado (R = 1 kΩ) · Trapezoidal · Δt = 2.020e-7 s

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| v_L(0⁺) = V (i no puede saltar) | 9,99999 | 10 | V | 1,0000e-4 % | < 2 % | ✅ |
| i máx | 0,00963564 | 0,00963562 | A | 1,5300e-4 % | < 2 % | ✅ |
| instante de i máx = ln(s₂/s₁)/(s₁−s₂) | 4,6793e-5 | 4,6794e-5 | s | 0,00182 % | < 2 % | ✅ |
| constante lenta −1/s₁ (pendiente de ln(V − v_C)) | 9,8994e-4 | 9,8990e-4 | s | 0,00435 % | < 2 % | ✅ |
| sobrepico de v_C: máx(0, v_C máx − V)/V | 0 | — | % | 0 % | < 1 % | ✅ |
| v_C(t_fin) régimen estable | 9,99952 | 9,99954 | V | 2,0000e-4 % | < 1 % | ✅ |
| energía disipada en R, W_R(t_fin) (→ ½CV² sin importar R) | 5,0000e-5 | 5,0000e-5 | J | 1,9900e-4 % | < 1 % | ✅ |
| error máx. normalizado de v_C(t) | 1,9991e-4 | — | % | 2,0000e-4 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00126081 | — | % | 0,00126 % | < 2 % | ✅ |
| error máx. normalizado de v_L(t) | 0,00123898 | — | % | 0,00124 % | < 2 % | ✅ |
| balance: (W_fuente − W_R − ΔE) / W_fuente | 0,00267027 | — | % | 0,00267 % | < 1 % | ✅ |

### P3a RLC R = 20 Ω · Euler hacia atrás · Δt = 2.000e-6 s (amortiguamiento numérico)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| α medida con Euler vs. α_num = ln[(1+αΔt)²+(ω_dΔt)²]/(2Δt) | 1097,59 | 1097,59 | s⁻¹ | 1,2600e-4 % | < 2 % | ✅ |
| exceso de amortiguamiento (α_Euler − α)/α (%) | 9,75857 | 9,75871 |  | — | informativo: por eso P3 usa el método trapezoidal | ✅ |
| energía disipada artificialmente por Euler (% de W_fuente) | 4,54381 | > 0 (Σ ½LΔi² + ½CΔv²) |  | — | informativo | ✅ |

### Implementación vs. recurrencia exacta del método (GMIN = 0)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| RC serie · Euler hacia atrás: máx \|x_motor − x_recurrencia\| / X∞ | 3,3751e-15 | 0 |  | — | < 1e-10 | ✅ |
| RC serie · Trapezoidal: máx \|x_motor − x_recurrencia\| / X∞ | 6,9278e-15 | 0 |  | — | < 1e-10 | ✅ |
| RL serie · Euler hacia atrás: máx \|x_motor − x_recurrencia\| / X∞ | 5,5511e-16 | 0 |  | — | < 1e-10 | ✅ |
| RL serie · Trapezoidal: máx \|x_motor − x_recurrencia\| / X∞ | 4,1633e-16 | 0 |  | — | < 1e-10 | ✅ |

### Convergencia · RC · Euler hacia atrás · Δt frente a Δt/2

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| Δ = máx \|x(Δt) − x(Δt/2)\| / máx\|x\| (v_C e i) | 0,181676 | — | % | 0,182 % | < 1 % | ✅ |
| orden observado log₂[e(Δt)/e(Δt/2)] en v_C | 0,993937 | 1 |  | — | \|p − 1\| < 0.1 | ✅ |
| error estimado por Richardson vs. error real (%) | 0,363353 | 0,364887 |  | — | diferencia < 10 % | ✅ |

### Convergencia · RC · Trapezoidal · Δt frente a Δt/2

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| Δ = máx \|x(Δt) − x(Δt/2)\| / máx\|x\| (v_C e i) | 9,1979e-4 | — | % | 9,2000e-4 % | < 1 % | ✅ |
| orden observado log₂[e(Δt)/e(Δt/2)] en v_C | 2,08877 | 2 |  | — | \|p − 2\| < 0.1 | ✅ |
| error estimado por Richardson vs. error real (%) | 0,00122639 | 0,00120044 |  | — | diferencia < 10 % | ✅ |

### Convergencia · RL · Euler hacia atrás · Δt frente a Δt/2

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| Δ = máx \|x(Δt) − x(Δt/2)\| / máx\|x\| (v_L e i) | 0,181676 | — | % | 0,182 % | < 1 % | ✅ |
| orden observado log₂[e(Δt)/e(Δt/2)] en v_L | 0,994041 | 1 |  | — | \|p − 1\| < 0.1 | ✅ |
| error estimado por Richardson vs. error real (%) | 0,363334 | 0,364844 |  | — | diferencia < 10 % | ✅ |

### Convergencia · RLC R = 20 Ω · Trapezoidal · Δt frente a Δt/2

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| Δ = máx \|x(Δt) − x(Δt/2)\| / máx\|x\| (v_C e i) | 0,0106768 | — | % | 0,0107 % | < 1 % | ✅ |
| orden observado log₂[e(Δt)/e(Δt/2)] en v_C | 2,00351 | 2 |  | — | \|p − 2\| < 0.1 | ✅ |
| error estimado por Richardson vs. error real (%) | 0,00710282 | 0,00709707 |  | — | diferencia < 10 % | ✅ |

### Estabilidad · RC · Δt = 5τ (paso deliberadamente grande)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| Euler: cambios de signo de i(t) | 0 | 0 |  | — | monótona, como la física | ✅ |
| Euler: máx v_C / V (sin sobrepico) | 0,999999 | ≤ 1 |  | — |  | ✅ |
| Trapezoidal: i(Δt)/i(0⁺) | -0,428572 | -0,428571 |  | — | factor r = (1−h/2)/(1+h/2) | ✅ |
| Trapezoidal: cambios de signo de i(t) | 20 | 20 (uno por paso) |  | — | oscilación numérica esperada si Δt > 2τ | ✅ |

### Punto de operación DC (C = circuito abierto, L = cortocircuito)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| RC: v_C en DC = V | 9,99999 | 10 | V | 1,0000e-4 % | < 1 % | ✅ |
| RC: \|i\| en DC | 1,0000e-8 | ≈ 0 (solo GMIN) |  | — | < 1·10⁻⁷ A | ✅ |
| RL: i_L en DC = V/R | 0,1 | 0,1 | A | 0 % | < 1 % | ✅ |
| RL: \|v_L\| en DC | 0 | 0 |  | — | < 1·10⁻¹² V | ✅ |
| RLC: v_C en DC = V | 10 | 10 | V | 4,0000e-6 % | < 1 % | ✅ |
| RLC: \|i_L\| en DC | 1,0000e-8 | ≈ 0 (solo GMIN) |  | — | < 1·10⁻⁷ A | ✅ |
| R1–L–R2: i = V/(R1+R2) | 0,004 | 0,004 | A | 6,6700e-5 % | < 1 % | ✅ |

### Casos límite (mensajes claros)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| R = 0 Ω | R1: la resistencia debe ser mayor que 0 Ω (un cable se modela con un valor pequeño, p. ej. 0,02 Ω). | error |  | — |  | ✅ |
| C negativa | C1: la capacitancia debe ser mayor que 0 F. | error |  | — |  | ✅ |
| L = 0 H | L1: la inductancia debe ser mayor que 0 H. | error |  | — |  | ✅ |
| terminal sin conectar | R1: tiene un terminal sin conectar. | error |  | — |  | ✅ |
| dos fuentes distintas en paralelo | Sistema singular: la corriente de V2 no queda determinada. Causa típica: una malla formada solo por fuentes de tensión (o, en t = 0, por fuentes y capacitores con tensiones iniciales distintas), dos fuentes de distinto valor en paralelo, o, en DC, un inductor conectado directamente a una fuente (corriente infinita). | error |  | — |  | ✅ |
| inductor directo sobre una fuente (DC) | Sistema singular: la corriente de L1 no queda determinada. Causa típica: una malla formada solo por fuentes de tensión (o, en t = 0, por fuentes y capacitores con tensiones iniciales distintas), dos fuentes de distinto valor en paralelo, o, en DC, un inductor conectado directamente a una fuente (corriente infinita). | error |  | — |  | ✅ |
| fuente en cortocircuito | V1: fuente en cortocircuito (sus dos terminales están en el nodo "a"). | error |  | — |  | ✅ |
| nodo flotante | Nodos sin camino a tierra: x, y. Su tensión la fija solo la fuga GMIN y no tiene significado físico. | aviso |  | — |  | ✅ |
| circuito sin tierra | El circuito no tiene nodo de tierra ("0"). Las tensiones absolutas quedan fijadas solo por la fuga GMIN = 1e-9 S; las diferencias de tensión sí son válidas. | aviso |  | — |  | ✅ |

### Generador de señales: f(t) del motor vs. fórmula de referencia (1 000 instantes)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| seno: máx \|f_motor − f_ref\| / A | 3,5527e-15 | 0 |  | — | < 1e-12 | ✅ |
| cuadrada: máx \|f_motor − f_ref\| / A | 0 | 0 |  | — | < 1e-12 | ✅ |
| triangular: máx \|f_motor − f_ref\| / A | 4,4409e-16 | 0 |  | — | < 1e-12 | ✅ |
| cuadrada con D = 30 %: valor medio = dc + A(2D − 1) | -0,2 | -0,2 | V | 8,3300e-14 % | < 1 % | ✅ |
| cuadrada en el flanco t = D·T: valor antes / después | 4 / -2 | 4 / −2 |  | — | dc ± A | ✅ |
| triangular en u = 0, ¼, ½, ¾ | 1 / 4 / 1 / -2 | 1 / 4 / 1 / -2 |  | — | dc, dc+A, dc, dc−A | ✅ |

### Δt automático: |s|máx y mín|Re s| de la matriz de estado vs. teoría

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| RC: \|s\|máx (2 var. de estado o menos: exacto) | 1000 | 1000 | s⁻¹ | 1,0000e-4 % | < 1 % | ✅ |
| RC: mín\|Re s\| (fija la duración del transitorio) | 1000 | 1000 | s⁻¹ | 1,0000e-4 % | < 1 % | ✅ |
| RL: \|s\|máx (2 var. de estado o menos: exacto) | 10000 | 10000 | s⁻¹ | 1,0000e-5 % | < 1 % | ✅ |
| RL: mín\|Re s\| (fija la duración del transitorio) | 10000 | 10000 | s⁻¹ | 1,0000e-5 % | < 1 % | ✅ |
| RLC 20 Ω: \|s\|máx (2 var. de estado o menos: exacto) | 10000 | 10000 | s⁻¹ | 1,0000e-6 % | < 1 % | ✅ |
| RLC 20 Ω: mín\|Re s\| (fija la duración del transitorio) | 1000 | 1000 | s⁻¹ | 4,8000e-5 % | < 1 % | ✅ |
| RLC 20 Ω: \|s\|máx por Gelfand (método para más de 2 variables) | 10011,1 | 10000 | s⁻¹ | 0,111 % | < 1 % | ✅ |
| RLC 200 Ω: \|s\|máx (2 var. de estado o menos: exacto) | 10000 | 10000 | s⁻¹ | 1,0000e-5 % | < 1 % | ✅ |
| RLC 200 Ω: mín\|Re s\| (fija la duración del transitorio) | 10000 | 10000 | s⁻¹ | 1,5000e-5 % | < 1 % | ✅ |
| RLC 200 Ω: \|s\|máx por Gelfand (método para más de 2 variables) | 10025,6 | 10000 | s⁻¹ | 0,256 % | < 1 % | ✅ |
| RLC 1 kΩ: \|s\|máx (2 var. de estado o menos: exacto) | 98989,7 | 98989,8 | s⁻¹ | 1,0200e-4 % | < 1 % | ✅ |
| RLC 1 kΩ: mín\|Re s\| (fija la duración del transitorio) | 1010,21 | 1010,21 | s⁻¹ | 2,0200e-4 % | < 1 % | ✅ |
| RLC 1 kΩ: \|s\|máx por Gelfand (método para más de 2 variables) | 99045,9 | 98989,8 | s⁻¹ | 0,0567 % | < 1 % | ✅ |
| RC + RLC (3 var. de estado, Gelfand): \|s\|máx = ω0 | 10011,1 | 10000 | s⁻¹ | 0,111 % | < 1 % | ✅ |
| RC + RLC: Δt = 1/(50·\|s\|máx) | 1,9978e-6 | 2,0000e-6 |  | — | < 1 % | ✅ |
| cuadrada 1 kHz, D = 30 %: muestras por período N (flancos en la malla: N·D entero) | 200 | ≥ 200 y N·0,3 entero |  | — | Δt ≤ τ/50 y ≤ T/200 | ✅ |

### Fuente variable: RC, V = 5 V → 10 V en t = 2τ · Euler hacia atrás · Δt = τ/50

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| fijarFuente("V1", 10) | aceptado | aceptado |  | — |  | ✅ |
| error máx. normalizado de v_C(t) (superposición) | 0,263836 | — | % | 0,264 % | < 2 % | ✅ |
| v_C(8τ) | 9,98503 | 9,98593 | V | 0,00905 % | < 1 % | ✅ |

### Fuente variable: RC, V = 5 V → 10 V en t = 2τ · Trapezoidal · Δt = τ/50

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| fijarFuente("V1", 10) | aceptado | aceptado |  | — |  | ✅ |
| error máx. normalizado de v_C(t) (superposición) | 8,3811e-4 | — | % | 8,3800e-4 % | < 2 % | ✅ |
| v_C(8τ) | 9,98592 | 9,98593 | V | 6,9800e-5 % | < 1 % | ✅ |

### P1b RC con onda cuadrada 0–10 V, 50 Hz (≪ 1/τ) · Trapezoidal · Δt = 2.000e-5 s · 6 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error máx. normalizado de v_C(t) frente a la solución exacta | 0,0012998 | — | % | 0,0013 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00126311 | — | % | 0,00126 % | < 2 % | ✅ |
| v_C máx en régimen periódico | 9,99954 | 9,99955 | V | 9,8400e-5 % | < 1 % | ✅ |
| \|v_C mín − teoría\| / (V_alto − V_bajo), régimen periódico (teoría 0,000454 V) | 1,5630e-6 | — | % | 1,5600e-6 % | < 1 % | ✅ |
| τ medido en el primer flanco de bajada (63,2 %) | 9,9997e-4 | 0,001 | s | 0,0034 % | < 2 % | ✅ |

### P1b RC con onda cuadrada 0–10 V, 50 Hz (≪ 1/τ) · Euler hacia atrás · Δt = 2.000e-5 s · 6 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error máx. normalizado de v_C(t) frente a la solución exacta | 0,364887 | — | % | 0,365 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,364808 | — | % | 0,365 % | < 2 % | ✅ |
| v_C máx en régimen periódico | 9,99949 | 9,99955 | V | 5,7100e-4 % | < 1 % | ✅ |
| \|v_C mín − teoría\| / (V_alto − V_bajo), régimen periódico (teoría 0,000454 V) | 4,7079e-4 | — | % | 4,7100e-4 % | < 1 % | ✅ |
| τ medido en el primer flanco de bajada (63,2 %) | 0,00101002 | 0,001 | s | 1 % | < 2 % | ✅ |

### P1b RC con onda cuadrada 0–10 V, 500 Hz (T = 2τ) · Trapezoidal · Δt = 1.000e-5 s · 10 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error máx. normalizado de v_C(t) frente a la solución exacta | 3,8600e-4 | — | % | 3,8600e-4 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 3,4336e-4 | — | % | 3,4300e-4 % | < 2 % | ✅ |
| v_C máx en régimen periódico | 7,3106 | 7,31059 | V | 1,5100e-4 % | < 1 % | ✅ |
| \|v_C mín − teoría\| / (V_alto − V_bajo), régimen periódico (teoría 2,689 V) | 2,1081e-4 | — | % | 2,1100e-4 % | < 1 % | ✅ |

### RC con onda triangular 0–10 V, 50 Hz · Trapezoidal · Δt = 2.000e-5 s · 6 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error máx. normalizado de v_C(t) frente a la solución exacta | 5,1222e-4 | — | % | 5,1200e-4 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00102313 | — | % | 0,00102 % | < 2 % | ✅ |

### P2b RL con onda cuadrada 0–10 V, 500 Hz · Trapezoidal · Δt = 2.000e-6 s · 6 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error máx. normalizado de v_L(t) frente a la solución exacta | 0,00122632 | — | % | 0,00123 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00122269 | — | % | 0,00122 % | < 2 % | ✅ |
| v_R máx en régimen periódico | 9,99955 | 9,99955 | V | 1,5100e-6 % | < 1 % | ✅ |
| \|v_R mín − teoría\| / (V_alto − V_bajo), régimen periódico (teoría 0,000454 V) | 1,5089e-6 | — | % | 1,5100e-6 % | < 1 % | ✅ |
| τ medido en el primer flanco de bajada (63,2 %) | 9,9997e-5 | 1,0000e-4 | s | 0,0033 % | < 2 % | ✅ |

### Reinicio en los flancos: orden del método trapezoidal con onda cuadrada (RC, 500 Hz, GMIN = 0)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| con reinicio: error máx. de v_C (%) con Δt = 1.00e-5 s | 4,1935e-4 | — |  | — | informativo | ✅ |
| con reinicio: orden observado | 2,00001 | 2 |  | — | \|p − 2\| < 0,2 | ✅ |
| sin reinicio: error máx. de v_C (%) con Δt = 1.00e-5 s | 0,680945 | — |  | — | informativo | ✅ |
| sin reinicio: orden observado | 0,996834 | 1 |  | — | \|p − 1\| < 0,2 | ✅ |

### P4 filtro RC (pasa-bajas v_C, pasa-altas v_R) a 50 Hz · Trapezoidal · Δt = T/1000 · 6 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error máx. normalizado de v_C(t) frente a la solución exacta | 4,3829e-4 | — | % | 4,3800e-4 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00135108 | — | % | 0,00135 % | < 2 % | ✅ |
| amplitud de v_R1 | 1,49859 | 1,49858 | V | 2,0800e-4 % | < 1 % | ✅ |
| fase de v_R1 respecto a la fuente | 72,5592 | 72,5594 | ° | 2,2000e-4° | < 0,5° | ✅ |
| amplitud de v_C1 | 4,77014 | 4,77014 | V | 1,2100e-4 % | < 1 % | ✅ |
| fase de v_C1 respecto a la fuente | -17,4406 | -17,4406 | ° | 3,7500e-5° | < 0,5° | ✅ |
| amplitud de i_R1 | 0,00149859 | 0,00149858 | A | 2,0800e-4 % | < 1 % | ✅ |
| fase de i_R1 respecto a la fuente | 72,5592 | 72,5594 | ° | 2,2000e-4° | < 0,5° | ✅ |
| fase de v_C1 por Δt entre canales (φ = −360°·f·Δt) | -17,4372 | -17,4406 | ° | 0,0034° | < 0,5° | ✅ |

### P4 filtro RC en f_c = 1/(2πRC) ≈ 159,15 Hz · Trapezoidal · Δt = T/315 · 7 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error máx. normalizado de v_C(t) frente a la solución exacta | 0,00295329 | — | % | 0,00295 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00303622 | — | % | 0,00304 % | < 2 % | ✅ |
| amplitud de v_R1 | 3,53559 | 3,53553 | V | 0,0016 % | < 1 % | ✅ |
| fase de v_R1 respecto a la fuente | 44,999 | 45 | ° | 9,7900e-4° | < 0,5° | ✅ |
| amplitud de v_C1 | 3,53547 | 3,53553 | V | 0,00171 % | < 1 % | ✅ |
| fase de v_C1 respecto a la fuente | -45,0009 | -45 | ° | 9,1500e-4° | < 0,5° | ✅ |
| amplitud de i_R1 | 0,00353559 | 0,00353553 | A | 0,0016 % | < 1 % | ✅ |
| fase de i_R1 respecto a la fuente | 44,999 | 45 | ° | 9,7900e-4° | < 0,5° | ✅ |
| fase de v_C1 por Δt entre canales (φ = −360°·f·Δt) | -44,9752 | -45 | ° | 0,0248° | < 0,5° | ✅ |

### P4 filtro RC a 1 kHz · Trapezoidal · Δt = T/200 · 15 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error máx. normalizado de v_C(t) frente a la solución exacta | 0,00813605 | — | % | 0,00814 % | < 2 % | ✅ |
| error máx. normalizado de i(t) | 0,00192443 | — | % | 0,00192 % | < 2 % | ✅ |
| amplitud de v_R1 | 4,93786 | 4,93785 | V | 1,5600e-4 % | < 1 % | ✅ |
| fase de v_R1 respecto a la fuente | 9,04233 | 9,04306 | ° | 7,3200e-4° | < 0,5° | ✅ |
| amplitud de v_C1 | 0,785821 | 0,785884 | V | 0,00803 % | < 1 % | ✅ |
| fase de v_C1 respecto a la fuente | -80,9575 | -80,9569 | ° | 5,6200e-4° | < 0,5° | ✅ |
| amplitud de i_R1 | 0,00493786 | 0,00493785 | A | 1,5600e-4 % | < 1 % | ✅ |
| fase de i_R1 respecto a la fuente | 9,04233 | 9,04306 | ° | 7,3200e-4° | < 0,5° | ✅ |
| fase de v_C1 por Δt entre canales (φ = −360°·f·Δt) | -80,901 | -80,9569 | ° | 0,056° | < 0,5° | ✅ |

### P4 RLC serie en resonancia f0 ≈ 1 591,5 Hz (R = 20 Ω) · Trapezoidal · Δt = T/315 · 21 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| amplitud de v_R1 | 4,99994 | 5 | V | 0,00114 % | < 1 % | ✅ |
| fase de v_R1 respecto a la fuente | -0,0186337 | 0 | ° | 0,0186° | < 0,5° | ✅ |
| amplitud de v_L1 | 25,0005 | 25 | V | 0,00204 % | < 1 % | ✅ |
| fase de v_L1 respecto a la fuente | 89,9814 | 90 | ° | 0,0186° | < 0,5° | ✅ |
| amplitud de v_C1 | 24,9989 | 25 | V | 0,00446 % | < 1 % | ✅ |
| fase de v_C1 respecto a la fuente | -90,0185 | -90 | ° | 0,0185° | < 0,5° | ✅ |
| amplitud de i_R1 | 0,249997 | 0,25 | A | 0,00114 % | < 1 % | ✅ |
| fase de i_R1 respecto a la fuente | -0,0186337 | 0 | ° | 0,0186° | < 0,5° | ✅ |
| fase de v_C1 por Δt entre canales (φ = −360°·f·Δt) | -89,9823 | -90 | ° | 0,0177° | < 0,5° | ✅ |

### P4 RL–RC serie-paralelo a 1 kHz · Trapezoidal · Δt = T/354 · 7 períodos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| amplitud de v_R1 | 3,4234 | 3,42348 | V | 0,00229 % | < 1 % | ✅ |
| fase de v_R1 respecto a la fuente | -34,4212 | -34,4207 | ° | 4,4600e-4° | < 0,5° | ✅ |
| amplitud de v_L1 | 2,91202 | 2,91198 | V | 0,00154 % | < 1 % | ✅ |
| fase de v_L1 respecto a la fuente | 41,6469 | 41,6482 | ° | 0,00137° | < 0,5° | ✅ |
| amplitud de v_R2 | 1,54928 | 1,54923 | V | 0,00325 % | < 1 % | ✅ |
| fase de v_R2 respecto a la fuente | 99,5044 | 99,5063 | ° | 0,00197° | < 0,5° | ✅ |
| amplitud de v_C1 | 2,46569 | 2,46567 | V | 8,7800e-4 % | < 1 % | ✅ |
| fase de v_C1 respecto a la fuente | 9,50434 | 9,50633 | ° | 0,00199° | < 0,5° | ✅ |
| amplitud de i_L1 | 0,046345 | 0,0463456 | A | 0,0012 % | < 1 % | ✅ |
| fase de i_L1 respecto a la fuente | -48,3532 | -48,3518 | ° | 0,00145° | < 0,5° | ✅ |
| fase de v_C1 por Δt entre canales (φ = −360°·f·Δt) | 9,4988 | 9,50633 | ° | 0,00753° | < 0,5° | ✅ |

### Euler hacia atrás en régimen senoidal (RC pasa-bajas, 1 kHz, Δt = T/200)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| error de fase de v_C (°) | 0,877264 | — |  | — | informativo: Euler distorsiona fase y amplitud; P4 usa trapezoidal | ✅ |

### Fuente de corriente del motor (la usa el óhmetro)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| I = 1 mA en R = 1 kΩ: v = I·R | 0,999999 | 1 | V | 1,0000e-4 % | < 1 % | ✅ |
| corriente de la fuente (convención pasiva) | -0,001 | -0,001 |  | — | = −valor | ✅ |
| óhmetro: R1 + (R2 ‖ R3) | 2320 | 2320 | Ω | 1,1700e-4 % | < 1 % | ✅ |
| óhmetro con un C en paralelo con R1 (C abierto: no cambia) | 2320 | 2320 | Ω | 1,1700e-4 % | < 1 % | ✅ |
| óhmetro con un L en paralelo con R1 (L corto: queda R2 ‖ R3) | 1320 | 1320 | Ω | 8,8000e-5 % | < 1 % | ✅ |

### Montaje en DC con C y L (netlist de buildNet + reac)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| v_C = V·R2/(R1+R2) (L corto, C abierto) | 7,99999 | 8 | V | 1,3300e-4 % | < 1 % | ✅ |
| i_L = V/(R1+R2) | 0,004 | 0,004 | A | 6,6700e-5 % | < 1 % | ✅ |
| \|v_L\| y \|i_C\| en DC | 0.0e+0 V · 0.0e+0 A | 0 y 0 |  | — | < 1·10⁻¹² | ✅ |
| energía ½Cv² = ½·1 µF·(8 V)² | 3,2000e-5 | 3,2000e-5 | J | 2,6700e-4 % | < 1 % | ✅ |
| energía ½Li² = ½·10 mH·(4 mA)² | 8,0000e-8 | 8,0000e-8 | J | 1,3300e-4 % | < 1 % | ✅ |

### Valores de C y L: serie E12 y rangos permitidos

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| E12 más cercano a 0.0000046 | 4,7000e-6 | 4,7000e-6 |  | — | serie 1,0 1,2 1,5 1,8 2,2 2,7 3,3 3,9 4,7 5,6 6,8 8,2 | ✅ |
| E12 más cercano a 1.04 | 1 | 1 |  | — | serie 1,0 1,2 1,5 1,8 2,2 2,7 3,3 3,9 4,7 5,6 6,8 8,2 | ✅ |
| E12 más cercano a 0.0096 | 0,01 | 0,01 |  | — | serie 1,0 1,2 1,5 1,8 2,2 2,7 3,3 3,9 4,7 5,6 6,8 8,2 | ✅ |
| E12 más cercano a 3.5e-9 | 3,3000e-9 | 3,3000e-9 |  | — | serie 1,0 1,2 1,5 1,8 2,2 2,7 3,3 3,9 4,7 5,6 6,8 8,2 | ✅ |
| E12 más cercano a 2e-12 | 2,2000e-12 | 2,2000e-12 |  | — | serie 1,0 1,2 1,5 1,8 2,2 2,7 3,3 3,9 4,7 5,6 6,8 8,2 | ✅ |
| E12 más cercano a 0.00015 | 1,5000e-4 | 1,5000e-4 |  | — | serie 1,0 1,2 1,5 1,8 2,2 2,7 3,3 3,9 4,7 5,6 6,8 8,2 | ✅ |
| C = 0 | Capacitor: C debe ser mayor que 0 F. | mensaje de error |  | — |  | ✅ |
| C = -0.000001 | Capacitor: C debe ser mayor que 0 F. | mensaje de error |  | — |  | ✅ |
| C = 2 | Capacitor: use C entre 1 pF y 1 F. | mensaje de error |  | — |  | ✅ |
| C = 1e-13 | Capacitor: use C entre 1 pF y 1 F. | mensaje de error |  | — |  | ✅ |
| C = 1e-12 | aceptado | aceptado |  | — |  | ✅ |
| C = 0.001 | aceptado | aceptado |  | — |  | ✅ |
| L = 5e-7 | Inductor: use L entre 1 µH y 10 H. | mensaje de error |  | — |  | ✅ |
| L = 0.000001 | aceptado | aceptado |  | — |  | ✅ |
| L = 10 | aceptado | aceptado |  | — |  | ✅ |
| L = 11 | Inductor: use L entre 1 µH y 10 H. | mensaje de error |  | — |  | ✅ |
| L = NaN | Inductor: L no es un número. | mensaje de error |  | — |  | ✅ |

### Guardar y cargar (JSON del base y versión 2)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| archivo del base: R1 colocada y con sus bandas | T2C–T7C, rojo | T2C–T7C, rojo |  | — | sin avisos | ✅ |
| archivo del base: siguiente id de cable | 4 | 4 |  | — | máx(id) + 1 | ✅ |
| versión 2 ida y vuelta: mismo contenido | idéntico | idéntico |  | — | aJSON(desdeJSON(aJSON(st))) = aJSON(st) | ✅ |
| archivo con errores: avisos y nada roto | 3 avisos; C1 se quitó; L2 en la bandeja | 3 avisos; C1 se quitó; L2 en la bandeja |  | — | valor ≤ 0, posición inexistente, tipo desconocido | ✅ |

### Avisos del montaje (no bloquean)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| circuito bien conectado | sin avisos | sin avisos |  | — |  | ✅ |
| C1 con un terminal en una columna vacía | C1: el terminal en AT20 no está conectado a nada (queda en el aire). | terminal en el aire |  | — |  | ✅ |
| R3 y R4 en lazo cerrado sin fuente | R3, R4: no están conectados a ninguna fuente encendida; su corriente es 0. | sin fuente |  | — |  | ✅ |
| R5 colocada sin ninguna conexión | R5 está en el protoboard pero ninguno de sus terminales está conectado. | sin conectar |  | — |  | ✅ |

### Escala: componentes ilimitados y redes grandes

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| 300 C y L: ids únicos y JSON de ida y vuelta | 300 | 300 |  | — |  | ✅ |
| escalera de 401 elementos: punto de operación DC (ms) | 21 | resuelve |  | — | tiempo informativo | ✅ |
| escalera de 401 elementos: 10000 pasos trapezoidales (ms) | 1336 | resuelve |  | — | tiempo informativo (RNF-06) | ✅ |

### P5 dos mallas, dos fuentes (V1 = 12 V, V2 = 5 V, R1 = 1 kΩ, R2 = 2,2 kΩ, R3 = 3,3 kΩ) · DC

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| tensión del nodo a | 8,12069 | 8,12069 | V | 0 % | < 1 % | ✅ |
| I1 que entrega la fuente 1 | 0,00387931 | 0,00387931 | A | 0 % | < 1 % | ✅ |
| I2 que entrega la fuente 2 (negativa: la fuente 2 recibe corriente) | -0,0014185 | -0,0014185 | A | 0 % | < 1 % | ✅ |
| I3 por R3 | 0,00246082 | 0,00246082 | A | 0 % | < 1 % | ✅ |
| KCL en a: \|I1 + I2 − I3\| / I3 | 7,0494e-16 | 0 |  | — | < 1e-9 | ✅ |
| KVL malla 1: \|V1 − v_R1 − v_R3\| / V1 | 0 | 0 |  | — | < 1e-9 | ✅ |
| KVL malla 2: \|V2 − v_R2 − v_R3\| / V2 | 0 | 0 |  | — | < 1e-9 | ✅ |
| potencia que entrega la fuente 1 | 0,0465517 | 0,0465517 | W | 0 % | < 1 % | ✅ |
| potencia de la fuente 2 (negativa: la absorbe) | -0,00709248 | -0,00709248 | W | 0 % | < 1 % | ✅ |
| potencia disipada en R1 + R2 + R3 | 0,0394592 | 0,0394592 | W | 0 % | < 1 % | ✅ |
| balance: \|Σ v·i\| / potencia disipada | 3,5170e-16 | 0 |  | — | < 1e-9 | ✅ |
| balance: entregada − disipada (W) | -1,3878e-17 | 0 |  | — | informativo | ✅ |

### P5 · efecto de carga de los medidores

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| voltímetro con R_in = 10 kΩ en a: Va·R_in/(R_in + R_th) | 7,68352 | 7,68352 | V | 0 % | < 1 % | ✅ |
| error de carga de ese voltímetro frente a Va (%) | 5,38336 | 5,38336 |  | — | R_th/(R_in + R_th): informativo | ✅ |
| error de carga con R_in = 10 MΩ (el del base) | 0,00568933 | — | % | 0,00569 % | < 0.01 % | ✅ |
| amperímetro con R_shunt = 100 Ω en la rama de R3: lee I3 con R3 + R_shunt | 0,00240061 | 0,00240061 | A | 0 % | < 1 % | ✅ |
| error de inserción de ese amperímetro frente a I3 ideal (%) | -2,44648 | — |  | — | informativo | ✅ |

### P5 con C y L: régimen estable DC y final del transitorio

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| C en serie con R2: Va = V1·R3/(R1 + R3) (rama 2 abierta) | 9,2093 | 9,2093 | V | 0 % | < 1 % | ✅ |
| C en serie con R2: corriente de la rama 2 | 0 | 0 |  | — | < 1·10⁻¹² A | ✅ |
| C en serie con R2: v_C = V2 − Va (toda la diferencia queda en C) | -4,2093 | -4,2093 | V | 0 % | < 1 % | ✅ |
| transitorio con C (10 escalas lentas): Va final = Va de DC | 9,20925 | 9,2093 | V | 5,3600e-4 % | < 1 % | ✅ |
| L en serie con R3: Va igual que sin L (L corto) | 8,12069 | 8,12069 | V | 0 % | < 1 % | ✅ |
| L en serie con R3: \|v_L\| en DC | 0 | 0 |  | — | < 1·10⁻¹² V | ✅ |
| transitorio con L (10 escalas lentas): i_L final = I3 de DC | 0,0024607 | 0,00246082 | A | 0,00454 % | < 1 % | ✅ |

### Medidores en el modelo (voltímetro = R_in, amperímetro = R_shunt)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| voltímetro → elemento del motor | R 5000000 Ω | R 5000000 Ω |  | — |  | ✅ |
| lectura del voltímetro = i·R_in | 2 | 2 |  | — |  | ✅ |
| VM con R_in = 999 Ω | Voltímetro: use R_in entre 1 kΩ y 1000 GΩ. | mensaje de error |  | — |  | ✅ |
| VM con R_in = 1000 Ω | aceptado | aceptado |  | — |  | ✅ |
| VM con R_in = 2000000000000 Ω | Voltímetro: use R_in entre 1 kΩ y 1000 GΩ. | mensaje de error |  | — |  | ✅ |
| AM con R_shunt = 0 Ω | Amperímetro: R_shunt debe ser mayor que 0 Ω. | mensaje de error |  | — |  | ✅ |
| AM con R_shunt = 0.000001 Ω | aceptado | aceptado |  | — |  | ✅ |
| AM con R_shunt = 150 Ω | Amperímetro: use R_shunt entre 1 µΩ y 100 Ω. | mensaje de error |  | — |  | ✅ |

### Osciloscopio: escalas, disparo y medidas automáticas (señales muestreadas conocidas)

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| base de tiempo 1–2–5 de 1 µs a 1 s | 19 valores | 19 valores |  | — |  | ✅ |
| autoescala: 3,2 V → 1 V/div; 50 mV → 20 mV/div | 1 / 0.02 | 1 / 0.02 |  | — | la señal cabe en ±3,8 div | ✅ |
| disparo ↑ en 0,5 V: último cruce = 3T + T/12 | 3,08333 | 3,08333 |  | — | \|Δt\| < 0.0001·T | ✅ |
| disparo ↓ en 0,5 V: último cruce = 3T + 5T/12 | 3,41667 | 3,41667 |  | — | \|Δt\| < 0.0001·T | ✅ |
| disparo en un nivel que la señal no alcanza (2 V) | NaN | NaN |  | — | sin disparo | ✅ |
| 0,5 V + 2 V·sen: Vpp en 2,5 períodos | 4 | 4 | V | 0 % | < 0.01 % | ✅ |
| frecuencia por cruces del nivel medio (2,5 períodos) | 1000 | 1000 | Hz | 0 % | < 0.01 % | ✅ |
| Vmedia en 3 períodos | 0,5 | 0,5 | V | 9,9900e-14 % | < 0.01 % | ✅ |
| Vrms en 3 períodos = √(0,5² + 2²/2) | 1,5 | 1,5 | V | 1,4800e-14 % | < 0.01 % | ✅ |
| desfase de 0,7·sen(ωt − 45°) respecto a sen(ωt) | -45 | -45 |  | — | < 0,01° | ✅ |
| cuadrada D = 25 %: Vmedia = dc + A(2D − 1) | 0,5 | 0,5 | V | 2,4500e-12 % | < 1 % | ✅ |

### Osciloscopio: motor y modelo para el montaje

| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |
|---|---|---|---|---|---|---|
| guardar solo vElem.C1: misma serie y nada más | idéntica; 0 nodos, 0 corrientes | idéntica; 0 nodos, 0 corrientes |  | — |  | ✅ |
| paso automático con dtMax = 1 µs | 1,0000e-6 | ≤ 1·10⁻⁶ s |  | — |  | ✅ |
| generador = fuente ideal + r_int (2 elementos) | 2 elementos; r = 50 Ω | 2 elementos; r = 50 Ω |  | — |  | ✅ |
| netlist DC: valor medio y sin forma; transitorio: con forma; apagado: 0 V | 1 V/— · cuadrada · 0 V | 1 V/— · cuadrada · 0 V |  | — |  | ✅ |
| plan en modo encendido: una pantalla, Δt ≤ pantalla/1000 | 0.01 s; Δt = 1.000e-5 s | 0,01 s; Δt ≤ 1·10⁻⁵ s |  | — |  | ✅ |

## B. Regresión del simulador base

Valores dorados: lecturas sin ruido del simulador **original** en los 4 ejemplos (resistencias en su valor nominal, fuente 1 a 12 V con r interna 0,5 Ω; óhmetro con las fuentes apagadas). Tolerancia relativa 1·10⁻⁹. Desde el incremento 4, `solveDC()` y `solveOhm()` del simulador final resuelven con el motor MNA.

### Valores dorados · simulador original

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| serie: voltimetro | 8,24803842731 | 8,24803842731 | 0 | ✅ |
| serie: amperimetro | 0 | 0 | 0 | ✅ |
| serie: iFuente1 | -0,00374995287948 | -0,00374995287948 | 0 | ✅ |
| serie: ohmetro | 3199,50261389 | 3199,50261389 | 0 | ✅ |
| paralelo: voltimetro | 11,9950922127 | 11,9950922127 | 0 | ✅ |
| paralelo: amperimetro | 0 | 0 | 0 | ✅ |
| paralelo: iFuente1 | -0,00908841118116 | -0,00908841118116 | 0 | ✅ |
| paralelo: ohmetro | 1319,8231701 | 1319,8231701 | 0 | ✅ |
| mixto: voltimetro | 6,82554912093 | 6,82554912093 | 0 | ✅ |
| mixto: amperimetro | 0 | 0 | 0 | ✅ |
| mixto: iFuente1 | -0,00517157194562 | -0,00517157194562 | 0 | ✅ |
| mixto: ohmetro | 2319,83903704 | 2319,83903704 | 0 | ✅ |
| divisor: voltimetro | 2,54976361861 | 2,54976361861 | 0 | ✅ |
| divisor: amperimetro | 0,00944381832864 | 0,00944381832864 | 0 | ✅ |
| divisor: iFuente1 | -0,00944383726536 | -0,00944383726536 | 0 | ✅ |
| divisor: ohmetro | 1270,13063271 | 1270,13063271 | 0 | ✅ |

### Valores dorados · simulador v1 (motor MNA)

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| serie: voltimetro | 8,24803842732 | 8,24803842731 | 9,7217e-13 | ✅ |
| serie: amperimetro | 0 | 0 | 0 | ✅ |
| serie: iFuente1 | -0,00374995287946 | -0,00374995287948 | 6,7982e-12 | ✅ |
| serie: ohmetro | 3199,50261391 | 3199,50261389 | 5,2848e-12 | ✅ |
| paralelo: voltimetro | 11,9950922127 | 11,9950922127 | 3,8503e-15 | ✅ |
| paralelo: amperimetro | 0 | 0 | 0 | ✅ |
| paralelo: iFuente1 | -0,00908841118107 | -0,00908841118116 | 9,8375e-12 | ✅ |
| paralelo: ohmetro | 1319,82317011 | 1319,8231701 | 9,3785e-12 | ✅ |
| mixto: voltimetro | 6,82554912095 | 6,82554912093 | 3,1320e-12 | ✅ |
| mixto: amperimetro | 0 | 0 | 0 | ✅ |
| mixto: iFuente1 | -0,00517157194557 | -0,00517157194562 | 9,1201e-12 | ✅ |
| mixto: ohmetro | 2319,83903706 | 2319,83903704 | 7,6291e-12 | ✅ |
| divisor: voltimetro | 2,54976361862 | 2,54976361861 | 1,7791e-12 | ✅ |
| divisor: amperimetro | 0,00944381832864 | 0,00944381832864 | 7,0536e-13 | ✅ |
| divisor: iFuente1 | -0,00944383726534 | -0,00944383726536 | 2,6846e-12 | ✅ |
| divisor: ohmetro | 1270,13063271 | 1270,13063271 | 1,8523e-12 | ✅ |

### Motor MNA frente a gauss() del original (misma red)

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| serie: máx \|ΔV\| en elementos y \|ΔI\| en fuentes | 8,0203e-12 V · 2,5493e-14 A | < 1e-9 | 8,0203e-12 | ✅ |
| paralelo: máx \|ΔV\| en elementos y \|ΔI\| en fuentes | 4,6185e-14 V · 8,9408e-14 A | < 1e-9 | 8,9408e-14 | ✅ |
| mixto: máx \|ΔV\| en elementos y \|ΔI\| en fuentes | 2,1378e-11 V · 4,7165e-14 A | < 1e-9 | 2,1378e-11 | ✅ |
| divisor: máx \|ΔV\| en elementos y \|ΔI\| en fuentes | 4,5364e-12 V · 2,5353e-14 A | < 1e-9 | 4,5364e-12 | ✅ |

### Montajes con C y L sobre el ejemplo serie (v1, DC)

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| C1 en paralelo con R2: el voltímetro no cambia (C abierto) | 8,24803842732 | 8,24803842731 | 9,7217e-13 | ✅ |
| C1 en paralelo con R2: su corriente es 0 | 0 | 0 | 0 | ✅ |
| L1 en paralelo con R2: el voltímetro marca 0 (L corto) | 0 | 0 | 0 | ✅ |
| L1 en paralelo con R2: I fuente = V/(R1 + r_int + 2 R_cable) | 0,0119935459812 | 0,0119935234973 | 1,8747e-6 | ✅ |
| L1 en paralelo con R2: casi toda la corriente pasa por L1 | 0,011993532486 | 0,0119935234973 | 7,4946e-7 | ✅ |
| óhmetro sobre un capacitor: O.L (circuito abierto) | 2000000000 | ≥ 4,0000e+7 Ω | — | ✅ |
| óhmetro sobre un inductor ideal: 0 Ω | 0 | 0 | 0 | ✅ |

### P5 en el protoboard: lecturas de 3 amperímetros y 2 voltímetros (simulador final) · error en %

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| AM1: I1 que entrega la fuente 1 (A) | 0,00387858582134 | 0,00387931034483 | 0,0186766 | ✅ |
| AM2: I2 que entrega la fuente 2 (A) | -0,00141745116427 | -0,00141849529781 | 0,0736085 | ✅ |
| AM3: I3 por R3 (A) | 0,00246112604767 | 0,00246081504702 | 0,0126381 | ✅ |
| VM1: v_R1 = I1·R1 (V) | 3,87819216152 | 3,87931034483 | 0,0288243 | ✅ |
| VM2: v_R3 = Va (V) | 8,11903020216 | 8,12068965517 | 0,0204349 | ✅ |
| KCL con las lecturas: \|AM1 + AM2 − AM3\| / AM3 (%) | 0,000349815568703 | 0 | 3,4982e-4 | ✅ |
| balance con las lecturas: \|V1·I1 + V2·I2 − Σ R·I²\| / Σ R·I² (%) | 0,00915082924678 | 0 | 0,00915083 | ✅ |
| KVL malla 1 con las lecturas: \|V1 − VM1 − VM2\| / V1 (%) | 0,0231469693373 | 0 | 0,023147 | ✅ |
| AM1 frente a la corriente que el motor da para la fuente 1 (difieren solo por las fugas de 1 nS) | 0,00387858582134 | 0,0038786033464 | 4,5184e-4 | ✅ |

### Dos mallas, 3 puentes y 2 resistencias en el protoboard: lecturas frente al análisis de mallas (simulador final) · error en %

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| AM1: I1 que entrega la fuente = V/R1 + V/R2 (A) | 0,0174386692189 | 0,0174545454545 | 0,0909576 | ✅ |
| AM2: I2 por R2 = V/R2 (A) | 0,00545016906269 | 0,00545454545455 | 0,0802339 | ✅ |
| AM3: I1 − I2 por R1 = V/R1 (A) | 0,0119884936199 | 0,012 | 0,0958865 | ✅ |
| VM1: v_R1 = V (V) | 11,9872916238 | 12 | 0,105903 | ✅ |
| VM2: v_R2 = V (V) | 11,9877274493 | 12 | 0,102271 | ✅ |
| R equivalente que ve la fuente: V / AM1 = R1·R2/(R1 + R2) (Ω) | 688,125902808 | 687,5 | 0,0910404 | ✅ |
| KCL en el nodo A con las lecturas: \|AM1 − AM2 − AM3\| / AM1 (%) | 0,0000374814175311 | 0 | 3,7481e-5 | ✅ |
| KVL malla 1 con las lecturas: \|V − VM1\| / V (%) | 0,105903135295 | 0 | 0,105903 | ✅ |
| KVL malla 2 con las lecturas: \|VM1 − VM2\| / V (%) | 0,00363187932336 | 0 | 0,00363188 | ✅ |
| balance con las lecturas: \|V·I1 − Σ R·I²\| / Σ R·I² (%) | 0,0911149117001 | 0 | 0,0911149 | ✅ |

### Osciloscopio sobre montajes del protoboard (simulador final) · error en % o en °

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| carga RC: error máx. normalizado de CH1(t) frente a Vth(1 − e^(−t/τ)) (%) | 0,000283893191543 | — | 2,8389e-4 | ✅ |
| carga RC: τ medido en CH1 al 63,2 % de Vth (s) | 0,000999534477038 | 0,000999539920328 | 5,4458e-4 | ✅ |
| carga RC: CH1 al final de la pantalla (10τ) (V) | 9,98954445842 | 9,98955313812 | 8,6888e-5 | ✅ |
| carga RC: CH2 (salida de la fuente) al final (V) | 9,99998895651 | 10 | 1,1043e-4 | ✅ |
| carga RC: pasos simulados con Δt = 1.00e-5 s | 1000 | 1000 | 0 | ✅ |
| filtro: el osciloscopio dispara en CH1 ↑ 0 V | disparado | disparado | — | ✅ |
| filtro: \|CH1\| = amplitud en bornes del generador (con r_int = 50 Ω) (V) | 0,975269295778 | 0,975272731592 | 3,5229e-4 | ✅ |
| filtro: frecuencia medida en CH1 (Hz) | 159,154943082 | 159,154943092 | 5,9254e-9 | ✅ |
| filtro: \|CH2\|/\|CH1\| frente al divisor de impedancias (−3 dB) | 0,706743442262 | 0,706746248727 | 3,9710e-4 | ✅ |
| filtro: fase de CH2 respecto a CH1 (°) | -44,9722200405 | -44,9719388088 | 2,8123e-4 | ✅ |
| filtro: CH1 en el instante de disparo (debe ser el nivel, 0 V) ± 1 % de la amplitud | 7,64846281842e-15 | — | 7,6485e-15 | ✅ |

### Ejemplos del protocolo: guardar → cargar → mismo montaje, mismas lecturas y mismas trazas (simulador final)

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| P1a: JSON, 10 tensiones de nodo y 3 corrientes, osciloscopio (2 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P1b: JSON, 8 tensiones de nodo y 4 corrientes, osciloscopio (2 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P2a: JSON, 10 tensiones de nodo y 3 corrientes, osciloscopio (2 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P2b: JSON, 8 tensiones de nodo y 4 corrientes, osciloscopio (2 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P3a: JSON, 10 tensiones de nodo y 4 corrientes, osciloscopio (2 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P3b: JSON, 10 tensiones de nodo y 4 corrientes, osciloscopio (2 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P3c: JSON, 10 tensiones de nodo y 4 corrientes, osciloscopio (2 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P4a: JSON, 8 tensiones de nodo y 4 corrientes, osciloscopio (2 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P4b: JSON, 8 tensiones de nodo y 6 corrientes, osciloscopio (3 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P4c: JSON, 10 tensiones de nodo y 6 corrientes, osciloscopio (3 canales, máx \|Δ\| = 0), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |
| P5: JSON, 19 tensiones de nodo y 5 corrientes, osciloscopio (sin osciloscopio), pantalla SVG | JSON = · DC = · trazas = · SVG ok ·  | todo idéntico | — | ✅ |

### Archivos ejemplos/*.json al día con el modelo (si falla: node pruebas/generar_ejemplos.js)

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| P1a.json | igual al modelo | igual al modelo | — | ✅ |
| P1b.json | igual al modelo | igual al modelo | — | ✅ |
| P2a.json | igual al modelo | igual al modelo | — | ✅ |
| P2b.json | igual al modelo | igual al modelo | — | ✅ |
| P3a.json | igual al modelo | igual al modelo | — | ✅ |
| P3b.json | igual al modelo | igual al modelo | — | ✅ |
| P3c.json | igual al modelo | igual al modelo | — | ✅ |
| P4a.json | igual al modelo | igual al modelo | — | ✅ |
| P4b.json | igual al modelo | igual al modelo | — | ✅ |
| P4c.json | igual al modelo | igual al modelo | — | ✅ |
| P5.json | igual al modelo | igual al modelo | — | ✅ |

### Bloques del base

| Prueba | Obtenido | Esperado | Error | ¿Cumple? |
|---|---|---|---|---|
| ningún bloque del base fue eliminado | ninguno | ninguno | — | ✅ |

La corriente de la fuente es negativa por la convención pasiva de MNA (entra por el borne +): la fuente entrega energía.

## C. Cambios en el código del simulador base

Bloques de primer nivel del `<script>` del base: **83 sin cambios**, **20 modificados**, **6 nuevos**, **0 eliminados**. Cada cambio está marcado con `[incr. N]` en el código.

* Modificados: `buildNet`, `solveDC`, `solveOhm`, `occ`, `drawSources`, `drawTray`, `drawRes`, `drawOver`, `drawFlow`, `renderReadings`, `renderAnalysis`, `pairFor`, `placeRes`, `down`, `move`, `buildSwatches`, `buildSrcPanel`, `buildRPanel`, `updateRLabels`, `bind`
* Nuevos: `V_FUENTE_MIN`, `PASO_DESLIZADOR_V`, `RESOLUCION_V`, `redondearV`, `textoV`, `fijarTensionFuente`
* Eliminados: ninguno

## D. Protocolo de validación P1–P5 (incremento 8)

99/99 magnitudes de los 11 montajes del protocolo cumplen el criterio frente a la teoría del montaje. Tablas completas, con la teoría ideal y las capturas: `resultados/validacion.md`. Rendimiento: 301 elementos × 20000 pasos en 4,00 s (límite 10 s).
