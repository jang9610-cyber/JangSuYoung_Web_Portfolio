(function () {
  'use strict';

  /*
   * 이 manifest는 현재의 통합 페이지를 추후 유리 파편 인터랙션으로
   * 분리할 때 사용하는 단일 탐색 기준이다.
   * selector가 가리키는 섹션의 본문은 통합본과 파편 모드가 공유한다.
   */
  window.LUCID_DIVER_MANIFEST = {
    version: '0.1.0',
    mode: 'combined-memory',
    restored: true,
    fragments: [
      { id: 'brief', label: '프로젝트 요약', short: '00', selector: '#brief' },
      { id: 'challenge', label: '장르 문제', short: '01', selector: '#challenge' },
      { id: 'loops', label: '이중 보상 루프', short: '02', selector: '#loops' },
      { id: 'scope', label: 'P0 결정', short: '03', selector: '#scope' },
      { id: 'playable', label: '플레이 흐름', short: '04', selector: '#playable' },
      { id: 'ownership', label: '개인 기여', short: '05', selector: '#ownership' },
      { id: 'pipeline', label: '기획→런타임', short: '06', selector: '#pipeline' },
      { id: 'qa', label: '구현·QA', short: '07', selector: '#qa' },
      { id: 'team', label: '팀·증거', short: '08', selector: '#team' },
      { id: 'archive', label: '최종 자료', short: '09', selector: '#archive' }
    ],
    sessions: [
      {
        step: 'STEP 01 · SESSION ENTRY',
        title: '침몽도시 진입',
        description: '로비에서 출격 준비를 마친 뒤 세션으로 진입합니다. 장착 정보와 캐릭터 상태가 실제 플레이 흐름으로 연결됩니다.',
        image: './assets/images/session-01.png',
        alt: '침몽도시 세션 진입 화면'
      },
      {
        step: 'STEP 02 · LOOTING',
        title: '위험을 감수한 회수',
        description: '맵을 탐색하며 일반 회수품과 기억 파편을 획득합니다. 무엇을 가지고 살아 돌아갈지가 세션의 핵심 판단이 됩니다.',
        image: './assets/images/session-02.png',
        alt: '침몽도시에서 아이템을 획득하는 루팅 화면'
      },
      {
        step: 'STEP 03 · COMBAT',
        title: '꿈식자와의 전투',
        description: '조준·공격·회피와 자원 관리를 통해 탐색 경로를 확보합니다. 전투는 파밍과 탈출의 위험을 만드는 수단입니다.',
        image: './assets/images/session-03.png',
        alt: '침몽도시 꿈식자 에너미와 전투하는 화면'
      },
      {
        step: 'STEP 04 · EXTRACTION SUCCESS',
        title: '전화부스 탈출과 정산',
        description: '탈출 성공 시 회수품은 창고로, 기억 파편은 동조율과 심상 기록으로 환원됩니다. 두 보상 루프가 이 순간 갈라집니다.',
        image: './assets/images/session-04.png',
        alt: '전화부스 탈출 성공 이후 결과 정산 화면'
      },
      {
        step: 'STEP 05 · FORCED AWAKENING',
        title: '실패도 다음 관계의 맥락이 된다',
        description: '강제 각성 시 회수품을 잃는 손실을 유지하면서, 전용 대사와 기록의 맥락으로 실패 경험을 캐릭터 관계에 남깁니다.',
        image: './assets/images/session-05.png',
        alt: '탈출 실패와 강제 각성 결과 화면'
      }
    ]
  };
})();
