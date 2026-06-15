'use strict';

var fs = require('fs');
var path = require('path');

var htmlPath = path.join(__dirname, '../calculators/aerospace-electrical-design/power-wire-analysis.html');
var tbodyPath = path.join(__dirname, 'confidence-tbody.fragment.html');
var jsonPath = path.join(__dirname, 'confidence-json.fragment.html');

var html = fs.readFileSync(htmlPath, 'utf8');
var tbody = fs.readFileSync(tbodyPath, 'utf8');
var json = fs.readFileSync(jsonPath, 'utf8');

var jsonBlock =
  '        <!-- Static confidence rows sync with assets/js/pwa-confidence-rating-data.json -->\n' +
  '        <script type="application/json" id="pwa-confidence-rating-data">\n' +
  json + '\n' +
  '        </script>\n\n';

if (html.indexOf('id="pwa-confidence-rating-data"') === -1) {
  html = html.replace(
    '        <details class="pwa-confidence-rating" id="pwa-confidence-rating">',
    jsonBlock + '        <details class="pwa-confidence-rating" id="pwa-confidence-rating">'
  );
} else {
  html = html.replace(
    /<!-- Static confidence rows sync with assets\/js\/pwa-confidence-rating-data\.json -->\s*<script type="application\/json" id="pwa-confidence-rating-data">[\s\S]*?<\/script>\s*/,
    jsonBlock
  );
}

html = html.replace(
  /<tbody id="pwa-conf-table-body">[\s\S]*?<\/tbody>/,
  '<tbody id="pwa-conf-table-body">\n' + tbody + '\n                </tbody>'
);

var noscriptBlock =
  '            <noscript>\n' +
  '              <p class="pwa-conf-noscript-note">Interactive evidence selectors and live current values require JavaScript. Default confidence ratings are listed in the table below.</p>\n' +
  '              <div class="pwa-conf-summary pwa-conf-summary--static" aria-label="Confidence rating summary">\n' +
  '                <div class="pwa-conf-summary-card"><span class="pwa-conf-summary-card__value">20</span><span class="pwa-conf-summary-card__label">Total items</span></div>\n' +
  '                <div class="pwa-conf-summary-card"><span class="pwa-conf-summary-card__value">0</span><span class="pwa-conf-summary-card__label">A-rated</span></div>\n' +
  '                <div class="pwa-conf-summary-card"><span class="pwa-conf-summary-card__value">7</span><span class="pwa-conf-summary-card__label">B-rated</span></div>\n' +
  '                <div class="pwa-conf-summary-card"><span class="pwa-conf-summary-card__value">3</span><span class="pwa-conf-summary-card__label">C-rated</span></div>\n' +
  '                <div class="pwa-conf-summary-card"><span class="pwa-conf-summary-card__value">10</span><span class="pwa-conf-summary-card__label">D-rated</span></div>\n' +
  '                <div class="pwa-conf-summary-card"><span class="pwa-conf-summary-card__value">0</span><span class="pwa-conf-summary-card__label">E-rated</span></div>\n' +
  '              </div>\n' +
  '            </noscript>\n\n';

if (html.indexOf('pwa-conf-noscript-note') === -1) {
  html = html.replace(
    '            <div class="pwa-conf-overall" id="pwa-conf-overall" aria-live="polite"></div>',
    noscriptBlock + '            <div class="pwa-conf-overall" id="pwa-conf-overall" aria-live="polite"></div>'
  );
}

html = html.replace(
  /pwa-confidence-rating\.js\?v=[\d.]+/,
  'pwa-confidence-rating.js?v=1.0.1'
);

fs.writeFileSync(htmlPath, html);
console.log('Patched', htmlPath);
