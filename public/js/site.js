/* Sitau5D — menu, inlaadanimatie en parallax.
   Overgenomen uit de DCLogic-component van het ontwerp (ontwerp/desktop.dc.html),
   herschreven als los vanilla-JS zonder re-renders: transforms gaan direct naar de DOM. */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smalMq = window.matchMedia ? window.matchMedia('(max-width: 760px)') : { matches: false };
  var smal = function () { return smalMq.matches; };

  /* ---------- Mobiel menu ---------- */
  var knop = document.querySelector('.nav__knop');
  var menu = document.getElementById('menu');
  if (knop && menu) {
    var label = knop.querySelector('.nav__knop-label');
    var icoonOpen = knop.querySelector('.nav__icoon-open');
    var icoonDicht = knop.querySelector('.nav__icoon-dicht');
    var isOpen = false;
    var zet = function (open) {
      isOpen = open;
      menu.classList.toggle('open', open);
      knop.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (label) label.textContent = open ? 'Sluiten' : 'Menu';
      // SVG-elementen kennen geen .hidden-property: het attribuut zelf zetten
      if (icoonOpen) icoonOpen.toggleAttribute('hidden', open);
      if (icoonDicht) icoonDicht.toggleAttribute('hidden', !open);
    };
    knop.addEventListener('click', function () { zet(!isOpen); });
    // Klik op een link: menu direct (zonder animatie) dicht, zodat het scrolldoel niet verschuift
    menu.addEventListener('click', function (e) {
      if (!isOpen || !e.target.closest('a')) return;
      menu.classList.add('direct');
      zet(false);
      void menu.offsetHeight;
      requestAnimationFrame(function () { menu.classList.remove('direct'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { zet(false); knop.focus(); }
    });
    var opBreedte = function () { if (!smal() && isOpen) zet(false); };
    if (smalMq.addEventListener) smalMq.addEventListener('change', opBreedte);
  }

  if (reduce) return; // geen reveal, geen parallax (CSS toont de rustpositie)

  /* ---------- Inlaadanimatie ---------- */
  // Blokken in elke sectie behalve de hero faden + schuiven omhoog zodra ze in beeld komen.
  if ('IntersectionObserver' in window) {
    var picks = [];
    var secties = document.querySelectorAll('main section:not(#top)');
    Array.prototype.forEach.call(secties, function (sec) {
      var wraps = sec.querySelectorAll(':scope > div:not(.laag):not(.korrel):not(.abs), :scope > div:not(.laag):not(.korrel):not(.abs) > div:not(.laag)');
      Array.prototype.forEach.call(wraps, function (wrap) {
        Array.prototype.forEach.call(wrap.children, function (el, i) {
          if (el.hasAttribute('data-t') || el.getAttribute('aria-hidden') === 'true') return;
          var pos = getComputedStyle(el).position;
          if (pos === 'absolute' || pos === 'fixed') return;
          el.style.setProperty('--rv-d', (Math.min(i, 5) * 0.08).toFixed(2) + 's');
          picks.push(el);
        });
      });
    });
    // Rijen van een tabel of lijst één voor één
    Array.prototype.forEach.call(document.querySelectorAll('[data-rv-group]'), function (g) {
      Array.prototype.forEach.call(g.children, function (el, i) {
        el.style.setProperty('--rv-d', (Math.min(i, 6) * 0.07).toFixed(2) + 's');
        picks.push(el);
      });
    });
    // Alleen de binnenste blokken, zodat niets dubbel animeert
    var final = picks.filter(function (el) {
      return !picks.some(function (o) { return o !== el && el.contains(o); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.setAttribute('data-rv', 'in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    final.forEach(function (el) { el.setAttribute('data-rv', ''); io.observe(el); });
  }

  /* ---------- Parallax ---------- */
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-t]'));
  if (!nodes.length) return;

  var RUST = 0.12; // rustpositie van de collage in #over
  var ids = ['statement', 'diensten', 'werkwijze', 'over', 'citaat', 'contact'];
  var els = {};
  ids.forEach(function (id) { els[id] = document.getElementById(id); });
  var collage = document.getElementById('collage');

  var clamp01 = function (x) { return Math.max(0, Math.min(1, x)); };
  var ease = function (t) { t = clamp01(t); return t * t * (3 - 2 * t); };
  var T = function (x, y, r) {
    return 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px)' + (r ? ' rotate(' + r.toFixed(2) + 'deg)' : '');
  };

  // 0 = sectie komt onder in beeld, 1 = sectie verlaat de bovenkant
  var prog = function (id, vh) {
    var el = els[id];
    if (!el) return 0.5;
    var r = el.getBoundingClientRect();
    return clamp01((vh - r.top) / (vh + r.height));
  };

  var calc = function (st, isSmal) {
    var q = RUST + (1 - RUST) * st.hp;
    var lid = ease(q / 0.65);             // deksel opent eerst
    var up = ease((q - 0.25) / 0.7);      // daarna klimt mini-Michel omhoog
    var w = (st.wp - 0.5) * 2 * (isSmal ? 0.35 : 1);
    var c = (st.cp - 0.5) * 2;
    var g0 = st.gp * (isSmal ? 0.5 : 1);
    var sp = (st.sp - 0.5) * 2, dp = (st.dp - 0.5) * 2, kp = (st.kp - 0.5) * 2;
    return {
      g: {
        zon: T(0, g0 * -90), ring: T(g0 * -30, g0 * 70), half: T(g0 * 50, 0), blok: T(g0 * -40, 0),
        punten: T(0, g0 * -40), michel: T(0, g0 * 30), lijn: 'rotate(' + (28 + g0 * 5).toFixed(2) + 'deg)',
        vk: T(g0 * 20, g0 * -50), ster1: T(0, g0 * -140, g0 * 90), ster2: T(0, g0 * -70, g0 * -60)
      },
      v: {
        st: T(0, sp * 60), st2: T(sp * -30, sp * -40),
        di: T(0, dp * -70), di2: T(0, dp * 50), di3: T(dp * 14, dp * 36),
        co: T(0, kp * -60), co2: T(0, kp * -90, kp * 120)
      },
      h: {
        ruit: 'translateY(' + (q * 4).toFixed(2) + '%)',
        blok: 'translateY(' + (q * -3).toFixed(2) + '%)',
        mini: 'translateY(' + (-(up * 42)).toFixed(2) + '%)',
        deksel: 'translate(' + (-lid * 1.5).toFixed(2) + '%, ' + (-lid * 4).toFixed(2) + '%) rotate(' + (-lid * 42).toFixed(2) + 'deg)',
        gatT: 'rotate(3deg) scale(' + (0.6 + 0.4 * lid).toFixed(3) + ')',
        berg: 'translateY(' + ((1 - q) * 22).toFixed(2) + '%)'
      },
      w: {
        // Op mobiel bewegen de werkwijze-foto's niet
        a: isSmal ? 'none' : 'translateY(' + (w * -60).toFixed(1) + 'px)',
        b: isSmal ? 'none' : 'translateY(' + (w * 90).toFixed(1) + 'px)',
        c: isSmal ? 'none' : 'translateY(' + (w * -130).toFixed(1) + 'px)',
        zon: T(0, w * 90),
        lijn: 'translateY(' + (w * -110).toFixed(1) + 'px) rotate(' + (-14 + w * 6).toFixed(2) + 'deg)',
        ster: T(0, w * -120, w * 180)
      },
      c: { papier: 'translateY(' + (c * -50).toFixed(1) + 'px) rotate(' + (-1.5 + c).toFixed(2) + 'deg)' }
    };
  };

  var parsed = nodes.map(function (el) {
    var p = el.getAttribute('data-t').split('.');
    return { el: el, a: p[0], b: p[1], last: '' };
  });

  var raf = 0;
  var tick = function () {
    raf = 0;
    var vh = window.innerHeight || 800;
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    var hp = 0;
    if (collage) {
      // De collage opent zodra het hoofd op 75 % van de schermhoogte staat, klaar na een half scherm extra
      var r = collage.getBoundingClientRect();
      var head0 = r.top + y + r.height * 0.28;
      var start = Math.max(0, head0 - vh * 0.75);
      hp = clamp01((y - start) / (Math.max(vh, 500) * 0.5));
    }
    var v = calc({
      hp: hp, gp: clamp01(y / vh),
      wp: prog('werkwijze', vh), cp: prog('citaat', vh),
      sp: prog('statement', vh), dp: prog('diensten', vh), kp: prog('contact', vh)
    }, smal());
    for (var i = 0; i < parsed.length; i++) {
      var n = parsed[i];
      var t = v[n.a] && v[n.a][n.b];
      if (t && t !== n.last) { n.el.style.transform = t; n.last = t; }
    }
  };
  var plan = function () { if (!raf) raf = requestAnimationFrame(tick); };

  window.addEventListener('scroll', plan, { passive: true });
  window.addEventListener('resize', plan, { passive: true });
  tick();
})();
