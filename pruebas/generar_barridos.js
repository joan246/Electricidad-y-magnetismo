// Regenera resultados/frecuencia/: barridos de frecuencia (SVG y CSV) de los montajes que cita el
// informe final (sección 5.7), con el mismo código del simulador (incremento 12).
// Uso: node pruebas/generar_barridos.js
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const E = require('./entorno.js');

const html = E.leer(E.ARCHIVO_V1), B = E.cargarEntorno().BV;
// Bloques puros que usa el barrido; barrido-logica aporta las marcas de los ejes de la gráfica
const ctx = vm.createContext({ console, Math });
vm.runInContext(['motor-mna', 'modelo-montaje', 'barrido-logica', 'frecuencia-logica'].map(id => E.scriptPorId(html, id)).join('\n') +
  '\nglobalThis.BF = BarridoFrecuencia; globalThis.MM = ModeloMontaje;', ctx);
const { BF, MM } = ctx;
const carpeta = path.join(E.CARPETA_RESULTADOS, 'frecuencia');
fs.mkdirSync(carpeta, { recursive: true });

const BARRIDOS = [
  { archivo: 'P4b_corriente', armar: st => MM.construirEjemplo(st, 'P4b'), p: { f0: 500, f1: 5000, n: 401, escala: 'log' },
    magnitud: { clave: 'IG', nombre: 'I que entrega GEN1', unidad: 'A', elemento: 'GEN1', signo: -1 } },
  { archivo: 'rlc_paralelo_CH2', armar: st => MM.construirEjemploRlcParalelo(st), p: { f0: 200, f1: 12e3, n: 401, escala: 'log' },
    magnitud: { clave: 'CH2', nombre: 'CH2 (tanque)', unidad: 'V', elemento: 'CH2', signo: 1 } },
  { archivo: 'P4a_filtro_CH2', armar: st => MM.construirEjemplo(st, 'P4a'), p: { f0: 10, f1: 10e3, n: 401, escala: 'log' },
    magnitud: { clave: 'CH2', nombre: 'CH2 (salida)', unidad: 'V', elemento: 'CH2', signo: 1 } }
];

BARRIDOS.forEach(b => {
  b.armar(B.st);
  const red = B.buildNet(false), circ = MM.netlist(red.els, red.srcs, red.reac, [], { transitorio: true });
  const res = BF.ejecutar(circ, 'GEN1', [b.magnitud], b.p);
  if (!res.ok) { console.error(`${b.archivo}: ${res.error}`); process.exitCode = 1; return; }
  const an = BF.analizar(res, b.magnitud.clave);
  fs.writeFileSync(path.join(carpeta, b.archivo + '.svg'), BF.graficaSVG(res, b.magnitud.clave, an));
  fs.writeFileSync(path.join(carpeta, b.archivo + '.csv'), BF.csv(res));
  console.log(`${b.archivo}: ${an.texto}; pico ${MM.formatoValor(an.pico.amp, b.magnitud.unidad, 5)} en ${MM.formatoValor(an.pico.f, 'Hz', 5)}` +
    (an.Q ? `; Q = ${an.Q.toPrecision(4)}` : '') + (an.tipo === 'bajas' ? `; f_c = ${MM.formatoValor(an.alto, 'Hz', 5)}` : ''));
});
