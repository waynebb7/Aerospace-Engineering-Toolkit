(function () {
  'use strict';

  var STORAGE_KEY = 'ek-topic-progress';
  var HINT_KEY = 'ek-prereq-map-hint-dismissed';

  function goalStorageKey(mapId) {
    return 'ek-prereq-map-goal-' + mapId;
  }

  function parseJsonScript(id) {
    var el = document.getElementById(id);
    if (!el || !el.textContent.trim()) return null;
    return JSON.parse(el.textContent);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function pageHref(href) {
    return '../' + href.replace(/^\//, '');
  }

  function nodeProgress(pages, progress) {
    if (!pages || !pages.length) return { state: 'no-lesson', label: 'No lesson page', short: '—' };
    var read = 0;
    var weak = 0;
    var strong = 0;
    pages.forEach(function (p) {
      var entry = progress[p] || { read: false, comprehension: '' };
      if (!entry.read) return;
      read += 1;
      if (entry.comprehension === 'review' || entry.comprehension === 'partial') weak += 1;
      else if (entry.comprehension === 'understood' || entry.comprehension === 'mastered') strong += 1;
    });
    if (read === 0) return { state: 'todo', label: 'Not started', short: '○' };
    if (read < pages.length) return { state: 'partial', label: 'In progress', short: '◐' };
    if (weak > 0) return { state: 'weak', label: 'Needs review', short: '!' };
    if (strong > 0) return { state: 'done', label: 'Completed', short: '✓' };
    return { state: 'read', label: 'Read', short: '●' };
  }

  function shortestPath(startId, goalId, edgesTo) {
    if (startId === goalId) return [goalId];
    var queue = [[goalId]];
    var seen = new Set([goalId]);
    while (queue.length) {
      var path = queue.shift();
      var node = path[0];
      var prereqs = (edgesTo.get(node) || []).map(function (e) { return e.from; });
      for (var i = 0; i < prereqs.length; i += 1) {
        var prev = prereqs[i];
        if (seen.has(prev)) continue;
        seen.add(prev);
        var nextPath = [prev].concat(path);
        if (prev === startId) return nextPath;
        queue.push(nextPath);
      }
    }
    return null;
  }

  function resolveNodePages(raw, mapId) {
    if (!raw || typeof raw !== 'object') return {};
    if (raw.byNode && raw.byNode[mapId]) return raw.byNode[mapId];
    if (raw[mapId] && typeof raw[mapId] === 'object' && !Array.isArray(raw[mapId])) {
      return raw[mapId];
    }
    if (!raw.byNode && !raw.byPage) return raw;
    return {};
  }

  function computeBestPath(goalId, nodes, edgesTo) {
    var roots = nodes.filter(function (node) { return (edgesTo.get(node.id) || []).length === 0; });
    var bestPath = null;
    roots.forEach(function (root) {
      var path = shortestPath(root.id, goalId, edgesTo);
      if (path && (!bestPath || path.length < bestPath.length)) bestPath = path;
    });
    return bestPath || [goalId];
  }

  function initMap() {
    var config = parseJsonScript('prereq-map-config') || {};
    var graph = parseJsonScript('prereq-graph-data');
    var pagesRaw = parseJsonScript('prereq-node-pages') || {};
    var mapId = config.id || 'math';
    var GOAL_KEY = goalStorageKey(mapId);

    if (!graph) {
      console.error('Prerequisite map: missing graph data');
      return;
    }

    var nodePages = resolveNodePages(pagesRaw, mapId);
    var LEVELS = config.levels || graph.meta.levels || [];
    var NODES = graph.nodes || [];
    var EDGES = (graph.edges || []).concat(graph.cross_edges || []);
    var hasEdgeTypes = !!config.hasEdgeTypes;
    var hasDomains = !!config.hasDomains;
    var hasCrossSubject = !!config.hasCrossSubject;
    var defaultFocus = config.defaultFocus || null;
    var catalogHref = config.catalogHref || null;

    var byId = new Map();
    var edgesFrom = new Map();
    var edgesTo = new Map();
    var nodeEls = new Map();
    var selectedId = null;
    var goalId = null;
    var progress = loadProgress();

    var body = document.body;
    var viewport = document.getElementById('viewport');
    var stage = document.getElementById('stage');
    var svg = document.getElementById('links');
    var searchEl = document.getElementById('search');
    var topicSelect = document.getElementById('topicSelect');
    var jumpBtn = document.getElementById('jumpBtn');
    var goalBtn = document.getElementById('goalBtn');
    var resetBtn = document.getElementById('resetBtn');
    var pathOnlyEl = document.getElementById('pathOnly');
    var gapsOnlyEl = document.getElementById('gapsOnly');
    var compactCardsEl = document.getElementById('compactCards');
    var showThroughEl = document.getElementById('showThrough');
    var domainFilter = document.getElementById('domainFilter');
    var lessonsOnly = document.getElementById('lessonsOnly');
    var levelsAllBtn = document.getElementById('levelsAll');
    var levelsNoneBtn = document.getElementById('levelsNone');
    var levelFilters = Array.prototype.slice.call(document.querySelectorAll('.level-filter'));
    var mapHint = document.getElementById('mapHint');
    var dismissHint = document.getElementById('dismissHint');
    var readinessBanner = document.getElementById('readinessBanner');
    var pathListView = document.getElementById('pathListView');
    var pathListOl = document.getElementById('pathListOl');
    var printPathBtn = document.getElementById('printPathBtn');

    var detailPanel = document.getElementById('detailPanel');
    var panelTitle = document.getElementById('panelTitle');
    var panelMeta = document.getElementById('panelMeta');
    var panelLessons = document.getElementById('panelLessons');
    var panelPath = document.getElementById('panelPath');
    var panelReq = document.getElementById('panelReq');
    var panelReqAll = document.getElementById('panelReqAll');
    var panelDep = document.getElementById('panelDep');
    var panelGaps = document.getElementById('panelGaps');
    var startHereBtn = document.getElementById('startHereBtn');
    var exportPathBtn = document.getElementById('exportPathBtn');

    function indexGraph() {
      byId = new Map(NODES.map(function (n) { return [n.id, n]; }));
      edgesFrom = new Map();
      edgesTo = new Map();
      EDGES.forEach(function (e) {
        if (!edgesFrom.has(e.from)) edgesFrom.set(e.from, []);
        if (!edgesTo.has(e.to)) edgesTo.set(e.to, []);
        edgesFrom.get(e.from).push(e);
        edgesTo.get(e.to).push(e);
      });
    }

    function pagesFor(id) {
      return nodePages[id] || [];
    }

    function getAllPrereqs(startId) {
      var seen = new Set();
      var stack = (edgesTo.get(startId) || []).map(function (e) { return e.from; });
      while (stack.length) {
        var id = stack.pop();
        if (seen.has(id)) continue;
        seen.add(id);
        (edgesTo.get(id) || []).forEach(function (e) { stack.push(e.from); });
      }
      return seen;
    }

    function getAllDependents(startId) {
      var seen = new Set();
      var stack = (edgesFrom.get(startId) || []).map(function (e) { return e.to; });
      while (stack.length) {
        var id = stack.pop();
        if (seen.has(id)) continue;
        seen.add(id);
        (edgesFrom.get(id) || []).forEach(function (e) { stack.push(e.to); });
      }
      return seen;
    }

    function missingPrereqs(id) {
      var prereqs = getAllPrereqs(id);
      var missing = [];
      prereqs.forEach(function (pid) {
        var pages = pagesFor(pid);
        if (!pages.length) return;
        var st = nodeProgress(pages, progress);
        if (st.state === 'todo' || st.state === 'weak' || st.state === 'partial') missing.push(pid);
      });
      return missing;
    }

    function getShowThroughIndex() {
      var val = showThroughEl ? showThroughEl.value : '';
      if (!val) return LEVELS.length - 1;
      var idx = LEVELS.indexOf(val);
      return idx >= 0 ? idx : LEVELS.length - 1;
    }

    function getPathSet() {
      if (!goalId || !byId.has(goalId)) return null;
      return new Set(computeBestPath(goalId, NODES, edgesTo));
    }

    function getFilterContext() {
      var visible = new Set();
      var q = searchEl.value.trim().toLowerCase();
      var domain = domainFilter ? domainFilter.value : '';
      var onlyLessons = lessonsOnly && lessonsOnly.checked;
      var onlyGaps = gapsOnlyEl && gapsOnlyEl.checked;
      var onlyPath = pathOnlyEl && pathOnlyEl.checked;
      var throughIdx = getShowThroughIndex();
      var enabledLevels = new Set(
        levelFilters.filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; })
      );
      var pathSet = getPathSet();
      var gapSet = goalId ? new Set(missingPrereqs(goalId)) : null;

      NODES.forEach(function (n) {
        var levelIdx = LEVELS.indexOf(n.level);
        var hitSearch = !q || n.title.toLowerCase().includes(q) || (n.domain || '').toLowerCase().includes(q);
        var hitDomain = !domain || n.domain === domain;
        var hitLevel = enabledLevels.has(n.level) && levelIdx <= throughIdx;
        var hitLessons = !onlyLessons || pagesFor(n.id).length > 0;
        var hitPath = !onlyPath || !pathSet || pathSet.has(n.id);
        var hitGaps = !onlyGaps || !gapSet || gapSet.has(n.id) || n.id === goalId;
        if (hitSearch && hitDomain && hitLevel && hitLessons && hitPath && hitGaps) visible.add(n.id);
      });
      return visible;
    }

    function isCompact() {
      return compactCardsEl ? compactCardsEl.checked : true;
    }

    function statusMarkup(id) {
      var st = nodeProgress(pagesFor(id), progress);
      var onlyLessons = lessonsOnly && lessonsOnly.checked;
      if (st.state === 'no-lesson' && !onlyLessons) {
        return '<span class="status-dot status-dot--none" title="Curriculum node — no lesson page yet"></span>';
      }
      if (st.state === 'no-lesson') {
        return '<span class="pill progress-pill progress-pill--no-lesson">' + escapeHtml(st.label) + '</span>';
      }
      if (isCompact()) {
        return '<span class="status-dot status-dot--' + st.state + '" title="' + escapeHtml(st.label) + '">' + escapeHtml(st.short) + '</span>';
      }
      return '<span class="pill progress-pill progress-pill--' + st.state + '">' + escapeHtml(st.label) + '</span>';
    }

    function createLevelColumn(level) {
      var col = document.createElement('div');
      col.className = 'level';
      col.dataset.level = level;
      col.innerHTML = '<h2>' + escapeHtml(level) + '</h2>';
      return col;
    }

    function renderColumns() {
      stage.innerHTML = '';
      nodeEls.clear();
      var throughIdx = getShowThroughIndex();
      var columns = new Map();
      LEVELS.forEach(function (level, idx) {
        var col = createLevelColumn(level);
        if (idx > throughIdx) col.classList.add('level--collapsed');
        columns.set(level, col);
        stage.appendChild(col);
      });

      NODES.forEach(function (node) {
        var col = columns.get(node.level);
        if (!col) return;
        var el = document.createElement('div');
        var subject = node.subject || config.id || 'topic';
        el.className = 'node';
        if (subject !== config.id && subject !== 'quantum' && subject !== 'physics') el.classList.add('node--external');
        if (node.subject === 'math') el.classList.add('node--math');
        el.id = 'node_' + node.id;
        el.dataset.id = node.id;

        var metaHtml = '';
        if (!isCompact()) {
          var prereqCount = (edgesTo.get(node.id) || []).length;
          var depCount = (edgesFrom.get(node.id) || []).length;
          var domainPill = hasDomains && node.domain ? '<span class="pill">' + escapeHtml(node.domain) + '</span>' : '';
          var subjectPill = node.subject && node.subject !== config.id
            ? '<span class="pill pill--subject">' + escapeHtml(node.subject) + '</span>' : '';
          metaHtml =
            '<div class="meta">' +
              '<span class="pill">Prereqs: ' + prereqCount + '</span>' +
              '<span class="pill">Dependents: ' + depCount + '</span>' +
              statusMarkup(node.id) + domainPill + subjectPill +
            '</div>';
        } else {
          metaHtml = '<div class="meta meta--compact">' + statusMarkup(node.id) + '</div>';
        }

        el.innerHTML = '<div class="title">' + escapeHtml(node.title) + '</div>' + metaHtml;
        el.addEventListener('click', function () { select(node.id); });
        col.appendChild(el);
        nodeEls.set(node.id, el);
      });
      body.classList.toggle('map-page--compact', isCompact());
    }

    function buildSelects() {
      var sorted = NODES.slice().sort(function (a, b) { return a.title.localeCompare(b.title); });
      topicSelect.innerHTML = ['<option value="">Choose a topic…</option>']
        .concat(sorted.map(function (n) {
          return '<option value="' + escapeHtml(n.id) + '">' + escapeHtml(n.title) + '</option>';
        })).join('');

      if (showThroughEl) {
        showThroughEl.innerHTML = LEVELS.map(function (lvl, idx) {
          return '<option value="' + escapeHtml(lvl) + '"' + (idx === LEVELS.length - 1 ? ' selected' : '') + '>Show through: ' + escapeHtml(lvl) + '</option>';
        }).join('');
      }

      if (hasDomains && domainFilter) {
        var domains = Array.from(new Set(NODES.map(function (n) { return n.domain; }).filter(Boolean))).sort();
        domainFilter.innerHTML = ['<option value="">All domains</option>']
          .concat(domains.map(function (d) {
            return '<option value="' + escapeHtml(d) + '">' + escapeHtml(d) + '</option>';
          })).join('');
      } else if (domainFilter) {
        domainFilter.closest('.toolbar-group').style.display = 'none';
      }

      if (!hasCrossSubject) {
        var cross = document.getElementById('legendCross');
        if (cross) cross.style.display = 'none';
      }
      if (!hasEdgeTypes) {
        ['legendLinesRequired', 'legendLinesRec'].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
      }
    }

    function jumpTo(id) {
      var el = nodeEls.get(id);
      if (!el) return;
      var vpRect = viewport.getBoundingClientRect();
      var elRect = el.getBoundingClientRect();
      var target = viewport.scrollLeft + (elRect.left - vpRect.left) + (elRect.width / 2) - (vpRect.width / 2);
      viewport.scrollLeft = Math.max(0, target);
    }

    function saveGoal(id) {
      try {
        if (id) localStorage.setItem(GOAL_KEY, id);
        else localStorage.removeItem(GOAL_KEY);
      } catch (e) { /* ignore */ }
    }

    function loadSavedGoal() {
      try {
        var id = localStorage.getItem(GOAL_KEY);
        return id && byId.has(id) ? id : null;
      } catch (e) {
        return null;
      }
    }

    function updateUrl() {
      var params = new URLSearchParams(window.location.search);
      if (selectedId) params.set('topic', selectedId); else params.delete('topic');
      if (goalId) params.set('goal', goalId); else params.delete('goal');
      var qs = params.toString();
      var next = window.location.pathname + (qs ? '?' + qs : '');
      window.history.replaceState(null, '', next);
    }

    function clearList(ul) {
      while (ul.firstChild) ul.removeChild(ul.firstChild);
    }

    function addMapListItem(ul, id) {
      var n = byId.get(id);
      var li = document.createElement('li');
      if (!n) { li.textContent = id; ul.appendChild(li); return; }
      var a = document.createElement('a');
      a.href = '#';
      a.textContent = n.title;
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        select(n.id);
        jumpTo(n.id);
      });
      li.appendChild(a);
      ul.appendChild(li);
    }

    function addLessonList(ul, pages) {
      pages.forEach(function (href) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = pageHref(href);
        a.textContent = href.split('/').pop().replace('.html', '').replace(/-/g, ' ');
        var st = nodeProgress([href], progress);
        var badge = document.createElement('span');
        badge.className = 'lesson-status lesson-status--' + st.state;
        badge.textContent = st.label;
        li.appendChild(a);
        li.appendChild(document.createTextNode(' '));
        li.appendChild(badge);
        ul.appendChild(li);
      });
    }

    function firstLessonOnPath(path, unreadOnly) {
      var fallback = null;
      for (var i = 0; i < path.length; i += 1) {
        var pages = pagesFor(path[i]);
        for (var j = 0; j < pages.length; j += 1) {
          if (!fallback) fallback = pages[j];
          if (!unreadOnly) return pages[j];
          var st = nodeProgress([pages[j]], progress);
          if (st.state === 'todo' || st.state === 'weak' || st.state === 'partial') return pages[j];
        }
      }
      return unreadOnly ? fallback : null;
    }

    function renderReadinessBanner() {
      if (!readinessBanner || !goalId) {
        if (readinessBanner) readinessBanner.hidden = true;
        return;
      }
      var goal = byId.get(goalId);
      if (!goal) { readinessBanner.hidden = true; return; }
      var gaps = missingPrereqs(goalId);
      readinessBanner.hidden = false;
      if (!gaps.length) {
        readinessBanner.className = 'readiness-banner readiness-banner--ready';
        readinessBanner.innerHTML = '<strong>Ready for ' + escapeHtml(goal.title) + '</strong> — all linked prerequisites are started or complete.';
      } else {
        readinessBanner.className = 'readiness-banner readiness-banner--gaps';
        readinessBanner.innerHTML =
          '<strong>Not ready yet for ' + escapeHtml(goal.title) + '</strong> — ' +
          gaps.length + ' prerequisite' + (gaps.length === 1 ? '' : 's') + ' need attention. ' +
          '<button type="button" id="jumpFirstGap" class="readiness-banner__btn">Jump to first gap</button>';
        var btn = document.getElementById('jumpFirstGap');
        if (btn) {
          btn.addEventListener('click', function () {
            select(gaps[0]);
            jumpTo(gaps[0]);
          });
        }
      }
    }

    function renderPathList(path) {
      if (!pathListView || !pathListOl) return;
      clearList(pathListOl);
      if (!path || path.length < 2) {
        pathListView.hidden = true;
        return;
      }
      pathListView.hidden = false;
      path.forEach(function (pid, idx) {
        var item = byId.get(pid);
        var li = document.createElement('li');
        if (item) {
          var pages = pagesFor(pid);
          var st = nodeProgress(pages, progress);
          li.innerHTML =
            '<span class="path-list__step">' + (idx + 1) + '.</span> ' +
            '<button type="button" class="path-list__topic" data-id="' + escapeHtml(pid) + '">' + escapeHtml(item.title) + '</button> ' +
            '<span class="path-list__status">' + escapeHtml(st.label) + '</span>';
        } else {
          li.textContent = (idx + 1) + '. ' + pid;
        }
        pathListOl.appendChild(li);
      });
      pathListOl.querySelectorAll('.path-list__topic').forEach(function (btn) {
        btn.addEventListener('click', function () {
          select(btn.getAttribute('data-id'));
          jumpTo(btn.getAttribute('data-id'));
        });
      });
    }

    function pathMarkdown(path) {
      return path.map(function (pid, idx) {
        var n = byId.get(pid);
        return (idx + 1) + '. ' + (n ? n.title : pid);
      }).join('\n');
    }

    function renderPanel(id) {
      var n = byId.get(id);
      if (!n) return;
      detailPanel.style.display = 'block';
      panelTitle.textContent = n.title;

      var directReq = (edgesTo.get(id) || []).map(function (e) { return byId.get(e.from); }).filter(Boolean);
      var directDep = (edgesFrom.get(id) || []).map(function (e) { return byId.get(e.to); }).filter(Boolean);
      var allReq = Array.from(getAllPrereqs(id)).map(function (x) { return byId.get(x); }).filter(Boolean);
      var gaps = goalId ? missingPrereqs(goalId) : missingPrereqs(id);
      var pages = pagesFor(id);
      var effectiveGoal = goalId || id;
      var bestPath = computeBestPath(effectiveGoal, NODES, edgesTo);

      panelMeta.textContent =
        'Level: ' + n.level +
        (n.domain ? ' | Domain: ' + n.domain : '') +
        (n.subject && n.subject !== config.id ? ' | Subject: ' + n.subject : '') +
        ' | Direct prerequisites: ' + directReq.length +
        ' | Direct dependents: ' + directDep.length;

      clearList(panelLessons);
      if (pages.length) addLessonList(panelLessons, pages);
      else {
        var li = document.createElement('li');
        li.textContent = 'Curriculum node only — no lesson page linked yet.';
        panelLessons.appendChild(li);
      }

      clearList(panelPath);
      if (bestPath && bestPath.length > 1) {
        bestPath.forEach(function (pid, idx) {
          var item = byId.get(pid);
          var li = document.createElement('li');
          if (idx > 0) li.className = 'path-step';
          if (item) {
            var a = document.createElement('a');
            a.href = '#';
            a.textContent = (idx + 1) + '. ' + item.title;
            a.addEventListener('click', function (ev) {
              ev.preventDefault();
              select(item.id);
              jumpTo(item.id);
            });
            li.appendChild(a);
          } else li.textContent = pid;
          panelPath.appendChild(li);
        });
      } else {
        var empty = document.createElement('li');
        empty.textContent = 'Already at a foundation topic or no chain found.';
        panelPath.appendChild(empty);
      }

      renderPathList(bestPath);

      clearList(panelGaps);
      if (gaps.length) {
        gaps.sort(function (a, b) {
          return (byId.get(a).title || a).localeCompare(byId.get(b).title || b);
        }).forEach(function (gid) { addMapListItem(panelGaps, gid); });
      } else {
        var ok = document.createElement('li');
        ok.textContent = 'All linked prerequisites are started or complete.';
        panelGaps.appendChild(ok);
      }

      clearList(panelReq);
      clearList(panelReqAll);
      clearList(panelDep);
      directReq.sort(function (a, b) { return a.title.localeCompare(b.title); }).forEach(function (x) { addMapListItem(panelReq, x.id); });
      allReq.sort(function (a, b) { return a.title.localeCompare(b.title); }).forEach(function (x) { addMapListItem(panelReqAll, x.id); });
      directDep.sort(function (a, b) { return a.title.localeCompare(b.title); }).forEach(function (x) { addMapListItem(panelDep, x.id); });

      if (startHereBtn) {
        var startHref = firstLessonOnPath(bestPath, true);
        startHereBtn.disabled = !startHref;
        startHereBtn.textContent = startHref ? 'Start here' : 'No lessons on path';
        startHereBtn.onclick = function () {
          if (startHref) window.location.href = pageHref(startHref);
        };
      }
      if (exportPathBtn) {
        exportPathBtn.onclick = function () {
          var text = '# Path to: ' + (byId.get(effectiveGoal) || {}).title + '\n\n' + pathMarkdown(bestPath);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).catch(function () { window.prompt('Copy path:', text); });
          } else {
            window.prompt('Copy path:', text);
          }
        };
      }

      renderReadinessBanner();
    }

    function applyFilters() {
      var visible = getFilterContext();
      var throughIdx = getShowThroughIndex();
      stage.querySelectorAll('.level').forEach(function (col, idx) {
        col.style.display = idx <= throughIdx ? '' : 'none';
      });
      nodeEls.forEach(function (el, id) {
        el.style.display = visible.has(id) ? '' : 'none';
      });
      refreshLines();
    }

    function lineContext() {
      var visible = getFilterContext();
      if (!selectedId && !(pathOnlyEl && pathOnlyEl.checked && goalId)) {
        return { visible: visible, drawLines: false };
      }
      var focus = selectedId || goalId;
      if (pathOnlyEl && pathOnlyEl.checked && goalId) {
        var path = computeBestPath(goalId, NODES, edgesTo);
        var pathEdges = new Set();
        for (var i = 1; i < path.length; i += 1) pathEdges.add(path[i - 1] + '->' + path[i]);
        return {
          focusId: focus,
          prereqs: new Set(path.slice(0, -1)),
          deps: new Set(),
          visible: visible,
          pathOnly: true,
          pathEdgeKeys: pathEdges,
          drawLines: true
        };
      }
      return {
        focusId: focus,
        prereqs: getAllPrereqs(focus),
        deps: getAllDependents(focus),
        visible: visible,
        drawLines: true
      };
    }

    function applyHighlight(id) {
      nodeEls.forEach(function (el) {
        el.classList.remove('selected', 'dim', 'upstream', 'downstream', 'gap', 'on-path');
      });
      if (!id) {
        detailPanel.style.display = 'none';
        refreshLines();
        return;
      }
      var prereqs = getAllPrereqs(id);
      var deps = getAllDependents(id);
      var gaps = new Set(goalId ? missingPrereqs(goalId) : missingPrereqs(id));
      var pathSet = getPathSet();
      nodeEls.forEach(function (el, nid) {
        var selected = nid === id;
        var up = prereqs.has(nid);
        var down = deps.has(nid);
        if (selected) el.classList.add('selected');
        if (up) el.classList.add('upstream');
        if (down) el.classList.add('downstream');
        if (gaps.has(nid)) el.classList.add('gap');
        if (pathSet && pathSet.has(nid)) el.classList.add('on-path');
        if (!(selected || up || down || (pathSet && pathSet.has(nid)))) el.classList.add('dim');
      });
      refreshLines();
    }

    function select(id) {
      selectedId = id;
      if (topicSelect) topicSelect.value = id;
      renderPanel(id);
      applyHighlight(id);
      updateUrl();
    }

    function setGoal(id) {
      goalId = id;
      saveGoal(id);
      if (id) {
        select(id);
        if (pathOnlyEl) pathOnlyEl.checked = true;
        applyFilters();
      }
      updateUrl();
    }

    function svgClear() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
    }

    function getElBoxInViewportSpace(el) {
      var vpRect = viewport.getBoundingClientRect();
      var r = el.getBoundingClientRect();
      return {
        x: (r.left - vpRect.left) + viewport.scrollLeft,
        y: (r.top - vpRect.top) + viewport.scrollTop,
        w: r.width,
        h: r.height
      };
    }

    function redrawLines(context) {
      var contentWidth = stage.scrollWidth + 32;
      var contentHeight = Math.max(stage.scrollHeight + 32, viewport.clientHeight);
      svg.setAttribute('width', String(contentWidth));
      svg.setAttribute('height', String(contentHeight));
      svg.style.width = contentWidth + 'px';
      svg.style.height = contentHeight + 'px';
      svgClear();

      if (!context || !context.drawLines) return;

      var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrow');
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '9');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '7');
      marker.setAttribute('markerHeight', '7');
      marker.setAttribute('orient', 'auto-start-reverse');
      var arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      arrowPath.setAttribute('fill', 'var(--line)');
      marker.appendChild(arrowPath);
      defs.appendChild(marker);
      svg.appendChild(defs);

      var visibleSet = context.visible instanceof Set ? context.visible : null;
      EDGES.forEach(function (e) {
        if (context.pathOnly && context.pathEdgeKeys && !context.pathEdgeKeys.has(e.from + '->' + e.to)) return;

        var fromEl = nodeEls.get(e.from);
        var toEl = nodeEls.get(e.to);
        if (!fromEl || !toEl) return;
        if (fromEl.style.display === 'none' || toEl.style.display === 'none') return;
        if (visibleSet && (!visibleSet.has(e.from) || !visibleSet.has(e.to))) return;

        var a = getElBoxInViewportSpace(fromEl);
        var b = getElBoxInViewportSpace(toEl);
        var x1 = a.x + a.w;
        var y1 = a.y + (a.h / 2);
        var x2 = b.x;
        var y2 = b.y + (b.h / 2);
        var dx = Math.max(60, (x2 - x1) * 0.45);

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M ' + x1 + ' ' + y1 + ' C ' + (x1 + dx) + ' ' + y1 + ', ' + (x2 - dx) + ' ' + y2 + ', ' + x2 + ' ' + y2);
        path.setAttribute('fill', 'none');

        var width = 1.4;
        var opacity = 0.65;
        var dash = '';
        var stroke = 'var(--line)';
        if (hasEdgeTypes && e.type === 'required') {
          stroke = 'var(--req)';
          width = 2.2;
          opacity = 0.85;
        } else if (hasEdgeTypes && e.type === 'recommended') {
          stroke = 'var(--rec)';
          width = 1.8;
          dash = '6 4';
        }
        if (e.subject === 'math') {
          stroke = 'var(--math-line)';
          dash = dash || '4 3';
        }
        if (context.focusId) {
          var onBand =
            e.to === context.focusId ||
            (context.prereqs && context.prereqs.has(e.to) && (context.prereqs.has(e.from) || e.from === context.focusId)) ||
            (context.deps && context.deps.has(e.from) && (context.deps.has(e.to) || e.to === context.focusId));
          if (context.pathOnly) onBand = context.pathEdgeKeys && context.pathEdgeKeys.has(e.from + '->' + e.to);
          opacity = onBand ? Math.max(opacity, 0.92) : 0.08;
        }
        path.setAttribute('stroke', stroke);
        path.setAttribute('stroke-width', String(width));
        path.setAttribute('opacity', String(opacity));
        if (dash) path.setAttribute('stroke-dasharray', dash);
        path.setAttribute('marker-end', 'url(#arrow)');
        svg.appendChild(path);
      });
    }

    function refreshLines() {
      redrawLines(lineContext());
    }

    function scheduleRedraw() {
      requestAnimationFrame(function () {
        requestAnimationFrame(refreshLines);
      });
    }

    function resetView() {
      selectedId = null;
      goalId = null;
      saveGoal(null);
      if (topicSelect) topicSelect.value = '';
      searchEl.value = '';
      if (domainFilter) domainFilter.value = '';
      if (lessonsOnly) lessonsOnly.checked = false;
      if (pathOnlyEl) pathOnlyEl.checked = false;
      if (gapsOnlyEl) gapsOnlyEl.checked = false;
      if (showThroughEl) showThroughEl.value = LEVELS[LEVELS.length - 1];
      levelFilters.forEach(function (cb) { cb.checked = true; });
      if (readinessBanner) readinessBanner.hidden = true;
      if (pathListView) pathListView.hidden = true;
      applyHighlight(null);
      updateUrl();
      scheduleRedraw();
    }

    indexGraph();
    renderColumns();
    buildSelects();

    if (mapHint && !localStorage.getItem(HINT_KEY)) mapHint.hidden = false;
    if (dismissHint) {
      dismissHint.addEventListener('click', function () {
        localStorage.setItem(HINT_KEY, '1');
        if (mapHint) mapHint.hidden = true;
      });
    }

    viewport.addEventListener('scroll', scheduleRedraw);
    window.addEventListener('resize', scheduleRedraw);
    searchEl.addEventListener('input', applyFilters);
    if (domainFilter) domainFilter.addEventListener('change', applyFilters);
    if (lessonsOnly) lessonsOnly.addEventListener('change', function () { renderColumns(); applyFilters(); });
    if (pathOnlyEl) pathOnlyEl.addEventListener('change', applyFilters);
    if (gapsOnlyEl) gapsOnlyEl.addEventListener('change', applyFilters);
    if (compactCardsEl) compactCardsEl.addEventListener('change', function () { renderColumns(); applyFilters(); });
    if (showThroughEl) showThroughEl.addEventListener('change', applyFilters);
    levelFilters.forEach(function (cb) { cb.addEventListener('change', applyFilters); });
    if (levelsAllBtn) levelsAllBtn.addEventListener('click', function () {
      levelFilters.forEach(function (cb) { cb.checked = true; });
      applyFilters();
    });
    if (levelsNoneBtn) levelsNoneBtn.addEventListener('click', function () {
      levelFilters.forEach(function (cb) { cb.checked = false; });
      applyFilters();
    });

    if (jumpBtn) {
      jumpBtn.addEventListener('click', function () {
        if (!topicSelect.value) return;
        select(topicSelect.value);
        jumpTo(topicSelect.value);
      });
    }
    if (goalBtn) {
      goalBtn.addEventListener('click', function () {
        if (!topicSelect.value) return;
        setGoal(topicSelect.value);
      });
    }
    resetBtn.addEventListener('click', resetView);
    if (printPathBtn) printPathBtn.addEventListener('click', function () { window.print(); });

    window.addEventListener('ek-progress-updated', function () {
      progress = loadProgress();
      renderColumns();
      if (selectedId) {
        renderPanel(selectedId);
        applyHighlight(selectedId);
      }
      scheduleRedraw();
    });

    var params = new URLSearchParams(window.location.search);
    var urlGoal = params.get('goal');
    var urlTopic = params.get('topic');
    if (urlGoal && byId.has(urlGoal)) {
      goalId = urlGoal;
      saveGoal(urlGoal);
      if (pathOnlyEl) pathOnlyEl.checked = true;
    }
    if (urlTopic && byId.has(urlTopic)) {
      select(urlTopic);
      jumpTo(urlTopic);
    } else if (urlGoal && byId.has(urlGoal)) {
      setGoal(urlGoal);
    } else {
      var savedGoal = loadSavedGoal();
      if (savedGoal) {
        setGoal(savedGoal);
      } else if (defaultFocus && byId.has(defaultFocus)) {
        select(defaultFocus);
        jumpTo(defaultFocus);
      } else {
        scheduleRedraw();
      }
    }

    if (catalogHref) {
      var link = document.getElementById('catalogLink');
      if (link) link.setAttribute('href', pageHref(catalogHref));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
