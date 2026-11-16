(function () {
  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  var toggle = document.getElementById('theme-toggle');
  function syncToggle() {
    if (toggle) toggle.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
  }
  syncToggle();
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncToggle();
    });
  }
  if (window.matchMedia) {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) { root.setAttribute('data-theme', e.matches ? 'dark' : 'light'); syncToggle(); }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Active nav link ---------- */
  var links = document.querySelectorAll('.nav a');
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
          map[en.target.id].classList.add('active');
          map[en.target.id].setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* ---------- Gallery lightbox ---------- */
  var dlg = document.getElementById('lightbox');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  if (!dlg || !thumbs.length) return;
  var big = document.getElementById('lb-img');
  var count = document.getElementById('lb-count');
  var current = 0;
  var opener = null;

  function show(i) {
    current = (i + thumbs.length) % thumbs.length;
    var img = thumbs[current].querySelector('img');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    count.textContent = (current + 1) + ' / ' + thumbs.length;
  }
  function open(i) {
    opener = thumbs[i];
    show(i);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function close() {
    if (typeof dlg.close === 'function') dlg.close(); else dlg.removeAttribute('open');
  }

  thumbs.forEach(function (b, i) { b.addEventListener('click', function () { open(i); }); });
  dlg.querySelector('.lb-close').addEventListener('click', close);
  dlg.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  dlg.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  dlg.addEventListener('close', function () { if (opener) opener.focus(); });
})();
