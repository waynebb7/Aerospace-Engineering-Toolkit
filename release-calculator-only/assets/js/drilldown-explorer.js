(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function normalizeArray(a) {
    if (!Array.isArray(a)) return [];
    return a.filter(Boolean);
  }

  window.initDrilldownExplorer = function initDrilldownExplorer(config) {
    config = config || {};

    var ui = {
      search: document.getElementById('search'),
      levelFilter: document.getElementById('levelFilter'),
      domainFilter: document.getElementById('domainFilter'),
      topicList: document.getElementById('topicList'),
      cycleWarning: document.getElementById('cycleWarning'),
      detailTitle: document.getElementById('detailTitle'),
      detailSummary: document.getElementById('detailSummary'),
      detailMeta: document.getElementById('detailMeta'),
      reqTree: document.getElementById('reqTree'),
      recTree: document.getElementById('recTree'),
      downList: document.getElementById('downList'),
      resList: document.getElementById('resList')
    };

    var DB = null;
    var topicById = new Map();
    var selectedId = null;

    function levelIndex(level) {
      var levels = (DB && DB.levels) || [];
      var idx = levels.indexOf(level);
      return idx >= 0 ? idx : 999;
    }

    function setFilters() {
      var levelOptions = ['All levels'].concat(DB.levels);
      ui.levelFilter.innerHTML = levelOptions.map(function (l, i) {
        return '<option value="' + (i === 0 ? '' : escapeHtml(l)) + '">' + escapeHtml(l) + '</option>';
      }).join('');

      var domainOptions = ['All domains'].concat(DB.domains);
      ui.domainFilter.innerHTML = domainOptions.map(function (d, i) {
        return '<option value="' + (i === 0 ? '' : escapeHtml(d)) + '">' + escapeHtml(d) + '</option>';
      }).join('');
    }

    function validateIds(topics) {
      var ids = new Set(topics.map(function (t) { return t.id; }));
      var missing = [];

      topics.forEach(function (t) {
        normalizeArray(t.required).forEach(function (r) {
          if (!ids.has(r)) missing.push({ from: t.id, missing: r, type: 'required' });
        });
        normalizeArray(t.recommended).forEach(function (r) {
          if (!ids.has(r)) missing.push({ from: t.id, missing: r, type: 'recommended' });
        });
      });
      return missing;
    }

    function detectCycles(topics) {
      var graph = new Map();
      topics.forEach(function (t) { graph.set(t.id, normalizeArray(t.required)); });

      var visited = new Set();
      var stack = new Set();
      var cycles = [];

      function dfs(node, path) {
        if (stack.has(node)) {
          var idx = path.indexOf(node);
          cycles.push(path.slice(idx).concat(node));
          return;
        }
        if (visited.has(node)) return;

        visited.add(node);
        stack.add(node);

        (graph.get(node) || []).forEach(function (n) { dfs(n, path.concat(n)); });
        stack.delete(node);
      }

      topics.forEach(function (t) { dfs(t.id, [t.id]); });
      return cycles;
    }

    function getAncestors(startId, mode) {
      var seen = new Set();
      var stack = [startId];

      while (stack.length) {
        var id = stack.pop();
        var t = topicById.get(id);
        if (!t) continue;

        var next = normalizeArray(mode === 'required' ? t.required : t.recommended);
        next.forEach(function (n) {
          if (!seen.has(n)) {
            seen.add(n);
            stack.push(n);
          }
        });
      }
      return seen;
    }

    function getDownstreamUnlocked(selected) {
      if (!selected) return [];
      var reqAnc = getAncestors(selected, 'required');
      reqAnc.add(selected);

      var result = [];
      DB.topics.forEach(function (t) {
        if (t.id === selected) return;
        var req = new Set(normalizeArray(t.required));
        var allReqCovered = Array.from(req).every(function (x) { return reqAnc.has(x); });
        var dependsOnSelectedOrAnc = Array.from(req).some(function (x) {
          return x === selected || reqAnc.has(x);
        });
        if (req.size > 0 && allReqCovered && dependsOnSelectedOrAnc) result.push(t.id);
      });
      return result;
    }

    function buildTree(rootId, mode) {
      var t = topicById.get(rootId);
      if (!t) return document.createElement('ul');
      var roots = normalizeArray(mode === 'required' ? t.required : t.recommended);

      var ul = document.createElement('ul');
      ul.className = 'tree';
      var visited = new Set();

      function addNode(parentUl, id) {
        var node = topicById.get(id);
        if (!node) return;

        var li = document.createElement('li');
        li.innerHTML = '<span>' + escapeHtml(node.title) +
          ' <span style="color:var(--muted);">(' + escapeHtml(node.level) + ', ' +
          escapeHtml(node.domain) + ')</span></span>';
        parentUl.appendChild(li);

        if (visited.has(id)) return;
        visited.add(id);

        var children = normalizeArray(mode === 'required' ? node.required : node.recommended);
        if (children.length) {
          var childUl = document.createElement('ul');
          childUl.className = 'tree';
          li.appendChild(childUl);
          children.forEach(function (c) { addNode(childUl, c); });
        }
      }

      roots.forEach(function (r) { addNode(ul, r); });
      return ul;
    }

    function renderList() {
      var q = ui.search.value.trim().toLowerCase();
      var level = ui.levelFilter.value;
      var domain = ui.domainFilter.value;

      var items = DB.topics
        .filter(function (t) { return !level || t.level === level; })
        .filter(function (t) { return !domain || t.domain === domain; })
        .filter(function (t) {
          if (!q) return true;
          return (t.title + ' ' + (t.summary || '')).toLowerCase().includes(q);
        })
        .sort(function (a, b) {
          var li = levelIndex(a.level) - levelIndex(b.level);
          return li !== 0 ? li : a.title.localeCompare(b.title);
        });

      var reqSet = selectedId ? getAncestors(selectedId, 'required') : new Set();
      var recSet = selectedId ? getAncestors(selectedId, 'recommended') : new Set();
      var down = selectedId ? new Set(getDownstreamUnlocked(selectedId)) : new Set();

      ui.topicList.innerHTML = '';

      items.forEach(function (t) {
        var div = document.createElement('div');
        div.className = 'topic';
        div.dataset.id = t.id;

        if (t.id === selectedId) div.classList.add('selected');

        var isReq = selectedId && reqSet.has(t.id);
        var isRec = selectedId && recSet.has(t.id) && !isReq;
        var isDown = selectedId && down.has(t.id);

        if (selectedId) {
          var active = (t.id === selectedId) || isReq || isRec || isDown;
          if (!active) div.classList.add('dim');
          if (isReq) div.classList.add('req');
          if (isRec) div.classList.add('rec');
          if (isDown) div.classList.add('down');
        }

        div.innerHTML =
          '<div class="title">' + escapeHtml(t.title) + '</div>' +
          '<div class="meta">' +
            '<span class="pill">' + escapeHtml(t.level) + '</span>' +
            '<span class="pill">' + escapeHtml(t.domain) + '</span>' +
          '</div>';

        div.addEventListener('click', function () { selectTopic(t.id); });
        ui.topicList.appendChild(div);
      });
    }

    function clearChildren(el) {
      while (el.firstChild) el.removeChild(el.firstChild);
    }

    function renderDetail(id) {
      var t = topicById.get(id);
      if (!t) return;

      ui.detailTitle.textContent = t.title;
      ui.detailSummary.textContent = t.summary || '';

      var req = normalizeArray(t.required);
      var rec = normalizeArray(t.recommended);

      ui.detailMeta.innerHTML =
        '<strong>Level:</strong> ' + escapeHtml(t.level) + ' &nbsp; | &nbsp;' +
        '<strong>Domain:</strong> ' + escapeHtml(t.domain) + ' &nbsp; | &nbsp;' +
        '<strong>Required direct prerequisites:</strong> ' + req.length + ' &nbsp; | &nbsp;' +
        '<strong>Recommended direct prerequisites:</strong> ' + rec.length;

      clearChildren(ui.reqTree);
      clearChildren(ui.recTree);

      var reqTree = buildTree(id, 'required');
      var recTree = buildTree(id, 'recommended');

      while (reqTree.firstChild) ui.reqTree.appendChild(reqTree.firstChild);
      while (recTree.firstChild) ui.recTree.appendChild(recTree.firstChild);

      clearChildren(ui.downList);
      var downstream = getDownstreamUnlocked(id)
        .map(function (x) { return topicById.get(x); })
        .filter(Boolean)
        .sort(function (a, b) {
          return levelIndex(a.level) - levelIndex(b.level) || a.title.localeCompare(b.title);
        });

      if (downstream.length === 0) {
        var emptyLi = document.createElement('li');
        emptyLi.textContent = 'None in current dataset.';
        ui.downList.appendChild(emptyLi);
      } else {
        downstream.forEach(function (d) {
          var li = document.createElement('li');
          li.textContent = d.title + ' (' + d.level + ', ' + d.domain + ')';
          ui.downList.appendChild(li);
        });
      }

      clearChildren(ui.resList);
      var res = Array.isArray(t.resources) ? t.resources : [];
      if (res.length === 0) {
        var noRes = document.createElement('li');
        noRes.textContent = 'No resources attached.';
        ui.resList.appendChild(noRes);
      } else {
        res.forEach(function (r) {
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = r.url;
          a.textContent = r.label || r.url;
          if (r.external) {
            a.target = '_blank';
            a.rel = 'noopener';
          }
          li.appendChild(a);
          ui.resList.appendChild(li);
        });
      }
    }

    function selectTopic(id) {
      selectedId = id;
      renderDetail(id);
      renderList();
    }

    async function loadTopicsDB() {
      try {
        var resp = await fetch('./topics.json', { cache: 'no-store' });
        if (resp.ok) {
          return resp.json();
        }
      } catch (_) {
        /* fetch blocked when opened via file:// */
      }
      if (window.DRILLDOWN_TOPICS) {
        return window.DRILLDOWN_TOPICS;
      }
      throw new Error('Could not load topics.json and topics-data.js is missing.');
    }

    loadTopicsDB().then(function (data) {
      DB = data;
      topicById = new Map(DB.topics.map(function (t) { return [t.id, t]; }));

      var missing = validateIds(DB.topics);
      var cycles = detectCycles(DB.topics);

      if (missing.length || cycles.length) {
        var parts = [];
        if (missing.length) {
          var lines = missing.slice(0, 12).map(function (m) {
            return m.type + ': ' + m.from + ' references missing id ' + m.missing;
          });
          parts.push('Missing prerequisite IDs:\n' + lines.join('\n') + (missing.length > 12 ? '\n...' : ''));
        }
        if (cycles.length) {
          var cycleLines = cycles.slice(0, 6).map(function (c) { return c.join(' -> '); });
          parts.push('Cycle detected in required prerequisites:\n' +
            cycleLines.join('\n') + (cycles.length > 6 ? '\n...' : ''));
        }
        ui.cycleWarning.style.display = 'block';
        ui.cycleWarning.textContent = parts.join('\n\n');
      }

      setFilters();
      renderList();

      ui.search.addEventListener('input', renderList);
      ui.levelFilter.addEventListener('change', renderList);
      ui.domainFilter.addEventListener('change', renderList);

      if (config.initialTopic) {
        selectTopic(config.initialTopic);
      } else {
        selectTopic(DB.topics[0] && DB.topics[0].id);
      }
    }).catch(function (err) {
      ui.cycleWarning.style.display = 'block';
      ui.cycleWarning.textContent =
        'Failed to load topic data.\n\n' +
        String(err) +
        '\n\nRegenerate bundled data with:\n' +
        (config.buildScript || 'python scripts/build-drilldown-explorers.py');
    });
  };
})();
