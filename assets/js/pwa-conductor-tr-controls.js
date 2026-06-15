(function (global) {
  'use strict';

  var PRESET_VALUES = ['135', '150', '200', '260'];

  function readConductorTempRating(presetEl, customEl, fallback) {
    if (presetEl && presetEl.value !== 'custom') {
      return parseFloat(presetEl.value, 10);
    }
    return customEl ? parseFloat(customEl.value, 10) : (fallback || 260);
  }

  function updateCustomVisibility(presetEl, wrapEl, customEl) {
    if (!presetEl || !wrapEl) return;

    var isCustom = presetEl.value === 'custom';
    wrapEl.hidden = !isCustom;
    if (customEl) {
      customEl.required = isCustom;
    }
  }

  function setConductorTempRating(presetEl, customEl, wrapEl, value) {
    if (!presetEl) return;

    var rating = String(value);
    if (PRESET_VALUES.indexOf(rating) !== -1) {
      presetEl.value = rating;
    } else {
      presetEl.value = 'custom';
      if (customEl) customEl.value = rating;
    }
    updateCustomVisibility(presetEl, wrapEl, customEl);
  }

  function initConductorTempRatingControls(options) {
    var presetEl = options.presetEl;
    var wrapEl = options.customWrapEl;
    var customEl = options.customEl;
    if (!presetEl) return;

    updateCustomVisibility(presetEl, wrapEl, customEl);
    presetEl.addEventListener('change', function () {
      updateCustomVisibility(presetEl, wrapEl, customEl);
      if (typeof options.onChange === 'function') options.onChange();
    });
    if (customEl) {
      customEl.addEventListener('input', function () {
        if (presetEl.value === 'custom' && typeof options.onChange === 'function') {
          options.onChange();
        }
      });
    }
  }

  global.PwaConductorTrControls = {
    PRESET_VALUES: PRESET_VALUES,
    readConductorTempRating: readConductorTempRating,
    updateCustomVisibility: updateCustomVisibility,
    setConductorTempRating: setConductorTempRating,
    initConductorTempRatingControls: initConductorTempRatingControls
  };
})(typeof window !== 'undefined' ? window : this);
