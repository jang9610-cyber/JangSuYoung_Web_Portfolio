/* ======================================================
   Dark Dock Portfolio — Flashlight Edition
   Flashlight cursor + scroll reveal + tabs
   ====================================================== */
(function () {
  'use strict';

  var flashlight = document.getElementById('flashlight');
  var cursorDot = document.getElementById('cursor-dot');
  var progressBar = document.getElementById('pb');
  var progressValue = document.getElementById('pv');
  var progressAnimated = false;

  /* ── Flashlight + Cursor Follow ── */
  document.addEventListener('mousemove', function (e) {
    if (flashlight) {
      flashlight.style.left = e.clientX + 'px';
      flashlight.style.top = e.clientY + 'px';
    }
    if (cursorDot) {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    }
  });

  /* Hide flashlight when mouse leaves */
  document.addEventListener('mouseleave', function () {
    if (flashlight) flashlight.style.opacity = '0';
    if (cursorDot) cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    if (flashlight) flashlight.style.opacity = '1';
    if (cursorDot) cursorDot.style.opacity = '1';
  });

  /* ── Scroll Reveal ── */
  var reveals = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        /* Progress bar trigger */
        if (!progressAnimated && entry.target.contains(progressBar)) {
          progressAnimated = true;
          animateProgress();
        }
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(function (el) { observer.observe(el); });

  /* ── Progress Animation ── */
  function animateProgress() {
    if (!progressBar || !progressValue) return;
    var current = 0;
    var timer = setInterval(function () {
      current += 2;
      if (current > 100) { current = 100; clearInterval(timer); }
      progressBar.style.width = current + '%';
      progressValue.textContent = current + '%';
    }, 25);
  }

  /* ── Tab Switching ── */
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = btn.getAttribute('data-tab');
      var section = btn.closest('.section') || btn.closest('.reveal') || document.body;

      /* Deactivate siblings */
      btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      /* Show panel */
      section.querySelectorAll('.tab-panel').forEach(function (p) {
        p.classList.remove('active');
      });
      var target = section.querySelector('#' + tabId);
      if (target) target.classList.add('active');
    });
  });

  /* ── Smooth scroll for nav links ── */
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var id = a.getAttribute('href');
      var el = document.querySelector(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Click animation for cursor ── */
  document.addEventListener('mousedown', function () {
    if (cursorDot) cursorDot.style.transform = 'translate(-50%,-50%) scale(0.6)';
  });
  document.addEventListener('mouseup', function () {
    if (cursorDot) cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  /* ── Hover state: enlarge cursor on interactive elements ── */
  document.querySelectorAll('a, button, .tab-btn, .ov-card, .ui-item').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (cursorDot) {
        cursorDot.style.width = '16px';
        cursorDot.style.height = '16px';
        cursorDot.style.background = 'var(--accent)';
      }
    });
    el.addEventListener('mouseleave', function () {
      if (cursorDot) {
        cursorDot.style.width = '8px';
        cursorDot.style.height = '8px';
        cursorDot.style.background = 'var(--amber)';
      }
    });
  });

})();
