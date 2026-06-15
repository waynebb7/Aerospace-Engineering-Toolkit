(function (global) {
  'use strict';

  // AC 43.13-1B Fig 11-5 bundle derating curves.
  // factor = ((w + c) / (1 + c))^(-k)  per bundle loading curve (20–100%).
  var BUNDLE_SHIFT = {
    20: { c: 9.23, k: 0.4165 },
    40: { c: 6.26, k: 0.4907 },
    60: { c: 3.838, k: 0.4733 },
    80: { c: 3.204, k: 0.5037 },
    100: { c: 1.679, k: 0.5143 }
  };

  var LOADING_CURVES = [20, 40, 60, 80, 100];

  function bundleDeratingFactor(wireCount, loadingPct) {
    var params = BUNDLE_SHIFT[loadingPct];
    if (!params) return 1;

    var wires = Math.round(wireCount);
    if (!isFinite(wires) || wires <= 1) return 1;

    var c = params.c;
    var k = params.k;
    var factor = Math.pow((wires + c) / (1 + c), -k);

    if (factor < 0.1) return 0.1;
    if (factor > 1) return 1;
    return factor;
  }

  global.PwaBundleDerating = {
    BUNDLE_SHIFT: BUNDLE_SHIFT,
    LOADING_CURVES: LOADING_CURVES,
    bundleDeratingFactor: bundleDeratingFactor
  };
})(typeof window !== 'undefined' ? window : this);
