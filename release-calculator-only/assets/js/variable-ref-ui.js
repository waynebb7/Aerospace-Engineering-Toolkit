(function () {
  'use strict';

  var DETAILS = window.VARIABLE_REF_DETAILS;
  if (!DETAILS) return;

  var modal = document.getElementById('variableModal');
  if (!modal) return;

  var backdrop = modal.querySelector('.var-modal__backdrop');
  var closeBtn = modal.querySelector('.var-modal__close');
  var symbolEl = document.getElementById('modalSymbol');
  var titleEl = document.getElementById('modalTitle');
  var explainEl = document.getElementById('modalExplain');
  var exampleEl = document.getElementById('modalExample');

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

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
    typeset(modal);
  }

  function closeDetail() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.variable-row[data-var]').forEach(function (row) {
    row.addEventListener('click', function () {
      openDetail(row.getAttribute('data-var'));
    });
  });

  closeBtn.addEventListener('click', closeDetail);
  backdrop.addEventListener('click', closeDetail);

  document.addEventListener('keydown', function (e) {
    if (!modal.hidden && e.key === 'Escape') closeDetail();
  });
})();
