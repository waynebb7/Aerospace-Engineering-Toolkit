(function () {
  'use strict';

  var CURVE_COLOR = '#111827';
  var MARGIN = { top: 48, right: 48, bottom: 56, left: 72 };
  var WIDTH = 920;
  var HEIGHT = 520;
  var ALT_MIN_KFT = 0;
  var ALT_MAX_KFT = 100;
  var FACTOR_MIN = 0.7;
  var FACTOR_MAX = 1.0;

  function xScale(kft, plotWidth) {
    return MARGIN.left + ((kft - ALT_MIN_KFT) / (ALT_MAX_KFT - ALT_MIN_KFT)) * plotWidth;
  }

  function yScale(factor, plotHeight) {
    return MARGIN.top + (1 - (factor - FACTOR_MIN) / (FACTOR_MAX - FACTOR_MIN)) * plotHeight;
  }

  function svgEl(name, attrs, text) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(function (key) {
      el.setAttribute(key, attrs[key]);
    });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function buildPath(plotWidth, plotHeight) {
    var parts = [];
    for (var kft = ALT_MIN_KFT; kft <= ALT_MAX_KFT; kft += 0.5) {
      var factor = PwaAltitudeDerating.altitudeDeratingFactor(kft * 1000);
      var cmd = kft === ALT_MIN_KFT ? 'M' : 'L';
      parts.push(cmd + xScale(kft, plotWidth).toFixed(2) + ' ' + yScale(factor, plotHeight).toFixed(2));
    }
    return parts.join(' ');
  }

  function renderChart(svg) {
    if (!svg || !window.PwaAltitudeDerating) return;

    var plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    var plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

    svg.setAttribute('viewBox', '0 0 ' + WIDTH + ' ' + HEIGHT);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'AC 43.13 Figure 11-6 altitude derating curve');

    svg.appendChild(svgEl('title', {}, 'Altitude derating curve (AC 43.13 Fig 11-6)'));

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
    }, 'FIGURE 11-6. Altitude derating curve.'));

    for (var f = FACTOR_MIN; f <= FACTOR_MAX + 0.0001; f += 0.01) {
      var y = yScale(f, plotHeight);
      var major = Math.abs(f * 100 - Math.round(f * 100)) < 0.001 &&
        Math.abs(f * 20 - Math.round(f * 20)) < 0.001;
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
        }, f.toFixed(2)));
      }
    }

    for (var kft = ALT_MIN_KFT; kft <= ALT_MAX_KFT; kft += 2) {
      var x = xScale(kft, plotWidth);
      var xMajor = kft % 10 === 0;
      svg.appendChild(svgEl('line', {
        x1: String(x),
        y1: String(MARGIN.top),
        x2: String(x),
        y2: String(MARGIN.top + plotHeight),
        class: xMajor ? 'pwa-bundle-chart__grid-major' : 'pwa-bundle-chart__grid-minor'
      }));
      if (xMajor || kft === ALT_MAX_KFT) {
        svg.appendChild(svgEl('text', {
          x: String(x),
          y: String(MARGIN.top + plotHeight + 18),
          'text-anchor': 'middle',
          class: 'pwa-bundle-chart__tick'
        }, String(kft)));
      }
    }

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
    }, 'ALTITUDE (×1,000 FEET)'));

    svg.appendChild(svgEl('text', {
      transform: 'rotate(-90 ' + (MARGIN.left - 48) + ' ' + (MARGIN.top + plotHeight / 2) + ')',
      x: String(MARGIN.left - 48),
      y: String(MARGIN.top + plotHeight / 2),
      'text-anchor': 'middle',
      class: 'pwa-bundle-chart__axis-label'
    }, 'CURRENT DERATING FACTOR'));

    svg.appendChild(svgEl('path', {
      d: buildPath(plotWidth, plotHeight),
      fill: 'none',
      stroke: CURVE_COLOR,
      'stroke-width': '2.5',
      class: 'pwa-bundle-chart__curve'
    }));

    svg.appendChild(svgEl('circle', {
      id: 'pwa-altitude-chart-marker',
      class: 'pwa-bundle-chart__marker',
      r: '5',
      visibility: 'hidden'
    }));
  }

  function updateMarker(altitudeFt) {
    var marker = document.getElementById('pwa-altitude-chart-marker');
    var valueEl = document.getElementById('pwa-altitude-chart-point-value');
    if (!marker || !valueEl || !window.PwaAltitudeDerating) return;

    var ft = Math.round(parseFloat(altitudeFt, 10));
    if (!isFinite(ft) || ft < 0) ft = 0;
    if (ft > 100000) ft = 100000;

    var plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    var plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    var kft = ft / 1000;
    var factor = PwaAltitudeDerating.altitudeDeratingFactor(ft);
    var cx = xScale(Math.min(kft, ALT_MAX_KFT), plotWidth);
    var cy = yScale(factor, plotHeight);

    marker.setAttribute('cx', String(cx));
    marker.setAttribute('cy', String(cy));
    marker.setAttribute('fill', CURVE_COLOR);
    marker.setAttribute('visibility', 'visible');

    valueEl.textContent =
      ft.toLocaleString('en-US') + ' ft (' + kft.toFixed(1) + ' ×1,000 ft) → factor ' +
      factor.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }

  function initControls() {
    var altEl = document.getElementById('pwa-altitude-chart-ft');
    if (!altEl) return;

    function refresh() {
      updateMarker(altEl.value);
    }

    altEl.addEventListener('input', refresh);
    refresh();
  }

  function init() {
    renderChart(document.getElementById('pwa-altitude-chart-svg'));
    initControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
