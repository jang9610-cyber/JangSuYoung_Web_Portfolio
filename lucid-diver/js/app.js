(function () {
  'use strict';

  document.documentElement.classList.add('has-reveal');

  var manifest = window.LUCID_DIVER_MANIFEST;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildMemoryNavigation() {
    var nav = document.getElementById('memory-navigation');
    if (!nav || !manifest) return;

    var fragment = document.createDocumentFragment();
    manifest.fragments.forEach(function (item) {
      var link = document.createElement('a');
      link.href = item.selector;
      link.dataset.navId = item.id;
      link.innerHTML = '<span>' + item.short + '</span><strong>' + item.label + '</strong>';
      fragment.appendChild(link);
    });
    nav.appendChild(fragment);
  }

  function setReadingProgress() {
    var progress = document.getElementById('reading-progress');
    if (!progress) return;

    var root = document.documentElement;
    var total = root.scrollHeight - window.innerHeight;
    var ratio = total > 0 ? Math.min(window.scrollY / total, 1) : 0;
    progress.style.height = (ratio * 100) + '%';
  }

  function observeSections() {
    if (!manifest || !('IntersectionObserver' in window)) return;

    var links = Array.prototype.slice.call(document.querySelectorAll('[data-nav-id]'));
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.dataset.fragmentId;
        links.forEach(function (link) {
          link.classList.toggle('is-active', link.dataset.navId === id);
        });
      });
    }, {
      rootMargin: '-28% 0px -58% 0px',
      threshold: 0
    });

    manifest.fragments.forEach(function (item) {
      var section = document.querySelector(item.selector);
      if (section) observer.observe(section);
    });
  }

  function setupSessionViewer() {
    if (!manifest) return;

    var tabs = Array.prototype.slice.call(document.querySelectorAll('.session-tab'));
    var image = document.getElementById('session-image');
    var imageButton = image ? image.closest('[data-lightbox-image]') : null;
    var step = document.getElementById('session-step');
    var title = document.getElementById('session-title');
    var description = document.getElementById('session-description');

    function showSession(index) {
      var session = manifest.sessions[index];
      if (!session || !image) return;

      tabs.forEach(function (tab, tabIndex) {
        var active = tabIndex === index;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      image.classList.add('is-changing');
      window.setTimeout(function () {
        image.src = session.image;
        image.alt = session.alt;
        if (imageButton) {
          imageButton.dataset.lightboxImage = session.image;
          imageButton.setAttribute('aria-label', session.alt + ' 크게 보기');
        }
        step.textContent = session.step;
        title.textContent = session.title;
        description.textContent = session.description;
        image.classList.remove('is-changing');
      }, prefersReducedMotion ? 0 : 140);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        showSession(Number(tab.dataset.sessionIndex));
      });
    });
  }

  function setupScopeFilters() {
    var filters = Array.prototype.slice.call(document.querySelectorAll('.scope-filter'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.scope-card'));
    if (!filters.length || !cards.length) return;

    filters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        var target = filter.dataset.scopeFilter;
        filters.forEach(function (item) {
          item.classList.toggle('is-active', item === filter);
        });
        cards.forEach(function (card) {
          var visible = target === 'all' || card.dataset.scope === target;
          card.hidden = !visible;
        });
      });
    });
  }

  function setupLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lightboxImage = lightbox.querySelector('img');
    var closeButton = lightbox.querySelector('.lightbox-close');
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox-image]'));
    var lastTrigger = null;

    function openLightbox(trigger) {
      var source = trigger.dataset.lightboxImage;
      var sourceImage = trigger.querySelector('img');
      if (!source) return;

      lastTrigger = trigger;
      lightboxImage.src = source;
      lightboxImage.alt = sourceImage ? sourceImage.alt : '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      closeButton.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      lightboxImage.src = '';
      if (lastTrigger) lastTrigger.focus();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openLightbox(trigger);
      });
    });
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  function setupBackToTop() {
    var button = document.getElementById('back-to-top');
    if (!button) return;

    function update() {
      button.classList.toggle('is-visible', window.scrollY > window.innerHeight);
    }
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function setupReveal() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('.memory-section'));
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach(function (section) { section.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function setupHeaderState() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
      setReadingProgress();
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', setReadingProgress);
    update();
  }

  buildMemoryNavigation();
  observeSections();
  setupSessionViewer();
  setupScopeFilters();
  setupLightbox();
  setupBackToTop();
  setupReveal();
  setupHeaderState();
})();
