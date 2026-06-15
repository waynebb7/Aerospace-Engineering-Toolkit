(function () {
  'use strict';

  var STORAGE_KEY = 'ek-digital-logic-progress';

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function updateSummary() {
    var items = document.querySelectorAll('[data-topic-id]');
    var checked = document.querySelectorAll('[data-topic-id] input[type="checkbox"]:checked');
    var summary = document.getElementById('dlProgressSummary');
    if (summary) {
      summary.textContent = checked.length + ' of ' + items.length + ' topics marked complete';
    }
  }

  function init() {
    var state = loadState();
    document.querySelectorAll('[data-topic-id]').forEach(function (item) {
      var id = item.getAttribute('data-topic-id');
      var checkbox = item.querySelector('input[type="checkbox"]');
      if (!checkbox || !id) return;
      checkbox.checked = !!state[id];
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          state[id] = true;
        } else {
          delete state[id];
        }
        saveState(state);
        updateSummary();
      });
    });

    var resetBtn = document.getElementById('dlProgressReset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (!window.confirm('Clear all progress marks on this device?')) return;
        localStorage.removeItem(STORAGE_KEY);
        document.querySelectorAll('[data-topic-id] input[type="checkbox"]').forEach(function (cb) {
          cb.checked = false;
        });
        updateSummary();
      });
    }

    updateSummary();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
