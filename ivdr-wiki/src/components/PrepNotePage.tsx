import { Link } from "react-router-dom";
import { ArrowLeft, CheckSquare } from "lucide-react";

interface PrepSection {
  certId: string;
  certName: string;
  colorVar: string;
  tintVar: string;
  items: { category: string; tasks: string[] }[];
}

const prepSections: PrepSection[] = [
  {
    certId: "ivdr",
    certName: "IVDR (EU 2017/746)",
    colorVar: "--accent",
    tintVar: "--accent-weak",
    items: [
      {
        category: "규제 이해",
        tasks: [
          "IVDR Art.5 및 Annex VIII 분류 규칙 숙지",
          "해당 제품의 분류(Class A/B/C/D) 사전 확인",
          "적용 MDCG 가이던스 목록 수집",
          "공인기관(NB) 지정 현황 확인 (NANDO)",
        ],
      },
      {
        category: "성능 데이터 사전 확보",
        tasks: [
          "민감도·특이도·PPV/NPV 원시 데이터 보유 여부 확인",
          "기준물질(Reference Standard) 정보 확보",
          "EQA(외부 품질평가) 참가 기록 수집",
          "임상 사이트 협약서(CTA) 초안 준비",
        ],
      },
      {
        category: "QMS 준비",
        tasks: [
          "기존 ISO 13485 인증서 유효기간 확인",
          "설계·개발 이력 파일(DHF) 현황 파악",
          "위험관리 파일(RMF) 기존 문서 수집",
          "공급업체 목록 최신화 여부 확인",
        ],
      },
      {
        category: "프로젝트 관리",
        tasks: [
          "인증 목표 일정 및 마일스톤 작성",
          "담당자·책임자 지정 (PRRC 포함)",
          "예산 계획(NB 계약·외부 컨설턴트·시험기관)",
          "내부 결재·승인 프로세스 사전 확인",
        ],
      },
    ],
  },
  {
    certId: "iso13485",
    certName: "ISO 13485:2016",
    colorVar: "--p3",
    tintVar: "--p3-tint",
    items: [
      {
        category: "현황 파악",
        tasks: [
          "현행 QMS 절차서 목록 최신화",
          "이전 내부심사 결과 및 부적합 이력 수집",
          "경영 검토 회의록 최근 2회치 보관 확인",
          "시정·예방조치(CAPA) 미결 건 현황 파악",
        ],
      },
      {
        category: "자원 준비",
        tasks: [
          "내부심사원 자격 기록 최신화",
          "측정장비 교정 증명서 유효기간 확인",
          "교육훈련 기록 최근 1년치 정리",
          "공급자 평가 기록 최신화",
        ],
      },
      {
        category: "심사 준비",
        tasks: [
          "인증기관(CB)과 심사 일정 사전 협의",
          "심사 대상 사이트 목록 확정",
          "심사 준비 내부 담당자 배정",
          "심사 공간·회의실 사전 예약",
        ],
      },
    ],
  },
  {
    certId: "ivdd",
    certName: "IVDD (98/79/EC)",
    colorVar: "--p2",
    tintVar: "--p2-tint",
    items: [
      {
        category: "분류 확인",
        tasks: [
          "Annex II List A·B 해당 여부 확인",
          "자가검사(self-testing) 해당 여부 결정",
          "의도된 목적(Intended Purpose) 초안 작성",
          "적합성 절차 경로(Annex IV·V·VI·VII) 선택",
        ],
      },
      {
        category: "기존 문서 수집",
        tasks: [
          "98/79/EC 기기 파일(Technical File) 현황 확인",
          "기존 성능 평가 자료 보유 여부 확인",
          "현행 EC 적합성선언(DoC) 유효성 확인",
          "IVDR 전환 목표 일자 내부 합의",
        ],
      },
    ],
  },
  {
    certId: "mdsap",
    certName: "MDSAP",
    colorVar: "--p4",
    tintVar: "--p4-tint",
    items: [
      {
        category: "목표 국가 결정",
        tasks: [
          "목표 수출 국가(미국·캐나다·브라질·호주·일본) 확정",
          "각국 규제 요건 사전 조사",
          "캐나다 MDEL 보유 여부 확인",
          "브라질 ANVISA 등록 현황 확인",
        ],
      },
      {
        category: "QMS 준비",
        tasks: [
          "ISO 13485:2016 인증 현황 확인",
          "MDSAP 7챕터 요건 대비 갭 분석 착수",
          "심사기관(AO) 후보 목록 수집",
          "MDSAP 심사 예산·일정 계획 수립",
        ],
      },
    ],
  },
];

export function PrepNotePage() {
  return (
    <div className="min-h-screen bg-bg">
      <main
        className="mx-auto"
        style={{ maxWidth: "var(--max-w)", padding: "var(--s-12) var(--margin) var(--s-16)" }}
      >
        {/* Header */}
        <header style={{ marginBottom: "var(--s-10)" }}>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text"
            style={{ fontSize: "var(--t-sm)", marginBottom: "var(--s-4)" }}
          >
            <ArrowLeft size={16} aria-hidden />
            인증 허브
          </Link>
          <div className="flex items-center gap-3" style={{ marginBottom: "var(--s-3)" }}>
            <CheckSquare size={28} style={{ color: "var(--info)" }} aria-hidden />
            <h1 className="font-extrabold text-text" style={{ fontSize: "var(--t-3xl)", lineHeight: "var(--lh-tight)" }}>
              업무 시작 전 사전 준비 체크리스트
            </h1>
          </div>
          <p className="text-text-muted" style={{ fontSize: "var(--t-lg)", maxWidth: 640 }}>
            인증별 문서 작성을 시작하기 전에 준비해 두면 좋은 자료·메모·확인 사항 목록입니다.
          </p>
        </header>

        {/* Sections */}
        <div className="flex flex-col" style={{ gap: "var(--s-8)" }}>
          {prepSections.map((sec) => (
            <section
              key={sec.certId}
              className="rounded-[var(--r-lg)]"
              style={{ background: `var(${sec.tintVar})`, padding: "var(--s-6)" }}
            >
              <h2
                className="font-extrabold"
                style={{
                  color: `var(${sec.colorVar})`,
                  fontSize: "var(--t-xl)",
                  marginBottom: "var(--s-5)",
                }}
              >
                {sec.certName}
              </h2>

              <div
                className="grid grid-cols-1 md:grid-cols-2"
                style={{ gap: "var(--s-4)" }}
              >
                {sec.items.map((cat) => (
                  <div
                    key={cat.category}
                    className="rounded-[var(--r-md)]"
                    style={{ background: "var(--surface)", padding: "var(--s-4)" }}
                  >
                    <h3
                      className="font-bold text-text"
                      style={{ fontSize: "var(--t-base)", marginBottom: "var(--s-3)" }}
                    >
                      {cat.category}
                    </h3>
                    <ul className="flex flex-col" style={{ gap: "var(--s-2)" }}>
                      {cat.tasks.map((task, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-text-muted"
                          style={{ fontSize: "var(--t-sm)", lineHeight: "var(--lh-base)" }}
                        >
                          <span
                            className="mt-1 inline-block shrink-0 rounded-sm"
                            style={{
                              width: 14,
                              height: 14,
                              border: `1.5px solid var(${sec.colorVar})`,
                            }}
                            aria-hidden
                          />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer
          className="text-text-subtle"
          style={{ fontSize: "var(--t-xs)", marginTop: "var(--s-12)", lineHeight: "var(--lh-base)" }}
        >
          이 체크리스트는 참고용이며, 실제 인증 요건은 최신 규제 문서와 인증기관 요건을 우선합니다.
        </footer>
      </main>
    </div>
  );
}
