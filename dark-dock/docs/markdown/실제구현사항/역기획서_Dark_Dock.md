# 🔍 역기획서 — Dark Dock (Project Two Slot)

> **실제 유니티 프로젝트 분석 및 기획 사양 비교 결과**
> 분석 대상: Unity 프로젝트 빌드 (2022.3.62f3)

---

## 📋 프로젝트 개요

| 항목 | 실제 구현 내용 |
| --- | --- |
| **엔진** | Unity 2022.3.62f3 (URP) |
| **렌더링** | Universal Render Pipeline + Global Volume (포스트프로세싱) |
| **총 Scene 수** | 7개 (1개 비활성 포함) |
| **총 스크립트 수** | 약 247개 (에셋 포함) |
| **총 Prefab 수** | 약 740개 (에셋 포함) |
| **프로젝트 구조** | `01_Scenes` / `02_Scripts` / `03.Resource` / `04_Prefabs` / `05.Audio` |

---

## 🎬 Scene 구성 (빌드 순서)

| 빌드 순서 | Scene 이름 | 역할 |
| --- | --- | --- |
| 1 | **MainMenu_Scene** | 메인 메뉴 / 게임 시작 |
| 2 | **ChariManScene** | 회장실 (도입부 컷씬/튜토리얼) |
| 3 | **Level_1_Scene** | 스테이지 1 |
| 4 | **Level_2_Scene** | 스테이지 2 |
| 5 | **Level_3_Scene** | 스테이지 3 |
| 6 | **Game_End_Scene** | 게임 엔딩 (정산서 연출) |
| (비활성) | SampleScene | 인벤토리 에셋 샘플 (미사용) |

> **기획서 대비:** 기획서에서는 Scene 1~4 (도입→전개→위기→결말) 4단계로 설계했으나, 실제로는 **회장실 + 3개 레벨 + 엔딩**의 5단계로 구현됨. 기획 대비 레벨이 세분화됨.

---

## 🧑‍💻 플레이어 시스템

### 컴포넌트 구성

Player 오브젝트에 부착된 컴포넌트 **14개**:

| 컴포넌트 | 기능 |
| --- | --- |
| `PlayerMove` | 이동 (걷기/달리기) |
| `AimAndFlip` | 마우스 조준 + 좌우 반전 |
| `GunFire` | 총기 발사/재장전 |
| `PlayerHealth` | 체력 관리 |
| `PlayerItemTrigger` | 아이템 습득/장착/교체 (2슬롯) |
| `PlayerPotionUse` | 에너지드링크 사용 |
| `PlayerFlareGunUse` | 조명탄 사용 |
| `PlayerNoiseBombUse` | 소음 미끼 사용 |
| `Animator` | 애니메이션 (Speed, IsRunning, IsBackWalk, Hit, Die, Shoot) |
| `Rigidbody` | 물리 (중력 적용, 보간 사용) |
| `CapsuleCollider` | 충돌 (반경 0.3, 높이 2.0) |
| `RigBuilder` | Animation Rigging (IK) |
| `AudioSource` | 사운드 재생 |

### 실제 수치 (PlayerMove)

| 파라미터 | 값 |
| --- | --- |
| **걷기 속도** | 1.5 |
| **달리기 속도** | 3.0 |
| **가속도** | 40.0 |
| **감속도** | 50.0 |
| **걸음 소리 간격 (걷기)** | 0.5초 |
| **걸음 소리 간격 (달리기)** | 0.4초 |
| **걷기 볼륨** | 0.5 |
| **달리기 볼륨** | 1.0 |
| **발소리 클립** | 걷기 3종, 달리기 5종 |

### 실제 수치 (GunFire)

| 파라미터 | 값 |
| --- | --- |
| **총기 이름** | M1911 Handgun Base |
| **탄창 크기 (magSize)** | 10발 |
| **최대 보유 탄약** | 10발 |
| **발사 쿨다운** | 0.25초 |
| **총알 속도** | 40.0 |
| **재장전 시간** | 2.3초 |
| **최대 사거리** | 20.0 |
| **적 레이어 마스크** | 128 (Layer 7) |

### 실제 수치 (PlayerHealth)

| 파라미터 | 값 |
| --- | --- |
| **최대 HP** | 100 |
| **초기 HP** | 0 (런타임 초기화) |
| **피격 애니메이션** | Hit (Trigger) |
| **사망 애니메이션** | Die (Trigger) |
| **Low HP UI** | LowHPUI 프리팹 연동 |

### 실제 수치 (아이템 시스템)

| 아이템 | 주요 파라미터 |
| --- | --- |
| **에너지드링크** | 회복량: **25** HP, 사운드: Drinkuse.wav |
| **조명탄** | 발사력: 10.0, 마우스 조준 사용, 머즐 파티클 연출 |
| **소음 미끼** | 최소 투척력: 6.0 ~ 최대: 16.0, 상향력: 1.5~3.5, 조준 거리: 1.5~10.0 |
| **추가 탄약** | AdditionalAmmo 프리팹으로 구현 |

> **기획서 대비:** 기획서에는 에너지드링크가 "최대 체력 1/4 회복"으로 설계 → 실제 값 **25 HP** (100의 1/4 = 25). **기획과 일치.**

---

## 👾 적(Enemy) 시스템

### 적 프리팹 구성

| 프리팹 | 기획서 대응 | 비고 |
| --- | --- | --- |
| `Enemy_GuardHound` | **경비견** | 지상 추적 적 |
| `Enemy_AmbushPlant` | **파리지옥** | 천장 매복 적 |
| `Enemy_Squealer` | **밀고자 / CCTV** | 감시 + 경비견 소환 |

### Level_2_Scene 배치

- **Enemy 컨테이너** 하위 자식: **13개** 적 오브젝트 배치

### 적 관련 스크립트

| 스크립트 | 기능 |
| --- | --- |
| `EnemyCtrl` | 경비견 AI 제어 (감지→추적→돌진) |
| `EnemyHealth` | 적 체력 관리 |
| `EnemyNoiseOverride` | 소음 미끼에 대한 반응 |
| `PlaneEnemyDmgTriiger` | 경비견 공격 트리거 |
| `CeilingEnemyCTRL` | 파리지옥 AI (천장 매복 + 낙하 공격) |
| `CeilingEnemyFireTrigger` | 파리지옥 트리거 영역 |
| `AmbushPlantOilDripper` | 파리지옥 기름 드롭 효과 |
| `AmbushPlantSound` | 파리지옥 고유 사운드 |
| `WatcherCTRL` | 밀고자/CCTV 단계별 경고 |
| `BulletDamage` | 파리지옥 투사체 데미지 |

> **기획서 대비:** 기획서의 3종 적(경비견, 파리지옥, 밀고자)이 모두 구현됨. 파리지옥에 **OilDrop/OilPeddle** 연출이 추가되어 기획서보다 풍부한 연출.

---

## 🎒 아이템 시스템

### 구현된 아이템

| 아이템 | 프리팹 | PickUp 프리팹 | ItemBox |
| --- | --- | --- | --- |
| **소음 미끼** | NoiseBomb | NoiseBomb_PickUp | ItemBox_NoiseBomb |
| **조명탄** | FlareGun + FlareGunBullet | FlareGun_PickUp | ItemBox_FlareGun |
| **에너지드링크** | EnergyDrink | EnergyDrink_PickUp | ItemBox_EnergyDrink |
| **추가 탄약** | AdditionalAmmo | — | ItemBox_AdditionalAmmo |

### 인벤토리 구현

- **2슬롯 시스템**: `PlayerItemTrigger`에서 `slot1`, `slot2` 관리
- **장착 모드**: `activeMode` (0: 총, 1/2: 아이템)
- **교체 키**: `Q`(1번 슬롯) / `E`(2번 슬롯)
- **드랍 포인트**: `DropPoint` 오브젝트로 바닥 드랍 위치 지정
- **슬롯 UI**: `slotIcon1`, `slotIcon2`로 아이콘 표시
- **팝 애니메이션**: 습득 시 1.2배 확대 → 0.15초 후 복귀

> **기획서 대비:** "슬롯이 꽉 찼을 때 아이템 교체 + 기존 아이템 드랍" 기획이 **정확히 구현됨.**

---

## 🎨 이펙트 & 환경

### 이펙트 프리팹

| 프리팹 | 용도 |
| --- | --- |
| `MuzzleFlash` | 총구 화염 |
| `BulletHitEffect` | 탄착 이펙트 |
| `BigSizeDestroyExplosion` | 대형 적 파괴 폭발 |
| `SmallSizeExplosion` | 소형 폭발 |
| `HitExplosion` | 피격 폭발 |
| `SparksEffect` | 스파크 |
| `OilDrop` / `OilPeddle` | 파리지옥 기름 연출 |

### 환경 시스템

| 프리팹 | 용도 |
| --- | --- |
| `FogSystem` + `FogRevealController` | **안개 시스템** (플레이어 주변 안개 제거) |
| `Fog_Quad1` (다중) | 안개 메쉬 |
| `Global Volume` | URP 포스트프로세싱 |
| `FlashLight` | 손전등 조명 |
| `DustMotesEffect` / `Dusts` | 먼지 파티클 |
| `Volume Fog` | 볼류메트릭 안개 |

> **기획서 대비:** "안개와 어둠으로 시야 제한" → `FogSystem` + `FogRevealController`로 **플레이어 주변만 안개가 걷히는 방식**으로 구현. 기획 의도를 충실히 반영.

---

## 🎵 사운드 시스템

### 오디오 구성

| 요소 | 내용 |
| --- | --- |
| **오디오 믹서** | `MainMixer.mixer` 사용 |
| **앰비언트** | `AmbientSoundPlayer` 컴포넌트 (메인 카메라) |
| **카메라 AudioSource** | 2개 (BGM + SFX 분리 추정) |
| **플레이어 AudioSource** | 1개 (발소리, 총소리, 아이템 사운드) |
| **걷기 사운드** | walk1~3.wav (3종) |
| **달리기 사운드** | run6~10.wav (5종) |
| **총 발사** | gunshot1.wav |
| **재장전** | reload.wav |
| **피격** | hitsound.wav |
| **에너지드링크** | Drinkuse.wav |
| **조명탄** | flareshot.wav |

> **기획서 대비:** "소리의 좌/우 방향성(스테레오)을 통해 위치를 추정" → `AudioSource`의 `spatialBlend` 설정으로 구현 가능하나, 현재 플레이어 AudioSource의 spatialBlend는 **0.0 (2D)**. 적의 사운드는 3D 설정일 가능성 있음.

---

## 🖥️ UI 시스템

### 구현된 UI

| UI 프리팹/오브젝트 | 기능 |
| --- | --- |
| `HUD_Canvas` | 인게임 HUD (체력바, 탄약 표시, 아이템 슬롯) |
| `PauseUICanvas` | 일시정지 메뉴 |
| `SettingPanel` | 설정 패널 (기본 비활성) |
| `LowHPUI` | 체력 부족 시 화면 효과 |
| `GameUIManager` | 메인 메뉴 매니저 + 크로스헤어 |
| `MainMenuUICanvas` | 메인 메뉴 |
| `GameEndUICanvas` | 게임 엔딩 UI |

### UI 관련 스크립트

| 스크립트 | 기능 |
| --- | --- |
| `AmmoUI` | 잔여 탄약 UI |
| `HealthBar` | 체력바 |
| `Inventory2Slots` | 2슬롯 인벤토리 UI |
| `InventoryUI` | 인벤토리 표시 |
| `CrosshairCursor` | 마우스 크로스헤어 |
| `FPromptUI` | F키 상호작용 가이드 |
| `FullScreenItemViewer` | 아이템 전체화면 뷰 |
| `GamePauseManager` | 일시정지 관리 |
| `EndingTyper` | 엔딩 타이핑 연출 |
| `TutorialObjective` | 튜토리얼 목표 표시 |
| `ExitPoint` | 탈출 지점 |

> **기획서 대비:** F키 상호작용 가이드(`FPromptUI`)가 구현됨. 기획서의 "상호작용 가능 거리일 때 아이콘 플로팅" 요구사항과 일치.

---

## 🏗️ 시스템 아키텍처

### GameSystem 컴포넌트

| 컴포넌트 | 역할 |
| --- | --- |
| `InputManager` | 입력 관리 (키보드/마우스) |
| `GameDataManager` | 게임 데이터 관리 (씬 간 데이터 유지) |
| `StageManager` | 스테이지 전환 관리 |

### 기타 유틸리티

| 스크립트 | 기능 |
| --- | --- |
| `IDamageable` | 데미지 인터페이스 (적/플레이어 공통) |
| `LockZ` | Z축 고정 (2.5D 사이드뷰) |
| `PauseState` | 일시정지 상태 관리 |
| `ItemBox` | 아이템 박스 상호작용 |
| `WeaponItem` | 무기 아이템 베이스 |
| `ItemPickUpTrigger` | 아이템 습득 트리거 |

---

## 📊 기획 vs 구현 비교 요약

| 기획 항목 | 기획서 내용 | 실제 구현 | 일치 여부 |
| --- | --- | --- | --- |
| **체력** | 100 | maxHp = **100** | ✅ 일치 |
| **인벤토리** | 2슬롯 | slot1 + slot2 | ✅ 일치 |
| **에너지드링크** | 최대 체력 1/4 회복 | healAmount = **25** (100/4) | ✅ 일치 |
| **아이템 교체** | Q(1번), E(2번) | Q/E 키 매핑 구현 | ✅ 일치 |
| **적 3종** | 경비견, 파리지옥, 밀고자 | GuardHound, AmbushPlant, Squealer | ✅ 일치 |
| **Scene 구조** | 4단계 (도입→결말) | 회장실 + 3레벨 + 엔딩 = **5단계** | ⚠️ 확장 |
| **상단 시야 확장** | W키로 카메라 위로 | `CameraMove` 컴포넌트 | ✅ 구현 |
| **손전등** | 시각 확인 수단 | `FlashLight` 프리팹 | ✅ 구현 |
| **안개 시스템** | 시야 제한 | `FogSystem` + `FogRevealController` | ✅ 구현 |
| **총 발사** | 마우스 좌클릭 | `GunFire` (쿨다운 0.25초) | ✅ 구현 |
| **소음 미끼** | 투척 후 기계음, 경비견 유인 | `NoiseBomb` + `NoiseSystem` + `EnemyNoiseOverride` | ✅ 구현 |
| **F키 상호작용** | 아이콘 플로팅 | `FPromptUI` | ✅ 구현 |
| **탄약 UI** | 잔여 탄약 표시 | `AmmoUI` | ✅ 구현 |
| **탈출** | 드론 박스 탑승 | `ExitPoint` 스크립트 | ✅ 구현 |
| **기름 드롭** | (기획서 미언급) | `OilDrop`/`OilPeddle` 추가 | ➕ 추가 구현 |
| **튜토리얼** | (기획서 미언급) | `TutorialObjective` 추가 | ➕ 추가 구현 |
| **아이템 전체화면 뷰** | (기획서 미언급) | `FullScreenItemViewer` 추가 | ➕ 추가 구현 |

---

## 💡 분석 소견

### 기획 충실도: ⭐⭐⭐⭐⭐ (매우 높음)

기획서에 명시된 **핵심 시스템이 모두 구현**되었으며, 수치(HP, 회복량, 슬롯 수 등)도 기획서와 정확히 일치합니다.

### 기획 대비 추가 구현 사항

1. **레벨 세분화:** 4단계 → 5단계 (3개 독립 레벨)
2. **OilDrop 연출:** 파리지옥에 기름 드롭 연출 추가 (공포감 증대)
3. **튜토리얼 시스템:** 게임 진행 목표를 안내하는 UI 추가
4. **아이템 전체화면 뷰:** 아이템 획득 시 상세 정보 표시
5. **크로스헤어 커서:** 조준 시각적 피드백 추가

### 개선 여지가 있는 부분

1. **오디오 Spatial Blend:** 플레이어 AudioSource가 2D(0.0)로 설정되어 있어, 적 사운드의 방향성 구현 방식 확인 필요
2. **탄약 시스템:** maxAmmo가 magSize와 동일(10)하여, 보유 최대 탄약이 1탄창분인 점은 난이도 설계 의도인지 확인 필요
