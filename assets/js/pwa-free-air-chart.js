(function () {
  'use strict';

  var MARGIN = { top: 48, right: 72, bottom: 56, left: 72 };
  var WIDTH = 920;
  var HEIGHT = 520;
  var DT_MIN = 30;
  var DT_MAX = 300;

  var CHARTS = {
    '11-4a': {
      title: 'FIGURE 11-4a. Single copper wire in free air.',
      currentMin: 4,
      currentMax: 100,
      currentTicks: [4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      markerId: 'pwa-free-air-marker-a',
      svgId: 'pwa-free-air-chart-svg-a'
    },
    '11-4b': {
      title: 'FIGURE 11-4b. Single copper wire in free air.',
      currentMin: 40,
      currentMax: 1000,
      currentTicks: [40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      markerId: 'pwa-free-air-marker-b',
      svgId: 'pwa-free-air-chart-svg-b'
    }
  };

  var LINE_COLORS = [
    '#111827', '#1e3a8a', '#166534', '#7c2d12', '#6b21a8',
    '#0f766e', '#b45309', '#be123c', '#4338ca'
  ];

  function log10(value) {
    return Math.log(value) / Math.LN10;
  }

  function svgEl(name, attrs, text) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(function (key) {
      el.setAttribute(key, attrs[key]);
    });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function xScaleLog(current, config, plotWidth) {
    var min = log10(config.currentMin);
    var max = log10(config.currentMax);
    return MARGIN.left + ((log10(current) - min) / (max - min)) * plotWidth;
  }

  function yScaleLog(deltaT, plotHeight) {
    var min = log10(DT_MIN);
    var max = log10(DT_MAX);
    return MARGIN.top + (1 - (log10(deltaT) - min) / (max - min)) * plotHeight;
  }

  function currentAtChartDeltaT(wire, deltaT) {
    return wire.freeAirRef *
      Math.pow(deltaT / PwaFreeAir.REF_DELTA_T, 1 / PwaFreeAir.POWER_EXP);
  }

  function wireLineStart(wire, config) {
    var iAt30 = currentAtChartDeltaT(wire, DT_MIN);
    if (iAt30 > config.currentMax) return null;
    if (iAt30 >= config.currentMin) {
      return { current: iAt30, deltaT: DT_MIN };
    }
    var deltaTAtMin = PwaFreeAir.chartTemperatureRise(wire.label, config.currentMin);
    if (deltaTAtMin < DT_MIN) return null;
    return { current: config.currentMin, deltaT: deltaTAtMin };
  }

  function wireLineEnd(wire, config) {
    var iTop = currentAtChartDeltaT(wire, DT_MAX);
    if (iTop <= config.currentMax) {
      return { current: iTop, deltaT: DT_MAX };
    }
    var current = config.currentMax;
    return {
      current: current,
      deltaT: PwaFreeAir.chartTemperatureRise(wire.label, current)
    };
  }

  function wireLabelAnchor(wire, config) {
    var labelDeltaT = 100;
    var current = currentAtChartDeltaT(wire, labelDeltaT);
    if (current < config.currentMin) {
      current = config.currentMin;
      labelDeltaT = PwaFreeAir.chartTemperatureRise(wire.label, current);
    } else if (current > config.currentMax) {
      current = config.currentMax;
      labelDeltaT = PwaFreeAir.chartTemperatureRise(wire.label, current);
    }
    if (labelDeltaT < DT_MIN) {
      return wireLineEnd(wire, config);
    }
    return { current: current, deltaT: Math.min(labelDeltaT, DT_MAX) };
  }

  function buildWirePath(wire, config, plotWidth, plotHeight) {
    var start = wireLineStart(wire, config);
    if (!start) return '';

    var end = wireLineEnd(wire, config);
    var iEnd = Math.min(config.currentMax, end.current);
    var parts = [
      'M' + xScaleLog(start.current, config, plotWidth).toFixed(2) +
      ' ' + yScaleLog(start.deltaT, plotHeight).toFixed(2)
    ];
    var steps = 100;
    var logStart = log10(start.current);
    var logEnd = log10(Math.max(start.current, iEnd));

    for (var s = 1; s <= steps; s += 1) {
      var current = Math.pow(10, logStart + (logEnd - logStart) * (s / steps));
      var deltaT = PwaFreeAir.chartTemperatureRise(wire.label, current);
      if (deltaT > DT_MAX) break;
      parts.push('L' + xScaleLog(current, config, plotWidth).toFixed(2) +
        ' ' + yScaleLog(deltaT, plotHeight).toFixed(2));
    }

    if (end.deltaT >= DT_MAX && end.current >= start.current) {
      parts.push('L' + xScaleLog(end.current, config, plotWidth).toFixed(2) +
        ' ' + yScaleLog(DT_MAX, plotHeight).toFixed(2));
    }

    return parts.join(' ');
  }

  function renderChart(chartId) {
    var svg = document.getElementById(CHARTS[chartId].svgId);
    var config = CHARTS[chartId];
    if (!svg || !window.PwaFreeAir) return;

    var plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    var plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    var wires = PwaFreeAir.wiresForChart(chartId);

    svg.setAttribute('viewBox', '0 0 ' + WIDTH + ' ' + HEIGHT);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', config.title);

    svg.innerHTML = '';
    svg.appendChild(svgEl('title', {}, config.title));

    svg.appendChild(svgEl('rect', {
      x: '0',
      y: '0',
      width: String(WIDTH),
      height: String(HEIGHT),
      fill: '#ffffff'
    }));

    svg.appendChild(svgEl('text', {
      x: String(WIDTH / 2),
      y: '24',
      'text-anchor': 'middle',
      class: 'pwa-bundle-chart__title'
    }, config.title));

    [30, 40, 50, 60, 70, 80, 90, 100, 200, 300].forEach(function (deltaT) {
      if (deltaT < DT_MIN || deltaT > DT_MAX) return;
      var y = yScaleLog(deltaT, plotHeight);
      var major = deltaT <= 100 ? deltaT % 10 === 0 : deltaT % 100 === 0;
      svg.appendChild(svgEl('line', {
        x1: String(MARGIN.left),
        y1: String(y),
        x2: String(MARGIN.left + plotWidth),
        y2: String(y),
        class: major ? 'pwa-bundle-chart__grid-major' : 'pwa-bundle-chart__grid-minor'
      }));
      if (major) {
        svg.appendChild(svgEl('text', {
          x: String(MARGIN.left - 10),
          y: String(y + 4),
          'text-anchor': 'end',
          class: 'pwa-bundle-chart__tick'
        }, String(deltaT)));
      }
    });

    config.currentTicks.forEach(function (current, idx) {
      var x = xScaleLog(current, config, plotWidth);
      var major = current <= 10 || current % 10 === 0;
      svg.appendChild(svgEl('line', {
        x1: String(x),
        y1: String(MARGIN.top),
        x2: String(x),
        y2: String(MARGIN.top + plotHeight),
        class: major ? 'pwa-bundle-chart__grid-major' : 'pwa-bundle-chart__grid-minor'
      }));
      if (major || idx === config.currentTicks.length - 1) {
        svg.appendChild(svgEl('text', {
          x: String(x),
          y: String(MARGIN.top + plotHeight + 18),
          'text-anchor': 'middle',
          class: 'pwa-bundle-chart__tick'
        }, String(current)));
      }
    });

    svg.appendChild(svgEl('line', {
      x1: String(MARGIN.left),
      y1: String(MARGIN.top + plotHeight),
      x2: String(MARGIN.left + plotWidth),
      y2: String(MARGIN.top + plotHeight),
      class: 'pwa-bundle-chart__axis'
    }));
    svg.appendChild(svgEl('line', {
      x1: String(MARGIN.left),
      y1: String(MARGIN.top),
      x2: String(MARGIN.left),
      y2: String(MARGIN.top + plotHeight),
      class: 'pwa-bundle-chart__axis'
    }));

    svg.appendChild(svgEl('text', {
      x: String(MARGIN.left + plotWidth / 2),
      y: String(HEIGHT - 12),
      'text-anchor': 'middle',
      class: 'pwa-bundle-chart__axis-label'
    }, 'CURRENT AMPERES'));

    svg.appendChild(svgEl('text', {
      transform: 'rotate(-90 ' + (MARGIN.left - 48) + ' ' + (MARGIN.top + plotHeight / 2) + ')',
      x: String(MARGIN.left - 48),
      y: String(MARGIN.top + plotHeight / 2),
      'text-anchor': 'middle',
      class: 'pwa-bundle-chart__axis-label'
    }, 'TEMPERATURE DIFFERENCE (WIRE RATING MINUS AMBIENT, °C)'));

    var clipId = 'pwa-free-air-clip-' + chartId;
    var defs = svgEl('defs', {});
    var clipPath = svgEl('clipPath', { id: clipId });
    clipPath.appendChild(svgEl('rect', {
      x: String(MARGIN.left),
      y: String(MARGIN.top),
      width: String(plotWidth),
      height: String(plotHeight)
    }));
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    var curvesGroup = svgEl('g', { 'clip-path': 'url(#' + clipId + ')' });
    var labelsGroup = svgEl('g', { class: 'pwa-free-air-chart__labels' });

    wires.forEach(function (wire, idx) {
      var color = LINE_COLORS[idx % LINE_COLORS.length];
      var pathD = buildWirePath(wire, config, plotWidth, plotHeight);
      if (!pathD) return;

      curvesGroup.appendChild(svgEl('path', {
        d: pathD,
        fill: 'none',
        stroke: color,
        'stroke-width': '1.75',
        class: 'pwa-bundle-chart__curve',
        'data-awg': wire.label
      }));

      var anchor = wireLabelAnchor(wire, config);
      labelsGroup.appendChild(svgEl('text', {
        x: String(xScaleLog(anchor.current, config, plotWidth) + 5),
        y: String(yScaleLog(anchor.deltaT, plotHeight) + 4),
        class: 'pwa-free-air-chart__wire-label',
        fill: color
      }, wire.chartLabel));
    });

    svg.appendChild(curvesGroup);
    svg.appendChild(labelsGroup);

    svg.appendChild(svgEl('circle', {
      id: config.markerId,
      class: 'pwa-bundle-chart__marker',
      r: '5',
      visibility: 'hidden'
    }));
  }

  function updateMarker(chartId, awgLabel, ambientTemp, conductorRating) {
    var config = CHARTS[chartId];
    var marker = document.getElementById(config.markerId);
    var wire = PwaFreeAir.findWire(awgLabel);
    if (!marker || !wire || wire.chart !== chartId) {
      if (marker) marker.setAttribute('visibility', 'hidden');
      return null;
    }

    var deltaT = PwaFreeAir.temperatureDifference(ambientTemp, conductorRating);
    var current = PwaFreeAir.freeAirCurrent(awgLabel, ambientTemp, conductorRating);
    if (!isFinite(deltaT) || deltaT <= 0 || !isFinite(current) || current <= 0) {
      marker.setAttribute('visibility', 'hidden');
      return null;
    }

    if (current < config.currentMin || current > config.currentMax ||
        deltaT < DT_MIN || deltaT > DT_MAX) {
      marker.setAttribute('visibility', 'hidden');
      return { wire: wire, deltaT: deltaT, current: current, inRange: false };
    }

    var plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    var plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    marker.setAttribute('cx', String(xScaleLog(current, config, plotWidth)));
    marker.setAttribute('cy', String(yScaleLog(deltaT, plotHeight)));
    marker.setAttribute('fill', '#b91c1c');
    marker.setAttribute('visibility', 'visible');
    return { wire: wire, deltaT: deltaT, current: current, inRange: true };
  }

  function formatNum(value, digits) {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  function initControls() {
    var awgEl = document.getElementById('pwa-free-air-chart-awg');
    var t1El = document.getElementById('pwa-free-air-chart-t1');
    var trPresetEl = document.getElementById('pwa-free-air-chart-tr-preset');
    var trCustomWrapEl = document.getElementById('pwa-free-air-chart-tr-custom-wrap');
    var trCustomEl = document.getElementById('pwa-free-air-chart-tr-custom');
    var valueEl = document.getElementById('pwa-free-air-chart-point-value');
    if (!awgEl || !t1El || !trPresetEl || !valueEl) return;

    function readConductorRating() {
      if (window.PwaConductorTrControls) {
        return PwaConductorTrControls.readConductorTempRating(trPresetEl, trCustomEl, 260);
      }
      return 260;
    }

    function refresh() {
      var awg = awgEl.value;
      var t1 = parseFloat(t1El.value, 10);
      var tr = readConductorRating();
      var wire = PwaFreeAir.findWire(awg);
      var markerA = updateMarker('11-4a', awg, t1, tr);
      var markerB = updateMarker('11-4b', awg, t1, tr);
      var marker = markerA || markerB;

      if (!wire || !marker || !isFinite(t1) || !isFinite(tr)) {
        valueEl.textContent = '—';
        return;
      }

      var deltaT = marker.deltaT;
      var current = marker.current;
      var label = wire.chartLabel;
      var rangeNote = marker.inRange
        ? ''
        : ' (operating point off this chart scale — see the other figure or adjust inputs)';

      valueEl.textContent =
        'AWG ' + label + ', ΔT = ' + formatNum(deltaT, 1) + ' °C → max free-air current ' +
        formatNum(current, 2) + ' A' + rangeNote;
    }

    if (window.PwaConductorTrControls) {
      PwaConductorTrControls.initConductorTempRatingControls({
        presetEl: trPresetEl,
        customWrapEl: trCustomWrapEl,
        customEl: trCustomEl,
        onChange: refresh
      });
    }

    awgEl.addEventListener('change', refresh);
    t1El.addEventListener('input', refresh);
    refresh();
  }

  function init() {
    renderChart('11-4a');
    renderChart('11-4b');
    initControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
