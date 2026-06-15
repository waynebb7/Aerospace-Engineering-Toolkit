/**
 * Power Wire Analysis — Validation Library
 * Comparison against reference cases only; does not alter calculator mathematics.
 *
 * Built-in templates load from #pwa-validation-library-data in HTML.
 * Regenerate static HTML: node scripts/gen-validation-static.js
 */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'powerWireValidationLibrary_v1';

  var INTRO_TEXT =
    'This section compares calculator predictions against reference cases, datasheet values, measured test results, ' +
    'or project validation data. It supports model confidence assessment but does not constitute certification ' +
    'approval unless accepted by the applicable Design Authority.';

  var CONFIDENCE_NOTE =
    'Validation Library results can be used to improve confidence ratings where measured or approved reference data is available.';

  var DISCLAIMER_TEXT =
    'Validation cases improve confidence in model behaviour but do not by themselves constitute certification approval. ' +
    'Formal use requires approved data, controlled test evidence, configuration control and Design Authority acceptance.';

  var CASE_TYPES = [
    'Manufacturer Datasheet',
    'Published Reference',
    'Laboratory Test',
    'Aircraft Ground Test',
    'Flight Test',
    'Project-Specific Analysis',
    'Conservative Benchmark',
    'User-Defined Case'
  ];

  var EVIDENCE_LABELS = {
    A: 'Measured test data (controlled conditions)',
    B: 'Manufacturer datasheet or approved project data',
    C: 'Published engineering reference or benchmark',
    D: 'Internal engineering estimate',
    E: 'Unvalidated user-defined case'
  };

  var builtInCases = [];
  var userCases = [];
  var selectedCaseId = '';
  var lastComparison = null;
  var editingUserCaseId = null;

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function num(value, digits) {
    if (value == null || !isFinite(value)) {
      return null;
    }
    return Number(Number(value).toFixed(typeof digits === 'number' ? digits : 3));
  }

  function formatNum(value, digits, suffix) {
    if (value == null || !isFinite(value)) {
      return '—';
    }
    return Number(value).toFixed(typeof digits === 'number' ? digits : 2) + (suffix || '');
  }

  function hasValue(v) {
    return v != null && v !== '' && (typeof v !== 'number' || isFinite(v));
  }

  function loadBuiltInCases() {
    var dataEl = document.getElementById('pwa-validation-library-data');
    if (dataEl && dataEl.textContent) {
      try {
        var parsed = JSON.parse(dataEl.textContent);
        if (Array.isArray(parsed)) {
          return parsed.map(function (c) {
            var copy = Object.assign({}, c);
            copy.isBuiltIn = true;
            return copy;
          });
        }
      } catch (err) {
        /* fall through */
      }
    }
    return [];
  }

  function loadValidationCasesFromStorage() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { userCases: [], selectedCaseId: '' };
      }
      var parsed = JSON.parse(raw);
      return {
        userCases: Array.isArray(parsed.userCases) ? parsed.userCases : [],
        selectedCaseId: parsed.selectedCaseId || ''
      };
    } catch (err) {
      return { userCases: [], selectedCaseId: '' };
    }
  }

  function saveValidationCasesToStorage() {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        userCases: userCases,
        selectedCaseId: selectedCaseId
      }));
    } catch (err) {
      /* ignore */
    }
  }

  function getAllCases() {
    return builtInCases.concat(userCases);
  }

  function getCaseById(id) {
    var cases = getAllCases();
    var i;
    for (i = 0; i < cases.length; i += 1) {
      if (cases[i].id === id) {
        return cases[i];
      }
    }
    return null;
  }

  function getEvidenceBadgeClass(level) {
    return 'pwa-trace-badge pwa-trace-badge--level-' + String(level || 'D').toLowerCase();
  }

  function getCurrentCalculatorValues() {
    var snapshot = global.PwaGridCalculator && PwaGridCalculator.getConfidenceSnapshot
      ? PwaGridCalculator.getConfidenceSnapshot()
      : null;
    var form = document.getElementById('pwa-params-form');
    var values = {
      wireGauge: null,
      wireType: null,
      conductorMaterial: null,
      currentA: null,
      voltageV: null,
      runLengthM: null,
      ambientC: null,
      altitudeFt: null,
      bundleCount: null,
      bundleLoadingPercent: null,
      installationType: null,
      airflowMs: null,
      emissivity: null,
      t2C: null,
      advancedTcC: null,
      transientPeakC: null,
      voltageDropV: null,
      voltageDropPercent: null,
      advancedTcVdropV: null,
      advancedTcVdropPercent: null,
      currentLimitA: null
    };

    if (snapshot && snapshot.params) {
      values.currentA = snapshot.params.circuitCurrent;
      values.ambientC = snapshot.params.ambientTemp;
      values.altitudeFt = snapshot.params.altitudeFt;
      values.bundleCount = snapshot.params.bundleWireCount;
      values.bundleLoadingPercent = snapshot.params.bundleLoadingPct;
      values.runLengthM = snapshot.params.wireLengthM;
      values.voltageV = snapshot.params.generatorLineVoltage;
    }
    if (snapshot && snapshot.assessment) {
      values.wireGauge = snapshot.assessment.worstAwg;
      values.t2C = snapshot.assessment.calculatedT2;
    }
    if (snapshot && snapshot.wireTypeLabel) {
      values.wireType = snapshot.wireTypeLabel;
    }
    if (snapshot && snapshot.worstColumn) {
      values.voltageDropV = snapshot.worstColumn.Vdrop;
      values.currentLimitA = snapshot.worstColumn.Imax;
      if (values.voltageV && values.voltageV > 0) {
        values.voltageDropPercent = (snapshot.worstColumn.Vdrop / values.voltageV) * 100;
      }
    }

    var advTcVdrop = global.PwaAdvancedTcVoltageDrop && PwaAdvancedTcVoltageDrop.getCalculatedValues
      ? PwaAdvancedTcVoltageDrop.getCalculatedValues()
      : null;
    if (advTcVdrop) {
      values.advancedTcVdropV = advTcVdrop.advancedTcVdropV;
      values.advancedTcVdropPercent = advTcVdrop.advancedTcVdropPercent;
    }

    var adv = global.PwaAdvancedThermalUI && PwaAdvancedThermalUI.getExportData
      ? PwaAdvancedThermalUI.getExportData()
      : null;
    if (adv) {
      values.advancedTcC = adv.tcAdvanced;
    }

    var tt = global.PwaTransientThermalUI && PwaTransientThermalUI.getExportData
      ? PwaTransientThermalUI.getExportData()
      : null;
    if (tt && tt.summary) {
      values.transientPeakC = tt.summary.peakTempC;
    }

    var matEl = document.getElementById('pwa-at-material');
    if (matEl) {
      values.conductorMaterial = matEl.value;
    }
    var instEl = document.getElementById('pwa-at-installation-type');
    if (instEl) {
      values.installationType = instEl.value;
    }
    var airEl = document.getElementById('pwa-at-air-velocity');
    if (airEl && airEl.value !== '') {
      values.airflowMs = parseFloat(airEl.value, 10);
    }
    var emEl = document.getElementById('pwa-at-emissivity-preset');
    var emCustom = document.getElementById('pwa-at-emissivity-custom');
    if (emEl) {
      if (emEl.value === 'custom' && emCustom) {
        values.emissivity = parseFloat(emCustom.value, 10);
      } else if (emEl.selectedIndex >= 0) {
        values.emissivity = emEl.options[emEl.selectedIndex].text;
      }
    }

    return values;
  }

  function statusForTemperature(diffC) {
    var d = Math.abs(diffC);
    if (d <= 2) return 'Within 2%';
    if (d <= 5) return 'Within 5%';
    if (d <= 10) return 'Within 10%';
    return 'Outside 10%';
  }

  function statusForPercent(pctError) {
    var d = Math.abs(pctError);
    if (d <= 2) return 'Within 2%';
    if (d <= 5) return 'Within 5%';
    if (d <= 10) return 'Within 10%';
    return 'Outside 10%';
  }

  function buildComparisonRows(caseObj, calc) {
    var rows = [];
    function addRow(label, refVal, calcVal, type, critical) {
      var row = {
        parameter: label,
        referenceValue: refVal,
        calculatorValue: calcVal,
        difference: null,
        percentError: null,
        status: 'Reference missing',
        isCritical: !!critical,
        type: type
      };

      if (!hasValue(refVal)) {
        row.status = 'Reference missing';
      } else if (!hasValue(calcVal)) {
        row.status = 'Calculator value unavailable';
      } else {
        var refNum = Number(refVal);
        var calcNum = Number(calcVal);
        row.difference = num(calcNum - refNum, 3);
        if (type === 'temperature') {
          row.percentError = refNum !== 0 ? num((row.difference / refNum) * 100, 2) : null;
          row.status = statusForTemperature(row.difference);
        } else if (type === 'percent') {
          row.percentError = num(row.difference, 2);
          row.status = statusForPercent(row.difference);
        } else {
          row.percentError = refNum !== 0 ? num((row.difference / refNum) * 100, 2) : null;
          row.status = statusForPercent(row.percentError);
        }
        if (row.difference === 0) {
          row.status = 'Exact / N/A';
        }
      }
      rows.push(row);
    }

    addRow('T₂ conductor temperature (°C)', caseObj.referenceT2C, calc.t2C, 'temperature', true);
    addRow('Advanced heat-balance Tc (°C)', caseObj.referenceAdvancedTcC, calc.advancedTcC, 'temperature', true);
    addRow('Transient peak temperature (°C)', caseObj.referenceTransientPeakC, calc.transientPeakC, 'temperature', true);
    addRow('Voltage drop (V)', caseObj.referenceVoltageDropV, calc.voltageDropV, 'voltage', true);
    addRow('Voltage drop (%)', caseObj.referenceVoltageDropPercent, calc.voltageDropPercent, 'percent', true);
    addRow('Advanced Tc voltage drop (V)', caseObj.referenceAdvancedTcVdropV, calc.advancedTcVdropV, 'voltage', false);
    addRow('Advanced Tc voltage drop (%)', caseObj.referenceAdvancedTcVdropPercent, calc.advancedTcVdropPercent, 'percent', false);
    addRow('Current limit / IMAX (A)', caseObj.referenceCurrentLimitA, calc.currentLimitA, 'current', true);
    addRow('Ambient temperature (°C)', caseObj.ambientC, calc.ambientC, 'temperature', false);
    addRow('Circuit current (A)', caseObj.currentA, calc.currentA, 'current', false);
    addRow('Run length (m)', caseObj.runLengthM, calc.runLengthM, 'current', false);
    addRow('Bundle count', caseObj.bundleCount, calc.bundleCount, 'current', false);
    addRow('Bundle loading (%)', caseObj.bundleLoadingPercent, calc.bundleLoadingPercent, 'percent', false);

    return rows;
  }

  function calculateValidationErrorMetrics(rows) {
    var comparable = rows.filter(function (r) {
      return hasValue(r.referenceValue) && hasValue(r.calculatorValue) && r.difference != null;
    });
    var absDiffs = comparable.map(function (r) { return Math.abs(Number(r.difference)); });
    var absPcts = comparable.filter(function (r) { return r.percentError != null; })
      .map(function (r) { return Math.abs(Number(r.percentError)); });
    var outside = comparable.filter(function (r) {
      return r.status === 'Outside 10%';
    });

    return {
      comparableCount: comparable.length,
      outsideCount: outside.length,
      meanAbsoluteError: absDiffs.length
        ? num(absDiffs.reduce(function (a, b) { return a + b; }, 0) / absDiffs.length, 3)
        : null,
      maxAbsoluteError: absDiffs.length ? num(Math.max.apply(null, absDiffs), 3) : null,
      meanPercentError: absPcts.length
        ? num(absPcts.reduce(function (a, b) { return a + b; }, 0) / absPcts.length, 2)
        : null,
      maxPercentError: absPcts.length ? num(Math.max.apply(null, absPcts), 2) : null
    };
  }

  function hasAnyReferenceValues(caseObj) {
    return [
      caseObj.referenceT2C,
      caseObj.referenceAdvancedTcC,
      caseObj.referenceTransientPeakC,
      caseObj.referenceVoltageDropV,
      caseObj.referenceVoltageDropPercent,
      caseObj.referenceAdvancedTcVdropV,
      caseObj.referenceAdvancedTcVdropPercent,
      caseObj.referenceCurrentLimitA
    ].some(hasValue);
  }

  function classifyValidationConfidence(caseObj, rows, metrics) {
    var eq = caseObj.evidenceQuality || 'E';
    if (!hasAnyReferenceValues(caseObj) || eq === 'E') {
      return {
        label: 'Not Validated',
        detail: 'No reference values populated or evidence quality is unvalidated.'
      };
    }

    var criticalPoor = rows.filter(function (r) {
      return r.isCritical && r.status === 'Outside 10%';
    });
    if (criticalPoor.length) {
      return {
        label: 'Not Validated',
        detail: 'One or more critical parameters are outside tolerance.'
      };
    }

    var anyOutside = metrics.outsideCount > 0;
    var anyReview = rows.some(function (r) {
      return r.status === 'Within 10%' && hasValue(r.referenceValue) && hasValue(r.calculatorValue);
    });

    if ((eq === 'A' || eq === 'B') && !anyOutside) {
      return {
        label: 'Validated',
        detail: 'Evidence quality A/B and no comparable parameter outside tolerance.'
      };
    }
    if ((eq === 'A' || eq === 'B' || eq === 'C') && (anyReview || anyOutside)) {
      return {
        label: 'Partially Validated',
        detail: 'Some parameters require review; no critical parameter grossly outside tolerance.'
      };
    }
    if (eq === 'C' || eq === 'D') {
      return {
        label: 'Indicative Only',
        detail: 'Missing key reference data or indicative evidence quality.'
      };
    }
    return {
      label: 'Not Validated',
      detail: 'Validation criteria not met.'
    };
  }

  function renderValidationWarnings(caseObj, calc) {
    var warnings = [];
    var advEnabled = document.getElementById('pwa-advanced-thermal-enable');
    var ttEnabled = document.getElementById('pwa-transient-enable');

    if (caseObj.wireGauge && calc.wireGauge && String(caseObj.wireGauge) !== String(calc.wireGauge)) {
      warnings.push('Wire gauge differs (case: ' + caseObj.wireGauge + ', calculator: AWG ' + calc.wireGauge + ').');
    }
    if (caseObj.wireType && calc.wireType && caseObj.wireType !== calc.wireType) {
      warnings.push('Wire type differs.');
    }
    if (caseObj.conductorMaterial && calc.conductorMaterial && caseObj.conductorMaterial !== calc.conductorMaterial) {
      warnings.push('Conductor material differs.');
    }
    if (hasValue(caseObj.ambientC) && hasValue(calc.ambientC)) {
      var ambPct = Math.abs((calc.ambientC - caseObj.ambientC) / caseObj.ambientC) * 100;
      if (ambPct > 10) {
        warnings.push('Ambient temperature differs by more than 10%.');
      }
    }
    if (hasValue(caseObj.currentA) && hasValue(calc.currentA)) {
      var curPct = Math.abs((calc.currentA - caseObj.currentA) / caseObj.currentA) * 100;
      if (curPct > 10) {
        warnings.push('Circuit current differs by more than 10%.');
      }
    }
    if (hasValue(caseObj.bundleCount) && hasValue(calc.bundleCount) &&
        Math.abs(caseObj.bundleCount - calc.bundleCount) >= 2) {
      warnings.push('Bundle count differs significantly.');
    }
    if (caseObj.installationType && calc.installationType && caseObj.installationType !== calc.installationType) {
      warnings.push('Installation type differs.');
    }
    if (hasValue(caseObj.referenceAdvancedTcC) && (!advEnabled || !advEnabled.checked)) {
      warnings.push('Advanced model disabled but case includes Advanced Tc reference.');
    }
    if (hasValue(caseObj.referenceTransientPeakC) && (!ttEnabled || !ttEnabled.checked)) {
      warnings.push('Transient model disabled but case includes transient peak reference.');
    }
    if (warnings.length) {
      warnings.unshift('Applicability warning: current calculator setup does not match selected validation case.');
    }
    return warnings;
  }

  function compareCurrentCalculationToValidationCase() {
    var caseObj = getCaseById(selectedCaseId);
    if (!caseObj) {
      lastComparison = null;
      renderValidationLibrary();
      return null;
    }
    var calc = getCurrentCalculatorValues();
    var rows = buildComparisonRows(caseObj, calc);
    var metrics = calculateValidationErrorMetrics(rows);
    var confidence = classifyValidationConfidence(caseObj, rows, metrics);
    var warnings = renderValidationWarnings(caseObj, calc);

    lastComparison = {
      case: caseObj,
      calculator: calc,
      rows: rows,
      metrics: metrics,
      confidence: confidence,
      warnings: warnings,
      comparedAt: new Date().toISOString()
    };
    renderValidationLibrary();
    return lastComparison;
  }

  function renderValidationSummaryCards() {
    var el = document.getElementById('pwa-val-summary');
    if (!el) return;
    var all = getAllCases();
    var templates = builtInCases.length;
    var user = userCases.length;
    el.innerHTML =
      '<div class="pwa-val-summary-card"><span class="pwa-val-summary-card__value">' + all.length + '</span><span class="pwa-val-summary-card__label">Total cases</span></div>' +
      '<div class="pwa-val-summary-card"><span class="pwa-val-summary-card__value">' + templates + '</span><span class="pwa-val-summary-card__label">Built-in templates</span></div>' +
      '<div class="pwa-val-summary-card"><span class="pwa-val-summary-card__value">' + user + '</span><span class="pwa-val-summary-card__label">User-defined cases</span></div>' +
      '<div class="pwa-val-summary-card"><span class="pwa-val-summary-card__value">' +
      (lastComparison ? escapeHtml(lastComparison.confidence.label) : '—') +
      '</span><span class="pwa-val-summary-card__label">Last validation confidence</span></div>';
  }

  function renderValidationCaseSelector() {
    var sel = document.getElementById('pwa-val-case-select');
    if (!sel) return;
    var prev = sel.value;
    sel.innerHTML = '<option value="">— Select validation case —</option>';
    if (builtInCases.length) {
      var og1 = document.createElement('optgroup');
      og1.label = 'Built-in templates';
      builtInCases.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.caseName + (c.isBuiltIn ? ' (template)' : '');
        og1.appendChild(opt);
      });
      sel.appendChild(og1);
    }
    if (userCases.length) {
      var og2 = document.createElement('optgroup');
      og2.label = 'User-defined cases';
      userCases.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.caseName;
        og2.appendChild(opt);
      });
      sel.appendChild(og2);
    }
    sel.value = selectedCaseId || prev || '';
  }

  function renderValidationCaseDetails(caseObj) {
    var el = document.getElementById('pwa-val-case-details');
    if (!el) {
      return;
    }
    if (!caseObj) {
      el.innerHTML = '<p class="pwa-val-empty">Select a validation case to view details.</p>';
      return;
    }

    var badge = '<span class="' + getEvidenceBadgeClass(caseObj.evidenceQuality) + '">' +
      escapeHtml(caseObj.evidenceQuality) + '</span> ' +
      escapeHtml(EVIDENCE_LABELS[caseObj.evidenceQuality] || '');

    el.innerHTML =
      '<div class="pwa-val-details">' +
      '<h4 class="pwa-val-details__title">' + escapeHtml(caseObj.caseName) +
      (caseObj.isBuiltIn ? ' <span class="pwa-val-tag">Template</span>' : '') + '</h4>' +
      '<dl class="pwa-val-details__grid">' +
      detailRow('Case type', caseObj.caseType) +
      detailRow('Source reference', caseObj.sourceReference) +
      detailRow('Evidence quality', badge) +
      detailRow('Design Authority status', caseObj.designAuthorityStatus) +
      detailRow('Notes', caseObj.notes) +
      detailRow('Limitations', caseObj.limitations) +
      '</dl></div>';
  }

  function detailRow(label, value) {
    return '<div><dt>' + escapeHtml(label) + '</dt><dd>' +
      (value == null || value === '' ? '—' : value) + '</dd></div>';
  }

  function statusClass(status) {
    if (status === 'Within 2%' || status === 'Exact / N/A') return 'pwa-val-status--good';
    if (status === 'Within 5%') return 'pwa-val-status--ok';
    if (status === 'Within 10%') return 'pwa-val-status--review';
    if (status === 'Reference missing' || status === 'Calculator value unavailable') {
      return 'pwa-val-status--na';
    }
    return 'pwa-val-status--poor';
  }

  function renderValidationComparisonTable() {
    var tbody = document.getElementById('pwa-val-compare-body');
    if (!tbody) return;
    if (!lastComparison || !lastComparison.rows.length) {
      tbody.innerHTML = '';
      return;
    }
    tbody.innerHTML = lastComparison.rows.map(function (row) {
      return '<tr>' +
        '<th scope="row">' + escapeHtml(row.parameter) + '</th>' +
        '<td>' + (hasValue(row.referenceValue) ? escapeHtml(String(row.referenceValue)) : '—') + '</td>' +
        '<td>' + (hasValue(row.calculatorValue) ? escapeHtml(String(num(row.calculatorValue, 3))) : '—') + '</td>' +
        '<td>' + (row.difference != null ? escapeHtml(String(row.difference)) : '—') + '</td>' +
        '<td>' + (row.percentError != null ? escapeHtml(String(row.percentError) + '%') : '—') + '</td>' +
        '<td><span class="pwa-val-status ' + statusClass(row.status) + '">' + escapeHtml(row.status) + '</span></td>' +
        '</tr>';
    }).join('');
  }

  function renderErrorMetrics() {
    var el = document.getElementById('pwa-val-metrics');
    if (!el) return;
    if (!lastComparison) {
      el.innerHTML = '';
      return;
    }
    var m = lastComparison.metrics;
    var c = lastComparison.confidence;
    el.innerHTML =
      '<div class="pwa-val-metrics">' +
      metricCard('Mean absolute error', m.meanAbsoluteError != null ? String(m.meanAbsoluteError) : '—') +
      metricCard('Maximum absolute error', m.maxAbsoluteError != null ? String(m.maxAbsoluteError) : '—') +
      metricCard('Mean percentage error', m.meanPercentError != null ? m.meanPercentError + '%' : '—') +
      metricCard('Maximum percentage error', m.maxPercentError != null ? m.maxPercentError + '%' : '—') +
      metricCard('Comparable parameters', String(m.comparableCount)) +
      metricCard('Outside tolerance', String(m.outsideCount)) +
      metricCard('Evidence quality', lastComparison.case.evidenceQuality) +
      metricCard('Validation confidence', c.label) +
      '</div>' +
      '<p class="pwa-val-confidence-detail">' + escapeHtml(c.detail) + '</p>';
  }

  function metricCard(label, value) {
    return '<div class="pwa-val-metric-card"><span class="pwa-val-metric-card__value">' +
      escapeHtml(value) + '</span><span class="pwa-val-metric-card__label">' + escapeHtml(label) + '</span></div>';
  }

  function renderValidationWarningsPanel() {
    var el = document.getElementById('pwa-val-warnings');
    if (!el) return;
    if (!lastComparison || !lastComparison.warnings.length) {
      el.hidden = true;
      el.innerHTML = '';
      return;
    }
    el.hidden = false;
    el.innerHTML = lastComparison.warnings.map(function (w) {
      return '<p class="pwa-val-warning">' + escapeHtml(w) + '</p>';
    }).join('');
  }

  function readFormCase() {
    function val(id) {
      var el = document.getElementById(id);
      if (!el || el.value === '') return null;
      if (el.type === 'number') {
        var n = parseFloat(el.value, 10);
        return isFinite(n) ? n : null;
      }
      return el.value;
    }
    return {
      caseName: val('pwa-val-form-name') || 'User validation case',
      caseType: val('pwa-val-form-type') || 'User-Defined Case',
      sourceReference: val('pwa-val-form-source') || '',
      evidenceQuality: val('pwa-val-form-evidence') || 'E',
      wireGauge: val('pwa-val-form-gauge') || '',
      wireType: val('pwa-val-form-wire-type') || '',
      conductorMaterial: val('pwa-val-form-material') || '',
      currentA: val('pwa-val-form-current'),
      voltageV: val('pwa-val-form-voltage'),
      runLengthM: val('pwa-val-form-length'),
      ambientC: val('pwa-val-form-ambient'),
      altitudeFt: val('pwa-val-form-altitude'),
      bundleCount: val('pwa-val-form-bundle-count'),
      bundleLoadingPercent: val('pwa-val-form-bundle-load'),
      installationType: val('pwa-val-form-installation') || '',
      airflowMs: val('pwa-val-form-airflow'),
      emissivity: val('pwa-val-form-emissivity'),
      dutyCyclePercent: val('pwa-val-form-duty'),
      durationMin: val('pwa-val-form-duration'),
      referenceT2C: val('pwa-val-form-ref-t2'),
      referenceAdvancedTcC: val('pwa-val-form-ref-adv'),
      referenceTransientPeakC: val('pwa-val-form-ref-transient'),
      referenceVoltageDropV: val('pwa-val-form-ref-vdrop'),
      referenceVoltageDropPercent: val('pwa-val-form-ref-vdrop-pct'),
      referenceAdvancedTcVdropV: val('pwa-val-form-ref-adv-vdrop'),
      referenceAdvancedTcVdropPercent: val('pwa-val-form-ref-adv-vdrop-pct'),
      referenceCurrentLimitA: val('pwa-val-form-ref-current'),
      notes: val('pwa-val-form-notes') || '',
      limitations: val('pwa-val-form-limitations') || '',
      designAuthorityStatus: val('pwa-val-form-da-status') || '',
      createdBy: val('pwa-val-form-created-by') || 'User',
      dateAdded: new Date().toISOString().slice(0, 10)
    };
  }

  function populateFormFromCase(caseObj) {
    function set(id, value) {
      var el = document.getElementById(id);
      if (!el) return;
      el.value = value == null ? '' : value;
    }
    if (!caseObj) return;
    set('pwa-val-form-name', caseObj.caseName);
    set('pwa-val-form-type', caseObj.caseType);
    set('pwa-val-form-source', caseObj.sourceReference);
    set('pwa-val-form-evidence', caseObj.evidenceQuality);
    set('pwa-val-form-gauge', caseObj.wireGauge);
    set('pwa-val-form-wire-type', caseObj.wireType);
    set('pwa-val-form-material', caseObj.conductorMaterial);
    set('pwa-val-form-current', caseObj.currentA);
    set('pwa-val-form-voltage', caseObj.voltageV);
    set('pwa-val-form-length', caseObj.runLengthM);
    set('pwa-val-form-ambient', caseObj.ambientC);
    set('pwa-val-form-altitude', caseObj.altitudeFt);
    set('pwa-val-form-bundle-count', caseObj.bundleCount);
    set('pwa-val-form-bundle-load', caseObj.bundleLoadingPercent);
    set('pwa-val-form-installation', caseObj.installationType);
    set('pwa-val-form-airflow', caseObj.airflowMs);
    set('pwa-val-form-emissivity', caseObj.emissivity);
    set('pwa-val-form-duty', caseObj.dutyCyclePercent);
    set('pwa-val-form-duration', caseObj.durationMin);
    set('pwa-val-form-ref-t2', caseObj.referenceT2C);
    set('pwa-val-form-ref-adv', caseObj.referenceAdvancedTcC);
    set('pwa-val-form-ref-transient', caseObj.referenceTransientPeakC);
    set('pwa-val-form-ref-vdrop', caseObj.referenceVoltageDropV);
    set('pwa-val-form-ref-vdrop-pct', caseObj.referenceVoltageDropPercent);
    set('pwa-val-form-ref-adv-vdrop', caseObj.referenceAdvancedTcVdropV);
    set('pwa-val-form-ref-adv-vdrop-pct', caseObj.referenceAdvancedTcVdropPercent);
    set('pwa-val-form-ref-current', caseObj.referenceCurrentLimitA);
    set('pwa-val-form-notes', caseObj.notes);
    set('pwa-val-form-limitations', caseObj.limitations);
    set('pwa-val-form-da-status', caseObj.designAuthorityStatus);
    set('pwa-val-form-created-by', caseObj.createdBy);
  }

  function saveUserCaseFromForm() {
    var data = readFormCase();
    var id = editingUserCaseId || ('user-' + Date.now());
    data.id = id;
    data.isBuiltIn = false;
    var idx = -1;
    userCases.forEach(function (c, i) {
      if (c.id === id) idx = i;
    });
    if (idx >= 0) {
      userCases[idx] = data;
    } else {
      userCases.push(data);
    }
    editingUserCaseId = id;
    selectedCaseId = id;
    saveValidationCasesToStorage();
    renderValidationLibrary();
  }

  function deleteSelectedUserCase() {
    var caseObj = getCaseById(selectedCaseId);
    if (!caseObj || caseObj.isBuiltIn) {
      return;
    }
    userCases = userCases.filter(function (c) { return c.id !== selectedCaseId; });
    selectedCaseId = '';
    lastComparison = null;
    editingUserCaseId = null;
    saveValidationCasesToStorage();
    renderValidationLibrary();
  }

  function resetBuiltInTemplates() {
    if (!global.confirm('Reset will remove all user-defined validation cases. Built-in templates cannot be modified. Continue?')) {
      return;
    }
    userCases = [];
    selectedCaseId = '';
    lastComparison = null;
    editingUserCaseId = null;
    saveValidationCasesToStorage();
    renderValidationLibrary();
  }

  function loadValidationCaseIntoCalculator() {
    var caseObj = getCaseById(selectedCaseId);
    if (!caseObj) return;
    if (!global.confirm('Loading this case will overwrite current calculator input fields. Continue?')) {
      return;
    }
    var form = document.getElementById('pwa-params-form');
    if (!form) return;

    function setNum(name, value) {
      if (!hasValue(value) || !form.elements[name]) return;
      form.elements[name].value = value;
    }

    setNum('circuitCurrent', caseObj.currentA);
    setNum('ambientTemp', caseObj.ambientC);
    setNum('bundleWireCount', caseObj.bundleCount);
    if (hasValue(caseObj.runLengthM)) {
      form.elements.wireLength.value = caseObj.runLengthM;
      form.elements.wireLengthUnit.value = 'm';
    }
    if (hasValue(caseObj.bundleLoadingPercent) && form.elements.bundleLoadingPct) {
      form.elements.bundleLoadingPct.value = String(caseObj.bundleLoadingPercent);
    }
    if (hasValue(caseObj.altitudeFt) && form.elements.altitudeFt) {
      form.elements.altitudeFt.value = String(caseObj.altitudeFt);
    }
    if (hasValue(caseObj.voltageV)) {
      var preset = form.elements.generatorLineVoltagePreset;
      var custom = document.getElementById('pwa-voltage-custom');
      var found = false;
      if (preset) {
        var i;
        for (i = 0; i < preset.options.length; i += 1) {
          if (parseFloat(preset.options[i].value, 10) === caseObj.voltageV) {
            preset.value = preset.options[i].value;
            found = true;
            break;
          }
        }
      }
      if (!found && custom) {
        preset.value = 'custom';
        custom.value = caseObj.voltageV;
        document.getElementById('pwa-voltage-custom-wrap').hidden = false;
      }
    }

    if (hasValue(caseObj.airflowMs)) {
      var air = document.getElementById('pwa-at-air-velocity');
      if (air) air.value = caseObj.airflowMs;
    }
    if (caseObj.installationType) {
      var inst = document.getElementById('pwa-at-installation-type');
      if (inst) inst.value = caseObj.installationType;
    }
    if (caseObj.conductorMaterial) {
      var mat = document.getElementById('pwa-at-material');
      if (mat) mat.value = caseObj.conductorMaterial;
    }

    if (global.PwaGridCalculator && typeof PwaGridCalculator.triggerRecalc === 'function') {
      PwaGridCalculator.triggerRecalc();
    }
    form.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function exportValidationCasesJson() {
    var blob = new Blob([JSON.stringify({ userCases: userCases }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'power-wire-validation-cases.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importValidationCasesJson(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        if (Array.isArray(parsed)) {
          userCases = parsed;
        } else if (parsed && Array.isArray(parsed.userCases)) {
          userCases = parsed.userCases;
        }
        userCases = userCases.map(function (c) {
          c.isBuiltIn = false;
          if (!c.id) c.id = 'user-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
          return c;
        });
        saveValidationCasesToStorage();
        renderValidationLibrary();
      } catch (err) {
        global.alert('Could not import validation cases JSON.');
      }
    };
    reader.readAsText(file);
  }

  function suggestConfidenceImprovements() {
    if (!lastComparison || lastComparison.confidence.label !== 'Validated') {
      global.alert('Confidence improvements are suggested only when validation confidence is Validated with evidence quality A or B.');
      return;
    }
    var eq = lastComparison.case.evidenceQuality;
    if (eq !== 'A' && eq !== 'B') {
      global.alert('Evidence quality must be A or B to suggest confidence rating improvements.');
      return;
    }
    if (!global.PwaConfidenceRating || !PwaConfidenceRating.applyConfidenceSuggestion) {
      global.alert('Confidence Rating System is not available.');
      return;
    }
    var suggestions = [];
    if (hasValue(lastComparison.case.referenceT2C)) {
      suggestions.push({ id: 't2-estimate', rating: 'B', evidence: eq === 'A' ? 'Test / Measured Data' : 'Manufacturer Datasheet' });
    }
    if (hasValue(lastComparison.case.referenceAdvancedTcC)) {
      suggestions.push({ id: 'advanced-tc', rating: eq === 'A' ? 'A' : 'B', evidence: eq === 'A' ? 'Test / Measured Data' : 'Approved Load Analysis' });
    }
    if (hasValue(lastComparison.case.referenceTransientPeakC)) {
      suggestions.push({ id: 'transient-model', rating: eq === 'A' ? 'A' : 'B', evidence: eq === 'A' ? 'Test / Measured Data' : 'Approved Load Analysis' });
    }
    if (hasValue(lastComparison.case.referenceVoltageDropV)) {
      suggestions.push({ id: 'voltage-drop', rating: eq === 'A' ? 'A' : 'B', evidence: eq === 'A' ? 'Test / Measured Data' : 'Manufacturer Datasheet' });
    }
    if (!suggestions.length) {
      global.alert('No applicable confidence improvements for the current comparison.');
      return;
    }
    var msg = 'Apply the following confidence rating improvements?\n\n' +
      suggestions.map(function (s) { return s.id + ' → ' + s.rating + ' (' + s.evidence + ')'; }).join('\n');
    if (!global.confirm(msg)) return;
    suggestions.forEach(function (s) {
      PwaConfidenceRating.applyConfidenceSuggestion(s.id, s.rating, s.evidence);
    });
  }

  function isIncludeInReport() {
    var el = document.getElementById('pwa-val-include-report');
    return !el || el.checked;
  }

  function buildValidationReportSection() {
    if (!isIncludeInReport()) {
      return null;
    }
    if (!lastComparison) {
      return {
        title: 'Validation Library',
        intro: INTRO_TEXT,
        disclaimer: DISCLAIMER_TEXT,
        noCaseSelected: true,
        message: 'No validation case selected or compared.'
      };
    }
    return {
      title: 'Validation Library',
      subtitle: 'Comparison Against Reference Cases and Test Evidence',
      intro: INTRO_TEXT,
      disclaimer: DISCLAIMER_TEXT,
      confidenceNote: CONFIDENCE_NOTE,
      case: lastComparison.case,
      comparison: lastComparison,
      metrics: lastComparison.metrics,
      confidence: lastComparison.confidence,
      warnings: lastComparison.warnings,
      rows: lastComparison.rows
    };
  }

  function renderValidationLibrary() {
    renderValidationSummaryCards();
    renderValidationCaseSelector();
    renderValidationCaseDetails(getCaseById(selectedCaseId));
    renderValidationComparisonTable();
    renderErrorMetrics();
    renderValidationWarningsPanel();
  }

  function bindEvents() {
    var sel = document.getElementById('pwa-val-case-select');
    if (sel) {
      sel.addEventListener('change', function () {
        selectedCaseId = sel.value;
        lastComparison = null;
        editingUserCaseId = sel.value && !getCaseById(sel.value).isBuiltIn ? sel.value : null;
        if (selectedCaseId) {
          populateFormFromCase(getCaseById(selectedCaseId));
        }
        saveValidationCasesToStorage();
        renderValidationLibrary();
      });
    }

    var compareBtn = document.getElementById('pwa-val-compare-btn');
    if (compareBtn) {
      compareBtn.addEventListener('click', compareCurrentCalculationToValidationCase);
    }
    var loadBtn = document.getElementById('pwa-val-load-btn');
    if (loadBtn) {
      loadBtn.addEventListener('click', loadValidationCaseIntoCalculator);
    }
    var saveBtn = document.getElementById('pwa-val-save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', saveUserCaseFromForm);
    }
    var deleteBtn = document.getElementById('pwa-val-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', deleteSelectedUserCase);
    }
    var resetBtn = document.getElementById('pwa-val-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetBuiltInTemplates);
    }
    var exportBtn = document.getElementById('pwa-val-export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportValidationCasesJson);
    }
    var importInput = document.getElementById('pwa-val-import-file');
    if (importInput) {
      importInput.addEventListener('change', function () {
        if (importInput.files && importInput.files[0]) {
          importValidationCasesJson(importInput.files[0]);
          importInput.value = '';
        }
      });
    }
    var suggestBtn = document.getElementById('pwa-val-suggest-confidence-btn');
    if (suggestBtn) {
      suggestBtn.addEventListener('click', suggestConfidenceImprovements);
    }
  }

  function initValidationLibrary() {
    builtInCases = loadBuiltInCases();
    var stored = loadValidationCasesFromStorage();
    userCases = stored.userCases;
    selectedCaseId = stored.selectedCaseId;
    if (selectedCaseId && !getCaseById(selectedCaseId)) {
      selectedCaseId = '';
    }
    bindEvents();
    renderValidationLibrary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initValidationLibrary);
  } else {
    initValidationLibrary();
  }

  global.PwaValidationLibrary = {
    STORAGE_KEY: STORAGE_KEY,
    initValidationLibrary: initValidationLibrary,
    loadValidationCasesFromStorage: loadValidationCasesFromStorage,
    saveValidationCasesToStorage: saveValidationCasesToStorage,
    renderValidationLibrary: renderValidationLibrary,
    compareCurrentCalculationToValidationCase: compareCurrentCalculationToValidationCase,
    calculateValidationErrorMetrics: calculateValidationErrorMetrics,
    classifyValidationConfidence: classifyValidationConfidence,
    loadValidationCaseIntoCalculator: loadValidationCaseIntoCalculator,
    exportValidationCasesJson: exportValidationCasesJson,
    importValidationCasesJson: importValidationCasesJson,
    buildValidationReportSection: buildValidationReportSection,
    getExportData: buildValidationReportSection,
    isIncludeInReport: isIncludeInReport,
    getAllCases: getAllCases
  };
})(typeof window !== 'undefined' ? window : this);
