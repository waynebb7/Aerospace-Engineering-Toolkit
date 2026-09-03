(function () {
  'use strict';

  var DETAILS = window.EQUATION_REF_DETAILS;
  if (!DETAILS) return;

  var modal = document.getElementById('equationModal');
  if (!modal) return;

  var backdrop = modal.querySelector('.var-modal__backdrop');
  var closeBtn = modal.querySelector('.var-modal__close');
  var symbolEl = document.getElementById('eqModalSymbol');
  var diagramEl = document.getElementById('eqModalDiagram');
  var titleEl = document.getElementById('eqModalTitle');
  var explainEl = document.getElementById('eqModalExplain');
  var exampleEl = document.getElementById('eqModalExample');
  var diagrams = window.CIRCUIT_DIAGRAMS || {};

  function typeset(el) {
    if (window.MathJax && MathJax.Hub) {
      MathJax.Hub.Queue(['Typeset', MathJax.Hub, el]);
    }
  }

  function openDetail(id) {
    var data = DETAILS[id];
    if (!data) return;

    symbolEl.innerHTML = data.symbol;
    titleEl.textContent = data.title;
    explainEl.textContent = data.explain;
    exampleEl.innerHTML = data.example;

    if (diagramEl) {
      if (data.diagram && diagrams[data.diagram]) {
        diagramEl.innerHTML = diagrams[data.diagram];
        diagramEl.hidden = false;
      } else {
        diagramEl.innerHTML = '';
        diagramEl.hidden = true;
      }
    }

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    typeset(modal);
  }

  function closeDetail() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.variable-row[data-eq]').forEach(function (row) {
    row.addEventListener('click', function () {
      openDetail(row.getAttribute('data-eq'));
    });
  });

  closeBtn.addEventListener('click', closeDetail);
  backdrop.addEventListener('click', closeDetail);

  document.addEventListener('keydown', function (e) {
    if (!modal.hidden && e.key === 'Escape') closeDetail();
  });
})();
