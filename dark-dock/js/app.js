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
      var id = a.getAttribute('href');
      if (id && id.startsWith('#')) {
        e.preventDefault();
        var el = document.querySelector(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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

  /* ── Markdown Previewer Logic ── */
  var mdContent = document.getElementById('md-content');
  var mdTitle = document.getElementById('md-title');
  var docTabButtons = document.querySelectorAll('.doc-tab-btn');

  function fetchMarkdown(filePath) {
    if (!mdContent) return;
    mdContent.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding: 40px 0;">문서를 불러오는 중...</p>';
    
    // 파일명만 추출하여 타이틀 변경
    var fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    if (mdTitle) mdTitle.textContent = fileName;

    fetch(filePath)
      .then(function (res) {
        if (!res.ok) throw new Error('파일을 불러올 수 없습니다.');
        return res.text();
      })
      .then(function (text) {
        // 마크다운 내 이미지 경로 최적화 (기획서 내부 상대 경로를 웹 에셋 경로로 보정)
        // ex: ../../assets/ 또는 docs_markdown/assets/ -> ./assets/
        var processedText = text.replace(/(\.\.\/)+assets\//g, './assets/');
        processedText = processedText.replace(/docs_markdown\/assets\//g, './assets/');
        
        // Marked.js 컴파일 실행
        if (window.marked) {
          mdContent.innerHTML = marked.parse(processedText);
        } else {
          mdContent.innerHTML = '<pre>' + processedText + '</pre>';
        }
      })
      .catch(function (err) {
        mdContent.innerHTML = '<p style="color:var(--accent); text-align:center; padding: 40px 0;">❌ ' + err.message + '</p>';
      });
  }

  // 첫 번째 문서 자동 로드
  if (docTabButtons.length > 0) {
    var firstDoc = docTabButtons[0].getAttribute('data-doc');
    fetchMarkdown(firstDoc);
  }

  // 문서 탭 버튼 클릭 이벤트
  docTabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filePath = btn.getAttribute('data-doc');
      
      // 형제 버튼 비활성화
      docTabButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      fetchMarkdown(filePath);
    });
  });

  /* ── Hover state: enlarge cursor on interactive elements ── */
  document.querySelectorAll('a, button, .tab-btn, .ov-card, .ui-item, .doc-tab-btn').forEach(function (el) {
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

