(function () {
  'use strict';

  var CURVE_COLORS = {
    20: '#166534',
    40: '#1d6b40',
    60: '#2563eb',
    80: '#c2410c',
    100: '#b91c1c'
  };

  var MARGIN = { top: 48, right: 150, bottom: 56, left: 72 };
  var WIDTH = 920;
  var HEIGHT = 520;
  var WIRE_MIN = 1;
  var WIRE_MAX = 41;
  var FACTOR_MIN = 0.1;
  var FACTOR_MAX = 1;

  function xScale(wires, plotWidth) {
    return MARGIN.left + ((wires - WIRE_MIN) / (WIRE_MAX - WIRE_MIN)) * plotWidth;
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

  function buildPath(loadingPct, plotWidth, plotHeight) {
    var parts = [];
    for (var w = WIRE_MIN; w <= WIRE_MAX; w += 1) {
      var factor = PwaBundleDerating.bundleDeratingFactor(w, loadingPct);
      var cmd = w === WIRE_MIN ? 'M' : 'L';
      parts.push(cmd + xScale(w, plotWidth).toFixed(2) + ' ' + yScale(factor, plotHeight).toFixed(2));
    }
    return parts.join(' ');
  }

  function renderChart(svg) {
    if (!svg || !window.PwaBundleDerating) return;

    var plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    var plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

    svg.setAttribute('viewBox', '0 0 ' + WIDTH + ' ' + HEIGHT);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'AC 43.13 Figure 11-5 bundle derating curves');

    svg.appendChild(svgEl('title', {}, 'Bundle derating curves (AC 43.13 Fig 11-5)'));

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
    }, 'FIGURE 11-5. Bundle derating curves.'));

    for (var f = FACTOR_MIN; f <= FACTOR_MAX + 0.001; f += 0.1) {
      var y = yScale(f, plotHeight);
      var isMajor = Math.abs(f - Math.round(f * 10) / 10) < 0.001;
      svg.appendChild(svgEl('line', {
        x1: String(MARGIN.left),
        y1: String(y),
        x2: String(MARGIN.left + plotWidth),
        y2: String(y),
        class: isMajor ? 'pwa-bundle-chart__grid-major' : 'pwa-bundle-chart__grid-minor'
      }));
      if (isMajor) {
        svg.appendChild(svgEl('text', {
          x: String(MARGIN.left - 10),
          y: String(y + 4),
          'text-anchor': 'end',
          class: 'pwa-bundle-chart__tick'
        }, f.toFixed(1)));
      }
    }

    for (var w = WIRE_MIN; w <= WIRE_MAX; w += 1) {
      var x = xScale(w, plotWidth);
      svg.appendChild(svgEl('line', {
        x1: String(x),
        y1: String(MARGIN.top),
        x2: String(x),
        y2: String(MARGIN.top + plotHeight),
        class: w % 2 === 1 ? 'pwa-bundle-chart__grid-major' : 'pwa-bundle-chart__grid-minor'
      }));
      if (w % 2 === 1 || w === WIRE_MAX) {
        svg.appendChild(svgEl('text', {
          x: String(x),
          y: String(MARGIN.top + plotHeight + 18),
          'text-anchor': 'middle',
          class: 'pwa-bundle-chart__tick'
        }, String(w)));
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
    }, 'NUMBER OF WIRES IN BUNDLE'));

    svg.appendChild(svgEl('text', {
      transform: 'rotate(-90 ' + (MARGIN.left - 48) + ' ' + (MARGIN.top + plotHeight / 2) + ')',
      x: String(MARGIN.left - 48),
      y: String(MARGIN.top + plotHeight / 2),
      'text-anchor': 'middle',
      class: 'pwa-bundle-chart__axis-label'
    }, 'CURRENT DERATING FACTOR'));

    PwaBundleDerating.LOADING_CURVES.forEach(function (loadingPct, idx) {
      svg.appendChild(svgEl('path', {
        d: buildPath(loadingPct, plotWidth, plotHeight),
        fill: 'none',
        stroke: CURVE_COLORS[loadingPct],
        'stroke-width': '2',
        class: 'pwa-bundle-chart__curve',
        'data-loading': String(loadingPct)
      }));

      var legendY = MARGIN.top + 16 + idx * 22;
      var legendX = MARGIN.left + plotWidth + 24;
      svg.appendChild(svgEl('line', {
        x1: String(legendX),
        y1: String(legendY),
        x2: String(legendX + 28),
        y2: String(legendY),
        stroke: CURVE_COLORS[loadingPct],
        'stroke-width': '2'
      }));
      svg.appendChild(svgEl('text', {
        x: String(legendX + 34),
        y: String(legendY + 4),
        class: 'pwa-bundle-chart__legend'
      }, loadingPct + '% Loading'));
    });

    svg.appendChild(svgEl('circle', {
      id: 'pwa-bundle-chart-marker',
      class: 'pwa-bundle-chart__marker',
      r: '5',
      visibility: 'hidden'
    }));
  }

  function updateMarker(wireCount, loadingPct) {
    var marker = document.getElementById('pwa-bundle-chart-marker');
    var valueEl = document.getElementById('pwa-bundle-chart-point-value');
    if (!marker || !valueEl || !window.PwaBundleDerating) return;

    var wires = Math.round(parseFloat(wireCount, 10));
    var loading = parseInt(loadingPct, 10);
    if (!isFinite(wires) || wires < 1) wires = 1;
    if (wires > WIRE_MAX) wires = WIRE_MAX;

    var plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    var plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    var factor = PwaBundleDerating.bundleDeratingFactor(wires, loading);
    var cx = xScale(wires, plotWidth);
    var cy = yScale(factor, plotHeight);
    var color = CURVE_COLORS[loading] || '#0f2942';

    marker.setAttribute('cx', String(cx));
    marker.setAttribute('cy', String(cy));
    marker.setAttribute('fill', color);
    marker.setAttribute('visibility', 'visible');

    valueEl.textContent =
      wires + ' wires @ ' + loading + '% loading → factor ' +
      factor.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }

  function initControls() {
    var wireEl = document.getElementById('pwa-bundle-chart-wires');
    var loadEl = document.getElementById('pwa-bundle-chart-loading');
    if (!wireEl || !loadEl) return;

    function refresh() {
      updateMarker(wireEl.value, loadEl.value);
    }

    wireEl.addEventListener('input', refresh);
    loadEl.addEventListener('change', refresh);
    refresh();
  }

  function init() {
    renderChart(document.getElementById('pwa-bundle-chart-svg'));
    initControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
