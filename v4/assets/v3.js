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

    function size() { var w = orbit.clientWidth; R = w > 1100 ? 440 : w > 900 ? 380 : w > 700 ? 300 : Math.min(250, w * .64); }
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
        p.style.filter = f > .97 ? 'none' : 'blur(' + ((1 - f) * (wide ? 3.2 : 5)).toFixed(2) + 'px) saturate(' + (.75 + f * .25).toFixed(2) + ')';
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
  var rv = $('.wrap h2, .svc h2, .gt, .team, .wrap .kick, .meter, .pcard, .tile, .empathy, .ba, .ind, .end h2, .plan li');
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

  // ---------- Problem meters: fix themselves in view, replay on hover, toggle on tap
  $('[data-meters]').forEach(function (box) {
    var ms = $('.meter', box);
    function set(m, on) { m.classList.toggle('fixed', on); m.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { mo.disconnect(); ms.forEach(function (m, i) { setTimeout(function () { set(m, true); }, still ? 0 : 1200 + i * 700); }); } }, { threshold: .45 });
      mo.observe(box);
    } else ms.forEach(function (m) { set(m, true); });
    ms.forEach(function (m) {
      var t;
      m.addEventListener('mouseenter', function () { if (!m.classList.contains('fixed') || still) return; set(m, false); clearTimeout(t); t = setTimeout(function () { set(m, true); }, 900); });
      m.addEventListener('click', function () { clearTimeout(t); set(m, !m.classList.contains('fixed')); });
    });
  });

  // ---------- Services: tap to open on touch, live demos while in view
  (function () {
    var sec = document.getElementById('services'); if (!sec) return;
    var tiles = $('.gt', sec), live = false;
    tiles.forEach(function (t) {
      var tog = function () { var o = t.getAttribute('aria-expanded') !== 'true'; tiles.forEach(function (x) { x.setAttribute('aria-expanded', 'false'); }); t.setAttribute('aria-expanded', o ? 'true' : 'false'); };
      t.addEventListener('click', function (e) { if (matchMedia('(hover: hover)').matches) return; tog(); });
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(); } });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { live = e[0].isIntersecting; if (live) sec.classList.add('in'); }, { threshold: .2 }).observe(sec);
    else { live = true; sec.classList.add('in'); }
    // chat
    var chat = sec.querySelector('[data-demo="chat"]'), convo = [['Where is order 1042?', 'Out for delivery. Arrives by 3 pm.'], ['Do you open on Friday?', 'Yes, 10 am to 11 pm.'], ['Can I change my booking?', 'Done. Moved to Saturday, 7 pm.'], ['Is the blue size M in stock?', 'Yes, 4 left at Dubai Mall.']], ci = 0, cs = 0;
    function addMsg(text, me) { var s = document.createElement('span'); s.textContent = text; if (me) s.className = 'me'; chat.appendChild(s); while (chat.children.length > 4) chat.removeChild(chat.firstChild); }
    addMsg(convo[0][0]); addMsg(convo[0][1], true); ci = 1;
    // chain
    var chain = sec.querySelector('[data-demo="chain"]'), hex = function () { return Math.random().toString(16).slice(2, 6) + '…' + Math.random().toString(16).slice(2, 4); };
    function addBlock() { if (chain.children.length) { var l = document.createElement('i'); l.className = 'lnk'; chain.appendChild(l); } var b = document.createElement('div'); b.className = 'blk2'; b.innerHTML = '<code>' + hex() + '</code><b>✓ Sealed</b>'; chain.appendChild(b); while (chain.querySelectorAll('.blk2').length > 3) { chain.removeChild(chain.firstChild); if (chain.firstChild && chain.firstChild.className === 'lnk') chain.removeChild(chain.firstChild); } }
    addBlock(); addBlock(); addBlock();
    // iot
    var fr = sec.querySelector('[data-s="fridge"]'), pw = sec.querySelector('[data-s="power"]'), tick = 0;
    // security
    var nb = sec.querySelector('[data-n]'), n = nb ? +nb.getAttribute('data-n') : 0;
    if (still) return;
    setInterval(function () {
      if (!live) return; tick++;
      // chat: alternate question and answer
      if (cs === 0) { addMsg(convo[ci][0]); cs = 1; } else { addMsg(convo[ci][1], true); cs = 0; ci = (ci + 1) % convo.length; }
      if (tick % 2 === 0) addBlock();
      var phase = tick % 8;
      if (phase === 5) { fr.classList.add('alert'); fr.querySelector('b').textContent = '7.8 °C'; fr.querySelector('i').textContent = 'Alert'; }
      else if (phase === 7) { fr.classList.remove('alert'); fr.querySelector('b').textContent = '4.0 °C'; fr.querySelector('i').textContent = 'Fixed'; }
      else if (phase < 5) { fr.querySelector('b').textContent = (3.9 + Math.random() * .4).toFixed(1) + ' °C'; fr.querySelector('i').textContent = 'OK'; }
      pw.querySelector('b').textContent = (17.6 + Math.random() * 1.4).toFixed(1) + ' kW';
      if (nb) { n += 1 + Math.floor(Math.random() * 4); nb.textContent = n.toLocaleString('en-US'); }
    }, 1600);
  })();

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

  // ---------- Menu: lime marker on the section in view
  var links = $('.menu a').filter(function (a) { return (a.getAttribute('href') || '').charAt(0) === '#'; });
  if (links.length) {
    var spy = function () {
      var y = innerHeight * .4, cur = null;
      links.forEach(function (a) { var s = document.querySelector(a.getAttribute('href')); if (s && s.getBoundingClientRect().top <= y && s.getBoundingClientRect().bottom > y) cur = a; });
      links.forEach(function (a) { a.classList.toggle('on', a === cur); if (a === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    addEventListener('scroll', spy, { passive: true }); spy();
  }

  // ---------- Lights on: guessing to knowing (3D model, beams from the core)
  $('[data-lights]').forEach(function (box) {
    var stage = box.querySelector('.lights__stage'), btn = box.querySelector('.lights__switch'), lbl = btn.querySelector('.lbl'), used = false;
    var num = box.querySelector('[data-to]'), beams = box.querySelector('.lights__beams'), core = box.querySelector('.lights__core'), qs = box.querySelector('.lights__qs');
    var mks = $('.mk', box), chips = {}, lifts = { hear: 50, taste: 64, touch: 50, see: 100, smell: 34, remember: 26 };
    $('.chip', box).forEach(function (c) { chips[c.getAttribute('data-k')] = c; c.style.setProperty('--lift', (lifts[c.getAttribute('data-k')] || 56) + 'px'); });
    mks.forEach(function (m) { if (m.getAttribute('data-k') !== 'core') { var q = document.createElement('span'); q.textContent = '?'; q.setAttribute('data-k', m.getAttribute('data-k')); qs.appendChild(q); } });
    function place() {
      var sr = stage.getBoundingClientRect(), pts = {}, wide = innerWidth > 760;
      mks.forEach(function (m) { var r = m.getBoundingClientRect(); pts[m.getAttribute('data-k')] = [r.left - sr.left, r.top - sr.top]; });
      if (!wide) return;
      Object.keys(chips).forEach(function (k) { if (pts[k]) { chips[k].style.left = pts[k][0] + 'px'; chips[k].style.top = pts[k][1] + 'px'; } });
      $('span', qs).forEach(function (q) { var p = pts[q.getAttribute('data-k')]; q.style.left = p[0] + 'px'; q.style.top = p[1] + 'px'; });
      var c = [sr.width / 2, sr.height * .15]; pts.core = c; core.style.left = c[0] + 'px'; core.style.top = (c[1] + 18) + 'px';
      var html = '<defs><linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#D4FF5A"/><stop offset="1" stop-color="#6F8CFF"/></linearGradient></defs>';
      Object.keys(pts).forEach(function (k, i) {
        if (k === 'core') return; var p = pts[k], mx = (c[0] + p[0]) / 2, my = c[1] + (p[1] - c[1]) * .15;
        html += '<path d="M' + c[0] + ' ' + c[1] + ' Q' + mx + ' ' + my + ' ' + p[0] + ' ' + p[1] + '" style="animation-delay:' + (0.2 + i * 0.1) + 's"/>';
      });
      beams.innerHTML = html;
      $('path', beams).forEach(function (p) { var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.setProperty('--len', L); });
    }
    function set(on) {
      box.classList.toggle('on', on); btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      lbl.textContent = on ? 'Gi5.si is on' : 'Switch on Gi5.si';
      setTimeout(place, 50); setTimeout(place, 1450);
      if (on && num && !still) { var to = +num.getAttribute('data-to'), t0 = performance.now(); (function go(now) { var p = Math.min(1, (now - t0) / 1600); num.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US'); if (p < 1 && box.classList.contains('on')) requestAnimationFrame(go); })(t0); }
    }
    btn.addEventListener('click', function () { used = true; set(!box.classList.contains('on')); });
    stage.addEventListener('pointermove', function (e) { var r = stage.getBoundingClientRect(); stage.style.setProperty('--mx', (e.clientX - r.left) + 'px'); stage.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    addEventListener('resize', place); setTimeout(place, 100); setTimeout(place, 1500);
    if ('IntersectionObserver' in window) {
      var lo = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { lo.disconnect(); place(); setTimeout(function () { if (!used) set(true); }, still ? 0 : 1600); } }, { threshold: .55 });
      lo.observe(stage);
    } else set(true);
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

  // Contact form: builds a WhatsApp message to the footer number
  var cf = document.getElementById('contact');
  if (cf) {
    var industry = '';
    document.querySelectorAll('a[href="#call"]').forEach(function (a) {
      a.addEventListener('click', function () {
        industry = a.closest('.ind') ? (document.querySelector('.ind__n') || {}).textContent || '' : '';
        setTimeout(function () { try { cf.elements.name.focus({ preventScroll: true }); } catch (e) {} }, 700);
      });
    });
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      cf.classList.add('tried');
      if (!cf.checkValidity()) { var bad = cf.querySelector(':invalid'); if (bad) bad.focus(); return; }
      var f = cf.elements, lines = ["Hi Gi5.si, I'd like to book a call.", '', 'Name: ' + f.name.value.trim(), 'Email: ' + f.email.value.trim()];
      if (f.company.value.trim()) lines.push('Company: ' + f.company.value.trim());
      if (industry) lines.push('Industry: ' + industry);
      lines.push('Need: ' + f.interest.value, '', f.message.value.trim());
      window.open('https://wa.me/971504079974?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }

  // Product links preset the "What do you need?" field
  document.querySelectorAll('[data-need]').forEach(function (a) {
    a.addEventListener('click', function () { var sel = cf && cf.elements.interest; if (sel) sel.value = a.getAttribute('data-need'); });
  });
  // Product stack: a card settles back as the next one slides over it
  var cards = [].slice.call(document.querySelectorAll('.stack .sc'));
  if (cards.length && !still) {
    var tick = false;
    function depth() {
      tick = false;
      cards.forEach(function (c, i) {
        var nx = cards[i + 1]; if (!nx) return;
        var a = c.getBoundingClientRect(), b = nx.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height));
        c.style.transform = 'scale(' + (1 - p * .05).toFixed(4) + ')';
        c.style.filter = p > .01 ? 'brightness(' + (1 - p * .12).toFixed(3) + ')' : '';
      });
    }
    addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(depth); } }, { passive: true });
    depth();
  }
})();
