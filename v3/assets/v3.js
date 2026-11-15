// Gi5.si v3: glass ring, synced headline, switches, before/after, reveals.
(function () {
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  // ---------- Glass ring
  var orbit = document.querySelector('[data-orbit]');
  if (orbit) {
    var panels = $('.gp', orbit), n = panels.length, step = 360 / n;
    var dial = $('.dial button'), verb = document.querySelector('.verb');
    var ang = 0, target = 0, down = false, moved = 0, lx = 0, lastTouch = -1e9, front = -1, R = 360;
    var tx = 0, ty = 0, ttx = 0, tty = 0;
    orbit.addEventListener('pointermove', function (e) { if (down || e.pointerType !== 'mouse') return; var r = orbit.getBoundingClientRect(); ttx = ((e.clientX - r.left) / r.width - .5) * 2; tty = ((e.clientY - r.top) / r.height - .5) * 2; });
    orbit.addEventListener('pointerleave', function () { ttx = tty = 0; });

    function size() { var w = orbit.clientWidth; R = w > 900 ? 380 : w > 700 ? 300 : Math.min(250, w * .64); }
    size(); addEventListener('resize', size);

    function setFront(i) {
      if (i === front) return; front = i;
      panels.forEach(function (p, j) { p.classList.toggle('front', j === i); p.setAttribute('aria-hidden', j === i ? 'false' : 'true'); });
      dial.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      var w = panels[i].getAttribute('data-verb');
      if (verb.textContent !== w) {
        verb.classList.add('out');
        setTimeout(function () { verb.textContent = w; verb.classList.remove('out'); }, still ? 0 : 230);
      }
    }
    function layout() {
      var wide = orbit.clientWidth > 700;
      for (var i = 0; i < n; i++) {
        var a = (i * step + ang) * Math.PI / 180, s = Math.sin(a), c = Math.cos(a);
        var x = s * R, z = (c - 1) * R * (wide ? .9 : .8), f = (c + 1) / 2;
        var p = panels[i];
        var k = Math.pow(f, 3);
        p.style.transform = 'translate(-50%,-50%) perspective(1300px) translate3d(' + x.toFixed(1) + 'px,' + ((1 - f) * -26).toFixed(1) + 'px,' + z.toFixed(1) + 'px) rotateY(' + (s * -38 + tx * 8 * k).toFixed(2) + 'deg) rotateX(' + (-ty * 6 * k).toFixed(2) + 'deg)';
        p.style.zIndex = Math.round(f * 100);
        var o = Math.max(0, (f - .2) / .8); p.style.opacity = (wide ? Math.pow(o, 1.1) : Math.pow(o, 4)).toFixed(3); p.style.visibility = o < .02 ? 'hidden' : 'visible';
      }
      var idx = ((Math.round(-ang / step) % n) + n) % n; setFront(idx);
    }
    function frame(now) {
      if (!down) {
        ang += (target - ang) * (still ? 1 : .085);
      }
      if (!still) { tx += (ttx - tx) * .08; ty += (tty - ty) * .08; }
      layout(); requestAnimationFrame(frame);
    }
    // auto-advance until the visitor interacts
    var auto = still ? null : setInterval(function () {
      var r = orbit.getBoundingClientRect();
      if (!down && performance.now() - lastTouch > 6000 && r.top < innerHeight && r.bottom > 0) target -= step;
    }, 3200);
    function goTo(i) {
      var cur = i * step + target, d = ((cur % 360) + 540) % 360 - 180;
      target -= d; lastTouch = performance.now();
    }
    orbit.addEventListener('pointerdown', function (e) { down = true; moved = 0; lx = e.clientX; orbit.classList.add('grab'); lastTouch = performance.now(); });
    addEventListener('pointermove', function (e) {
      if (!down) return; var dx = e.clientX - lx; lx = e.clientX; moved += Math.abs(dx);
      ang += dx * (orbit.clientWidth > 700 ? .22 : .38); target = ang;
    });
    addEventListener('pointerup', function (e) {
      if (!down) return; down = false; orbit.classList.remove('grab'); lastTouch = performance.now();
      target = Math.round(ang / step) * step;
      if (moved < 6) { var p = e.target.closest && e.target.closest('.gp'); if (p) goTo(panels.indexOf(p)); }
    });
    dial.forEach(function (b, i) { b.addEventListener('click', function () { goTo(i); }); });
    orbit.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { target -= step; lastTouch = performance.now(); } if (e.key === 'ArrowLeft') { target += step; lastTouch = performance.now(); } });
    orbit.tabIndex = 0; orbit.setAttribute('aria-label', 'Five senses. Use arrow keys to turn.');
    layout(); requestAnimationFrame(frame);
  }

  // ---------- Reveals (and one-time animations inside tiles)
  var rv = $('.wrap h2, .wrap .kick, .pain, .tile, .empathy, .ba, .ind, .end h2, .plan li');
  rv.forEach(function (el) { el.classList.add('rv'); });
  if ('IntersectionObserver' in window && !still) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    rv.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // ---------- Problem switches: flip on by themselves once, then by hand
  var sws = $('.sw');
  function setSw(b, on) { b.setAttribute('aria-checked', on ? 'true' : 'false'); b.closest('.pain').classList.toggle('on', on); }
  sws.forEach(function (b) { b.addEventListener('click', function () { setSw(b, b.getAttribute('aria-checked') !== 'true'); }); });
  $('.pain').forEach(function (p) { p.addEventListener('click', function (e) { if (!e.target.closest('.sw')) p.querySelector('.sw').click(); }); p.style.cursor = 'pointer'; });
  if (sws.length && 'IntersectionObserver' in window) {
    var pio = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return; pio.disconnect();
      sws.forEach(function (b, i) { setTimeout(function () { setSw(b, true); }, still ? 0 : 900 + i * 700); });
    }, { threshold: .5 });
    pio.observe(document.querySelector('.pains'));
  }

  // ---------- Industries: tabs swap the five senses, auto-advance until touched
  $('[data-ind]').forEach(function (box) {
    var tabs = $('.ind__tab', box), card = box.querySelector('.ind__card'), list = box.querySelector('.ind__list');
    var nEl = box.querySelector('.ind__n'), lEl = box.querySelector('.ind__l'), btn = box.querySelector('.ind__head .btn');
    var tpl = $('template', box), cur = 0, used = false;
    function show(i) {
      cur = i; tabs.forEach(function (t, j) { t.classList.toggle('on', j === i); t.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      var T = [['#D4FF5A','#6F8CFF'],['#E6FF9A','#9BE8FF'],['#6F8CFF','#D4FF5A'],['#9BE8FF','#6F8CFF'],['#9BE8FF','#D4FF5A'],['#D4FF5A','#9BE8FF']][i % 6];
      box.style.setProperty('--g1', T[0]); box.style.setProperty('--g2', T[1]);
      var t = tpl[i]; card.classList.add('swap');
      setTimeout(function () {
        nEl.textContent = t.getAttribute('data-name'); lEl.textContent = t.getAttribute('data-line');
        btn.textContent = 'Talk about ' + t.getAttribute('data-name').toLowerCase();
        list.innerHTML = t.innerHTML; card.classList.remove('swap');
      }, still ? 0 : 180);
      // restart the tab progress bar
      var on = tabs[i]; on.classList.remove('on'); void on.offsetWidth; on.classList.add('on');
    }
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { used = true; box.classList.add('used'); show(i); t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }); });
    if (!still) setInterval(function () { var r = box.getBoundingClientRect(); if (!used && r.top < innerHeight * .8 && r.bottom > innerHeight * .2) show((cur + 1) % tabs.length); }, 5000);
    else box.classList.add('used');
  });

  // ---------- Before / after
  $('[data-ba]').forEach(function (box) {
    var input = box.querySelector('input'), used = false;
    var set = function (v) { box.style.setProperty('--x', v + '%'); };
    input.addEventListener('input', function () { used = true; set(input.value); });
    if (still || !('IntersectionObserver' in window)) { set(55); input.value = 55; return; }
    var o = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return; o.disconnect();
      var t0 = performance.now();
      (function go(now) { if (used) return; var p = Math.min(1, (now - t0) / 1800); p = 1 - Math.pow(1 - p, 3); var v = 8 + p * 44; set(v); input.value = v; if (p < 1) requestAnimationFrame(go); })(t0);
    }, { threshold: .6 });
    o.observe(box);
  });
})();
