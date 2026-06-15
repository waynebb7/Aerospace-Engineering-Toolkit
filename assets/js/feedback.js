(function () {
  'use strict';

  var FEEDBACK_EMAIL = 'waynebb7@gmail.com';
  var MAX_MESSAGE = 2000;

  function $(id) {
    return document.getElementById(id);
  }

  function readParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      report: params.get('report') === '1',
      page: params.get('page') || '',
      title: params.get('title') || ''
    };
  }

  function setCharCount() {
    var message = $('feedbackMessage');
    var counter = $('feedbackCharCount');
    if (!message || !counter) return;
    counter.textContent = message.value.length + ' / ' + MAX_MESSAGE;
  }

  function defaultSubject(typeLabel, pageTitle, isReport) {
    var prefix = isReport ? '[Page report]' : '[Feedback]';
    if (pageTitle) {
      return prefix + ' ' + pageTitle;
    }
    if (typeLabel) {
      return prefix + ' ' + typeLabel;
    }
    return prefix + ' Engineering Knowledge Hub';
  }

  function buildMailto(form) {
    var typeSelect = $('feedbackType');
    var typeLabel = typeSelect.options[typeSelect.selectedIndex].text;
    var pageUrl = ($('feedbackPage') && $('feedbackPage').value) || '';
    var pageTitle = ($('feedbackPageTitle') && $('feedbackPageTitle').value) || '';
    var subjectField = $('feedbackSubject');
    var messageField = $('feedbackMessage');
    var emailField = $('feedbackEmail');
    var params = readParams();

    var subject = (subjectField.value || '').trim();
    if (!subject) {
      subject = defaultSubject(typeLabel, pageTitle, params.report);
    }

    var lines = [
      'Engineering Knowledge Hub feedback',
      'Type: ' + typeLabel
    ];
    if (pageTitle) lines.push('Page title: ' + pageTitle);
    if (pageUrl) lines.push('Page URL: ' + pageUrl);
    if (emailField && emailField.value.trim()) {
      lines.push('Reply-to: ' + emailField.value.trim());
    }
    lines.push('');
    lines.push('Message:');
    lines.push((messageField.value || '').trim());

    var body = lines.join('\n');
    return 'mailto:' + FEEDBACK_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  function init() {
    var form = $('feedbackForm');
    if (!form) return;

    var params = readParams();
    var pageInput = $('feedbackPage');
    var titleInput = $('feedbackPageTitle');
    var typeSelect = $('feedbackType');
    var heading = $('feedbackHeading');
    var intro = $('feedbackIntro');
    var contextBox = $('feedbackPageContext');

    if (params.report) {
      if (heading) heading.textContent = 'Report a page issue';
      if (intro) {
        intro.textContent =
          'Tell us what is wrong with this page — typos, broken links, unclear explanations, or missing content. ' +
          'The page details below are included automatically in your report.';
      }
      if (typeSelect) typeSelect.value = 'page-issue';
      if (contextBox) contextBox.hidden = false;
    }

    if (pageInput && params.page) {
      pageInput.value = params.page;
    }
    if (titleInput && params.title) {
      titleInput.value = params.title;
    }

    var message = $('feedbackMessage');
    if (message) {
      message.maxLength = MAX_MESSAGE;
      message.addEventListener('input', setCharCount);
      setCharCount();
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      window.location.href = buildMailto(form);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
