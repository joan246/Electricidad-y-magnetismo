/* ====================================================================
   Genera los ejemplos del protocolo y los anexos del osciloscopio
   --------------------------------------------------------------------
   Uso (desde la carpeta simulador_EM):
       node pruebas/generar_ejemplos.js
   Escribe, a partir de ModeloMontaje.EJEMPLOS (la misma fuente que usan
   la interfaz y las pruebas):
     · ejemplos/<id>.json                 montaje + ajustes del osciloscopio
                                          (se abre con «Cargar circuito»)
     · resultados/osciloscopio/<id>.svg   captura de la pantalla
     · resultados/osciloscopio/<id>.csv   t y cada canal (lo que muestra la pantalla)
     · resultados/osciloscopio/README.md  medidas automáticas de cada captura
   Los valores son CALCULADOS POR EL MOTOR (no son medidas de laboratorio).
   ==================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const E = require('./entorno');

const CAPTURA = { ancho: 960, alto: 600 };      // px de las capturas SVG
const CARPETA_OSC = path.join(E.CARPETA_RESULTADOS, 'osciloscopio');

const { puro, BV } = E.cargarEntorno();
const { ModeloMontaje: M, Osciloscopio: O } = puro;
const f = (x, u, c) => M.formatoValor(x, u, c || 4);
fs.mkdirSync(E.CARPETA_EJEMPLOS, { recursive: true });
fs.mkdirSync(CARPETA_OSC, { recursive: true });

let md = '# Capturas del osciloscopio de los ejemplos del protocolo\n\n';
md += `Generado por \`pruebas/generar_ejemplos.js\` el ${new Date().toISOString()} con Node ${process.version}. `;
md += 'Valores **calculados por el motor** sobre el montaje de cada ejemplo (resistencias en valor nominal). ';
md += 'Las medidas son las automáticas del osciloscopio sobre la pantalla mostrada.\n';

for (const id of Object.keys(M.EJEMPLOS)) {
  const json = M.construirEjemplo(BV.st, id);
  fs.writeFileSync(path.join(E.CARPETA_EJEMPLOS, id + '.json'), JSON.stringify(json, null, 1) + '\n', 'utf8');
  console.log(`ejemplos/${id}.json`);
  const cfg = json.osciloscopio;
  if (!cfg) continue;
  const res = O.simularSincrono(BV.buildNet(false), BV.st.res, cfg, cfg.canales);
  if (!res.ok) { console.log(`  ✖ ${id}: ${res.errores.join(' ')}`); continue; }
  fs.writeFileSync(path.join(CARPETA_OSC, id + '.svg'),
    O.pantallaSVG({ ancho: CAPTURA.ancho, alto: CAPTURA.alto, res, cfgCanales: cfg.canales, titulo: json.titulo }), 'utf8');
  fs.writeFileSync(path.join(CARPETA_OSC, id + '.csv'),
    '﻿' + O.csv(res.pant, res.canales.map(k => res.series[k]), res.canales, res.origen), 'utf8');
  console.log(`  resultados/osciloscopio/${id}.svg y .csv`);
  md += `\n## ${json.titulo}\n\n${json.descripcion}\n\n![${id}](${id}.svg)\n\n`;
  md += `Δt = ${f(res.r.dt, 's', 3)} · ${res.r.N} pasos · ${f(cfg.tdiv, 's', 3)}/div · `;
  md += cfg.modo === 'disparo' ? (res.ventana.disparado ? `disparo en ${res.ajustes.canalDisparo} ↑ ${f(cfg.nivel, 'V', 3)}` : 'SIN DISPARO') : 'encendido en t = 0';
  md += '\n\n| Canal | Vpp | Vmáx | Vmín | Vmedia | Vrms | f | fase respecto a CH1 |\n|---|---|---|---|---|---|---|---|\n';
  res.canales.forEach(k => {
    const m = O.medidas(res.pant.t, res.series[k]);
    const ph = k === res.canales[0] ? '—' : f(O.desfase(res.pant.t, res.series[res.canales[0]], res.series[k]), '°', 4);
    md += `| ${k} | ${f(m.pp, 'V')} | ${f(m.max, 'V')} | ${f(m.min, 'V')} | ${f(m.media, 'V')} | ${f(m.rms, 'V')} | ${Number.isFinite(m.f) ? f(m.f, 'Hz') : '—'} | ${ph} |\n`;
  });
}
fs.writeFileSync(path.join(CARPETA_OSC, 'README.md'), md, 'utf8');
console.log('resultados/osciloscopio/README.md');
