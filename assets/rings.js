// G3 Technologies: live engraved rings. Three interlocked (Borromean) rings drawn as a graphite stipple,
// turning slowly, tilting with the pointer, draggable, and able to light up one ring in vermilion.
(function () {
  var host = document.querySelector('[data-rings]');
  if (!host || !window.HTMLCanvasElement) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- geometry: points on three tube surfaces, with normals and a fixed stipple threshold
  var A = 1.45, B = 0.92, TUBE = 0.17, PER = 52000, N = PER * 3;
  var P = new Float32Array(N * 3), NR = new Float32Array(N * 3), TH = new Float32Array(N), RING = new Uint8Array(N);
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  for (var r = 0; r < 3; r++) {
    for (var i = 0; i < PER; i++) {
      var k = r * PER + i, t = rnd() * 6.283185, p = rnd() * 6.283185;
      var cx = A * Math.cos(t), cy = B * Math.sin(t);
      var tx = -A * Math.sin(t), ty = B * Math.cos(t), tl = Math.hypot(tx, ty); tx /= tl; ty /= tl;
      var n1x = ty, n1y = -tx; // in-plane normal; second normal is +z
      var nx = Math.cos(p) * n1x, ny = Math.cos(p) * n1y, nz = Math.sin(p);
      var v = [cx + TUBE * nx, cy + TUBE * ny, TUBE * nz], n = [nx, ny, nz];
      var perm = r === 0 ? [0, 1, 2] : r === 1 ? [2, 0, 1] : [1, 2, 0];
      for (var a = 0; a < 3; a++) { P[k * 3 + perm[a]] = v[a]; NR[k * 3 + perm[a]] = n[a]; }
      TH[k] = rnd(); RING[k] = r;
    }
  }

  // ---- canvas
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

  // colours as little-endian RGBA words
  function word(r, g, b) { return (255 << 24) | (b << 16) | (g << 8) | r; }
  var BONE = word(0xEF, 0xEB, 0xE3), INK = word(0x1C, 0x1B, 0x19), INK2 = word(0x4A, 0x48, 0x43), SIG = word(0xE5, 0x48, 0x2D);

  // ---- state
  var spin = 0, tiltX = 0, tiltY = 0, aimX = 0, aimY = 0, drag = null, vel = 0.0016, glow = -1, glowAmt = 0;
  var L = [-0.5, 0.6, 0.62], ll = Math.hypot(L[0], L[1], L[2]); L = [L[0] / ll, L[1] / ll, L[2] / ll];

  function mat(ax, ay, az) {
    var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay), cz = Math.cos(az), sz = Math.sin(az);
    // R = Rz * Rx * Ry
    var ry = [cy, 0, sy, 0, 1, 0, -sy, 0, cy];
    var rx = [1, 0, 0, 0, cx, -sx, 0, sx, cx];
    var rz = [cz, -sz, 0, sz, cz, 0, 0, 0, 1];
    function mul(m, q) {
      var o = new Array(9);
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) o[i * 3 + j] = m[i * 3] * q[j] + m[i * 3 + 1] * q[3 + j] + m[i * 3 + 2] * q[6 + j];
      return o;
    }
    return mul(rz, mul(rx, ry));
  }

  function draw() {
    if (!buf) return;
    var m = mat(0.62 + tiltX, -0.55 + spin + tiltY, 0.3);
    var s = Math.min(W, H) / 4.3, ox = W / 2, oy = H / 2;
    buf.fill(BONE); zb.fill(-1e9);
    var i, k, x, y, z, nz, sx, sy, zi;
    // depth pass (front-facing points only)
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
    // stipple pass
    var dot = dpr > 1.4 ? 2 : 1;
    var dens = 0.55 * Math.min(1.6, 0.68 / (N / (W * H)) / (dot * dot));
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

  // ---- motion loop (runs only while visible)
  var running = false, visible = true, last = 0;
  function frame(t) {
    if (!running) return;
    var dt = last ? Math.min(50, t - last) : 16; last = t;
    if (!drag) { spin += vel * dt * 0.06; vel += (0.0016 - vel) * 0.02; }
    tiltX += (aimX - tiltX) * 0.06; tiltY += (aimY - tiltY) * 0.06;
    var target = glow >= 0 ? 0.55 : 0; glowAmt += (target - glowAmt) * 0.12;
    draw();
    requestAnimationFrame(frame);
  }
  function start() { if (!running && visible && !reduce && !document.hidden) { running = true; last = 0; requestAnimationFrame(frame); } }
  function stop() { running = false; }

  host.classList.add('is-live');
  size();
  window.addEventListener('resize', function () { size(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(host);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
  start();

  // ---- pointer: tilt toward the pointer over the hero, drag to spin
  var zone = host.closest('.hero') || host;
  zone.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    aimY = ((e.clientX - (r.left + r.width / 2)) / window.innerWidth) * 0.6;
    aimX = ((e.clientY - (r.top + r.height / 2)) / window.innerHeight) * 0.4;
    if (drag) { var dx = e.clientX - drag.x; drag.x = e.clientX; spin += dx * 0.008; vel = dx * 0.008 / 16 * 16; if (reduce) draw(); }
  });
  zone.addEventListener('pointerleave', function () { aimX = 0; aimY = 0; });
  host.addEventListener('pointerdown', function (e) { drag = { x: e.clientX }; host.setPointerCapture(e.pointerId); host.classList.add('is-drag'); });
  host.addEventListener('pointerup', function () { drag = null; host.classList.remove('is-drag'); vel = Math.max(-0.05, Math.min(0.05, vel)); });
  host.addEventListener('pointercancel', function () { drag = null; host.classList.remove('is-drag'); });

  // ---- light a ring: elements with data-ring="0|1|2|3" (3 = all)
  document.querySelectorAll('[data-ring]').forEach(function (el) {
    var on = function () { glow = +el.getAttribute('data-ring'); if (reduce) { glowAmt = 0.55; draw(); } };
    var off = function () { glow = -1; if (reduce) { glowAmt = 0; draw(); } };
    el.addEventListener('mouseenter', on); el.addEventListener('focus', on);
    el.addEventListener('mouseleave', off); el.addEventListener('blur', off);
  });
})();
