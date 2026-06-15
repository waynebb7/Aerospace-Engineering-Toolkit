/**
 * Reusable info-button popover for field help text.
 * Click toggles a positioned popover; Escape or click/tap outside closes it.
 */
(function (global) {
  'use strict';

  var popover = null;
  var activeBtn = null;

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isOpen() {
    return !!(activeBtn && popover && !popover.hidden);
  }

  function isInsidePopoverOrButton(target) {
    if (!target || !activeBtn || !popover) {
      return false;
    }
    return popover.contains(target) || activeBtn.contains(target);
  }

  function hide() {
    if (popover) {
      popover.hidden = true;
    }
    if (activeBtn) {
      activeBtn.setAttribute('aria-expanded', 'false');
      activeBtn = null;
    }
  }

  function onPointerDownOutside(ev) {
    if (!isOpen()) {
      return;
    }
    if (isInsidePopoverOrButton(ev.target)) {
      return;
    }
    hide();
  }

  function onKeyDown(ev) {
    if (ev.key === 'Escape') {
      hide();
    }
  }

  function onScrollOrResize() {
    if (isOpen()) {
      positionPopover(activeBtn);
    }
  }

  function ensurePopover() {
    if (popover) {
      return popover;
    }
    popover = document.createElement('div');
    popover.className = 'pwa-info-popover';
    popover.setAttribute('role', 'dialog');
    popover.hidden = true;
    document.body.appendChild(popover);
    return popover;
  }

  function positionPopover(btn) {
    if (!popover || popover.hidden) {
      return;
    }
    var rect = btn.getBoundingClientRect();
    var margin = 8;
    var popRect = popover.getBoundingClientRect();
    var top = rect.bottom + margin;
    var left = rect.left;

    if (left + popRect.width > window.innerWidth - margin) {
      left = window.innerWidth - popRect.width - margin;
    }
    if (left < margin) {
      left = margin;
    }
    if (top + popRect.height > window.innerHeight - margin) {
      top = rect.top - popRect.height - margin;
    }
    if (top < margin) {
      top = margin;
    }

    popover.style.top = top + 'px';
    popover.style.left = left + 'px';
  }

  function show(btn, content) {
    var pop = ensurePopover();
    pop.innerHTML =
      '<p class="pwa-info-popover__title">' + escapeHtml(content.title) + '</p>' +
      '<div class="pwa-info-popover__body">' + content.body + '</div>';
    pop.hidden = false;
    activeBtn = btn;
    btn.setAttribute('aria-expanded', 'true');
    positionPopover(btn);
    requestAnimationFrame(function () {
      positionPopover(btn);
    });
  }

  function toggle(btn, helpMap) {
    var key = btn.getAttribute('data-pwa-help');
    var content = helpMap[key];
    if (!content) {
      return;
    }
    if (activeBtn === btn && isOpen()) {
      hide();
      return;
    }
    hide();
    show(btn, content);
  }

  function createButton(helpKey, labelText) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pwa-info-btn';
    btn.setAttribute('data-pwa-help', helpKey);
    btn.setAttribute('aria-label', 'More information: ' + labelText);
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="pwa-info-btn__icon" aria-hidden="true">i</span>';
    return btn;
  }

  function wrapLabelElement(el, helpMap) {
    var key = el.getAttribute('data-pwa-help-key');
    if (!key || el.querySelector('.pwa-info-btn')) {
      return;
    }

    var labelText = el.getAttribute('data-pwa-help-label') ||
      el.textContent.replace(/\s+/g, ' ').trim();
    var iconOnly = el.getAttribute('data-pwa-help-icon-only') === 'true';
    var textEl = el.querySelector('.pwa-label-with-help__text');
    if (!textEl) {
      textEl = document.createElement('span');
      textEl.className = 'pwa-label-with-help__text';
      if (!iconOnly) {
        textEl.textContent = labelText;
      }
      el.textContent = '';
      el.appendChild(textEl);
    }

    el.classList.add('pwa-label-with-help');
    var btn = createButton(key, labelText);
    el.appendChild(btn);

    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      toggle(btn, helpMap);
    });
  }

  function initContainer(container, helpMap) {
    if (!container || !helpMap) {
      return;
    }
    var nodes = container.querySelectorAll('[data-pwa-help-key]');
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      wrapLabelElement(nodes[i], helpMap);
    }
  }

  document.addEventListener('mousedown', onPointerDownOutside, true);
  document.addEventListener('touchstart', onPointerDownOutside, true);
  document.addEventListener('keydown', onKeyDown);
  window.addEventListener('scroll', onScrollOrResize, true);
  window.addEventListener('resize', onScrollOrResize);

  global.PwaInfoHelp = {
    initContainer: initContainer,
    hide: hide
  };
})(typeof window !== 'undefined' ? window : this);
