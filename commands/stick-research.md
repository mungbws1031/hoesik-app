---
description: 스틱 리서치 단축키 → /ideation-research-stick 와 동일
---

$ARGUMENTS 주제로 `/ideation-research-stick`을 실행해.

> **인수가 없을 경우:** 대화 맥락에서 가장 최근 스틱 관련 주제를 자동 사용해.
> 주제를 특정할 수 없으면 "주제를 입력해 주세요. 예: `/stick-research 슈얼리 오브제 dipping`" 안내.

딥핑 스틱·스트립의 소재, 구조, 정량 메커니즘에 특화된 기술 리서치를 수행해.
검색 3회를 병렬로 실행하고 결과를 통합 출력해.

## 검색 1: 소재 & 흡수 패드
키워드: `$ARGUMENTS dip stick absorbent pad nitrocellulose glass fiber urine strip TRF quantitative`
- 흡수 패드 소재 종류 및 TRF 적합성
- 최신 소재 혁신 동향 (2024–2026)

## 검색 2: 정량 설계 특허·논문
키워드: `$ARGUMENTS quantitative urine strip volume control design patent capillary metering`
- 정량 구현 특허 (USPTO, EPO, KIPRIS)
- 재현성 검증 데이터 (CV%)

## 검색 3: 경쟁사 구조 분석
키워드: `$ARGUMENTS Mira Oova Inito strip structure dipping method user review`
- 경쟁사 딥핑 방식 및 사용자 불만
- 슈얼리 오브제 차별화 갭

## 출력 형식
```
#### 1. 소재 & 흡수 패드 비교표
#### 2. 정량 설계 특허·논문 하이라이트
#### 3. 경쟁사 구조 갭 분석
#### 통합 인사이트 (Phase 2 방향 3줄)
```

결과는 `./ideation_output/research-stick_<날짜>_<슬러그>.md`에 저장.
