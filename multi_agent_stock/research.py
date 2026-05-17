"""
종목 리서치: yfinance + 뉴스 수집 → 팩트 데이터 반환
토론 전 모든 팀에 동일한 팩트 데이터를 제공
"""

import yfinance as yf
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re

HEADERS = {"User-Agent": "Mozilla/5.0"}


def _ticker_guess(stock_input: str) -> str:
    """한글 종목명 → 티커 추론 (간단 매핑 + yfinance 직접 시도)"""
    KRX_MAP = {
        "삼성전자": "005930.KS", "sk하이닉스": "000660.KS", "하이닉스": "000660.KS",
        "카카오": "035720.KS", "naver": "035420.KS", "네이버": "035420.KS",
        "posco": "005490.KS", "포스코": "005490.KS", "lg에너지솔루션": "373220.KS",
        "현대차": "005380.KS", "현대자동차": "005380.KS", "기아": "000270.KS",
        "셀트리온": "068270.KS", "카카오뱅크": "323410.KS", "크래프톤": "259960.KS",
        "lg화학": "051910.KS", "삼성바이오로직스": "207940.KS", "kb금융": "105560.KS",
        "신한지주": "055550.KS", "sk이노베이션": "096770.KS",
    }
    low = stock_input.lower().strip()
    for k, v in KRX_MAP.items():
        if k in low:
            return v
    # 이미 티커 형태면 그대로
    if re.match(r'^[A-Z]{1,5}$', stock_input.upper().strip()):
        return stock_input.upper().strip()
    if re.match(r'^\d{6}\.(KS|KQ)$', stock_input.upper().strip()):
        return stock_input.upper().strip()
    # 괄호 안 티커 추출: "삼성전자 (005930.KS)"
    m = re.search(r'\(([A-Z0-9.]+)\)', stock_input.upper())
    if m:
        return m.group(1)
    return stock_input.strip()


def _fmt(v, fmt=".2f", suffix=""):
    try:
        return f"{v:{fmt}}{suffix}" if v is not None else "N/A"
    except Exception:
        return "N/A"


def fetch_stock_data(stock_input: str) -> dict:
    """yfinance로 기본 재무 데이터 수집"""
    ticker_str = _ticker_guess(stock_input)
    try:
        tk = yf.Ticker(ticker_str)
        info = tk.info or {}
        hist = tk.history(period="3mo")

        price = info.get("currentPrice") or info.get("regularMarketPrice")
        prev  = info.get("previousClose") or info.get("regularMarketPreviousClose")
        chg   = ((price - prev) / prev * 100) if price and prev else None

        # 52주 고/저 대비 위치
        hi52  = info.get("fiftyTwoWeekHigh")
        lo52  = info.get("fiftyTwoWeekLow")
        pos52 = ((price - lo52) / (hi52 - lo52) * 100) if price and hi52 and lo52 and hi52 != lo52 else None

        data = {
            "ticker":          ticker_str,
            "name":            info.get("longName") or info.get("shortName") or stock_input,
            "price":           _fmt(price),
            "change_pct":      _fmt(chg, ".2f", "%"),
            "market_cap":      _fmt(info.get("marketCap"), ",.0f"),
            "per":             _fmt(info.get("trailingPE")),
            "forward_per":     _fmt(info.get("forwardPE")),
            "pbr":             _fmt(info.get("priceToBook")),
            "psr":             _fmt(info.get("priceToSalesTrailing12Months")),
            "roe":             _fmt(info.get("returnOnEquity", 0) * 100 if info.get("returnOnEquity") else None),
            "roa":             _fmt(info.get("returnOnAssets", 0) * 100 if info.get("returnOnAssets") else None),
            "debt_equity":     _fmt(info.get("debtToEquity")),
            "revenue_growth":  _fmt(info.get("revenueGrowth", 0) * 100 if info.get("revenueGrowth") else None, ".1f", "%"),
            "earnings_growth": _fmt(info.get("earningsGrowth", 0) * 100 if info.get("earningsGrowth") else None, ".1f", "%"),
            "gross_margin":    _fmt(info.get("grossMargins", 0) * 100 if info.get("grossMargins") else None, ".1f", "%"),
            "operating_margin":_fmt(info.get("operatingMargins", 0) * 100 if info.get("operatingMargins") else None, ".1f", "%"),
            "dividend_yield":  _fmt(info.get("dividendYield", 0) * 100 if info.get("dividendYield") else None, ".2f", "%"),
            "beta":            _fmt(info.get("beta")),
            "52w_high":        _fmt(hi52),
            "52w_low":         _fmt(lo52),
            "52w_position":    _fmt(pos52, ".1f", "%"),
            "avg_volume":      _fmt(info.get("averageVolume"), ",.0f"),
            "short_ratio":     _fmt(info.get("shortRatio")),
            "analyst_target":  _fmt(info.get("targetMeanPrice")),
            "analyst_low":     _fmt(info.get("targetLowPrice")),
            "analyst_high":    _fmt(info.get("targetHighPrice")),
            "recommendation":  info.get("recommendationKey", "N/A"),
            "sector":          info.get("sector", "N/A"),
            "industry":        info.get("industry", "N/A"),
            "summary":         (info.get("longBusinessSummary") or "")[:400],
            "hist_available":  not hist.empty,
        }

        # 최근 3개월 수익률
        if not hist.empty and len(hist) >= 2:
            ret3m = (hist["Close"].iloc[-1] / hist["Close"].iloc[0] - 1) * 100
            data["return_3m"] = _fmt(ret3m, ".1f", "%")
        else:
            data["return_3m"] = "N/A"

        return data
    except Exception as e:
        return {"ticker": ticker_str, "name": stock_input, "error": str(e)}


def fetch_news(stock_input: str, ticker_str: str, max_news: int = 8) -> list[dict]:
    """yfinance 뉴스 + 구글 뉴스 검색"""
    news = []

    # 1) yfinance 뉴스
    try:
        tk = yf.Ticker(ticker_str)
        yf_news = tk.news or []
        for item in yf_news[:max_news]:
            news.append({
                "title": item.get("title", ""),
                "source": item.get("publisher", ""),
                "date": datetime.fromtimestamp(item.get("providerPublishTime", 0)).strftime("%Y-%m-%d")
                        if item.get("providerPublishTime") else "",
            })
    except Exception:
        pass

    # 2) 구글 뉴스 (yfinance 뉴스 부족할 때 보완)
    if len(news) < 4:
        try:
            q = stock_input.split("(")[0].strip().replace(" ", "+")
            url = f"https://news.google.com/search?q={q}&hl=ko&gl=KR&ceid=KR:ko"
            r = requests.get(url, headers=HEADERS, timeout=8)
            soup = BeautifulSoup(r.text, "html.parser")
            for item in soup.select("article h3")[:max_news - len(news)]:
                news.append({"title": item.get_text(strip=True), "source": "Google News", "date": ""})
        except Exception:
            pass

    return news[:max_news]


def build_research_report(stock_input: str) -> str:
    """
    토론 전 공유할 팩트 리포트 생성
    모든 팀이 동일한 데이터를 기반으로 토론
    """
    print(f"\n🔍 리서치 중: {stock_input} ...")
    data = fetch_stock_data(stock_input)
    ticker = data.get("ticker", stock_input)
    news = fetch_news(stock_input, ticker)

    if "error" in data:
        report = (
            f"[리서치 실패: {data['error']}]\n"
            f"종목: {stock_input}\n"
            f"주의: 실시간 데이터 없음 — 일반 지식 기반으로 분석하세요."
        )
        print("  ⚠️  데이터 수집 실패 — 일반 지식으로 진행")
        return report

    lines = [
        f"{'='*60}",
        f"【 팩트 데이터 — {data['name']} ({ticker}) 】",
        f"{'='*60}",
        f"※ 아래는 실제 시장 데이터입니다. 토론 시 반드시 이 수치를 근거로 사용하세요.",
        "",
        "▶ 현재 주가 정보",
        f"  현재가: {data['price']}  |  등락: {data['change_pct']}",
        f"  시가총액: {data['market_cap']}",
        f"  52주 고가: {data['52w_high']}  |  52주 저가: {data['52w_low']}",
        f"  52주 위치: {data['52w_position']} (저점 대비)  |  3개월 수익률: {data['return_3m']}",
        "",
        "▶ 밸류에이션",
        f"  PER(현재): {data['per']}  |  PER(전망): {data['forward_per']}",
        f"  PBR: {data['pbr']}  |  PSR: {data['psr']}",
        "",
        "▶ 수익성·성장성",
        f"  ROE: {data['roe']}%  |  ROA: {data['roa']}%",
        f"  매출성장률: {data['revenue_growth']}  |  이익성장률: {data['earnings_growth']}",
        f"  매출총이익률: {data['gross_margin']}  |  영업이익률: {data['operating_margin']}",
        "",
        "▶ 재무 건전성·기타",
        f"  부채비율(D/E): {data['debt_equity']}  |  베타: {data['beta']}",
        f"  배당수익률: {data['dividend_yield']}  |  공매도비율: {data['short_ratio']}",
        "",
        "▶ 애널리스트 컨센서스",
        f"  의견: {data['recommendation'].upper()}",
        f"  목표가 평균: {data['analyst_target']}  |  범위: {data['analyst_low']} ~ {data['analyst_high']}",
        "",
        f"▶ 섹터/업종: {data['sector']} / {data['industry']}",
    ]

    if data.get("summary"):
        lines += ["", f"▶ 기업 개요", f"  {data['summary']}"]

    if news:
        lines += ["", "▶ 최신 뉴스 (토론 전 반드시 검토)"]
        for i, n in enumerate(news, 1):
            date_str = f"[{n['date']}] " if n["date"] else ""
            lines.append(f"  {i}. {date_str}{n['title']}  ({n['source']})")

    lines += ["", "=" * 60]
    report = "\n".join(lines)
    print(f"  ✅ 데이터 수집 완료 — {len(news)}개 뉴스")
    return report
