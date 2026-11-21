// Gi5.si · Services drop-down and phone menu (shared by the homepage and service pages)
(function () {
  var dd = document.querySelector('.dd'), tog = dd && dd.querySelector('.dd__tog');
  function setDD(open) { if (!dd) return; dd.classList.toggle('open', open); tog.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  if (tog) {
    var pinned = false, hovering = false, t;
    function sync() { setDD(pinned || hovering); }
    tog.addEventListener('click', function (e) { e.stopPropagation(); pinned = !(pinned || hovering) ? true : (hovering && !pinned ? true : false); if (!pinned) hovering = false; sync(); });
    if (matchMedia('(hover: hover)').matches) {
      dd.addEventListener('mouseenter', function () { clearTimeout(t); hovering = true; sync(); });
      dd.addEventListener('mouseleave', function () { t = setTimeout(function () { hovering = false; sync(); }, 180); });
    }
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) { pinned = false; hovering = false; sync(); } });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) { pinned = false; hovering = false; sync(); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dd.classList.contains('open')) { pinned = false; hovering = false; sync(); tog.focus(); } });
  }
  var mt = document.querySelector('.mtog'), mn = document.getElementById('mnav'), top = document.querySelector('.top');
  if (mt && mn) {
    function setM(open) { top.classList.toggle('m-open', open); mt.setAttribute('aria-expanded', open ? 'true' : 'false'); mt.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    mt.addEventListener('click', function () { setM(!top.classList.contains('m-open')); });
    mn.addEventListener('click', function (e) { if (e.target.closest('a')) setM(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setM(false); });
  }
})();
// How it works: steps light up in order when the section comes into view
(function () {
  var how = document.getElementById('how'); if (!how) return;
  if (!('IntersectionObserver' in window)) { how.classList.add('in'); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { how.classList.add('in'); io.disconnect(); } }); }, { threshold: .3 });
  io.observe(how);
})();
