var MBCDownloader = (function () {
  'use strict';

  var PROBE_TIMEOUT = 4500;
  var COOLDOWN = 2600;

  var PLATFORM_LABELS = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };

  var state = {
    version: (MBC_RELEASES.filter(function (r) { return r.latest; })[0] || MBC_RELEASES[0]).version,
    lang: 'en',
    platform: 'windows',
    busy: false
  };

  var els = {};
  var probeCache = {};

  function $(id) { return document.getElementById(id); }

  function getRelease(version) {
    return MBC_RELEASES.filter(function (r) { return r.version === version; })[0] || MBC_RELEASES[0];
  }

  function getPack(version, lang, platform) {
    var rel = getRelease(version);
    var langPack = rel && rel.files && rel.files[lang];
    return (langPack && langPack[platform]) || null;
  }

  function getFile(version, lang, platform, kind) {
    var pack = getPack(version, lang, platform);
    return pack ? pack[kind] : null;
  }

  function availablePlatforms() {
    var rel = getRelease(state.version);
    var langPack = rel && rel.files && rel.files[state.lang];
    return langPack ? Object.keys(langPack) : [];
  }

  function ensurePlatform() {
    var list = availablePlatforms();
    if (list.indexOf(state.platform) === -1) state.platform = list[0] || 'windows';
  }

  function updatePlatformButtons() {
    var list = availablePlatforms();
    Array.prototype.forEach.call(document.querySelectorAll('[data-platform-pick]'), function (b) {
      var p = b.getAttribute('data-platform-pick');
      var ok = list.indexOf(p) !== -1;
      b.classList.toggle('off', !ok);
      b.classList.toggle('on', ok && p === state.platform);
    });
  }

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return 'n/a';
    var units = ['B', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    i = Math.min(i, units.length - 1);
    var val = bytes / Math.pow(1024, i);
    return (i === 0 ? val : val.toFixed(val >= 100 ? 0 : 1)) + ' ' + units[i];
  }

  function isFileProtocol() {
    return location.protocol === 'file:';
  }

  function probe(url) {
    if (probeCache[url] !== undefined) return Promise.resolve(probeCache[url]);

    return new Promise(function (resolve) {
      if (isFileProtocol()) { probeCache[url] = false; return resolve(false); }

      var ctrl = ('AbortController' in window) ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, PROBE_TIMEOUT);

      fetch(url, { method: 'HEAD', mode: 'cors', cache: 'no-store', signal: ctrl ? ctrl.signal : undefined })
        .then(function (res) {
          clearTimeout(timer);
          var ok = res && (res.ok || res.status === 206 || res.status === 0);
          probeCache[url] = ok;
          resolve(ok);
        })
        .catch(function () {
          clearTimeout(timer);
          probeCache[url] = false;
          resolve(false);
        });
    });
  }

  function trigger(url, filename) {
    var a = document.createElement('a');
    a.href = url;
    a.download = filename || '';
    a.rel = 'noopener';
    if (/^https?:/i.test(url)) a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function download(path, filename, hooks) {
    hooks = hooks || {};
    var order = MBC_SOURCES.slice();

    if (isFileProtocol()) order = order.filter(function (s) { return s.id === 'local'; });

    function step(i) {
      if (i >= order.length) return Promise.reject(new Error('all-mirrors-failed'));

      var src = order[i];
      var url = src.raw(path);
      if (hooks.onProbe) hooks.onProbe(src, url, i, order.length);

      return probe(url).then(function (ok) {
        if (!ok) return step(i + 1);
        if (hooks.onSource) hooks.onSource(src, url);
        trigger(url, filename);
        return { source: src, url: url };
      });
    }

    return step(0);
  }

  function currentFile() {
    return getFile(state.version, state.lang, state.platform, 'zip') ||
      getFile(state.version, state.lang, state.platform, 'bin') ||
      getFile(state.version, state.lang, state.platform, 'exe');
  }

  function isZip(file) {
    return !!file && /\.zip$/i.test(file.file);
  }

  var PKG_ORDER = ['zip', 'bin', 'exe', 'cfg', 'readme'];

  function renderPackages() {
    var box = els.pkgs;
    if (!box) return;
    var pack = getPack(state.version, state.lang, state.platform) || {};

    var html = PKG_ORDER.filter(function (k) { return !!pack[k]; }).map(function (k) {
      var f = pack[k];
      var note = f.bytes ? formatBytes(f.bytes) : 'in repo';
      return '' +
        '<div class="pkg">' +
          '<span class="pkg-info">' +
            '<span class="pkg-name">' + f.label + '</span>' +
            '<span class="pkg-desc">' + f.file + ' &middot; ' + note + '</span>' +
          '</span>' +
          '<span class="pkg-act">' +
            '<button class="btn btn-ghost btn-sm" data-dl-path="' + f.path + '" data-dl-file="' + f.file + '">Download</button>' +
          '</span>' +
        '</div>';
    }).join('');

    box.innerHTML = html || '<p class="pkg-empty">No downloadable files for this version.</p>';
  }

  function renderMirrors() {
    var box = els.mirrors;
    if (!box) return;
    var file = currentFile();
    if (!file) { box.innerHTML = ''; return; }

    box.innerHTML = MBC_SOURCES.map(function (src) {
      var url = src.raw(file.path);
      var local = src.id === 'local';
      return '' +
        '<div class="mirror-row">' +
          '<span class="mirror-name">' + src.label + '</span>' +
          '<span class="mirror-url" title="' + url + '">' + url + '</span>' +
          '<span class="mirror-state" data-state="' + src.id + '">' +
            (local ? 'same origin' : 'idle') +
          '</span>' +
          '<button class="copy-mini" data-copy="' + url + '">copy</button>' +
        '</div>';
    }).join('');
  }

  function renderInfo() {
    var file = currentFile();
    if (!file) return;

    if (els.fileName) els.fileName.textContent = file.file;
    if (els.fileSize) els.fileSize.textContent = formatBytes(file.bytes);
    if (els.fileHash) els.fileHash.textContent = file.sha256 ? file.sha256.slice(0, 24) + '…' : 'n/a';
    if (els.filePath) els.filePath.textContent = file.path;
    if (els.bigLabel) {
      els.bigLabel.innerHTML = '&#11015; One-click download &middot; ' +
        (isZip(file) ? 'full package' : 'standalone build') + ' &middot; ' +
        (PLATFORM_LABELS[state.platform] || state.platform) + ' v' + state.version;
    }
    if (els.relBadge) els.relBadge.textContent = state.version;
  }

  function setStatus(msg, kind) {
    if (!els.status) return;
    els.status.className = 'dl-status' + (kind ? ' ' + kind : '');
    els.status.innerHTML = msg;
  }

  function setProgress(pct, on) {
    if (!els.progress) return;
    els.progress.classList.toggle('on', !!on);
    if (els.progressBar) els.progressBar.style.width = (pct || 0) + '%';
  }

  function markMirror(id, ok, text) {
    var node = document.querySelector('[data-state="' + id + '"]');
    if (!node) return;
    node.className = 'mirror-state ' + (ok ? 'ok' : 'bad');
    node.textContent = text;
  }

  function oneClick() {
    if (state.busy) return;
    var file = currentFile();
    if (!file) return;

    state.busy = true;
    if (els.big) els.big.disabled = true;
    setProgress(12, true);
    setStatus('Selecting the fastest mirror&hellip;');

    Array.prototype.forEach.call(document.querySelectorAll('.mirror-state'), function (n) {
      n.className = 'mirror-state test';
      n.textContent = 'testing…';
    });

    download(file.path, file.file, {
      onProbe: function (src, url, i, total) {
        setProgress(12 + (i / total) * 55, true);
        setStatus('Probing <b>' + src.label + '</b> &hellip;');
      },
      onSource: function (src) {
        markMirror(src.id, true, 'selected');
      }
    })
    .then(function (res) {
      setProgress(100, true);
      setStatus('✓ Download started: <b>' + file.file + '</b> via ' + res.source.label, 'ok');
      MBC.toast('Download started &middot; ' + file.file + ' (' + formatBytes(file.bytes) + ')', 'ok');
    })
    .catch(function () {
      var local = MBC_SOURCES.filter(function (s) { return s.id === 'local'; })[0];
      trigger(local.raw(file.path), file.file);
      setProgress(100, true);
      setStatus('⚠ Mirrors unreachable &mdash; fell back to the repository path', 'warn');
      MBC.toast('Fell back to the local path. If it fails, pick a mirror below.', 'warn');
    })
    .then(function () {
      setTimeout(function () {
        state.busy = false;
        if (els.big) els.big.disabled = false;
        setProgress(0, false);
        renderMirrors();
        if (!els.status || !els.status.classList.contains('ok')) {
          setStatus('Ready &middot; click the button above to download');
        }
      }, COOLDOWN);
    });
  }

  function bindGenericButtons() {
    document.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-dl-path]');
      if (!btn) return;
      ev.preventDefault();

      var path = btn.getAttribute('data-dl-path');
      var file = btn.getAttribute('data-dl-file') || path.split('/').pop();
      var original = btn.innerHTML;

      btn.disabled = true;
      btn.innerHTML = 'preparing…';

      download(path, file, {}).then(function () {
        btn.innerHTML = '✓ started';
        MBC.toast('Download started &middot; ' + file, 'ok');
      }).catch(function () {
        var local = MBC_SOURCES.filter(function (s) { return s.id === 'local'; })[0];
        trigger(local.raw(path), file);
        btn.innerHTML = '⚠ local fallback';
        MBC.toast('Mirrors unavailable &mdash; used the repository path', 'warn');
      }).then(function () {
        setTimeout(function () { btn.disabled = false; btn.innerHTML = original; }, COOLDOWN);
      });
    });
  }

  function setVersion(version) {
    state.version = version;
    ensurePlatform();
    updatePlatformButtons();
    renderInfo();
    renderPackages();
    renderMirrors();
    setStatus('Ready &middot; click the button above to download v' + version);
    setProgress(0, false);
  }

  function setLang(lang) {
    state.lang = lang;
    ensurePlatform();
    updatePlatformButtons();
    renderInfo();
    renderPackages();
    renderMirrors();
  }

  function setPlatform(platform) {
    state.platform = platform;
    updatePlatformButtons();
    renderInfo();
    renderPackages();
    renderMirrors();
    setStatus('Ready &middot; click the button above to download ' +
      (PLATFORM_LABELS[platform] || platform) + ' v' + state.version);
  }

  function init() {
    els.big = $('dlBig');
    els.bigLabel = $('dlBigLabel');
    els.status = $('dlStatus');
    els.progress = $('dlProgress');
    els.progressBar = $('dlProgressBar');
    els.mirrors = $('dlMirrors');
    els.pkgs = $('dlPkgs');
    els.fileName = $('dlFileName');
    els.fileSize = $('dlFileSize');
    els.fileHash = $('dlFileHash');
    els.filePath = $('dlFilePath');
    els.relBadge = $('dlRelBadge');

    Array.prototype.forEach.call(document.querySelectorAll('[data-version-pick]'), function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-version-pick]'), function (x) {
          x.classList.remove('on');
        });
        b.classList.add('on');
        setVersion(b.getAttribute('data-version-pick'));
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-edition-pick]'), function (b) {
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(document.querySelectorAll('[data-edition-pick]'), function (x) {
          x.classList.remove('on');
        });
        b.classList.add('on');
        setLang(b.getAttribute('data-edition-pick'));
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-platform-pick]'), function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('off')) return;
        setPlatform(b.getAttribute('data-platform-pick'));
      });
    });

    if (els.big) els.big.addEventListener('click', oneClick);

    var refresh = $('dlRefresh');
    if (refresh) refresh.addEventListener('click', function () {
      probeCache = {};
      renderMirrors();
      setStatus('Mirror cache cleared &mdash; sources will be re-tested');
      MBC.toast('Mirror cache reset', 'ok');
    });

    bindGenericButtons();
    setVersion(state.version);
  }

  return {
    init: init,
    setVersion: setVersion,
    setLang: setLang,
    setPlatform: setPlatform,
    formatBytes: formatBytes,
    trigger: trigger,
    state: state
  };
})();
