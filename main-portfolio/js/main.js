(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var spotlight = document.getElementById('spotlight');

  if (spotlight && finePointer && !reduceMotion) {
    document.addEventListener('pointermove', function (event) {
      spotlight.style.setProperty('--pointer-x', event.clientX + 'px');
      spotlight.style.setProperty('--pointer-y', event.clientY + 'px');
    }, { passive: true });
  }

  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (element) {
      element.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12
    });

    reveals.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  if (finePointer && !reduceMotion) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));

    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
        var normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
        var rotateX = normalizedY * -2.4;
        var rotateY = normalizedX * 2.8;

        card.style.transform =
          'perspective(1300px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' +
          rotateY.toFixed(2) + 'deg) translateY(-4px)';
      });

      card.addEventListener('pointerleave', function () {
        card.style.transform =
          'perspective(1300px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute('href'));
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function (link) {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, {
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }
})();
