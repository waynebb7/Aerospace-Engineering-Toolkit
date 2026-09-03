(function (global) {
  'use strict';

  // AC 43.13-1B Fig 11-4a / 11-4b — single copper wire in free air.
  // Tabulated ampacity I_ref at reference ΔT = 210 °C (T_R = 260 °C, T_1 = 50 °C, ELA default).
  // Curves are parallel on log-log paper: ΔT = ΔT_ref × (I / I_ref)^b
  // Inverse (max free-air current): I = I_ref × (ΔT / ΔT_ref)^(1/b)
  var REF_DELTA_T = 210;
  var POWER_EXP = 2.0;

  var FREE_AIR_WIRES = [
    { label: '26', chart: '11-4a', chartLabel: '26', freeAirRef: 12 },
    { label: '24', chart: '11-4a', chartLabel: '24', freeAirRef: 16 },
    { label: '22', chart: '11-4a', chartLabel: '22', freeAirRef: 21 },
    { label: '20', chart: '11-4a', chartLabel: '20', freeAirRef: 28 },
    { label: '18', chart: '11-4a', chartLabel: '18', freeAirRef: 38 },
    { label: '16', chart: '11-4a', chartLabel: '16', freeAirRef: 40 },
    { label: '14', chart: '11-4a', chartLabel: '14', freeAirRef: 56 },
    { label: '12', chart: '11-4a', chartLabel: '12', freeAirRef: 71.5 },
    { label: '10', chart: '11-4a', chartLabel: '10', freeAirRef: 99 },
    { label: '8', chart: '11-4b', chartLabel: '8', freeAirRef: 160 },
    { label: '6', chart: '11-4b', chartLabel: '6', freeAirRef: 215 },
    { label: '4', chart: '11-4b', chartLabel: '4', freeAirRef: 295 },
    { label: '2', chart: '11-4b', chartLabel: '2', freeAirRef: 400 },
    { label: '1', chart: '11-4b', chartLabel: '1', freeAirRef: 460 },
    { label: '0', chart: '11-4b', chartLabel: '1/0', freeAirRef: 540 },
    { label: '00', chart: '11-4b', chartLabel: '2/0', freeAirRef: 630 },
    { label: '000', chart: '11-4b', chartLabel: '3/0', freeAirRef: 740 },
    { label: '0000', chart: '11-4b', chartLabel: '4/0', freeAirRef: 920 }
  ];

  var CHART_11_4A = '11-4a';
  var CHART_11_4B = '11-4b';

  function findWire(awgLabel) {
    for (var i = 0; i < FREE_AIR_WIRES.length; i += 1) {
      if (FREE_AIR_WIRES[i].label === String(awgLabel)) {
        return FREE_AIR_WIRES[i];
      }
    }
    return null;
  }

  function temperatureDifference(ambientTemp, conductorRating) {
    return conductorRating - ambientTemp;
  }

  function freeAirCurrent(awgLabel, ambientTemp, conductorRating) {
    var wire = findWire(awgLabel);
    if (!wire) return null;

    var deltaT = temperatureDifference(ambientTemp, conductorRating);
    if (!isFinite(deltaT) || deltaT <= 0) return 0;

    var current = wire.freeAirRef * Math.pow(deltaT / REF_DELTA_T, 1 / POWER_EXP);
    if (current < 0) return 0;
    return current;
  }

  function chartTemperatureRise(awgLabel, currentAmps) {
    var wire = findWire(awgLabel);
    if (!wire || !isFinite(currentAmps) || currentAmps <= 0) return 0;

    return REF_DELTA_T * Math.pow(currentAmps / wire.freeAirRef, POWER_EXP);
  }

  function wiresForChart(chartId) {
    return FREE_AIR_WIRES.filter(function (wire) {
      return wire.chart === chartId;
    });
  }

  global.PwaFreeAir = {
    REF_DELTA_T: REF_DELTA_T,
    POWER_EXP: POWER_EXP,
    FREE_AIR_WIRES: FREE_AIR_WIRES,
    CHART_11_4A: CHART_11_4A,
    CHART_11_4B: CHART_11_4B,
    findWire: findWire,
    temperatureDifference: temperatureDifference,
    freeAirCurrent: freeAirCurrent,
    chartTemperatureRise: chartTemperatureRise,
    wiresForChart: wiresForChart
  };
})(typeof window !== 'undefined' ? window : this);
