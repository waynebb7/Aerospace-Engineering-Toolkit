/**
 * Power Wire Analysis — Standards Traceability Matrix
 * Documentation-only module; does not affect calculator mathematics.
 *
 * Row data is loaded from #pwa-standards-traceability-data in the HTML page.
 * To update rows, edit assets/js/pwa-standards-traceability-data.json then run:
 *   node scripts/gen-traceability-static.js
 */
(function (global) {
  'use strict';

  var INTRO_TEXT =
    'This matrix maps each major calculator function, assumption and output to the relevant aerospace ' +
    'standard, advisory document or engineering basis. It is intended to improve reviewability, auditability ' +
    'and Design Authority traceability. It does not replace the applicable certification basis or formal ' +
    'compliance documentation.';

  var LEGEND_TEXT =
    'A = Directly standards-based\n' +
    'B = Derived from recognised aerospace practice\n' +
    'C = Engineering model / physics-based estimate\n' +
    'D = Conservative assumption requiring Design Authority acceptance\n' +
    'E = Requires test, inspection or project-specific validation';

  var LEGEND_DISCLAIMER =
    'This traceability matrix supports engineering review and auditability. It is not a declaration of ' +
    'compliance unless accepted under the applicable aircraft certification basis and Design Authority process.';

  var NON_COMPLIANCE_WARNING =
    'Standards references are provided for engineering traceability. Clause applicability depends on ' +
    'aircraft category, modification status, certification basis, customer requirements and Design Authority interpretation.';

  function loadStandardsTraceabilityRows() {
    var dataEl = document.getElementById('pwa-standards-traceability-data');
    if (dataEl && dataEl.textContent) {
      try {
        var parsed = JSON.parse(dataEl.textContent);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
      } catch (err) {
        /* fall through to empty array; static HTML table remains visible */
      }
    }
    return [];
  }

  var standardsTraceabilityRows = loadStandardsTraceabilityRows();

  var filterState = {
    level: 'all',
    referenceType: 'all',
    search: ''
  };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getTraceabilityBadgeClass(level) {
    var map = {
      A: 'pwa-trace-badge--level-a',
      B: 'pwa-trace-badge--level-b',
      C: 'pwa-trace-badge--level-c',
      D: 'pwa-trace-badge--level-d',
      E: 'pwa-trace-badge--level-e'
    };
    return 'pwa-trace-badge ' + (map[level] || 'pwa-trace-badge--level-b');
  }

  function getReferenceTypeBadgeClass(type) {
    var slug = String(type || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return 'pwa-trace-badge pwa-trace-badge--type-' + slug;
  }

  function filterStandardsTraceabilityRows(rows) {
    rows = rows || standardsTraceabilityRows;
    var search = filterState.search.trim().toLowerCase();
    return rows.filter(function (row) {
      if (filterState.level !== 'all' && row.traceabilityLevel !== filterState.level) {
        return false;
      }
      if (filterState.referenceType !== 'all' && row.referenceType !== filterState.referenceType) {
        return false;
      }
      if (!search) {
        return true;
      }
      var haystack = [
        row.functionName,
        row.toolAction,
        row.primaryReference,
        row.referenceType,
        row.traceabilityLevel,
        row.evidenceNotes,
        row.userAction
      ].join(' ').toLowerCase();
      return haystack.indexOf(search) !== -1;
    });
  }

  function updateTraceabilitySummaryCards(rows) {
    var cardsEl = document.getElementById('pwa-trace-summary-cards');
    if (!cardsEl) {
      return;
    }
    var total = rows.length;
    var standardsBased = rows.filter(function (r) { return r.traceabilityLevel === 'A'; }).length;
    var engineering = rows.filter(function (r) { return r.traceabilityLevel === 'C'; }).length;
    var assumptions = rows.filter(function (r) { return r.traceabilityLevel === 'D'; }).length;
    var validation = rows.filter(function (r) { return r.traceabilityLevel === 'E'; }).length;

    cardsEl.innerHTML =
      '<div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">' + total + '</span><span class="pwa-trace-summary-card__label">Total traceability items</span></div>' +
      '<div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">' + standardsBased + '</span><span class="pwa-trace-summary-card__label">Directly standards-based (A)</span></div>' +
      '<div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">' + engineering + '</span><span class="pwa-trace-summary-card__label">Engineering model (C)</span></div>' +
      '<div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">' + assumptions + '</span><span class="pwa-trace-summary-card__label">Assumption-driven (D)</span></div>' +
      '<div class="pwa-trace-summary-card"><span class="pwa-trace-summary-card__value">' + validation + '</span><span class="pwa-trace-summary-card__label">Test / validation required (E)</span></div>';
  }

  function renderTableRows(rows) {
    return rows.map(function (row) {
      return '<tr>' +
        '<th scope="row">' + escapeHtml(row.functionName) + '</th>' +
        '<td>' + escapeHtml(row.toolAction) + '</td>' +
        '<td>' + escapeHtml(row.primaryReference) + '</td>' +
        '<td><span class="' + getReferenceTypeBadgeClass(row.referenceType) + '">' + escapeHtml(row.referenceType) + '</span></td>' +
        '<td><span class="' + getTraceabilityBadgeClass(row.traceabilityLevel) + '">' + escapeHtml(row.traceabilityLevel) + '</span></td>' +
        '<td>' + escapeHtml(row.evidenceNotes) + '</td>' +
        '<td>' + escapeHtml(row.userAction) + '</td>' +
        '</tr>';
    }).join('');
  }

  function renderCardRows(rows) {
    return rows.map(function (row) {
      return '<article class="pwa-trace-card">' +
        '<h4 class="pwa-trace-card__title">' + escapeHtml(row.functionName) + '</h4>' +
        '<dl class="pwa-trace-card__grid">' +
        '<div><dt>What the tool does</dt><dd>' + escapeHtml(row.toolAction) + '</dd></div>' +
        '<div><dt>Primary reference</dt><dd>' + escapeHtml(row.primaryReference) + '</dd></div>' +
        '<div><dt>Reference type</dt><dd><span class="' + getReferenceTypeBadgeClass(row.referenceType) + '">' + escapeHtml(row.referenceType) + '</span></dd></div>' +
        '<div><dt>Traceability level</dt><dd><span class="' + getTraceabilityBadgeClass(row.traceabilityLevel) + '">' + escapeHtml(row.traceabilityLevel) + '</span></dd></div>' +
        '<div><dt>Evidence / notes</dt><dd>' + escapeHtml(row.evidenceNotes) + '</dd></div>' +
        '<div><dt>User action required</dt><dd>' + escapeHtml(row.userAction) + '</dd></div>' +
        '</dl></article>';
    }).join('');
  }

  function renderStandardsTraceabilityMatrix() {
    var rows = filterStandardsTraceabilityRows();
    var tableBody = document.getElementById('pwa-trace-table-body');
    var cardsEl = document.getElementById('pwa-trace-cards');
    var emptyEl = document.getElementById('pwa-trace-empty');

    updateTraceabilitySummaryCards(rows);

    if (!rows.length) {
      if (tableBody) tableBody.innerHTML = '';
      if (cardsEl) cardsEl.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (tableBody) tableBody.innerHTML = renderTableRows(rows);
    if (cardsEl) cardsEl.innerHTML = renderCardRows(rows);
  }

  function isIncludeInReport() {
    var el = document.getElementById('pwa-trace-include-report');
    return !el || el.checked;
  }

  function buildTraceabilityReportSection() {
    if (!isIncludeInReport()) {
      return null;
    }
    return {
      title: 'Standards Traceability Matrix',
      subtitle: 'Function-to-Standard Mapping for Aerospace Wire Analysis',
      intro: INTRO_TEXT,
      warning: NON_COMPLIANCE_WARNING,
      legend: LEGEND_TEXT,
      legendDisclaimer: LEGEND_DISCLAIMER,
      rows: standardsTraceabilityRows.slice()
    };
  }

  function getExportData() {
    return buildTraceabilityReportSection();
  }

  function bindFilters() {
    var levelEl = document.getElementById('pwa-trace-filter-level');
    var typeEl = document.getElementById('pwa-trace-filter-type');
    var searchEl = document.getElementById('pwa-trace-search');
    var reportEl = document.getElementById('pwa-trace-include-report');

    if (levelEl) {
      levelEl.addEventListener('change', function () {
        filterState.level = levelEl.value;
        renderStandardsTraceabilityMatrix();
      });
    }
    if (typeEl) {
      typeEl.addEventListener('change', function () {
        filterState.referenceType = typeEl.value;
        renderStandardsTraceabilityMatrix();
      });
    }
    if (searchEl) {
      searchEl.addEventListener('input', function () {
        filterState.search = searchEl.value;
        renderStandardsTraceabilityMatrix();
      });
    }
    if (reportEl) {
      reportEl.addEventListener('change', function () {
        /* export reads checkbox state at export time */
      });
    }
  }

  function initStandardsTraceabilityMatrix() {
    standardsTraceabilityRows = loadStandardsTraceabilityRows();
    bindFilters();
    renderStandardsTraceabilityMatrix();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStandardsTraceabilityMatrix);
  } else {
    initStandardsTraceabilityMatrix();
  }

  global.PwaStandardsTraceability = {
    INTRO_TEXT: INTRO_TEXT,
    LEGEND_TEXT: LEGEND_TEXT,
    LEGEND_DISCLAIMER: LEGEND_DISCLAIMER,
    NON_COMPLIANCE_WARNING: NON_COMPLIANCE_WARNING,
    standardsTraceabilityRows: standardsTraceabilityRows,
    initStandardsTraceabilityMatrix: initStandardsTraceabilityMatrix,
    renderStandardsTraceabilityMatrix: renderStandardsTraceabilityMatrix,
    filterStandardsTraceabilityRows: filterStandardsTraceabilityRows,
    updateTraceabilitySummaryCards: updateTraceabilitySummaryCards,
    getTraceabilityBadgeClass: getTraceabilityBadgeClass,
    getReferenceTypeBadgeClass: getReferenceTypeBadgeClass,
    buildTraceabilityReportSection: buildTraceabilityReportSection,
    getExportData: getExportData,
    isIncludeInReport: isIncludeInReport
  };
})(typeof window !== 'undefined' ? window : this);
