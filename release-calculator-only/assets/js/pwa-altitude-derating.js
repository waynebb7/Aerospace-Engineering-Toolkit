(function (global) {
  'use strict';

  // AC 43.13-1B Fig 11-6 altitude derating curve.
  // factor = 0.7 + 0.3 * (1 - h/100)^1.5  where h = altitude (×1,000 ft)
  var FACTOR_FLOOR = 0.7;
  var FACTOR_CEIL = 1.0;
  var ALTITUDE_MAX_KFT = 100;
  var POWER_EXP = 1.5;

  function altitudeDeratingFactor(altitudeFt) {
    var kft = altitudeFt / 1000;
    if (!isFinite(kft) || kft <= 0) return FACTOR_CEIL;
    if (kft >= ALTITUDE_MAX_KFT) return FACTOR_FLOOR;

    var factor = FACTOR_FLOOR + (FACTOR_CEIL - FACTOR_FLOOR) *
      Math.pow(1 - kft / ALTITUDE_MAX_KFT, POWER_EXP);

    if (factor < FACTOR_FLOOR) return FACTOR_FLOOR;
    if (factor > FACTOR_CEIL) return FACTOR_CEIL;
    return factor;
  }

  global.PwaAltitudeDerating = {
    FACTOR_FLOOR: FACTOR_FLOOR,
    FACTOR_CEIL: FACTOR_CEIL,
    ALTITUDE_MAX_KFT: ALTITUDE_MAX_KFT,
    POWER_EXP: POWER_EXP,
    altitudeDeratingFactor: altitudeDeratingFactor
  };
})(typeof window !== 'undefined' ? window : this);
