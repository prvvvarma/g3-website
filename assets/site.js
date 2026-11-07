// G3 Technologies: menu, services dropdown, reveal motion, preview form.
document.documentElement.classList.add('js');
// Each page opens at the top unless the link points to a section.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!location.hash) {
  var goTop = function () { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); };
  goTop(); document.addEventListener("DOMContentLoaded", goTop); window.addEventListener("load", goTop);
  [100, 300, 600].forEach(function (t) { setTimeout(goTop, t); });
}
(function () {
  var header = document.querySelector('.header');
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) menuBtn.addEventListener('click', function () {
    var open = header.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.textContent = open ? 'Close' : 'Menu';
  });
  var svc = document.querySelector('.nav-services');
  if (svc) {
    var b = svc.querySelector('button');
    b.addEventListener('click', function () {
      var open = svc.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!svc.contains(e.target)) { svc.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { svc.classList.remove('open'); b.setAttribute('aria-expanded', 'false'); } });
  }
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }
  // Engraved plates tilt gently toward the pointer
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.plate').forEach(function (fig) {
    var im = fig.querySelector('img');
    if (!im || still) return;
    fig.addEventListener('pointermove', function (e) {
      var r = fig.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      im.style.transform = 'rotateY(' + (x * 10).toFixed(2) + 'deg) rotateX(' + (-y * 10).toFixed(2) + 'deg) scale(1.02)';
    });
    fig.addEventListener('pointerleave', function () { im.style.transform = ''; });
  });
  // Headlines marked .scrub fill in word by word as they scroll through the screen
  document.querySelectorAll('.scrub').forEach(function (h) {
    var ws = h.querySelectorAll('.w');
    if (still) { ws.forEach(function (w) { w.classList.add('on'); }); return; }
    var tick = function () {
      var r = h.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (vh * 0.85 - vh * 0.35);
      var n = Math.round(Math.max(0, Math.min(1, p)) * ws.length);
      ws.forEach(function (w, i) { w.classList.toggle('on', i < n); });
      h.classList.toggle('done', n === ws.length);
    };
    window.addEventListener('scroll', tick, { passive: true }); window.addEventListener('resize', tick); tick();
  });
  // Pains: resolve one by one when they scroll in, then flip on hover or tap
  var pains = document.querySelectorAll('.pain');
  if (pains.length) {
    var set = function (el, on) { el.classList.toggle('solved', on); el.setAttribute('aria-pressed', on ? 'true' : 'false'); };
    var played = false;
    var playIn = function () {
      if (played) return; played = true;
      pains.forEach(function (el, i) { setTimeout(function () { set(el, true); }, still ? 0 : 900 + i * 900); });
    };
    if ('IntersectionObserver' in window) {
      var pio = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { playIn(); pio.disconnect(); } }, { threshold: 0.4 });
      pio.observe(pains[0].parentNode);
    } else playIn();
    pains.forEach(function (el) {
      var lastType = '';
      el.addEventListener('pointerup', function (e) { lastType = e.pointerType; });
      el.addEventListener('click', function () { if (lastType === 'mouse') { lastType = ''; return; } played = true; set(el, !el.classList.contains('solved')); });
      el.addEventListener('pointerenter', function (e) { if (played && e.pointerType === 'mouse') set(el, !el.classList.contains('solved')); });
      el.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') e.preventDefault(); });
    });
  }
  // Timelines fill as they scroll through the screen
  document.querySelectorAll('.timeline').forEach(function (tl) {
    var steps = tl.querySelectorAll('.step');
    var tick = function () {
      var r = tl.getBoundingClientRect(), vh = window.innerHeight;
      var p = still ? 1 : Math.max(0, Math.min(1, (vh * 0.8 - r.top) / (r.height + vh * 0.25)));
      tl.style.setProperty('--p', p.toFixed(3));
      steps.forEach(function (s, i) { s.classList.toggle('on', p >= i / steps.length + 0.02); });
    };
    window.addEventListener('scroll', tick, { passive: true }); window.addEventListener('resize', tick); tick();
  });

  // Interactive index: hover or focus shows the description in the side panel; tap opens it on small screens
  document.querySelectorAll('.ix').forEach(function (ix) {
    var items = ix.querySelectorAll('.ix__item'), panel = ix.querySelector('.ix__panel');
    var num = panel.querySelector('.ix__num'), text = panel.querySelector('.ix__text'), t = null;
    var show = function (it) {
      items.forEach(function (o) { o.classList.toggle('is-on', o === it); });
      var desc = it.nextElementSibling.innerHTML;
      if (text.innerHTML === desc) return;
      panel.classList.add('swap'); clearTimeout(t);
      t = setTimeout(function () { num.textContent = it.getAttribute('data-n'); text.innerHTML = desc; panel.classList.remove('swap'); }, 180);
    };
    items.forEach(function (it) {
      it.addEventListener('mouseenter', function () { show(it); });
      it.addEventListener('focus', function () { show(it); });
      it.addEventListener('click', function () {
        var open = !it.classList.contains('open');
        items.forEach(function (o) { o.classList.remove('open'); o.setAttribute('aria-expanded', 'false'); });
        if (open) { it.classList.add('open'); it.setAttribute('aria-expanded', 'true'); }
        show(it);
      });
    });
  });
  var form = document.querySelector('.form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var note = form.querySelector('.form-note');
    note.hidden = false;
    note.focus();
  });
})();
