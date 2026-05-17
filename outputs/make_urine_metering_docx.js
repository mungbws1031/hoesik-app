const fs = require("fs");
const path = require("path");

const outputDir = __dirname;
const outputPath = path.join(outputDir, "정량_소변_수집_테스터스틱_소크라테스식_아이디어_350건.docx");

const rawIdeas = `
1|소변을 많이 담가도 일정량만 남기려면?|포화 흡수패드 + 초과분 배출 슬롯 구조
2|정해진 부피 이상은 어디로 보낼까?|계량 챔버 뒤에 오버플로우 폐액 저장부 배치
3|사용자가 담그는 시간을 몰라도 되게 하려면?|빠른 흡입부와 느린 방출부를 분리한 2단 위킹 구조
4|정량의 기준을 길이로 만들 수 있나?|일정 길이 모세관 채널을 120 µL 용적으로 설계
5|흡수체가 항상 같은 양을 먹게 하려면?|압축률 고정 스펀지 카트리지 방식
6|넘치는 순간 자동으로 차단되게 하려면?|부력 플로트가 입구를 막는 미니 밸브 구조
7|소변이 충분히 찼는지 어떻게 알까?|컬러 인디케이터가 변하는 계량 완료 창
8|사람이 흔들어도 정량이 유지되려면?|계량부와 테스트부 사이에 역류 방지 체크밸브 배치
9|불필요한 첫 유입분을 버릴 수 있나?|초기 20 µL를 폐기하고 이후 120 µL를 채우는 프리플러시 구조
10|기포가 정량을 방해하면?|상부 벤트 홀과 기포 트랩을 둔 계량 챔버
11|담그는 깊이 차이를 줄이려면?|외부 스토퍼 링으로 최대 침지 깊이 고정
12|사용자가 너무 오래 담그면?|포화 후 유입구가 팽윤재로 닫히는 자동 차단 구조
13|점도가 달라도 비슷하게 들어가게 하려면?|넓은 흡입구 + 좁은 계량 채널 조합
14|검사부로 한 번에 몰리지 않게 하려면?|계량 후 지연 방출하는 버퍼 패드 삽입
15|별도 컵 없이 직접 채뇨 가능하게 하려면?|소변 흐름을 받는 깔때기형 전면 캡 + 내부 계량실
16|사용자가 방향을 틀어도 작동하려면?|360도 흡입 가능한 원주형 위킹 링
17|소변이 너무 빨리 들어오면?|마이크로 메시 필터로 유입 속도 제한
18|충분히 채워지기 전 테스트가 시작되면?|수용성 막이 녹은 뒤에만 테스트부가 열리는 지연 게이트
19|정량 채취와 불순물 제거를 같이 하려면?|전단 필터 + 후단 계량 챔버 일체형 구조
20|정량을 부품 공차에 덜 민감하게 하려면?|면적보다 두께가 두꺼운 저공차 흡수 블록 사용
21|소변이 옆으로 새면?|친수성 중앙 채널 + 소수성 사이드 가드 코팅
22|너무 적게 담가도 채취되게 하려면?|저위치 흡입 노즐을 여러 개 둔 멀티포트 구조
23|초과 소변이 검사부 농도를 희석하면?|계량부와 폐액부를 물리적으로 분리한 Y자 유로
24|사용자가 확인하기 쉽게 하려면?|채취 완료 표시창과 초과 흡수 표시창 분리
25|한 번 채운 뒤 더 이상 들어오지 않게 하려면?|모세관 브레이크 지점을 둔 정지 유로
26|소량 샘플에서도 정확히 채우려면?|고흡수 스타터 패드가 계량실로 끌어올리는 펌프형 위킹
27|소변 흐름이 강하면?|충격 완화 전면 스플래시 챔버 + 후단 계량실
28|컵에 담갔을 때만 작동하게 하려면?|침지 높이 이상에서 열리는 하단 사이드 포트
29|샘플량을 물리적으로 고정하려면?|정확한 체적의 캡릴러 루프를 채운 뒤 절단 방출
30|테스터스틱이 얇아야 한다면?|평면형 마이크로 계량 채널을 필름 적층으로 구현
31|양산성을 높이려면?|사출 하우징 + 다이컷 흡수패드 + 라미네이트 필름 3층 구조
32|정량부가 오염되면?|일회용 보호캡 내부에 계량 모듈을 넣는 캡-스틱 결합형
33|채취와 분석을 시간차로 분리하려면?|채취 후 누르면 계량분이 테스트부로 이동하는 버튼 방출식
34|사용자 조작을 최소화하려면?|담그고 빼면 중력으로 계량부만 남는 자동 드레인 구조
35|정량 완료 전 빼면?|미충전 시 표시창이 변하지 않는 실패 감지 구조
36|너무 많이 젖은 스틱을 막으려면?|외피는 소수성, 입구만 친수성인 선택 흡수 구조
37|소변 내 입자가 막히면?|큰 포어 전처리층 + 작은 포어 계량층 순차 배치
38|검사부에 일정 속도로 보내려면?|계량 패드 뒤에 유량 제한 멤브레인 삽입
39|정량 기준을 무게로 잡을 수 있나?|정해진 흡수량에서 팽창해 유로를 닫는 흡수젤 게이트
40|다른 농도의 소변에도 안정적으로?|샘플 계량 후 내부 완충액과 자동 혼합되는 마이크로 믹서
41|매번 같은 시작점을 만들려면?|계량 완료 후 테스트 라인이 동시에 젖도록 싱크 게이트 사용
42|폐액이 다시 섞이면?|폐액부에 역류 방지 흡수체와 소수성 장벽 적용
43|사용자가 스틱을 기울이면?|내부 계량실을 수평-수직 모두 동작하는 대칭 구조로 설계
44|짧은 침지만으로 충분히 채취하려면?|고친수성 표면처리된 흡입 노즈 구조
45|정량부를 눈으로 검증하려면?|투명 윈도우에 최소선/완료선/초과선 표시
46|검사 실패를 줄이려면?|부족량이면 테스트부로 연결되지 않는 fail-closed 구조
47|다중 호르몬 검사용으로 나누려면?|하나의 계량실에서 3개 테스트 채널로 동일 분배하는 매니폴드
48|소변 냄새/오염 접촉을 줄이려면?|흡입부만 노출되고 본체는 밀폐되는 캡슐형 전면부
49|원가를 낮추려면?|정밀 밸브 없이 흡수체 용적과 오버플로우만 쓰는 패시브 계량식
50|가장 현실적인 MVP는?|침지 스토퍼 + 포화 계량패드 + 오버플로우 폐액패드 + 완료 표시창 조합
51|정량을 표면장력으로 끊을 수 있나?|친수 채널 끝에 소수성 브레이크를 둔 자동 정지 유로
52|채취량을 눈금 없이 고정하려면?|고정 체적 마이크로 웰을 채운 뒤 초과분만 배출
53|담금 시간이 길어도 더 안 들어오게 하려면?|포화되면 팽창해 입구를 막는 셀룰로오스 플러그
54|소변이 너무 묽거나 진해도 일정량을 받으려면?|점도 영향을 줄이는 짧고 넓은 계량 챔버
55|첫 접촉 순간 튀는 액체를 막으려면?|흡입구 앞에 스플래시 흡수 범퍼 추가
56|채취량을 사용자가 누르지 않게 하려면?|침지 후 빼는 순간 중력 배수로 정량만 잔류
57|유로 막힘을 줄이려면?|입구를 다공성 메시, 계량부를 미세 채널로 분리
58|초과분이 테스트부로 못 가게 하려면?|계량 챔버 위쪽에 폐액 전용 오버플로우 루프
59|소변 표면에 닿기만 해도 채취되게 하려면?|하단 모세관 핀 여러 개를 둔 접촉형 흡입부
60|컵 바닥 침전물을 피하려면?|흡입구를 바닥보다 3 mm 위에 띄운 스탠드오프 구조
61|스틱을 너무 깊게 넣어도 괜찮게 하려면?|외부 방수 슬리브와 지정 흡입창만 노출
62|사용자가 좌우로 흔들어도 정량 유지하려면?|내부 격벽이 있는 anti-slosh 계량실
63|검사부 시작 시간을 일정하게 하려면?|계량 완료 후 수용성 지연막이 열리는 타이머 게이트
64|소변량이 부족하면 실패로 처리하려면?|미충전 시 테스트부 연결이 안 되는 capillary lock
65|정량과 희석을 동시에 하려면?|120 µL 샘플 + 건조 버퍼 패드 자동 용출 구조
66|정량 샘플을 여러 라인에 나누려면?|동일 저항 길이의 병렬 유로 매니폴드
67|유입 속도를 자동 안정화하려면?|입구는 고속 흡수, 중간은 저속 멤브레인으로 제한
68|사용자가 거꾸로 들어도 작동하게 하려면?|흡수체 기반 비중력 계량 패드 구조
69|계량부를 아주 얇게 만들려면?|PET 필름 사이 레이저 컷 채널 적층 방식
70|정량 완료를 기계적으로 표시하려면?|젖으면 밀려나는 종이 플래그 표시창
71|초과 소변을 빠르게 제거하려면?|계량실 옆 고흡수 폐액 패드를 직접 접촉 배치
72|정량부가 너무 빨리 마르지 않게 하려면?|계량실 상부를 증발 차단 필름으로 밀봉
73|사용자가 소변에 너무 오래 노출되지 않게 하려면?|3초 침지만으로 채워지는 고친수성 흡입 노즈
74|채취 방향을 헷갈리지 않게 하려면?|비대칭 노즈와 컬러 흡입창 디자인
75|정량부 제조 편차를 줄이려면?|흡수재 대신 사출 체적 챔버로 샘플량 결정
76|샘플이 검사부에 갑자기 쏟아지면?|계량실 후단에 댐퍼 패드를 둔 완충 방출
77|오염된 외부 액체가 들어오면?|입구에 일방향 친수성 필터 캡 적용
78|검사 직전까지 샘플을 보관하려면?|계량 후 밀폐 챔버에 머물다가 누름 버튼으로 방출
79|정량을 소리/촉감으로 알릴 수 있나?|계량 완료 시 내부 플로트가 클릭하는 구조
80|완료 전 빼도 재시도 가능하게 하려면?|미충전 상태에서는 입구가 계속 열린 재충전형 챔버
81|초과분 흡수체가 역류하면?|폐액 패드와 계량실 사이에 소수성 차단벽 배치
82|모세관 압력을 설계 변수로 쓰려면?|채널 높이를 계단식으로 줄이는 capillary diode
83|소변 방울만으로 채취하려면?|전면 드롭 포트와 내부 정량 루프 결합
84|컵 없이 중간뇨를 받을 수 있나?|흐름을 순간 포착하는 spoon형 샘플 캐처
85|사용자가 많이 묻혀도 검사부가 깨끗하려면?|외부 오염부와 내부 유로를 완전 분리한 이중벽 하우징
86|기포가 빠져나갈 길은?|계량실 최고점에 소수성 공기 배출 벤트
87|소변이 입구에서 말라붙으면?|입구에 습윤 보존 코팅 또는 보호캡 적용
88|샘플량 기준을 흡수재 무게로 만들려면?|정해진 gsm/면적의 계량 흡수패드 사용
89|계량 후 테스트부 연결을 자동화하려면?|젖으면 접착이 풀리는 release tab 게이트
90|스틱 폭 제한 안에서 부피를 확보하려면?|길게 접힌 serpentine 계량 채널
91|소변 온도 차이가 유속에 주는 영향을 줄이려면?|유로 저항보다 흡수체 포화량으로 정량 결정
92|고농도 소변의 표면장력 차이는?|입구에 계면활성 건조 코팅으로 젖음성 표준화
93|초기 과속 유입을 막으려면?|입구 뒤에 확장 챔버를 둔 압력 완화 구조
94|소변이 테스트 라인에 너무 늦게 가면?|계량부와 테스트부 사이 거리 최소화한 short-transfer 설계
95|사용자가 스틱을 눕혀 놓으면?|흡수재 기반 저장부로 자세 민감도를 낮춘 구조
96|정량 완료 후 외부 소변이 더 묻으면?|완료 후 흡입창이 닫히는 슬라이딩 셔터
97|샘플 농축 손실을 막으려면?|폐액부와 샘플부가 접촉하지 않는 독립 유로
98|반복 실험용으로 부품 교체가 쉽게 하려면?|탈착식 계량 카트리지 모듈
99|사용자가 세게 흔들어도?|계량실 내부에 모세관 고정 리브 추가
100|가장 단순한 계량 원리는?|정해진 면적의 흡수패드가 포화되면 오버플로우로 넘기는 구조
101|테스트부가 초과 샘플을 먹지 않게 하려면?|계량부 후단에 유량 제한 목 구조
102|침지선보다 낮게 넣으면?|낮은 위치 흡입구와 보조 위킹 테일 적용
103|소변이 너무 빨리 폐액으로 빠지면?|계량실 우선 충전, 이후 오버플로우 되는 높이차 설계
104|부품 수를 줄이려면?|하우징 자체에 계량 챔버와 오버플로우를 사출
105|가장 작은 오차원은 무엇인가?|흡수재 편차보다 사출 체적 편차가 낮은 구조 선택
106|정량 후 일정 속도 방출은?|계량실 아래에 좁은 capillary neck 배치
107|검사부와 계량부를 분리 생산하려면?|계량 캡과 LFA 스트립을 조립식으로 결합
108|사용자가 소변을 묻힌 뒤 기다리기 쉽게 하려면?|완료창이 뜬 뒤 테스트 시작 표시창이 순차 변색
109|오염 방지를 위해 입구를 작게 하면 유속은?|다중 미세입구를 병렬 배치해 면적 확보
110|한쪽만 젖는 문제는?|흡입구 바로 뒤 확산 패드로 균일 분배
111|샘플이 부족할 때 잘못된 음성이 나오면?|부족 샘플 시 컨트롤 라인도 안 뜨는 fail-invalid 설계
112|정량과 사용자 안내를 합치려면?|계량실 외벽을 투명하게 두고 컬러 진행바 표시
113|소변 흐름 방향이 바뀌면?|양방향 유입 가능하되 단방향 방출되는 유로 다이오드
114|컵 안 벽면에 닿아도 작동하려면?|측면 흡입창을 추가한 L자형 노즈
115|미세채널이 비싸면?|다이컷 필름과 접착 테이프로 채널 구현
116|고급형 제품에서는?|MEMS 없는 패시브 마이크로플루이딕 계량 칩 삽입
117|초저가형 제품에서는?|흡수패드 용적 + 폐액패드만 쓰는 종이 기반 계량부
118|검체가 검사부에 닿기 전 필터링되게 하려면?|전처리 필터와 계량실을 직렬 배치
119|소변 속 점액질은?|입구 필터를 교체 가능한 rough filter로 분리
120|정량부 세척이 필요 없게 하려면?|전부 일회용 라미네이트 모듈로 구성
121|제품을 작게 유지하면서 폐액을 담으려면?|폐액부를 손잡이 내부 빈 공간에 배치
122|손잡이에 소변이 올라오면?|중간에 소수성 moat를 둔 오염 차단 구조
123|침지 후 바로 검사하면 과량 유입되나?|빼는 순간 배수되는 drain-back 창 적용
124|샘플 시작점을 동일하게 하려면?|계량 완료 전까지 테스트 스트립과 물리적 비접촉
125|소변량이 많아도 안전하게 버리려면?|대용량 초과 흡수 reservoir를 후방에 배치
126|정량 챔버가 꽉 찼는지 어떻게 검출?|공기 배출구까지 젖으면 표시 염료가 이동
127|기울기 오차를 줄이려면?|여러 작은 계량셀을 병렬로 둔 평균화 구조
128|한 셀이 안 차면?|셀별 오버플로우가 다음 셀을 채우는 cascade 계량
129|정량 후 혼합 균일도는?|계량실 내부에 지그재그 믹싱 리브 추가
130|샘플이 라인에 한쪽으로만 흐르면?|테스트부 진입 전 균압 분배 패드 적용
131|소변을 한 번만 접촉시키고 싶다면?|터치-앤-고 흡입 팁 + 내부 계량 유지 구조
132|너무 적은 샘플로도 시작 표시를 주려면?|별도 미량 인디케이터 유로와 본 계량 유로 분리
133|오버플로우가 너무 빨리 발생하면?|계량실 충전 우선순위를 높이는 친수성 구배 코팅
134|폐액부가 먼저 젖으면?|폐액 유로 입구에 높은 capillary threshold 적용
135|최종적으로 검사부에 120 µL만 보내려면?|계량실 체적 120 µL + 초과 폐액 + 지연 게이트 3단 구조
136|검사부 요구량이 80/120/150 µL로 바뀌면?|교체 가능한 계량 인서트 설계
137|제품군 확장성을 만들려면?|동일 본체에 용량별 계량 카트리지 교체
138|사용자가 실수로 옆면을 적시면?|측면은 완전 소수성 코팅, 하단만 친수성
139|채취 후 이동 중 새지 않게 하려면?|계량실 입구에 자동 밀폐 젤 게이트 적용
140|샘플이 너무 오래 계량실에 머물면?|일정 시간 후 테스트부로 자동 이동하는 용해막
141|호르몬 정량 정확도를 높이려면?|샘플량 계량 후 내부 표준 염료를 함께 이동시켜 보정
142|스마트폰 판독과 결합하려면?|채취 완료창과 테스트창을 같은 카메라 프레임에 배치
143|사용자 교육 없이 쓰려면?|침지 깊이 스토퍼, 완료색, 실패색을 물리적으로 강제
144|환경 조건이 달라도?|흡수재 사전 건조도와 포장 습도를 관리하는 밀봉 파우치
145|검사 전 소변이 너무 많이 묻은 외관은?|외부 액체를 닦아내는 와이퍼형 보호캡
146|딥스틱을 뺐을 때 방울이 떨어지면?|하단 drip-catcher 립과 폐액 흡수링
147|정량부와 손잡이를 동시에 만들려면?|손잡이 내부를 폐액 reservoir로 쓰는 일체형 하우징
148|양산 검사에서 정량 성능을 어떻게 확인?|색소수로 완료선 도달 시간과 잔류량을 자동 검사
149|가장 제품화 가능성이 높은 복합안은?|스토퍼 + 계량 챔버 + 오버플로우 + 벤트 + 완료창 조합
150|가장 혁신적이면서 현실적인 안은?|패시브 마이크로플루이딕 계량 캡을 LFA 스틱 앞단에 결합
151|소변을 한 번에 받지 말고 나눠 받으면?|3개 소형 계량셀을 순차 충전해 합산 120 µL 구현
152|과량 유입을 압력으로 막을 수 있나?|내부 압력이 오르면 입구가 눌려 닫히는 탄성 멤브레인 밸브
153|흡수재 편차를 보정하려면?|계량 패드와 기준 패드를 나란히 두고 색 이동 거리로 보정
154|소변이 매우 빠르게 흘러도?|전면 충격 챔버에서 속도를 죽인 뒤 계량부로 전달
155|정량부를 사용자가 보지 않아도 되게 하려면?|완료 시 손잡이 끝 색이 변하는 원격 표시 유로
156|샘플을 한 방향으로만 보내려면?|톱니형 친수/소수 패턴으로 capillary ratchet 구현
157|초과분을 버리면서도 손에 묻지 않게 하려면?|폐액 흡수부를 손잡이 내부 밀폐 포켓에 배치
158|정량부 충전 완료를 늦게 표시하면?|실제 계량실 완료 후 1초 뒤 표시되는 지연 인디케이터
159|젖음성이 제조마다 다르면?|입구 표면에 동일 친수 코팅을 인쇄 방식으로 적용
160|담근 뒤 바로 눕혀도?|계량실 내부에 액체를 고정하는 모세관 필러 기둥 배열
161|샘플 일부만 테스트부로 보내면?|200 µL를 채취하고 내부 루프로 120 µL만 분기
162|소변 방울 크기를 이용할 수 있나?|드롭 포트 3방울 충전 후 자동 폐쇄되는 방울 계량 캡
163|필름 적층으로 싸게 만들려면?|PET-접착층-PET 3층에 레이저 컷 계량 유로 형성
164|검사부가 너무 빨리 젖는 문제는?|계량 완료 전까지 건조 스페이서가 막는 물리적 차단 구조
165|부족 샘플을 강제로 invalid 처리하려면?|120 µL 미만이면 컨트롤라인 유로가 열리지 않는 병렬락
166|초과 샘플을 시각적으로 경고하려면?|폐액 패드가 젖으면 빨간 초과창 표시
167|소변이 옆면을 타고 올라가면?|손잡이 앞단에 소수성 절연 홈 2중 배치
168|흡입구 막힘을 줄이려면?|입구를 하나가 아니라 벌집형 다중 포트로 분산
169|샘플량을 시간으로 제어할 수 있나?|일정 시간 후 젖어 닫히는 수용성 타이머 플러그
170|정량부를 교체 가능하게 하면?|전면 계량 팁만 탈착되는 일회용 노즈 카트리지
171|샘플이 너무 진하면 유속이 느려지는데?|계량은 체적으로, 방출은 별도 고친수 패드로 분리
172|정확도를 높이려면 단일 대형 챔버보다?|10 µL 셀 12개 배열로 누적 계량
173|셀 하나가 실패하면?|13개 셀 중 12개 이상 충전되면 유효 처리하는 redundancy 계량
174|공기를 쉽게 빼려면?|각 계량셀 상단에 공기만 빠지는 소수성 벤트 필름 적용
175|소변이 오래 닿아도 추가 흡수 안 되게?|계량실 후단에 포화 후 닫히는 hydrogel shutter
176|유량을 일정하게 만들려면?|계량실 뒤에 다공성 세라믹 유량 제한체 삽입
177|제품 폭이 좁다면?|손잡이 길이 방향으로 접힌 Z형 계량 채널
178|정량부를 검사부와 멀리 두면 손실은?|계량실 바로 아래 LFA 패드가 시작되는 직접 접촉 설계
179|사용자 실수를 줄이려면?|흡입창 위치를 컵 바닥에 닿지 않는 높이로 강제하는 발 구조
180|샘플 채취 실패를 즉시 알리려면?|부족, 완료, 초과 3색 상태창
181|침지 깊이를 기계적으로 제한하려면?|컵 가장자리에 걸리는 클립형 깊이 스토퍼
182|직접 소변줄기에 노출될 때 과량은?|전면 캐처가 받은 뒤 내부 소형 포트만 계량부로 연결
183|사용 후 누출을 막으려면?|빼는 순간 외부 슬리브가 흡입창을 덮는 자동 셔터
184|테스트 시작 지연을 안정화하려면?|일정 거리의 건조 브리지 패드를 통과해야 검사부 도달
185|정량 완료 전 외부로 빼면?|계량실이 미완이면 내부 액체가 폐액부로 빠지는 self-invalid 구조
186|LFA 민감도에 맞춰 속도를 조절하려면?|샘플 방출부에 교체형 유량 저항 패드 사용
187|샘플이 농축되면?|밀폐 계량실로 증발 노출 시간을 최소화
188|소변 온도 영향을 줄이려면?|온도 민감도가 낮은 넓은 체적 챔버 중심 계량
189|보관 중 습기가 문제라면?|계량팁에 건조제 포함 보호캡 장착
190|현장 QC를 쉽게 하려면?|색소 표준액으로 120 µL 창 도달 여부를 카메라 검사
191|샘플에 거품이 많으면?|입구 위에 거품 차단 메시와 하부 액체 흡입 포트 분리
192|기포가 계량 부피를 차지하면?|계량실 상단 기포 포켓과 별도 벤트 루트
193|모세관이 끊기는 지점을 설계하려면?|넓은 챔버 뒤 좁은 목과 소수성 패치로 자동 정지
194|과량 유입 시 희석을 막으려면?|폐액 유로와 테스트 유로 사이 물리적 단절벽
195|정량 후 흔들림에도 유지하려면?|계량실 내부에 액체 포획용 micro-post forest 배치
196|샘플이 부족한 사용자를 배려하려면?|소량 반복 접촉으로 누적 충전되는 refillable metering tip
197|반복 접촉 시 오염은?|재접촉 가능하지만 역류는 안 되는 일방향 위킹 플랩
198|가장 단순한 고급형은?|사출 계량실 + 벤트 + 오버플로우 + 완료창 4요소 구조
199|가장 단순한 저가형은?|다이컷 계량 패드 + 대형 폐액패드 + 침지 스토퍼
200|정량 완료와 테스트 시작을 분리하려면?|사용자가 캡을 닫으면 계량분이 테스트부로 눌려 이동
201|컵 없이도 중간뇨만 받게 하려면?|앞쪽 첫 흐름은 흘려보내고 후속 흐름만 포집하는 바이패스 캐처
202|검사부 오염 방지를 위해?|채취부와 판독부 사이에 액체 차단 방수 격벽
203|LFA 스트립이 과포화되면?|테스트부 전단에 초과 샘플 흡수용 side sink 배치
204|유량이 너무 낮으면?|흡입부는 고친수성, 계량부는 중친수성, 폐액부는 초친수성 구배
205|정량 챔버 체적을 쉽게 바꾸려면?|사출 금형 인서트 교체로 80/120/150 µL 대응
206|샘플 분배 균일성을 높이려면?|계량실 후단에 fan-out 확산 구조
207|다중 분석 라인별 같은 양을 보내려면?|동일 폭/길이/표면처리 병렬 채널 설계
208|라인별 다른 양이 필요하면?|채널 저항을 다르게 한 비율 분배 매니폴드
209|오버플로우 시 먼저 폐액으로 가게 하려면?|계량실 천장 높이를 넘으면 폐액 유로로 넘어가는 weir 구조
210|미세채널 없이 정량하려면?|정해진 압축률의 폼이 포화량으로 계량
211|폼 압축 편차는?|하우징 리브로 폼 두께를 강제 고정
212|흡수재 로트 편차는?|로트별 흡수량 측정 후 패드 면적을 트리밍하는 보정 생산
213|제품이 작을수록 폐액 공간이 부족하면?|폐액부를 접이식 흡수 날개로 확장
214|사용 전 오염 방지는?|계량팁 보호캡을 제거해야만 흡입창이 노출되는 구조
215|사용자가 반대로 잡으면?|반대 방향에서는 컵에 들어가지 않는 비대칭 형상
216|소변에 담그는 시간을 물리적으로 유도하려면?|완료창이 보일 때까지 기다리라는 시각 진행바
217|진행바를 액체 유로로 만들면?|별도 표시 유로가 3초 후 끝까지 젖는 타이밍 표시
218|검사 시작 시간을 사용자에게 알려주려면?|계량 완료 후 START 문자가 나타나는 염료 패드
219|샘플량이 너무 많으면 결과 무효?|초과창이 뜨면 컨트롤라인 옆 invalid 마커가 함께 이동
220|샘플량이 너무 적으면?|부족창이 유지되면 컨트롤라인 공급 차단
221|검사부의 capillary pull이 계량을 방해하면?|계량 완료 전 LFA 패드와 공극으로 분리
222|공극 연결은 어떻게?|젖으면 팽창해 두 패드를 접촉시키는 swelling bridge
223|기계식 연결은?|캡을 닫으면 계량 패드가 LFA 샘플패드에 눌려 접촉
224|사용자 조작 없는 연결은?|수용성 스페이서가 녹아 두 패드가 닿는 delayed contact
225|샘플이 다시 외부로 빠지면?|입구 뒤에 일방향 흡수 플랩과 capillary trap 배치
226|컵 벽면 액적이 들어오면?|하단 중심부만 흡입하고 측면은 폐쇄한 recessed inlet
227|샘플을 충분히 섞어야 한다면?|계량실 안에 건조 혼합제와 지그재그 유로 배치
228|분석 전 큰 입자를 제거하려면?|1차 coarse filter, 2차 fine filter, 3차 계량부
229|필터가 샘플을 너무 먹으면?|필터는 얇게, 계량은 필터 후단 체적 챔버에서 수행
230|필터 포화량 편차를 없애려면?|필터 흡수량은 폐액 처리하고 계량실 유입분만 사용
231|정량부를 투명하게 만들면?|광학 판독 가능한 투명 사출 계량 챔버
232|불투명 소재를 써야 하면?|외부 표시 유로만 투명창으로 노출
233|샘플량 검증 데이터를 남기려면?|완료창 색 강도를 스마트폰으로 기록
234|정량 실패를 앱이 감지하려면?|부족/완료/초과창을 QR 주변에 배치해 카메라 인식
235|라벨 공간을 아끼려면?|손잡이 자체를 상태 표시창으로 활용
236|사용자가 결과창과 완료창을 혼동하면?|채취 상태창은 파란색, 검사 결과창은 별도 흰 배경
237|오버플로우가 너무 늦으면?|계량실 상단 바로 옆에 낮은 임계 높이 폐액 포트 배치
238|폐액부가 포화되면?|폐액 포화 시 입구를 차단하는 2차 hydrogel stop
239|장시간 침지 시 완전 차단?|1차 계량, 2차 폐액, 3차 입구 폐쇄 순서의 3단 안전 구조
240|짧은 침지 시 빠른 채움?|입구에 capillary booster fiber bundle 배치
241|부스터가 과량을 부르면?|부스터는 계량실까지만 연결하고 테스트부와 분리
242|스틱을 빼는 동작을 활용하면?|빼는 순간 외부 와이퍼가 초과 액체를 폐액패드로 밀어냄
243|컵 내부에서 흔들림을 줄이려면?|노즈에 작은 핀을 두어 컵 바닥에서 안정 자세 유지
244|직접 소변줄기에서 손잡이 보호?|우산형 splash shield 일체형 노즈
245|고령 사용자도 쓰기 쉽게?|큰 침지 스토퍼와 큰 완료창 중심 설계
246|소변을 너무 적게 묻히는 실수는?|최소 침지선 아래에서는 흡입창이 액체에 닿지 않는 구조
247|샘플이 옆으로 샐 때?|유로 주변에 흡수성 leak-catcher ring 배치
248|leak catcher가 계량을 뺏으면?|leak catcher는 계량 완료 후에만 닿도록 거리 분리
249|마이크로플루이딕 칩을 쓰면?|전면 disposable metering chip + 후면 일반 LFA 스트립
250|칩 비용을 줄이려면?|칩은 계량만 담당하고 판독은 기존 LFA 공정 유지
251|고급 제품 차별화는?|정량 완료, 초과, 시작 시간 3개 창을 갖춘 guided dipstick
252|저가 제품 차별화는?|단일 완료창과 포화 계량패드만 있는 passive measured dipstick
253|정량 정확도를 통계적으로 높이려면?|큰 샘플을 받고 내부에서 표준 부피만 추출
254|큰 샘플을 받는 공간은?|손잡이 내부 hollow reservoir를 활용
255|샘플 일부가 손잡이로 넘어가면?|손잡이 reservoir는 폐액 전용으로 소수성 격벽 분리
256|계량실 내부 잔류가 문제면?|방출 시 계량실 바닥 경사를 두어 잔류 최소화
257|완전 방출이 어렵다면?|LFA가 요구하는 양보다 약간 큰 계량실 + 잔류량 보정 설계
258|잔류량을 일정하게 만들려면?|계량실 표면처리와 코너 radius를 표준화
259|코너에 액체가 걸리면?|sharp corner 대신 둥근 wetting corner 구조
260|유입구가 마르면 성능 저하?|보호캡 내부 습도 차단 알루미늄 파우치
261|정량부 조립 오차는?|초음파 융착 대신 압착 높이를 제어하는 snap-fit spacer
262|접착층 두께 편차는?|유로 체적을 접착층이 아니라 사출 리브 높이로 결정
263|필름 라미네이션 기포는?|벤트 패턴을 둔 접착층 설계
264|생산 검사 자동화는?|투명 계량실의 색소수 충전 높이를 비전으로 판정
265|제품 폐기 안전성은?|사용 후 흡입구를 캡으로 봉인하는 원터치 폐기캡
266|캡을 이용해 계량도 가능?|캡 내부가 정량 컵 역할을 하고 스틱이 그만큼만 흡수
267|컵 없이 캡에 소변을 받으면?|미니 샘플컵 캡 + 스틱 삽입 시 120 µL만 접촉
268|캡 채뇨가 번거롭다면?|캡은 직접 소변줄기 캐처, 내부 계량실 자동 충전
269|남는 소변은?|캡 내부 폐액 흡수재가 초과분을 고정
270|사용자가 캡을 닫는 동작을 활용?|캡 체결 시 계량실 입구가 닫히고 테스트부가 열림
271|오염 접촉을 최소화?|손잡이와 채취부 사이에 disposable sacrificial sleeve
272|샘플 포집부만 버리게?|계량 노즈 분리형, 본체 판독부 재사용 가능
273|재사용 본체라면 교차오염은?|LFA 스트립과 계량노즈를 일체 일회용 카트리지화
274|다중 테스트 카트리지는?|하나의 계량노즈가 여러 LFA 스트립 카트리지에 균등 분배
275|샘플 부족 시 일부 라인만 뜨면?|모든 채널 공통 게이트가 열려야만 각 라인이 시작
276|다중 채널 시작 동기화는?|중앙 계량실에서 방사형 동일 길이 채널로 동시 공급
277|정량과 타이밍을 동시에?|계량 완료 후 dissolve bridge가 일정 지연 뒤 방출
278|타이밍 편차를 줄이려면?|용해막 대신 두께 제어된 다공성 지연 패드 사용
279|사용자가 기다리기 힘들면?|담금 3초-빼기-평평하게 놓기를 물리적으로 유도하는 거치형 손잡이
280|평평하게 놓지 않으면?|내부 유로가 자세 독립적인 흡수재 기반으로 동작
281|소변이 너무 산성/염기성이면?|계량부 후단에 pH 완충 건조패드 추가
282|염 농도 차이는?|샘플 전처리용 이온강도 완충 패드
283|호르몬 LFA에서 매트릭스 효과는?|정량 샘플과 건조 reagent가 정해진 비율로 혼합되는 pre-mix zone
284|혼합이 불균일하면?|pre-mix zone 뒤에 serpentine mixing pad
285|샘플 흐름이 너무 빠른 혼합 실패?|혼합부에 유량 저항섬유 배치
286|정량부가 시약을 흡수해버리면?|계량부와 시약부를 표면처리로 기능 분리
287|샘플 손실을 줄이려면?|계량실 내 표면적 최소화한 단순 타원형 챔버
288|계량실 표면에 단백이 붙으면?|저흡착 코팅 처리
289|가격을 낮추며 저흡착은?|코팅 대신 짧은 체류 시간 설계
290|방출이 너무 느리면?|LFA 샘플패드와 계량실 접촉 면적 확대
291|방출이 너무 빠르면?|접촉 면적을 좁은 슬롯으로 제한
292|유량을 제품별 튜닝하려면?|교체 가능한 접촉 슬롯 인서트
293|샘플량이 판독 알고리즘으로 보정 가능?|완료창 색 농도를 앱이 읽고 결과값 보정
294|앱 없이 보정하려면?|내부 표준선이 샘플 유량/양을 반영하도록 설계
295|정량 실패를 눈으로 확실히?|결과창 근처에 SAMPLE OK 별도 라인 배치
296|SAMPLE OK가 결과와 헷갈리면?|상태 라인은 손잡이 쪽, 결과 라인은 중앙창으로 물리 분리
297|소변량을 더 정밀하게 제한?|120 µL 계량 루프가 채워진 뒤 남은 유로가 공기 잠금
298|공기 잠금이 실패하면?|공기 잠금 뒤에 소수성 막 2차 차단
299|소수성 막 젖음 실패는?|소수성 막은 액체 차단, 공기 배출 전용으로만 사용
300|사용자가 물에 씻으면?|외부 세척액이 유입되지 않도록 사용 후 자동 밀폐
301|테스트 전 보관 방향 문제는?|포장 안에서 계량팁이 보호캡에 떠 있는 비접촉 구조
302|흔들림 배송에 보호?|계량패드 압축 변형을 막는 rigid spacer
303|흡수패드 압축 복원이 문제면?|폼 대신 셀룰로오스 필름 적층 사용
304|필름 적층 흡수량을 늘리려면?|micro-embossed spacer로 체적 확보
305|매우 빠른 MVP 실험은?|120 µL 물방울을 먹는 패드 면적을 찾고 오버플로우 패드 결합
306|MVP에서 사용성도 보려면?|3D프린트 스토퍼 + 투명 계량창 + 색소수 테스트
307|원가 검증은?|사출 1부품, 다이컷 2부품, 필름 1부품 이하 구조로 제한
308|부품 수 최저화는?|하우징 리브가 계량실, 스토퍼, 폐액가이드를 동시에 수행
309|공정 수를 줄이려면?|접착 라미네이션 대신 snap-fit 압착으로 유로 밀봉
310|밀봉 신뢰성은?|초음파 융착 라인을 유로 외곽에 두는 구조
311|누액 불량을 쉽게 발견?|누액 시 외부 leak indicator가 변색
312|계량 정확도를 출하검사 없이?|치수 공차가 큰 흡수재 방식보다 체적 사출 방식 채택
313|체적 사출 방식의 기포는?|계량실 가장 높은 곳에 벤트와 overflow를 결합
314|overflow를 벤트와 합치면?|공기는 빠지고 액체는 폐액패드로 즉시 흡수되는 vent-waste hybrid
315|초과 소변이 벤트로 새면?|벤트 외부에 흡수성 safety pad 배치
316|소변 냄새 노출을 줄이려면?|폐액패드에 냄새 흡착층 포함
317|사용 중 손가락 위치 보호?|grip zone 앞에 액체 차단 턱과 텍스처 경계
318|사용자가 흡입창을 손으로 막으면?|흡입창을 recessed 구조로 보호
319|소변컵 안에서 위치가 불안정?|컵 벽에 기대는 V자 가이드 노즈
320|컵 종류가 달라도?|컵 바닥과 벽 모두에서 작동하는 하단/측면 복합 흡입구
321|점도 차이에 둔감한 최종 구조?|흡입은 크게, 계량은 체적 챔버, 방출은 패드로 분리
322|담금 시간 차이에 둔감한 최종 구조?|빠른 계량 + 오버플로우 + 자동 입구 차단
323|깊이 차이에 둔감한 최종 구조?|침지 스토퍼 + 한정 노출 흡입창
324|방향 차이에 둔감한 최종 구조?|원주형 흡입링 + 중앙 계량실
325|초보자용 최고 안정안은?|큰 스토퍼, 큰 완료창, 초과창, fail-invalid 유로 조합
326|전문가용 고정밀안은?|마이크로플루이딕 계량 루프 + 소수성 브레이크 + 벤트
327|초저가 양산안은?|포화 패드 정량 + 폐액패드 + 소수성 가드
328|프리미엄 양산안은?|투명 사출 계량실 + 자동 셔터 + 스마트폰 상태 인식
329|가장 특허성 있는 조합은?|swelling bridge가 계량 완료 후 LFA 접촉을 자동 형성
330|또 다른 특허성 조합은?|계량완료 표시와 테스트 시작 게이트를 하나의 유로로 동기화
331|사용자의 딥 방식만 유지하려면?|겉은 일반 스틱, 내부는 계량 캡릴러와 폐액부 내장
332|외형을 크게 바꿔도 된다면?|스푼형 캐처가 샘플을 받고 스틱 내부로 정량 이송
333|흐르는 소변 직접형은?|splash shield + flow splitter + metering chamber
334|컵 침지 전용형은?|바닥 스탠드오프 + side inlet + overflow reservoir
335|둘 다 가능한 하이브리드는?|하단 침지구와 전면 흐름 캐처를 같은 계량실에 연결
336|하이브리드 과량 문제는?|두 입구 모두 계량실 후단에서 동일 overflow로 연결
337|시료가 너무 많을 때 자동 폐기?|계량실 초과분은 테스트부 반대방향 폐액 루트로 유도
338|시료가 너무 적을 때 자동 보류?|미충전 상태에서는 샘플패드와 접촉하지 않는 open gap 유지
339|시간이 지나면 보류 상태 해제?|미충전 상태에서는 용해막이 젖지 않아 게이트가 열리지 않음
340|완료 후만 게이트가 젖게?|완료 수위에 도달해야만 지연막과 접촉하는 상단 trigger wick
341|trigger wick이 초과분을 먹으면?|trigger wick은 신호용 극소량만 먹고 샘플 경로와 분리
342|완료창 색소가 테스트에 섞이면?|표시 유로와 검사 유로를 완전히 독립 배치
343|색소 없는 표시?|젖으면 투명해지는 필름으로 완료 표시
344|전기 없는 촉각 표시?|젖으면 팽창해 작은 돌기가 올라오는 tactile flag
345|청각 표시?|팽창재가 얇은 플라스틱 돔을 눌러 클릭 발생
346|표시 부품을 줄이면?|LFA 시작부가 젖을 때 동시에 상태창에 선이 나타나는 공유 유로
347|공유 유로의 간섭은?|표시 유로는 검사 유로보다 뒤에서 분기해 결과 영향 최소화
348|최종 MVP 2안은?|투명 계량실 120 µL + 오버플로우 패드 + 벤트 + 완료창
349|최종 MVP 3안은?|포화 계량패드 + 폐액패드 + 자동 차단 젤 + 부족/완료창
350|최종 프리미엄안은?|패시브 마이크로플루이딕 계량팁 + delayed LFA contact + 앱 판독 상태창
`;

const ideas = rawIdeas
  .trim()
  .split(/\r?\n/)
  .map((line) => {
    const [no, question, ...ideaParts] = line.split("|");
    return {
      no: Number(no),
      question: question.trim(),
      idea: ideaParts.join("|").trim(),
    };
  });

if (ideas.length !== 350) {
  throw new Error(`Expected 350 ideas, got ${ideas.length}`);
}

for (let i = 0; i < ideas.length; i += 1) {
  if (ideas[i].no !== i + 1) {
    throw new Error(`Idea numbering mismatch at index ${i}: ${ideas[i].no}`);
  }
}

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function paragraph(text, opts = {}) {
  const style = opts.style ? `<w:pStyle w:val="${opts.style}"/>` : "";
  const jc = opts.jc ? `<w:jc w:val="${opts.jc}"/>` : "";
  const spacing = opts.spacing
    ? `<w:spacing w:before="${opts.spacing.before || 0}" w:after="${opts.spacing.after || 120}" w:line="${opts.spacing.line || 360}" w:lineRule="auto"/>`
    : "";
  const pPr = style || jc || spacing ? `<w:pPr>${style}${jc}${spacing}</w:pPr>` : "";
  const bold = opts.bold ? "<w:b/>" : "";
  const color = opts.color ? `<w:color w:val="${opts.color}"/>` : "";
  const size = opts.size ? `<w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/>` : "";
  const rPr = bold || color || size ? `<w:rPr>${bold}${color}${size}</w:rPr>` : "";
  return `<w:p>${pPr}<w:r>${rPr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

function bullet(text) {
  return `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="80"/></w:pPr><w:r><w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p>`;
}

function cell(content, opts = {}) {
  const width = opts.width ? `<w:tcW w:w="${opts.width}" w:type="dxa"/>` : "";
  const shade = opts.shade ? `<w:shd w:fill="${opts.shade}"/>` : "";
  const valign = `<w:vAlign w:val="${opts.valign || "top"}"/>`;
  const margins = `<w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tcMar>`;
  return `<w:tc><w:tcPr>${width}${shade}${valign}${margins}</w:tcPr>${content}</w:tc>`;
}

function row(cells, opts = {}) {
  const header = opts.header ? `<w:trPr><w:tblHeader/></w:trPr>` : "";
  return `<w:tr>${header}${cells.join("")}</w:tr>`;
}

function tableFor(items) {
  const header = row(
    [
      cell(paragraph("No", { bold: true, color: "FFFFFF", jc: "center" }), { width: 820, shade: "243447", valign: "center" }),
      cell(paragraph("소크라테스식 질문", { bold: true, color: "FFFFFF", jc: "center" }), { width: 4200, shade: "243447", valign: "center" }),
      cell(paragraph("최종 아이디어", { bold: true, color: "FFFFFF", jc: "center" }), { width: 6520, shade: "243447", valign: "center" }),
    ],
    { header: true }
  );

  const body = items
    .map((item, idx) => {
      const shade = idx % 2 === 0 ? "F8FAFC" : "FFFFFF";
      return row([
        cell(paragraph(String(item.no), { jc: "center" }), { width: 820, shade, valign: "center" }),
        cell(paragraph(item.question, { spacing: { after: 40, line: 320 } }), { width: 4200, shade }),
        cell(paragraph(item.idea, { spacing: { after: 40, line: 320 } }), { width: 6520, shade }),
      ]);
    })
    .join("");

  return `
    <w:tbl>
      <w:tblPr>
        <w:tblStyle w:val="TableGrid"/>
        <w:tblW w:w="11540" w:type="dxa"/>
        <w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="820"/>
        <w:gridCol w:w="4200"/>
        <w:gridCol w:w="6520"/>
      </w:tblGrid>
      ${header}${body}
    </w:tbl>
  `;
}

function sectionTitle(start, end) {
  return paragraph(`${start}~${end}번 아이디어`, { style: "Heading1", spacing: { before: 380, after: 120 } });
}

const topCandidates = [
  "기본 MVP: 50, 75, 100, 135, 149, 198, 305, 348",
  "저가 양산형: 49, 117, 199, 252, 327, 349",
  "고정밀 프리미엄형: 150, 249, 326, 328, 350",
  "사용자 실패 방지형: 24, 46, 111, 180, 219, 220, 325",
  "특허 검토 후보: 222, 224, 329, 330, 340",
];

const verificationItems = [
  "흡수량 CV: 120 µL 기준 반복 측정, 로트별 편차 확인",
  "사용자 편차: 침지 깊이, 침지 시간, 흔들림, 기울기 조건 DOE",
  "소변 물성: 점도, 온도, 단백/염 농도, 거품 조건 테스트",
  "LFA 영향: 샘플량, 유량, 전개 시간, 테스트/컨트롤 라인 강도 비교",
  "양산성: 사출 공차, 다이컷 공차, 라미네이션/융착 불량률 검증",
  "실패 감지: 부족/초과/누액/기포 조건에서 invalid 처리 가능성 확인",
];

let body = "";
body += paragraph("정량 소변 수집이 가능한 테스터스틱 아이디어 350건", {
  style: "Title",
  jc: "center",
  spacing: { before: 120, after: 160 },
});
body += paragraph("소크라테스식 브레인스토밍 최종 정리안", {
  style: "Subtitle",
  jc: "center",
  spacing: { after: 360 },
});
body += paragraph("문서 목적", { style: "Heading1" });
body += paragraph(
  "딥스틱 또는 LFA 테스터스틱에서 사용자가 소변을 담그거나 직접 접촉시키는 방식은 유지하면서, 내부적으로 일정량의 소변만 수집·전달·검증하는 구조 아이디어를 정리한 문서입니다.",
  { spacing: { after: 120 } }
);
body += paragraph("전제 조건", { style: "Heading1" });
[
  "목표는 단순 채취가 아니라 검사부로 전달되는 유효 샘플량의 정량화입니다.",
  "대표 목표량은 120 µL로 가정하되, 제품 요구사항에 따라 80/120/150 µL 등으로 조정 가능합니다.",
  "아이디어는 기구 구조, 흡수재, 마이크로플루이딕, 사용자 피드백, 양산성 관점이 섞여 있습니다.",
  "의료기기 적용 전에는 정확도, 반복성, 생체시료 영향, 규제, 특허, 제조 공차 검토가 필요합니다.",
].forEach((item) => {
  body += bullet(item);
});
body += paragraph("우선 검토 후보", { style: "Heading1" });
topCandidates.forEach((item) => {
  body += bullet(item);
});
body += paragraph("검증 체크리스트", { style: "Heading1" });
verificationItems.forEach((item) => {
  body += bullet(item);
});
body += paragraph("전체 아이디어 목록", { style: "Heading1", spacing: { before: 400, after: 180 } });

for (let start = 1; start <= 350; start += 50) {
  const end = Math.min(start + 49, 350);
  body += sectionTitle(start, end);
  body += tableFor(ideas.slice(start - 1, end));
}

body += paragraph("실행 권장안", { style: "Heading1", spacing: { before: 420, after: 120 } });
[
  "1차 실험은 50, 75, 100, 149, 198, 348을 중심으로 진행합니다. 이유는 정량 원리가 명확하고, 흡수재·사출·오버플로우·벤트만으로 빠른 시제품화가 가능하기 때문입니다.",
  "2차 실험은 326, 329, 330, 350을 중심으로 진행합니다. 이유는 고정밀화와 특허성 검토 가치가 상대적으로 높기 때문입니다.",
  "초기 의사결정 기준은 디자인 선호보다 반복정밀도, 실패 감지, 양산 공차, 사용자 실수 내성 순서로 두는 것이 적절합니다.",
].forEach((item) => {
  body += bullet(item);
});

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
  xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
  xmlns:w10="urn:schemas-microsoft-com:office:word"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
  xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
  xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
  xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
  xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
  mc:Ignorable="w14 w15 wp14">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>
      <w:pgMar w:top="850" w:right="720" w:bottom="850" w:left="720" w:header="450" w:footer="450" w:gutter="0"/>
      <w:cols w:space="720"/>
      <w:docGrid w:linePitch="360"/>
    </w:sectPr>
  </w:body>
</w:document>`;

const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Malgun Gothic" w:hAnsi="Malgun Gothic" w:eastAsia="Malgun Gothic" w:cs="Malgun Gothic"/>
        <w:sz w:val="20"/>
        <w:szCs w:val="20"/>
        <w:color w:val="1F2937"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="120" w:line="320" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:rPr>
      <w:b/>
      <w:rFonts w:ascii="Malgun Gothic" w:hAnsi="Malgun Gothic" w:eastAsia="Malgun Gothic"/>
      <w:color w:val="0F172A"/>
      <w:sz w:val="44"/>
      <w:szCs w:val="44"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:rPr>
      <w:color w:val="475569"/>
      <w:sz w:val="24"/>
      <w:szCs w:val="24"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:keepNext/>
      <w:spacing w:before="320" w:after="120"/>
      <w:outlineLvl w:val="0"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:color w:val="0F3D4A"/>
      <w:sz w:val="28"/>
      <w:szCs w:val="28"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="ListParagraph">
    <w:name w:val="List Paragraph"/>
    <w:basedOn w:val="Normal"/>
    <w:pPr>
      <w:ind w:left="720" w:hanging="360"/>
    </w:pPr>
  </w:style>
  <w:style w:type="table" w:default="1" w:styleId="TableGrid">
    <w:name w:val="Table Grid"/>
    <w:tblPr>
      <w:tblBorders>
        <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:left w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
      </w:tblBorders>
    </w:tblPr>
  </w:style>
</w:styles>`;

const numberingXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:multiLevelType w:val="hybridMultilevel"/>
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="bullet"/>
      <w:lvlText w:val="•"/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`;

const settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
  <w:characterSpacingControl w:val="doNotCompress"/>
</w:settings>`;

const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
</Relationships>`;

const created = new Date().toISOString();
const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>정량 소변 수집 테스터스틱 아이디어 350건</dc:title>
  <dc:subject>소크라테스식 브레인스토밍</dc:subject>
  <dc:creator>Codex</dc:creator>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${created}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${created}</dcterms:modified>
</cp:coreProperties>`;

const appXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
  xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Codex OpenXML Generator</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Title</vt:lpstr></vt:variant><vt:variant><vt:i4>7</vt:i4></vt:variant></vt:vector></HeadingPairs>
  <TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>정량 소변 수집 테스터스틱 아이디어 350건</vt:lpstr></vt:vector></TitlesOfParts>
  <Company></Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>`;

const files = {
  "[Content_Types].xml": contentTypesXml,
  "_rels/.rels": relsXml,
  "docProps/core.xml": coreXml,
  "docProps/app.xml": appXml,
  "word/document.xml": documentXml,
  "word/styles.xml": stylesXml,
  "word/numbering.xml": numberingXml,
  "word/settings.xml": settingsXml,
  "word/_rels/document.xml.rels": docRelsXml,
};

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

const crcTable = makeCrcTable();
function crc32(buffer) {
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i += 1) {
    crc = crcTable[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const time =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const day = Math.max(date.getDate(), 1);
  const month = date.getMonth() + 1;
  const year = Math.max(date.getFullYear() - 1980, 0);
  const dosDate = (year << 9) | (month << 5) | day;
  return { time, date: dosDate };
}

function makeZip(fileMap) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  const { time, date } = dosDateTime();

  for (const [name, content] of Object.entries(fileMap)) {
    const nameBuf = Buffer.from(name, "utf8");
    const data = Buffer.from(content, "utf8");
    const crc = crc32(data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, nameBuf);

    offset += local.length + nameBuf.length + data.length;
  }

  const centralStart = offset;
  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(Object.keys(fileMap).length, 8);
  end.writeUInt16LE(Object.keys(fileMap).length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralStart, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...locals, ...centrals, end]);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, makeZip(files));
console.log(outputPath);
