/* ====================================================================
   Entorno común de los scripts de Node (pruebas y generación de anexos)
   --------------------------------------------------------------------
   Carga desde simulador.html (versión final), SIN navegador:
     · el código puro: <script id="motor-mna">, "modelo-montaje",
       "osciloscopio-logica" y "pruebas-motor"  → contexto `puro`
     · las secciones de cálculo del simulador base (1–5 y 13: modelo,
       red y ejemplos), tanto del archivo ORIGINAL (BO) como de v1 (BV).
       En v1 dependen del motor y del modelo, que se cargan antes.
   ==================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
const ARCHIVO_V1 = path.join(RAIZ, 'simulador.html');   // simulador final (el nombre de la constante se conserva)
const ARCHIVO_BASE = path.join(RAIZ, 'base', 'simulador_protoboard_dc.html');
const CARPETA_EJEMPLOS = path.join(RAIZ, 'ejemplos');
const CARPETA_RESULTADOS = path.join(RAIZ, 'resultados');

const leer = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');

function scriptPorId(texto, id) {
  const m = texto.match(new RegExp(`<script id="${id}">([\\s\\S]*?)</script>`));
  if (!m) throw new Error(`No se encontró <script id="${id}">`);
  return m[1];
}
// Bloque <script> sin atributos = código del simulador base
function scriptBase(texto) {
  const m = texto.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('No se encontró el <script> del simulador base');
  return m[1];
}
// Secciones numeradas del base: /* ===\n   N. TÍTULO\n   === */
function seccionesBase(codigo) {
  const re = /\/\* =+\n\s+(\d+)\. [^\n]*\n\s+=+ \*\//g;
  const marcas = [];
  let m;
  while ((m = re.exec(codigo))) marcas.push({ n: +m[1], ini: m.index, fin: re.lastIndex });
  const sec = {};
  marcas.forEach((mk, k) => { sec[mk.n] = codigo.slice(mk.fin, k + 1 < marcas.length ? marcas[k + 1].ini : codigo.length); });
  return sec;
}
// Bloques de primer nivel del código (función, constante, sentencia), por nombre.
// El base escribe el cuerpo de cada función con sangría: una línea en la columna 0
// que no sea "}" o ")" empieza un bloque nuevo.
function bloques(codigo) {
  const mapa = new Map();
  let actual = null;
  codigo.split('\n').forEach(linea => {
    if (/^[^\s}\)\/]/.test(linea)) {
      const d = linea.match(/^(?:async\s+)?function\s+(\w+)|^(?:const|let|var)\s+(\w+)/);
      let nombre = d ? (d[1] || d[2]) : linea.trim().slice(0, 48);
      while (mapa.has(nombre)) nombre += '′';
      actual = nombre;
      mapa.set(actual, '');
    }
    if (actual) mapa.set(actual, mapa.get(actual) + linea + '\n');
  });
  return mapa;
}
// Carga las secciones de cálculo del base; `previo` = código del que dependen (motor y modelo en v1)
function cargarBase(codigo, previo) {
  const s = seccionesBase(codigo);
  const fuente = (previo || '') + '\n' + [1, 2, 3, 4, 5].map(n => s[n]).join('\n') +
    '\nfunction redraw(){}\n' +            // el dibujo no interviene en el cálculo
    s[13] +
    '\nglobalThis.__base = { st, preset, solveDC, solveOhm, buildNet, BURDEN, RINT, RWIRE, PT };';
  const ctx = vm.createContext({ Math, console });
  vm.runInContext(fuente, ctx);
  return ctx.__base;
}
// Texto JSON con las claves ordenadas: dos objetos con el mismo contenido dan el mismo texto
function canonico(x) {
  if (Array.isArray(x)) return '[' + x.map(canonico).join(',') + ']';
  if (x && typeof x === 'object') return '{' + Object.keys(x).sort().filter(k => x[k] !== undefined).map(k => JSON.stringify(k) + ':' + canonico(x[k])).join(',') + '}';
  return JSON.stringify(x);
}

function cargarEntorno() {
  const html = leer(ARCHIVO_V1), htmlBase = leer(ARCHIVO_BASE);
  // Los bloques puros se cargan EN EL ORDEN EN QUE APARECEN EN EL HTML, igual que en el navegador:
  // si un bloque usara otro que todavía no se definió, fallaría aquí también.
  const ids = ['motor-mna', 'modelo-montaje', 'osciloscopio-logica', 'pruebas-motor', 'validacion-protocolo', 'frecuencia-logica']
    .sort((x, y) => html.indexOf(`<script id="${x}">`) - html.indexOf(`<script id="${y}">`));
  const puro = vm.createContext({ console, Math });
  vm.runInContext(ids.map(id => scriptPorId(html, id)).join('\n') +
    '\nglobalThis.MotorMNA = MotorMNA; globalThis.ModeloMontaje = ModeloMontaje; globalThis.Osciloscopio = Osciloscopio; globalThis.PruebasMotor = PruebasMotor; globalThis.ValidacionProtocolo = ValidacionProtocolo; globalThis.BarridoFrecuencia = BarridoFrecuencia;', puro);
  const codigoBaseOriginal = scriptBase(htmlBase), codigoBaseEnV1 = scriptBase(html);
  const BO = cargarBase(codigoBaseOriginal);
  const BV = cargarBase(codigoBaseEnV1, scriptPorId(html, 'motor-mna') + '\n' + scriptPorId(html, 'modelo-montaje'));
  return { html, htmlBase, puro, BO, BV, codigoBaseOriginal, codigoBaseEnV1 };
}

module.exports = { RAIZ, ARCHIVO_V1, ARCHIVO_BASE, CARPETA_EJEMPLOS, CARPETA_RESULTADOS,
  leer, scriptPorId, scriptBase, seccionesBase, bloques, cargarBase, canonico, cargarEntorno };
