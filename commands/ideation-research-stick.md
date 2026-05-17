---
description: 딥핑 스틱/스트립 소재·구조 기술 리서치 특화 (흡수 패드·정량 설계·경쟁사 분석)
---

# 스틱/스트립 기술 리서치 — 딥핑 정량 특화

**주제:** $ARGUMENTS

딥핑 스틱·스트립의 소재, 구조, 정량 메커니즘에 특화된 기술 리서치를 수행해.
검색 3회를 **병렬로** 실행하고, 결과를 통합해서 출력해.

---

## 검색 1: 소재 & 흡수 패드 종류

키워드: `dip stick absorbent pad material nitrocellulose polyester urine strip lateral flow 흡수 소재`

조사 항목:
- 딥핑 스트립에 사용되는 흡수 패드 소재 종류 (nitrocellulose, glass fiber, polyester 등)
- 각 소재별 흡수 속도·정량 정확도·간섭 물질 특성
- TRF(Time-Resolved Fluorescence) 분석용 스트립에 적합한 소재 조건
- 최신 소재 혁신 동향 (2024–2026)

## 검색 2: 정량 스틱 설계 특허·논문

키워드: `quantitative urine dipstick volume control design patent absorbent tip metering capillary 정량 소변 스트립 설계`

조사 항목:
- 정량 채취를 구현한 스트립·스틱 설계 특허 (USPTO, EPO, KIPRIS)
- 모세관·흡수 한계·기계적 스토퍼 방식의 정량 원리 논문
- 정량 재현성 검증 데이터 (CV%, 목표 부피 정확도)
- 슈얼리 오브제 TRF 방식에 적용 가능한 설계 사례

## 검색 3: 경쟁사 스틱 구조 분석

키워드: `Mira Oova Inito urine strip stick structure design absorbent tip dipping method comparison`

조사 항목:
- Mira / Oova / Inito 스트립의 딥핑 방식 및 흡수 구조
- 각 제품의 사용자 리뷰에서 나타나는 스트립 관련 불만 (정량 오류, 오염, 재현성)
- 경쟁사 스트립 대비 슈얼리 오브제가 차별화할 수 있는 구조적 갭

---

## 출력 형식

```
### 스틱/스트립 기술 리서치 결과 — "$ARGUMENTS"

---

#### 1. 소재 & 흡수 패드 비교

| 소재 | 흡수 속도 | 정량 정확도 | TRF 적합성 | 비고 |
|---|---|---|---|---|
| Nitrocellulose | ... | ... | ... | ... |
| Glass Fiber | ... | ... | ... | ... |
| Polyester | ... | ... | ... | ... |
| [기타] | ... | ... | ... | ... |

**슈얼리 오브제 TRF용 최적 소재 후보:** ...
**근거:** ...

---

#### 2. 정량 설계 특허·논문 하이라이트

| 특허/논문 | 정량 메커니즘 | 목표 부피 | 재현성(CV%) | 슈얼리 적용 가능성 |
|---|---|---|---|---|
| ... | ... | ... | ... | ★★★★☆ |

**핵심 인사이트:**
- ...
- ...

---

#### 3. 경쟁사 스틱 구조 갭 분석

| 경쟁사 | 딥핑 방식 | 정량 기능 | 사용자 불만 | 슈얼리 차별화 포인트 |
|---|---|---|---|---|
| Mira | ... | 없음/있음 | ... | ... |
| Oova | ... | 없음/있음 | ... | ... |
| Inito | ... | 없음/있음 | ... | ... |

---

#### 통합 인사이트 — Phase 2 아이디어 생성을 위한 방향

**소재 관점:** ...
**구조 관점:** ...
**경쟁 관점:** ...

→ `/ideation-generate $ARGUMENTS` 로 이어서 아이디어 생성 가능
```

---

## 실행 규칙

- 모든 출력은 **한국어** (소재명·기술용어 영문 병기 허용)
- 출처(URL, 특허 번호, 논문 DOI) 반드시 명시
- 추측 금지 — 검색 결과 기반 사실만 기재
- TRF 분석기 컨텍스트 항상 유지 (슈얼리 오브제 = 4-호르몬 TRF IVD 분석기)
- IVDR Rule 5 (specimen receptacle·accessory) 관점 항상 포함
- 결과는 `./ideation_output/research-stick_<날짜>_<슬러그>.md`에 저장
