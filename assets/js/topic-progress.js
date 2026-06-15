(function () {
  'use strict';

  var STORAGE_KEY = 'ek-topic-progress';

  var COMPREHENSION_LEVELS = [
    { value: '', label: 'Not assessed' },
    { value: 'review', label: 'Need to review' },
    { value: 'partial', label: 'Partially understood' },
    { value: 'understood', label: 'Understood' },
    { value: 'mastered', label: 'Confident / mastered' }
  ];

  function getScriptBase() {
    var el = document.querySelector('script[src*="topic-progress.js"], script[src*="site-layout.js"]');
    if (el) {
      var src = el.getAttribute('src') || '';
      var fromProgress = src.replace(/(?:assets\/)?js\/topic-progress\.js(\?.*)?$/, '');
      if (fromProgress !== src) return fromProgress;
      var fromLayout = src.replace(/(?:assets\/)?js\/site-layout\.js(\?.*)?$/, '');
      if (fromLayout !== src) return fromLayout;
    }
    var path = window.location.pathname.replace(/\\/g, '/');
    if (path.endsWith('/')) return path;
    var slash = path.lastIndexOf('/');
    return slash >= 0 ? path.slice(0, slash + 1) : '/';
  }

  function loadCatalogData() {
    if (window.EK_TOPIC_CATALOG && window.EK_TOPIC_CATALOG.catalogs) {
      return Promise.resolve(window.EK_TOPIC_CATALOG);
    }
    var base = getScriptBase();
    return fetch(base + 'assets/js/topic-catalog.json', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load catalog');
        return res.json();
      });
  }

  function getTopicIdFromPath() {
    var path = window.location.pathname.replace(/\\/g, '/');
    if (path.charAt(0) === '/') path = path.slice(1);
    var learnIdx = path.indexOf('learn/');
    if (learnIdx !== -1) {
      return path.slice(learnIdx);
    }
    var parts = path.split('/').filter(Boolean);
    var file = parts[parts.length - 1] || 'index.html';
    if (parts.length >= 2) {
      var parent = parts[parts.length - 2];
      if (parent === 'quantum' || parent === 'basic_physics' || parent === 'logic_and_digital_math') {
        return parent + '/' + file;
      }
    }
    return file;
  }

  function loadAll() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveAll(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('ek-progress-updated', { detail: { all: data } }));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  }

  function getTopic(id) {
    var all = loadAll();
    return all[id] || { read: false, comprehension: '' };
  }

  function setTopic(id, patch) {
    var all = loadAll();
    var current = all[id] || { read: false, comprehension: '' };
    all[id] = {
      read: patch.read !== undefined ? patch.read : current.read,
      comprehension: patch.comprehension !== undefined ? patch.comprehension : current.comprehension
    };
    if (!all[id].read && patch.comprehension === undefined) {
      all[id].comprehension = '';
    }
    saveAll(all);
    return all[id];
  }

  function statusLabel(entry) {
    if (!entry.read) return 'Not read';
    var level = COMPREHENSION_LEVELS.find(function (l) { return l.value === entry.comprehension; });
    if (!level || !level.value) return 'Read — not assessed';
    return level.label;
  }

  function statusClass(entry) {
    if (!entry.read) return 'progress-status--unread';
    if (entry.comprehension === 'review') return 'progress-status--review';
    if (entry.comprehension === 'partial') return 'progress-status--partial';
    if (entry.comprehension === 'understood') return 'progress-status--understood';
    if (entry.comprehension === 'mastered') return 'progress-status--mastered';
    return 'progress-status--read';
  }

  function buildComprehensionOptions(selected) {
    return COMPREHENSION_LEVELS.map(function (level) {
      var sel = level.value === selected ? ' selected' : '';
      return '<option value="' + level.value + '"' + sel + '>' + level.label + '</option>';
    }).join('');
  }

  function buildControlsHtml(id, entry, compact) {
    var disabled = entry.read ? '' : ' disabled';
    return (
      '<div class="topic-progress-controls' + (compact ? ' topic-progress-controls--compact' : '') + '" data-topic-id="' + id + '">' +
        '<label class="topic-progress-read">' +
          '<input type="checkbox" class="topic-progress-read-input" data-topic-id="' + id + '"' +
            (entry.read ? ' checked' : '') + ' />' +
          '<span>I have read this topic</span>' +
        '</label>' +
        '<label class="topic-progress-comprehension-label">' +
          '<span>Comprehension</span>' +
          '<select class="topic-progress-comprehension-input" data-topic-id="' + id + '"' + disabled + '>' +
            buildComprehensionOptions(entry.comprehension) +
          '</select>' +
        '</label>' +
        '<span class="topic-progress-status ' + statusClass(entry) + '">' + statusLabel(entry) + '</span>' +
      '</div>'
    );
  }

  function bindControls(root) {
    root.querySelectorAll('.topic-progress-read-input').forEach(function (input) {
      input.addEventListener('change', function () {
        var id = input.getAttribute('data-topic-id');
        var entry = setTopic(id, { read: input.checked });
        if (!entry.read) {
          setTopic(id, { comprehension: '' });
        }
        refreshControls(root, id);
        refreshPageWidget();
      });
    });

    root.querySelectorAll('.topic-progress-comprehension-input').forEach(function (select) {
      select.addEventListener('change', function () {
        var id = select.getAttribute('data-topic-id');
        setTopic(id, { comprehension: select.value, read: true });
        var readInput = root.querySelector('.topic-progress-read-input[data-topic-id="' + id + '"]');
        if (readInput) readInput.checked = true;
        refreshControls(root, id);
        refreshPageWidget();
      });
    });
  }

  function refreshControls(root, id) {
    var entry = getTopic(id);
    var block = root.querySelector('.topic-progress-controls[data-topic-id="' + id + '"]');
    if (!block) return;
    var readInput = block.querySelector('.topic-progress-read-input');
    var select = block.querySelector('.topic-progress-comprehension-input');
    var status = block.querySelector('.topic-progress-status');
    if (readInput) readInput.checked = !!entry.read;
    if (select) {
      select.value = entry.comprehension || '';
      select.disabled = !entry.read;
    }
    if (status) {
      status.className = 'topic-progress-status ' + statusClass(entry);
      status.textContent = statusLabel(entry);
    }
  }

  function mountPageWidget() {
    if (!document.body.classList.contains('content-page')) return;
    var hero = document.querySelector('.content-hero');
    if (!hero || hero.querySelector('.topic-progress-panel')) return;

    var id = getTopicIdFromPath();
    var entry = getTopic(id);
    var base = getScriptBase();

    var panel = document.createElement('div');
    panel.className = 'topic-progress-panel';
    panel.innerHTML =
      '<div class="topic-progress-panel__header">' +
        '<strong>Your progress</strong>' +
        '<a href="' + base + 'progress.html">View all subjects</a>' +
      '</div>' +
      buildControlsHtml(id, entry, true);

    var nav = hero.querySelector('.content-nav');
    if (nav) {
      hero.insertBefore(panel, nav);
    } else {
      hero.appendChild(panel);
    }
    bindControls(panel);
  }

  function refreshPageWidget() {
    var panel = document.querySelector('.topic-progress-panel');
    if (!panel) return;
    var id = getTopicIdFromPath();
    refreshControls(panel, id);
  }

  function computeStats(catalogs) {
    var ids = [];
    catalogs.forEach(function (cat) {
      cat.sections.forEach(function (sec) {
        sec.topics.forEach(function (topic) {
          if (ids.indexOf(topic.id) === -1) ids.push(topic.id);
        });
      });
    });

    var all = loadAll();
    var read = 0;
    var understood = 0;
    var review = 0;

    ids.forEach(function (id) {
      var e = all[id] || {};
      if (e.read) read += 1;
      if (e.comprehension === 'understood' || e.comprehension === 'mastered') understood += 1;
      if (e.comprehension === 'review') review += 1;
    });

    return {
      total: ids.length,
      read: read,
      understood: understood,
      review: review,
      pctRead: ids.length ? Math.round((read / ids.length) * 100) : 0,
      pctUnderstood: ids.length ? Math.round((understood / ids.length) * 100) : 0
    };
  }

  function filterTopic(entry, filter) {
    if (filter === 'all') return true;
    if (filter === 'unread') return !entry.read;
    if (filter === 'read') return entry.read;
    if (filter === 'review') return entry.comprehension === 'review';
    if (filter === 'understood') return entry.comprehension === 'understood' || entry.comprehension === 'mastered';
    return true;
  }

  var MAP_URLS = {
    math: 'maps/math-prereq-map.html',
    physics: 'maps/physics-prereq-map.html',
    quantum: 'maps/quantum-prereq-map.html'
  };

  function mountProgressPage() {
    if (!document.body.classList.contains('progress-page')) return;
    var root = document.getElementById('progress-app');
    if (!root) return;

    var base = getScriptBase();
    var filter = 'all';
    var search = '';
    var catalogFilter = 'all';
    var catalogData = null;
    var pageToNode = null;
    var expandedCatalogs = { math: false, physics: false, quantum: false };

    function catalogStats(cat, progress) {
      var total = 0;
      var read = 0;
      cat.sections.forEach(function (sec) {
        sec.topics.forEach(function (topic) {
          total += 1;
          if ((progress[topic.id] || {}).read) read += 1;
        });
      });
      return { total: total, read: read };
    }

    function shouldExpandCatalog(catId, hasVisibleTopics) {
      if (catalogFilter === catId) return true;
      if (search && hasVisibleTopics) return true;
      return !!expandedCatalogs[catId];
    }

    function topicHref(href) {
      return base + href;
    }

    function mapHrefForTopic(catId, topicId) {
      if (!pageToNode || !MAP_URLS[catId]) return null;
      var nodeId = (pageToNode[catId] || {})[topicId];
      if (!nodeId) return null;
      return base + MAP_URLS[catId] + '?topic=' + encodeURIComponent(nodeId);
    }

    function render() {
      if (!catalogData) return;
      var all = loadAll();
      var stats = computeStats(catalogData.catalogs);

      var html = '';
      html += '<div class="progress-summary">';
      html += '<div class="progress-summary__card"><span class="progress-summary__value">' + stats.total + '</span><span class="progress-summary__label">Total subjects</span></div>';
      html += '<div class="progress-summary__card"><span class="progress-summary__value">' + stats.read + '</span><span class="progress-summary__label">Read (' + stats.pctRead + '%)</span></div>';
      html += '<div class="progress-summary__card"><span class="progress-summary__value">' + stats.understood + '</span><span class="progress-summary__label">Understood (' + stats.pctUnderstood + '%)</span></div>';
      html += '<div class="progress-summary__card progress-summary__card--warn"><span class="progress-summary__value">' + stats.review + '</span><span class="progress-summary__label">Need review</span></div>';
      html += '</div>';

      html += '<div class="progress-toolbar">';
      html += '<input type="search" id="progress-search" class="progress-search" placeholder="Search subjects…" value="' + search.replace(/"/g, '&quot;') + '" />';
      html += '<select id="progress-catalog-filter" class="progress-filter">';
      html += '<option value="all">All catalogs</option>';
      catalogData.catalogs.forEach(function (cat) {
        var sel = catalogFilter === cat.id ? ' selected' : '';
        html += '<option value="' + cat.id + '"' + sel + '>' + cat.label + '</option>';
      });
      html += '</select>';
      html += '<select id="progress-status-filter" class="progress-filter">';
      var filters = [
        ['all', 'All statuses'],
        ['unread', 'Not read'],
        ['read', 'Read (any)'],
        ['review', 'Need review'],
        ['understood', 'Understood / mastered']
      ];
      filters.forEach(function (pair) {
        var sel = filter === pair[0] ? ' selected' : '';
        html += '<option value="' + pair[0] + '"' + sel + '>' + pair[1] + '</option>';
      });
      html += '</select>';
      html += '<button type="button" id="progress-export" class="corp-btn corp-btn--secondary">Export progress</button>';
      html += '<button type="button" id="progress-import" class="corp-btn corp-btn--secondary">Import progress</button>';
      html += '<input type="file" id="progress-import-file" accept="application/json" hidden />';
      html += '</div>';

      var visible = 0;
      catalogData.catalogs.forEach(function (cat) {
        if (catalogFilter !== 'all' && catalogFilter !== cat.id) return;

        var sectionHtml = '';
        cat.sections.forEach(function (sec) {
          var rows = '';
          sec.topics.forEach(function (topic) {
            var entry = all[topic.id] || { read: false, comprehension: '' };
            if (!filterTopic(entry, filter)) return;
            if (search && topic.title.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
                topic.id.toLowerCase().indexOf(search.toLowerCase()) === -1) return;

            visible += 1;
            var mapHref = mapHrefForTopic(cat.id, topic.id);
            var mapCell = mapHref
              ? ' <a class="progress-row__map" href="' + mapHref + '" title="View on prerequisite map">Map</a>'
              : '';
            rows +=
              '<tr class="progress-row" data-topic-id="' + topic.id + '">' +
                '<td class="progress-row__title"><a href="' + topicHref(topic.href) + '">' + topic.title + '</a>' + mapCell + '</td>' +
                '<td class="progress-row__controls">' + buildControlsHtml(topic.id, entry, false) + '</td>' +
              '</tr>';
          });
          if (rows) {
            sectionHtml +=
              '<div class="progress-section">' +
                '<h3>' + sec.title + '</h3>' +
                '<table class="progress-table"><tbody>' + rows + '</tbody></table>' +
              '</div>';
          }
        });

        if (sectionHtml) {
          var catStats = catalogStats(cat, all);
          var visibleInCatalog = 0;
          cat.sections.forEach(function (sec) {
            sec.topics.forEach(function (topic) {
              var entry = all[topic.id] || { read: false, comprehension: '' };
              if (!filterTopic(entry, filter)) return;
              if (search && topic.title.toLowerCase().indexOf(search.toLowerCase()) === -1 &&
                  topic.id.toLowerCase().indexOf(search.toLowerCase()) === -1) return;
              visibleInCatalog += 1;
            });
          });
          var isOpen = shouldExpandCatalog(cat.id, visibleInCatalog > 0);
          html +=
            '<details class="progress-catalog" data-catalog="' + cat.id + '"' + (isOpen ? ' open' : '') + '>' +
              '<summary class="progress-catalog__summary">' +
                '<span class="progress-catalog__title">' + cat.label + '</span>' +
                '<span class="progress-catalog__badge">' + catStats.read + ' / ' + catStats.total + ' read</span>' +
                (search || filter !== 'all'
                  ? '<span class="progress-catalog__badge progress-catalog__badge--match">' + visibleInCatalog + ' shown</span>'
                  : '') +
              '</summary>' +
              '<div class="progress-catalog__body">' +
                '<p class="progress-catalog__meta">' +
                  '<a href="' + base + cat.catalog_href + '">Open ' + cat.label + ' catalog</a>' +
                  (MAP_URLS[cat.id] ? ' · <a href="' + base + MAP_URLS[cat.id] + '">Prerequisite map</a>' : '') +
                '</p>' +
                sectionHtml +
              '</div>' +
            '</details>';
        }
      });

      if (!visible) {
        html += '<p class="progress-empty">No subjects match your filters. Try clearing the search or status filter.</p>';
      }

      root.innerHTML = html;
      bindControls(root);

      root.querySelectorAll('.progress-catalog[data-catalog]').forEach(function (details) {
        details.addEventListener('toggle', function () {
          var id = details.getAttribute('data-catalog');
          if (id) expandedCatalogs[id] = details.open;
        });
      });

      var searchEl = document.getElementById('progress-search');
      var catEl = document.getElementById('progress-catalog-filter');
      var statusEl = document.getElementById('progress-status-filter');
      var exportBtn = document.getElementById('progress-export');
      var importBtn = document.getElementById('progress-import');
      var importFile = document.getElementById('progress-import-file');

      if (searchEl) {
        searchEl.addEventListener('input', function () {
          search = searchEl.value;
          render();
          var el = document.getElementById('progress-search');
          if (el) { el.focus(); el.selectionStart = el.selectionEnd = el.value.length; }
        });
      }
      if (catEl) catEl.addEventListener('change', function () { catalogFilter = catEl.value; render(); });
      if (statusEl) statusEl.addEventListener('change', function () { filter = statusEl.value; render(); });
      if (exportBtn) {
        exportBtn.addEventListener('click', function () {
          var blob = new Blob([JSON.stringify(loadAll(), null, 2)], { type: 'application/json' });
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'engineering-knowledge-progress.json';
          a.click();
          URL.revokeObjectURL(a.href);
        });
      }
      if (importBtn && importFile) {
        importBtn.addEventListener('click', function () { importFile.click(); });
        importFile.addEventListener('change', function () {
          var file = importFile.files && importFile.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function () {
            try {
              var data = JSON.parse(reader.result);
              saveAll(data);
              render();
            } catch (e) {
              alert('Could not import file. Please choose a valid progress JSON export.');
            }
          };
          reader.readAsText(file);
          importFile.value = '';
        });
      }
    }

    var mapsPromise = fetch(base + 'maps/prereq-node-pages.json', { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : { byPage: {} }; })
      .catch(function () { return { byPage: {} }; });

    Promise.all([loadCatalogData(), mapsPromise])
      .then(function (results) {
        catalogData = results[0];
        pageToNode = results[1].byPage || {};
        render();
      })
      .catch(function (err) {
        root.innerHTML =
          '<p class="progress-empty">Could not load subject catalog. ' +
          'Ensure <code>js/topic-catalog.js</code> is deployed, then refresh.</p>';
        console.error(err);
      });

    window.addEventListener('ek-progress-updated', render);
  }

  window.TopicProgress = {
    getTopicIdFromPath: getTopicIdFromPath,
    loadAll: loadAll,
    getTopic: getTopic,
    setTopic: setTopic,
    COMPREHENSION_LEVELS: COMPREHENSION_LEVELS
  };

  function init() {
    mountPageWidget();
    mountProgressPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
