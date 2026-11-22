// Gi5.si · service pages: reveal on scroll and the WhatsApp form
(function () {
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ups = document.querySelectorAll('.spu');
  if (!still && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    ups.forEach(function (el) { el.classList.add('pre'); io.observe(el); });
  }
  var cf = document.getElementById('contact');
  // Preselect "What do you need?" from ?need= (set by Book a call / Ask about it links)
  if (cf) { try { var need = new URLSearchParams(location.search).get('need'); if (need) { var sel = cf.elements.interest; [].forEach.call(sel.options, function (o) { if (o.text === need) sel.value = o.value || o.text; }); } } catch (x) {} }
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault(); cf.classList.add('tried');
    if (!cf.checkValidity()) { var bad = cf.querySelector(':invalid'); if (bad) bad.focus(); return; }
    var f = cf.elements, lines = ["Hi Gi5.si, I'd like to book a call.", '', 'Name: ' + f.name.value.trim(), 'Email: ' + f.email.value.trim()];
    if (f.company.value.trim()) lines.push('Company: ' + f.company.value.trim());
    lines.push('Need: ' + f.interest.value, '', f.message.value.trim());
    window.open('https://wa.me/971504079974?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
  document.querySelectorAll('a[href="#call"]').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(function () { try { cf.elements.name.focus({ preventScroll: true }); } catch (x) {} }, 700); });
  });
})();
