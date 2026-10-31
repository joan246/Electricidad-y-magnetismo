# Guía de estudio para la sustentación

Explica **cada bloque de código y cada ecuación** de `simulador.html`. Para cada tema responde qué hace, por qué se hizo así y cómo se comprobó. Al final hay preguntas probables con su respuesta y un guion para una demostración en vivo.

> Consejo: abre `simulador.html` en un editor y busca cada nombre en **negrilla monoespaciada** mientras lees. Los nombres de las funciones son los reales.

---

## 0. Mapa del código

`simulador.html` tiene un `<style>`, el HTML de los paneles y estos bloques `<script>`, en este orden de carga:

| Orden | Bloque (`id`) | Objeto | ¿Usa el DOM? | Responsabilidad |
|---|---|---|---|---|
| 1 | `motor-mna` | `MotorMNA` | no | resolver circuitos: DC, transitorio, generador, matriz de estado |
| 2 | `pruebas-motor` | `PruebasMotor` | no | soluciones analíticas, mediciones, pruebas, valores dorados |
| 3 | `modelo-montaje` | `ModeloMontaje` | no | datos del protoboard: componentes, netlist, JSON, ejemplos |
| 4 | `osciloscopio-logica` | `Osciloscopio` | no | plan del montaje, disparo, medidas, pantalla SVG |
| 5 | `validacion-protocolo` | `ValidacionProtocolo` | no | protocolo P1–P5 y rendimiento |
| 6 | `barrido-logica` | `BarridoTension` | no | incr. 9: valores del barrido, mínimos cuadrados, CSV y gráfica SVG |
| 7 | `montaje-ui` | funciones sueltas | sí | dibujo de C, L, medidores, generador y sondas; avisos; lecturas en vivo |
| 8 | `<script>` sin id | código del **base** | sí | protoboard, instrumentos, paneles (fuente variable: `fijarTensionFuente`, incr. 9), registro (13 funciones adaptadas) |
| 9 | `ui-componentes` | funciones sueltas | sí | panel de componentes, ejemplos |
| 10 | `ui-osciloscopio` | `PanelOsciloscopio` | sí | controles y cursores del osciloscopio |
| 11 | `ui-validacion` | `PanelValidacion` | sí | panel del protocolo |
| 12 | `ui-barrido` | `PanelBarrido` | sí | incr. 9: barrido de tensión sobre el montaje y sus 19 pruebas |
| 13 | `ui-temporal` | `BancoTransitorios` | sí | bancos RC, RL, RLC y RL–RC |

**Por qué hay bloques «puros».** El motor, el modelo, la lógica del osciloscopio, las pruebas y la validación no tocan `document` ni `window`. Por eso `pruebas/entorno.js` los extrae del HTML y los ejecuta en Node.js, en el mismo orden que el navegador, y las pruebas corren sobre **el mismo código** que usa la app. `montaje-ui` va antes del base porque el base llama a sus funciones al cargar (`drawTray` dibuja con `componenteSVG`).

---

## 1. El motor (`MotorMNA`)

### 1.1 Convención de signos
Para **todos** los elementos: v = v(n1) − v(n2), y la corriente i **entra por n1** y sale por n2. Esta es la convención pasiva. Con ella p = v·i es la potencia **absorbida**: positiva en una resistencia y negativa en una fuente que entrega energía. Por eso el motor da corrientes de fuente negativas. Las pruebas usan −i para hablar de «la corriente que entrega la fuente».

### 1.2 Análisis nodal modificado (MNA)
**Incógnitas:** la tensión de cada nodo menos la tierra, y una corriente por cada fuente de tensión (más una por cada capacitor en t = 0⁺ y por cada inductor en DC). **Ecuaciones:** la ley de corrientes de Kirchhoff (KCL) en cada nodo y la relación v(n1) − v(n2) = E de cada fuente. El resultado es un sistema lineal A·x = b.

**Sellos** (`sumarConductancia`, `inyectarCorriente`, `sellarRamaTension`):

* **Conductancia g entre i y j.** La corriente que sale de i es g(v_i − v_j). En la ecuación de KCL del nodo i suma +g·v_i y −g·v_j, y en la del nodo j lo contrario: A_ii += g, A_jj += g, A_ij −= g, A_ji −= g.
* **Fuente de corriente J que entrega corriente al nodo i:** es un término conocido, así que va al lado derecho: b_i += J y b_j −= J.
* **Fuente de tensión en la rama k:** su corriente x_k sale del nodo i y entra al j, por eso aparece en la KCL de ambos (A_ik = 1, A_jk = −1). La ecuación de la rama es v_i − v_j = E (A_ki = 1, A_kj = −1, b_k = E).

**Ejemplo para la pizarra.** V1 entre «in» y tierra, R entre «in» y «c», C entre «c» y tierra. Las incógnitas son v_in, v_c e i_V1:

```
[ 1/R   −1/R   1 ] [v_in]   [ 0 ]
[−1/R  1/R+G   0 ] [v_c ] = [ J ]      G, J: modelo compañero del capacitor
[ 1      0     0 ] [i_V1]   [ V ]
```

### 1.3 GMIN (`GMIN_S = 1e-9` S)
Cada nodo se conecta a tierra con 1 nS. Es exactamente 1/`LEAK` del simulador base: el base no tiene tierra y usa esa fuga para que el sistema no sea singular, y el motor la conserva para reproducir sus resultados a 10⁻¹¹. Cuesta un error relativo del orden de R·GMIN (10⁻⁶ con 1 kΩ). Es el «piso» que aparece en varias pruebas: balances de potencia de 10⁻⁵ y diferencias de 5·10⁻⁶ entre un amperímetro y la corriente de la fuente.

### 1.4 Modelos de los elementos (`MODELOS`)
Cada modelo dice cómo se valida, si necesita una incógnita de rama, qué escribe en A (constante), qué escribe en b (cambia en cada paso) y cómo se obtiene su corriente. Hay tres **modos** (`MODOS`):

| Elemento | DC | t = 0⁺ (`INICIAL`) | t > 0 (`TRANSITORIO`) |
|---|---|---|---|
| R | conductancia 1/R | igual | igual |
| V | rama, b = E | rama, b = E(0) | rama, b = E(t) |
| I (óhmetro) | b += J | igual | igual |
| C | **abierto** (no escribe nada) | **fuente de tensión** v_C actual | conductancia G + fuente J |
| L | **corto** (rama con E = 0) | **fuente de corriente** i_L actual | conductancia G + fuente I_eq |

**Por qué C es una fuente de tensión en t = 0⁺.** La tensión de un capacitor no puede saltar, porque i = C·dv/dt sería infinita. En el instante inicial v_C es conocida, y lo que se quiere es su corriente. Por lo mismo, la corriente de un inductor no salta y en t = 0⁺ actúa como una fuente de corriente.

### 1.5 Modelos compañeros (derivación)
El capacitor cumple i = C·dv/dt. Se integra entre t_n y t_{n+1} = t_n + h.

**Euler hacia atrás** (se evalúa la derivada al **final** del paso):

C·(v_{n+1} − v_n)/h = i_{n+1}  ⇒  i_{n+1} = (C/h)·v_{n+1} − (C/h)·v_n

Es una conductancia G = C/h en paralelo con una fuente que entrega J = G·v_n al nodo n1 (`gCapacitor`, `sellarFuentes` de C).

**Trapezoidal** (promedio de las derivadas al inicio y al final):

C·(v_{n+1} − v_n)/h = (i_n + i_{n+1})/2  ⇒  i_{n+1} = (2C/h)(v_{n+1} − v_n) − i_n

Ahora G = 2C/h y J = G·v_n + i_n. Por eso el método trapezoidal necesita conocer i_n, incluida i(0⁺).

**Inductor** (v = L·di/dt):

* Euler: i_{n+1} = (h/L)·v_{n+1} + i_n, es decir G = h/L con I_eq = i_n.
* Trapezoidal: i_{n+1} = (h/2L)(v_{n+1} + v_n) + i_n, es decir G = h/(2L) con I_eq = i_n + G·v_n.

En el código, I_eq circula de n1 a n2 por dentro del inductor (`inyectarCorriente(s, e.i2, e.i1, Ieq)`).

### 1.6 Precisión y estabilidad (lo más preguntado)
En un RC con h = Δt/τ, cada paso multiplica la parte transitoria por un factor:

* **Euler:** 1/(1 + h). Siempre está entre 0 y 1, así que la señal decae **sin oscilar** (L-estable). El error por paso es O(h²) y el global O(h): orden 1.
* **Trapezoidal:** r = (1 − h/2)/(1 + h/2). Es **negativo si h > 2**: con un paso grande la corriente cambia de signo en cada paso. Es una oscilación **numérica**, no física (A-estable pero no L-estable). Su orden global es 2.

Verificado: con Δt = 5τ, i(Δt)/i(0⁺) = −0,4286 = (1 − 2,5)/(1 + 2,5), y 20 cambios de signo en 20 pasos.

**Amortiguamiento artificial de Euler.** En un modo oscilante s = −α + jω_d, Euler multiplica por z = 1/(1 − s·h), cuyo módulo es menor que el real. El decaimiento que se observa es α_num = ln[(1 + αh)² + (ω_d·h)²]/(2h). En P3a da 1 097,6 s⁻¹ en lugar de 1 000 (+9,8 %), y el motor lo reproduce a 10⁻⁴ %. El trapezoidal conserva |z| = 1 en un modo sin amortiguamiento: por eso se usa por defecto en RLC y AC.

### 1.7 Estado inicial, reinicio en flancos y fuente variable (`crearSimulacion`)
1. **t = 0⁺:** se arma la matriz en modo `INICIAL`, se resuelve y se guarda la muestra 0, con i_C(0⁺) y v_L(0⁺) correctas.
   * Si no hay solución (un C descargado en paralelo directo con una fuente ideal implicaría una corriente infinita), se avisa y el primer paso se hace con Euler.
2. **Matriz del transitorio:** con h fijo, A no cambia, así que se factoriza **una vez** (`factorizar`).
3. **Cada paso** (`avanzar`):
   * se arma b con las fuentes en t_{k+1} (el valor **de antes** de un posible flanco: `'izquierdo'`);
   * se resuelve con LU y se guarda la muestra;
   * se actualiza el estado de cada C y L.
4. **Reinicio** (`reiniciar`). En un **flanco** de la onda cuadrada, la corriente del capacitor (o la tensión del inductor) salta. El trapezoidal promediaría la del paso anterior, de antes del salto, con la nueva, y perdería un orden. Por eso, justo en el flanco se vuelve a resolver el sistema de t = 0⁺ con el valor **de después** y se corrige el estado. La matriz es la de t = 0⁺, ya factorizada, así que solo cuesta una sustitución. Medido: sin reinicio, error de 0,68 % y orden 1; con reinicio, 0,0004 % y orden 2.
5. **Fuente variable** (`fijarFuente`): cambia el valor DC desde el instante actual y reinicia igual. Se verifica con superposición: 5 V → 10 V en 2τ, con error de 0,0008 %.
6. **Qué se guarda** (`opciones.guardar`): por defecto se guardan todas las series. El osciloscopio guarda solo sus canales, para poder simular hasta 400 000 pasos sin llegar al límite de memoria.

### 1.8 El sistema lineal (`factorizarLU`, `resolverLU`)
Es la eliminación gaussiana con **pivoteo parcial** de `gauss()` del base, con dos diferencias:

1. **Se guardan los multiplicadores** (matriz L). Con Δt fijo la matriz no cambia: factorizar cuesta n³/3 operaciones **una vez**, y cada paso solo cuesta n² (sustitución hacia adelante y hacia atrás).
2. **Un pivote casi nulo no se ignora.** `gauss()` ponía x = 0 en silencio. Aquí, si |pivote| < 10⁻¹³·(máximo de su columna), se informa qué incógnita queda indeterminada («la corriente de V2 no queda determinada»). Ocurre con dos fuentes distintas en paralelo o con un inductor directo sobre una fuente en DC.

**Pivoteo parcial:** en cada columna se elige como pivote la fila con el mayor valor absoluto. Así se evita dividir por números pequeños, que amplifican el error de redondeo.

### 1.9 Generador (`valorGenerador`, `esFlanco`)
Con u = (f·t + φ/360) mód 1, la fracción del período:

* **seno:** dc + A·sen(2π(f·t + φ/360));
* **cuadrada:** dc + A si u < D, y dc − A si no (D = ciclo útil). Su valor medio es dc + A(2D − 1);
* **triangular:** dc + A·[1 − 4|w − ½|], con w = (u + ¼) mód 1. Vale 0 en u = 0, +A en u = ¼ y −A en u = ¾, en fase con el seno.

En un flanco, `lado` elige el valor justo antes o justo después, desplazando la fase en ±10⁻⁹ de período (`EPS_FASE`).

### 1.10 Escalas de tiempo y paso automático (`matrizEstado`, `escalasTiempo`, `pasoAutomatico`)
**Variables de estado:** v_C de cada capacitor e i_L de cada inductor. Sin fuentes, el circuito cumple dx/dt = A·x, y sus **frecuencias naturales** s son los autovalores de A.

**Cómo se arma A sin fórmulas propias de cada circuito.** Para cada variable j: se pone x_j = 1 y las demás en 0, se resuelve el sistema de t = 0⁺ y se leen dv_C/dt = i_C/C y di_L/dt = v_L/L de todos los elementos. Eso es la columna j de A.

* **Con 1 o 2 variables**, los autovalores son exactos: λ = tr/2 ± √(tr²/4 − det).
* **Con más**, |s|máx se estima con la **fórmula de Gelfand** ρ(A) = lím ‖A^k‖^(1/k). Se eleva A al cuadrado 12 veces (k = 4 096), normalizando en cada paso para no desbordar. Sobreestima levemente ρ, lo que da un Δt un poco menor: es seguro. Verificado con 3 variables de estado: error de 0,11 %.

**Paso:** Δt = mín(1/(50·|s|máx), T/200, pantalla/1000). Después se ajusta a Δt = T/N con N entero, de modo que los flancos del generador caigan exactamente en t_k = k·Δt. Ejemplos: Δt = τ/50 en un RC, 1/(50·ω0) en un RLC subamortiguado y 1/(50·|s₂|) en uno sobreamortiguado.

**Verificación (Richardson):** se simula también con Δt/2 y se mide el cambio Δ. Para un método de orden p, error(Δt) ≈ Δ·2^p/(2^p − 1): 2Δ con Euler y 4Δ/3 con el trapezoidal. Exigir **Δ < 1 %** garantiza un error < 2 % sin conocer la solución.

---

## 2. Modelo del montaje (`ModeloMontaje`)

* **`st.res`** (nombre heredado del base) es el mapa de **todos** los componentes: `{id → {tipo, valor o bandas, a, b}}`, donde a y b son los orificios. Una entrada sin `tipo` es una R: así funcionan los ejemplos y los JSON del base.
* **`TIPOS`** define, para cada tipo, la unidad del valor, el rango (C de 1 pF a 1 F, L de 1 µH a 10 H, voltímetro de 1 kΩ a 1 TΩ, amperímetro de 1 µΩ a 100 Ω, generador de 1 mΩ a 1 kΩ, sonda), los prefijos y si es medidor o fuente.
* **`elementoMotor`** traduce un componente en elementos del motor:
  * C y L: tal cual;
  * voltímetro y sonda: R = R_in, marcados `medidor:'V'`;
  * amperímetro: R = R_shunt;
  * generador: **dos** elementos, una fuente ideal entre un nodo interno y b, y r_int entre a y ese nodo.
* **`netlist`** convierte lo que entrega `buildNet` del base (`els` resistencias, `srcs` fuentes, `reac` lo demás) en `{elementos}`. Para los generadores:
  * por defecto usa el **valor medio** de la forma: en DC, un medidor lee el promedio;
  * con `{transitorio:true}` usa la forma f(t);
  * con `{apagarFuentes:true}` usa 0 V, para el óhmetro.
* **`lecturaMedidor`:** el voltímetro lee i·R_in = v(+) − v(−) y el amperímetro lee i.
* **`diagnostico`** produce avisos que no bloquean. Cuenta cuántos terminales llegan a cada nodo (un terminal solo = «en el aire») y une los nodos con una estructura union-find para saber qué grupos tocan una fuente («sin fuente»). Los voltímetros y las sondas no cuentan como conexión, porque medir no conecta un circuito.
* **`e12Cercano`:** busca el valor de la serie E12 (1,0; 1,2; 1,5; 1,8; 2,2; 2,7; 3,3; 3,9; 4,7; 5,6; 6,8; 8,2) más cercano en escala logarítmica, que es como se definen las series.
* **`aJSON` y `desdeJSON`:** formato versión 2. Agrega `version`, `tipo`, `valor`, `forma` y, opcionalmente, `osciloscopio`, `titulo` y `descripcion`. Carga también el formato del base. Si un componente es inválido, carga el resto y lo avisa.
* **`EJEMPLOS` y `construirEjemplo`:** los 11 montajes del protocolo. De aquí salen `ejemplos/*.json`, el selector de la app y las pruebas, así que todos arman **exactamente** el mismo circuito.

---

## 3. Cambios en el código del base

13 funciones modificadas, ninguna eliminada, todas marcadas `[incr. N]`:

| Función | Cambio | Por qué |
|---|---|---|
| `buildNet` | separa R (en `els`) del resto (en `reac`, vía `elementoMotor`) | para que C, L, medidores y generadores entren al motor |
| `solveDC` | resuelve con el motor y conserva su firma `{V, srcI, find}`; agrega `I`, `ok`, `errores` | un solo motor para todo; los 4 ejemplos coinciden a 10⁻¹¹ (valores dorados) |
| `solveOhm` | la corriente de prueba es una fuente de corriente del motor; generadores apagados | que el óhmetro vea C abierto y L en corto |
| `drawTray`, `drawRes`, `drawOver` | dibujan cualquier tipo de componente; bandeja con páginas | componentes ilimitados |
| `drawFlow` | la corriente de C, L y medidores viene del motor | animación correcta |
| `renderReadings`, `renderAnalysis` | avisos, lecturas en vivo, energía; el óhmetro exige apagar los generadores | información nueva |
| `down` | botones de página de la bandeja | componentes ilimitados |
| `buildRPanel`, `updateRLabels` | solo R en el panel de bandas; etiquetas de los otros tipos | paneles separados |
| `bind` | guardar y cargar con el JSON v2 y el osciloscopio; «aleatorios» y «por defecto» solo para R | persistencia |

**Cómo se verificó.** `pruebas/ejecutar_pruebas.js` ejecuta las secciones de cálculo del base **original** y las del **final**, compara sus lecturas con los valores dorados del original y lista los bloques modificados.

---

## 4. Osciloscopio (`Osciloscopio` y `PanelOsciloscopio`)

* **Canales = sondas.** Cada canal CHk es un componente con R_in = 1 MΩ, colocado como un voltímetro. Su señal es `vElem.CHk` = v(punta) − v(pinza), y la pinza es la tierra del canal. Carga el circuito como una sonda real: τ medido en P1a es 0,99953 ms y no 1 ms.
* **`prepararMontaje`:** arma la netlist del transitorio (`netlist(..., {transitorio:true})`). Opcionalmente arranca C y L desde el punto DC.
* **`planificar`:**
  * Δt automático con el límite adicional de pantalla/1000 (mil puntos por pantalla);
  * duración: una pantalla en modo **encendido**, o en modo **disparo** el transitorio (10 escalas lentas) más 2 pantallas;
  * tope de 400 000 pasos (si se supera, avisa y aumenta Δt).
* **`buscarDisparo` y `ventana`:** buscan el **último** cruce del nivel con la pendiente pedida, para que la señal ya esté en régimen. La pantalla empieza una división antes, como en un osciloscopio real.
* **`medidas`:**
  * Vmáx, Vmín y Vpp;
  * **Vmedia** = (1/T)∫v dt y **Vrms** = √((1/T)∫v² dt), por la regla del trapecio;
  * **f**, por los cruces de subida del nivel **(Vmáx + Vmín)/2**. No se usa la media porque, si la pantalla no tiene un número entero de períodos, la media de una senoidal no es su centro.
* **`desfase`:** φ = −360°·f·Δt entre los cruces de dos canales. Es negativo si la señal está retrasada.
* **`pantallaSVG`:** un solo dibujante para la pantalla de la app, las capturas PNG y SVG y los anexos que genera Node. Contiene la retícula 10 × 8, las trazas, las flechas de tierra, la marca de disparo, los cursores y los rótulos.
* **`PanelOsciloscopio`** simula por lotes de 15 ms con `setTimeout`, sin congelar la interfaz. No usa `requestAnimationFrame` porque el navegador lo suspende cuando la pestaña no se ve. También maneja los cursores arrastrables y las capturas.

---

## 5. Pruebas y validación

### 5.1 Pruebas del motor (`PruebasMotor`)
* **Familias** `FAMILIAS.RC`, `.RL`, `.RLC`, `.RLRC`: cada una tiene su netlist, su teoría y sus mediciones. Los bancos de la app muestran **las mismas** mediciones que las pruebas.
* **Implementación exacta:** con Δt fijo, Euler da v_k = V[1 − (1+h)^(−k)] y el trapezoidal v_k = V[1 − r^k]. El motor coincide con estas recurrencias a 10⁻¹⁵, lo que prueba que su error frente a la teoría es **solo de discretización**.
* **Orden observado** = log₂[e(Δt)/e(Δt/2)]. Da 0,99 con Euler y 2,09 con el trapezoidal.
* **Balance de energía:** W = Σ Δt·p, con la potencia de cada paso calculada como el método la ve: v_{n+1}·i_{n+1} en Euler y el producto de promedios en el trapezoidal. Como v e i cumplen KCL y KVL en cada paso, el **teorema de Tellegen** da Σ W = 0. Con el trapezoidal, C y L guardan exactamente ½Cv² y ½Li². Con Euler pierden además ½C·Δv² (o ½L·Δi²) en cada paso: es su disipación artificial, 0,50 % en un RC con Δt = τ/50.

### 5.2 Teoría del montaje (`ValidacionProtocolo`)
Para comparar con el **mismo circuito** que se simula, las fórmulas incluyen lo que el montaje tiene:

* **Fuente real con una sonda en sus bornes (Thévenin):** la fuente E con resistencia r, cargada con R_in, equivale a una fuente k·E con resistencia r ‖ R_in, donde k = R_in/(R_in + r).
* **RC o RL de primer orden con sondas:** se aplica Thévenin hasta el elemento reactivo. τ = R_th·C o L/R_th, y el valor final es V_th o V_th/R_th.
* **Onda cuadrada, régimen periódico.** En el semiperíodo alto (duración D·T) se sube de x_mín a x_máx, y en el bajo se baja de nuevo:
  * x_máx = Hi + (x_mín − Hi)·q1, con q1 = e^(−D·T/τ);
  * x_mín = Lo + (x_máx − Lo)·q2, con q2 = e^(−(1−D)·T/τ).

  Despejando: x_máx = [Hi(1 − q1) + q1·Lo(1 − q2)]/(1 − q1·q2).
* **RLC con la sonda R_p en paralelo con C.** Se plantea V = R_t·i + L·di/dt + v e i = C·dv/dt + v/R_p. Sustituyendo i:

  L·C·v'' + (L/R_p + R_t·C)·v' + (1 + R_t/R_p)·v = V

  De ahí α = (L/R_p + R_t·C)/(2LC), ω0² = (1 + R_t/R_p)/(LC) y v∞ = V/(1 + R_t/R_p). La solución, con v(0) = v'(0) = 0, está en `segundoOrden`:
  * subamortiguado: v = v∞[1 − e^(−αt)(cos ω_d·t + (α/ω_d)·sen ω_d·t)];
  * sobreamortiguado: v = v∞[1 − (s₂e^(s₁t) − s₁e^(s₂t))/(s₂ − s₁)].
* **Régimen senoidal:** divisor de impedancias con r_int del generador y las sondas en paralelo. Por ejemplo, en P4b la tensión en bornes es V_t = A·Z_carga/(r + Z_carga) y la corriente I = V_t/Z_serie.
* **P5 (nodal):** cada rama lleva su resistencia completa (R + r interna + cables + shunt), con los voltímetros en paralelo con R1 y R3. Entonces V_a = (V1/R_b1 + V2/R_b2)/(1/R_b1 + 1/R_b2 + 1/R_b3).

**Por qué dos teorías.** La **teoría del montaje** separa el error **numérico**, que el criterio exige pequeño y resultó ≤ 0,1 %, del efecto **físico** de las idealizaciones. Ese efecto aparece en la columna de la **teoría ideal** (hasta 71 %), y la fila «por qué difiere» lo explica.

---

## 5A. Fuente variable y barrido de tensión (incremento 9: `BarridoTension` y `PanelBarrido`)

**Corrección del deslizador.** El deslizador de las fuentes no se podía arrastrar. Cada evento `input` llamaba a `buildSrcPanel()`, que reescribe el panel con `innerHTML`, y el `<input type="range">` que el ratón estaba arrastrando dejaba de existir: el arrastre se cortaba tras el primer paso. Ahora `fijarTensionFuente(i, v, origen)` cambia `st.srcs[i].V`, recorta a 0–30 V, redondea a 0,01 V, actualiza los **otros** controles de esa fuente y llama a `redraw()`. El panel solo se reconstruye al encender o apagar una fuente.

**El barrido.** Para cada V_k de `valores(v0, v1, n)` se pone la fuente en V_k, se llama a `solveDC()` (la misma función de las lecturas en vivo) y se leen:

* la corriente entregada, I_F = −`srcI` (el motor da i < 0 en una fuente que entrega);
* el voltímetro y el amperímetro del banco;
* los medidores agregados, con `lecturaMedidor`.

Al final, un `finally` devuelve la fuente a su tensión y estado.

**Mínimos cuadrados (`ajustar`).** Con sumas centradas, que evitan restar números grandes casi iguales:

  m = Σ(V − V̄)(y − ȳ) / Σ(V − V̄)²,  b = ȳ − m·V̄,  R² = [Σ(V − V̄)(y − ȳ)]² / [Σ(V − V̄)² · Σ(y − ȳ)²]

**Física.**

* En un circuito lineal cada tensión y corriente es una función afín de cada fuente (superposición): y = m·V_F + b, así que **R² = 1**.
* **b** es la lectura con V_F = 0, es decir, el aporte de las demás fuentes. Con una sola fuente, b = 0.
* Para la corriente de la propia fuente, **1/m = ΔV/ΔI** es la resistencia de Thévenin que ella ve (ley de Ohm). En otra rama, 1/m es una transresistencia. En P5, AM2 da −3,87 kΩ porque la corriente de la fuente 2 baja al subir la fuente 1.
* En un voltímetro, **m** es la ganancia: R4/R_total en el divisor.

**Comprobación.**

* **Divisor:** R_total = r_int + 4 cables + R1 + R_shunt + R4 ‖ (R_in + 2 cables) = 0,5 + 0,08 + 1 000 + 0,1 + 269,9927 = 1 270,673 Ω. La pendiente del amperímetro coincide a 2·10⁻⁵ %; el resto es la fuga de 1 nS por nodo.
* **P5:** las pendientes y ordenadas coinciden con la teoría de dos mallas (∂I1/∂V1 e I1 con V1 = 0) a menos de 0,06 %, que es el efecto de los shunts y la r interna.

**Circuito abierto.** Una fuente sin conectar «ve» unos 1,5 GΩ por la fuga de 1 nS por nodo (≈ 20 nA a 30 V). Por eso el barrido avisa cuando la fuente ve más de 100 MΩ.

---

## 6. Física que hay que saber explicar

* **τ = RC.** En t = τ la exponencial vale e^(−1) = 0,368, así que v_C llega al 1 − 0,368 = 63,2 % del valor final. En 5τ está al 99,3 %.
* **Energía en un RC.** La fuente entrega W = V·Q = C·V² y el capacitor guarda ½CV². La otra mitad se disipa en R, **sin importar R**. El motor lo reproduce: 50,000 µJ en los tres RLC.
* **El inductor en DC es un corto.** Con i constante, v = L·di/dt = 0. En P2a, |v_L| final / V = 0,004 %.
* **El capacitor en DC es un abierto.** Con v constante, i = C·dv/dt = 0. En P5 con un C en serie, la rama queda abierta.
* **Regímenes del RLC.**
  * R < R_crít = 2√(L/C): oscila con ω_d = √(ω0² − α²). El decremento logarítmico ln(x_n/x_{n+1}) = α·T_d da α, y Q = ω0/(2α).
  * R = R_crít: es la respuesta más rápida sin sobrepico.
  * R > R_crít: hay dos constantes de tiempo, y la lenta, −1/s₁, domina al final.
* **Resonancia.** Con ω0 = 1/√(LC), las reactancias se anulan (ωL = 1/(ωC)) y Z = R. La corriente queda en fase con la tensión y |V_C| = |V_L| = Q·|V|. Con un generador real de 50 Ω, la tensión en sus bornes cae: 0,286 V en P4b.
* **Filtro RC.** H = 1/(1 + jωRC). En f_c = 1/(2πRC), |H| = 1/√2 (−3 dB) y φ = −45°.
* **Medir la fase con dos canales:** φ = −360°·f·Δt, con Δt el retraso de la segunda señal respecto a la primera.
* **Efecto de carga de un voltímetro.** Lee V·R_in/(R_in + R_th). El error relativo es R_th/(R_in + R_th): 5,4 % con 10 kΩ y 0,006 % con 10 MΩ en P5.

---

## 7. Preguntas probables y respuestas

1. **¿Por qué MNA y no solo nodos?** Las fuentes de tensión ideales no tienen conductancia, así que no se pueden escribir solo con nodos. MNA agrega su corriente como incógnita y su ecuación de tensión. Lo mismo sirve para los capacitores en t = 0⁺ y los inductores en DC.
2. **¿Qué es un modelo compañero?** Es reemplazar un C o un L, en cada paso de tiempo, por una conductancia y una fuente conocidas que salen de discretizar su ecuación. Así, cada paso es un circuito resistivo.
3. **¿Euler o trapezoidal?** El trapezoidal es de orden 2: 0,001 % de error contra 0,4 % con Δt = τ/50, y conserva la energía y la fase. Euler es más robusto con pasos grandes, porque nunca oscila, pero amortigua y desfasa artificialmente. Se usa el trapezoidal, con reinicio en los flancos.
4. **¿Cuándo oscila el trapezoidal?** Cuando h > 2τ: el factor (1 − h/2τ)/(1 + h/2τ) se vuelve negativo. Con el Δt automático (τ/50) eso no pasa.
5. **¿Cómo saben que Δt es suficiente sin conocer la solución?** Simulan con Δt/2. Si el cambio Δ es menor que 1 %, por Richardson el error es menor que 2Δ, es decir, menor que 2 %.
6. **¿Cómo se elige Δt?** Con las frecuencias naturales del circuito, que son los autovalores de la matriz de estado que el motor arma solo: Δt = 1/(50·|s|máx). Si hay un generador, también Δt ≤ T/200, alineado con sus flancos.
7. **¿Por qué la LU y no `gauss()`?** Es la misma eliminación, pero guarda los multiplicadores. Con Δt fijo la matriz no cambia, así que se factoriza una vez y cada paso cuesta n² en lugar de n³. Además informa los pivotes nulos en lugar de ignorarlos.
8. **¿Qué pasa con dos fuentes de distinto valor en paralelo?** El sistema es singular, porque no hay una corriente que cumpla las dos ecuaciones. El motor lo dice: «la corriente de V2 no queda determinada».
9. **¿Qué es GMIN y qué error introduce?** Es una fuga de 1 nS de cada nodo a tierra, la misma del base. Evita la singularidad de los nodos flotantes y cuesta unos 10⁻⁶ relativos.
10. **¿Cómo comprobaron que no dañaron el simulador base?** Con valores dorados: las lecturas sin ruido del archivo original en los 4 ejemplos (voltímetro, amperímetro, corriente de la fuente y óhmetro), comparadas con las del final. La diferencia es menor que 10⁻¹¹. El script también lista las funciones modificadas y confirma que no se eliminó ninguna.
11. **¿Por qué el τ medido no es exactamente RC?** Por la r interna de la fuente (0,5 Ω), los cables (0,04 Ω) y la sonda de 1 MΩ: 0,99953 ms. La teoría que los incluye coincide a 10⁻⁴.
12. **¿Por qué en resonancia v_C no da 5 V?** El generador tiene 50 Ω de resistencia interna y en resonancia la carga es solo R = 20 Ω. En sus bornes quedan 1·20/70 = 0,286 V, y v_C = Q·0,286 V ≈ 1,43 V.
13. **¿Cómo se mide α en el RLC subamortiguado?** Se ajusta una recta a ln(picos) frente a t: la pendiente es −α. f_d sale de los cruces por cero, y Q = √(ω_d² + α²)/(2α).
14. **¿Por qué el generador real hace negativa la tensión de bornes en P2b?** En el flanco de bajada, la corriente del inductor (≈ 67 mA) no puede cambiar de golpe y sigue saliendo por r_int: 0 − 0,067 A·50 Ω ≈ −3,3 V.
15. **¿Por qué P3b, «crítico», resultó sobreamortiguado?** Porque 0,54 Ω de fuente y cables se suman a los 200 Ω. El amortiguamiento crítico es una condición exacta y frágil.
16. **¿Qué limitaciones tiene el modelo?** Componentes ideales y lineales (sin resistencia del alambre de la bobina, sin fugas, sin semiconductores); medidores nuevos sin ruido; escala lenta estimada con más de 2 variables de estado.
17. **¿Cómo se garantiza que los resultados son repetibles?** Los montajes están en `ejemplos/*.json`, con las resistencias en su valor nominal. `node pruebas/ejecutar_pruebas.js` regenera todas las tablas, y la prueba de ida y vuelta comprueba que guardar y cargar da las mismas trazas bit a bit.
18. **¿Qué hizo la IA y qué hicieron ustedes?** [Responder con lo que realmente hizo el grupo.] La IA asistió en el análisis del base, los borradores del código y las pruebas y la documentación. Todo está verificado con pruebas automáticas contra soluciones analíticas.
19. **¿Por qué el deslizador no se podía arrastrar?** Porque cada movimiento reescribía el panel con `innerHTML` y el control arrastrado desaparecía del DOM. Ahora el movimiento solo cambia el estado y los otros controles de esa fuente.
20. **¿Qué significa la pendiente del barrido?** En la corriente de la fuente, su inverso es la resistencia equivalente que ve la fuente (ley de Ohm). En un voltímetro es la ganancia, como la razón de un divisor. La ordenada es el aporte de las otras fuentes: superposición.
21. **¿Por qué R² da exactamente 1?** Porque el circuito es lineal: las ecuaciones MNA son lineales en las fuentes. Un R² < 1 indicaría un elemento no lineal o un error, y el barrido lo avisa.
22. **¿Por qué una fuente sin conectar entrega 20 nA?** Por la fuga GMIN de 1 nS por nodo, heredada del base. Equivale a unos 1,5 GΩ, y el barrido lo reporta como circuito abierto.

---

## 8. Guion de demostración (5 minutos)

1. **P1a** (selector de ejemplos): el osciloscopio muestra la carga. Pon el cursor de tiempo en 63,2 % y lee τ ≈ 1 ms.
2. **P3a, P3b y P3c:** muestra los tres regímenes. En P3a, lee el período con los cursores (ΔT ≈ 0,63 ms y 1/ΔT ≈ 1,58 kHz).
3. **P4b:** la resonancia. CH2 (v_C) es 5 veces CH1 y está a −90°. Explica por qué CH1 vale 0,286 V y no 1 V.
4. **Euler frente al trapezoidal:** en P3a cambia el método a Euler y mira cómo la oscilación muere antes. Ese es el amortiguamiento artificial.
5. **Protocolo de validación → Ejecutar:** 99/99. Abre una tabla y explica las dos teorías.
6. **Regresión:** carga «Serie» del base. Funciona igual que antes, y las pruebas muestran los valores dorados.
7. **Fuente variable:** arrastra el deslizador de la fuente 1 y mira cómo cambian las lecturas. Luego carga P5 y, en «Fuente variable · barrido de tensión», barre la fuente 1 de 0 a 12 V. Las rectas tienen R² = 1, la ordenada es el aporte de la fuente 2, y AM1 cruza cero cerca de 3 V.
