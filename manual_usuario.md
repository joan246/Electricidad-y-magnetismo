# Manual de usuario — Laboratorio virtual de circuitos R, C y L

`simulador.html` · Electricidad y Magnetismo 2026-2 · PUJ Cali

---

## 1. Cómo abrirlo

* **Doble clic** en `simulador.html`. Funciona en cualquier navegador moderno (Chrome, Edge, Firefox) **sin internet ni instalación**.
* Usa una ventana de al menos **1 100 px de ancho**. Con menos, el panel izquierdo se apila arriba y la protoboard queda más abajo, con desplazamiento lateral.
* `simulador_v1.html` es el prototipo de la Fase 1 (sin osciloscopio sobre el montaje ni generador en el protoboard). Para el trabajo final usa `simulador.html`.

La pantalla tiene dos zonas:

* **Panel izquierdo:** secciones plegables. Pulsa su título para abrirlas o cerrarlas.
* **Área principal:** las fuentes, la protoboard, la bandeja y los tres instrumentos originales. Debajo vienen el **osciloscopio**, el **protocolo de validación** y los **bancos de transitorios**.

## 2. Armar un circuito

### 2.1 Cables
1. En «Herramienta», elige un color.
2. Haz clic en un punto (un orificio, un borne de fuente o un borne de instrumento) y luego en otro.
3. Para borrar un cable, usa la herramienta «Borrar» o haz clic derecho sobre él. «Deshacer cable» quita el último.

> Recuerda: en una misma columna, los cinco orificios de arriba (A–E) están unidos, y los cinco de abajo (F–J) también. El canal central los separa. Cada riel (+ y −) es un solo nodo a lo largo de toda la placa.

### 2.2 Componentes
* **Resistencias R1–R6** (las del simulador base): sus bandas de color se cambian en «Resistencias · código de colores».
* **Más componentes:** en «Componentes y medidores» hay un botón para cada tipo:
  * **+ Resistencia** (con bandas, como las del base);
  * **+ Capacitor** (1 pF a 1 F) y **+ Inductor** (1 µH a 10 H);
  * **+ Voltímetro**, **+ Amperímetro**, **+ Generador** y **+ Sonda (canal)**.
* El componente nuevo aparece en la **bandeja** de la derecha. Las flechas ◀ ▶ cambian de página cuando no caben todos.
* **Arrastra** el componente desde la bandeja al protoboard. «Colocación» decide la orientación:
  * **horizontal:** a lo largo de una franja, con el paso de columnas elegido;
  * **vertical:** cruzando el canal, de la fila D a la G.
* Para sacarlo, arrástralo de vuelta a la bandeja o haz clic derecho sobre él. **✕** en su tarjeta lo elimina.

### 2.3 Valores
Cada C, L, medidor, generador y sonda tiene una tarjeta en el panel con un número, un **prefijo** (p, n, µ, m, k, M, G) y su unidad.

* El botón **E12** (en C y L) cambia al valor comercial más cercano. Por ejemplo, 4,6 µF pasa a 4,7 µF.
* Un valor ≤ 0 o fuera de rango no se aplica y muestra un mensaje en rojo.

### 2.4 Fuentes
* **Fuentes 1–3** (cajas de arriba): enciéndelas o apágalas en «Fuentes de tensión DC». Son la **fuente variable** del protoboard, de 0 a 30 V, y su tensión se ajusta de tres maneras:
  * **arrastrando el deslizador** (pasos de 0,1 V; con el deslizador seleccionado, las flechas del teclado también lo mueven);
  * con los botones **−** y **+** (0,1 V por clic);
  * **escribiendo el valor exacto** en la casilla (resolución de 0,01 V; un valor fuera de 0–30 V se recorta al límite).
  * Las lecturas se actualizan mientras mueves la tensión.
  * Tienen una r interna de 0,5 Ω, que se puede quitar con «Fuentes ideales».
  * Para recorrer un rango de tensiones y medir en cada una, usa el **barrido de tensión** (sección 4A).
* **Generador** (componente): elige la forma (senoidal, cuadrada, triangular o DC), la amplitud A, la frecuencia f, el nivel DC, el ciclo útil D (en la cuadrada), la fase φ y su resistencia interna r_int (50 Ω por defecto).
  * Rojo = salida, negro = tierra del generador.
  * Con la forma **DC** es una fuente DC adicional, y puedes poner tantas como quieras.

## 3. Medir

### 3.1 Instrumentos del base (voltímetro, amperímetro, óhmetro)
Conecta sus bornes con cables, igual que en el simulador original. Sus lecturas tienen el ruido de ±0,5 % del base.

* El **óhmetro** solo mide con todas las fuentes y generadores apagados.
* Sobre un capacitor marca **O.L** (circuito abierto) y sobre un inductor ideal **0 Ω**.

### 3.2 Voltímetros y amperímetros agregados (sin límite)
* El **voltímetro** se coloca en **paralelo** con lo que quieres medir. Lee v(punta roja) − v(punta negra). Su R_in es de 10 MΩ por defecto y se puede configurar de 1 kΩ a 1 TΩ.
* El **amperímetro** se coloca **en serie**: hay que «abrir» el circuito y meterlo en el camino de la corriente. Lee la corriente que entra por la punta roja. Su R_shunt es de 0,1 Ω por defecto y se puede configurar de 1 µΩ a 100 Ω.
* Su lectura aparece **junto al medidor** en la protoboard y en la lista «Voltímetros y amperímetros agregados». **«Anotar lecturas en el registro»** las guarda todas en el registro de medidas.
* Son el valor calculado por el motor, **sin ruido**. Un voltímetro con R_in baja **carga** el circuito: pruébalo con 10 kΩ.

### 3.3 Avisos del montaje
Debajo de las lecturas aparecen avisos como estos:

* un terminal «en el aire», es decir, no conectado a nada;
* un componente colocado sin ninguna conexión;
* componentes que no están conectados a ninguna fuente encendida.

Si el circuito no tiene solución (por ejemplo, dos fuentes de distinto valor en paralelo), la barra superior lo indica en rojo y el aviso explica la causa probable.

### 3.4 Análisis (modo docente)
«Mostrar valores calculados» lista la tensión, la corriente y la potencia de cada R, la energía de cada C y L, la lectura y la potencia de cada medidor y el valor medio de cada generador.

## 4. Osciloscopio

1. **Coloca sondas:** «+ Sonda (canal)» crea CH1, CH2, … Cada sonda se coloca como un voltímetro: punta roja en la señal y negra en su referencia, que es la **tierra** de ese canal. Tiene R_in = 1 MΩ y carga el circuito como una real.
2. Pulsa **Ejecutar**. El montaje se simula en el tiempo y se dibuja en la pantalla de 10 × 8 divisiones.
3. **Modo:**
   * **Encendido (t = 0):** las fuentes se conectan en t = 0, con los capacitores descargados y los inductores sin corriente. Muestra la primera pantalla. Sirve para ver cargas y transitorios.
   * **Disparo por nivel:** se simula hasta que la señal se estabiliza y la pantalla empieza una división antes del **último cruce** del nivel elegido. Elige canal, nivel y pendiente (↑ o ↓). Sirve para señales periódicas (generador). Si el nivel nunca se cruza, aparece «SIN DISPARO».
4. **Escalas:**
   * la base de tiempo se elige en la serie 1–2–5, de 1 µs/div a 1 s/div;
   * por canal: V/div («auto» o fijo), posición vertical en divisiones y casilla «ver».
   * La flecha numerada a la izquierda marca el 0 V de cada canal. La flecha naranja a la derecha marca el nivel de disparo, y la «T» de arriba el instante de disparo.
5. **Condición inicial:** «descargado» o «régimen DC». La segunda arranca C y L en su estado DC, sin el transitorio de encendido.
6. **Método:** trapezoidal (recomendado) o Euler hacia atrás. Euler amortigua y desfasa artificialmente, lo cual sirve para compararlos.
7. **Cursores:**
   * **tiempo:** dos líneas verticales que miden t1, t2, ΔT, 1/ΔT y el valor de cada canal en esos instantes;
   * **tensión:** dos líneas horizontales que miden V1, V2 y ΔV del canal elegido.
   * **Arrástralos** con el ratón sobre la pantalla.
8. **Medidas automáticas:** Vpp, Vmáx, Vmín, Vmedia, Vrms, f y la fase de cada canal respecto a CH1. Se calculan sobre la pantalla visible: si la pantalla no tiene un número entero de períodos, Vmedia de una senoidal no da 0.
9. **Datos:**
   * «Capturar PNG» y «Capturar SVG» guardan la pantalla con sus rótulos;
   * «CSV de la pantalla» exporta t y todos los canales;
   * «Anotar medidas» las agrega al registro.

**Recetas rápidas**

* **τ de un RC:** modo encendido, cursor de tiempo en el instante en que CH1 llega al 63,2 % del valor final.
* **Desfase entre dos señales:** modo disparo; la tabla de medidas da la «fase vs CH1». También puedes medir Δt con los cursores y calcular φ = −360°·f·Δt.
* **Frecuencia de una oscilación amortiguada:** ΔT entre dos picos con los cursores, y f_d = 1/ΔT.

## 4A. Fuente variable · barrido de tensión

La tarjeta «Fuente variable · barrido de tensión», debajo del osciloscopio, hace automáticamente lo que en el laboratorio se hace a mano: subir la fuente paso a paso y anotar los medidores en cada tensión.

1. Arma el circuito (o carga un ejemplo) y conecta los medidores que quieras leer.
2. Elige la **fuente variable** (1, 2 o 3), la **V inicial**, la **V final** (de 0 a 30 V; puede ser descendente) y el número de **puntos** (2 a 201). Al lado aparece el paso ΔV.
3. Pulsa **Ejecutar barrido**. En cada punto se resuelve el montaje en DC y se leen:
   * la **corriente que entrega la fuente**;
   * el voltímetro y el amperímetro del banco, si están conectados;
   * todos los voltímetros y amperímetros agregados que estén en el protoboard.
4. Resultado:
   * **Gráfica** de la magnitud elegida en «Eje y» frente a la tensión de la fuente, con los puntos y la recta ajustada. Por defecto muestra un amperímetro (curva I–V).
   * **Ajuste lineal** de cada magnitud, y = m·V + b, con R². Cómo leerlo:
     * en la corriente de la propia fuente (o de un amperímetro en serie con ella), **1/m = ΔV/ΔI es la resistencia equivalente que ve la fuente** (ley de Ohm);
     * en una corriente de otra rama, 1/m es una transresistencia ΔV_F/ΔI; si es negativa, esa corriente baja cuando la fuente sube;
     * en un voltímetro, **m es la ganancia** ΔV/ΔV_F (por ejemplo, la razón de un divisor);
     * **b** es la lectura con la fuente en 0 V, es decir, el aporte de las **otras fuentes encendidas** (superposición). Con una sola fuente, b = 0;
     * en un circuito lineal (R, y C y L en DC) **R² = 1**.
   * **Tabla** con todos los puntos.
5. **CSV**, **Capturar SVG** y **Anotar ajustes** (en el registro de medidas) guardan el resultado.

Notas:

* La fuente se enciende solo durante el barrido y después vuelve a su tensión y estado. Tu montaje no cambia.
* Las lecturas son las del motor, **sin el ruido** de los instrumentos del banco.
* Avisos: si la fuente entrega más de 1 A (probable cortocircuito) o si ve un circuito abierto (más de 100 MΩ: está sin conectar y solo pasa la fuga de 1 nS por nodo del modelo).

**Recetas rápidas**

* **Ley de Ohm:** «Divisor con medidas», barrido de 0 a 12 V. La pendiente del amperímetro da 1/(R1 + R4 + r interna + shunt + cables).
* **Divisor de tensión:** en el mismo montaje, la ganancia del voltímetro es R4/R_total.
* **Superposición:** carga P5 y barre la fuente 1 de 0 a 12 V con la fuente 2 encendida. La ordenada de cada medidor es lo que aporta la fuente 2 sola. La corriente de la fuente 1 cruza cero cerca de 3 V: ahí la fuente 2 la equilibra.

## 5. Ejemplos

En «Circuitos de ejemplo»:

* **Serie, Paralelo, Mixto y Divisor:** los cuatro ejemplos originales del base.
* **P5 · dos mallas** y **Osciloscopio · carga RC / filtro RC con generador:** accesos directos.
* **Ejemplos del protocolo de validación:** los 11 montajes P1a … P5. Arman el circuito, con las resistencias en su valor nominal, y configuran el osciloscopio.

Los mismos montajes están en `ejemplos/*.json` y se abren con «Cargar circuito».

> Cargar un ejemplo reemplaza el montaje: los componentes agregados se quitan. Si quieres conservar el tuyo, guárdalo antes.

## 6. Guardar, cargar y exportar

* **Guardar circuito:** descarga un `.json` con cables, componentes, fuentes y ajustes del osciloscopio.
* **Cargar circuito:** abre un `.json` de este simulador o del simulador base. Si algo no se puede cargar (un valor inválido, una posición que no existe), se carga el resto y se avisa.
* **Registro de medidas:** «Anotar V/I/R» para los instrumentos del base, «Anotar lecturas» para los medidores y «Anotar medidas» para el osciloscopio. **CSV** exporta el registro.
* **Bancos de transitorios:** «CSV de la simulación» exporta t con la tensión y la corriente de cada elemento y la teoría.

## 7. Bancos de transitorios (RC, RL, RLC, RL–RC)

En la tarjeta «Simulación temporal» puedes estudiar un circuito aislado, con la **solución analítica superpuesta**:

1. Elige el circuito y la fuente: DC variable (escalón, con deslizador) o generador.
2. Ajusta los valores. En el RLC, los botones R = 20 Ω, 200 Ω y 1 kΩ cargan los tres regímenes.
3. Pulsa **Simular**.

Obtienes la gráfica, la tabla «comparación con la teoría» y la «verificación del paso», que repite la simulación con Δt/2 y estima el error por Richardson.

## 8. Pruebas y validación (para el informe y la sustentación)

* **«Ejecutar pruebas del motor»** (en la tarjeta de bancos) corre las 308 pruebas del motor frente a la teoría y además:
  * la regresión de los 4 ejemplos del base frente a los valores dorados;
  * P5 en el protoboard;
  * los montajes del osciloscopio;
  * la ida y vuelta guardar → cargar de los 11 ejemplos;
  * las 19 pruebas del barrido de tensión (incremento 9): la lógica con casos calculados a mano, el divisor frente a la teoría del montaje y la superposición en P5. Estas solo corren en el navegador.
* **«Protocolo de validación P1–P5 → Ejecutar validación»** mide 99 magnitudes en los 11 montajes y las compara con la *teoría del montaje* (contra la que se aplica el criterio) y con la *teoría ideal*. «Ver en el protoboard» abre cada montaje.
* Las dos restauran tu montaje al terminar.
* En una terminal, desde la carpeta `simulador_EM` (requiere Node.js 18 o superior):

  ```bash
  node pruebas/ejecutar_pruebas.js
  ```

  Genera `resultados/pruebas_motor.md` y `resultados/validacion.md`.

  ```bash
  node pruebas/generar_ejemplos.js
  ```

  Regenera `ejemplos/` y las capturas de `resultados/osciloscopio/`.

## 9. Problemas frecuentes

| Problema | Causa y solución |
|---|---|
| No veo la protoboard | La ventana es angosta (< 1 080 px): agrándala o desplázate hacia abajo. |
| El cable no se crea | Ambos extremos están en el mismo nodo (misma columna y mitad), o el orificio está ocupado. |
| El óhmetro dice «Err» | Hay fuentes o generadores encendidos: apágalos. |
| El osciloscopio dice «SIN DISPARO» | El nivel de disparo está fuera de la señal: ajústalo o cambia de canal. |
| La simulación tarda | El circuito tiene constantes de tiempo muy distintas. Reduce t/div o usa el modo encendido. El osciloscopio avisa si tuvo que aumentar Δt. |
| La lectura no coincide con la teoría | Cada resistencia del base tiene una desviación aleatoria dentro de su tolerancia (±5 % con banda dorada); «Valores por defecto» restaura las bandas pero vuelve a sortear esa desviación. Los **ejemplos del protocolo** sí usan el valor nominal. Recuerda también la r interna de las fuentes (0,5 Ω) y la del generador (50 Ω). |
| «Sistema singular» | Hay una malla solo de fuentes de tensión, o un inductor directo sobre una fuente (corriente infinita en DC). |
| El barrido dice «circuito abierto» | La fuente elegida no está conectada al montaje (o solo a algo de más de 100 MΩ). Revisa sus cables o elige otra fuente. |
