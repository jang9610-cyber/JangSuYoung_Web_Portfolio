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

  function setupDocumentViewer() {
    var modal = document.getElementById('ssot-document-modal');
    var frame = document.getElementById('ssot-document-frame');
    if (!modal || !frame) return;

    var viewerBase = new URL(
      '../기존_깃허브_프로젝트_문서/Document_LucidDiver/web/Notion_embed/index.html',
      window.location.href
    ).href;
    var openButtons = Array.prototype.slice.call(document.querySelectorAll('[data-doc-viewer-open]'));
    var tabs = Array.prototype.slice.call(modal.querySelectorAll('.document-tab'));
    var closeButton = modal.querySelector('.document-modal-close');
    var externalLink = document.getElementById('document-external-link');
    var frameShell = modal.querySelector('.document-frame-shell');
    var lastTrigger = null;
    var currentPath = '';

    function viewerUrl(path) {
      return viewerBase + '#path=' + encodeURIComponent(path);
    }

    function selectDocument(path) {
      if (!path) return;

      currentPath = path;
      tabs.forEach(function (tab) {
        var active = tab.dataset.docPath === path;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      if (externalLink) externalLink.href = viewerUrl(path);
      frameShell.classList.remove('is-loaded');
      frame.src = viewerUrl(path);
    }

    function openDocumentViewer(trigger) {
      var path = trigger.dataset.docPath || (tabs[0] && tabs[0].dataset.docPath);
      lastTrigger = trigger;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      selectDocument(path);
      closeButton.focus();
    }

    function closeDocumentViewer() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus();
    }

    openButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        openDocumentViewer(button);
      });
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        if (tab.dataset.docPath !== currentPath) selectDocument(tab.dataset.docPath);
      });
    });

    frame.addEventListener('load', function () {
      frameShell.classList.add('is-loaded');
    });
    closeButton.addEventListener('click', closeDocumentViewer);
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeDocumentViewer();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeDocumentViewer();
      }
    });
  }

  function setupGameplayVideoModal() {
    var modal = document.getElementById('gameplay-video-modal');
    var frame = document.getElementById('gameplay-modal-frame');
    if (!modal || !frame) return;

    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-gameplay-modal-open]'));
    var closeButton = modal.querySelector('.video-modal-close');
    var videoUrl = 'https://www.youtube-nocookie.com/embed/H5T2-JR77X0?rel=0&playsinline=1&autoplay=1';
    var lastTrigger = null;

    function openVideoModal(trigger) {
      lastTrigger = trigger;
      frame.src = videoUrl;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      closeButton.focus();
    }

    function closeVideoModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      frame.src = '';
      if (lastTrigger) lastTrigger.focus();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openVideoModal(trigger);
      });
    });
    closeButton.addEventListener('click', closeVideoModal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeVideoModal();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeVideoModal();
      }
    });
  }

  function setupVisualAssetModal() {
    var modal = document.getElementById('visual-asset-modal');
    if (!modal) return;

    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-asset-modal-open]'));
    var closeButton = modal.querySelector('.asset-modal-close');
    var lastTrigger = null;

    function openAssetModal(trigger) {
      lastTrigger = trigger;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      closeButton.focus();
    }

    function closeAssetModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus();
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openAssetModal(trigger);
      });
    });
    closeButton.addEventListener('click', closeAssetModal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeAssetModal();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeAssetModal();
      }
    });
  }

  function setupShatterExperiment() {
    var button = document.getElementById('shatter-test');
    var stage = document.getElementById('shatter-stage');
    var board = document.querySelector('.memory-glass');
    if (!button || !stage || !board) return;

    var buttonEyebrow = button.querySelector('span');
    var buttonLabel = button.querySelector('strong');
    var focusControls = document.getElementById('shard-focus-controls');
    var focusExit = document.getElementById('shard-focus-exit');
    var shards = Array.prototype.slice.call(stage.querySelectorAll('.glass-shard')).sort(function (a, b) {
      return Number(a.dataset.shard) - Number(b.dataset.shard);
    });
    if (focusControls) {
      shards.forEach(function (shard) {
        stage.insertBefore(shard, focusControls);
      });
    }
    var isShattered = false;
    var isAnimating = false;
    var activeShard = null;
    var crackTimer = 0;
    var splitTimer = 0;
    var cleanupTimer = 0;
    var fadeTimer = 0;
    var buttonLabelTimer = 0;
    var buttonMotionTimer = 0;
    var introShatterTimer = 0;
    var introRevealTimer = 0;
    var geometryFrame = 0;
    var shatterGeometry = null;

    function syncShatterGeometry() {
      var rect = board.getBoundingClientRect();
      var gutter = window.innerWidth < 640 ? 8 : 14;
      var left = Math.max(gutter, rect.left);
      var right = Math.min(window.innerWidth - gutter, rect.right);
      var top = Math.max(gutter, rect.top);
      var bottom = Math.min(window.innerHeight - gutter, rect.bottom);

      if (right - left < 240) {
        left = gutter;
        right = window.innerWidth - gutter;
      }
      if (bottom - top < 240) {
        top = gutter;
        bottom = window.innerHeight - gutter;
      }

      shatterGeometry = {
        left: left,
        top: top,
        width: right - left,
        height: bottom - top
      };

      stage.style.setProperty('--shatter-left', shatterGeometry.left + 'px');
      stage.style.setProperty('--shatter-top', shatterGeometry.top + 'px');
      stage.style.setProperty('--shatter-width', shatterGeometry.width + 'px');
      stage.style.setProperty('--shatter-height', shatterGeometry.height + 'px');
      stage.style.setProperty('--shatter-center-x', ((left + right) / 2) + 'px');
      stage.style.setProperty('--shatter-center-y', ((top + bottom) / 2) + 'px');
      centerFocusedShard();
    }

    function queueGeometrySync() {
      if (geometryFrame) return;
      geometryFrame = window.requestAnimationFrame(function () {
        geometryFrame = 0;
        syncShatterGeometry();
      });
    }

    function setButtonState(active) {
      window.clearTimeout(buttonLabelTimer);
      window.clearTimeout(buttonMotionTimer);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
      button.disabled = false;
      button.classList.remove('is-returning', 'is-label-changing');
      button.classList.toggle('is-merge-ready', active);
      buttonEyebrow.textContent = active ? 'MEMORY RECONSTRUCTION' : 'MEMORY CONTROL';
      buttonLabel.textContent = active ? '기억을 합친다.' : '기억을 분리한다.';
    }

    function beginButtonRestoreTransition() {
      window.clearTimeout(buttonLabelTimer);
      window.clearTimeout(buttonMotionTimer);
      button.setAttribute('aria-pressed', 'false');
      button.disabled = true;
      button.classList.remove('is-merge-ready');
      button.classList.add('is-returning', 'is-label-changing');

      buttonLabelTimer = window.setTimeout(function () {
        buttonEyebrow.textContent = 'MEMORY CONTROL';
        buttonLabel.textContent = '기억을 분리한다.';
      }, 180);

      buttonMotionTimer = window.setTimeout(function () {
        button.classList.remove('is-label-changing');
      }, 440);
    }

    function setShardsInteractive(active) {
      stage.classList.toggle('is-interactive', active);
      stage.setAttribute('aria-hidden', active ? 'false' : 'true');
      shards.forEach(function (shard) {
        shard.tabIndex = active ? 0 : -1;
      });
    }

    function setFocusControls(active) {
      if (focusControls) {
        focusControls.setAttribute('aria-hidden', active ? 'false' : 'true');
      }
      if (focusExit) {
        focusExit.tabIndex = active ? 0 : -1;
      }
    }

    function resetShardTilt() {
      if (!activeShard) return;
      activeShard.style.setProperty('--tilt-x', '0deg');
      activeShard.style.setProperty('--tilt-y', '0deg');
      if (activeShard.classList.contains('has-comparison')) {
        activeShard.style.setProperty('--comparison-progress', '0.5');
      }
    }

    function setShardMediaPlayback(shard, shouldPlay) {
      var videos = Array.prototype.slice.call(shard.querySelectorAll('[data-shard-video]'));
      videos.forEach(function (video) {
        if (!shouldPlay) {
          video.pause();
          return;
        }

        var source = video.querySelector('source[data-src]');
        if (source && !source.src) {
          source.src = source.dataset.src;
          video.load();
        }

        var playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
          playAttempt.catch(function () {});
        }
      });
    }

    function centerFocusedShard() {
      if (!activeShard || !shatterGeometry) return;
      var horizontalInset = window.innerWidth < 640
        ? 10
        : Math.max(28, Math.min(72, window.innerWidth * 0.035));
      var verticalInset = window.innerHeight < 640
        ? 10
        : Math.max(26, Math.min(64, window.innerHeight * 0.055));
      var focusWidth = Math.max(280, window.innerWidth - horizontalInset * 2);
      var focusHeight = Math.max(280, window.innerHeight - verticalInset * 2);
      var focusLeft = (window.innerWidth - focusWidth) * 0.5;
      var focusTop = (window.innerHeight - focusHeight) * 0.5;

      activeShard.style.setProperty('--focus-scale', '1');
      activeShard.style.setProperty('--focus-left', focusLeft.toFixed(2) + 'px');
      activeShard.style.setProperty('--focus-top', focusTop.toFixed(2) + 'px');
      activeShard.style.setProperty('--focus-width', focusWidth.toFixed(2) + 'px');
      activeShard.style.setProperty('--focus-height', focusHeight.toFixed(2) + 'px');
    }

    function clearShardFocus(shouldReturnFocus) {
      if (!activeShard) return;
      var previousShard = activeShard;
      previousShard.classList.remove('is-focused');
      previousShard.setAttribute('aria-pressed', 'false');
      setShardMediaPlayback(previousShard, false);
      resetShardTilt();
      activeShard = null;
      stage.classList.remove('has-focused-shard');
      setFocusControls(false);
      if (shouldReturnFocus) {
        previousShard.focus({ preventScroll: true });
      } else {
        previousShard.blur();
      }
    }

    function focusShard(shard) {
      if (!isShattered || isAnimating) return;
      if (activeShard && activeShard !== shard) return;

      activeShard = shard;
      activeShard.style.setProperty('--tilt-x', '0deg');
      activeShard.style.setProperty('--tilt-y', '0deg');
      if (activeShard.classList.contains('has-comparison')) {
        activeShard.style.setProperty('--comparison-progress', '0.5');
      }
      centerFocusedShard();
      activeShard.classList.add('is-focused');
      activeShard.setAttribute('aria-pressed', 'true');
      stage.classList.add('has-focused-shard');
      setFocusControls(true);
      setShardMediaPlayback(activeShard, true);
      activeShard.focus({ preventScroll: true });
    }

    function updateShardTilt(event) {
      if (!activeShard || prefersReducedMotion || event.pointerType === 'touch') return;
      var centerX = window.innerWidth * 0.5;
      var centerY = window.innerHeight * 0.5;
      var horizontal = (event.clientX - centerX) / Math.max(centerX, 1);
      var vertical = (event.clientY - centerY) / Math.max(centerY, 1);
      var tiltX = Math.max(-1, Math.min(1, vertical)) * -2.4;
      var tiltY = Math.max(-1, Math.min(1, horizontal)) * 2.8;

      activeShard.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
      activeShard.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
      if (activeShard.classList.contains('has-comparison')) {
        var comparisonProgress = Math.max(0, Math.min(1, (horizontal + 0.65) / 1.3));
        activeShard.style.setProperty('--comparison-progress', comparisonProgress.toFixed(3));
      }
    }

    function shatter() {
      if (isAnimating || isShattered) return;
      isAnimating = true;
      window.clearTimeout(crackTimer);
      window.clearTimeout(splitTimer);
      window.clearTimeout(cleanupTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(buttonLabelTimer);
      window.clearTimeout(buttonMotionTimer);
      button.disabled = true;
      button.classList.remove('is-merge-ready', 'is-returning', 'is-label-changing');
      syncShatterGeometry();

      stage.classList.remove('is-active', 'is-shattered', 'is-cracking', 'is-restoring');
      board.classList.remove('is-pre-shaking');

      window.requestAnimationFrame(function () {
        board.classList.add('is-pre-shaking');
        crackTimer = window.setTimeout(function () {
          board.classList.remove('is-pre-shaking');
          stage.classList.add('is-active', 'is-cracking');

          splitTimer = window.setTimeout(function () {
            document.body.classList.add('shatter-active');
            stage.classList.add('is-shattered');
            setShardsInteractive(true);
            isShattered = true;
            isAnimating = false;
            setButtonState(true);
          }, 120);

          cleanupTimer = window.setTimeout(function () {
            stage.classList.remove('is-cracking');
          }, 720);
        }, 260);
      });
    }

    function restore() {
      if (isAnimating || !isShattered) return;
      isAnimating = true;
      window.clearTimeout(crackTimer);
      window.clearTimeout(splitTimer);
      window.clearTimeout(cleanupTimer);
      window.clearTimeout(fadeTimer);

      beginButtonRestoreTransition();
      clearShardFocus(false);
      setShardsInteractive(false);
      board.classList.remove('is-pre-shaking');
      stage.classList.remove('is-cracking');
      stage.classList.add('is-restoring');

      window.requestAnimationFrame(function () {
        stage.classList.remove('is-shattered');

        cleanupTimer = window.setTimeout(function () {
          stage.classList.remove('is-active');
          document.body.classList.remove('shatter-active');

          fadeTimer = window.setTimeout(function () {
            stage.classList.remove('is-restoring');
            isShattered = false;
            isAnimating = false;
            setButtonState(false);
          }, 800);
        }, 680);
      });
    }

    button.addEventListener('click', function () {
      window.clearTimeout(introShatterTimer);
      window.clearTimeout(introRevealTimer);
      if (isShattered) restore();
      else shatter();
    });
    if (focusExit) {
      focusExit.addEventListener('click', function (event) {
        event.stopPropagation();
        if (activeShard) clearShardFocus(false);
      });
    }
    shards.forEach(function (shard) {
      shard.addEventListener('click', function (event) {
        event.stopPropagation();
        if (activeShard && activeShard !== shard) {
          clearShardFocus(false);
          return;
        }
        focusShard(shard);
      });
    });
    stage.addEventListener('click', function (event) {
      if (event.target === stage && activeShard) {
        clearShardFocus(false);
      }
    });
    stage.addEventListener('pointermove', updateShardTilt);
    stage.addEventListener('pointerleave', resetShardTilt);
    window.addEventListener('resize', queueGeometrySync);
    window.addEventListener('scroll', queueGeometrySync, { passive: true });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !isShattered) return;
      if (activeShard) {
        clearShardFocus(true);
      } else {
        restore();
      }
    });
    setShardsInteractive(false);
    setFocusControls(false);
    setButtonState(false);
    button.disabled = true;
    syncShatterGeometry();

    function beginIntroSequence() {
      window.requestAnimationFrame(function () {
        board.classList.add('is-intro-revealing');

        introRevealTimer = window.setTimeout(function () {
          board.classList.remove('is-intro-pending', 'is-intro-revealing');

          introShatterTimer = window.setTimeout(function () {
            if (isShattered || isAnimating) return;
            shatter();
          }, prefersReducedMotion ? 120 : 520);
        }, prefersReducedMotion ? 40 : 1600);
      });
    }

    if (document.readyState === 'complete') {
      window.setTimeout(beginIntroSequence, 80);
    } else {
      window.addEventListener('load', beginIntroSequence, { once: true });
    }
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
  setupLightbox();
  setupDocumentViewer();
  setupGameplayVideoModal();
  setupVisualAssetModal();
  setupShatterExperiment();
  setupBackToTop();
  setupReveal();
  setupHeaderState();
})();
