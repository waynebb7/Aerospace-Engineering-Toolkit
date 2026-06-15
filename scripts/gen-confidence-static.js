/* Regenerate static confidence HTML: node scripts/gen-confidence-static.js */
'use strict';

var fs = require('fs');
var path = require('path');

var rows = require('../assets/js/pwa-confidence-rating-data.json');

var RATING_LABELS = {
  A: 'Strong Evidence',
  B: 'Recognised Practice',
  C: 'Engineering Estimate',
  D: 'Assumption',
  E: 'Validation Required'
};

var CURRENT_VALUE_HINTS = {
  wireGauge: 'From AWG grid assessment (highest T₂ visible column)',
  wireType: 'From wire type selector',
  circuitCurrent: 'From circuit current input',
  runLength: 'From wire length and routing inputs',
  ambientTemperature: 'From ambient temperature input',
  bundleCount: 'From bundle wire count input',
  bundleLoading: 'From bundle loading percentage selector',
  altitude: 'From altitude selector',
  t2Estimate: 'Calculated T₂ from installation assessment',
  voltageDrop: 'Calculated voltage drop (worst-case AWG column)',
  tempVoltageDrop: 'Temperature-corrected voltage drop at T₂',
  advancedTcVoltageDrop: 'Advanced Tc voltage drop when comparison enabled',
  currentCapacity: 'Circuit current vs derated IMAX (worst-case AWG)',
  installationLimit: 'From installation temperature limit when enabled',
  advancedTc: 'Advanced Heat-Balance Model result when enabled',
  airVelocity: 'From advanced model air velocity input',
  surfaceEmissivity: 'From advanced model emissivity preset or custom value',
  thermalContact: 'From advanced model thermal contact setting',
  transientModel: 'Transient thermal model status and peak temperature',
  dutyCycle: 'From transient mission profile selector',
  standardsMatrix: 'Standards Traceability Matrix section on page'
};

function esc(t) {
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function badgeClass(level) {
  return 'pwa-trace-badge pwa-trace-badge--level-' + String(level).toLowerCase();
}

var tbody = rows.map(function (r) {
  var hint = CURRENT_VALUE_HINTS[r.valueKey] || 'Populated from calculator when JavaScript is enabled';
  var ratingLabel = RATING_LABELS[r.defaultRating] || r.defaultRating;
  return [
    '                  <tr>',
    '                    <th scope="row">' + esc(r.item) + '</th>',
    '                    <td>' + esc(r.category) + '</td>',
    '                    <td>' + esc(hint) + '</td>',
    '                    <td>Evidence: ' + esc(r.defaultEvidenceSource) + '<br><span class="' + badgeClass(r.defaultRating) + '">' + esc(r.defaultRating) + '</span> ' + esc(ratingLabel) + '</td>',
    '                    <td>' + esc(r.basis) + '</td>',
    '                    <td>' + esc(r.riskIfIncorrect) + '</td>',
    '                    <td>' + esc(r.recommendedAction) + '</td>',
    '                  </tr>'
  ].join('\n');
}).join('\n');

var outDir = path.join(__dirname);
fs.writeFileSync(path.join(outDir, 'confidence-tbody.fragment.html'), tbody);
fs.writeFileSync(path.join(outDir, 'confidence-json.fragment.html'), JSON.stringify(rows, null, 2));

require('./patch-confidence-html.js');
