/**
 * Power Wire Analysis — Advanced Thermal Heat-Balance Model
 *
 * Supplementary physics-based conductor temperature estimation.
 * Does NOT replace or modify ARP4404 / AC 43.13 / AS50881 primary methodology.
 * All internal calculations use SI units unless noted.
 */
(function (global) {
  'use strict';

  var STEFAN_BOLTZMANN = 5.670374419e-8; // W/(m²·K⁴)
  var FT_TO_M = 0.3048;
  var ISA_SEA_LEVEL_PRESSURE = 101325; // Pa
  var ISA_SEA_LEVEL_TEMP = 288.15; // K
  var ISA_LAPSE_RATE = 0.0065; // K/m
  var ISA_GAS_CONSTANT = 287.05287; // J/(kg·K)
  var ISA_GRAVITY = 9.80665;
  var MAX_ALTITUDE_FT = 86000;
  var CONVERGENCE_TEMP_C = 0.01;
  var MAX_ITERATIONS = 100;

  var MATERIAL_ALPHA = {
    copper: 0.00393,
    aluminium: 0.00403
  };

  var SEA_LEVEL_DENSITY = 1.225;

  var INSTALLATION_TYPES = {
    freeAir: { label: 'Free Air', penalty: 1.00, hBase: 18, exposure: 1.0 },
    openHarness: { label: 'Open Harness', penalty: 1.05, hBase: 14, exposure: 0.85 },
    bundledHarness: { label: 'Bundled Harness', penalty: 1.15, hBase: 10, exposure: 0.55 },
    conduit: { label: 'Conduit', penalty: 1.25, hBase: 8, exposure: 0.40 },
    cableTray: { label: 'Cable Tray', penalty: 1.10, hBase: 12, exposure: 0.70 },
    structureClamped: { label: 'Structure Clamped', penalty: 0.95, hBase: 6, exposure: 0.35 }
  };

  var WIRE_POSITIONS = {
    outer: { label: 'Outer', factor: 1.00 },
    mid: { label: 'Mid', factor: 1.10 },
    centre: { label: 'Centre', factor: 1.20 }
  };

  var EMISSIVITY_PRESETS = {
    conservative: { label: 'Conservative Default (0.80)', value: 0.80 },
    ptfe: { label: 'PTFE (0.85)', value: 0.85 },
    etfe: { label: 'ETFE (0.90)', value: 0.90 },
    xletfe: { label: 'XL-ETFE (0.90)', value: 0.90 },
    custom: { label: 'Custom', value: null }
  };

  var INSULATION_K_PRESETS = {
    conservative: { label: 'Conservative Default (0.20 W/m·K)', value: 0.20 },
    ptfe: { label: 'PTFE (0.25 W/m·K)', value: 0.25 },
    etfe: { label: 'ETFE (0.24 W/m·K)', value: 0.24 },
    xletfe: { label: 'XL-ETFE (0.24 W/m·K)', value: 0.24 },
    custom: { label: 'Custom', value: null }
  };

  var THERMAL_CONTACT = {
    none: { label: 'None', kContactW: 0, gCondPerM: 0 },
    light: { label: 'Light', kContactW: 0.02, gCondPerM: 0.8 },
    moderate: { label: 'Moderate', kContactW: 0.05, gCondPerM: 2.0 },
    strong: { label: 'Strong', kContactW: 0.10, gCondPerM: 4.5 }
  };

  var DISCLAIMER =
    'This supplementary model estimates conductor temperature using electrical heat generation ' +
    'balanced against convection, radiation and conduction heat rejection. It provides a traceable ' +
    'physics-based engineering estimate for substantiation and sensitivity assessment, including ' +
    'installation-specific analysis. It does not replace the primary standards-based wire sizing ' +
    'calculation above or Design Authority approval.';

  function kelvin(celsius) {
    return celsius + 273.15;
  }

  function round(value, digits) {
    if (typeof value !== 'number' || !isFinite(value)) {
      return null;
    }
    var factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
  }

  /**
   * International Standard Atmosphere (ISA) — troposphere model.
   * Altitude input in feet; returns SI density (kg/m³) and pressure (Pa).
   */
  function computeIsaAtmosphere(altitudeFt) {
    var altitudeM = Math.max(0, altitudeFt) * FT_TO_M;
    var temperatureK;
    var pressurePa;

    if (altitudeM <= 11000) {
      temperatureK = ISA_SEA_LEVEL_TEMP - ISA_LAPSE_RATE * altitudeM;
      pressurePa = ISA_SEA_LEVEL_PRESSURE * Math.pow(
        temperatureK / ISA_SEA_LEVEL_TEMP,
        ISA_GRAVITY / (ISA_GAS_CONSTANT * ISA_LAPSE_RATE)
      );
    } else {
      temperatureK = 216.65;
      var pressure11 = ISA_SEA_LEVEL_PRESSURE * Math.pow(
        (ISA_SEA_LEVEL_TEMP - ISA_LAPSE_RATE * 11000) / ISA_SEA_LEVEL_TEMP,
        ISA_GRAVITY / (ISA_GAS_CONSTANT * ISA_LAPSE_RATE)
      );
      pressurePa = pressure11 * Math.exp(
        (-ISA_GRAVITY * (altitudeM - 11000)) / (ISA_GAS_CONSTANT * temperatureK)
      );
    }

    var density = pressurePa / (ISA_GAS_CONSTANT * temperatureK);
    return {
      altitudeFt: altitudeFt,
      altitudeM: altitudeM,
      temperatureK: temperatureK,
      temperatureC: temperatureK - 273.15,
      pressurePa: pressurePa,
      densityKgM3: density
    };
  }

  function estimateAdjacentLoadedWires(bundleWireCount, bundleLoadingPct) {
    var count = Math.max(0, bundleWireCount || 0);
    var loading = Math.max(0, Math.min(100, bundleLoadingPct || 0)) / 100;
    return Math.max(0, Math.round(count * loading));
  }

  function calculateAirDensityFromAltitude(altitudeFt) {
    return computeIsaAtmosphere(altitudeFt);
  }

  function calculateTemperatureCorrectedResistance(r20Ohms, alpha, tempC) {
    return resistanceAtTemp(r20Ohms, alpha, tempC);
  }

  function calculateWireSurfaceArea(odMm, lengthM) {
    return wireSurfaceAreaM2(odMm, lengthM, 1.0);
  }

  /** h = (5 + 10·√v) × √(ρ/ρ₀) — conservative natural/forced convection model. */
  function calculateConvectionCoeff(airVelocityMs, densityKgM3) {
    var hBase = 5 + 10 * Math.sqrt(Math.max(0, airVelocityMs));
    return hBase * Math.sqrt(Math.max(densityKgM3, 0.4) / SEA_LEVEL_DENSITY);
  }

  function calculateConvectionLoss(h, areaM2, tc, tamb) {
    return heatConvectionW(h, areaM2, tc, tamb);
  }

  function calculateRadiationLoss(emissivity, areaM2, tc, tSurC) {
    var tcK = kelvin(tc);
    var tSurK = kelvin(tSurC);
    return emissivity * STEFAN_BOLTZMANN * areaM2 * (Math.pow(tcK, 4) - Math.pow(tSurK, 4));
  }

  function calculateConductionLoss(kContactW, tc, tamb) {
    if (!kContactW || kContactW <= 0) {
      return 0;
    }
    return kContactW * Math.max(tc - tamb, 0);
  }

  function effectiveCombinedPenalty(inputs) {
    var install = INSTALLATION_TYPES[inputs.installationType] || INSTALLATION_TYPES.bundledHarness;
    var position = WIRE_POSITIONS[inputs.wirePosition] || WIRE_POSITIONS.centre;
    var adjacentPenalty = Math.min(1.5, 1 + 0.01 * Math.max(0, inputs.adjacentLoadedWires || 0));
    return install.penalty * position.factor * adjacentPenalty;
  }

  function wireSurfaceAreaM2(odAvgMm, lengthM, exposure) {
    var diameterM = Math.max(odAvgMm, 0.5) / 1000;
    return Math.PI * diameterM * Math.max(lengthM, 0.01) * Math.max(exposure, 0.1);
  }

  function resistanceAtTemp(r20Ohms, alpha, tempC) {
    return r20Ohms * (1 + alpha * (tempC - 20));
  }

  function heatGeneratedW(currentA, resistanceOhms) {
    return currentA * currentA * resistanceOhms;
  }

  function heatConvectionW(h, areaM2, tc, tamb) {
    var delta = tc - tamb;
    return h * areaM2 * Math.max(delta, 0);
  }

  function heatRadiationW(emissivity, areaM2, tc, tSurC) {
    return calculateRadiationLoss(emissivity, areaM2, tc, tSurC);
  }

  function heatConductionW(kContactW, tc, tamb) {
    return calculateConductionLoss(kContactW, tc, tamb);
  }

  function dominantMechanism(qConv, qRad, qCond) {
    var total = qConv + qRad + qCond;
    if (total <= 0) {
      return 'Mixed Mode';
    }
    var max = Math.max(qConv, qRad, qCond);
    if (max / total < 0.55) {
      return 'Mixed Mode';
    }
    if (max === qConv) {
      return 'Convection Dominated';
    }
    if (max === qRad) {
      return 'Radiation Dominated';
    }
    return 'Conduction Dominated';
  }

  function comparisonStatus(percentDiff) {
    var absPct = Math.abs(percentDiff);
    if (absPct < 5) {
      return 'Comparable';
    }
    if (absPct <= 15) {
      return 'Moderate difference';
    }
    return 'Significant difference';
  }

  function advancedResultStatus(tc, conductorRatingC, installationLimitC) {
    var ratingMargin = conductorRatingC - tc;
    var installMargin = installationLimitC != null ? installationLimitC - tc : Infinity;
    var minMargin = Math.min(ratingMargin, installMargin);
    var passRating = tc <= conductorRatingC;
    var passInstall = installationLimitC == null || tc <= installationLimitC;
    if (!passRating || !passInstall) {
      return 'FAIL';
    }
    if (minMargin < 10) {
      return 'WARNING';
    }
    return 'PASS';
  }

  function validateInputs(inputs) {
    var warnings = [];
    if (inputs.currentA <= 0) {
      warnings.push('Circuit current must be positive for advanced heat-balance analysis.');
    }
    if (inputs.r20Ohms <= 0) {
      warnings.push('Wire resistance is unavailable — check wire type and run length.');
    }
    if (inputs.airVelocityMs < 0) {
      warnings.push('Air velocity cannot be negative.');
    }
    if (inputs.emissivity <= 0 || inputs.emissivity > 1) {
      warnings.push('Emissivity must be greater than 0 and less than or equal to 1.');
    }
    if (inputs.insulationK <= 0) {
      warnings.push('Insulation thermal conductivity must be greater than 0.');
    }
    if (inputs.insulationThicknessMm <= 0) {
      warnings.push('Insulation thickness must be greater than 0.');
    }
    if (inputs.odAvgMm <= 0) {
      warnings.push('Wire outside diameter must be greater than 0.');
    }
    if (inputs.adjacentLoadedWires < 0) {
      warnings.push('Adjacent loaded wires must be zero or greater.');
    }
    if (inputs.altitudeFt > MAX_ALTITUDE_FT) {
      warnings.push('Altitude exceeds supported ISA model range (' + MAX_ALTITUDE_FT + ' ft).');
    }
    return warnings;
  }

  function calculateHeatBalanceResidual(tempC, inputs, ctx) {
    var r = calculateTemperatureCorrectedResistance(inputs.r20Ohms, ctx.alpha, tempC);
    var qGen = heatGeneratedW(inputs.currentA, r);
    var losses = ctx.lossesAt(tempC);
    return qGen - losses.total;
  }

  /**
   * Bisection solver: find Tc where Q_gen = Q_loss_effective within 0.01 °C.
   */
  function solveAdvancedConductorTemperature(inputs) {
    return solveHeatBalance(inputs);
  }

  function solveHeatBalance(inputs) {
    var warnings = validateInputs(inputs);
    var alpha = MATERIAL_ALPHA[inputs.material] || MATERIAL_ALPHA.copper;
    var contact = THERMAL_CONTACT[inputs.thermalContact] || THERMAL_CONTACT.none;
    var atmosphere = calculateAirDensityFromAltitude(inputs.altitudeFt);
    var lengthM = Math.max(inputs.runLengthM, 0.01);
    var areaM2 = calculateWireSurfaceArea(inputs.odAvgMm, lengthM);
    var h = calculateConvectionCoeff(inputs.airVelocityMs, atmosphere.densityKgM3);
    var kContactW = inputs.conservativeMode ? 0 : contact.kContactW;
    var combinedPenalty = effectiveCombinedPenalty(inputs);

    function lossesAt(tempC) {
      var qConv = calculateConvectionLoss(h, areaM2, tempC, inputs.ambientTempC);
      var qRad = calculateRadiationLoss(inputs.emissivity, areaM2, tempC, inputs.hotSurfaceTempC);
      var qCond = calculateConductionLoss(kContactW, tempC, inputs.ambientTempC);
      var rawTotal = qConv + qRad + qCond;
      return {
        qConv: qConv,
        qRad: qRad,
        qCond: qCond,
        total: rawTotal / combinedPenalty
      };
    }

    function balanceAt(tempC) {
      var r = calculateTemperatureCorrectedResistance(inputs.r20Ohms, alpha, tempC);
      var qGen = heatGeneratedW(inputs.currentA, r);
      var losses = lossesAt(tempC);
      return {
        qGen: qGen,
        losses: losses,
        residual: qGen - losses.total
      };
    }

    var ctx = { alpha: alpha, lossesAt: lossesAt };
    var tLow = inputs.ambientTempC;
    var tHigh = Math.max(300, inputs.conductorRatingC + 100, inputs.ambientTempC + 50);
    var lowBal = balanceAt(tLow);
    var highBal = balanceAt(tHigh);
    var converged = false;
    var iterations = 0;
    var tc = tHigh;

    if (lowBal.residual <= 0) {
      tc = tLow;
      converged = true;
    } else if (highBal.residual <= 0) {
      while (iterations < MAX_ITERATIONS && (tHigh - tLow) > CONVERGENCE_TEMP_C) {
        iterations += 1;
        tc = (tLow + tHigh) / 2;
        var midBal = balanceAt(tc);
        if (midBal.residual > 0) {
          tLow = tc;
        } else {
          tHigh = tc;
        }
      }
      converged = (tHigh - tLow) <= CONVERGENCE_TEMP_C;
      tc = (tLow + tHigh) / 2;
    } else {
      tc = tHigh;
      warnings.push('Advanced heat-balance model did not converge. Check inputs.');
    }

    if (!converged && iterations >= MAX_ITERATIONS) {
      warnings.push('Advanced heat-balance model did not converge within ' + MAX_ITERATIONS + ' iterations.');
    }

    var finalBal = balanceAt(tc);
    var ratingMargin = inputs.conductorRatingC - tc;
    var installLimit = inputs.installationLimitC;
    var installMargin = installLimit != null ? installLimit - tc : null;
    var existingRatingMargin = inputs.conductorRatingC - inputs.existingT2C;
    var existingInstallMargin = installLimit != null ? installLimit - inputs.existingT2C : null;
    var passFail = advancedResultStatus(tc, inputs.conductorRatingC, installLimit);

    return {
      enabled: true,
      converged: converged,
      iterations: iterations,
      warnings: warnings,
      awg: inputs.awg,
      wireTypeLabel: inputs.wireTypeLabel,
      tcAdvanced: round(tc, 3),
      existingT2: round(inputs.existingT2C, 3),
      differenceC: round(tc - inputs.existingT2C, 3),
      differencePct: inputs.existingT2C
        ? round(((tc - inputs.existingT2C) / inputs.existingT2C) * 100, 2)
        : null,
      comparisonStatus: inputs.existingT2C
        ? comparisonStatus(((tc - inputs.existingT2C) / inputs.existingT2C) * 100)
        : '—',
      ratingMarginC: round(ratingMargin, 3),
      installMarginC: installMargin != null ? round(installMargin, 3) : null,
      existingRatingMarginC: round(existingRatingMargin, 3),
      existingInstallMarginC: existingInstallMargin != null ? round(existingInstallMargin, 3) : null,
      thermalUtilisationPct: round((tc / inputs.conductorRatingC) * 100, 2),
      dominantMechanism: dominantMechanism(
        finalBal.losses.qConv,
        finalBal.losses.qRad,
        finalBal.losses.qCond
      ),
      heatBalance: {
        qGenW: round(finalBal.qGen, 4),
        qConvW: round(finalBal.losses.qConv, 4),
        qRadW: round(finalBal.losses.qRad, 4),
        qCondW: round(finalBal.losses.qCond, 4),
        qLossTotalW: round(finalBal.losses.total, 4),
        residualW: round(finalBal.residual, 4)
      },
      solver: {
        convectionCoeff: round(h, 3),
        combinedPenalty: round(combinedPenalty, 3),
        iterations: iterations,
        residualW: round(finalBal.residual, 4)
      },
      atmosphere: {
        densityKgM3: round(atmosphere.densityKgM3, 5),
        pressurePa: round(atmosphere.pressurePa, 1),
        pressureKPa: round(atmosphere.pressurePa / 1000, 3)
      },
      conservativeAuthorityMode: !!inputs.conservativeMode,
      passFail: passFail,
      inputs: inputs,
      assumptions: inputs.assumptions || []
    };
  }

  global.PwaAdvancedThermal = {
    DISCLAIMER: DISCLAIMER,
    INSTALLATION_TYPES: INSTALLATION_TYPES,
    WIRE_POSITIONS: WIRE_POSITIONS,
    EMISSIVITY_PRESETS: EMISSIVITY_PRESETS,
    INSULATION_K_PRESETS: INSULATION_K_PRESETS,
    THERMAL_CONTACT: THERMAL_CONTACT,
    MATERIAL_ALPHA: MATERIAL_ALPHA,
    MAX_ALTITUDE_FT: MAX_ALTITUDE_FT,
    computeIsaAtmosphere: computeIsaAtmosphere,
    calculateAirDensityFromAltitude: calculateAirDensityFromAltitude,
    estimateAdjacentLoadedWires: estimateAdjacentLoadedWires,
    solveHeatBalance: solveHeatBalance,
    solveAdvancedConductorTemperature: solveAdvancedConductorTemperature,
    comparisonStatus: comparisonStatus,
    round: round
  };
})(typeof window !== 'undefined' ? window : this);
