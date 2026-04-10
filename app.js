/* ═══════════════════════════════════════════════════
   DIANA NAILS STUDIO — Shared JavaScript
   diananails.ro
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── LOADER ──────────────────────────────────────── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 1600);
  });

  /* ── CURSOR ──────────────────────────────────────── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
    (function animRing() {
      rx += (mx - rx) * .12;
      ry += (my - ry) * .12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a, button, .service-card, .blog-card, .test-card, .why-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ── NAVBAR SCROLL ───────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const pbar   = document.getElementById('progress-bar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
      if (pbar) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        pbar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── SCROLL REVEAL ───────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

  /* ── STAT COUNTER ────────────────────────────────── */
  function countUp(el, target, duration) {
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        countUp(e.target, parseInt(e.target.dataset.target), 1800);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter, .counter-big').forEach(el => cntObs.observe(el));

  /* ── TESTIMONIALS CAROUSEL ───────────────────────── */
  const track = document.getElementById('testTrack');
  const dots  = document.querySelectorAll('.test-dot');
  if (track) {
    const cards = track.querySelectorAll('.test-card');
    let cur = 0;
    const vis = () => (window.innerWidth > 900 ? 2 : 1);
    const go  = (i) => {
      const w = cards[0] ? cards[0].offsetWidth + 32 : 0;
      cur = Math.max(0, Math.min(i, cards.length - vis()));
      track.style.transform = `translateX(-${cur * w}px)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === cur));
    };
    document.getElementById('prevBtn')?.addEventListener('click', () => go(cur - 1));
    document.getElementById('nextBtn')?.addEventListener('click', () => go(cur + 1));
    dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.i)));
    setInterval(() => go(cur >= cards.length - vis() ? 0 : cur + 1), 5500);
  }

  /* ── SERVICES TABS ───────────────────────────────── */
  document.querySelectorAll('.services-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.services-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (!panel) return;
      panel.classList.add('active');
      panel.querySelectorAll('.service-card').forEach((c, i) => {
        c.style.opacity = '0'; c.style.transform = 'translateY(16px)';
        setTimeout(() => {
          c.style.transition = 'opacity .45s ease, transform .45s ease';
          c.style.opacity = '1'; c.style.transform = 'translateY(0)';
        }, i * 70);
      });
    });
  });

  /* ── MAGNETIC BUTTONS ────────────────────────────── */
  document.querySelectorAll('.btn-primary, .btn-gold, .btn-outline, .nav-cta, .form-submit').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px, ${y}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── SMOOTH SCROLL ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── FORM SUBMIT FEEDBACK ────────────────────────── */
  document.querySelector('.booking-form form, form.contact-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('.form-submit span');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = 'Cerere trimisă ✓';
    btn.closest('button').style.background = '#2d6a4f';
    setTimeout(() => { btn.textContent = orig; btn.closest('button').style.background = ''; }, 3500);
  });

  /* ── GALLERY LIGHTBOX (simple) ───────────────────── */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.gallery-overlay-text')?.textContent || '';
      // placeholder: could open a real lightbox here
    });
  });

  /* ── ACTIVE NAV LINK ─────────────────────────────── */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === path);
  });

})();
