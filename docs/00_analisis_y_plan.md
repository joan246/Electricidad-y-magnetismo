# Análisis del simulador base, requisitos, modelo y plan — entrega inicial

Proyecto: laboratorio virtual de circuitos R, C, L · Electricidad y Magnetismo 2026-2 · PUJ Cali
Archivo base: `base/simulador_protoboard_dc.html` (1 149 líneas, sin cambios; SHA-256 `869e47e1…64b06be9`).
Este documento es el borrador de las secciones 1–5 de `informe_fase1.md`.

> Desarrollo asistido por IA (Claude, Anthropic): análisis del código base, borradores de funciones del motor y de las pruebas, y redacción de esta documentación. Los integrantes deben revisar, ejecutar y poder explicar cada parte.

---

## 1. Informe de arquitectura del simulador base

Todo el archivo es una sola página: `<style>` (líneas 7–112), el HTML de los paneles (114–285) y un único `<script>` en modo estricto (287–1147), dividido en 15 secciones numeradas con comentarios. Leí el archivo completo; no hay partes que no haya podido ver ni dependencias externas. La única referencia externa es la fuente "Inter" en `--sans`, que no se carga y cae a las fuentes del sistema.

### 1.1 Estado y estructuras de datos (secciones 1–4)

| Elemento | Dónde | Qué es |
|---|---|---|
| Código de colores | `C`, `D1`, `D2`, `MUL`, `TOL`, `nominal(b)`, `tolPct(b)`, `fmtOhm(r)` | tabla de bandas → valor nominal y tolerancia |
| Constantes eléctricas | `RINT=0.5` Ω (r interna de la fuente), `BURDEN=0.1` Ω (amperímetro), `VMR=10e6` Ω (voltímetro), `LEAK=1e9` Ω (fuga a masa), `OHM_I=1e-3` A (óhmetro), `IMAX=1.0` A (aviso de corto), `RWIRE=0.02` Ω (cable) | idealizaciones del modelo |
| Geometría | `P_`, `BX`, `BY`, `NCOL=30`, `ROWT`, `ROWB`, `ROWY`, `RAILY`, `colX`, `railX`, `rowY`, `railY`, `BOARD`, `SRCBOX`, `INSTR`, `JR`, `JB`, `TRAY` | posiciones en el lienzo SVG de 1240 × 830 |
| Puntos de conexión | `PT` (diccionario), `addPT(id,x,y,node,kind)`, IIFE `buildPoints()` | cada orificio o borne con su **nodo eléctrico**: columna superior `'T'+c`, inferior `'B'+c`, rieles `RTP/RTN/RBP/RBN` (riel continuo), bornes de fuente `SP i`/`SN i`, jacks `M{V,A,O}{r,b}` |
| Estado global | `st = {tool, color, flow, analysis, ideal, wires:[{id,a,b,color}], res:{R1…R6:{id,bands,dev,a,b}}, srcs:[{i,V,on}], log, pend, hover, wid}` | todo lo que el usuario modifica |
| Valor real de R | `Rval(k)` = nominal·(1 + dev·tol), con `dev = rnd()` ∈ [−1, 1] | cada resistencia se desvía al azar dentro de su tolerancia |

**Límites que el proyecto debe superar.** Hay 6 resistencias fijas (`R1…R6`, creadas al cargar), 3 fuentes (una por caja de `SRCBOX`) y un instrumento de cada tipo (`INSTR`). `PT` se construye una sola vez. Para tener componentes ilimitados hacen falta listas dinámicas y puntos de conexión que se registren y eliminen en tiempo de ejecución.

### 1.2 Construcción de la red y solución (sección 5)

* `buildNet(ohmMode)` arma la lista `els = [[nodoA, nodoB, R, etiqueta]]`: cada cable como resistencia `RWIRE`, cada resistencia colocada con `Rval`, la r interna de cada fuente encendida (entre el nodo interno `'INT'+i` y `'SP'+i`), el voltímetro (`VMR` entre `MVr`–`MVb`) y el amperímetro (`BURDEN`), que **siempre** están en la red. Las fuentes encendidas van en `srcs = [{i, p:'INT'+i, n:'SN'+i, V}]`; las apagadas son circuito abierto. En `ohmMode` cada fuente encendida se reemplaza por su r interna.
* `makeUF()` crea un *union-find*, pero `uni` **nunca se llama**: `find` devuelve el mismo nodo. Los cables no fusionan nodos; son resistencias de 0,02 Ω.
* `solveDC()` ya es **MNA**: hay una incógnita por nodo más una corriente por fuente. Escribe conductancias con `stamp(p,q,R)` (`g = 1/max(R, 1e-6)`), suma `1/LEAK` en la diagonal de **cada** nodo y añade las filas de fuente (`A[row][ip]+=1; A[ip][row]+=1; …; b[row]=V`). **No hay nodo de tierra**: la referencia es la masa virtual a la que fugan todos los nodos. Devuelve `{V(nm), srcI, find}`.
* `gauss(A,b)`: eliminación gaussiana con pivoteo parcial sobre arreglos de arreglos. Si un pivote es menor que 10⁻²⁰, **sigue en silencio y pone x = 0**: un sistema singular no produce ningún mensaje.
* `solveOhm(nA,nB)` inyecta `OHM_I` entre los bornes y devuelve ΔV/`OHM_I`.
* Convención de signo: `srcI[i]` es la corriente que **entra** por el borne + (convención pasiva). Una fuente que entrega energía tiene `srcI < 0` (verificado: −3,75 mA en el ejemplo serie). El "modo docente" (`renderAnalysis`) muestra ese valor sin cambiarle el signo.

### 1.3 Dibujo (secciones 7–8)

SVG `#lab` con capas `<g>`: `lBoard, lSrc, lInstr, lTray, lWires, lRes, lFlow, lHits, lOver`. Cada función `draw*` (`drawBoard`, `drawSources`, `instrSVG`/`drawInstr`, `drawTray`, `drawRes`, `drawWires`, `drawHits`, `drawOver`) regenera el `innerHTML` de su capa con cadenas de texto. `resistorAt()` dibuja una resistencia con sus bandas. `drawFlow(res)` pinta la corriente con trazos animados, y `animate(t)` la mueve con `requestAnimationFrame`.

### 1.4 Instrumentos e interfaz (secciones 6, 9–14)

* `renderReadings()` llama a `solveDC()` y muestra el voltímetro (ΔV entre jacks), el amperímetro (ΔV/`BURDEN`) y el óhmetro (`solveOhm`, que solo funciona con las fuentes apagadas). Las lecturas pasan por `noisy()`, ruido gaussiano de ±0,5 %. Un instrumento cuenta como conectado (`connected(k)`) si sus dos jacks tienen cable.
* Interacción: `down/move/up` (arrastre de resistencias, `pairFor` según orientación y paso), `clickPoint` (cables) y `delWire`.
* Paneles: `buildSrcPanel()` (deslizador de 0 a 30 V: ya es una **fuente variable**), `buildRPanel()` (bandas) y `buildSwatches()`.
* Datos: `addLog/renderLog` (registro), `download()` (con BOM UTF-8), CSV del registro, JSON `{wires, res, srcs}` para guardar y cargar.
* Ejemplos: `preset('serie'|'paralelo'|'mixto'|'divisor')`, que usa `clearBoard()` y `W()`.
* Ciclo (sección 15): `redraw()` repinta todo y vuelve a resolver; `setInterval(renderReadings, 340)` refresca las lecturas (y su ruido) cada 340 ms.

### 1.5 Consecuencias para el diseño

1. **Referencia de tensión.** El osciloscopio necesita una tierra explícita. El motor nuevo tiene un nodo `"0"` y un modo `referenciaVirtual` que reproduce el comportamiento del base.
2. **Valores para comparar.** Hay que distinguir el *valor calculado por el motor* (sin ruido), el *valor medido por el usuario* (con `noisy()`) y el *valor analítico*. Las comparaciones con la teoría usan el primero.
3. **`dev` aleatorio.** Para que la validación sea repetible se usa el valor nominal (dev = 0) o se compara con la teoría usando `Rval`.
4. **Compatibilidad.** El formato JSON `{wires,res,srcs}` debe seguir cargando cuando se extienda.

---

## 2. Requisitos priorizados y verificables

Prioridad: **M** = obligatorio, **S** = importante, **C** = opcional (extras).

### 2.1 Funcionales

| ID | Requisito | Prior. | Criterio de aceptación (cómo se verifica) |
|---|---|---|---|
| RF-01 | Conservar todas las funciones del base | M | Los 4 ejemplos dan las mismas lecturas sin ruido que el original (prueba de regresión automática, tolerancia 10⁻⁹ V/A) |
| RF-02 | Resistencias, capacitores (1 pF–1 F) e inductores (1 µH–10 H) ilimitados y ajustables | M | Se colocan 200 elementos de cada tipo; el valor se cambia con prefijo; JSON con N elementos se guarda y carga igual |
| RF-03 | Fuentes DC ilimitadas | M | 10 fuentes en un mismo circuito resuelto; KCL y balance de potencia < 10⁻⁶ relativo |
| RF-04 | Fuente variable con deslizador | M | Al mover el deslizador cambia la solución DC de forma continua; v(R) = V·R/(R+r) < 1 % |
| RF-05 | Generador senoidal, cuadrado (ciclo útil 1–99 %) y triangular, con amplitud, frecuencia y nivel DC | M | f(t) del motor = fórmula en 1 000 instantes (error 0); valor medio de la cuadrada = DC + A(2D−1) |
| RF-06 | Voltímetros y amperímetros ilimitados con R_in y R_shunt configurables | M | 5 voltímetros y 5 amperímetros simultáneos; lecturas = solución sin instrumentos dentro de < 0,1 % |
| RF-07 | Óhmetro conservado | M | Lecturas iguales al base en el ejemplo mixto con fuentes apagadas |
| RF-08 | Osciloscopio de ≥ 2 canales, retícula 10 × 8, t/div y V/div por canal, tierra, disparo | M | Una senoidal de 1 kHz y 2 V muestra 1 ciclo por 1 ms/div y 2 div pico con 1 V/div; el disparo estabiliza la imagen |
| RF-09 | Cursores de tiempo y tensión | S | Período medido con cursores de una senoidal de 1 kHz: 1,000 ms ± 1 % |
| RF-10 | Transitorios RC, RL, RLC y régimen senoidal | M | Protocolo P1–P4: error < 2 % (transitorio) y < 1 % (estable) |
| RF-11 | Registro, CSV y JSON extendidos a series de tiempo y capturas | M | El CSV exportado vuelve a dibujar la misma curva; el JSON cargado reproduce el mismo resultado |
| RF-12 | Ejemplos RC, RL, RLC serie y paralelo, filtros, y los 4 originales | M | Un botón y un JSON por ejemplo (`ejemplos/*.json`) |
| RF-13 | Bode, X-Y (Lissajous), potencia y energía | C | Solo con RF-01…RF-12 completos: |H(f_c)| = −3,01 dB ± 0,1 dB |

### 2.2 No funcionales

| ID | Requisito | Prior. | Criterio de aceptación |
|---|---|---|---|
| RNF-01 | Un solo HTML sin bibliotecas ni CDN | M | Funciona al abrir el archivo sin red; no tiene `<script src>` externos |
| RNF-02 | Motor puro, sin DOM, probado en Node | M | `node pruebas/ejecutar_pruebas.js` termina con código 0 |
| RNF-03 | Exactitud | M | < 1 % en régimen estable, < 2 % en transitorios, contra la teoría |
| RNF-04 | Paso de tiempo controlado y verificado | M | Automático (τ/50 o T/200) o manual; el cambio con Δt/2 se reporta y es < 1 % |
| RNF-05 | Casos límite con mensaje y sin bloqueo | M | Circuito flotante, malla de fuentes, cortocircuito, terminal libre, valor ≤ 0 y sistema singular dan un mensaje claro (pruebas automáticas) |
| RNF-06 | Fluidez | M | La interfaz no se congela (simulación por lotes); 300 componentes × 20 000 pasos en < 10 s |
| RNF-07 | Código explicable | M | Comentarios en español, constantes con unidades, sin números mágicos; `guia_de_estudio.md` |
| RNF-08 | Coherencia visual | S | Mismas variables CSS y secciones plegables del base |
| RNF-09 | Trazabilidad | M | Cada resultado del informe se regenera con un comando o botón |

---

## 3. Modelo físico y numérico

### 3.1 Elementos (convención pasiva: i entra por n1, v = v(n1) − v(n2))

| Elemento | Ley | Modelo DC | Modelo en t = 0⁺ |
|---|---|---|---|
| R | v = R·i | conductancia 1/R | igual |
| C | i = C·dv/dt | circuito abierto | fuente de tensión v_C(0) (v_C no salta) |
| L | v = L·di/dt | cortocircuito (fuente de 0 V) | fuente de corriente i_L(0) (i_L no salta) |
| Fuente V | v = E(t) | rama MNA | rama MNA |
| Generador | E(t) = V_DC + A·forma(2πft) | — | — |

Formas del generador (implementadas en el incremento 3, `valorGenerador`). Con u = (f·t + φ/360) mód 1 y ciclo útil D:
* senoidal: dc + A·sen(2π(f·t + φ/360));
* cuadrada: dc + A si u < D, y dc − A si no (en fase con el seno cuando D = ½);
* triangular: dc + A·[1 − 4·|w − ½|], con w = (u + ¼) mód 1. Vale 0 en u = 0, +A en u = ¼ y −A en u = ¾ (también en fase con el seno).

En un flanco de la cuadrada, el paso que termina en el flanco usa el valor de **antes**. Después, el motor **reinicia**: vuelve a resolver el sistema de t = 0⁺ con el valor de **después**, para obtener i_C y v_L justo tras el salto (sección 6.6).

### 3.2 MNA

Sistema A·x = b con x = [tensiones de nodo | corrientes de rama]. Los sellos ("stamps") son:
* conductancia g entre i y j: A_ii += g, A_jj += g, A_ij −= g, A_ji −= g;
* fuente de corriente J que entra al nodo i: b_i += J, b_j −= J;
* fuente de tensión E en la rama k: A_ik = A_ki = +1, A_jk = A_kj = −1, b_k = E;
* GMIN = 10⁻⁹ S de cada nodo a tierra (igual a 1/LEAK del base). Su efecto relativo es del orden de R·GMIN, es decir 10⁻⁶ para R = 1 kΩ.

### 3.3 Modelos compañeros (paso h = Δt)

| | Euler hacia atrás (BE) | Trapezoidal (TR) |
|---|---|---|
| Capacitor | i_{n+1} = (C/h)(v_{n+1} − v_n) → G = C/h, J = G·v_n | i_{n+1} = (2C/h)(v_{n+1} − v_n) − i_n → G = 2C/h, J = G·v_n + i_n |
| Inductor | v_{n+1} = (L/h)(i_{n+1} − i_n) → G = h/L en paralelo con I_eq = i_n¹ | i_{n+1} = G·v_{n+1} + (i_n + G·v_n) → G = h/(2L), I_eq = i_n + G·v_n¹ |
| Error local | O(h²), orden global 1 | O(h³), orden global 2 |
| Estabilidad | A-estable y L-estable: nunca oscila | A-estable pero no L-estable: con h > 2τ el factor (1−h/2τ)/(1+h/2τ) es negativo y la solución **oscila numéricamente** |

¹ En el inductor, I_eq circula de n1 a n2 por dentro del elemento: sale del nodo n1 y entra al n2 (`inyectarCorriente(s, i2, i1, Ieq)` en el motor).

**Cuándo conviene cada uno.** TR es mucho más exacto para el mismo h (P1: 0,0012 % frente a 0,365 %). También conserva la amplitud de una senoidal (no tiene amortiguamiento artificial), lo cual importa en RLC subamortiguados y en régimen AC. Su debilidad son las discontinuidades (onda cuadrada, conmutaciones) con h grande comparado con τ: allí aparecen oscilaciones de un paso a otro que no son físicas. BE las amortigua, pero introduce amortiguamiento artificial. El motor calcula el estado consistente en t = 0⁺ para que TR arranque bien. Si ese estado no existe (un capacitor en paralelo directo con una fuente ideal), el primer paso se hace con BE.

### 3.4 Paso de tiempo y convergencia

* Automático (incremento 3, `pasoAutomatico`): h = mín(1/(50·|s|máx), T/200), donde s son las frecuencias naturales del circuito y T el período del generador. |s|máx sale de la **matriz de estado** del circuito, que el motor arma solo (sección 6.5). Luego h se ajusta a T/N, con N entero, para que los flancos del generador caigan exactamente en t_k = k·h.
* Verificación: se repite con h/2 y se calcula Δ = máx|x_h − x_{h/2}|/máx|x|. Por extrapolación de Richardson, el error de x_h es ≈ Δ·2^p/(2^p − 1), que vale 2Δ para BE y 4Δ/3 para TR. El criterio **Δ < 1 %** garantiza un error < 2 % incluso con BE, y no necesita la solución analítica.
* Implementación: con h fijo, A es constante. Se factoriza LU una sola vez (≈ n³/3 operaciones) y cada paso es una sustitución (≈ n² operaciones). La factorización es la misma eliminación de `gauss()` del base, guardando los multiplicadores y detectando pivotes nulos en lugar de ignorarlos.

### 3.5 Instrumentos ideales (documentados en la interfaz)

* Voltímetro: R_in = 10 MΩ (configurable de 1 kΩ a 1 TΩ). Lee v(+) − v(−) = i·R_in. Su error de carga es R_th/(R_in + R_th), que vale 10⁻⁴ con R_th = 1 kΩ (verificado en P5, sección 6.10).
* Amperímetro: elemento en serie con R_shunt = 0,1 Ω (configurable de 1 µΩ a 100 Ω). Lee la corriente que entra por +. Su error de inserción es ≈ R_shunt/R_lazo.
* Osciloscopio: mide la tensión de nodo respecto a tierra con R_in = 1 MΩ (configurable, se puede desactivar).

### 3.6 Predicciones teóricas de las pruebas

| Prueba | Datos | Predicción |
|---|---|---|
| P1 RC | R = 1 kΩ, C = 1 µF, V = 10 V | τ = 1 ms; v_C(τ) = 6,321 V; i(0⁺) = 10 mA; E = ½CV² = 50 µJ |
| P2 RL | R = 100 Ω, L = 10 mH, V = 10 V | τ = 0,1 ms; I∞ = 100 mA; v_L(0⁺) = 10 V; E = ½LI² = 50 µJ |
| P3 RLC serie | L = 10 mH, C = 1 µF | ω0 = 10⁴ rad/s, f0 = 1 591,5 Hz, R_crít = 200 Ω |
| P3a R = 20 Ω | α = R/2L = 1 000 s⁻¹ | ω_d = √(ω0² − α²) = 9 949,9 rad/s (f_d = 1 583,6 Hz); Q = (1/R)√(L/C) = 5 |
| P3b R = 200 Ω | α = ω0 | amortiguamiento crítico; Q = 0,5 |
| P3c R = 1 kΩ | α = 5·10⁴ s⁻¹ | s₁ = −1 010,2 s⁻¹, s₂ = −98 990 s⁻¹; Q = 0,1 |
| P4 filtro RC | R = 1 kΩ, C = 1 µF | f_c = 1/(2πRC) = 159,15 Hz; en f_c: \|H\| = 0,7071 y φ = −45° (pasa-bajas) o +45° (pasa-altas); a 1 kHz el pasa-bajas da \|H\| = 0,1572 y φ = −80,96° |
| P4 RLC resonancia | R = 20 Ω | en f0, Z = R y la corriente queda en fase con la fuente |
| P5 DC | 2 mallas, 2 fuentes | KCL/KVL resueltos a mano en el plan; balance Σ p = 0; C abierto y L corto |

---

## 4. Arquitectura de módulos y flujo de datos

Un solo HTML con bloques `<script>` separados (se pueden extraer y probar por separado):

| Bloque | Responsabilidad | Depende del DOM |
|---|---|---|
| `motor-mna` **(b)** | `MotorMNA`: validación, MNA, LU, DC, transitorio por lotes, generador, matriz de estado | **no** |
| `modelo-montaje` **(a)** | `ModeloMontaje`: componentes (R, C, L), netlist del protoboard, E12, validación, diagnóstico, JSON | **no** |
| `pruebas-motor` | `PruebasMotor`: teoría, mediciones, pruebas, valores dorados | no |
| `validacion-protocolo` | `ValidacionProtocolo`: protocolo P1–P5 sobre los montajes, teoría del montaje e ideal, rendimiento, tablas Markdown | no |
| `osciloscopio-logica` **(d)** | `Osciloscopio`: plan de simulación del montaje, disparo, ventana, medidas automáticas, desfase, CSV | **no** |
| `montaje-ui` **(c)** | dibujo de C, L, medidores, generador y sondas; avisos y lecturas en vivo (lo llaman funciones del base, por eso va antes) | sí |
| `<script>` base | código del profesor; desde el incremento 4, **13 funciones modificadas** (sección 6.9), ninguna eliminada | sí |
| `ui-componentes` **(e)** | panel de capacitores e inductores, botones «+ R / + C / + L» | sí |
| `ui-osciloscopio` **(d)** | `PanelOsciloscopio`: controles, cursores, PNG/SVG, CSV, registro; la pantalla la dibuja `Osciloscopio.pantallaSVG` | sí |
| `ui-temporal` **(d)/(e)** | bancos de transitorios, gráfica, CSV, pruebas en la interfaz | sí |

```mermaid
flowchart LR
  UI[Interfaz: protoboard, paneles] -->|editar| MOD[(Modelo: componentes[], instrumentos[], cables[])]
  MOD -->|netlist {elementos:[{id,tipo,n1,n2,valor}]}| MOT[MotorMNA]
  MOT -->|DC: v, i por elemento| INS[Instrumentos: V, A, Ω]
  MOT -->|transitorio por lotes: t[], v[nodo][], i[elem][]| OSC[Osciloscopio / gráficas]
  INS --> REG[Registro / CSV]
  OSC --> REG
  MOD <-->|JSON| PER[Guardar / cargar / ejemplos]
  TST[PruebasMotor] --> MOT
  NODE[node pruebas/ejecutar_pruebas.js] --> TST
```

**Estructura de datos para "ilimitado"** (implementada en el incremento 4 para los componentes):
`st.res = {R1:{tipo:'R', bands, dev, a, b}, …, C3:{tipo:'C', valor:1e-6, a:'T5C', b:'T9C'}, L1:{tipo:'L', valor:10e-3, …}}`.
Se conservó el nombre `st.res` del base para no reescribir sus funciones. Una entrada sin `tipo` es una R, así que los ejemplos y los JSON viejos siguen valiendo. Propuesta para los incrementos 5 y 6:
`instrumentos = [{id:'VM2', tipo:'V', rin:1e7, r:'T5A', com:'B9F'}]`,
`fuentes = [{id:'G1', tipo:'gen', forma:'cuadrada', A:5, f:100, dc:0, ciclo:0.5}]`.
Son listas dinámicas con identificadores únicos. La netlist se genera a partir de ellas, y el JSON antiguo `{wires,res,srcs}` se convierte al cargarlo.

**Bocetos de interfaz.** Panel izquierdo con nuevas secciones plegables: "Componentes R/C/L" (lista con valor, prefijo y sugerencia E12), "Fuentes y generador" (tarjetas por fuente; generador con forma, A, f, DC y ciclo útil) e "Instrumentos" (añadir o quitar V/A, R_in, R_shunt). Área principal: la protoboard arriba y debajo la tarjeta del osciloscopio (pantalla 10 × 8; por canal V/div, posición y acople; base de tiempo t/div; disparo por nivel y flanco; cursores ΔT y ΔV; botones Ejecutar, Detener, Capturar PNG y CSV). La tarjeta "banco RC" del incremento 1 ya usa ese formato.

---

## 5. Plan por incrementos (cada uno con su prueba de regresión)

| # | Incremento | Pruebas nuevas | Regresión que se repite |
|---|---|---|---|
| **1** ✅ | Motor MNA (R, V, C; BE y TR; LU; t = 0⁺ consistente) + banco RC con gráfica | P1 RC contra la teoría, recurrencia exacta, convergencia Δt/2, estabilidad con Δt = 5τ, DC, casos límite | 4 ejemplos del base (byte a byte + motor vs. `solveDC`) |
| **2** ✅ | Inductor (BE/TR, DC = corto, t = 0⁺ = fuente de corriente) + bancos RL y RLC | P2 RL; P3 RLC en los 3 regímenes: f_d, α, ω0, Q, sobrepico, i máx, τ lenta; balance de energía; amortiguamiento numérico de Euler | 1 + todo lo del incremento 1 |
| **3** ✅ | Fuentes en función del tiempo: generador (senoidal/cuadrada/triangular), fuente variable (deslizador y cambio a mitad de simulación) y Δt automático desde la matriz de estado | f(t) exacta; Δt automático vs. teoría; fuente variable vs. superposición; RC y RL con onda cuadrada (solución exacta por tramos); reinicio en flancos (orden 2); régimen senoidal contra el divisor de impedancias (amplitud y fase) | 1–2 |
| **4** ✅ | Modelo de datos dinámico; la protoboard pasa a usar el motor; R, C y L ilimitados en la protoboard; mensajes de casos límite en la interfaz; JSON compatible | fuente de corriente; óhmetro con C y L; DC con C y L; E12 y rangos; JSON del base y v2; avisos; 300 componentes y red de 401 elementos | ejemplos originales con **valores dorados** (< 10⁻⁹) |
| **5** ✅ | Voltímetros y amperímetros ilimitados (R_in y R_shunt configurables), lecturas en vivo, registro y ejemplo P5 | P5: nodal, KCL, KVL y balance de potencia; efecto de carga e inserción; C y L en régimen estable; P5 armado en el protoboard con 5 medidores | 1–4 |
| **6** ✅ | Osciloscopio sobre el montaje del protoboard (canales ilimitados como sondas, t/div, V/div y posición por canal, tierra, disparo por nivel, cursores, medidas automáticas, PNG, CSV) + generador en el protoboard + transitorio del montaje | disparo y medidas sobre señales conocidas; guardar del motor; carga RC en el protoboard frente a Thévenin; filtro con generador frente al divisor de impedancias | 1–5 |
| **7** ✅ | Datos: 11 `ejemplos/*.json` de P1–P5 (montaje + osciloscopio), capturas SVG/PNG y CSV del osciloscopio, anexos generados en Node | ida y vuelta guardar → cargar (JSON, lecturas DC bit a bit, trazas); archivos del disco al día con el modelo | 1–6 |
| **8** ✅ | Protocolo P1–P5 completo sobre los 11 montajes del protoboard y prueba de rendimiento | 99 magnitudes de V e I frente a la teoría del montaje (criterio) y a la ideal (informativa); 301 elementos × 20 000 pasos | todas |
| 9 | Opcionales: Bode, X-Y, potencia y energía | \|H(f_c)\| = −3,01 dB | todas |

Fase 1 (semana 12): incrementos 1–5 (prototipo v1). Fase 2: 6–9.

---

## 6. Evidencia de los incrementos 1, 2 y 3

Tabla completa: `resultados/pruebas_motor.md`, regenerada con `node pruebas/ejecutar_pruebas.js` (308/308 pruebas del motor, 86/86 de regresión y 99/99 del protocolo P1–P5 al terminar el incremento 8; tablas del protocolo en `resultados/validacion.md`). Las mismas pruebas corren en la interfaz con el botón «Ejecutar pruebas del motor». Cada banco (RC, RL, RLC) muestra la misma tabla de mediciones que usan las pruebas (`PruebasMotor.FAMILIAS[...].mediciones`).

### 6.1 Incremento 2: lo que se agregó

* **Inductor en el motor** (`MODELOS.L`): rama de 0 V en DC (cortocircuito), fuente de corriente i0 en t = 0⁺ y modelo compañero BE/TR para t > 0.
* **Pruebas por familias** (`PruebasMotor.FAMILIAS.RC/RL/RLC`): cada familia tiene su netlist, su solución analítica y sus mediciones de "osciloscopio": 63,2 %, picos con interpolación parabólica, cruces por cero, recta de ln(picos) para α y pendiente de ln(V − v_C) para la constante lenta.
* **Δt automático** = 1/(50·|s|máx), donde s son las frecuencias naturales del circuito: τ/50 en RC y RL, 1/(50·ω0) en RLC sub- y crítico, 1/(50·|s₂|) en sobreamortiguado. Ventana = 10/mín|Re s|.
* **Balance de energía** con la cuadratura consistente con cada método: v(n+1)·i(n+1) en BE y el producto de promedios en TR. Por el teorema de Tellegen cuadra exactamente; lo que sobra es la energía que el método disipa artificialmente (BE) o la que se fuga por GMIN (TR, ≈ V²·GMIN·t).

### 6.2 Resultados clave (motor frente a la teoría)

| Prueba | Magnitud | Motor | Teórico | Error |
|---|---|---|---|---|
| P2 RL, TR | τ al 63,2 % de i | 99,989 µs | 100 µs | 0,011 % |
| P2 RL, TR | \|v_L(10τ)\|/V (L ≈ corto) | 0,0045 % | → 0 | < 1 % ✔ |
| P2 RL, BE | τ al 63,2 % de i | 100,99 µs | 100 µs | 0,99 % |
| P3a R = 20 Ω, TR | f_d | 1 583,52 Hz | 1 583,57 Hz | 0,003 % |
| P3a R = 20 Ω, TR | α (8 picos) | 999,9 s⁻¹ | 1 000 s⁻¹ | 0,01 % |
| P3a R = 20 Ω, TR | Q | 5,0003 | 5 | 0,007 % |
| P3a R = 20 Ω, TR | primer sobrepico de v_C | 17,2926 V | 17,2925 V | 0,0009 % |
| P3b R = 200 Ω, TR | i máx en t = 1/α | 36,790 mA en 100,01 µs | 36,788 mA en 100 µs | 0,007 % |
| P3c R = 1 kΩ, TR | constante lenta −1/s₁ | 989,94 µs | 989,90 µs | 0,004 % |
| P3 (los tres R) | energía disipada en R | 50,000 µJ | ½CV² = 50 µJ | < 0,0002 % |

### 6.3 Hallazgos para el análisis (resultados verificados, no supuestos)

1. **Euler hacia atrás amortigua artificialmente los circuitos oscilantes.** En P3a con Δt = 2 µs mide α = 1 097,6 s⁻¹ en lugar de 1 000 s⁻¹ (+9,76 %). Esto coincide a 10⁻⁴ % con la predicción α_num = ln[(1+αΔt)² + (ω_dΔt)²]/(2Δt), y la energía que pierde artificialmente es 4,5 % de la entregada. Por eso P3 usa el método trapezoidal, que conserva la amplitud.
2. **El balance de energía de Euler en RC** pierde 0,50 % de la energía entregada, igual a la predicción Δt/(4τ) = 0,5 % (suma de ½C·Δv² en cada paso). Por eso W_R sale 0,99 % baja: cumple el criterio de 1 % por poco. Con trapezoidal el error es 10⁻⁴ %.
3. **W_R → ½CV² sin importar R** (RC y los tres RLC): la mitad de la energía entregada por la fuente se disipa siempre, un resultado físico que el motor reproduce.
4. **Error corregido en la interfaz.** Los lotes de simulación se programaban con `requestAnimationFrame`, que el navegador suspende cuando la pestaña no se está pintando: la simulación sobreamortiguada (≈150 000 pasos en total) quedaba detenida tras el primer lote. Ahora cada lote calcula durante 15 ms y cede el control con `setTimeout`; termina en 0,8 s.

### 6.4 Límites conocidos

Ver la lista actualizada en la sección 6.8.

### 6.5 Incremento 3: lo que se agregó

* **Generador** (`valorGenerador`, `validarForma`): seno, cuadrada (ciclo útil D) y triangular, con amplitud, frecuencia, nivel DC y fase. En la interfaz: selector «Fuente: DC variable / Generador».
* **Fuente variable**: el deslizador (0–30 V, igual que en el base) vuelve a simular al moverlo. En el motor, `sim.fijarFuente(id, V)` cambia el valor **a mitad de la simulación** (la base del modo en vivo del osciloscopio, incremento 6).
* **Reinicio en los flancos**: en cada salto de la fuente se vuelve a resolver el sistema de t = 0⁺ (C = fuente con su v_C actual, L = fuente con su i_L actual) con el valor nuevo. Así se obtienen i_C y v_L después del salto. La matriz es la de t = 0⁺, ya factorizada: el costo es una sustitución LU.
* **Matriz de estado y Δt automático** (`matrizEstado`, `escalasTiempo`, `pasoAutomatico`): para cada variable de estado se pone x_j = 1, se resuelve el sistema de t = 0⁺ y se leen dv_C/dt = i_C/C y di_L/dt = v_L/L. Eso da la columna j de A en dx/dt = A·x. Con 1 o 2 variables de estado los autovalores son exactos (fórmula cuadrática). Con más, |s|máx se estima con la fórmula de Gelfand ρ(A) = lím ‖A^k‖^(1/k), con k = 4 096.
* **Nueva familia P4**: R1 – (L ‖ (R2 + C)), cuyas escalas de tiempo salen de la matriz de estado.
* **Mediciones en régimen senoidal**: fasor de la fundamental por DFT en los últimos 5 períodos (exacta con N entero de muestras por período), y fase por el retardo entre cruces por cero de dos canales, φ = −360°·f·Δt. Se comparan con el **divisor de impedancias** (fasores escritos a mano para cada familia: `FAMILIAS.*.fasores`).
* **Solución exacta de primer orden** con generador (`primerOrdenExacto`): cerrada para el seno y tramo a tramo para la cuadrada y la triangular (fuente lineal a tramos). La interfaz traza la fuente como un canal de referencia.

### 6.6 Resultados clave del incremento 3 (motor frente a la teoría)

| Prueba | Magnitud | Motor | Teórico | Error |
|---|---|---|---|---|
| Generador | f(t) motor vs. fórmula (1 000 instantes, 3 formas) | máx 3,6·10⁻¹⁵ | 0 | — |
| Δt automático | \|s\|máx RLC 1 kΩ (matriz de estado) | 98 989,7 s⁻¹ | 98 989,8 s⁻¹ | 1·10⁻⁴ % |
| Δt automático | \|s\|máx RC + RLC (3 var., Gelfand) | 10 011 s⁻¹ | 10 000 s⁻¹ | 0,11 % |
| Fuente variable | v_C(t), 5 V → 10 V en 2τ (TR) | — | superposición | 0,0008 % máx |
| P1b RC, cuadrada 50 Hz, TR | v_C(t) frente a la solución exacta | — | — | 0,0013 % máx |
| P1b RC, cuadrada 50 Hz, TR | τ en el flanco de bajada | 0,99997 ms | 1 ms | 0,003 % |
| P1b RC, cuadrada 500 Hz, TR | v_C máx periódico = V/(1+e^(−T/2τ)) | 7,3106 V | 7,3106 V | 0,0002 % |
| P2b RL, cuadrada 500 Hz, TR | τ en el flanco de bajada | 99,997 µs | 100 µs | 0,003 % |
| P4 RC en f_c = 159,15 Hz | \|v_C\| y fase | 3,5355 V ∠ −45,001° | 3,5355 V ∠ −45° | 0,002 % / 0,001° |
| P4 RC en f_c, por Δt entre canales | fase de v_C | −44,975° | −45° | 0,025° |
| P4 RC a 1 kHz | \|v_C\| y fase | 0,78582 V ∠ −80,958° | 0,78588 V ∠ −80,957° | 0,008 % / 0,0006° |
| P4 RLC en resonancia (R = 20 Ω) | \|v_C\| = Q·A | 24,999 V | 25 V | 0,004 % |
| P4 RLC en resonancia | fase de i (en fase con la fuente) | −0,019° | 0° | 0,019° |
| P4 R1 – (L ‖ (R2 + C)) a 1 kHz | \|i_L\| y fase | 46,345 mA ∠ −48,353° | 46,346 mA ∠ −48,352° | 0,001 % / 0,001° |

Criterio de fase: error **absoluto** < 0,5° (el relativo no tiene sentido cerca de 0°, como en la resonancia).

### 6.7 Hallazgos del incremento 3

1. **El reinicio en los flancos es necesario para el método trapezoidal.** Con onda cuadrada de 500 Hz, sin reinicio el error es 0,68 % y el orden baja a 1,00. Con reinicio el error es 0,0004 % (unas 1 800 veces menor) y el orden medido es 2,00. El motivo es que TR promedia i_C del paso anterior con la del nuevo, y en un flanco i_C salta.
2. **Euler atrasa la fase en régimen senoidal.** RC a 1 kHz con Δt = T/200: error de fase de 0,88°, por encima del criterio de 0,5°. Es el mismo efecto que el amortiguamiento artificial del incremento 2. Por eso P4 usa el método trapezoidal (error ≤ 0,02°).
3. **GMIN fija un piso de exactitud de ~10⁻⁶ relativo** (R·GMIN). Al medir el orden del método con errores de ~10⁻⁴ % hay que usar GMIN = 0: con GMIN el orden con reinicio salía 1,69 en lugar de 2. GMIN también corre |s|máx en ~10⁻⁶; por eso el redondeo de N = T/Δt tolera 10⁻⁵ relativo (si no, daba 1 001 puntos en vez de 1 000).
4. **Un valor teórico casi nulo** (v_C mín = 0,45 mV con 50 Hz) no se compara con error relativo: se normaliza con la excursión de la onda, como v_L → 0 en el incremento 2.

### 6.8 Límites conocidos (actualizados)

* La bobina es ideal (sin resistencia de alambre). Una bobina real de 10 mH tiene decenas de ohmios, lo que bajaría Q en P3a. Se discutirá en la validación.
* Un inductor con i0 ≠ 0 en serie con un circuito abierto no tiene estado inicial físico y aún no da un mensaje (incremento 4).
* Con más de 2 variables de estado, la escala lenta se estima como 1/mín|s|, no como 1/mín|Re s|. En un modo oscilante poco amortiguado esto subestima la duración del transitorio, y la ventana automática puede ser corta (el usuario puede fijarla).
* Con generadores de distinta frecuencia, Δt se alinea solo con el de mayor frecuencia. El motor lo avisa.
* RLC y R1 – (L ‖ (R2 + C)) con onda cuadrada o triangular no tienen solución analítica en el banco: se verifican solo por Δt/2 (Richardson), y con seno por el divisor de impedancias.
* Los bancos de transitorios aún no simulan el montaje del protoboard: este se resuelve en DC. El montaje en el tiempo se verá en el osciloscopio (incremento 6).

### 6.9 Incremento 4: componentes ilimitados y protoboard con el motor

**Qué se agregó**

* **Modelo (a)** `ModeloMontaje` (código puro): crear R, C y L sin límite (`crearComponente`, `crearResistencia`), validar valores (C entre 1 pF y 1 F, L entre 1 µH y 10 H, siempre > 0), sugerir el valor E12 más cercano, armar la netlist del protoboard (`netlist`), diagnosticar el montaje (`diagnostico`) y guardar y cargar JSON (`aJSON`, `desdeJSON`).
* **Fuente de corriente** en el motor (`MODELOS.I`), que usa el óhmetro.
* **Interfaz:**
  * Sección «Capacitores e inductores», con valor + prefijo, botón E12 y ✕ para quitar.
  * Botones «+ Resistencia / + Capacitor / + Inductor».
  * Bandeja de componentes con páginas (◀ ▶) y dibujo de C (cuerpo azul con placas) y L (núcleo con espiras).
  * Cuadro de avisos bajo las lecturas, y conteo de R, C y L en la barra superior.
* **JSON versión 2:** agrega `version` y, por componente, `tipo` (más `valor` en C y L). Carga el formato del base sin cambios. Un archivo con errores (valor ≤ 0, posición inexistente, tipo desconocido) se carga parcialmente y da avisos, sin romper el montaje.

**Funciones del base modificadas** (lista generada por el script de pruebas al comparar con el original: 90 bloques sin cambios, 13 modificados, 0 eliminados). Todas llevan el comentario `[incr. 4]`.

| Función | Por qué se modificó | Cómo se verificó |
|---|---|---|
| `buildNet` | separa C y L (lista `reac`) de las resistencias | valores dorados; montajes con C y L |
| `solveDC` | resuelve con el motor MNA, ahora con C y L; misma firma `{V, srcI, find}` más `I`, `ok`, `errores`, `avisos` | valores dorados (error ≤ 10⁻¹¹ en los 4 ejemplos) |
| `solveOhm` | inyecta la corriente de prueba con una fuente de corriente del motor; C abierto y L corto | valores dorados del óhmetro; C → O.L, L → 0 Ω |
| `drawTray` | muestra solo los componentes sin colocar, por páginas, con su dibujo y valor | navegador |
| `drawRes`, `drawOver` | dibujan R, C o L según el tipo (`componenteSVG`) | navegador |
| `drawFlow` | la corriente de C y L viene del motor | navegador |
| `renderReadings` | cuadro de avisos y errores; conteo de R, C y L | navegador; prueba de diagnóstico |
| `renderAnalysis` | muestra V, I y energía ½Cv² o ½Li² de C y L | prueba DC con C y L |
| `down` | botones de página de la bandeja | navegador |
| `buildRPanel`, `updateRLabels` | solo resistencias en el panel de bandas; ✕ para las agregadas; etiquetas de C y L | navegador |
| `bind` | «Aleatorios» y «Por defecto» solo cambian R; guardar y cargar usan el modelo (JSON v2) | prueba de JSON (base y v2, ida y vuelta) |

`gauss()` ya no lo usa el simulador, pero **se conserva sin cambios**: la prueba "motor frente a gauss() del original" lo ejecuta en cada corrida.

**Regresión con valores dorados.** Las lecturas sin ruido del simulador **original** en los 4 ejemplos son las constantes `PruebasMotor.VALORES_DORADOS`: voltímetro, amperímetro, corriente de la fuente y óhmetro con las fuentes apagadas, con las resistencias en su valor nominal. El script comprueba en cada corrida que el original sigue dando esos valores (error 0) y que v1 los reproduce: el error relativo máximo es 9,8·10⁻¹² (corriente de la fuente en «paralelo»), frente a una tolerancia de 10⁻⁹. La misma comparación corre en la interfaz, que restaura después el montaje del usuario.

**Resultados del incremento 4**

| Prueba | Obtenido | Esperado |
|---|---|---|
| Serie + C1 en paralelo con R2: voltímetro | 8,24803842732 V | 8,24803842731 V (C abierto: no cambia) |
| Serie + L1 en paralelo con R2: voltímetro | 0 V | 0 V (L en corto) |
| Serie + L1: corriente de la fuente | 11,99355 mA | 12 V/(1 000 + 0,5 + 2·0,02) Ω = 11,99352 mA (2·10⁻⁶; la diferencia es la fuga de 1 nS por nodo) |
| Óhmetro sobre un C / sobre un L ideal | 2·10⁹ Ω (O.L) / 0 Ω | ≥ 40 MΩ / 0 Ω |
| Red 12 V–1 kΩ–L–(2 kΩ ‖ C): v_C, i_L, ½Cv², ½Li² | 8 V, 4 mA, 32 µJ, 80 nJ | iguales (error < 10⁻⁴ %) |
| Escala: 300 C y L | ids únicos, JSON ida y vuelta idéntico | — |
| Escala: escalera de 401 elementos | DC en 34 ms; 10 000 pasos trapezoidales en 1,3 s | RNF-06: 300 componentes × 20 000 pasos < 10 s |

**Límites del incremento 4**

* El protoboard tiene 30 columnas: "ilimitado" vale para el modelo y el motor. En la práctica cabe lo que entra físicamente en el protoboard, como en un laboratorio real.
* Una simulación de 401 elementos y 20 000 pasos guardaría ~2·10⁷ valores y llega al límite de memoria del motor (`MAX_MUESTRAS`). Para el osciloscopio (incremento 6) se guardarán solo los canales medidos.
* El capacitor no tiene polaridad ni fugas y el inductor no tiene resistencia de alambre.

### 6.10 Incremento 5: voltímetros y amperímetros ilimitados y prueba P5

**Qué se agregó**

* **Medidores como componentes de dos terminales.** Se colocan en el protoboard como R, C y L, con el mismo mapa dinámico, la misma bandeja, el mismo panel y el mismo JSON.
  * Voltímetro (`VM`): resistencia R_in entre sus puntas. Lectura = i·R_in = v(+) − v(−).
  * Amperímetro (`AM`): resistencia R_shunt en serie. Lectura = i que entra por +.
  * La punta roja es el +. Los rangos se validan en el panel (R_in de 1 kΩ a 1 TΩ, R_shunt de 1 µΩ a 100 Ω).
  * Los tres instrumentos originales del base (V, A, Ω) siguen iguales, con su ruido.
* **Lecturas en vivo** en el protoboard (junto a cada medidor) y en la lista «Voltímetros y amperímetros agregados». El botón **«Anotar lecturas en el registro»** las agrega todas al registro de medidas del base, que ya exporta a CSV. Las lecturas de los medidores nuevos son el valor calculado por el motor, sin ruido.
* **Ejemplo P5** en «Circuitos de ejemplo»: fuentes 1 (12 V) y 2 (5 V) del base, R1–R3 y cinco medidores (AM1, AM2 y AM3 en las tres ramas; VM1 sobre R1 y VM2 sobre R3). Los datos del montaje viven en el modelo (`ModeloMontaje.MONTAJE_P5`), así que la interfaz y las pruebas arman exactamente lo mismo.
* **Cambios en el base:** ninguna función nueva modificada. Se volvieron a tocar tres de las ya modificadas en el incremento 4:
  * `buildNet`: cada componente pasa por `ModeloMontaje.elementoMotor`, así que un tipo nuevo ya no obliga a editar el base.
  * `drawRes`: la etiqueta incluye la lectura del medidor.
  * `renderReadings` y `renderAnalysis`: el conteo de medidores y su lectura y potencia.

**Teoría de P5** (V1 = 12 V, V2 = 5 V, R1 = 1 kΩ, R2 = 2,2 kΩ, R3 = 3,3 kΩ; nodo a común a las tres ramas):
V_a = (V1/R1 + V2/R2)/(1/R1 + 1/R2 + 1/R3) = 8,1207 V; I1 = (V1 − V_a)/R1 = 3,8793 mA; I2 = (V2 − V_a)/R2 = −1,4185 mA; I3 = V_a/R3 = 2,4608 mA.
I2 < 0: la fuente 2 **recibe** corriente y **absorbe** 7,09 mW (la fuente 1 la "carga"). Balance: 46,55 mW entregados por la fuente 1 = 7,09 mW absorbidos por la fuente 2 + 39,46 mW disipados en R1, R2 y R3.

**Resultados**

| Prueba | Motor | Teoría | Error |
|---|---|---|---|
| Motor, DC: V_a, I1, I2, I3, potencias | iguales a 6 cifras | — | 0 % |
| KCL en a, KVL en las dos mallas, Σ v·i (Tellegen) | ≤ 7·10⁻¹⁶ relativo | 0 | < 10⁻⁹ ✔ |
| Voltímetro con R_in = 10 kΩ en a | 7,6835 V | V_a·R_in/(R_in + R_th) = 7,6835 V | 0 %; error de carga 5,38 % = R_th/(R_in + R_th) |
| Voltímetro con R_in = 10 MΩ (el del base) | error de carga 0,0057 % | — | < 0,01 % ✔ |
| Amperímetro con R_shunt = 100 Ω en la rama de R3 | 2,4006 mA | I3 con R3 + 100 Ω = 2,4006 mA | 0 %; inserción −2,45 % frente al ideal |
| C en serie con R2 (DC) | V_a = 9,2093 V, i = 0 | V1·R3/(R1+R3) = 9,2093 V | 0 % |
| Transitorio con C, 10 escalas lentas | V_a final 9,2093 V | DC | 0,0005 % |
| L en serie con R3: DC y final del transitorio | V_a = 8,1207 V; i_L final 2,4607 mA | sin L / I3 | 0 % / 0,005 % |
| **P5 en el protoboard**: AM1, AM2, AM3 | 3,8786 / −1,4175 / 2,4611 mA | 3,8793 / −1,4185 / 2,4608 mA | 0,019 % / 0,074 % / 0,013 % |
| P5 en el protoboard: VM1 (v_R1), VM2 (V_a) | 3,8782 V / 8,1190 V | 3,8793 V / 8,1207 V | 0,029 % / 0,020 % |
| KCL con las lecturas: \|AM1 + AM2 − AM3\|/AM3 | 0,00035 % | 0 | < 1 % ✔ |
| Balance con las lecturas: V1·I1 + V2·I2 frente a Σ R·I² | 0,0092 % | 0 | < 1 % ✔ |
| KVL malla 1 con las lecturas: V1 − VM1 − VM2 | 0,023 % | 0 | < 1 % ✔ |

Las diferencias del montaje frente a la teoría (≤ 0,074 %) se explican porque la teoría a mano no incluye la r interna de las fuentes del base (0,5 Ω), los cables (0,02 Ω), los shunts de los amperímetros (0,1 Ω) ni las fugas de 1 nS por nodo. Todas quedan por debajo del criterio de 1 % de régimen estable. La rama 2 tiene el mayor error relativo porque su corriente es la diferencia de dos cantidades parecidas, (V2 − V_a)/R2.

**Hallazgos**

1. **Una fuente puede absorber potencia.** En P5 la fuente 2 recibe 1,42 mA por su borne +. El signo negativo de AM2 lo muestra directamente, y el balance de potencia solo cierra si se cuenta como potencia absorbida.
2. **El efecto de carga es medible y predecible.** Con R_in = 10 kΩ el voltímetro baja la lectura 5,38 %, exactamente R_th/(R_in + R_th) con R_th = R1 ‖ R2 ‖ R3 = 568,8 Ω. Con los 10 MΩ del base el efecto es 0,006 %.
3. **La fuga GMIN del modelo del base** explica la diferencia de 5·10⁻⁶ entre AM1 y la corriente de la fuente 1. Entre ambos hay tres nodos que fugan 1 nS cada uno. Es la tercera vez que aparece este piso de exactitud (incrementos 3, 4 y 5); conviene discutirlo en el informe.

**Límites**

* Los medidores nuevos no tienen ruido, a diferencia de los tres del base. Si se quiere simular la incertidumbre de lectura, se puede agregar la misma función `noisy()` del base como opción.
* Todavía no hay fuentes DC ilimitadas en el protoboard (RF-03): se usan las 3 fuentes del base. Es un incremento pequeño con la misma técnica (una fuente de dos terminales con su r interna).

### 6.11 Incremento 6: osciloscopio sobre el montaje del protoboard

**Diseño**

* **Canales = sondas.** Cada canal (CH1, CH2, …, sin límite) es un componente de dos terminales que se coloca como un voltímetro: punta roja = señal, negra = referencia. Mide v(+) − v(ref) con R_in = 1 MΩ (configurable), así que carga el circuito como una sonda real. La «tierra» de cada canal es su pinza de referencia, y en la pantalla cada canal marca su nivel de 0 V con una flecha numerada a la izquierda.
* **Generador en el protoboard** (`GEN`): fuente ideal seno, cuadrada, triangular o DC en serie con r_int (50 Ω por defecto, como un generador de laboratorio). Con forma DC es una **fuente DC adicional, sin límite** (requisito RF-03). En la netlist es un par de elementos: fuente y r_int, con un nodo interno. Los instrumentos DC (voltímetro, amperímetro, medidores) leen su **valor medio**: en un circuito lineal la componente DC de la respuesta es la respuesta DC al valor medio de la fuente. El óhmetro lo considera una fuente encendida y pide apagarla.
* **Transitorio del montaje:** la netlist del protoboard (la misma de `buildNet`) se simula con el motor MNA. El motor ahora guarda **solo las series pedidas** (`opciones.guardar`): el osciloscopio guarda solo sus canales, y así puede simular hasta 400 000 pasos sin llegar al límite de memoria.
* **Paso de tiempo:** Δt = mín(1/(50·|s|máx), T/200, pantalla/1000), con |s|máx sacado de la matriz de estado del montaje y alineado con los flancos del generador.
* **Modos:**
  * **Encendido:** las fuentes se conectan en t = 0, con C y L descargados o, si se elige, desde el régimen DC. Se muestra una pantalla desde t = 0.
  * **Disparo por nivel:** se simula el transitorio (10 escalas lentas) más 2 pantallas. La pantalla empieza una división antes del **último** cruce del nivel con la pendiente elegida, como un osciloscopio real con una señal ya estable. Si el nivel no se cruza, la pantalla muestra «SIN DISPARO» y la última ventana.
* **Pantalla:** retícula 10 × 8 con marcas menores. Por canal: V/div (serie 1–2–5 o automática), posición y visibilidad. Base de tiempo 1 µs/div–1 s/div. Marcas de tierra, nivel y punto de disparo.
* **Cursores arrastrables:** t1, t2, ΔT, 1/ΔT y el valor de cada canal en t1 y t2; V1, V2 y ΔV de un canal.
* **Medidas automáticas:** Vpp, Vmáx, Vmín, Vmedia, Vrms, f y fase respecto a CH1.
* **Datos:** «Capturar PNG» guarda la pantalla con sus rótulos, «CSV de la pantalla» exporta t y los canales, y «Anotar medidas» las agrega al registro del base.
* **Ejemplos:** «Osciloscopio · carga RC» (P1 en el protoboard) y «Osciloscopio · filtro RC con generador» (P4 en f_c).
* **Cambios en el base:** ninguna función nueva modificada (siguen 13, ninguna eliminada). Se volvieron a tocar tres:
  * `solveOhm`: los generadores van apagados.
  * `renderReadings`: el óhmetro también exige apagar los generadores.
  * `renderAnalysis`: muestra el valor medio del generador.

**Resultados** (Node y botón de pruebas de la app; resistencias en valor nominal)

| Prueba | Osciloscopio | Teoría | Error |
|---|---|---|---|
| Disparo ↑ 0,5 V sobre sen(ωt), 1 000 muestras por período | 3T + T/12 | 3T + T/12 | < 10⁻⁴·T |
| Medidas de 0,5 + 2·sen: Vpp, f, Vmedia, Vrms | 4 V, 1 kHz, 0,5 V, 1,5 V | iguales | < 0,01 % |
| Desfase de 0,7·sen(ωt − 45°) | −45,00° | −45° | < 0,01° |
| `guardar` del motor | serie idéntica a la completa | — | 0 |
| **Carga RC en el protoboard** (fuente 1 a 10 V, R1, C 1 µF, CH1 sobre C): CH1(t) | — | V_th(1 − e^(−t/τ)), con R_th = (R1 + r_int + 2 cables) ‖ R_in | 0,0003 % máx |
| Carga RC: τ al 63,2 % | 0,99953 ms | 0,99954 ms | 0,0005 % |
| **Filtro con generador en f_c** (seno 1 V, r_int 50 Ω): disparo | disparado en CH1 ↑ 0 V | — | — |
| Filtro: amplitud en bornes del generador | 0,97527 V | divisor con r_int = 0,97527 V | 0,0004 % |
| Filtro: \|CH2\|/\|CH1\| | 0,70674 | Z_p/(R1 + Z_p + R_cable) = 0,70675 | 0,0004 % |
| Filtro: fase de CH2 respecto a CH1 | −44,972° | −44,972° | 0,0003° |
| Filtro: frecuencia medida | 159,1549 Hz | 159,1549 Hz | 6·10⁻⁹ % |

**Hallazgos**

1. **La sonda del osciloscopio cambia el circuito.** El τ medido es 0,99953 ms y no 1 ms, y la fase del filtro en f_c es −44,972° y no −45°. La sonda de 1 MΩ queda en paralelo con el capacitor, y la teoría que la incluye coincide con el motor a 10⁻⁴ %.
2. **El generador real no entrega su amplitud nominal** cuando la carga es comparable a r_int: con R1 + Z_C en f_c, la amplitud en bornes es 0,975 V y no 1 V.
3. **Las medidas dependen de la ventana.** Vmedia de una senoidal no es 0 si la pantalla no tiene un número entero de períodos, como en un osciloscopio real. Por eso la frecuencia y la fase se miden con los cruces de (Vmáx + Vmín)/2, que no tienen ese sesgo.

**Límites**

* La autoescala vertical centra el 0 V. Una señal solo positiva usa la mitad de la pantalla; se puede bajar con la posición del canal.
* Simular un circuito con constantes de tiempo muy distintas (p. ej. microsegundos y segundos) en modo disparo puede pedir más de 400 000 pasos. El osciloscopio lo avisa y aumenta Δt; la verificación con Δt/2 de los bancos sirve para juzgar el resultado.
* No hay acople AC ni modo X-Y; este último es opcional en el alcance y queda para el incremento de extras.

### 6.12 Incremento 7: ejemplos del protocolo, guardar y cargar, y anexos

**Qué se agregó**

* **Catálogo único de ejemplos** (`ModeloMontaje.EJEMPLOS`): 11 montajes del protocolo, cada uno con título, prueba, descripción y ajustes del osciloscopio. De este catálogo salen los archivos, el selector de la interfaz («Ejemplos del protocolo de validación» en «Circuitos de ejemplo») y las pruebas, así que todos arman exactamente el mismo circuito. Resistencias en valor nominal (dev = 0).

| Archivo | Prueba | Circuito | Osciloscopio |
|---|---|---|---|
| `P1a.json` | P1 | fuente 1 (10 V) → R1 1 kΩ → C 1 µF | encendido, 1 ms/div; CH1 = v_C, CH2 = fuente |
| `P1b.json` | P1 | generador cuadrado 0–10 V, 50 Hz → R1 → C | disparo CH1 ↑ 5 V, 2 ms/div |
| `P2a.json` | P2 | fuente 1 → R 100 Ω → L 10 mH | encendido, 100 µs/div; CH1 = v_L, CH2 = v_R |
| `P2b.json` | P2 | generador cuadrado 0–10 V, 500 Hz → R 100 Ω → L | disparo, 200 µs/div |
| `P3a/b/c.json` | P3 | fuente 1 → R (20 Ω / 200 Ω / 1 kΩ) → L 10 mH → C 1 µF | encendido; CH1 = v_C, CH2 = v_R |
| `P4a.json` | P4 | generador seno 1 V en f_c → R1 → C (pasa-bajas) | disparo, 1 ms/div |
| `P4b.json` | P4 | generador seno 1 V en f0 → R 20 Ω → L → C | disparo; CH1 = generador, CH2 = v_C, CH3 = v_R |
| `P4c.json` | P4 | generador seno 1 V, 1 kHz → R1 100 Ω → (L ‖ (R2 100 Ω + C)) | disparo; CH1, CH2 = v_C, CH3 = nodo a |
| `P5.json` | P5 | dos mallas, dos fuentes, cinco medidores | — (DC) |

* **El JSON guarda también el osciloscopio.** «Guardar circuito» agrega los ajustes del osciloscopio (`osciloscopio`), y «Cargar circuito» los restaura y vuelve a simular. Los ejemplos agregan además `ejemplo`, `prueba`, `titulo` y `descripcion`. Son campos opcionales: el formato sigue siendo la versión 2 y el simulador base puede abrir el archivo (ignora lo que no conoce).
* **Un solo dibujante de la pantalla** (`Osciloscopio.pantallaSVG`, código puro):
  * la pantalla de la interfaz es ese SVG, y los cursores se arrastran sobre él;
  * «Capturar SVG» lo descarga y «Capturar PNG» lo convierte a imagen al doble de resolución;
  * Node genera con él las capturas de los anexos.

  Antes la pantalla se dibujaba en un canvas con código aparte; ahora la imagen de la interfaz y la de los anexos son la misma. `Osciloscopio.procesar` (ventana, recorte, escalas) también es común.
* **Anexos generados:** `node pruebas/generar_ejemplos.js` escribe `ejemplos/*.json` y, en `resultados/osciloscopio/`, una captura SVG y un CSV por ejemplo, más `README.md` con las medidas automáticas de cada pantalla. `pruebas/entorno.js` reúne el código común de los dos scripts de Node.
* **Cambios en el base:** solo `bind` otra vez, marcado `[incr. 7]`: guardar y cargar incluyen el osciloscopio. Siguen siendo 13 funciones modificadas y ninguna eliminada.

**Pruebas nuevas**

* **Ida y vuelta para cada uno de los 11 ejemplos:** armar → guardar (texto JSON) → ensuciar el estado (otro ejemplo y R1 con otras bandas y otra desviación) → cargar. Se comprueba que:
  * el JSON resultante es idéntico (claves ordenadas);
  * las tensiones de **todos** los nodos y las corrientes de C, L y medidores son iguales **bit a bit**;
  * las trazas del osciloscopio son idénticas (máx |Δ| = 0);
  * el SVG tiene una traza por canal;
  * la carga no da avisos.

  Corre en Node y en el botón de pruebas de la app: 11/11.
* **Archivos al día:** el ejecutor de Node compara cada `ejemplos/*.json` del disco con el que arma el modelo. Si alguien cambia un montaje y no regenera los archivos, la prueba falla y dice qué comando ejecutar.

**Resultados físicos que aparecen en los anexos** (valores del motor; la comparación con la teoría es el incremento 8)

* **P4b, resonancia.** En bornes del generador hay 0,286 V y no 1 V: en f0 la carga es solo R = 20 Ω frente a r_int = 50 Ω, así que 1·20/70 = 0,286 V. v_C vale 1,428 V, exactamente Q = 5 veces eso y a −90°. v_R coincide con la tensión del generador (las trazas CH1 y CH3 se superponen).
* **P2b, RL con onda cuadrada.** La tensión en bornes del generador baja a −3,3 V aunque la onda va de 0 a 10 V. En el flanco de bajada, la corriente del inductor (≈ 10 V/150 Ω) sigue circulando y atraviesa r_int: −0,067 A × 50 Ω ≈ −3,3 V.
* **P1b y P2b:** con un generador real, la constante de tiempo es (R + r_int)·C o L/(R + r_int), no RC o L/R.

**Límites**

* Las medidas automáticas de frecuencia y fase solo tienen sentido con señales periódicas. En un transitorio amortiguado (P3a) la "frecuencia" se toma de los cruces del nivel medio y no es f_d. La medición correcta de f_d, α y τ sobre los montajes es parte del incremento 8.
* En P3b la r interna de la fuente (0,5 Ω) y los cables vuelven el circuito apenas sobreamortiguado. El incremento 8 lo comparará con la teoría que incluye esas resistencias.

### 6.13 Incremento 8: protocolo de validación P1–P5 sobre el protoboard

**Método.** `ValidacionProtocolo` (código puro) recorre los 11 montajes del protocolo:

1. Arma cada uno exactamente como `ejemplos/<id>.json`.
2. Lo simula con el motor el tiempo necesario: 10 escalas lentas en un transitorio, o transitorio + 5 períodos enteros en régimen periódico, con el Δt automático.
3. **Mide como en el laboratorio:**
   * valores en un instante fijo;
   * τ al 63,2 % o en un flanco;
   * picos, decremento logarítmico, cruces por cero y pendiente de ln(v∞ − v);
   * máximos y mínimos del régimen periódico;
   * amplitud y fase de cada elemento por DFT relativas a CH1;
   * lecturas de los amperímetros y voltímetros en P5.
4. Compara cada magnitud con dos teorías:
   * **Teoría del montaje** (fórmulas cerradas, escritas a mano en el módulo): Thévenin de la fuente y de las sondas en 1.er orden; ecuación L·C·v'' + (L/R_p + R_t·C)·v' + (1 + R_t/R_p)·v = V en P3, con R_p = sonda en paralelo con C; divisor de impedancias con r_int y sondas en P4; análisis nodal con r internas, cables, shunts y voltímetros en P5. **Contra esta teoría se aplica el criterio**: 1 % estable, 2 % transitorio y 0,5° de fase.
   * **Teoría ideal** del libro (sin nada de lo anterior). Su error es **informativo**: separa el error numérico, que se mide contra la teoría del montaje, del efecto físico de cada idealización.

La misma validación corre en Node (`node pruebas/ejecutar_pruebas.js`, que escribe `resultados/validacion.md` con todas las tablas y las capturas) y en la app (tarjeta «Protocolo de validación P1–P5», con «Ver en el protoboard» en cada montaje).

**Resultados: 99/99 magnitudes cumplen.**

| Ejemplo | Magnitudes (V e I en ≥ 2 elementos) | Error máx. vs. montaje | Error máx. vs. ideal | Qué explica la diferencia con el ideal |
|---|---|---|---|---|
| P1a RC escalón | 9 (v_C, i_C, v_R, i_R, τ, energía) | 0,008 % | 0,2 % | r interna 0,5 Ω y cables frente a R = 1 kΩ; sonda de 1 MΩ |
| P1b RC cuadrada 50 Hz | 7 | 0,001 % | 4,9 % | r_int = 50 Ω del generador se suma a R: τ = 1,049 ms |
| P2a RL escalón | 9 (v_L, i_L, v_R, i_R, τ, energía) | 0,007 % | 1,05 % | 0,54 Ω de r interna y cables frente a R = 100 Ω |
| P2b RL cuadrada 500 Hz | 6 | 0,003 % | 33 % | r_int = 50 Ω frente a R = 100 Ω: τ = L/(R + r_int); bornes del generador a −3,27 V |
| P3a RLC sub (20 Ω) | 11 (f_d, α, Q, sobrepico, i_L máx, v_R…) | 0,09 % | 2,8 % | 0,54 Ω en serie con 20 Ω: α = 1 027 s⁻¹ y Q = 4,87 en vez de 1 000 y 5 |
| P3b RLC crítico (200 Ω) | 7 | 0,002 % | 0,19 % | las resistencias del montaje lo vuelven apenas **sobreamortiguado** (α′ = 10 026 > ω0′ = 10 001) |
| P3c RLC sobre (1 kΩ) | 8 (incluye τ lenta) | 0,09 % | 0,24 % | sonda y r interna |
| P4a filtro RC en f_c | 8 (v_gen, v_C, v_R, i con fases) | 0,001 % · 0,0008° | 2,5 % · 0,03° | r_int baja la amplitud en bornes a 0,975 V; la sonda corre la fase 0,03° |
| P4b RLC en resonancia | 10 (v_gen, v_C, v_R, v_L, i con fases) | 0,10 % · 0,019° | **71 %** · 0,019° | en f0 la carga es solo R = 20 Ω frente a r_int = 50 Ω: en bornes quedan 0,286 V; v_C/v_bornes sigue siendo Q = 4,99 |
| P4c RL–RC serie-paralelo | 12 (v_gen, v_a, v_C, i_R1, i_L, i_C con fases, KCL fasorial) | 0,018 % · 0,006° | 23 % · 0,01° | r_int frente a la impedancia de entrada (≈ 170 Ω); las fases no cambian |
| P5 dos mallas DC | 12 (5 medidores, V e I de R1–R3, potencia, KCL) | 0,0008 % | 0,07 % | r internas, cables y shunts (0,64 Ω por rama); el residuo del balance de potencia (8·10⁻⁴ %) es la fuga GMIN |

**Rendimiento (RNF-06).** Una red de 301 elementos (75 tramos R–L–C–R, 151 nodos) con 20 000 pasos trapezoidales tarda entre 0,9 y 2,9 s según la máquina y la carga (Node y navegador), frente a un límite de 10 s. La interfaz no se congela porque la simulación se reparte en lotes de 15 ms.

**Análisis de las discrepancias** (para el informe final)

1. **El error numérico es despreciable.** Frente a la teoría que describe el mismo circuito, el motor queda entre 10⁻⁶ y 0,1 %. El mayor (≈ 0,1 %) aparece en magnitudes medidas sobre muestras (α por la recta de ln(picos), τ lenta por una pendiente, la amplitud de bornes en P4b, donde se desprecian los cables). Es un error de la *medición*, no del método.
2. **Las idealizaciones sí importan, y mucho más que el método numérico.** La resistencia interna del generador (50 Ω) cambia τ un 5–33 % y la amplitud en resonancia un 71 %. Una práctica real que use un generador de laboratorio debe medir en sus bornes, como hace CH1, y no suponer la amplitud nominal.
3. **Los instrumentos cargan el circuito:** sondas de 1 MΩ y voltímetros de 10 MΩ, del orden de 10⁻⁴ a 10⁻³ en estos montajes. Que la teoría que los incluye coincida con el motor muestra que el efecto está bien modelado.
4. **El amortiguamiento crítico es frágil.** 0,54 Ω de más vuelven sobreamortiguado el P3b de 200 Ω; en el laboratorio "crítico" es siempre aproximado.

**Error encontrado y corregido.** En el navegador, el bloque de validación se ejecutaba antes que el modelo del montaje, porque había quedado en otra posición del HTML. Node no lo detectaba porque cargaba los bloques en un orden fijo. Ahora `pruebas/entorno.js` los carga **en el orden del HTML**, como el navegador, así que un error de este tipo también falla en Node.

**Límites**

* En AC se desprecian los cables (0,02 Ω): es el origen de la mayor diferencia, 0,07 % en la amplitud de bornes de P4b.
* La teoría ideal de P3 no tiene la sonda ni la r interna, así que su «error» mezcla esos dos efectos. La columna explicativa dice cuál domina.
* Todo es *valor calculado por el motor*. La comparación con *medidas reales de laboratorio* (si el grupo las toma) es otra columna que deben llenar los estudiantes.
