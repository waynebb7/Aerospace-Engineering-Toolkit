(function () {
  'use strict';

  var LIVE_DEBOUNCE_MS = 350;
  var DEFAULT_PLACEHOLDER = 'Enter values and calculate.';

  function field(id) {
    return document.getElementById(id);
  }

  function fail(msg) {
    return { ok: false, msg: msg };
  }

  function pass(value) {
    return { ok: true, value: value };
  }

  function getPageFile() {
    var path = window.location.pathname.replace(/\\/g, '/');
    var parts = path.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  window.CalcFormat = {
    num: function (n, d) {
      var digits = typeof d === 'number' ? d : 3;
      if (typeof n !== 'number' || !isFinite(n)) return String(n);
      return n.toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    },
    line: function (label, val, unit) {
      var suffix = unit ? ' ' + unit : '';
      return String(label) + ': <strong>' + String(val) + suffix + '</strong>';
    },
    lines: function (arr) {
      return arr.join('<br>');
    }
  };

  window.CalcUtil = {
    showError: function (el, msg) {
      if (!el) return;
      el.innerHTML = '<span class="calc-error">' + escapeHtml(msg) + '</span>';
      el.setAttribute('aria-live', 'polite');
    },

    showResult: function (el, html) {
      if (!el) return;
      el.innerHTML = html;
      el.setAttribute('aria-live', 'polite');
    },

    showPlaceholder: function (el, msg) {
      if (!el) return;
      el.innerHTML = escapeHtml(msg || DEFAULT_PLACEHOLDER);
      el.removeAttribute('aria-live');
    },

    parse: function (id, label) {
      var el = field(id);
      if (!el) return fail(label + ' field not found.');
      var raw = String(el.value).trim();
      if (raw === '') return fail('Please enter ' + label + '.');
      var n = parseFloat(raw);
      if (isNaN(n)) return fail(label + ' must be a valid number.');
      return pass(n);
    },

    parseNonNegative: function (id, label) {
      var r = this.parse(id, label);
      if (!r.ok) return r;
      if (r.value < 0) return fail(label + ' cannot be negative.');
      return r;
    },

    parsePositive: function (id, label) {
      var r = this.parse(id, label);
      if (!r.ok) return r;
      if (r.value <= 0) return fail(label + ' must be greater than zero.');
      return r;
    },

    parseNonZero: function (id, label) {
      var r = this.parse(id, label);
      if (!r.ok) return r;
      if (r.value === 0) return fail(label + ' cannot be zero.');
      return r;
    },

    parsePowerFactor: function (id) {
      var r = this.parse(id, 'Power factor');
      if (!r.ok) return r;
      if (r.value <= 0 || r.value > 1) {
        return fail('Power factor must be between 0 and 1 (for example, 0.85).');
      }
      return r;
    },

    parseEfficiency: function (id, label) {
      var r = this.parse(id, label || 'Efficiency');
      if (!r.ok) return r;
      if (r.value <= 0 || r.value > 1) {
        return fail((label || 'Efficiency') + ' must be between 0 and 1 (for example, 0.9 for 90%).');
      }
      return r;
    },

    parseText: function (id, label) {
      var el = field(id);
      if (!el) return fail(label + ' field not found.');
      var raw = String(el.value).trim();
      if (raw === '') return fail('Please enter ' + label + '.');
      return pass(raw);
    },

    parseIntBase: function (id, label, base) {
      var r = this.parseText(id, label);
      if (!r.ok) return r;
      var n = parseInt(r.value, base);
      if (isNaN(n)) return fail('Please enter a valid ' + label + '.');
      return pass(n);
    },

    firstError: function () {
      for (var i = 0; i < arguments.length; i++) {
        if (!arguments[i].ok) return arguments[i];
      }
      return null;
    },

    hasEmptyInput: function (ids) {
      for (var i = 0; i < ids.length; i++) {
        var el = field(ids[i]);
        if (!el) continue;
        if (el.tagName === 'SELECT') continue;
        if (String(el.value).trim() === '') return true;
      }
      return false;
    }
  };

  function buildStepsHtml(steps) {
    return '<ol class="calc-help__steps">' +
      steps.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') +
      '</ol>';
  }

  function renderField(f) {
    var unit = f.unit ? '<span class="unit">' + escapeHtml(f.unit) + '</span>' : '';
    var label = '<label for="' + escapeHtml(f.id) + '">' + escapeHtml(f.label) + '</label>';

    if (f.type === 'select') {
      var opts = (f.options || []).map(function (o) {
        var sel = f.value !== undefined && String(f.value) === String(o.value) ? ' selected' : '';
        return '<option value="' + escapeHtml(o.value) + '"' + sel + '>' + escapeHtml(o.label) + '</option>';
      }).join('');
      return label +
        '<select id="' + escapeHtml(f.id) + '" class="calc-select">' + opts + '</select>' +
        unit;
    }

    if (f.type === 'text') {
      return label +
        '<input type="text" id="' + escapeHtml(f.id) + '" value="' + escapeHtml(f.value || '') + '">' +
        unit;
    }

    var stepAttr = f.step ? ' step="' + escapeHtml(f.step) + '"' : '';
    var inputMode = f.type === 'number' ? ' inputmode="decimal"' : '';
    return label +
      '<input type="number" id="' + escapeHtml(f.id) + '" value="' + escapeHtml(f.value || '') + '"' +
      stepAttr + inputMode + '>' +
      unit;
  }

  function symToLatex(sym) {
    var specials = {
      '\u03B8': '\\theta',
      '\u03B7': '\\eta',
      '\u00B0': '^{\\circ}'
    };
    if (specials[sym]) return specials[sym];
    if (sym.indexOf('_') !== -1) {
      var parts = sym.split('_');
      return parts[0] + '_{' + parts.slice(1).join('_') + '}';
    }
    return sym;
  }

  function renderLegend(variables) {
    if (!variables || !variables.length) return '';
    var items = variables.map(function (v) {
      var latex = symToLatex(v.sym);
      return (
        '<li class="calc-reference__legend-item">' +
          '<span class="calc-reference__sym">\\( ' + latex + ' \\)</span>' +
          '<span class="calc-reference__desc">= ' + escapeHtml(v.desc) + '</span>' +
        '</li>'
      );
    }).join('');
    return '<ul class="calc-reference__legend">' + items + '</ul>';
  }

  function renderFormulaContent(formula) {
    if (!formula) return '';
    if (formula.indexOf('$$') !== -1) {
      return '<div class="math-container">' + formula + '</div>';
    }
    return '<p class="calc-reference__formula-text">' + escapeHtml(formula) + '</p>';
  }

  function renderReferenceBlock(def) {
    if (!def.formula || !def.reference) return '';

    var ref = def.reference;
    return (
      '<details class="calc-reference">' +
        '<summary class="calc-reference__toggle">' +
          '<span class="calc-reference__toggle-show">Show formula</span>' +
          '<span class="calc-reference__toggle-hide">Hide formula</span>' +
        '</summary>' +
        '<div class="calc-reference__panel">' +
          '<p class="calc-reference__summary">' + escapeHtml(ref.summary) + '</p>' +
          renderFormulaContent(def.formula) +
          renderLegend(ref.variables) +
        '</div>' +
      '</details>'
    );
  }

  function siteRoot() {
    var css = document.querySelector('link[href*="corporate.css"]');
    if (css) {
      var href = css.getAttribute('href') || '';
      return href.replace(/assets\/css\/corporate\.css(?:\?.*)?$/i, '');
    }
    return '../../';
  }

  function renderReferenceDocumentsBlock(def) {
    var refs = def.references;
    if (!refs || !refs.length) return '';

    var root = siteRoot();
    var count = refs.length;
    var items = refs.map(function (r) {
      var href = root + r.file;
      var note = r.note
        ? '<span class="calc-docs__note">' + escapeHtml(r.note) + '</span>'
        : '';
      return (
        '<li class="calc-docs__item">' +
          '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener">' +
            escapeHtml(r.title) +
          '</a>' +
          note +
        '</li>'
      );
    }).join('');

    return (
      '<details class="calc-docs">' +
        '<summary class="calc-docs__toggle">' +
          '<span class="calc-docs__toggle-show">Reference documents (' + count + ')</span>' +
          '<span class="calc-docs__toggle-hide">Hide reference documents</span>' +
        '</summary>' +
        '<div class="calc-docs__panel">' +
          '<ul class="calc-docs__list">' + items + '</ul>' +
          '<p class="calc-docs__library">' +
            '<a href="' + escapeHtml(root + 'reference/documents/index.html') + '">Browse document library</a>' +
          '</p>' +
        '</div>' +
      '</details>'
    );
  }

  function wireReference(panel) {
    var details = panel.querySelector('.calc-reference');
    if (!details) return;

    details.addEventListener('toggle', function () {
      if (details.open) {
        var refPanel = details.querySelector('.calc-reference__panel');
        if (refPanel && window.MathJax && MathJax.Hub) {
          MathJax.Hub.Queue(['Typeset', MathJax.Hub, refPanel]);
        }
      }
    });
  }

  function hubHref() {
    var css = document.querySelector('link[href*="corporate.css"]');
    if (css) {
      var href = css.getAttribute('href') || '';
      if (href.indexOf('assets/') !== -1) {
        return href.replace(/assets\/css\/corporate\.css/i, 'index.html');
      }
    }
    return '../../index.html';
  }

  function renderShell(def) {
    var fieldsHtml = def.fields.map(renderField).join('\n                ');
    var referenceBlock = renderReferenceBlock(def);
    var documentsBlock = renderReferenceDocumentsBlock(def);
    var sectionTitle = def.fieldsSectionTitle || 'Enter Values';
    var liveOn = def.liveRecalc !== false;
    var buttonBlock = liveOn
      ? ''
      : '<button type="button" class="btn--block" data-calc-run>' + escapeHtml(def.buttonLabel || 'Calculate') + '</button>';

    return (
      '<div class="page-container page-container--calculator">' +
        '<a href="' + escapeHtml(hubHref()) + '" class="back-link">&larr; Back to Hub</a>' +
        '<div class="calculator-panel" data-calc-panel="' + escapeHtml(def.file) + '">' +
          '<h1>' + escapeHtml(def.title) + '</h1>' +
          '<p class="calc-lead">' + escapeHtml(def.lead) + '</p>' +
          documentsBlock +
          referenceBlock +
          '<h2>' + escapeHtml(sectionTitle) + '</h2>' +
          '<div class="input-container">' + fieldsHtml + '</div>' +
          buttonBlock +
          '<h2>Result</h2>' +
          '<p id="result" class="result-display' + (def.resultClass ? ' ' + def.resultClass : '') + '" aria-live="polite">' + escapeHtml(def.placeholder || DEFAULT_PLACEHOLDER) + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function typesetMath() {
    if (window.MathJax && MathJax.Hub) {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    }
  }

  function ensureMathJax(callback) {
    if (window.MathJax && MathJax.Hub) {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML';
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  }

  function normalizeHelpStep(step, def) {
    if (def.liveRecalc === false) return step;
    var trimmed = String(step).trim();
    if (/^Press Calculate\.?$/i.test(trimmed)) {
      return 'The result updates automatically as you enter values.';
    }
    if (/^Press Convert\.?$/i.test(trimmed)) {
      return 'The converted value updates automatically as you enter values.';
    }
    if (/^Press Generate\.?$/i.test(trimmed)) {
      return 'The truth table appears automatically when you select a gate.';
    }
    if (/^Press Decode to read the resistance\.?$/i.test(trimmed)) {
      return 'The decoded resistance appears automatically as you select bands.';
    }
    var match = trimmed.match(/^Press Calculate for (.+?)\.?$/i);
    if (match) {
      return 'The result shows ' + match[1] + ' automatically as you enter values.';
    }
    match = trimmed.match(/^Press Calculate to get (.+?)\.?$/i);
    if (match) {
      return 'The result shows ' + match[1] + ' automatically as you enter values.';
    }
    match = trimmed.match(/^Press Calculate — (.+?)\.?$/i);
    if (match) {
      return match[1] + ' — updates automatically as you enter values.';
    }
    return step;
  }

  function helpSteps(def) {
    if (!def.help || !def.help.steps) return [];
    return def.help.steps.map(function (step) {
      return normalizeHelpStep(step, def);
    });
  }

  function wireHelp(def, panel) {
    if (!def.help) return;

    var lead = panel.querySelector('.calc-lead');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'calc-help-btn';
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.textContent = 'How to use this calculator';

    if (lead) {
      lead.insertAdjacentElement('afterend', btn);
    } else {
      var h1 = panel.querySelector('h1');
      if (h1) h1.insertAdjacentElement('afterend', btn);
    }

    var modal = document.createElement('div');
    modal.id = 'calcHelpModal';
    modal.className = 'var-modal calc-help-modal';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'calcHelpTitle');
    modal.innerHTML =
      '<div class="var-modal__backdrop"></div>' +
      '<div class="var-modal__dialog">' +
        '<button type="button" class="var-modal__close" aria-label="Close">&times;</button>' +
        '<h2 id="calcHelpTitle">' + escapeHtml(def.help.title || def.title) + '</h2>' +
        '<section class="calc-help__section"><h3>What does it do?</h3><p>' + escapeHtml(def.help.what) + '</p></section>' +
        '<section class="calc-help__section"><h3>When should I use it?</h3><p>' + escapeHtml(def.help.when) + '</p></section>' +
        '<section class="calc-help__section"><h3>How to use it (step by step)</h3>' + buildStepsHtml(helpSteps(def)) + '</section>' +
        '<section class="calc-help__example"><h3>Quick example</h3><p>' + escapeHtml(def.help.example) + '</p></section>' +
      '</div>';

    document.body.appendChild(modal);

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      modal.querySelector('.var-modal__close').focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openModal);
    modal.querySelector('.var-modal__close').addEventListener('click', closeModal);
    modal.querySelector('.var-modal__backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (!modal.hidden && e.key === 'Escape') closeModal();
    });
  }

  var CalcEngine = {
    resolveId: function () {
      var explicit = document.body.getAttribute('data-calc');
      if (explicit) return explicit;
      if (!window.CalcRegistry) return null;
      return CalcRegistry.byFile[getPageFile()] || null;
    },

    getDef: function () {
      var id = this.resolveId();
      if (!id || !window.CalcRegistry) return null;
      return CalcRegistry.defs[id] || null;
    },

    run: function (def, options) {
      options = options || {};
      var out = document.getElementById('result');
      if (!out || typeof def.compute !== 'function') return;

      var fieldIds = (def.fields || []).map(function (f) { return f.id; });
      if (options.live && CalcUtil.hasEmptyInput(fieldIds)) {
        CalcUtil.showPlaceholder(out, def.placeholder || DEFAULT_PLACEHOLDER);
        return;
      }

      var ctx = {
        util: CalcUtil,
        fmt: CalcFormat,
        fail: function (msg) { return { ok: false, msg: msg }; },
        ok: function (html) { return { ok: true, html: html }; }
      };

      var result;
      try {
        result = def.compute(ctx);
      } catch (e) {
        CalcUtil.showError(out, 'Something went wrong. Please check your inputs.');
        return;
      }

      if (!result || !result.ok) {
        if (options.live) {
          CalcUtil.showPlaceholder(out, def.placeholder || DEFAULT_PLACEHOLDER);
          return;
        }
        CalcUtil.showError(out, (result && result.msg) || 'Could not calculate a result.');
        return;
      }

      CalcUtil.showResult(out, result.html);
    },

    wireLiveRecalc: function (def, panel) {
      if (def.liveRecalc === false) return;

      var timer = null;
      var inputs = panel.querySelectorAll('input, select');
      var self = this;

      function schedule() {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          self.run(def, { live: true });
        }, LIVE_DEBOUNCE_MS);
      }

      inputs.forEach(function (el) {
        el.addEventListener('input', schedule);
        el.addEventListener('change', schedule);
      });
    },

    init: function () {
      if (!document.body.classList.contains('calculator-page')) return;

      var def = this.getDef();
      if (!def) return;

      document.title = def.title + ' | Engineering Knowledge';

      var mount = document.querySelector('.page-container--calculator');
      if (!mount) {
        var main = document.querySelector('.site-main') || document.body;
        var wrapper = document.createElement('div');
        wrapper.innerHTML = renderShell(def);
        main.appendChild(wrapper.firstChild);
        mount = document.querySelector('.page-container--calculator');
      } else if (!mount.querySelector('.calculator-panel') || mount.getAttribute('data-calc-mounted') !== 'true') {
        mount.outerHTML = renderShell(def);
        mount = document.querySelector('.page-container--calculator');
      }

      var panel = document.querySelector('.calculator-panel');
      if (!panel) return;
      if (mount) mount.setAttribute('data-calc-mounted', 'true');

      if (typeof def.onInit === 'function') {
        def.onInit();
      }

      wireHelp(def, panel);
      wireReference(panel);

      var runBtn = panel.querySelector('[data-calc-run]') || panel.querySelector('.btn--block');
      if (runBtn) {
        runBtn.addEventListener('click', this.run.bind(this, def, { live: false }));
      }

      this.wireLiveRecalc(def, panel);

      if (def.formula) {
        ensureMathJax(function () {
          var openRef = panel.querySelector('.calc-reference[open] .math-container');
          if (openRef) {
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, openRef]);
          }
        });
      }

      if (def.liveRecalc !== false) {
        this.run(def, { live: true });
      }
    }
  };

  window.CalcEngine = CalcEngine;

  function boot() {
    if (!window.CalcRegistry) {
      setTimeout(boot, 20);
      return;
    }
    CalcEngine.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
