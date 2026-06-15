'use strict';

var fs = require('fs');
var path = require('path');

var htmlPath = path.join(__dirname, '../calculators/aerospace-electrical-design/power-wire-analysis.html');
var tbodyPath = path.join(__dirname, 'traceability-tbody.fragment.html');
var jsonPath = path.join(__dirname, 'traceability-json.fragment.html');

var html = fs.readFileSync(htmlPath, 'utf8');
var tbody = fs.readFileSync(tbodyPath, 'utf8');
var json = fs.readFileSync(jsonPath, 'utf8');

var jsonBlock =
  '        <!-- Static matrix rows sync with assets/js/pwa-standards-traceability-data.json -->\n' +
  '        <script type="application/json" id="pwa-standards-traceability-data">\n' +
  json + '\n' +
  '        </script>\n\n';

if (html.indexOf('id="pwa-standards-traceability-data"') === -1) {
  html = html.replace(
    '        <details class="pwa-standards-traceability" id="pwa-standards-traceability">',
    jsonBlock + '        <details class="pwa-standards-traceability" id="pwa-standards-traceability">'
  );
} else {
  html = html.replace(
    /<!-- Static matrix rows sync with assets\/js\/pwa-standards-traceability-data\.json -->\s*<script type="application\/json" id="pwa-standards-traceability-data">[\s\S]*?<\/script>\s*/,
    jsonBlock
  );
}

html = html.replace(
  /<tbody id="pwa-trace-table-body">[\s\S]*?<\/tbody>/,
  '<tbody id="pwa-trace-table-body">\n' + tbody + '\n                </tbody>'
);

var noscriptBlock =
  '            <noscript>\n' +
  '              <p class="pwa-trace-noscript-note">Interactive filters require JavaScript. The full standards traceability matrix is listed in the table below.</p>\n' +
  '              <div class="pwa-trace-summary pwa-trace-summary--static" aria-label="Standards traceability summary">\n' +
  '                <div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">16</span><span class="pwa-trace-summary-card__label">Total traceability items</span></div>\n' +
  '                <div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">0</span><span class="pwa-trace-summary-card__label">Directly standards-based (A)</span></div>\n' +
  '                <div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">5</span><span class="pwa-trace-summary-card__label">Engineering model (C)</span></div>\n' +
  '                <div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">5</span><span class="pwa-trace-summary-card__label">Assumption-driven (D)</span></div>\n' +
  '                <div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">0</span><span class="pwa-trace-summary-card__label">Test / validation required (E)</span></div>\n' +
  '              </div>\n' +
  '            </noscript>\n\n';

if (html.indexOf('pwa-trace-noscript-note') === -1) {
  html = html.replace(
    '            <div class="pwa-trace-summary" id="pwa-trace-summary-cards" aria-live="polite"></div>',
    noscriptBlock + '            <div class="pwa-trace-summary" id="pwa-trace-summary-cards" aria-live="polite"></div>'
  );
}

html = html.replace(
  /pwa-standards-traceability\.js\?v=[\d.]+/,
  'pwa-standards-traceability.js?v=1.0.1'
);

fs.writeFileSync(htmlPath, html);
console.log('Patched', htmlPath);
