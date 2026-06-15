'use strict';

var fs = require('fs');
var path = require('path');

var htmlPath = path.join(__dirname, '../calculators/aerospace-electrical-design/power-wire-analysis.html');
var jsonPath = path.join(__dirname, 'validation-json.fragment.html');
var tbodyPath = path.join(__dirname, 'validation-static-tbody.fragment.html');
var detailPath = path.join(__dirname, 'validation-static-detail.fragment.html');

var html = fs.readFileSync(htmlPath, 'utf8');
var json = fs.readFileSync(jsonPath, 'utf8');
var tbody = fs.readFileSync(tbodyPath, 'utf8');
var staticDetail = fs.readFileSync(detailPath, 'utf8');

var earlyBlockRe =
  /    <!-- Static validation templates sync with assets\/js\/pwa-validation-library-data\.json -->[\s\S]*?<section id="validation-library-static-index"[\s\S]*?<\/section>\r?\n\r?\n/;

if (earlyBlockRe.test(html)) {
  html = html.replace(earlyBlockRe, '');
}

var jsonBlock =
  '        <!-- Static validation templates sync with assets/js/pwa-validation-library-data.json -->\n' +
  '        <script type="application/json" id="pwa-validation-library-data">\n' +
  json + '\n' +
  '        </script>\n\n';

var validationDetailsOpen = '        <details class="pwa-validation-library" id="pwa-validation-library">';

if (html.indexOf('id="pwa-validation-library-data"') === -1) {
  html = html.replace(validationDetailsOpen, jsonBlock + validationDetailsOpen);
} else if (html.indexOf('id="validation-library-static-index"') !== -1) {
  html = html.replace(validationDetailsOpen, jsonBlock + validationDetailsOpen);
} else {
  html = html.replace(
    /<!-- Static validation templates sync with assets\/js\/pwa-validation-library-data\.json -->\s*<script type="application\/json" id="pwa-validation-library-data">[\s\S]*?<\/script>\s*/,
    jsonBlock
  );
}

html = html.replace(
  /<tbody id="pwa-val-static-templates-body">[\s\S]*?<\/tbody>/,
  '<tbody id="pwa-val-static-templates-body">\n' + tbody + '\n                  </tbody>'
);

var detailWrapStart = '            <div class="pwa-val-static-detail" id="pwa-val-static-detail">\n';
var detailWrapEnd = '            </div>\n\n            <div class="pwa-val-controls">';

if (html.indexOf('id="pwa-val-static-detail"') !== -1) {
  html = html.replace(
    /<div class="pwa-val-static-detail" id="pwa-val-static-detail">[\s\S]*?<\/div>\r?\n\r?\n            <div class="pwa-val-controls">/,
    detailWrapStart + staticDetail + detailWrapEnd
  );
} else {
  html = html.replace(
    /            <\/div>\r?\n\r?\n            <div class="pwa-val-controls">/,
    '            </div>\n\n' + detailWrapStart + staticDetail + detailWrapEnd,
    1
  );
}

if (html.indexOf('pwa-validation-library__template-note') === -1) {
  html = html.replace(
    /            <p class="pwa-validation-library__conf-note" role="note">[\s\S]*?<\/p>\r?\n\r?\n            <noscript>/,
    function (match) {
      return match.replace(
        /<\/p>\r?\n\r?\n            <noscript>/,
        '</p>\n            <p class="pwa-validation-library__template-note" role="note">\n' +
          '              Built-in templates below contain no fabricated test results — populate reference values from approved data before formal comparison.\n' +
          '            </p>\n\n            <noscript>'
      );
    }
  );
}

html = html.replace(
  /pwa-validation-library\.js\?v=[\d.]+/,
  'pwa-validation-library.js?v=1.0.1'
);

html = html.replace(
  /href="\.\.\/\.\.\/assets\/css\/corporate\.css\?v=[\d.]+"/,
  'href="../../assets/css/corporate.css?v=2.1.5"'
);

fs.writeFileSync(htmlPath, html);
console.log('Patched', htmlPath);
