/* ====================================================================
   Ejecutor de pruebas en Node.js (sin navegador)
   --------------------------------------------------------------------
   Uso (desde la carpeta simulador_EM):
       node pruebas/ejecutar_pruebas.js
   Qué hace:
     1. Extrae del HTML los bloques de código puro (sin DOM):
          <script id="motor-mna">, <script id="modelo-montaje"> y
          <script id="pruebas-motor">
        y ejecuta PruebasMotor.ejecutar(): motor frente a la teoría.
     2. Regresión del simulador base con VALORES DORADOS:
        a) ejecuta las secciones 1–5 y 13 (modelo, red y ejemplos) del
           archivo ORIGINAL y comprueba que sus lecturas siguen siendo las
           constantes PruebasMotor.VALORES_DORADOS;
        b) ejecuta las mismas secciones de simulador.html (que desde el
           incremento 4 resuelven con el motor MNA) y compara sus lecturas
           con los valores dorados (tolerancia relativa 10⁻⁹);
        c) comprueba que el motor reproduce la eliminación gaussiana original
           en la misma red;
        d) arma montajes con C y L sobre los ejemplos (régimen DC).
     3. Lista qué bloques de código del base se modificaron, cuáles son
        nuevos y que NINGUNO se eliminó.
     4. Escribe resultados/pruebas_motor.md y termina con código 1 si
        alguna prueba falla.
   ==================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const E = require('./entorno');

const SALIDA = path.join(E.CARPETA_RESULTADOS, 'pruebas_motor.md');
const TOL_REGRESION_V = 1e-9;   // V y A · motor vs. eliminación gaussiana original (misma red)
const TOL_REL = 1e-5;           // relativa · montajes con C y L frente a la teoría del circuito. El modelo
                                // del base fuga 1/LEAK = 1 nS en CADA nodo: ~10 nodos a ~12 V se llevan
                                // ~10⁻⁷ A de 12 mA (≈10⁻⁵), que la fórmula a mano no incluye.
const R_OL = 40e6;              // Ω · el óhmetro del base marca O.L desde 40 MΩ
const { bloques, canonico } = E;

/* ---------- formato ---------- */
function fmt(x) {
  if (x === null || x === undefined) return '—';
  if (typeof x === 'boolean') return x ? 'sí' : 'no';
  if (typeof x !== 'number') return String(x).replace(/\|/g, '/');
  if (!Number.isFinite(x)) return String(x);
  const a = Math.abs(x);
  const s = (a !== 0 && (a < 1e-3 || a >= 1e5)) ? x.toExponential(4) : String(+x.toPrecision(6));
  return s.replace('.', ',');
}
const fmtPct = x => (x === null || x === undefined) ? '—' : fmt(+x.toPrecision(3)) + ' %';
const fmtLargo = x => (typeof x === 'number' && Number.isFinite(x)) ? String(+x.toPrecision(12)).replace('.', ',') : fmt(x);

/* ---------- 1. pruebas del motor (código puro) ---------- */
const { html, puro: ctxMotor, BO, BV, codigoBaseOriginal, codigoBaseEnV1 } = E.cargarEntorno();
const { PruebasMotor } = ctxMotor;
const t0 = Date.now();
const resultado = PruebasMotor.ejecutar();
const msPruebas = Date.now() - t0;

/* ---------- 2. regresión del simulador base ---------- */
const EJEMPLOS = Object.keys(PruebasMotor.VALORES_DORADOS);

const filasReg = [];   // {grupo, prueba, obtenido, esperado, error, pasa}
const reg = (grupo, prueba, obtenido, esperado, error, pasa) => filasReg.push({ grupo, prueba, obtenido, esperado, error, pasa: !!pasa });

// a) y b) valores dorados
for (const [etq, B] of [['original', BO], ['v1 (motor MNA)', BV]]) {
  for (const n of EJEMPLOS) {
    const o = PruebasMotor.lecturasEjemplo(B, n);
    PruebasMotor.compararDorados(n, o).forEach(c => {
      const err = c.dorado ? Math.abs(c.valor - c.dorado) / Math.abs(c.dorado) : Math.abs(c.valor - c.dorado);
      reg(`Valores dorados · simulador ${etq}`, `${n}: ${c.magnitud}`, c.valor, c.dorado, err, c.pasa);
    });
  }
}
// c) el motor reproduce la eliminación gaussiana original (misma red)
for (const n of EJEMPLOS) {
  for (const k in BO.st.res) BO.st.res[k].dev = 0;
  BO.preset(n);
  const r = BO.solveDC(), red = BO.buildNet(false), c = PruebasMotor.compararConBase(r, red.els, red.srcs);
  reg('Motor MNA frente a gauss() del original (misma red)', `${n}: máx |ΔV| en elementos y |ΔI| en fuentes`,
    `${fmt(c.dV)} V · ${fmt(c.dI)} A`, `< ${TOL_REGRESION_V}`, Math.max(c.dV, c.dI), c.ok && c.dV < TOL_REGRESION_V && c.dI < TOL_REGRESION_V);
}
// d) montajes con C y L sobre el ejemplo "serie" (R1 en T2–T7, R2 en T7–T12, voltímetro sobre R2)
{
  const B = BV, M = ctxMotor.ModeloMontaje, g = 'Montajes con C y L sobre el ejemplo serie (v1, DC)';
  const preparar = () => { for (const k in B.st.res) { if (!M.esDelBase(k)) delete B.st.res[k]; else B.st.res[k].dev = 0; } B.st.ideal = false; B.preset('serie'); };
  const dor = PruebasMotor.VALORES_DORADOS.serie;
  preparar();
  M.crearComponente(B.st.res, 'C', 1e-6); B.st.res.C1.a = 'T7D'; B.st.res.C1.b = 'T12D';
  let r = B.solveDC(), v = r.V('MVr') - r.V('MVb');
  reg(g, 'C1 en paralelo con R2: el voltímetro no cambia (C abierto)', v, dor.voltimetro, Math.abs(v - dor.voltimetro) / dor.voltimetro, Math.abs(v - dor.voltimetro) <= TOL_REGRESION_V * dor.voltimetro);
  reg(g, 'C1 en paralelo con R2: su corriente es 0', r.I('C1'), 0, Math.abs(r.I('C1')), Math.abs(r.I('C1')) < 1e-12);
  preparar();
  M.crearComponente(B.st.res, 'L', 10e-3); B.st.res.L1.a = 'T7D'; B.st.res.L1.b = 'T12D';
  r = B.solveDC(); v = r.V('MVr') - r.V('MVb');
  // L pone R2 en corto: queda V/(R1 + r interna + 2 cables)
  const iTeo = 12 / (1000 + B.RINT + 2 * B.RWIRE);
  reg(g, 'L1 en paralelo con R2: el voltímetro marca 0 (L corto)', v, 0, Math.abs(v), Math.abs(v) < 1e-6);
  reg(g, 'L1 en paralelo con R2: I fuente = V/(R1 + r_int + 2 R_cable)', -r.srcI[0], iTeo, Math.abs(-r.srcI[0] - iTeo) / iTeo, Math.abs(-r.srcI[0] - iTeo) / iTeo < TOL_REL);
  reg(g, 'L1 en paralelo con R2: casi toda la corriente pasa por L1', r.I('L1'), iTeo, Math.abs(r.I('L1') - iTeo) / iTeo, Math.abs(r.I('L1') - iTeo) / iTeo < 1e-3);
  preparar(); B.st.srcs.forEach(s => { s.on = false; });
  M.crearComponente(B.st.res, 'C', 1e-6); B.st.res.C1.a = 'T20C'; B.st.res.C1.b = 'T25C';
  M.crearComponente(B.st.res, 'L', 10e-3); B.st.res.L1.a = 'B20H'; B.st.res.L1.b = 'B25H';
  const rC = B.solveOhm('T20', 'T25'), rL = B.solveOhm('B20', 'B25');
  reg(g, 'óhmetro sobre un capacitor: O.L (circuito abierto)', rC, `≥ ${fmt(R_OL)} Ω`, null, rC >= R_OL);
  reg(g, 'óhmetro sobre un inductor ideal: 0 Ω', rL, 0, Math.abs(rL), Math.abs(rL) < 1e-3);
}

// e) P5 armado en el protoboard (incremento 5): dos fuentes del base y 5 medidores agregados
PruebasMotor.pruebaP5Montaje(BV).forEach(f =>
  reg('P5 en el protoboard: lecturas de 3 amperímetros y 2 voltímetros (simulador final) · error en %', f.prueba, f.obtenido, f.esperado, f.error, f.pasa));

// e2) dos mallas, 3 puentes y 2 resistencias (incremento 11): una fuente del base y 5 medidores agregados
PruebasMotor.pruebaDosMallasMontaje(BV).forEach(f =>
  reg('Dos mallas, 3 puentes y 2 resistencias en el protoboard: lecturas frente al análisis de mallas (simulador final) · error en %', f.prueba, f.obtenido, f.esperado, f.error, f.pasa));

// f) osciloscopio sobre montajes del protoboard (incremento 6)
PruebasMotor.pruebaOsciloscopioMontaje(BV).forEach(f =>
  reg('Osciloscopio sobre montajes del protoboard (simulador final) · error en % o en °', f.prueba, f.obtenido, f.esperado, f.error, f.pasa));

// g) ejemplos del protocolo (incremento 7): guardar → cargar da lo mismo, y los archivos del disco están al día
PruebasMotor.pruebaEjemplosIdaVuelta(BV).forEach(f =>
  reg('Ejemplos del protocolo: guardar → cargar → mismo montaje, mismas lecturas y mismas trazas (simulador final)', f.prueba, f.obtenido, f.esperado, null, f.pasa));
Object.keys(ctxMotor.ModeloMontaje.EJEMPLOS).forEach(id => {
  const archivo = path.join(E.CARPETA_EJEMPLOS, id + '.json');
  const esperado = canonico(ctxMotor.ModeloMontaje.construirEjemplo(BV.st, id));
  const enDisco = fs.existsSync(archivo) ? canonico(JSON.parse(fs.readFileSync(archivo, 'utf8'))) : null;
  reg('Archivos ejemplos/*.json al día con el modelo (si falla: node pruebas/generar_ejemplos.js)', `${id}.json`,
    enDisco === null ? 'no existe' : (enDisco === esperado ? 'igual al modelo' : 'DISTINTO'), 'igual al modelo', null, enDisco === esperado);
});

/* ---------- 3. bloques del base modificados ---------- */
const bO = bloques(codigoBaseOriginal), bV = bloques(codigoBaseEnV1);
const modificados = [...bO.keys()].filter(k => bV.has(k) && bV.get(k) !== bO.get(k));
const eliminados = [...bO.keys()].filter(k => !bV.has(k));
const nuevos = [...bV.keys()].filter(k => !bO.has(k));
const sinCambio = [...bO.keys()].filter(k => bV.has(k) && bV.get(k) === bO.get(k));
reg('Bloques del base', 'ningún bloque del base fue eliminado', eliminados.length ? eliminados.join(', ') : 'ninguno', 'ninguno', null, eliminados.length === 0);

/* ---------- 4. protocolo de validación P1–P5 (incremento 8) ---------- */
const VP = ctxMotor.ValidacionProtocolo;
const tVal = Date.now();
const validacion = VP.ejecutar(BV);
const msVal = Date.now() - tVal;
const ARCHIVO_VALIDACION = path.join(E.CARPETA_RESULTADOS, 'validacion.md');
{
  const R = validacion.rendimiento;
  const L = [];
  L.push('# Protocolo de validación P1–P5 sobre los montajes del protoboard', '');
  L.push(`Generado por \`pruebas/ejecutar_pruebas.js\` el ${new Date().toISOString()} con Node ${process.version} (${msVal} ms). ` +
    'Cada fila compara un valor **calculado por el motor** sobre el montaje de `ejemplos/<id>.json` (medido como en el laboratorio: ' +
    'instante fijo, 63,2 %, picos, cruces, fasores por DFT o lectura de un medidor) con dos referencias analíticas:', '');
  L.push('* **Teoría del montaje**: fórmulas cerradas que incluyen la r interna de las fuentes (0,5 Ω), la r_int del generador (50 Ω), ' +
    'los cables (0,02 Ω), los shunts (0,1 Ω) y la carga de sondas (1 MΩ) y voltímetros (10 MΩ). **El criterio se aplica contra esta teoría**: ' +
    '1 % en régimen estable, 2 % en transitorios y 0,5° en fase.');
  L.push('* **Teoría ideal** (la del libro): sin nada de lo anterior. Su error es **informativo** y mide cuánto pesa cada idealización.', '');
  L.push('En los circuitos AC se desprecian los cables (0,02 Ω frente a ≥ 20 Ω, efecto ≤ 0,2 %). Las resistencias están en su valor nominal.', '');
  L.push(`**Resumen:** ${validacion.pasan}/${validacion.total} magnitudes cumplen el criterio en ${validacion.ejemplos.length} montajes.`, '');
  L.push('| Ejemplo | Prueba | Magnitudes | Cumplen | Error máx. vs. montaje | Error máx. vs. ideal |', '|---|---|---|---|---|---|');
  validacion.ejemplos.forEach(e => {
    const fs_ = e.filas.filter(f => f.clase !== 'info');
    const mx = (c, u) => { const v = fs_.filter(f => f.unidadError === u && Number.isFinite(f[c])).map(f => f[c]); return v.length ? Math.max(...v) : null; };
    const celda = c => VP.textoError(mx(c, '%'), '%') + (mx(c, '°') !== null ? ' · ' + VP.textoError(mx(c, '°'), '°') : '');
    L.push(`| ${e.titulo} | ${e.prueba} | ${fs_.length} | ${fs_.filter(f => f.pasa).length} | ${celda('error')} | ${celda('errorIdeal')} |`);
  });
  L.push('', `**Rendimiento (RNF-06):** red de ${R.elementos} elementos (${R.nodos} nodos), ${R.pasos} pasos trapezoidales en ` +
    `${R.segundos.toFixed(2).replace('.', ',')} s (${Math.round(R.pasosPorSegundo)} pasos/s) frente a un límite de ${R.limite} s: ` +
    `${R.pasa ? '✅ cumple' : '❌ no cumple'}.`, '', '## Tablas por montaje');
  fs.writeFileSync(ARCHIVO_VALIDACION, L.join('\n') + '\n' + VP.aMarkdown(validacion, 'osciloscopio'), 'utf8');
}

/* ---------- 5. informe ---------- */
const pasanReg = filasReg.filter(f => f.pasa).length;
const totalReg = filasReg.length;
let md = '';
md += '# Resultados de las pruebas del motor — incrementos 1 a 11\n\n';
md += `Generado automáticamente por \`pruebas/ejecutar_pruebas.js\` el ${new Date().toISOString()} con Node ${process.version}.\n`;
md += `Todos los valores "motor" son **calculados por el motor** (no son medidas de laboratorio). `;
md += `Los valores "teórico" son la **solución analítica de referencia**.\n\n`;
md += `**Resumen:** pruebas del motor ${resultado.pasan}/${resultado.total} · regresión del base ${pasanReg}/${totalReg} · `;
md += `protocolo P1–P5 ${validacion.pasan}/${validacion.total} · rendimiento ${validacion.rendimiento.pasa ? 'cumple' : 'NO cumple'} · tiempo ${msPruebas} ms\n\n`;

md += '## A. Motor frente a la teoría\n\n';
let grupo = null;
const esc = s => String(s).replace(/\|/g, '\\|');
for (const f of resultado.filas) {
  if (f.grupo !== grupo) {
    grupo = f.grupo;
    md += `\n### ${grupo}\n\n| Magnitud | Motor | Teórico | Unidad | Error | Criterio | ¿Cumple? |\n|---|---|---|---|---|---|---|\n`;
  }
  md += `| ${esc(f.prueba)} | ${fmt(f.simulado)} | ${fmt(f.teorico)} | ${f.unidad} | ${f.errorPct === null ? '—' : (f.unidadError === '°' ? fmt(+f.errorPct.toPrecision(3)) + '°' : fmtPct(f.errorPct))} | ${esc(f.criterio)} | ${f.pasa ? '✅' : '❌'} |\n`;
}

md += '\n## B. Regresión del simulador base\n\n';
md += 'Valores dorados: lecturas sin ruido del simulador **original** en los 4 ejemplos (resistencias en su valor nominal, ';
md += 'fuente 1 a 12 V con r interna 0,5 Ω; óhmetro con las fuentes apagadas). Tolerancia relativa 1·10⁻⁹. ';
md += 'Desde el incremento 4, `solveDC()` y `solveOhm()` del simulador final resuelven con el motor MNA.\n';
grupo = null;
for (const f of filasReg) {
  if (f.grupo !== grupo) {
    grupo = f.grupo;
    md += `\n### ${grupo}\n\n| Prueba | Obtenido | Esperado | Error | ¿Cumple? |\n|---|---|---|---|---|\n`;
  }
  md += `| ${esc(f.prueba)} | ${fmtLargo(f.obtenido)} | ${fmtLargo(f.esperado)} | ${f.error === null ? '—' : fmt(f.error)} | ${f.pasa ? '✅' : '❌'} |\n`;
}
md += '\nLa corriente de la fuente es negativa por la convención pasiva de MNA (entra por el borne +): la fuente entrega energía.\n';

md += '\n## C. Cambios en el código del simulador base\n\n';
md += `Bloques de primer nivel del \`<script>\` del base: **${sinCambio.length} sin cambios**, **${modificados.length} modificados**, `;
md += `**${nuevos.length} nuevos**, **${eliminados.length} eliminados**. Cada cambio está marcado con \`[incr. N]\` en el código.\n\n`;
md += `* Modificados: ${modificados.map(n => '`' + n + '`').join(', ') || '—'}\n`;
md += `* Nuevos: ${nuevos.map(n => '`' + n + '`').join(', ') || '—'}\n`;
md += `* Eliminados: ${eliminados.map(n => '`' + n + '`').join(', ') || 'ninguno'}\n`;

md += '\n## D. Protocolo de validación P1–P5 (incremento 8)\n\n';
md += `${validacion.pasan}/${validacion.total} magnitudes de los ${validacion.ejemplos.length} montajes del protocolo cumplen el criterio frente a la teoría del montaje. `;
md += `Tablas completas, con la teoría ideal y las capturas: \`resultados/validacion.md\`. Rendimiento: ${validacion.rendimiento.elementos} elementos × `;
md += `${validacion.rendimiento.pasos} pasos en ${validacion.rendimiento.segundos.toFixed(2).replace('.', ',')} s (límite ${validacion.rendimiento.limite} s).\n`;

fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
fs.writeFileSync(SALIDA, md, 'utf8');
console.log(md);

const fallos = (resultado.total - resultado.pasan) + (totalReg - pasanReg) + (validacion.total - validacion.pasan) + (validacion.rendimiento.pasa ? 0 : 1);
console.log(fallos ? `\n${fallos} prueba(s) NO cumplen.` : '\nTodas las pruebas cumplen.');
process.exit(fallos ? 1 : 0);
