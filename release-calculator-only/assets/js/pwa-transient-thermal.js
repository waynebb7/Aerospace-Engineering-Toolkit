/**
 * Power Wire Analysis — Transient Thermal Model (lumped capacitance)
 *
 * Time-dependent conductor heating/cooling via RK4 integration.
 * Supplementary analysis only — does not modify ARP4404 or steady-state models.
 * Internal units: SI (seconds, °C, W, J, kg).
 */
(function (global) {
  'use strict';

  var STEFAN_BOLTZMANN = 5.670374419e-8;
  var FT_TO_M = 0.3048;
  var MM3_TO_M3 = 1e-9;

  var MATERIAL_PROPERTIES = {
    copper: {
      label: 'Copper',
      densityKgM3: 8960,
      specificHeatJkgK: 385,
      alpha: 0.00393,
      thermalConductivityWmK: 401
    },
    aluminium: {
      label: 'Aluminium',
      densityKgM3: 2700,
      specificHeatJkgK: 897,
      alpha: 0.00403,
      thermalConductivityWmK: 237
    }
  };

  var MISSION_PROFILES = {
    taxi: {
      label: 'Taxi',
      segments: [
        { startMin: 0, endMin: 5, currentFactor: 0.6 },
        { startMin: 5, endMin: 15, currentFactor: 0.85 },
        { startMin: 15, endMin: 20, currentFactor: 0.4 }
      ]
    },
    takeOff: {
      label: 'Take-Off',
      segments: [
        { startMin: 0, endMin: 2, currentFactor: 1.2 },
        { startMin: 2, endMin: 5, currentFactor: 1.0 },
        { startMin: 5, endMin: 8, currentFactor: 0.5 }
      ]
    },
    climb: {
      label: 'Climb',
      segments: [
        { startMin: 0, endMin: 10, currentFactor: 0.9 },
        { startMin: 10, endMin: 25, currentFactor: 0.75 }
      ]
    },
    cruise: {
      label: 'Cruise',
      segments: [
        { startMin: 0, endMin: 60, currentFactor: 0.55 },
        { startMin: 60, endMin: 120, currentFactor: 0.5 }
      ]
    },
    descent: {
      label: 'Descent',
      segments: [
        { startMin: 0, endMin: 15, currentFactor: 0.45 },
        { startMin: 15, endMin: 25, currentFactor: 0.35 }
      ]
    },
    landing: {
      label: 'Landing',
      segments: [
        { startMin: 0, endMin: 3, currentFactor: 1.0 },
        { startMin: 3, endMin: 8, currentFactor: 0.7 },
        { startMin: 8, endMin: 12, currentFactor: 0.2 }
      ]
    },
    groundOps: {
      label: 'Ground Operations',
      segments: [
        { startMin: 0, endMin: 30, currentFactor: 0.25 },
        { startMin: 30, endMin: 45, currentFactor: 0.6 },
        { startMin: 45, endMin: 60, currentFactor: 0.15 }
      ]
    }
  };

  var DISCLAIMER =
    'Transient thermal analysis is a supplementary engineering substantiation tool. ' +
    'It does not replace ARP4404 / AC43.13 / AS50881 steady-state sizing methodology.';

  function round(value, digits) {
    if (typeof value !== 'number' || !isFinite(value)) return null;
    var f = Math.pow(10, digits);
    return Math.round(value * f) / f;
  }

  function kelvin(c) {
    return c + 273.15;
  }

  /** Duplicate steady-state heat-transfer physics (read-only mirror of advanced model). */
  function buildHeatTransferModel(baseInputs) {
    var AT = global.PwaAdvancedThermal;
    if (!AT) return null;

    var alpha = (MATERIAL_PROPERTIES[baseInputs.material] || MATERIAL_PROPERTIES.copper).alpha;
    var install = AT.INSTALLATION_TYPES[baseInputs.installationType] || AT.INSTALLATION_TYPES.bundledHarness;
    var position = AT.WIRE_POSITIONS[baseInputs.wirePosition] || AT.WIRE_POSITIONS.centre;
    var contact = AT.THERMAL_CONTACT[baseInputs.thermalContact] || AT.THERMAL_CONTACT.none;
    var atmosphere = AT.computeIsaAtmosphere(baseInputs.altitudeFt);
    var lengthM = Math.max(baseInputs.runLengthM, 0.01);
    var odMm = baseInputs.odAvgMm || 2;
    var diameterM = Math.max(odMm, 0.5) / 1000;
    var areaM2 = Math.PI * diameterM * lengthM * Math.max(install.exposure, 0.1);
    var h = install.hBase * Math.sqrt(Math.max(atmosphere.densityKgM3, 0.4) / 1.225) +
      0.8 * Math.max(0, baseInputs.airVelocityMs) * Math.sqrt(Math.max(atmosphere.densityKgM3, 0.4) / 1.225);
    var neighborPenalty = 1 + 0.025 * Math.max(0, baseInputs.adjacentLoadedWires - 1);
    var positionPenalty = position.factor;
    var gCond = contact.gCondPerM * lengthM;
    var r20 = baseInputs.r20Ohms;
    var tamb = baseInputs.ambientTempC;
    var emissivity = baseInputs.emissivity;
    var tHot = baseInputs.hotSurfaceTempC;

    function resistanceAt(tempC) {
      return r20 * (1 + alpha * (tempC - 20));
    }

    function heatLossAt(tempC) {
      var qConv = h * areaM2 * Math.max(tempC - tamb, 0);
      var qRad = emissivity * STEFAN_BOLTZMANN * areaM2 *
        (Math.pow(kelvin(tempC), 4) - Math.pow(kelvin(tamb), 4));
      var qCond = gCond * Math.max(tempC - tHot, 0);
      return (qConv + qRad + qCond) / (positionPenalty * neighborPenalty);
    }

    function heatGenAt(tempC, currentA) {
      return currentA * currentA * resistanceAt(tempC);
    }

    return {
      resistanceAt: resistanceAt,
      heatLossAt: heatLossAt,
      heatGenAt: heatGenAt
    };
  }

  function computeConductorMass(baseInputs, materialProps, conductorDiaMm) {
    var diaM = Math.max(conductorDiaMm || 1, 0.1) / 1000;
    var lengthM = Math.max(baseInputs.runLengthM, 0.01);
    var volumeM3 = Math.PI * Math.pow(diaM / 2, 2) * lengthM;
    var density = materialProps.densityKgM3;
    if (baseInputs.materialDensityOverride > 0) {
      density = baseInputs.materialDensityOverride;
    }
    var massKg = volumeM3 * density;
    var cp = materialProps.specificHeatJkgK;
    if (baseInputs.materialCpOverride > 0) {
      cp = baseInputs.materialCpOverride;
    }
    return {
      volumeM3: round(volumeM3, 8),
      massKg: round(massKg, 6),
      heatCapacityJK: round(massKg * cp, 4),
      densityKgM3: density,
      specificHeatJkgK: cp
    };
  }

  function currentAtTimeSec(tSec, profile, baseCurrentA) {
    var p = profile || { type: 'constant' };
    var i;

    if (p.type === 'constant') {
      return baseCurrentA;
    }
    if (p.type === 'singlePulse') {
      return (tSec >= p.startSec && tSec < p.startSec + p.durationSec) ? p.pulseCurrentA : 0;
    }
    if (p.type === 'repeatingPulse') {
      if (p.periodSec <= 0) return 0;
      var cycleIndex = Math.floor(tSec / p.periodSec);
      if (cycleIndex >= p.cycles) return 0;
      var phase = tSec - cycleIndex * p.periodSec;
      return phase < p.durationSec ? p.pulseCurrentA : 0;
    }
    if (p.type === 'dutyCycle') {
      if (p.periodSec <= 0) return 0;
      var pos = tSec % p.periodSec;
      var onSec = p.periodSec * (p.dutyPct / 100);
      return pos < onSec ? p.peakCurrentA : 0;
    }
    if (p.type === 'customSchedule' && p.schedule && p.schedule.length) {
      for (i = 0; i < p.schedule.length; i += 1) {
        var seg = p.schedule[i];
        if (tSec >= seg.startSec && tSec < seg.endSec) {
          return seg.currentA;
        }
      }
      return 0;
    }
    if (p.type === 'missionProfile' && p.segments) {
      var tMin = tSec / 60;
      for (i = 0; i < p.segments.length; i += 1) {
        var ms = p.segments[i];
        if (tMin >= ms.startMin && tMin < ms.endMin) {
          return baseCurrentA * ms.currentFactor;
        }
      }
      return 0;
    }
    return baseCurrentA;
  }

  function buildDerivativeFn(ctx) {
    return function dTdt(tempC, tSec) {
      var i = currentAtTimeSec(tSec, ctx.profile, ctx.baseCurrentA);
      var qGen = ctx.heat.heatGenAt(tempC, i);
      var qLoss = ctx.heat.heatLossAt(tempC);
      return (qGen - qLoss) / ctx.thermalMassJK;
    };
  }

  function rk4Step(tempC, tSec, dtSec, dTdt) {
    var k1 = dTdt(tempC, tSec);
    var k2 = dTdt(tempC + 0.5 * dtSec * k1, tSec + 0.5 * dtSec);
    var k3 = dTdt(tempC + 0.5 * dtSec * k2, tSec + 0.5 * dtSec);
    var k4 = dTdt(tempC + dtSec * k3, tSec + dtSec);
    return tempC + (dtSec / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
  }

  function eulerStep(tempC, tSec, dtSec, dTdt) {
    return tempC + dtSec * dTdt(tempC, tSec);
  }

  function downsampleSeries(series, maxPoints) {
    if (series.length <= maxPoints) return series;
    var step = Math.ceil(series.length / maxPoints);
    var out = [];
    var i;
    for (i = 0; i < series.length; i += step) {
      out.push(series[i]);
    }
    if (out[out.length - 1] !== series[series.length - 1]) {
      out.push(series[series.length - 1]);
    }
    return out;
  }

  function formatDuration(sec) {
    if (sec == null || !isFinite(sec)) return 'Never Reached';
    var m = Math.floor(sec / 60);
    var s = Math.round(sec % 60);
    return m + ' min ' + s + ' s';
  }

  function firstCrossingTime(series, predicate) {
    var i;
    for (i = 0; i < series.length; i += 1) {
      if (predicate(series[i], i)) return series[i].tSec;
    }
    return null;
  }

  function computeSummary(series, config) {
    var tamb = config.baseInputs.ambientTempC;
    var rating = config.baseInputs.conductorRatingC;
    var install = config.baseInputs.installationLimitC;
    var peak = series[0];
    var minMargin = Infinity;
    var degreeSeconds = 0;
    var i;

    for (i = 0; i < series.length; i += 1) {
      var pt = series[i];
      if (pt.tempC > peak.tempC) peak = pt;
      var marginRating = rating - pt.tempC;
      var marginInstall = install != null ? install - pt.tempC : Infinity;
      minMargin = Math.min(minMargin, marginRating, marginInstall);
      if (i > 0) {
        var dt = pt.tSec - series[i - 1].tSec;
        degreeSeconds += Math.max(pt.tempC - tamb, 0) * dt;
      }
    }

    var rise = peak.tempC - tamb;
    function coolTime(fractionRemaining) {
      if (rise <= 0) return 0;
      var target = tamb + fractionRemaining * rise;
      var afterPeak = false;
      for (i = 0; i < series.length; i += 1) {
        if (series[i].tSec >= peak.tSec) afterPeak = true;
        if (afterPeak && series[i].tempC <= target) {
          return series[i].tSec - peak.tSec;
        }
      }
      return null;
    }

    var timeToRating = firstCrossingTime(series, function (pt) {
      return pt.tempC >= rating;
    });
    var timeToInstall = install != null
      ? firstCrossingTime(series, function (pt) {
        return pt.tempC >= install;
      })
      : null;

    var maxUtil = (peak.tempC / rating) * 100;
    var status = 'PASS';
    if (timeToRating != null || timeToInstall != null) {
      status = 'FAIL';
    } else if (minMargin < 10) {
      status = 'WARNING';
    }

    var events = [];
    events.push({ type: 'peak', label: 'Peak Temperature', tSec: peak.tSec, value: peak.tempC });
    if (timeToRating != null) {
      events.push({ type: 'rating', label: 'Rating Exceeded', tSec: timeToRating });
    }
    if (timeToInstall != null) {
      events.push({ type: 'install', label: 'Installation Limit Exceeded', tSec: timeToInstall });
    }

    return {
      peakTempC: round(peak.tempC, 3),
      peakTimeSec: peak.tSec,
      peakTimeFormatted: formatDuration(peak.tSec),
      timeToRatingSec: timeToRating,
      timeToRatingFormatted: timeToRating != null ? formatDuration(timeToRating) : 'Never Reached',
      timeToInstallSec: timeToInstall,
      timeToInstallFormatted: timeToInstall != null ? formatDuration(timeToInstall) : 'Never Reached',
      coolDownSec: {
        pct90: coolTime(0.9),
        pct75: coolTime(0.75),
        pct50: coolTime(0.5),
        pct10: coolTime(0.1)
      },
      thermalExposure: {
        degreeSeconds: round(degreeSeconds, 2),
        degreeMinutes: round(degreeSeconds / 60, 2),
        degreeHours: round(degreeSeconds / 3600, 4)
      },
      maxUtilisationPct: round(maxUtil, 2),
      minSafetyMarginC: round(minMargin, 3),
      engineeringStatus: status,
      events: events
    };
  }

  function validateTransientConfig(config) {
    var warnings = [];
    var t = config.transient;
    if (!t.durationMin || t.durationMin < 1 || t.durationMin > 1440) {
      warnings.push('Simulation duration must be between 1 and 1440 minutes.');
    }
    if (t.timestepSec <= 0) {
      warnings.push('Timestep must be positive.');
    }
    if (t.initialTempCustom != null && t.initialTempCustom < 0) {
      warnings.push('Initial conductor temperature cannot be negative.');
    }
    if (t.profile.type === 'dutyCycle' && (t.profile.dutyPct <= 0 || t.profile.dutyPct > 100)) {
      warnings.push('Duty cycle must be between 0 and 100%.');
    }
    return warnings;
  }

  /**
   * Run transient simulation using RK4 (fallback Euler if requested).
   */
  function runTransientSimulation(config) {
    var warnings = validateTransientConfig(config);
    var base = config.baseInputs;
    var heat = buildHeatTransferModel(base);
    if (!heat) {
      return { enabled: true, error: 'Advanced thermal constants unavailable.', warnings: warnings };
    }

    var mat = MATERIAL_PROPERTIES[base.material] || MATERIAL_PROPERTIES.copper;
    var massProps = computeConductorMass(base, mat, base.conductorDiaMm);
    if (massProps.heatCapacityJK <= 0) {
      warnings.push('Thermal mass is invalid — check conductor dimensions.');
    }

    var initialTemp = base.ambientTempC;
    if (config.transient.initialTempMode === 'steady' && global.PwaAdvancedThermal) {
      var steady = PwaAdvancedThermal.solveHeatBalance(base);
      if (steady && steady.tcAdvanced != null) initialTemp = steady.tcAdvanced;
    } else if (config.transient.initialTempMode === 'custom') {
      initialTemp = config.transient.initialTempCustom;
    }

    var durationSec = config.transient.durationMin * 60;
    var dt = config.transient.timestepSec;
    var steps = Math.ceil(durationSec / dt);
    if (steps > 90000) {
      warnings.push('Large simulation (' + steps + ' steps) — consider increasing timestep for faster results.');
    }

    var ctx = {
      baseCurrentA: base.currentA,
      profile: config.transient.profile,
      heat: heat,
      thermalMassJK: Math.max(massProps.heatCapacityJK, 0.001)
    };
    var dTdt = buildDerivativeFn(ctx);
    var integrate = config.transient.integrator === 'euler' ? eulerStep : rk4Step;

    var series = [];
    var tempC = initialTemp;
    var tSec = 0;
    var s;

    series.push({
      tSec: 0,
      tempC: round(tempC, 4),
      currentA: round(currentAtTimeSec(0, ctx.profile, ctx.baseCurrentA), 4),
      qGenW: round(heat.heatGenAt(tempC, currentAtTimeSec(0, ctx.profile, ctx.baseCurrentA)), 4),
      qLossW: round(heat.heatLossAt(tempC), 4)
    });

    for (s = 0; s < steps; s += 1) {
      tempC = integrate(tempC, tSec, dt, dTdt);
      tSec += dt;
      var iNow = currentAtTimeSec(tSec, ctx.profile, ctx.baseCurrentA);
      var qG = heat.heatGenAt(tempC, iNow);
      var qL = heat.heatLossAt(tempC);
      series.push({
        tSec: round(tSec, 3),
        tempC: round(tempC, 4),
        currentA: round(iNow, 4),
        qGenW: round(qG, 4),
        qLossW: round(qL, 4),
        qNetW: round(qG - qL, 4)
      });
    }

    var summary = computeSummary(series, config);
    return {
      enabled: true,
      warnings: warnings,
      config: config,
      massProperties: massProps,
      materialProperties: mat,
      initialTempC: round(initialTemp, 3),
      series: series,
      chartSeries: downsampleSeries(series, 2500),
      summary: summary,
      integrator: config.transient.integrator === 'euler' ? 'Forward Euler' : '4th Order Runge-Kutta',
      timestepSec: dt,
      durationMin: config.transient.durationMin
    };
  }

  function runSensitivityAnalysis(config, baseResult) {
    if (!baseResult || !baseResult.summary) return null;
    var variables = [
      { key: 'currentA', label: 'Current', apply: function (c, f) { c.baseInputs.currentA *= f; } },
      { key: 'airVelocityMs', label: 'Air Velocity', apply: function (c, f) { c.baseInputs.airVelocityMs *= f; } },
      { key: 'ambientTempC', label: 'Ambient Temperature', apply: function (c, f) { c.baseInputs.ambientTempC *= f; } },
      { key: 'emissivity', label: 'Emissivity', apply: function (c, f) { c.baseInputs.emissivity = Math.min(1, c.baseInputs.emissivity * f); } },
      { key: 'bundleLoading', label: 'Bundle Loading', apply: function (c, f) {
        c.baseInputs.adjacentLoadedWires = Math.max(1, Math.round(c.baseInputs.adjacentLoadedWires * f));
      } }
    ];
    var deltas = [-0.3, -0.2, -0.1, 0.1, 0.2, 0.3];
    var rows = [];
    var basePeak = baseResult.summary.peakTempC;
    var v;
    var d;
    var clone;
    var res;

    variables.forEach(function (variable) {
      deltas.forEach(function (delta) {
        clone = JSON.parse(JSON.stringify(config));
        variable.apply(clone, 1 + delta);
        res = runTransientSimulation(clone);
        rows.push({
          variable: variable.label,
          changePct: round(delta * 100, 0),
          peakTempC: res.summary ? res.summary.peakTempC : null,
          differenceC: res.summary ? round(res.summary.peakTempC - basePeak, 3) : null
        });
      });
    });

    return rows;
  }

  global.PwaTransientThermal = {
    DISCLAIMER: DISCLAIMER,
    MATERIAL_PROPERTIES: MATERIAL_PROPERTIES,
    MISSION_PROFILES: MISSION_PROFILES,
    round: round,
    buildHeatTransferModel: buildHeatTransferModel,
    computeConductorMass: computeConductorMass,
    currentAtTimeSec: currentAtTimeSec,
    runTransientSimulation: runTransientSimulation,
    runSensitivityAnalysis: runSensitivityAnalysis,
    formatDuration: formatDuration,
    downsampleSeries: downsampleSeries
  };
})(typeof window !== 'undefined' ? window : this);
