var MBC = window.MBC || {};

MBC.toast = function (msg, kind) {
  var box = document.getElementById('toastBox');
  if (!box) return;
  var el = document.createElement('div');
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.innerHTML = msg;
  box.appendChild(el);
  setTimeout(function () {
    el.classList.add('out');
    setTimeout(function () { el.remove(); }, 300);
  }, 3400);
};

(function () {
  'use strict';

  var STORE_THEME = 'mbc-theme';

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    $$('[data-theme-ico]').forEach(function (i) { i.textContent = theme === 'light' ? '☾' : '☀'; });
    try { localStorage.setItem(STORE_THEME, theme); } catch (e) {}
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_THEME); } catch (e) {}
    applyTheme(saved || 'dark');
  }

  function initNav() {
    var links = $('#navLinks');
    var toggle = $('#navToggle');

    if (toggle && links) {
      toggle.addEventListener('click', function () { links.classList.toggle('open'); });
      links.addEventListener('click', function (ev) {
        if (ev.target.tagName === 'A') links.classList.remove('open');
      });
    }

    var sections = $$('section[id]');
    var navLinks = $$('#navLinks a[href^="#"]');

    function spy() {
      var pos = window.scrollY + 140;
      var current = '';
      sections.forEach(function (s) { if (s.offsetTop <= pos) current = s.id; });
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });

      var top = $('#toTop');
      if (top) top.classList.toggle('on', window.scrollY > 620);
    }

    window.addEventListener('scroll', spy, { passive: true });
    spy();

    var top = $('#toTop');
    if (top) top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initTabs() {
    $$('[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var group = btn.closest('[data-tab-group]') || document;
        var id = btn.getAttribute('data-tab');

        $$('[data-tab]', group).forEach(function (b) { b.classList.remove('on'); });
        $$('[data-panel]', group).forEach(function (p) { p.classList.remove('on'); });

        btn.classList.add('on');
        var panel = $('[data-panel="' + id + '"]', group);
        if (panel) panel.classList.add('on');
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(); } catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  function initCopy() {
    document.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-copy]');
      if (btn) {
        ev.preventDefault();
        var val = btn.getAttribute('data-copy');
        copyText(val).then(function () {
          var old = btn.textContent;
          btn.classList.add('done');
          btn.textContent = 'copied ✓';
          MBC.toast('Copied to clipboard', 'ok');
          setTimeout(function () {
            btn.classList.remove('done');
            btn.textContent = old;
          }, 1600);
        }).catch(function () {
          MBC.toast('Copy failed — please select the text manually', 'err');
        });
        return;
      }

      var target = ev.target.closest('[data-copy-target]');
      if (target) {
        ev.preventDefault();
        var node = document.querySelector(target.getAttribute('data-copy-target'));
        if (!node) return;
        var text = ('value' in node) ? node.value : node.innerText;
        copyText(text).then(function () {
          var old = target.textContent;
          target.classList.add('done');
          target.textContent = 'copied ✓';
          MBC.toast('Copied to clipboard', 'ok');
          setTimeout(function () { target.classList.remove('done'); target.textContent = old; }, 1600);
        }).catch(function () {
          MBC.toast('Copy failed — please select the text manually', 'err');
        });
      }
    });
  }

  function renderCommands() {
    var body = $('#cmdBody');
    if (!body) return;

    var rows = [];

    MBC_COMMANDS.forEach(function (group) {
      rows.push('<tr class="cmd-group-row"><td colspan="3">' + group.group + '</td></tr>');

      group.items.forEach(function (item) {
        rows.push('' +
          '<tr data-cmd-group="' + group.groupId + '" data-search="' + (item.cmd + ' ' + item.desc).toLowerCase() + '">' +
            '<td class="td-cmd"><code>' + item.cmd + '</code></td>' +
            '<td>' + item.desc + '</td>' +
            '<td class="td-act"><button class="copy-mini" data-copy="' +
              item.cmd.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
              '">copy</button></td>' +
          '</tr>');
      });
    });

    body.innerHTML = rows.join('');
    applyCommandFilter();
  }

  function applyCommandFilter() {
    var input = $('#cmdSearch');
    var groupSel = $('#cmdGroup');
    var body = $('#cmdBody');
    if (!body) return;

    var q = (input ? input.value : '').trim().toLowerCase();
    var g = groupSel ? groupSel.value : 'all';
    var shown = 0;

    $$('#cmdBody tr[data-cmd-group]').forEach(function (tr) {
      var matchText = !q || tr.getAttribute('data-search').indexOf(q) !== -1;
      var matchGroup = (g === 'all') || tr.getAttribute('data-cmd-group') === g;
      var show = matchText && matchGroup;
      tr.classList.toggle('hide', !show);
      if (show) shown++;
    });

    $$('#cmdBody tr.cmd-group-row').forEach(function (h) {
      var n = h.nextElementSibling;
      var any = false;
      while (n && !n.classList.contains('cmd-group-row')) {
        if (!n.classList.contains('hide')) { any = true; break; }
        n = n.nextElementSibling;
      }
      h.classList.toggle('hide', !any);
    });

    var counter = $('#cmdCount');
    if (counter) counter.textContent = shown + ' commands shown';
  }

  function initCommandFilter() {
    var input = $('#cmdSearch');
    var sel = $('#cmdGroup');
    if (input) input.addEventListener('input', applyCommandFilter);
    if (sel) sel.addEventListener('change', applyCommandFilter);
  }

  function renderProtocols() {
    var body = $('#protoBody');
    if (!body) return;

    body.innerHTML = MBC_PROTOCOLS.map(function (p) {
      return '' +
        '<tr>' +
          '<td><b>' + p.range + '</b></td>' +
          '<td><code>' + p.examples + '</code></td>' +
          '<td><span class="chip blue mono">' + p.protocol + '</span></td>' +
          '<td class="muted">auto-mapped</td>' +
        '</tr>';
    }).join('');
  }

  function versionValue(str) {
    var m = String(str).trim().replace(/^v/i, '').match(/^(\d+)\.(\d+)(?:\.(\d+))?/);
    if (!m) return null;
    var major = parseInt(m[1], 10);
    var minor = parseInt(m[2], 10);
    var patch = m[3] ? parseInt(m[3], 10) : 0;
    return major * 1000 + minor * 10 + patch;
  }

  function initVersionCheck() {
    var input = $('#verInput');
    var out = $('#verOut');
    if (!input || !out) return;

    function run() {
      var raw = input.value.trim();
      if (!raw) { out.innerHTML = ''; return; }

      var val = versionValue(raw);
      if (val === null) {
        out.innerHTML = '<span class="err-text">Unrecognised version — try 1.8.9, 1.20.6 or 26.2</span>';
        return;
      }

      var hit = MBC_PROTOCOLS.filter(function (p) { return val >= p.from && val <= p.to; })[0];

      if (!hit) {
        out.innerHTML = '<span class="warn-text">Not in the built-in map — the client falls back to the 1.8 protocol (47) and probes the server for its real protocol.</span>';
        return;
      }

      out.innerHTML =
        '<span class="chip green">matched range: <b>' + hit.range + '</b></span> ' +
        '<span class="chip blue mono">protocol ' + hit.protocol + '</span> ' +
        '<span class="muted">The client probes the server for its real protocol before login.</span>';
    }

    input.addEventListener('input', run);

    var form = $('#verForm');
    if (form) form.addEventListener('submit', function (e) { e.preventDefault(); run(); });

    $$('[data-ver-quick]').forEach(function (b) {
      b.addEventListener('click', function () {
        input.value = b.getAttribute('data-ver-quick');
        run();
      });
    });
  }

  var CONFIG_ORDER = [
    'version', 'username', 'server_address', 'minecraft_version', 'language',
    'fast_start', 'log_enabled', 'spam_enabled', 'spam_rate', 'spam_messages',
    'command_autocomplete', 'auto_eat', 'auto_eat_health_threshold',
    'auto_walk', 'auto_walk_waypoints', 'stop_walk_on_damage',
    'proximity_alerts', 'proximity_distance',
    'human_actions', 'human_action_interval_min', 'human_action_interval_max'
  ];

  var LIST_KEYS = { spam_messages: 1, auto_walk_waypoints: 1 };

  function readConfigForm() {
    var form = $('#cfgForm');
    if (!form) return null;

    var cfg = {};

    CONFIG_ORDER.forEach(function (key) {
      var el = form.elements[key];
      if (!el) return;

      if (el.type === 'checkbox') {
        cfg[key] = !!el.checked;
      } else if (LIST_KEYS[key]) {
        cfg[key] = String(el.value || '')
          .split(/[\n;]/)
          .map(function (s) { return s.trim(); })
          .filter(function (s) { return s.length; });
      } else if (el.type === 'number') {
        var n = parseFloat(el.value);
        cfg[key] = isNaN(n) ? 0 : n;
      } else {
        cfg[key] = String(el.value);
      }
    });

    return cfg;
  }

  function renderConfig() {
    var out = $('#cfgOut');
    var cfg = readConfigForm();
    if (!out || !cfg) return null;

    var json = JSON.stringify(cfg, null, 2);
    out.textContent = json;
    return json;
  }

  function initConfigBuilder() {
    var form = $('#cfgForm');
    if (!form) return;

    form.addEventListener('input', renderConfig);
    form.addEventListener('change', renderConfig);

    var reset = $('#cfgReset');
    if (reset) reset.addEventListener('click', function () {
      setTimeout(renderConfig, 0);
      MBC.toast('Defaults restored', 'ok');
    });

    var dl = $('#cfgDownload');
    if (dl) dl.addEventListener('click', function () {
      var json = renderConfig();
      var langEl = form.elements['language'];
      var name = 'config.' + (langEl ? langEl.value : 'en') + '.json';

      var blob = new Blob([json], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      MBC.toast('Config file generated &middot; ' + name, 'ok');
    });

    renderConfig();
  }

  function boot() {
    initTheme();
    initNav();
    initTabs();
    initCopy();
    renderCommands();
    renderProtocols();
    initCommandFilter();
    initVersionCheck();
    initConfigBuilder();

    $$('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
      });
    });

    if (window.MBCDownloader) MBCDownloader.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
