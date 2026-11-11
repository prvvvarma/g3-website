// GI5SI hologram site: live point-cloud holograms plus page interactions.
document.documentElement.classList.add('js');
(function () {
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TAU = Math.PI * 2, HALF = Math.PI / 2;

  // ---------- point builders: x, y, z, bright flag, scatter x/y/z
  function add(a, x, y, z, f) { a.push(x, y, z, f ? 1 : 0, (Math.random() - .5) * 5, (Math.random() - .5) * 5, (Math.random() - .5) * 5); }
  function line(a, p, q, n, f) { for (var i = 0; i <= n; i++) { var t = i / n; add(a, p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t, typeof f === 'function' ? f(i) : f); } }
  function sphere(a, r, N, every) { var g = Math.PI * (3 - Math.sqrt(5)); for (var i = 0; i < N; i++) { var y = 1 - 2 * (i + .5) / N, q = Math.sqrt(1 - y * y), t = g * i; add(a, Math.cos(t) * q * r, y * r, Math.sin(t) * q * r, every && i % every === 0); } }
  function circle(a, r, n, f, z) { for (var i = 0; i < n; i++) { var u = i / n * TAU; add(a, r * Math.cos(u), r * Math.sin(u), z || 0, typeof f === 'function' ? f(i) : f); } }
  function ring(a, rad) {
    var M = Math.round(230 * rad), tube = .042;
    for (var i = 0; i < M; i++) {
      var u = i / M * TAU; if (u % (TAU / 3) > 1.93) continue;
      for (var j = 0; j < 5; j++) { var v = j / 5 * TAU, rr = rad + tube * Math.cos(v); add(a, rr * Math.cos(u), rr * Math.sin(u), tube * Math.sin(v), u < .7); }
    }
    for (var k = 0; k < 72; k++) { var w = k / 72 * TAU, ro = rad + (k % 6 === 0 ? .12 : .09); add(a, ro * Math.cos(w), ro * Math.sin(w), 0, k % 6 === 0); }
  }
  function cube(a, s) {
    var c = [-s, s];
    c.forEach(function (x) { c.forEach(function (y) { line(a, [x, y, -s], [x, y, s], 9, function (i) { return i === 0 || i === 9; }); line(a, [x, -s, y], [x, s, y], 9, 0); line(a, [-s, x, y], [s, x, y], 9, 0); }); });
  }
  function part(a, o) {
    o = o || {};
    return { pts: new Float32Array(a), rad: o.rad || 1, spin: o.spin || 0, a: o.a || 0, b: o.b || 0, wa: o.wa || 0, wb: o.wb || 0, off: o.off || [0, 0, 0], core: !!o.core, info: o.info || null, base: o.base || 1, k: 0, lum: 1, scr: [], ax: 0, ay: 0 };
  }

  var KINDS = {
    gyro: function () {
      var info = [
        { n: '01', name: 'AI', verb: 'Thinks', line: 'AI that does real work, every day.', list: ['Assistants and agents', 'Answers from your own data', 'Vision, voice and forecasts'], href: 'ai.html' },
        { n: '02', name: 'Blockchain', verb: 'Proves', line: 'Records no one can argue with.', list: ['Smart contracts', 'Tokenised assets', 'Source-to-shelf tracing'], href: 'blockchain.html' },
        { n: '03', name: 'IoT', verb: 'Senses', line: "Know what's happening at every site.", list: ['Sensors and devices', 'Live dashboards', 'Alerts before failures'], href: 'iot.html' },
        { n: '04', name: 'Cloud & Security', verb: 'Protects', line: 'Systems that stay up and stay safe.', list: ['Cloud build and migration', 'Security testing', '24/7 monitoring'], href: 'cloud-security.html' }
      ];
      var cfg = [{ rad: 1, spin: .22, a: .5, b: .3, wa: .11, wb: .07 }, { rad: .78, spin: -.3, a: 1.4, b: -.6, wa: -.09, wb: .13 }, { rad: .56, spin: .42, a: -.7, b: 1.1, wa: .14, wb: -.1 }];
      var out = cfg.map(function (c, i) { var a = []; ring(a, c.rad); c.info = info[i]; return part(a, c); });
      var s = []; sphere(s, .2, 420, 9); circle(s, .29, 90, 0);
      out.push(part(s, { rad: .2, core: true, spin: .3, a: HALF, info: info[3] }));
      return out;
    },
    brain: function () {
      var nodes = [], a = [], N = 64, g = Math.PI * (3 - Math.sqrt(5));
      for (var i = 0; i < N; i++) { var y = 1 - 2 * (i + .5) / N, q = Math.sqrt(1 - y * y), t = g * i, r = .62 + Math.random() * .38; nodes.push([Math.cos(t) * q * r, y * r * .85, Math.sin(t) * q * r]); }
      nodes.forEach(function (p, i) {
        for (var k = 0; k < 4; k++) add(a, p[0] + (Math.random() - .5) * .03, p[1] + (Math.random() - .5) * .03, p[2] + (Math.random() - .5) * .03, 1);
        nodes.map(function (q, j) { return [Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]), j]; }).sort(function (x, y) { return x[0] - y[0]; }).slice(1, 4)
          .forEach(function (d) { if (d[1] > i) line(a, p, nodes[d[1]], Math.max(5, Math.round(d[0] * 22)), 0); });
      });
      var c = []; sphere(c, .2, 260, 7);
      var o = []; circle(o, 1.22, 150, function (i) { return i % 10 === 0; });
      var o2 = []; circle(o2, 1.34, 90, function (i) { return i < 8; });
      return [part(a, { spin: .12, a: HALF, wb: .05 }), part(c, { spin: -.5, a: HALF, base: 1.3 }), part(o, { spin: .2, a: 1.25, b: .3, base: .7 }), part(o2, { spin: -.35, a: 1.0, b: -.5, base: .7 })];
    },
    chain: function () {
      var out = [], offs = [], l = [];
      for (var i = 0; i < 5; i++) offs.push([(i - 2) * .56, Math.sin(i * 1.4) * .26, Math.cos(i * 1.2) * .22]);
      offs.forEach(function (o, i) { var a = []; cube(a, .2); sphere(a, .07, 30, 2); out.push(part(a, { off: o, a: i * .7, b: i * .4, wa: .22 * (i % 2 ? 1 : -1), wb: .17, base: 1.15 })); if (i) line(l, offs[i - 1], o, 22, function (k) { return k % 4 === 0; }); });
      out.push(part(l, { base: .9 }));
      var r = []; circle(r, 1.36, 170, function (i) { return i % 17 === 0; }); out.push(part(r, { a: 1.2, spin: .1, base: .5 }));
      return out;
    },
    globe: function () {
      var a = [], r = .88, i, j;
      for (i = -75; i <= 75; i += 15) { var la = i * Math.PI / 180, n = Math.round(110 * Math.cos(la)); for (j = 0; j < n; j++) { var u = j / n * TAU; add(a, r * Math.cos(la) * Math.cos(u), r * Math.cos(la) * Math.sin(u), r * Math.sin(la), 0); } }
      for (i = 0; i < 12; i++) for (j = -28; j <= 28; j++) { var lo = i / 12 * TAU, lt = j / 30 * HALF; if (j % 5) add(a, r * Math.cos(lt) * Math.cos(lo), r * Math.cos(lt) * Math.sin(lo), r * Math.sin(lt), 0); }
      for (i = 0; i < 14; i++) { var z = Math.random() * 1.6 - .8, q = Math.sqrt(1 - z * z), t = Math.random() * TAU, d = [q * Math.cos(t), q * Math.sin(t), z]; line(a, [d[0] * r, d[1] * r, d[2] * r], [d[0] * 1.12, d[1] * 1.12, d[2] * 1.12], 7, 1); }
      var o = []; ring(o, 1.24); var o2 = []; circle(o2, 1.42, 120, function (k) { return k < 6; });
      return [part(a, { spin: .2, a: HALF - .35 }), part(o, { rad: 1.24, spin: .3, a: 1.2, b: .25, base: .75 }), part(o2, { spin: -.5, a: 1.5, b: -.5, base: .7 })];
    },
    shield: function () {
      var out = [];
      [-.42, 0, .42].forEach(function (y, i) {
        var a = []; for (var r = .16; r < .78; r += .15) circle(a, r, Math.round(r * 90), function (k) { return k % 11 === 0; });
        out.push(part(a, { off: [0, y, 0], a: HALF, spin: (i % 2 ? -1 : 1) * .25, base: 1.1 }));
      });
      var l = []; for (var k = 0; k < 4; k++) { var u = k / 4 * TAU + .6; line(l, [.45 * Math.cos(u), -.42, .45 * Math.sin(u)], [.45 * Math.cos(u), .42, .45 * Math.sin(u)], 18, function (i) { return i % 6 === 0; }); }
      out.push(part(l, { base: .8 }));
      var d = [], g = Math.PI * (3 - Math.sqrt(5)), N = 620;
      for (var i = 0; i < N; i++) { var z = 1 - 2 * (i + .5) / N, q = Math.sqrt(1 - z * z), t = g * i; if (z > -.35) add(d, Math.cos(t) * q * 1.12, Math.sin(t) * q * 1.12, z * 1.12, i % 13 === 0); }
      circle(d, 1.05, 140, function (i) { return i % 7 === 0; }, -.39);
      out.push(part(d, { a: -HALF, spin: .12, base: .85 }));
      return out;
    },
    products: function () {
      var out = [], R = .78, shapes = [
        function (a) { cube(a, .2); },
        function (a) { sphere(a, .22, 170, 6); circle(a, .32, 60, 0); },
        function (a) { for (var i = 0; i < 4; i++) { var h = .1 + i * .09; line(a, [-.22 + i * .15, -.25, 0], [-.22 + i * .15, -.25 + h * 2, 0], 10, function (k) { return k === 10; }); line(a, [-.22 + i * .15, -.25, .08], [-.22 + i * .15, -.25 + h * 2, .08], 10, 0); } },
        function (a) { [.1, .18, .26].forEach(function (r) { circle(a, r, Math.round(r * 220), function (k) { return k % 9 === 0; }); }); }
      ];
      shapes.forEach(function (fn, i) { var a = [], u = i / 4 * TAU + .5; fn(a); out.push(part(a, { off: [R * Math.cos(u), Math.sin(i * 2) * .12, R * Math.sin(u)], a: i === 3 ? .4 : i, b: i, wa: i === 2 ? 0 : .2, wb: .25, spin: .3, base: 1.2 })); });
      var c = []; sphere(c, .13, 150, 5); out.push(part(c, { spin: .4, a: HALF }));
      var r = []; circle(r, R, 130, function (i) { return i % 13 === 0; }); circle(r, 1.2, 160, 0); out.push(part(r, { a: HALF, spin: -.1, base: .55 }));
      return out;
    },
    helix: function () {
      var a = [], N = 150, r = .44, turns = 2.3;
      for (var i = 0; i < N; i++) {
        var t = i / (N - 1), z = (t - .5) * 2.3, u = t * turns * TAU, p = [r * Math.cos(u), r * Math.sin(u), z], q = [-p[0], -p[1], z];
        add(a, p[0], p[1], z, i % 5 === 0); add(a, q[0], q[1], z, i % 5 === 0);
        if (i % 6 === 3) line(a, p, q, 10, Math.floor(i / 6) % 5 === 2);
      }
      var o = []; circle(o, 1.25, 150, function (i) { return i % 30 < 3; });
      return [part(a, { a: HALF + .25, b: .35, spin: .45, base: 1.1 }), part(o, { a: HALF, spin: -.15, base: .55 })];
    },
    orbits: function () {
      var out = [], c = []; sphere(c, .22, 300, 6); out.push(part(c, { a: HALF, spin: .4, base: 1.2 }));
      [[.55, 1.2, .2], [.82, 1.45, -.5], [1.1, 1.0, .7]].forEach(function (o, i) {
        var a = []; circle(a, o[0], Math.round(o[0] * 150), 0); sphere(a, .05, 40, 1); for (var k = 0; k < a.length; k += 7) if (a[k + 3]) a[k] += o[0];
        out.push(part(a, { a: o[1], b: o[2], spin: (i % 2 ? -1 : 1) * (.7 - i * .15) }));
      });
      var d = []; for (var i = 0; i < 220; i++) { var z = Math.random() * 2 - 1, q = Math.sqrt(1 - z * z), t = Math.random() * TAU, r = 1.1 + Math.random() * .4; add(d, q * Math.cos(t) * r, q * Math.sin(t) * r, z * r, i % 20 === 0); }
      out.push(part(d, { spin: .05, wb: .04, base: .5 }));
      return out;
    },
    radar: function () {
      var a = []; for (var r = .22; r < 1.25; r += .2) circle(a, r, Math.round(r * 120), function (i) { return i % 15 === 0; });
      line(a, [-1.25, 0, 0], [1.25, 0, 0], 50, 0); line(a, [0, -1.25, 0], [0, 1.25, 0], 50, 0);
      for (var i = 0; i < 7; i++) { var u = Math.random() * TAU, q = .3 + Math.random() * .85; for (var k = 0; k < 5; k++) add(a, q * Math.cos(u) + (Math.random() - .5) * .04, q * Math.sin(u) + (Math.random() - .5) * .04, 0, 1); }
      var s = []; for (var j = 0; j < 14; j++) line(s, [0, 0, 0], [1.22 * Math.cos(-j * .035), 1.22 * Math.sin(-j * .035), 0], 44, j === 0);
      var b = []; line(b, [0, 0, 0], [0, 0, .7], 24, function (i) { return i % 4 === 0; }); sphere(b, .07, 60, 2); for (var m = 0; m < b.length; m += 7) if (m > 25 * 7) b[m + 2] += .7;
      return [part(a, { a: -1.12, base: .8 }), part(s, { a: -1.12, spin: 1.1, base: .5 }), part(b, { a: -1.12, base: 1.3 })];
    }
  };

  // ---------- hologram renderer
  var cv = document.querySelector('canvas[data-holo]');
  if (cv) (function () {
    var hero = cv.closest('.hero'), stage = hero.querySelector('.stage'), ctx = cv.getContext('2d');
    var PARTS = (KINDS[cv.getAttribute('data-holo')] || KINDS.gyro)();
    var pickable = PARTS.some(function (p) { return p.info; });
    var panel = hero.querySelector('.panel'), chips = [].slice.call(hero.querySelectorAll('.chip')), hint = hero.querySelector('.hint');
    var W, H, dpr, cx, cy, R, wide, selX = 0, selY = 0, selS = 1, selT = -.5;
    function size() {
      var hr = hero.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1); W = hr.width; H = hr.height; wide = W > 900;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      cx = sr.left - hr.left + sr.width / 2; cy = sr.top - hr.top + sr.height / 2 - (pickable ? (wide ? 30 : 46) : 10);
      R = wide ? Math.min(sr.width * (pickable ? .3 : .36), sr.height * (pickable ? .3 : .34), 300) : Math.min(sr.width * .38, sr.height * .3, 150);
      selX = wide ? -.42 : 0; selY = wide ? .36 : (cy - (sr.top - hr.top + 96)) / R; selS = wide ? .8 : .92; selT = wide ? -.5 : -1.12;
    }
    size(); addEventListener('resize', size);
    if ('ResizeObserver' in window) new ResizeObserver(size).observe(hero);

    var yaw = -.5, pitch = .35, vy = .0035, vp = 0, down = false, moved = 0, lx = 0, ly = 0, mx = -999, my = -999;
    var hover = -1, sel = -1, auto = 0, touched = false, t0 = performance.now(), trail = [], CAM = 3.4, visible = true, frame = 0;
    window.holoKick = function (v) { vy += v || .03; };

    function select(i) {
      sel = (i === sel) ? -1 : i; touched = true;
      chips.forEach(function (c, j) { c.classList.toggle('on', j === sel); c.setAttribute('aria-pressed', j === sel ? 'true' : 'false'); });
      if (hint) hint.style.opacity = 0;
      if (!panel) return;
      if (sel < 0) { panel.classList.remove('open'); return; }
      var p = PARTS[sel].info;
      panel.querySelector('.pTag').textContent = p.n + ' · ' + p.verb;
      panel.querySelector('.pName').textContent = p.name;
      panel.querySelector('.pLine').textContent = p.line;
      panel.querySelector('.pList').innerHTML = p.list.map(function (s) { return '<li>' + s + '</li>'; }).join('');
      var a = panel.querySelector('.pLink'); a.href = p.href; a.textContent = 'Explore ' + p.name + ' →';
      panel.classList.add('open');
    }
    chips.forEach(function (c, i) { c.addEventListener('click', function () { select(i); }); });
    if (panel) panel.querySelector('.panel__x').addEventListener('click', function () { select(sel); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && sel >= 0) select(sel); });

    function local(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
    cv.addEventListener('pointerdown', function (e) { down = true; moved = 0; lx = e.clientX; ly = e.clientY; var m = local(e); mx = m[0]; my = m[1]; pick(); cv.classList.add('grab'); });
    addEventListener('pointermove', function (e) {
      var m = local(e); mx = m[0]; my = m[1];
      if (e.pointerType === 'mouse') { trail.push([mx, my, performance.now()]); if (trail.length > 26) trail.shift(); }
      if (!down) return;
      var dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
      vy = dx * .008; vp = dy * .008; yaw += vy; pitch += vp; if (hint) hint.style.opacity = 0; if (pickable && moved > 8) touched = true;
    });
    addEventListener('pointerup', function (e) {
      if (!down) return; down = false; cv.classList.remove('grab');
      if (pickable && moved < 8) { if (hover >= 0) select(hover); else if (sel >= 0) select(sel); }
      if (e.pointerType !== 'mouse') { mx = my = -999; }
    });
    cv.addEventListener('pointerleave', function () { if (!down) { mx = my = -999; } });

    function pick() {
      var best = -1, bd = 26 * 26;
      if (pickable) for (var i = 0; i < PARTS.length; i++) {
        if (!PARTS[i].info || (sel >= 0 && sel !== i)) continue;
        var s = PARTS[i].scr;
        for (var j = 0; j < s.length; j += 2) { var dx = s[j] - mx, dy = s[j + 1] - my, d = dx * dx + dy * dy; if (d < bd) { bd = d; best = i; } }
      }
      hover = best; cv.classList.toggle('point', best >= 0 && !down);
    }
    var yawEl = document.getElementById('yaw'), pitEl = document.getElementById('pit');
    function deg(v) { var d = Math.round(((v * 180 / Math.PI) % 360 + 360) % 360); return ('00' + d).slice(-3) + '°'; }

    function draw(now) {
      var t = (now - t0) / 1000, boot = still ? 1 : Math.min(1, t / 1.9); boot = 1 - Math.pow(1 - boot, 3);
      if (!down) { yaw += vy; pitch += vp; vy += ((still ? 0 : .0032) - vy) * .03; vp *= .94; pitch += (.35 - pitch) * .004; }
      if (pickable && !touched && t > 2.6) auto = Math.floor((t - 2.6) / 2.8) % 4;
      if (mx > -900 && !down) pick(); else if (!down) hover = -1;
      var hi = hover >= 0 ? hover : (pickable && !touched && t > 2.6 ? auto : -1);
      if (pickable && !touched) chips.forEach(function (c, j) { c.classList.toggle('on', j === hi); });

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.7); g.addColorStop(0, 'rgba(79,227,255,.13)'); g.addColorStop(1, 'rgba(79,227,255,0)');
      ctx.globalAlpha = boot; ctx.fillStyle = g; ctx.fillRect(cx - R * 2, cy - R * 2, R * 4, R * 4);
      var by = cy + R * 1.5;
      var cg = ctx.createLinearGradient(0, by, 0, cy - R * .4); cg.addColorStop(0, 'rgba(79,227,255,.16)'); cg.addColorStop(1, 'rgba(79,227,255,0)');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(cx - R * .28, by); ctx.lineTo(cx + R * .28, by); ctx.lineTo(cx + R * 1.15, cy - R * .4); ctx.lineTo(cx - R * 1.15, cy - R * .4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#4FE3FF'; ctx.lineWidth = 1;
      for (var e = 1; e <= 3; e++) { ctx.globalAlpha = boot * (.55 - e * .13); ctx.beginPath(); ctx.ellipse(cx, by, R * .28 * e, R * .28 * e * .2, 0, 0, 7); ctx.stroke(); }

      var cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      var scanY = cy - R * 1.4 + ((t * .26) % 1) * R * 2.8, flick = (Math.random() < .03 ? .8 : 1) * boot;
      for (var i = 0; i < PARTS.length; i++) {
        var p = PARTS[i], P = p.pts, isSel = sel === i;
        p.k += ((isSel ? 1 : 0) - p.k) * .1;
        var lum = sel >= 0 ? (isSel ? 1.7 : .1) : (hi === i ? 1.45 : (hi >= 0 ? .55 : .9));
        p.lum += (lum * p.base - p.lum) * .12;
        var s = t * p.spin, cs = Math.cos(s), ss = Math.sin(s);
        var a = p.a + t * p.wa, b = p.b + t * p.wb, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
        var k = p.k, sc = (p.core ? 3.4 : 1.02 / p.rad) * selS, cf = Math.cos(selT), sf = Math.sin(selT), o = p.off;
        var scr = p.scr; scr.length = 0; var white = -1;
        for (var j = 0, n = 0; j < P.length; j += 7, n++) {
          var x0 = P[j], y0 = P[j + 1], z0 = P[j + 2];
          var x = x0 * cs - y0 * ss, y = x0 * ss + y0 * cs, z = z0;
          var y1 = y * ca - z * sa, z1 = y * sa + z * ca;
          var x2 = x * cb + z1 * sb + o[0], z2 = -x * sb + z1 * cb + o[2]; y1 += o[1];
          var x3 = x2 * cyw + z2 * syw, z3 = -x2 * syw + z2 * cyw;
          var X = x3, Y = y1 * cp - z3 * sp, Z = y1 * sp + z3 * cp;
          if (k > .001) { var fx = x * sc + selX, fy = (y * cf - z * sf) * sc + selY, fz = (y * sf + z * cf) * sc; X += (fx - X) * k; Y += (fy - Y) * k; Z += (fz - Z) * k; }
          if (boot < 1) { var ib = 1 - boot; X += P[j + 4] * ib; Y += P[j + 5] * ib; Z += P[j + 6] * ib; }
          var pr = CAM / (CAM - Z), sx = cx + X * R * pr, sy = cy - Y * R * pr;
          if (j === 0) { p.ax = sx; p.ay = sy; }
          if (p.info && n % 5 === 0) scr.push(sx, sy);
          var f = P[j + 3], d = (Z + 1.3) / 2.6; d = d < 0 ? 0 : d > 1 ? 1 : d;
          var dy = (sy - scanY) / 16, al = (.22 + .6 * d + (f ? .35 : 0) + Math.exp(-dy * dy) * .8) * p.lum * flick;
          if (al < .02) continue;
          if (f !== white) { white = f; ctx.fillStyle = f ? '#DFFAFF' : '#4FE3FF'; }
          ctx.globalAlpha = al > 1 ? 1 : al;
          var z_ = (f ? 2.1 : 1.5) * pr * (wide ? 1 : .85) * (1 + k * .45);
          ctx.fillRect(sx - z_ / 2, sy - z_ / 2, z_, z_);
        }
      }
      ctx.globalAlpha = .22 * boot; ctx.fillStyle = '#4FE3FF'; ctx.fillRect(cx - R * 1.3, scanY, R * 2.6, 1);

      ctx.globalCompositeOperation = 'source-over'; ctx.font = '11px "Spline Sans Mono", monospace'; ctx.textBaseline = 'middle'; ctx.lineWidth = 1;
      if (boot >= 1 && sel < 0) for (var i = 0; i < PARTS.length; i++) {
        var p = PARTS[i]; if (!p.info) continue;
        var on = hi === i; if (p.core && !on) continue;
        var txt = p.info.n + '  ' + p.info.name.toUpperCase() + (on ? '  ·  ' + p.info.verb.toUpperCase() : '');
        var dir = p.ax >= cx ? 1 : -1, tw = ctx.measureText(txt).width + (wide ? 62 : 44);
        if (dir > 0 && p.ax + tw > W - 8) dir = -1; else if (dir < 0 && p.ax - tw < 8) dir = 1;
        var x1 = p.ax + dir * 16, y1 = p.ay - 16, x2 = x1 + dir * (wide ? 34 : 16);
        ctx.globalAlpha = on ? 1 : .42; ctx.strokeStyle = ctx.fillStyle = on ? '#DFFAFF' : '#4FE3FF';
        ctx.beginPath(); ctx.arc(p.ax, p.ay, 3, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p.ax + dir * 2, p.ay - 2); ctx.lineTo(x1, y1); ctx.lineTo(x2, y1); ctx.stroke();
        ctx.textAlign = dir > 0 ? 'left' : 'right'; ctx.fillText(txt, x2 + dir * 6, y1);
      }
      if (sel >= 0 && panel && PARTS[sel].k > .6) {
        var p = PARTS[sel], hr = hero.getBoundingClientRect(), pr2 = panel.getBoundingClientRect();
        var tx = wide ? pr2.left - hr.left : pr2.left - hr.left + 30, ty = pr2.top - hr.top + (wide ? 24 : 0);
        ctx.globalAlpha = .8; ctx.strokeStyle = '#4FE3FF';
        ctx.beginPath(); ctx.arc(p.ax, p.ay, 4, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(p.ax, p.ay + 4);
        if (wide) { ctx.lineTo(p.ax, ty); ctx.lineTo(tx, ty); } else { ctx.lineTo(p.ax, ty - 14); ctx.lineTo(tx, ty - 14); ctx.lineTo(tx, ty); }
        ctx.stroke();
      }
      if (trail.length > 1) {
        ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = '#4FE3FF'; ctx.lineCap = 'round';
        for (var i = 1; i < trail.length; i++) {
          var age = (now - trail[i][2]) / 450; if (age > 1) continue;
          ctx.globalAlpha = (1 - age) * .5; ctx.lineWidth = (1 - age) * 3;
          ctx.beginPath(); ctx.moveTo(trail[i - 1][0], trail[i - 1][1]); ctx.lineTo(trail[i][0], trail[i][1]); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      if (yawEl && frame++ % 6 === 0) { yawEl.textContent = deg(yaw); pitEl.textContent = deg(pitch); }
      if (visible) requestAnimationFrame(draw);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { var v = e[0].isIntersecting; if (v && !visible) { visible = true; requestAnimationFrame(draw); } visible = v; }).observe(hero);
    requestAnimationFrame(draw);
  })();

  // ---------- page interactions
  var $ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clock = document.getElementById('clock');
  if (clock) { var tick = function () { try { clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Dubai' }); } catch (e) {} }; tick(); setInterval(tick, 1000); }
  var bootEl = document.getElementById('boot');
  if (bootEl) { var msg = bootEl.getAttribute('data-msg'), bi = 0; (function type() { bootEl.textContent = msg.slice(0, bi++); if (bi <= msg.length) setTimeout(type, still ? 0 : 40); })(); }

  var header = document.querySelector('.header'), mb = document.querySelector('.menu-btn');
  if (mb) mb.addEventListener('click', function () { var o = header.classList.toggle('open'); mb.setAttribute('aria-expanded', o ? 'true' : 'false'); mb.textContent = o ? 'Close' : 'Menu'; document.documentElement.classList.toggle('lock', o); });

  var rv = $('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // Diagnostics cards: resolve one by one, then toggle on tap
  var diags = $('.diag');
  if (diags.length) {
    var setD = function (el, ok) { el.classList.toggle('ok', ok); el.setAttribute('aria-pressed', ok ? 'true' : 'false'); el.querySelector('.diag__st b').textContent = ok ? 'Resolved' : 'Fault detected'; };
    if ('IntersectionObserver' in window) {
      var dio = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { diags.forEach(function (d, i) { setTimeout(function () { setD(d, true); }, still ? 0 : 1100 + i * 800); }); dio.disconnect(); } }, { threshold: .4 });
      dio.observe(diags[0].parentNode);
    }
    diags.forEach(function (d) { d.addEventListener('click', function () { setD(d, !d.classList.contains('ok')); }); });
  }

  // Selector groups (five senses, name decoder, stages): buttons swap a read-out panel; auto-cycle until touched
  $('[data-pick]').forEach(function (box) {
    var btns = $('[data-i]', box), out = box.querySelector('.readout'), used = false, cur = 0, timer;
    var show = function (i) {
      cur = i; btns.forEach(function (b, j) { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
      box.style.setProperty('--sel', i);
      out.classList.add('swap');
      setTimeout(function () { var b = btns[i]; out.querySelector('.ro-tag').textContent = b.getAttribute('data-tag'); out.querySelector('.ro-title').textContent = b.getAttribute('data-title'); out.querySelector('.ro-text').textContent = b.getAttribute('data-text'); out.classList.remove('swap'); }, 160);
    };
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { used = true; clearInterval(timer); show(i); });
      b.addEventListener('mouseenter', function () { used = true; clearInterval(timer); if (cur !== i) show(i); });
    });
    if (!still) timer = setInterval(function () { if (!used && box.getBoundingClientRect().top < innerHeight && box.getBoundingClientRect().bottom > 0) show((cur + 1) % btns.length); }, 2600);
  });

  $('[data-kick]').forEach(function (el) { el.addEventListener('mouseenter', function () { if (window.holoKick) window.holoKick(.035); }); });

  var form = document.querySelector('.form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); var n = form.querySelector('.form-note'); n.hidden = false; n.focus(); });
})();
