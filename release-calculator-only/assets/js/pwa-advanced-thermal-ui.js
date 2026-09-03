/**
 * Power Wire Analysis — Advanced Heat-Balance Model UI controller.
 * Separate from primary calculator; no effect when disabled.
 */
(function (global) {
  'use strict';

  var lastResult = null;
  var bound = false;

  function $(id) {
    return document.getElementById(id);
  }

  function num(value, digits) {
    if (global.PwaAdvancedThermal && PwaAdvancedThermal.round) {
      return PwaAdvancedThermal.round(value, digits);
    }
    if (typeof value !== 'number' || !isFinite(value)) {
      return '—';
    }
    return String(Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits));
  }

  function isEnabled() {
    var toggle = $('pwa-advanced-thermal-enable');
    return !!(toggle && toggle.checked);
  }

  function setPanelVisible(visible) {
    var body = $('pwa-advanced-thermal-body');
    if (body) {
      body.hidden = !visible;
    }
  }

  function readPresetValue(presetEl, customEl, presets, customKey) {
    if (!presetEl) {
      return null;
    }
    if (presetEl.value === customKey && customEl) {
      return parseFloat(customEl.value, 10);
    }
    var preset = presets[presetEl.value];
    return preset && preset.value != null ? preset.value : null;
  }

  function deriveWireGeometry(wireRow) {
    var odAuto = wireRow ? (wireRow.odMinMm + wireRow.odMaxMm) / 2 : 2.0;
    var condDia = wireRow ? wireRow.conductorNomDiaMm : 1.0;
    var insAuto = wireRow ? Math.max((odAuto - condDia) / 2, 0.25) : 0.25;
    return { odAuto: odAuto, condDia: condDia, insAuto: insAuto };
  }

  function readAdjacentWires(params, conservativeMode) {
    var overrideEl = $('pwa-at-adjacent-override');
    var manualEl = $('pwa-at-adjacent-manual');
    var estimated = PwaAdvancedThermal.estimateAdjacentLoadedWires(
      params.bundleWireCount,
      params.bundleLoadingPct
    );
    if (conservativeMode) {
      return Math.max(estimated, params.bundleWireCount || 0);
    }
    if (overrideEl && overrideEl.checked && manualEl) {
      return parseInt(manualEl.value, 10);
    }
    return estimated;
  }

  function applyConservativeMode(force) {
    var conservativeEl = $('pwa-at-conservative');
    var noteEl = $('pwa-at-conservative-note');
    var velocityEl = $('pwa-at-air-velocity');
    var positionEl = $('pwa-at-wire-position');
    var contactEl = $('pwa-at-thermal-contact');
    var adjacentOverrideEl = $('pwa-at-adjacent-override');
    var adjacentManualEl = $('pwa-at-adjacent-manual');
    var enabled = force != null ? force : (conservativeEl && conservativeEl.checked);

    ['pwa-at-air-velocity', 'pwa-at-wire-position', 'pwa-at-thermal-contact',
      'pwa-at-adjacent-override', 'pwa-at-adjacent-manual'].forEach(function (id) {
      var el = $(id);
      if (el) {
        el.disabled = enabled;
      }
    });

    if (enabled) {
      if (velocityEl) velocityEl.value = '0';
      if (positionEl) positionEl.value = 'centre';
      if (contactEl) contactEl.value = 'none';
      if (adjacentOverrideEl) adjacentOverrideEl.checked = false;
      if (adjacentManualEl) adjacentManualEl.disabled = true;
    } else if (adjacentManualEl && adjacentOverrideEl) {
      adjacentManualEl.disabled = !adjacentOverrideEl.checked;
    }

    if (noteEl) {
      noteEl.hidden = !enabled;
    }
  }

  function toggleCustomFields() {
    var pairs = [
      ['pwa-at-emissivity-preset', 'pwa-at-emissivity-custom-wrap'],
      ['pwa-at-insulation-k-preset', 'pwa-at-insulation-k-custom-wrap']
    ];
    pairs.forEach(function (pair) {
      var preset = $(pair[0]);
      var wrap = $(pair[1]);
      if (preset && wrap) {
        wrap.hidden = preset.value !== 'custom';
      }
    });

    var odOverride = $('pwa-at-od-override');
    var odManual = $('pwa-at-od-manual');
    if (odManual && odOverride) {
      odManual.disabled = !odOverride.checked;
    }

    var insOverride = $('pwa-at-insulation-override');
    var insManual = $('pwa-at-insulation-manual');
    if (insManual && insOverride) {
      insManual.disabled = !insOverride.checked;
    }

    var adjacentOverride = $('pwa-at-adjacent-override');
    var adjacentManual = $('pwa-at-adjacent-manual');
    var conservative = $('pwa-at-conservative') && $('pwa-at-conservative').checked;
    if (adjacentManual && adjacentOverride) {
      adjacentManual.disabled = conservative || !adjacentOverride.checked;
    }
  }

  function syncAutoDerivedHints(wireRow) {
    var geom = deriveWireGeometry(wireRow);
    var odHint = $('pwa-at-od-auto-hint');
    var insHint = $('pwa-at-insulation-auto-hint');
    if (odHint) {
      odHint.textContent = wireRow
        ? 'Auto: ' + num(geom.odAuto, 2) + ' mm (catalog average OD)'
        : 'Auto-estimate unavailable — wire catalog data missing';
    }
    if (insHint) {
      insHint.textContent = wireRow
        ? 'Auto: ' + num(geom.insAuto, 3) + ' mm from (OD − conductor) / 2'
        : 'Auto: 0.25 mm conservative default';
    }
  }

  function buildAssumptions(inputs, params, wireRow, result) {
    var install = PwaAdvancedThermal.INSTALLATION_TYPES[inputs.installationType];
    var position = PwaAdvancedThermal.WIRE_POSITIONS[inputs.wirePosition];
    var contact = PwaAdvancedThermal.THERMAL_CONTACT[inputs.thermalContact];
    var adjacentPenalty = Math.min(1.5, 1 + 0.01 * Math.max(0, inputs.adjacentLoadedWires || 0));
    var rows = [
      {
        parameter: 'Circuit current I',
        value: num(inputs.currentA, 2) + ' A',
        source: 'Existing Calculator',
        comment: 'Reused from primary wire sizing inputs'
      },
      {
        parameter: 'Wire size (AWG)',
        value: inputs.awg,
        source: 'Existing Calculator',
        comment: 'Worst-case column (highest T₂ among visible AWG columns)'
      },
      {
        parameter: 'Wire type',
        value: inputs.wireTypeLabel,
        source: 'Existing Calculator',
        comment: 'Reused wire catalog selection'
      },
      {
        parameter: 'R₂₀ (total run)',
        value: num(inputs.r20Ohms, 6) + ' Ω',
        source: 'Existing Calculator',
        comment: 'Grid resistance at 20 °C for selected AWG and run length'
      },
      {
        parameter: 'Ambient temperature',
        value: num(inputs.ambientTempC, 1) + ' °C',
        source: 'Existing Calculator',
        comment: 'Used for convection and conduction reference'
      },
      {
        parameter: 'Altitude',
        value: params.altitudeFt + ' ft',
        source: 'Existing Calculator',
        comment: 'ISA density correction for convection coefficient'
      },
      {
        parameter: 'Bundle count / loading',
        value: params.bundleWireCount + ' / ' + params.bundleLoadingPct + '%',
        source: 'Existing Calculator',
        comment: 'Used to estimate adjacent loaded wires unless overridden'
      },
      {
        parameter: 'Run length (total)',
        value: num(inputs.runLengthM, 3) + ' m',
        source: 'Existing Calculator',
        comment: 'Wire surface area = π × OD × length'
      },
      {
        parameter: 'Conductor rating T_R',
        value: num(inputs.conductorRatingC, 0) + ' °C',
        source: 'Existing Calculator',
        comment: 'Advanced PASS/WARNING/FAIL margin reference'
      },
      {
        parameter: 'Installation limit',
        value: inputs.installationLimitC != null ? num(inputs.installationLimitC, 0) + ' °C' : '—',
        source: params.applyInstallationTempLimit ? 'Existing Calculator' : 'Not applied',
        comment: params.applyInstallationTempLimit ? 'Installation temperature assessment enabled' : 'Primary install assessment disabled'
      },
      {
        parameter: 'Existing T₂ (standards method)',
        value: num(inputs.existingT2C, 3) + ' °C',
        source: 'Existing Calculator',
        comment: 'ARP4404 / derating based estimate for comparison'
      },
      {
        parameter: 'Conductor material',
        value: inputs.material === 'aluminium' ? 'Aluminium (α = 0.00403 /°C)' : 'Copper (α = 0.00393 /°C)',
        source: 'User Input',
        comment: 'Temperature-corrected resistance R(T) = R₂₀[1 + α(T − 20)]'
      },
      {
        parameter: 'Installation type penalty',
        value: String(install.penalty),
        source: 'Engineering Assumption',
        comment: install.label + ' — reduces effective heat rejection'
      },
      {
        parameter: 'Wire position penalty',
        value: String(position.factor),
        source: inputs.conservativeMode ? 'Conservative Default' : 'User Input',
        comment: position.label + ' position in bundle'
      },
      {
        parameter: 'Adjacent loaded wires',
        value: String(inputs.adjacentLoadedWires),
        source: inputs.conservativeMode ? 'Conservative Default' : (inputs.adjacentManual ? 'User Input' : 'Calculated'),
        comment: 'Adjacent penalty = min(1.50, 1 + 0.01 × N) = ' + num(adjacentPenalty, 3)
      },
      {
        parameter: 'Air velocity',
        value: num(inputs.airVelocityMs, 2) + ' m/s',
        source: inputs.conservativeMode ? 'Conservative Default' : 'User Input',
        comment: '0 m/s = natural convection; h = 5 + 10√v W/m²·K base'
      },
      {
        parameter: 'Surface emissivity ε',
        value: String(inputs.emissivity),
        source: inputs.emissivityPreset === 'conservative' ? 'Conservative Default' : (inputs.emissivityPreset === 'custom' ? 'User Input' : 'Datasheet / Wire Library'),
        comment: 'Stefan–Boltzmann radiation to nearby hot surface'
      },
      {
        parameter: 'Insulation thermal conductivity',
        value: num(inputs.insulationK, 3) + ' W/(m·K)',
        source: inputs.insulationPreset === 'conservative' ? 'Conservative Default' : (inputs.insulationPreset === 'custom' ? 'User Input' : 'Datasheet / Wire Library'),
        comment: 'Documented for traceability; steady-state balance uses external rejection'
      },
      {
        parameter: 'Insulation thickness',
        value: num(inputs.insulationThicknessMm, 3) + ' mm',
        source: inputs.insulationManual ? 'User Input' : (wireRow ? 'Calculated' : 'Conservative Default'),
        comment: inputs.insulationManual ? 'Manual override' : '(wire OD − conductor diameter) / 2'
      },
      {
        parameter: 'Wire outside diameter',
        value: num(inputs.odAvgMm, 3) + ' mm',
        source: inputs.odManual ? 'User Input' : (wireRow ? 'Datasheet / Wire Library' : 'Conservative Default'),
        comment: 'Average catalog OD unless overridden'
      },
      {
        parameter: 'Nearby hot surface temperature',
        value: num(inputs.hotSurfaceTempC, 1) + ' °C',
        source: inputs.hotSurfaceManual ? 'User Input' : 'Existing Calculator',
        comment: 'Radiation sink temperature T_sur (default = ambient)'
      },
      {
        parameter: 'Thermal contact to structure',
        value: contact.label,
        source: inputs.conservativeMode ? 'Conservative Default' : 'User Input',
        comment: inputs.conservativeMode ? 'Forced to None in Conservative Authority Mode' : 'k_contact = ' + contact.kContactW + ' W/K'
      },
      {
        parameter: 'Conservative Authority Mode',
        value: inputs.conservativeMode ? 'Enabled' : 'Disabled',
        source: 'User Input',
        comment: 'Worst-case assumptions when installation data unavailable'
      }
    ];

    if (result && result.solver) {
      rows.push(
        {
          parameter: 'Convection coefficient h',
          value: num(result.solver.convectionCoeff, 3) + ' W/(m²·K)',
          source: 'Calculated',
          comment: 'Altitude-corrected: h × √(ρ/ρ₀)'
        },
        {
          parameter: 'Combined heat rejection penalty',
          value: String(result.solver.combinedPenalty),
          source: 'Calculated',
          comment: 'Installation × position × adjacent wire penalties'
        },
        {
          parameter: 'ISA air density',
          value: num(result.atmosphere.densityKgM3, 4) + ' kg/m³',
          source: 'Calculated',
          comment: 'International Standard Atmosphere at ' + params.altitudeFt + ' ft'
        }
      );
    }

    return rows;
  }

  function pickWorstT2Column(visibleColumns) {
    var worst = null;
    var i;
    for (i = 0; i < visibleColumns.length; i += 1) {
      var col = visibleColumns[i];
      if (typeof col.T2 !== 'number' || !isFinite(col.T2)) {
        continue;
      }
      if (!worst || col.T2 > worst.T2) {
        worst = col;
      }
    }
    return worst;
  }

  function findWireRow(wireTypeId, awgLabel) {
    if (!global.PwaWireCatalog) {
      return null;
    }
    var rows = PwaWireCatalog.getWireRows(wireTypeId);
    var i;
    for (i = 0; i < rows.length; i += 1) {
      if (rows[i].label === awgLabel) {
        return rows[i];
      }
    }
    return null;
  }

  function getExistingPowerWireInputs(params, visibleColumns) {
    var worstCol = pickWorstT2Column(visibleColumns);
    if (!worstCol) {
      return null;
    }
    var wireTypeEl = document.querySelector('#pwa-params-form [name="wireType"]');
    var wireTypeId = wireTypeEl ? wireTypeEl.value : params.wireTypeId;
    var wireRow = findWireRow(wireTypeId, worstCol.awg);
    var wireType = global.PwaWireCatalog ? PwaWireCatalog.getWireType(wireTypeId) : null;
    return {
      worstCol: worstCol,
      wireTypeId: wireTypeId,
      wireRow: wireRow,
      wireTypeLabel: wireType ? wireType.label : wireTypeId,
      r20Ohms: (worstCol.R1000 / 1000) * params.wireLengthFt
    };
  }

  function getAdvancedThermalInputs(params, visibleColumns) {
    var base = getExistingPowerWireInputs(params, visibleColumns);
    if (!base) {
      return null;
    }

    var worstCol = base.worstCol;
    var wireRow = base.wireRow;
    var geom = deriveWireGeometry(wireRow);
    var conservativeEl = $('pwa-at-conservative');
    var conservativeMode = !!(conservativeEl && conservativeEl.checked);
    var emissivityPreset = $('pwa-at-emissivity-preset') ? $('pwa-at-emissivity-preset').value : 'conservative';
    var insulationPreset = $('pwa-at-insulation-k-preset') ? $('pwa-at-insulation-k-preset').value : 'conservative';
    var hotSurfaceEl = $('pwa-at-hot-surface');
    var hotSurfaceDefault = params.ambientTemp;
    var adjacentOverride = $('pwa-at-adjacent-override');
    var odOverride = $('pwa-at-od-override');
    var insOverride = $('pwa-at-insulation-override');

    applyConservativeMode(conservativeMode);
    syncAutoDerivedHints(wireRow);

    var odAvgMm = odOverride && odOverride.checked && $('pwa-at-od-manual')
      ? parseFloat($('pwa-at-od-manual').value, 10)
      : geom.odAuto;
    var insulationThicknessMm = insOverride && insOverride.checked && $('pwa-at-insulation-manual')
      ? parseFloat($('pwa-at-insulation-manual').value, 10)
      : geom.insAuto;

    var inputs = {
      awg: worstCol.awg,
      wireTypeLabel: base.wireTypeLabel,
      currentA: params.circuitCurrent,
      r20Ohms: base.r20Ohms,
      ambientTempC: params.ambientTemp,
      altitudeFt: params.altitudeFt,
      runLengthM: params.wireLengthM,
      conductorRatingC: params.conductorTempRating,
      installationLimitC: params.applyInstallationTempLimit ? params.installationTempLimit : null,
      existingT2C: worstCol.T2,
      material: $('pwa-at-material') ? $('pwa-at-material').value : 'copper',
      installationType: $('pwa-at-installation-type') ? $('pwa-at-installation-type').value : 'bundledHarness',
      airVelocityMs: conservativeMode ? 0 : parseFloat($('pwa-at-air-velocity').value, 10),
      wirePosition: conservativeMode ? 'centre' : ($('pwa-at-wire-position') ? $('pwa-at-wire-position').value : 'centre'),
      adjacentLoadedWires: readAdjacentWires(params, conservativeMode),
      adjacentManual: !!(adjacentOverride && adjacentOverride.checked && !conservativeMode),
      emissivityPreset: emissivityPreset,
      emissivity: readPresetValue(
        $('pwa-at-emissivity-preset'),
        $('pwa-at-emissivity-custom'),
        PwaAdvancedThermal.EMISSIVITY_PRESETS,
        'custom'
      ) || 0.8,
      insulationPreset: insulationPreset,
      insulationK: readPresetValue(
        $('pwa-at-insulation-k-preset'),
        $('pwa-at-insulation-k-custom'),
        PwaAdvancedThermal.INSULATION_K_PRESETS,
        'custom'
      ) || 0.2,
      insulationThicknessMm: insulationThicknessMm,
      insulationManual: !!(insOverride && insOverride.checked),
      odAvgMm: odAvgMm,
      odManual: !!(odOverride && odOverride.checked),
      hotSurfaceTempC: hotSurfaceEl ? parseFloat(hotSurfaceEl.value, 10) : hotSurfaceDefault,
      hotSurfaceManual: !!(hotSurfaceEl && hotSurfaceEl.dataset.userEdited === 'true'),
      thermalContact: conservativeMode ? 'none' : ($('pwa-at-thermal-contact') ? $('pwa-at-thermal-contact').value : 'none'),
      conservativeMode: conservativeMode
    };

    if (!isFinite(inputs.airVelocityMs)) inputs.airVelocityMs = 0;
    if (!isFinite(inputs.hotSurfaceTempC)) inputs.hotSurfaceTempC = hotSurfaceDefault;
    if (!isFinite(inputs.odAvgMm) || inputs.odAvgMm <= 0) inputs.odAvgMm = geom.odAuto;
    if (!isFinite(inputs.insulationThicknessMm) || inputs.insulationThicknessMm <= 0) {
      inputs.insulationThicknessMm = geom.insAuto;
    }

    inputs.assumptions = [];
    return inputs;
  }

  function readAdvancedInputs(params, visibleColumns) {
    return getAdvancedThermalInputs(params, visibleColumns);
  }

  function setText(id, text) {
    var el = $(id);
    if (el) {
      el.textContent = text == null ? '—' : String(text);
    }
  }

  function renderWarnings(warnings) {
    var panel = $('pwa-at-warnings');
    if (!panel) {
      return;
    }
    if (!warnings || !warnings.length) {
      panel.hidden = true;
      panel.innerHTML = '';
      return;
    }
    panel.hidden = false;
    panel.innerHTML = warnings.map(function (msg) {
      return '<p class="pwa-at-warn">' + msg + '</p>';
    }).join('');
  }

  function renderAdvancedAssumptionsTable(assumptions) {
    var tbody = $('pwa-at-assumptions-body');
    if (!tbody) {
      return;
    }
    tbody.innerHTML = (assumptions || []).map(function (row) {
      return '<tr><td>' + row.parameter + '</td><td>' + row.value + '</td><td>' +
        row.source + '</td><td>' + (row.comment || '') + '</td></tr>';
    }).join('');
  }

  function compareStatusClass(status) {
    return 'pwa-at-compare__status pwa-at-compare__status--' +
      String(status).toLowerCase().replace(/\s+/g, '-');
  }

  function passFailClass(status) {
    return 'pwa-at-result__passfail pwa-at-result__passfail--' + String(status).toLowerCase();
  }

  function renderAdvancedThermalResults(result) {
    if (!result) {
      setText('pwa-at-tc', '—');
      return;
    }

    setText('pwa-at-tc', num(result.tcAdvanced, 2));
    setText('pwa-at-existing-t2', num(result.existingT2, 2));
    setText('pwa-at-diff', num(result.differenceC, 2));
    setText('pwa-at-diff-pct', result.differencePct != null ? num(result.differencePct, 2) + '%' : '—');
    setText('pwa-at-rating-margin', num(result.ratingMarginC, 2));
    setText('pwa-at-install-margin', result.installMarginC != null ? num(result.installMarginC, 2) : '—');
    setText('pwa-at-qgen', num(result.heatBalance.qGenW, 4));
    setText('pwa-at-qconv', num(result.heatBalance.qConvW, 4));
    setText('pwa-at-qrad', num(result.heatBalance.qRadW, 4));
    setText('pwa-at-qcond', num(result.heatBalance.qCondW, 4));
    setText('pwa-at-mechanism', result.dominantMechanism);
    setText('pwa-at-residual', num(result.heatBalance.residualW, 4));
    setText('pwa-at-iterations', String(result.solver ? result.solver.iterations : result.iterations));
    setText('pwa-at-awg-note', 'Analysis AWG ' + result.awg + ' (highest T₂ among visible columns).');

    setText('pwa-at-compare-existing-tc', num(result.existingT2, 2) + ' °C');
    setText('pwa-at-compare-advanced-tc', num(result.tcAdvanced, 2) + ' °C');
    setText('pwa-at-compare-existing-rating-margin',
      num(result.existingRatingMarginC, 2) + ' °C');
    setText('pwa-at-compare-advanced-rating-margin', num(result.ratingMarginC, 2) + ' °C');
    setText('pwa-at-compare-existing-install-margin',
      result.existingInstallMarginC != null ? num(result.existingInstallMarginC, 2) + ' °C' : '—');
    setText('pwa-at-compare-advanced-install-margin',
      result.installMarginC != null ? num(result.installMarginC, 2) + ' °C' : '—');

    var passEl = $('pwa-at-passfail');
    if (passEl) {
      passEl.textContent = result.passFail;
      passEl.className = passFailClass(result.passFail);
    }

    var compareEl = $('pwa-at-compare-status');
    if (compareEl) {
      compareEl.textContent = result.comparisonStatus;
      compareEl.className = compareStatusClass(result.comparisonStatus);
    }

    renderWarnings(result.warnings);
    renderAdvancedAssumptionsTable(result.assumptions);
  }

  function renderResults(result) {
    renderAdvancedThermalResults(result);
  }

  function updateAdvancedThermalReportSection(result) {
    lastResult = result;
  }

  function updateAfterRecalc(params, allColumns, visibleColumns) {
    if (!isEnabled()) {
      lastResult = null;
      return;
    }
    if (!visibleColumns || !visibleColumns.length) {
      lastResult = null;
      renderResults(null);
      setText('pwa-at-awg-note', 'Select AWG columns in the grid to run advanced heat-balance analysis.');
      return;
    }

    var inputs = getAdvancedThermalInputs(params, visibleColumns);
    if (!inputs) {
      lastResult = null;
      renderResults(null);
      return;
    }

    if (inputs.r20Ohms <= 0 || inputs.currentA <= 0) {
      renderWarnings(['Required primary calculator values are unavailable for advanced heat-balance analysis.']);
    }

    lastResult = PwaAdvancedThermal.solveAdvancedConductorTemperature(inputs);
    lastResult.assumptions = buildAssumptions(inputs, params, findWireRow(
      document.querySelector('#pwa-params-form [name="wireType"]')
        ? document.querySelector('#pwa-params-form [name="wireType"]').value
        : params.wireTypeId,
      inputs.awg
    ), lastResult);
    updateAdvancedThermalReportSection(lastResult);
    renderAdvancedThermalResults(lastResult);
  }

  function syncHotSurfaceDefault(params) {
    var hotSurfaceEl = $('pwa-at-hot-surface');
    if (!hotSurfaceEl || hotSurfaceEl.dataset.userEdited === 'true') {
      return;
    }
    hotSurfaceEl.value = String(params.ambientTemp);
  }

  function extendSnapshot(snapshot) {
    if (!snapshot || !isEnabled()) {
      snapshot.advancedThermalEnabled = 'no';
      return snapshot;
    }
    snapshot.advancedThermalEnabled = 'yes';
    snapshot.advancedThermalConservative = $('pwa-at-conservative') && $('pwa-at-conservative').checked ? 'yes' : 'no';
    snapshot.advancedThermalInstallationType = $('pwa-at-installation-type') ? $('pwa-at-installation-type').value : '';
    snapshot.advancedThermalMaterial = $('pwa-at-material') ? $('pwa-at-material').value : '';
    return snapshot;
  }

  function getExportData() {
    if (!isEnabled() || !lastResult) {
      return null;
    }
    return lastResult;
  }

  function bindEvents() {
    if (bound) {
      return;
    }
    bound = true;

    var enableEl = $('pwa-advanced-thermal-enable');
    if (enableEl) {
      enableEl.addEventListener('change', function () {
        setPanelVisible(enableEl.checked);
        if (enableEl.checked) {
          var form = document.getElementById('pwa-params-form');
          if (form && global.PwaGridCalculator && typeof PwaGridCalculator.triggerRecalc === 'function') {
            PwaGridCalculator.triggerRecalc();
          } else if (form) {
            form.dispatchEvent(new Event('input', { bubbles: true }));
          }
        } else {
          lastResult = null;
          renderWarnings([]);
        }
      });
    }

    var panel = $('pwa-advanced-thermal-body');
    if (panel) {
      panel.addEventListener('change', function () {
        toggleCustomFields();
        applyConservativeMode();
        if (isEnabled()) {
          var form = document.getElementById('pwa-params-form');
          if (form) {
            form.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      });
      panel.addEventListener('input', function (ev) {
        if (ev.target && ev.target.id === 'pwa-at-hot-surface') {
          ev.target.dataset.userEdited = 'true';
        }
        if (isEnabled()) {
          var form = document.getElementById('pwa-params-form');
          if (form) {
            form.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
      });
    }

    toggleCustomFields();
    applyConservativeMode();
  }

  function init() {
    if (!global.PwaAdvancedThermal) {
      return;
    }
    bindEvents();
    setPanelVisible(false);
    var hotSurfaceEl = $('pwa-at-hot-surface');
    if (hotSurfaceEl) {
      hotSurfaceEl.dataset.userEdited = 'false';
    }
    if (global.PwaAdvancedThermalHelp) {
      PwaAdvancedThermalHelp.init();
    }
  }

  global.PwaAdvancedThermalUI = {
    init: init,
    isEnabled: isEnabled,
    getExistingPowerWireInputs: getExistingPowerWireInputs,
    getAdvancedThermalInputs: getAdvancedThermalInputs,
    updateAfterRecalc: updateAfterRecalc,
    syncHotSurfaceDefault: syncHotSurfaceDefault,
    extendSnapshot: extendSnapshot,
    getExportData: getExportData,
    renderAdvancedThermalResults: renderAdvancedThermalResults,
    renderAdvancedAssumptionsTable: renderAdvancedAssumptionsTable,
    updateAdvancedThermalReportSection: updateAdvancedThermalReportSection
  };
})(typeof window !== 'undefined' ? window : this);
