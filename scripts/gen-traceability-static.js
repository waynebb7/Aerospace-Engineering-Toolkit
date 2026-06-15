/* Regenerate static HTML fragments: node scripts/gen-traceability-static.js */
'use strict';

var fs = require('fs');
var path = require('path');

var rows = require('../assets/js/pwa-standards-traceability-data.json');

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

function typeClass(type) {
  return 'pwa-trace-badge pwa-trace-badge--type-' + String(type).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

var tbody = rows.map(function (r) {
  return [
    '                  <tr>',
    '                    <th scope="row">' + esc(r.functionName) + '</th>',
    '                    <td>' + esc(r.toolAction) + '</td>',
    '                    <td>' + esc(r.primaryReference) + '</td>',
    '                    <td><span class="' + typeClass(r.referenceType) + '">' + esc(r.referenceType) + '</span></td>',
    '                    <td><span class="' + badgeClass(r.traceabilityLevel) + '">' + esc(r.traceabilityLevel) + '</span></td>',
    '                    <td>' + esc(r.evidenceNotes) + '</td>',
    '                    <td>' + esc(r.userAction) + '</td>',
    '                  </tr>'
  ].join('\n');
}).join('\n');

var outDir = path.join(__dirname);
fs.writeFileSync(path.join(outDir, 'traceability-tbody.fragment.html'), tbody);
fs.writeFileSync(path.join(outDir, 'traceability-json.fragment.html'), JSON.stringify(rows, null, 2));

require('./patch-traceability-html.js');
