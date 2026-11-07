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
  var form = document.querySelector('.form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var note = form.querySelector('.form-note');
    note.hidden = false;
    note.focus();
  });
})();
