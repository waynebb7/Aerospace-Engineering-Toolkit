'use strict';

var fs = require('fs');
var path = require('path');

var rows = require('../assets/js/pwa-validation-library-data.json');

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

var staticList = rows.map(function (r) {
  return '                  <tr>' +
    '<th scope="row">' + esc(r.caseName) + '</th>' +
    '<td>' + esc(r.caseType) + '</td>' +
    '<td><span class="' + badgeClass(r.evidenceQuality) + '">' + esc(r.evidenceQuality) + '</span></td>' +
    '<td>' + esc(r.designAuthorityStatus) + '</td>' +
    '<td>' + esc(r.notes) + '</td>' +
    '</tr>';
}).join('\n');

var staticArticles = rows.map(function (r) {
  return [
    '              <article class="pwa-val-static-detail__case">',
    '                <h4 class="pwa-val-static-detail__case-title">' + esc(r.caseName) + ' <span class="pwa-val-tag">Template</span></h4>',
    '                <dl class="pwa-val-static-detail__case-grid">',
    '                  <div><dt>Case type</dt><dd>' + esc(r.caseType) + '</dd></div>',
    '                  <div><dt>Source reference</dt><dd>' + esc(r.sourceReference) + '</dd></div>',
    '                  <div><dt>Evidence quality</dt><dd><span class="' + badgeClass(r.evidenceQuality) + '">' + esc(r.evidenceQuality) + '</span></dd></div>',
    '                  <div><dt>Design Authority status</dt><dd>' + esc(r.designAuthorityStatus) + '</dd></div>',
    '                  <div><dt>Reference T₂ (°C)</dt><dd>To be populated</dd></div>',
    '                  <div><dt>Reference Advanced Tc (°C)</dt><dd>To be populated</dd></div>',
    '                  <div><dt>Reference transient peak (°C)</dt><dd>To be populated</dd></div>',
    '                  <div><dt>Reference voltage drop (V / %)</dt><dd>To be populated</dd></div>',
    '                  <div><dt>Reference current limit (A)</dt><dd>To be populated</dd></div>',
    '                  <div><dt>Notes</dt><dd>' + esc(r.notes) + '</dd></div>',
    '                  <div><dt>Limitations</dt><dd>' + esc(r.limitations) + '</dd></div>',
    '                </dl>',
    '              </article>'
  ].join('\n');
}).join('\n');

var staticDetail =
  '              <h3 class="pwa-val-static-detail__heading">Template case details</h3>\n' +
  '              <div class="pwa-val-static-detail__cases">\n' +
  staticArticles + '\n' +
  '              </div>\n' +
  '              <h3 class="pwa-val-static-detail__heading">Comparison parameters</h3>\n' +
  '              <ul class="pwa-val-static-detail__list">\n' +
  '                <li>T₂ estimated conductor temperature</li>\n' +
  '                <li>Advanced heat-balance temperature (when enabled)</li>\n' +
  '                <li>Transient peak temperature (when enabled)</li>\n' +
  '                <li>Voltage drop (V and %)</li>\n' +
  '                <li>Current carrying capacity / IMAX</li>\n' +
  '                <li>Ambient temperature, circuit current, run length, bundle count and bundle loading</li>\n' +
  '              </ul>\n' +
  '              <h3 class="pwa-val-static-detail__heading">Evidence quality rating</h3>\n' +
  '              <ul class="pwa-val-static-detail__list">\n' +
  '                <li><span class="pwa-trace-badge pwa-trace-badge--level-a">A</span> Measured test data from controlled conditions</li>\n' +
  '                <li><span class="pwa-trace-badge pwa-trace-badge--level-b">B</span> Manufacturer datasheet or approved project data</li>\n' +
  '                <li><span class="pwa-trace-badge pwa-trace-badge--level-c">C</span> Published engineering reference or recognised benchmark</li>\n' +
  '                <li><span class="pwa-trace-badge pwa-trace-badge--level-d">D</span> Internal engineering estimate</li>\n' +
  '                <li><span class="pwa-trace-badge pwa-trace-badge--level-e">E</span> Unvalidated user-defined case</li>\n' +
  '              </ul>';

var outDir = path.join(__dirname);
fs.writeFileSync(path.join(outDir, 'validation-json.fragment.html'), JSON.stringify(rows, null, 2));
fs.writeFileSync(path.join(outDir, 'validation-static-tbody.fragment.html'), staticList);
fs.writeFileSync(path.join(outDir, 'validation-static-detail.fragment.html'), staticDetail);

require('./patch-validation-html.js');
