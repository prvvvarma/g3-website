// Gi5.si · one interactive moment per service page
(function () {
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function onView(el, fn) { if (!('IntersectionObserver' in window)) return fn(); var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); fn(); } }, { threshold: .35 }); io.observe(el); }

  // AI: ask a question, watch it answer
  var ai = $('[data-fx="ai"]');
  if (ai) {
    var log = $('.fxai__log', ai), busy = false;
    function bubble(t, me) { var b = document.createElement('p'); b.className = me ? 'me' : 'bot'; b.textContent = t; log.appendChild(b); log.scrollTop = log.scrollHeight; return b; }
    function ask(btn) {
      if (busy) return; busy = true; $$('button', ai).forEach(function (b) { b.classList.toggle('on', b === btn); });
      if (log.children.length > 6) log.innerHTML = '';
      bubble(btn.textContent, true);
      var dots = bubble('', false); dots.classList.add('typing'); dots.innerHTML = '<i></i><i></i><i></i>';
      setTimeout(function () {
        dots.classList.remove('typing'); dots.textContent = ''; var a = btn.getAttribute('data-a'), i = 0;
        if (/[؀-ۿ]/.test(a)) dots.setAttribute('dir', 'rtl');
        (function type() { if (still) { dots.textContent = a; busy = false; return; } dots.textContent = a.slice(0, ++i); log.scrollTop = log.scrollHeight; if (i < a.length) setTimeout(type, 16); else busy = false; })();
      }, still ? 0 : 900);
    }
    $$('.fxai__qs button', ai).forEach(function (b) { b.addEventListener('click', function () { ask(b); }); });
    onView(ai, function () { ask($('.fxai__qs button', ai)); });
  }

  // Blockchain: tamper with a record, the chain rejects it
  var bc = $('[data-fx="bc"]');
  if (bc) {
    var btn = $('button', bc), msg = $('.fxbc__msg', bc), t = $('.t', bc), lis = $$('.fxbc__chain li', bc), idx = lis.indexOf(t), running = false;
    btn.addEventListener('click', function () {
      if (running) return; running = true; btn.disabled = true;
      $('span', t).textContent = 'Goods NOT shipped'; $('code', t).textContent = '0000…'; t.classList.add('bad');
      msg.textContent = 'Record changed. Checking with partners…';
      lis.forEach(function (li, i) { if (i > idx) setTimeout(function () { li.classList.add('broken'); }, 350 * (i - idx)); });
      setTimeout(function () { msg.innerHTML = '<b>Rejected.</b> The other 3 partners hold the original. The change is refused.'; bc.classList.add('rejected'); }, 1400);
      setTimeout(function () {
        $('span', t).textContent = 'Goods shipped'; $('code', t).textContent = '7bd2…'; t.classList.remove('bad'); lis.forEach(function (li) { li.classList.remove('broken'); });
        bc.classList.remove('rejected'); msg.textContent = 'Restored from the shared copy. Chain verified.'; btn.disabled = false; running = false;
      }, 4600);
    });
  }

  // IoT: live readings and an alert
  var iot = $('[data-fx="iot"]');
  if (iot) {
    var base = { r1: 3.9, r2: 24.1, r3: 22.6, r5: 19.8, r6: 18.4 }, cold = base.r1, tick = 0, timer;
    function upd() {
      tick++;
      Object.keys(base).forEach(function (k) {
        var el = $('#' + k + ' .v', iot); if (!el) return;
        var v = k === 'r1' ? cold : base[k] + (Math.random() - .5) * (k === 'r6' ? 1.2 : .4);
        el.textContent = v.toFixed(1) + (k === 'r6' ? ' kW' : ' °C');
      });
      $('#r4 .v', iot).textContent = tick % 9 < 2 ? 'Door open' : 'Door closed';
      $('#r4', iot).classList.toggle('busy', tick % 9 < 2);
      if (tick % 14 > 6 && tick % 14 < 11) { cold = Math.min(6.8, cold + .7); } else { cold = Math.max(3.9, cold - .9); }
      var hot = cold > 5.5; $('#r1', iot).classList.toggle('warn', hot); iot.classList.toggle('alerting', hot);
    }
    onView(iot, function () { upd(); if (!still) timer = setInterval(upd, 1000); });
  }

  // Cloud: unplug a server, traffic moves, uptime holds
  var cl = $('[data-fx="cl"]');
  if (cl) {
    var srv = $$('.fxcl__s', cl), msg2 = $('.fxcl__msg', cl), n = $('.fxcl__n', cl), users = 2418;
    srv.forEach(function (s) {
      s.addEventListener('click', function () {
        var down = $$('.fxcl__s.down', cl);
        if (s.classList.contains('down')) { s.classList.remove('down'); $('span', s).textContent = 'Running'; msg2.textContent = 'Back online. Load shared across all servers.'; return; }
        if (down.length >= srv.length - 1) { msg2.textContent = 'Keep one running: in real life we would have more in reserve.'; return; }
        s.classList.add('down'); $('span', s).textContent = 'Unplugged';
        srv.forEach(function (o) { if (!o.classList.contains('down')) { o.classList.add('busy'); setTimeout(function () { o.classList.remove('busy'); }, 1200); } });
        msg2.innerHTML = '<b>' + $('b', s).textContent + ' is down.</b> Traffic moved in under a second. Nobody noticed.';
      });
    });
    if (!still) setInterval(function () { users += Math.round((Math.random() - .45) * 9); n.textContent = users.toLocaleString('en-US'); }, 1200);
  }

  // Security: attacks fly in and get blocked
  var se = $('[data-fx="se"]');
  if (se) {
    var arena = $('.fxse__arena', se), cnt = $('.fxse__n', se), lg = $('.fxse__log', se), b2 = $('button', se), blocked = 0;
    var kinds = ['Password guessing', 'Phishing link', 'SQL injection', 'Port scan', 'Prompt injection', 'Malware upload', 'Fake login page'];
    function shot(log) {
      var d = document.createElement('i'), a = Math.random() * Math.PI * 2;
      var R = arena.offsetWidth / 2; d.className = 'atk'; d.style.setProperty('--x', (Math.cos(a) * R).toFixed(1) + 'px'); d.style.setProperty('--y', (Math.sin(a) * R).toFixed(1) + 'px');
      arena.appendChild(d);
      setTimeout(function () { d.classList.add('hit'); blocked++; cnt.textContent = blocked.toLocaleString('en-US'); arena.classList.add('flash'); setTimeout(function () { arena.classList.remove('flash'); }, 150); }, 900);
      setTimeout(function () { d.remove(); }, 1400);
      if (log) { var li = document.createElement('li'); li.innerHTML = '<span>' + kinds[Math.floor(Math.random() * kinds.length)] + '</span><b>Blocked</b>'; lg.prepend(li); while (lg.children.length > 4) lg.lastChild.remove(); }
    }
    onView(se, function () { if (!still) setInterval(function () { shot(false); }, 1300); });
    b2.addEventListener('click', function () { b2.disabled = true; for (var i = 0; i < 12; i++) setTimeout(function () { shot(true); }, i * 160); setTimeout(function () { b2.disabled = false; }, 2600); });
  }
})();
