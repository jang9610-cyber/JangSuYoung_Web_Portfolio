(function () {
  'use strict';

  // 1. 마우스 트래킹 스포트라이트 연출
  var spotlight = document.getElementById('spotlight');
  document.addEventListener('mousemove', function (e) {
    if (spotlight) {
      spotlight.style.setProperty('--x', e.clientX + 'px');
      spotlight.style.setProperty('--y', e.clientY + 'px');
    }
  });

  // 2. 프로젝트 카드 3D 입체 기울기(Tilt) 및 마우스 반사광 연출
  var cards = document.querySelectorAll('.project-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      
      // 중심점 기준 위치 계산
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      
      // 기울기 강도 조절 (최대 6도)
      var rotateX = ((centerY - y) / centerY) * 6;
      var rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
      
      // 카드 표면 마우스 반사광 그라데이션
      card.style.backgroundImage = 'radial-gradient(circle 300px at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.06), transparent 80%), var(--bg-card)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.backgroundImage = 'var(--bg-card)';
    });
  });

  // 3. 스크롤 Reveal 애니메이션
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // CSS에 셋업할 스크롤 감지 클래스 바인딩
  var reveals = document.querySelectorAll('.reveal');
  reveals.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

  // 스크롤 감지 클래스가 활성화되었을 때의 스타일 룰 주입
  var style = document.createElement('style');
  style.innerHTML = '.reveal.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

})();
