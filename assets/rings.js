// G3 Technologies: live engraved objects. One 3D object per page, drawn as a graphite stipple, turning slowly,
// tilting with the pointer and draggable. The homepage rings can light up one ring in vermilion.
(function () {
  var host = document.querySelector('[data-rings]');
  if (!host || !window.HTMLCanvasElement) return;
  var kind = host.getAttribute('data-rings') || 'rings';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- geometry builders
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  var pts = [], nrm = [], grp = [];
  function add(p, n, g) { pts.push(p[0], p[1], p[2]); nrm.push(n[0], n[1], n[2]); grp.push(g || 0); }
  function norm(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }

  // a tube of radius r around a curve c(t), t in [0, T)
  function tube(c, n, r, T, g) {
    T = T || 6.283185;
    for (var i = 0; i < n; i++) {
      var t = rnd() * T, ph = rnd() * 6.283185, e = 1e-3;
      var p0 = c(t), a = c(t - e), b = c(t + e);
      var tg = norm([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
      var up = Math.abs(tg[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
      var n1 = norm(cross(tg, up)), n2 = cross(tg, n1);
      var nn = [Math.cos(ph) * n1[0] + Math.sin(ph) * n2[0], Math.cos(ph) * n1[1] + Math.sin(ph) * n2[1], Math.cos(ph) * n1[2] + Math.sin(ph) * n2[2]];
      add([p0[0] + r * nn[0], p0[1] + r * nn[1], p0[2] + r * nn[2]], nn, g);
    }
  }
  function sphere(c, r, n, g) {
    for (var i = 0; i < n; i++) {
      var u = rnd() * 2 - 1, th = rnd() * 6.283185, s = Math.sqrt(1 - u * u);
      var v = [s * Math.cos(th), s * Math.sin(th), u];
      add([c[0] + r * v[0], c[1] + r * v[1], c[2] + r * v[2]], v, g);
    }
  }
  function box(c, h, n, g) {
    var areas = [h[1] * h[2], h[1] * h[2], h[0] * h[2], h[0] * h[2], h[0] * h[1], h[0] * h[1]], tot = 0, i;
    for (i = 0; i < 6; i++) tot += areas[i];
    for (i = 0; i < n; i++) {
      var r = rnd() * tot, f = 0; while (f < 5 && r > areas[f]) { r -= areas[f]; f++; }
      var ax = f >> 1, sg = f % 2 ? -1 : 1, o = [0, 1, 2].filter(function (q) { return q !== ax; });
      var p = [0, 0, 0], nn = [0, 0, 0];
      p[ax] = sg * h[ax]; p[o[0]] = (rnd() * 2 - 1) * h[o[0]]; p[o[1]] = (rnd() * 2 - 1) * h[o[1]]; nn[ax] = sg;
      add([c[0] + p[0], c[1] + p[1], c[2] + p[2]], nn, g);
    }
  }
  function ellipse(a, b, perm, shift) {
    shift = shift || [0, 0, 0];
    return function (t) {
      var v = [a * Math.cos(t), b * Math.sin(t), 0], o = [0, 0, 0];
      o[perm[0]] = v[0]; o[perm[1]] = v[1]; o[perm[2]] = v[2];
      return [o[0] + shift[0], o[1] + shift[1], o[2] + shift[2]];
    };
  }

  // each object: build(), base view angles [x, y, z], density multiplier
  var OBJECTS = {
    rings: { view: [0.62, -0.55, 0.3], dens: 1, build: function () {
      tube(ellipse(1.45, 0.92, [0, 1, 2]), 52000, 0.17, 0, 0);
      tube(ellipse(1.45, 0.92, [1, 2, 0]), 52000, 0.17, 0, 1);
      tube(ellipse(1.45, 0.92, [2, 0, 1]), 52000, 0.17, 0, 2);
    } },
    knot: { view: [0.35, -0.3, 0], dens: 1, build: function () {
      tube(function (t) { return [(Math.sin(t) + 2 * Math.sin(2 * t)) * 0.42, (Math.cos(t) - 2 * Math.cos(2 * t)) * 0.42, -Math.sin(3 * t) * 0.42]; }, 150000, 0.17);
    } },
    chain: { view: [0.55, -0.45, 0.5], dens: 1, build: function () {
      tube(ellipse(0.78, 0.62, [0, 1, 2], [-1.05, 0, 0]), 50000, 0.14);
      tube(ellipse(0.78, 0.62, [0, 2, 1], [0, 0, 0]), 50000, 0.14);
      tube(ellipse(0.78, 0.62, [0, 1, 2], [1.05, 0, 0]), 50000, 0.14);
    } },
    sensors: { view: [0.55, 0.6, 0], dens: 1.5, build: function () {
      box([0, 0, 0], [1.35, 0.06, 1.0], 70000);
      var hs = [0.55, 0.9, 0.4, 0.75, 1.15, 0.6, 0.35, 0.8, 0.5], q = 0;
      [-0.9, 0, 0.9].forEach(function (gx) { [-0.6, 0, 0.6].forEach(function (gz) {
        var h = hs[q++];
        tube(function (t) { return [gx, 0.06 + h * t / 6.283185, gz]; }, 5000, 0.03);
        sphere([gx, 0.16 + h, gz], 0.1, 6000);
      }); });
    } },
    layers: { view: [0.5, 0.7, 0], dens: 1.6, build: function () {
      box([0, -0.62, 0], [0.95, 0.16, 0.95], 60000);
      box([0, 0, 0], [0.8, 0.16, 0.8], 48000);
      box([0, 0.62, 0], [0.65, 0.16, 0.65], 36000);
    } },
    cube: { view: [0.6, 0.75, 0], dens: 1.6, build: function () {
      box([0, 0, 0], [0.9, 0.9, 0.9], 140000);
    } },
    helix: { view: [0.25, 0, 0.15], dens: 1, build: function () {
      tube(function (t) { var r = 0.55 + 0.35 * t / 18.85; return [r * Math.cos(t), -1.25 + 2.5 * t / 18.85, r * Math.sin(t)]; }, 150000, 0.13, 18.85);
    } },
    pair: { view: [0.5, -0.5, 0.25], dens: 1, build: function () {
      tube(ellipse(0.95, 0.95, [0, 1, 2], [-0.5, 0, 0]), 75000, 0.17);
      tube(ellipse(0.95, 0.95, [0, 2, 1], [0.5, 0, 0]), 75000, 0.17);
    } }
  };
  var obj = OBJECTS[kind] || OBJECTS.rings;
  obj.build();
  var N = grp.length, P = new Float32Array(pts), NR = new Float32Array(nrm), RING = new Uint8Array(grp), TH = new Float32Array(N);
  pts = nrm = grp = null;
  var cx = 0, cy = 0, cz = 0, i, k, reach = 0;
  for (i = 0; i < N; i++) { cx += P[i * 3]; cy += P[i * 3 + 1]; cz += P[i * 3 + 2]; TH[i] = rnd(); }
  cx /= N; cy /= N; cz /= N;
  for (i = 0; i < N; i++) { k = i * 3; P[k] -= cx; P[k + 1] -= cy; P[k + 2] -= cz; reach = Math.max(reach, Math.hypot(P[k], P[k + 1], P[k + 2])); }

  // ---------------------------------------------------------------- canvas
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.className = 'rings-canvas';
  host.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, img, buf, zb, ZW, ZH, dpr = 1;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = host.getBoundingClientRect();
    W = Math.max(1, Math.round(rect.width * dpr)); H = Math.max(1, Math.round(rect.height * dpr));
    canvas.width = W; canvas.height = H;
    img = ctx.createImageData(W, H); buf = new Uint32Array(img.data.buffer);
    ZW = (W >> 1) + 1; ZH = (H >> 1) + 1; zb = new Float32Array(ZW * ZH);
    draw();
  }
  function word(r, g, b) { return (255 << 24) | (b << 16) | (g << 8) | r; }
  var BONE = word(0xEF, 0xEB, 0xE3), INK = word(0x1C, 0x1B, 0x19), INK2 = word(0x4A, 0x48, 0x43), SIG = word(0xE5, 0x48, 0x2D);

  var spin = 0, tiltX = 0, tiltY = 0, aimX = 0, aimY = 0, drag = null, vel = 0.0016, glow = -1, glowAmt = 0;
  var L = norm([-0.5, 0.6, 0.62]);
  function mat(ax, ay, az) {
    var c1 = Math.cos(ax), s1 = Math.sin(ax), c2 = Math.cos(ay), s2 = Math.sin(ay), c3 = Math.cos(az), s3 = Math.sin(az);
    var ry = [c2, 0, s2, 0, 1, 0, -s2, 0, c2], rx = [1, 0, 0, 0, c1, -s1, 0, s1, c1], rz = [c3, -s3, 0, s3, c3, 0, 0, 0, 1];
    function mul(m, q) { var o = []; for (var a = 0; a < 3; a++) for (var b = 0; b < 3; b++) o[a * 3 + b] = m[a * 3] * q[b] + m[a * 3 + 1] * q[3 + b] + m[a * 3 + 2] * q[6 + b]; return o; }
    return mul(rz, mul(rx, ry));
  }

  function draw() {
    if (!buf) return;
    var v = obj.view, m = mat(v[0] + tiltX, v[1] + spin + tiltY, v[2]);
    var s = Math.min(W, H) / (2 * reach * 1.04), ox = W / 2, oy = H / 2;
    buf.fill(BONE); zb.fill(-1e9);
    var x, y, z, nz, sx, sy, zi;
    for (i = 0; i < N; i++) {
      k = i * 3;
      nz = m[6] * NR[k] + m[7] * NR[k + 1] + m[8] * NR[k + 2];
      if (nz < -0.05) continue;
      x = m[0] * P[k] + m[1] * P[k + 1] + m[2] * P[k + 2];
      y = m[3] * P[k] + m[4] * P[k + 1] + m[5] * P[k + 2];
      z = m[6] * P[k] + m[7] * P[k + 1] + m[8] * P[k + 2];
      sx = (ox + x * s) >> 1; sy = (oy - y * s) >> 1;
      if (sx < 0 || sy < 0 || sx >= ZW || sy >= ZH) continue;
      zi = sy * ZW + sx; if (z > zb[zi]) zb[zi] = z;
    }
    var dot = (dpr > 1.4 && W > 900) ? 2 : 1;
    var dens = 0.55 * obj.dens * Math.min(1.6, 0.68 / (N / (W * H)) / (dot * dot));
    for (i = 0; i < N; i++) {
      k = i * 3;
      var nx = m[0] * NR[k] + m[1] * NR[k + 1] + m[2] * NR[k + 2];
      var ny = m[3] * NR[k] + m[4] * NR[k + 1] + m[5] * NR[k + 2];
      nz = m[6] * NR[k] + m[7] * NR[k + 1] + m[8] * NR[k + 2];
      if (nz < -0.05) continue;
      x = m[0] * P[k] + m[1] * P[k + 1] + m[2] * P[k + 2];
      y = m[3] * P[k] + m[4] * P[k + 1] + m[5] * P[k + 2];
      z = m[6] * P[k] + m[7] * P[k + 1] + m[8] * P[k + 2];
      var px = ox + x * s, py = oy - y * s;
      sx = px >> 1; sy = py >> 1;
      if (sx < 0 || sy < 0 || sx >= ZW || sy >= ZH) continue;
      if (z < zb[sy * ZW + sx] - 0.03) continue;
      var lam = nx * L[0] + ny * L[1] + nz * L[2]; if (lam < 0) lam = 0;
      var dark = Math.pow(1 - lam, 1.4) * 0.9 + 0.08 + (nz < 0.25 ? 0.5 * (0.25 - nz) : 0);
      if (dark * dens < TH[i]) continue;
      var lit = glowAmt > 0.01 && (glow === 3 || glow === RING[i]);
      var c = lit && TH[i] < glowAmt ? SIG : (TH[i] < dark * dens * 0.6 ? INK : INK2);
      var X = px | 0, Y = py | 0;
      if (X < 0 || Y < 0 || X + dot > W || Y + dot > H) continue;
      var o = Y * W + X;
      buf[o] = c; if (dot > 1) { buf[o + 1] = c; buf[o + W] = c; buf[o + W + 1] = c; }
    }
    ctx.putImageData(img, 0, 0);
  }

  var running = false, visible = true, last = 0;
  function frame(t) {
    if (!running) return;
    var dt = last ? Math.min(50, t - last) : 16; last = t;
    if (!drag) { spin += vel * dt * 0.06; vel += (0.0016 - vel) * 0.02; }
    tiltX += (aimX - tiltX) * 0.06; tiltY += (aimY - tiltY) * 0.06;
    glowAmt += ((glow >= 0 ? 0.55 : 0) - glowAmt) * 0.12;
    draw();
    requestAnimationFrame(frame);
  }
  function start() { if (!running && visible && !reduce && !document.hidden) { running = true; last = 0; requestAnimationFrame(frame); } }
  function stop() { running = false; }

  host.classList.add('is-live');
  size();
  window.addEventListener('resize', size);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(host);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  start();

  var zone = host.closest('.hero') || host;
  zone.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    aimY = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 0.6;
    aimX = ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 0.4;
    if (drag) { var dx = e.clientX - drag.x; drag.x = e.clientX; spin += dx * 0.008; vel = dx * 0.008; if (reduce) draw(); }
  });
  zone.addEventListener('pointerleave', function () { aimX = 0; aimY = 0; });
  host.addEventListener('pointerdown', function (e) { drag = { x: e.clientX }; host.setPointerCapture(e.pointerId); host.classList.add('is-drag'); });
  host.addEventListener('pointerup', function () { drag = null; host.classList.remove('is-drag'); vel = Math.max(-0.05, Math.min(0.05, vel)); });
  host.addEventListener('pointercancel', function () { drag = null; host.classList.remove('is-drag'); });

  document.querySelectorAll('[data-ring]').forEach(function (el) {
    var on = function () { glow = +el.getAttribute('data-ring'); if (reduce) { glowAmt = 0.55; draw(); } };
    var off = function () { glow = -1; if (reduce) { glowAmt = 0; draw(); } };
    el.addEventListener('mouseenter', on); el.addEventListener('focus', on);
    el.addEventListener('mouseleave', off); el.addEventListener('blur', off);
  });
})();
