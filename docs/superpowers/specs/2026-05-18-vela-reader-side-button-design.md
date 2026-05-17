# Vela Reader · 측면 버튼 구조 설계

- 날짜: 2026-05-18
- 작성: 야간 자율 작업 (사용자 수면 중, 전권 위임)
- 동반 시각 자료: `2026-05-18-vela-reader-side-button-visuals.html` (단면도·비교표)
- 상태: **초안 — 아침 사용자 검토 대기** (구현/계획 단계로 미진행)

---

## 1. 목표

Vela Reader(달걀형 프리미엄 호르몬 측정 기기)에 **스마트폰 사이드 버튼 감성의 물리 버튼**을 추가한다. 현재 외형엔 버튼이 없다. 단일 다기능 측면 버튼을 도입한다.

## 2. 디바이스 컨텍스트

- 형태: 매끈한 유기적 달걀/조약돌형, 백색 사출 플라스틱
- 디자인 언어: 로즈골드 적도 액센트 밴드, 상단 다크 윈도우, 리프 로고
- 하단 `INSERT` 슬롯 — LFA 스트립을 소변 컵에 담근 뒤 삽입
- BLE 컴패니언 앱(Vela Flow) 연동, 배터리 구동
- 출처: `data/premium_hormone_reader_mock.json`, `data/project_config.json`, `assets/premium-reader-device.png`

## 3. 제약 (도출)

| # | 제약 | 근거 |
|---|------|------|
| C1 | 위생/세척성 — 액체 고임 틈 최소화, 닦임 | 소변 노출 펨테크 기기 |
| C2 | 프리미엄 심리스 외형 | 매끈한 폼, 로즈골드 디자인 언어 |
| C3 | 무광시 촉각 조작 | 컵 위 사적 상황, 보지 않고 사용 |
| C4 | 단일 버튼 다기능 (짧게/길게/더블) | UX 단순성 |
| C5 | 저비용·소형·배터리 | 사출 플라스틱, 내부 공간 제약 |
| C6 | 전원 ON 신뢰성 | 완전 종료에서 복귀 가능해야 |

## 4. 기능 매핑 (가정 — 검토 필요)

| 동작 | 기능 |
|------|------|
| 짧게 | 깨우기 / 측정 시작 확인 |
| 길게 2초 | 전원 ON/OFF |
| 길게 6초 | BLE 페어링 / 리셋 |
| 더블 | 즉시 동기화 (선택) |

## 5. 구조 컨셉 4종

### A. 경질 키캡 + 메탈 돔 (저비용 폴백)
고전적 스마트폰 사이드 버튼. 경질 키캡이 측면 컷아웃에 안착, 내부 SMD 택트/메탈 돔 작동.
- 장점: 친숙한 크리스프 클릭, 최저 비용, 검증된 양산성, 로즈골드 키캡 가능
- 단점: 둘레 틈 → 침투/오염 경로(C1 위배), 별도 내부 실링 필요

### B. 일체형 실리콘 오버레이 + 내부 메탈 돔 (★ 권장)
버튼부가 외피와 연속된 실리콘 돔. 둘레 틈 없음. 누름 시 실리콘이 휘며 내부 메탈 돔 작동. 방수 의료기기 표준 구조.
- 장점: 완전 실드(IP67+), 틈 없음 → 완벽 세척(C1), 내부 돔 진짜 클릭감(C3), 저비용·소형(C5), 수백만 사이클, 전원 ON 신뢰(C6)
- 단점: 경질 키캡 대비 약간 부드러운 타격감 (돔 튜닝으로 보완)

### C. 솔리드스테이트 압력 존 + 햅틱 (v2 미래)
무가동부. 연속 쉘 아래 스트레인 센서 + LRA 햅틱이 클릭 시뮬레이션. iPhone 액션 버튼 방향.
- 장점: 침투 0, 최상 심리스 외형, 무마모
- 단점: 최고 비용·복잡도, **전원 OFF 콜드스타트 문제(C6 위배)**, 배터리·공간 부담

### D. 리세스 필 버튼 + 내부 실리콘 부트 (대안)
B의 실링 + A의 경질 클릭감 하이브리드. 리세스로 오작동 저항, 로즈골드 베젤 링.
- 장점: 경질 클릭감 + 실드 + 오작동 저항 + 브랜드 연속성
- 단점: 리세스 잔여물 고임, 젖은/장갑 손가락 작동성 ↓, 부품 수 ↑

## 6. 비교 매트릭스

가중치는 `project_config.json`의 criteria_weights 정신을 차용(위생·실링·UX 우선).

| 기준 | A | B | C | D |
|------|---|---|---|---|
| 위생/세척성 | 약 | **최상** | 최상 | 중상 |
| 방수 실링 | 약 | 강 | 강 | 강 |
| 프리미엄 외형 | 중 | 상 | 최상 | 상 |
| 촉각 클릭감 | 최상 | 상 | 중(햅틱) | 상 |
| 비용/양산성 | 최상 | 상 | 약 | 중 |
| 전원 ON 신뢰 | 강 | 강 | 약 | 강 |
| **종합** | 보통 | **★ 최적** | 미래형 | 우수(대안) |

## 7. 권장 설계 — 컨셉 B

| 항목 | 사양 |
|------|------|
| 배치 | 로즈골드 적도 밴드 위, 그립 시 엄지 도달 15~20mm (20mm 아크 룰). 단일 버튼 |
| 형상 | 작동면 Ø8~10mm, 0.3~0.5mm 볼록(촉지), 중앙 리프 엠보스로 방향 인지 |
| 작동력/스트로크 | 2.5~4 N, 체감 0.3~0.5mm (내부 메탈 돔 250~350gf, 0.25mm 붕괴) |
| 실링 | 실리콘 오버레이 오버몰드 또는 3M 467MP급 접착 + 내부 리브 글랜드 → IP67 목표 |
| 피드백 | 메탈 돔 클릭(≥300k 사이클) + 화면/LED 확인 + 앱 BLE 햅틱 |
| 소재 | 스킨 매칭 LSR 실리콘 오버레이, 선택적 로즈골드 PVD 링 베젤; SS301 메탈 돔; FPC 접점 |

근거: 위생 컨텍스트(C1)와 저비용·소형(C5)·전원 신뢰(C6)를 동시에 만족하는 유일안. D는 더 단단한 클릭감 우선 시 대안. C는 v2 후보(콜드스타트 해결 전제). A는 비용 최우선 폴백.

## 8. 아침 검토용 결정 포인트

1. **기능 매핑 확정** — §4 가정값 검토
2. **컨셉 B vs D** — 심리스 위생 vs 경질 클릭감 우선순위
3. **로즈골드 PVD 베젤 링** 적용 여부 (브랜드 ↔ 비용/세척성)
4. **버튼 위치** — 좌/우 측면, 윈도우 기준 정확 좌표는 기구 도면 필요
5. **IP 등급 목표** — IP67 vs 침수세척 IP68/IP69K

## 9. 가정 명시

- 기능 매핑(§4)은 BLE 펨테크 기기 통례 기반 추정. 확정 아님.
- 정확한 치수/좌표는 3D 기구 도면 부재로 가이드라인(20mm 아크 룰 등) 기반 권장값.
- 이 문서는 브레인스토밍 산출물. 사용자 검토 전까지 구현/계획(writing-plans) 미진행.

## 10. 참고 자료

- [Metal dome switch 동작 원리](https://www.metal-domes.com/blog/2025/03/26/what-is-a-dome-switch-button-how-does-it-work/)
- [실리콘 돔 스위치](https://www.metal-domes.com/blog/2025/05/20/what-are-silicone-dome-switches-rubber-dome-switches/)
- [IP67 실드 멤브레인 스위치 설계](https://tactilemembrane.com/designing-waterproof-ip67-membrane-switches/)
- [환경 실링 멤브레인 키패드](https://csikeyboards.com/environmental-sealing/)
- [Capacitive vs Tactile 피드백](https://www.snaptron.com/2025/03/capacitive-tactile-feedback/)
- [iPhone 솔리드스테이트 버튼 (MacRumors)](https://www.macrumors.com/2025/10/28/20th-anniversary-iphone-solid-state-buttons/)
- [푸시버튼 force-travel 가이드라인 (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0003687097000379/pdf)
- [엄지 도달 범위 / 20mm 아크 룰](https://attackshark.com/blogs/knowledges/side-button-reach-hand-size-mouse-layouts)
- [의료기기 택트 스위치 (IEC 60601 맥락)](https://yijiabutton.com/medical-device-push-button-switches-reliability-and-compliance/)
- [IEC 62366-1 사용성 공학](https://clariscience.com/en/blog/regulatory-affairs/iec-62366-1-a-practical-guide-to-usability-evaluation-of-medical-devices)
