/**
 * Transient Thermal Analysis — UI, charts, and export hooks.
 * Does not modify advanced thermal or primary calculator logic.
 */
(function (global) {
  'use strict';

  var lastResult = null;
  var bound = false;

  function $(id) {
    return document.getElementById(id);
  }

  function num(v, d) {
    return global.PwaTransientThermal ? PwaTransientThermal.round(v, d) : v;
  }

  function isEnabled() {
    var el = $('pwa-transient-enable');
    return !!(el && el.checked);
  }

  function setBodyVisible(show) {
    var body = $('pwa-transient-body');
    if (body) body.hidden = !show;
  }

  function readPresetValue(presetEl, customEl, presets) {
    if (!presetEl) return null;
    if (presetEl.value === 'custom' && customEl) {
      return parseFloat(customEl.value, 10);
    }
    var p = presets[presetEl.value];
    return p && p.value != null ? p.value : null;
  }

  function pickWorstT2Column(cols) {
    var worst = null;
    var i;
    for (i = 0; i < cols.length; i += 1) {
      if (typeof cols[i].T2 === 'number' && isFinite(cols[i].T2)) {
        if (!worst || cols[i].T2 > worst.T2) worst = cols[i];
      }
    }
    return worst;
  }

  function findWireRow(wireTypeId, awg) {
    if (!global.PwaWireCatalog) return null;
    var rows = PwaWireCatalog.getWireRows(wireTypeId);
    var i;
    for (i = 0; i < rows.length; i += 1) {
      if (rows[i].label === awg) return rows[i];
    }
    return null;
  }

  function readBaseThermalInputs(params, visibleColumns) {
    var AT = global.PwaAdvancedThermal;
    if (!AT) return null;
    var worst = pickWorstT2Column(visibleColumns);
    if (!worst) return null;

    var wireTypeEl = document.querySelector('#pwa-params-form [name="wireType"]');
    var wireTypeId = wireTypeEl ? wireTypeEl.value : params.wireTypeId;
    var wireRow = findWireRow(wireTypeId, worst.awg);
    var wireType = PwaWireCatalog ? PwaWireCatalog.getWireType(wireTypeId) : null;
    var atConservative = $('pwa-at-conservative') && $('pwa-at-conservative').checked;
    var ttConservative = $('pwa-tt-cert-mode') && $('pwa-tt-cert-mode').checked;
    var conservative = atConservative || ttConservative;
    var adjacentOverride = $('pwa-at-adjacent-override');

    function adjacentWires() {
      if (conservative) {
        return Math.max(params.bundleWireCount, AT.estimateAdjacentLoadedWires(
          params.bundleWireCount, params.bundleLoadingPct));
      }
      if (adjacentOverride && adjacentOverride.checked && $('pwa-at-adjacent-manual')) {
        return parseInt($('pwa-at-adjacent-manual').value, 10);
      }
      return AT.estimateAdjacentLoadedWires(params.bundleWireCount, params.bundleLoadingPct);
    }

    return {
      awg: worst.awg,
      wireTypeLabel: wireType ? wireType.label : wireTypeId,
      currentA: params.circuitCurrent,
      r20Ohms: (worst.R1000 / 1000) * params.wireLengthFt,
      ambientTempC: params.ambientTemp,
      altitudeFt: params.altitudeFt,
      runLengthM: params.wireLengthM,
      conductorRatingC: params.conductorTempRating,
      installationLimitC: params.applyInstallationTempLimit ? params.installationTempLimit : null,
      existingT2C: worst.T2,
      conductorDiaMm: wireRow ? wireRow.conductorNomDiaMm : 1.0,
      odAvgMm: wireRow ? (wireRow.odMinMm + wireRow.odMaxMm) / 2 : 2,
      material: $('pwa-at-material') ? $('pwa-at-material').value : 'copper',
      installationType: $('pwa-at-installation-type') ? $('pwa-at-installation-type').value : 'bundledHarness',
      airVelocityMs: conservative ? 0 : parseFloat(($('pwa-at-air-velocity') || {}).value, 10) || 0,
      wirePosition: conservative ? 'centre' : (($('pwa-at-wire-position') || {}).value || 'centre'),
      adjacentLoadedWires: adjacentWires(),
      emissivity: readPresetValue($('pwa-at-emissivity-preset'), $('pwa-at-emissivity-custom'), AT.EMISSIVITY_PRESETS) || 0.8,
      insulationK: readPresetValue($('pwa-at-insulation-k-preset'), $('pwa-at-insulation-k-custom'), AT.INSULATION_K_PRESETS) || 0.2,
      hotSurfaceTempC: parseFloat(($('pwa-at-hot-surface') || {}).value, 10) || params.ambientTemp,
      thermalContact: conservative ? 'none' : (($('pwa-at-thermal-contact') || {}).value || 'none'),
      materialDensityOverride: $('pwa-tt-density-override') && $('pwa-tt-density-override').checked
        ? parseFloat($('pwa-tt-density').value, 10) : 0,
      materialCpOverride: $('pwa-tt-cp-override') && $('pwa-tt-cp-override').checked
        ? parseFloat($('pwa-tt-cp').value, 10) : 0
    };
  }

  function readCustomSchedule() {
    var rows = document.querySelectorAll('#pwa-tt-schedule-body tr');
    var schedule = [];
    rows.forEach(function (tr) {
      var start = parseFloat(tr.querySelector('[data-field="start"]').value, 10);
      var end = parseFloat(tr.querySelector('[data-field="end"]').value, 10);
      var current = parseFloat(tr.querySelector('[data-field="current"]').value, 10);
      if (isFinite(start) && isFinite(end) && end > start && isFinite(current)) {
        schedule.push({ startSec: start * 60, endSec: end * 60, currentA: current });
      }
    });
    return schedule;
  }

  function readProfile() {
    var typeEl = $('pwa-tt-profile-type');
    var type = typeEl ? typeEl.value : 'constant';
    if (type === 'singlePulse') {
      return {
        type: type,
        pulseCurrentA: parseFloat($('pwa-tt-pulse-current').value, 10),
        durationSec: parseFloat($('pwa-tt-pulse-duration').value, 10),
        startSec: parseFloat($('pwa-tt-pulse-start').value, 10) * 60
      };
    }
    if (type === 'repeatingPulse') {
      return {
        type: type,
        pulseCurrentA: parseFloat($('pwa-tt-rp-current').value, 10),
        durationSec: parseFloat($('pwa-tt-rp-duration').value, 10),
        periodSec: parseFloat($('pwa-tt-rp-period').value, 10) * 60,
        cycles: parseInt($('pwa-tt-rp-cycles').value, 10)
      };
    }
    if (type === 'dutyCycle') {
      return {
        type: type,
        peakCurrentA: parseFloat($('pwa-tt-dc-peak').value, 10),
        dutyPct: parseFloat($('pwa-tt-dc-duty').value, 10),
        periodSec: parseFloat($('pwa-tt-dc-period').value, 10) * 60
      };
    }
    if (type === 'customSchedule') {
      return { type: type, schedule: readCustomSchedule() };
    }
    if (type === 'missionProfile') {
      var key = $('pwa-tt-mission-profile') ? $('pwa-tt-mission-profile').value : 'taxi';
      var mp = PwaTransientThermal.MISSION_PROFILES[key];
      return { type: 'missionProfile', segments: mp ? mp.segments : [] };
    }
    return { type: 'constant' };
  }

  function buildConfig(params, visibleColumns) {
    var base = readBaseThermalInputs(params, visibleColumns);
    if (!base) return null;

    var certEl = $('pwa-tt-cert-mode');
    if (certEl && certEl.checked) {
      base.airVelocityMs = 0;
      base.wirePosition = 'centre';
      base.thermalContact = 'none';
      base.emissivity = Math.min(base.emissivity, 0.75);
    }

    return {
      baseInputs: base,
      transient: {
        durationMin: parseFloat($('pwa-tt-duration').value, 10) || 60,
        timestepSec: parseInt($('pwa-tt-timestep').value, 10) || 1,
        integrator: 'rk4',
        initialTempMode: $('pwa-tt-initial-mode') ? $('pwa-tt-initial-mode').value : 'ambient',
        initialTempCustom: parseFloat($('pwa-tt-initial-custom').value, 10),
        profile: readProfile(),
        sensitivityEnabled: $('pwa-tt-sensitivity-enable') && $('pwa-tt-sensitivity-enable').checked,
        certMode: !!(certEl && certEl.checked)
      }
    };
  }

  function setText(id, text) {
    var el = $(id);
    if (el) el.textContent = text == null ? '—' : String(text);
  }

  function renderWarnings(warnings) {
    var panel = $('pwa-tt-warnings');
    if (!panel) return;
    if (!warnings || !warnings.length) {
      panel.hidden = true;
      panel.innerHTML = '';
      return;
    }
    panel.hidden = false;
    panel.innerHTML = warnings.map(function (w) {
      return '<p class="pwa-at-warn">' + w + '</p>';
    }).join('');
  }

  function drawLineChart(canvas, seriesList, options) {
    if (!canvas || !seriesList.length) return;
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(rect.width, 280);
    var h = Math.max(rect.height, 180);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    var pad = { top: 16, right: 12, bottom: 28, left: 44 };
    var plotW = w - pad.left - pad.right;
    var plotH = h - pad.top - pad.bottom;
    var xMin = options.xMin || 0;
    var xMax = options.xMax || 1;
    var yMin = options.yMin;
    var yMax = options.yMax;

    if (yMin == null || yMax == null) {
      yMin = Infinity;
      yMax = -Infinity;
      seriesList.forEach(function (series) {
        series.points.forEach(function (p) {
          yMin = Math.min(yMin, p.y);
          yMax = Math.max(yMax, p.y);
        });
      });
      if (!isFinite(yMin)) { yMin = 0; yMax = 1; }
      var yPad = (yMax - yMin) * 0.08 || 5;
      yMin -= yPad;
      yMax += yPad;
    }

    function xPx(x) { return pad.left + ((x - xMin) / (xMax - xMin || 1)) * plotW; }
    function yPx(y) { return pad.top + plotH - ((y - yMin) / (yMax - yMin || 1)) * plotH; }

    ctx.strokeStyle = '#dde4ec';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.lineTo(pad.left + plotW, pad.top + plotH);
    ctx.stroke();

    if (options.referenceLines) {
      options.referenceLines.forEach(function (ref) {
        ctx.strokeStyle = ref.color || '#94a3b8';
        ctx.setLineDash(ref.dash || [4, 4]);
        ctx.beginPath();
        ctx.moveTo(pad.left, yPx(ref.y));
        ctx.lineTo(pad.left + plotW, yPx(ref.y));
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    seriesList.forEach(function (series) {
      if (!series.points.length) return;
      ctx.strokeStyle = series.color || '#1d4ed8';
      ctx.lineWidth = series.width || 2;
      ctx.beginPath();
      series.points.forEach(function (p, idx) {
        var px = xPx(p.x);
        var py = yPx(p.y);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.fillText(options.xLabel || 'Time (min)', pad.left, h - 8);
  }

  function renderCharts(result) {
    if (!result || !result.chartSeries) return;
    var cs = result.chartSeries;
    var rating = result.config.baseInputs.conductorRatingC;
    var install = result.config.baseInputs.installationLimitC;
    var tamb = result.config.baseInputs.ambientTempC;
    var refs = [{ y: tamb, color: '#64748b', dash: [2, 3] }, { y: rating, color: '#b91c1c', dash: [6, 4] }];
    if (install != null) refs.push({ y: install, color: '#b45309', dash: [6, 4] });

    drawLineChart($('pwa-tt-chart-temp'), [{
      color: '#1d4ed8',
      points: cs.map(function (p) { return { x: p.tSec / 60, y: p.tempC }; })
    }], { xMin: 0, xMax: result.durationMin, xLabel: 'Time (min)', yLabel: 'Temperature (°C)', referenceLines: refs });

    drawLineChart($('pwa-tt-chart-heat'), [
      { color: '#dc2626', points: cs.map(function (p) { return { x: p.tSec / 60, y: p.qGenW || 0 }; }) },
      { color: '#059669', points: cs.map(function (p) { return { x: p.tSec / 60, y: p.qLossW || 0 }; }) },
      { color: '#7c3aed', width: 1.5, points: cs.map(function (p) {
        return { x: p.tSec / 60, y: p.qNetW || ((p.qGenW || 0) - (p.qLossW || 0)) };
      }) }
    ], { xMin: 0, xMax: result.durationMin, xLabel: 'Time (min)', yLabel: 'Heat (W)' });

    drawLineChart($('pwa-tt-chart-current'), [{
      color: '#0f766e',
      points: cs.map(function (p) { return { x: p.tSec / 60, y: p.currentA }; })
    }], { xMin: 0, xMax: result.durationMin, xLabel: 'Time (min)', yLabel: 'Current (A)' });
  }

  function renderResults(result) {
    if (!result || result.error) {
      setText('pwa-tt-status', '—');
      renderWarnings(result ? [result.error].concat(result.warnings || []) : []);
      return;
    }
    var s = result.summary;
    setText('pwa-tt-peak-temp', num(s.peakTempC, 2));
    setText('pwa-tt-peak-time', s.peakTimeFormatted);
    setText('pwa-tt-time-rating', s.timeToRatingFormatted);
    setText('pwa-tt-time-install', s.timeToInstallFormatted);
    setText('pwa-tt-cool-90', s.coolDownSec.pct90 != null ? PwaTransientThermal.formatDuration(s.coolDownSec.pct90) : '—');
    setText('pwa-tt-cool-75', s.coolDownSec.pct75 != null ? PwaTransientThermal.formatDuration(s.coolDownSec.pct75) : '—');
    setText('pwa-tt-cool-50', s.coolDownSec.pct50 != null ? PwaTransientThermal.formatDuration(s.coolDownSec.pct50) : '—');
    setText('pwa-tt-cool-10', s.coolDownSec.pct10 != null ? PwaTransientThermal.formatDuration(s.coolDownSec.pct10) : '—');
    setText('pwa-tt-degree-hours', num(s.thermalExposure.degreeHours, 3));
    setText('pwa-tt-degree-minutes', num(s.thermalExposure.degreeMinutes, 1));
    setText('pwa-tt-utilisation', num(s.maxUtilisationPct, 1) + '%');
    setText('pwa-tt-min-margin', num(s.minSafetyMarginC, 2));

    if (result.massProperties) {
      setText('pwa-tt-volume', num(result.massProperties.volumeM3 * 1e6, 2));
      setText('pwa-tt-mass', num(result.massProperties.massKg * 1000, 2));
      setText('pwa-tt-heat-capacity', num(result.massProperties.heatCapacityJK, 2));
    }

    var statusEl = $('pwa-tt-status');
    if (statusEl) {
      statusEl.textContent = s.engineeringStatus;
      statusEl.className = 'pwa-at-result__passfail pwa-at-result__passfail--' + s.engineeringStatus.toLowerCase();
    }

    renderWarnings(result.warnings);
    renderCharts(result);

    var sensBody = $('pwa-tt-sensitivity-body');
    if (sensBody && result.sensitivity) {
      sensBody.innerHTML = result.sensitivity.map(function (row) {
        return '<tr><td>' + row.variable + '</td><td>' + row.changePct + '%</td><td>' +
          row.peakTempC + '</td><td>' + row.differenceC + '</td></tr>';
      }).join('');
      $('pwa-tt-sensitivity-wrap').hidden = false;
    } else if ($('pwa-tt-sensitivity-wrap')) {
      $('pwa-tt-sensitivity-wrap').hidden = true;
    }
  }

  function updateAfterRecalc(params, allColumns, visibleColumns) {
    if (!isEnabled() || !global.PwaTransientThermal) {
      lastResult = null;
      return;
    }
    if (!visibleColumns || !visibleColumns.length) {
      lastResult = null;
      renderWarnings(['Select AWG columns in the grid to run transient analysis.']);
      return;
    }

    var config = buildConfig(params, visibleColumns);
    if (!config) {
      lastResult = null;
      return;
    }

    lastResult = PwaTransientThermal.runTransientSimulation(config);
    if (config.transient.sensitivityEnabled && lastResult && lastResult.summary) {
      lastResult.sensitivity = PwaTransientThermal.runSensitivityAnalysis(config, lastResult);
    }
    renderResults(lastResult);
  }

  function toggleProfilePanels() {
    var type = ($('pwa-tt-profile-type') || {}).value || 'constant';
    ['single', 'repeating', 'duty', 'custom', 'mission'].forEach(function (key) {
      var el = $('pwa-tt-profile-' + key);
      if (el) el.hidden = true;
    });
    if (type === 'singlePulse') $('pwa-tt-profile-single').hidden = false;
    if (type === 'repeatingPulse') $('pwa-tt-profile-repeating').hidden = false;
    if (type === 'dutyCycle') $('pwa-tt-profile-duty').hidden = false;
    if (type === 'customSchedule') $('pwa-tt-profile-custom').hidden = false;
    if (type === 'missionProfile') $('pwa-tt-profile-mission').hidden = false;
  }

  function addScheduleRow(start, end, current) {
    var tbody = $('pwa-tt-schedule-body');
    if (!tbody) return;
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td><input type="number" data-field="start" step="0.1" min="0" value="' + (start || 0) + '"></td>' +
      '<td><input type="number" data-field="end" step="0.1" min="0" value="' + (end || 1) + '"></td>' +
      '<td><input type="number" data-field="current" step="0.1" value="' + (current || 0) + '"></td>' +
      '<td><button type="button" class="pwa-tt-schedule-del">Delete</button></td>';
    tbody.appendChild(tr);
  }

  function applyWorstCase() {
    if ($('pwa-tt-cert-mode')) $('pwa-tt-cert-mode').checked = true;
    if ($('pwa-tt-duration')) $('pwa-tt-duration').value = '60';
    if ($('pwa-tt-profile-type')) $('pwa-tt-profile-type').value = 'constant';
    toggleProfilePanels();
    applyCertMode();
    setText('pwa-tt-worst-note', 'Worst case applied: zero airflow, centre bundle, continuous load, conservative material assumptions.');
    var form = document.getElementById('pwa-params-form');
    if (form) form.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function applyCertMode() {
    var on = $('pwa-tt-cert-mode') && $('pwa-tt-cert-mode').checked;
    var note = $('pwa-tt-cert-note');
    if (note) note.hidden = !on;
  }

  function extendSnapshot(snapshot) {
    snapshot.transientThermalEnabled = isEnabled() ? 'yes' : 'no';
    return snapshot;
  }

  function getExportData() {
    if (!isEnabled() || !lastResult) return null;
    return lastResult;
  }

  function bindEvents() {
    if (bound) return;
    bound = true;

    var enableEl = $('pwa-transient-enable');
    if (enableEl) {
      enableEl.addEventListener('change', function () {
        setBodyVisible(enableEl.checked);
        if (enableEl.checked) {
          var form = document.getElementById('pwa-params-form');
          if (form) form.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          lastResult = null;
        }
      });
    }

    var body = $('pwa-transient-body');
    if (body) {
      body.addEventListener('change', function () {
        toggleProfilePanels();
        applyCertMode();
        if ($('pwa-tt-initial-mode')) {
          $('pwa-tt-initial-custom-wrap').hidden = $('pwa-tt-initial-mode').value !== 'custom';
        }
        if (isEnabled()) {
          document.getElementById('pwa-params-form').dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      body.addEventListener('input', function () {
        if (isEnabled()) {
          document.getElementById('pwa-params-form').dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    }

    if ($('pwa-tt-schedule-add')) {
      $('pwa-tt-schedule-add').addEventListener('click', function () {
        var cur = parseFloat(document.querySelector('[name="circuitCurrent"]').value, 10) || 0;
        addScheduleRow(0, 5, cur);
      });
    }
    if ($('pwa-tt-schedule-body')) {
      $('pwa-tt-schedule-body').addEventListener('click', function (ev) {
        if (ev.target.classList.contains('pwa-tt-schedule-del')) {
          ev.target.closest('tr').remove();
        }
      });
    }
    if ($('pwa-tt-worst-case')) {
      $('pwa-tt-worst-case').addEventListener('click', applyWorstCase);
    }
    if ($('pwa-tt-schedule-export')) {
      $('pwa-tt-schedule-export').addEventListener('click', function () {
        var sched = readCustomSchedule();
        var csv = 'Start_min,End_min,Current_A\n' + sched.map(function (s) {
          return (s.startSec / 60) + ',' + (s.endSec / 60) + ',' + s.currentA;
        }).join('\n');
        var blob = new Blob([csv], { type: 'text/csv' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'load-schedule.csv';
        a.click();
      });
    }
    if ($('pwa-tt-schedule-import')) {
      $('pwa-tt-schedule-import').addEventListener('change', function (ev) {
        var file = ev.target.files && ev.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          var lines = String(reader.result).split(/\r?\n/).slice(1);
          $('pwa-tt-schedule-body').innerHTML = '';
          lines.forEach(function (line) {
            var p = line.split(',');
            if (p.length >= 3) addScheduleRow(parseFloat(p[0], 10), parseFloat(p[1], 10), parseFloat(p[2], 10));
          });
        };
        reader.readAsText(file);
        ev.target.value = '';
      });
    }

    window.addEventListener('resize', function () {
      if (lastResult) renderCharts(lastResult);
    });

    toggleProfilePanels();
    applyCertMode();
    addScheduleRow(0, 10, 0);
  }

  function init() {
    if (!global.PwaTransientThermal) return;
    bindEvents();
    setBodyVisible(false);
    var mat = PwaTransientThermal.MATERIAL_PROPERTIES.copper;
    if ($('pwa-tt-density')) $('pwa-tt-density').value = String(mat.densityKgM3);
    if ($('pwa-tt-cp')) $('pwa-tt-cp').value = String(mat.specificHeatJkgK);
    if (global.PwaTransientThermalHelp) {
      PwaTransientThermalHelp.init();
    }
  }

  global.PwaTransientThermalUI = {
    init: init,
    isEnabled: isEnabled,
    updateAfterRecalc: updateAfterRecalc,
    extendSnapshot: extendSnapshot,
    getExportData: getExportData
  };
})(typeof window !== 'undefined' ? window : this);
