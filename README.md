# 지원바다 (Subsidea) 웹사이트 기획안

> **서비스명:** 지원바다 / Subsidea
> **도메인:** subsidea.kr (예정)
> **작성일:** 2026-07-03
> **버전:** v2.0 (배포 계획 추가)

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [타겟 사용자](#2-타겟-사용자)
3. [서비스 구조 (IA)](#3-서비스-구조-ia)
4. [페이지별 기획](#4-페이지별-기획)
5. [디자인 시스템](#5-디자인-시스템)
6. [기술 스택](#6-기술-스택)
7. [데이터 수집 전략](#7-데이터-수집-전략)
8. [배포 계획](#8-배포-계획)
9. [SEO 전략](#9-seo-전략)
10. [수익화 전략](#10-수익화-전략)
11. [개발 로드맵](#11-개발-로드맵)

---

## 1. 프로젝트 개요

### 1.1 서비스 목적

정부지원금 정보는 복지로·정부24 등 공식 사이트에 분산되어 있고 UI가 복잡해 일반 사용자가 접근하기 어렵다. 본 사이트는 **흩어진 정부지원금 정보를 한곳에 모아 쉽고 빠르게 안내하는 가이드 서비스**를 제공한다.

### 1.2 핵심 가치

| 가치 | 설명 |
|------|------|
| **쉬움** | 전문 용어 없이 누구나 이해할 수 있는 언어로 설명 |
| **빠름** | 검색 한 번으로 내게 맞는 지원금 즉시 확인 |
| **최신성** | 매일 자동 크롤링으로 항상 최신 정보 유지 |
| **신뢰성** | 공식 기관 원본 링크 항상 제공 |

### 1.3 경쟁 사이트 분석

| 사이트 | 강점 | 약점 |
|--------|------|------|
| 복지로 (bokjiro.go.kr) | 공식 정보 | UI 복잡, 검색 어려움 |
| 정부24 (gov.kr) | 신청 가능 | 정보 분산, 느림 |
| 온통청년 (youthcenter.go.kr) | 청년 특화 | 청년만 대상 |
| 개인 블로그들 | 쉬운 설명 | 정보 오래됨, 신뢰도 낮음 |

> **차별화 포인트:** 공식 정보의 신뢰성 + 블로그의 쉬운 설명 + 자동 업데이트

---

## 2. 타겟 사용자

### 2.1 주요 타겟 (퍼소나)

#### 퍼소나 A — 취준생 김민준 (24세)
- **상황:** 대학 졸업 후 구직 중, 월세 부담
- **니즈:** 구직활동 지원금, 청년 월세지원 빠르게 신청하고 싶음
- **행동:** 모바일로 검색, 긴 글 읽기 싫어함
- **목표 키워드:** "청년 구직지원금 신청방법", "청년 월세지원 자격"

#### 퍼소나 B — 신혼부부 박지수 (31세)
- **상황:** 결혼 1년차, 첫 아이 임신 중
- **니즈:** 출산 관련 지원금 종류와 금액 파악
- **행동:** PC로 꼼꼼히 검색, 여러 사이트 비교
- **목표 키워드:** "출산지원금 종류", "육아휴직 급여 계산"

#### 퍼소나 C — 소상공인 이성호 (42세)
- **상황:** 자영업 3년차, 경기 어려움
- **니즈:** 경영 지원금·대출 프로그램 파악
- **행동:** 네이버 검색 위주, 신뢰할 수 있는 정보 원함
- **목표 키워드:** "소상공인 지원금 2026", "자영업자 정부 대출"

### 2.2 타겟 우선순위

```
1순위: 청년 (20~34세)         ← 검색량 가장 많음, 트래픽 확보 최우선
2순위: 신혼부부·출산가정 (28~38세) ← 광고 단가 높음
3순위: 소상공인·자영업자        ← CPC 단가 최고
4순위: 저소득층·노인            ← 사회적 가치 + 복지 광고
```

---

## 3. 서비스 구조 (IA)

```
지원바다 (subsidea.kr)
│
├── 홈 (/)
│   ├── 검색창
│   ├── 인기 지원금 Top 10
│   ├── 최신 업데이트 지원금
│   └── 대상별 빠른 진입
│
├── 대상별 (/category)
│   ├── 청년 (/category/youth)
│   ├── 신혼부부·출산 (/category/family)
│   ├── 소상공인 (/category/business)
│   ├── 저소득층 (/category/welfare)
│   └── 중장년·노인 (/category/senior)
│
├── 분야별 (/topic)
│   ├── 주거 (/topic/housing)
│   ├── 취업·창업 (/topic/employment)
│   ├── 교육 (/topic/education)
│   ├── 의료·건강 (/topic/health)
│   └── 생활비 (/topic/living)
│
├── 지원금 상세 (/grant/[slug])
│   └── 각 지원금 상세 페이지
│
├── 자격 체크 (/checker)
│   └── 나에게 맞는 지원금 찾기 (설문형)
│
└── 업데이트 (/updates)
    └── 신규·변경·마감 임박 지원금 뉴스
```

---

## 4. 페이지별 기획

### 4.1 홈페이지 (/)

```
┌────────────────────────────────────────┐
│ [네비게이션 바] 로고 | 대상별 | 분야별 | 자격체크  │
├────────────────────────────────────────┤
│                                        │
│  [히어로 섹션 - 흰 배경]               │
│  내게 맞는 정부지원금                   │
│  지금 바로 찾아보세요                   │
│                                        │
│  [검색창] 지원금명, 키워드, 대상 검색   │
│  [빠른 버튼] 청년 | 신혼부부 | 소상공인 │
│                                        │
├────────────────────────────────────────┤
│  [인기 지원금 - 회색 배경 #f5f5f7]     │
│  이번 달 가장 많이 찾는 지원금          │
│  카드 3열 그리드                        │
│                                        │
├────────────────────────────────────────┤
│  [마감 임박 - 다크 배경 #1d1d1f]       │
│  신청 기한이 얼마 안 남은 지원금        │
│  흰 텍스트 카드                         │
│                                        │
├────────────────────────────────────────┤
│  [최신 업데이트 - 흰 배경]             │
│  새로 생긴 지원금·변경된 정책           │
│  리스트형                              │
│                                        │
├────────────────────────────────────────┤
│  [자격 체크 CTA - 회색 배경]           │
│  "내가 받을 수 있는 지원금은?"          │
│  → 자격 체크 시작하기 버튼             │
│                                        │
└────────────────────────────────────────┘
```

### 4.2 지원금 상세 페이지 (/grant/[slug])

모든 지원금 페이지는 아래 공통 구조를 따른다.

```
┌─────────────────────────────────────────┐
│ 빵부스러기: 홈 > 청년 > 청년도약계좌    │
├─────────────────────────────────────────┤
│                                         │
│  [요약 카드 - 파란 강조]                │
│  ┌──────────────────────────────────┐   │
│  │ 지원금명  청년도약계좌           │   │
│  │ 대상     만 19~34세 청년         │   │
│  │ 지원금액 최대 5,000만 원 (5년)   │   │
│  │ 신청기간 2026년 상시             │   │
│  │ 신청처   가까운 은행             │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [본문]                                 │
│  1. 이 지원금이 뭔가요?                 │
│  2. 신청 자격 조건                      │
│  3. 지원 금액·혜택                      │
│  4. 신청 방법 (단계별)                  │
│  5. 필요 서류                           │
│  6. 자주 묻는 질문 (FAQ)               │
│                                         │
│  [공식 신청 바로가기 버튼]              │
│                                         │
│  [함께 받을 수 있는 지원금] ← 내부링크  │
│                                         │
└─────────────────────────────────────────┘
```

### 4.3 자격 체크 페이지 (/checker)

설문형 UI로 사용자 조건을 입력받아 해당 지원금 목록을 필터링한다.

**설문 흐름:**

```
Step 1: 연령대 선택
  → 19세 미만 / 19~34세 / 35~49세 / 50세 이상

Step 2: 상황 선택 (복수 선택 가능)
  → 구직중 / 재직중 / 자영업 / 육아중 / 학생

Step 3: 주거 형태
  → 전세 / 월세 / 자가 / 기타

Step 4: 소득 수준 (선택)
  → 중위소득 50% 이하 / 100% 이하 / 150% 이하 / 무관

결과: 조건에 맞는 지원금 리스트 출력
```

### 4.4 업데이트 페이지 (/updates)

크롤러가 감지한 변경사항을 타임라인으로 노출한다.

```
[신규] 2026.07.01  청년 주거안정 월세대출 한도 상향
[변경] 2026.06.28  청년도약계좌 정부기여금 요건 변경
[마감] 2026.06.30  2026 상반기 소상공인 특별지원금 마감
[신규] 2026.06.25  출산지원금 첫만남이용권 200만 원으로 인상
```

---

## 5. 디자인 시스템

> Apple DESIGN.md (getdesign.md/apple) 기반으로 설계한다.

### 5.1 컬러 토큰

```css
:root {
  /* 브랜드 */
  --color-primary:          #0066cc;   /* Action Blue — 버튼, 링크 */
  --color-primary-hover:    #0077ed;

  /* 캔버스 */
  --color-canvas:           #ffffff;   /* 기본 배경 */
  --color-canvas-parchment: #f5f5f7;   /* 교차 섹션, 카드 배경 */
  --color-surface-dark:     #272729;   /* 다크 섹션 */
  --color-surface-black:    #000000;   /* 네비게이션 바 */

  /* 텍스트 */
  --color-ink:              #1d1d1f;   /* 기본 본문 */
  --color-ink-muted:        #717171;   /* 보조 텍스트, 캡션 */
  --color-on-dark:          #f5f5f7;   /* 다크 배경 위 텍스트 */

  /* 경계 */
  --color-hairline:         #e0e0e0;   /* 카드 테두리, 구분선 */

  /* 상태 */
  --color-success:          #1d8348;   /* 신청 가능 배지 */
  --color-warning:          #b7791f;   /* 마감 임박 배지 */
  --color-danger:           #c0392b;   /* 마감 배지 */
}
```

### 5.2 타이포그래피

```css
/* 폰트 패밀리 */
font-family: -apple-system, BlinkMacSystemFont,
             "SF Pro Display", "Pretendard", "Apple SD Gothic Neo",
             sans-serif;

/* 스케일 */
--text-hero:    56px / 600 / line-height 1.07 / letter-spacing -0.28px
--text-display: 40px / 600 / line-height 1.10
--text-title:   28px / 600 / line-height 1.14
--text-subhead: 21px / 600 / line-height 1.24
--text-body-lg: 19px / 400 / line-height 1.42
--text-body:    17px / 400 / line-height 1.47 / letter-spacing -0.374px
--text-caption: 14px / 400 / line-height 1.43
--text-label:   12px / 400 / line-height 1.33 / letter-spacing -0.12px

/* 모바일 축소 (max-width: 419px) */
--text-hero:    32px
--text-display: 24px
--text-title:   21px
```

### 5.3 스페이싱 & 레이아웃

```css
/* 섹션 패딩 */
--spacing-section:        80px 0;   /* 데스크탑 섹션 상하 여백 */
--spacing-section-mobile: 48px 0;   /* 모바일 */

/* 컨텐츠 최대 너비 */
--max-width-content: 980px;
--max-width-text:    700px;         /* 본문 텍스트 */

/* 그리드 */
--grid-desktop: 3컬럼 (지원금 카드)
--grid-tablet:  2컬럼
--grid-mobile:  1컬럼
--grid-gap: 20px;
```

### 5.4 컴포넌트

#### 버튼
```css
/* Primary (파란 pill) */
.btn-primary {
  background: var(--color-primary);
  color: #fff;
  border-radius: 9999px;
  padding: 8px 20px;
  font-size: 17px;
  font-weight: 400;
}

/* Secondary (테두리 pill) */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 9999px;
  padding: 8px 20px;
}
```

#### 지원금 카드
```css
.grant-card {
  background: #ffffff;
  border: 1px solid var(--color-hairline);
  border-radius: 18px;
  padding: 24px;
  transition: box-shadow 0.2s;
}
.grant-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.10);
}
```

#### 배지
```css
.badge-open    { background: #e8f5e9; color: #1d8348; border-radius: 6px; padding: 2px 8px; }
.badge-closing { background: #fff3cd; color: #b7791f; border-radius: 6px; padding: 2px 8px; }
.badge-closed  { background: #fdecea; color: #c0392b; border-radius: 6px; padding: 2px 8px; }
```

### 5.5 반응형 브레이크포인트

| 구간 | 너비 | 변화 |
|------|------|------|
| 데스크탑 | 1068px+ | 3컬럼 카드, 풀 네비게이션 |
| 소형 데스크탑 | 834~1068px | 2컬럼 카드 |
| 태블릿 | 640~834px | 2컬럼 카드, 햄버거 메뉴 |
| 모바일 | ~640px | 1컬럼, 단순화된 네비 |
| 소형폰 | ~419px | 헤드라인 28px로 축소 |

---

## 6. 기술 스택

### 6.1 기술 스택 상세

| 영역 | 기술 | 선택 이유 |
|------|------|----------|
| **프레임워크** | Next.js 15 (App Router) | SSG 최적화, SEO 강함 |
| **Next.js 어댑터** | OpenNext (@opennextjs/cloudflare) | Cloudflare Workers 공식 권장 방식 |
| **스타일링** | Tailwind CSS | 빠른 개발, 반응형 쉬움 |
| **크롤러** | Python + BeautifulSoup4 | 정부 사이트 HTML 파싱 |
| **자동화** | GitHub Actions | 무료 cron 스케줄러, 크롤링 실행 |
| **데이터 저장** | JSON 파일 (Git 관리) | 별도 DB 불필요, 무료 |
| **호스팅** | Cloudflare Pages | 무료 무제한 대역폭, 글로벌 CDN |
| **서버리스** | Cloudflare Workers | OpenNext 실행 환경 |
| **도메인·DNS** | Cloudflare (subsidea.kr) | DNS + SSL + CDN 통합 관리 |
| **분석** | Google Analytics 4 | 무료, 트래픽 분석 |
| **검색 최적화** | Google Search Console | 무료, SEO 모니터링 |

### 6.2 데이터 구조 (grants.json)

```json
{
  "updated_at": "2026-07-03T03:00:00Z",
  "grants": [
    {
      "id": "youth-leap-account",
      "name": "청년도약계좌",
      "slug": "youth-leap-account",
      "category": ["youth"],
      "topic": ["finance"],
      "summary": "5년 만기 시 최대 5,000만 원 수령 가능한 청년 전용 저축계좌",
      "target": {
        "age_min": 19,
        "age_max": 34,
        "income": "중위소득 180% 이하",
        "conditions": ["무주택 우대"]
      },
      "benefit": {
        "amount": "최대 5,000만 원",
        "duration": "5년",
        "type": "저축 + 정부기여금"
      },
      "period": {
        "start": "2026-01-01",
        "end": null,
        "is_ongoing": true
      },
      "apply_url": "https://www.kinfa.or.kr/",
      "source_url": "https://www.bokjiro.go.kr/",
      "status": "open",
      "tags": ["청년", "금융", "자산형성", "저축"],
      "last_updated": "2026-07-03"
    }
  ]
}
```

---

## 7. 데이터 수집 전략

### 7.1 크롤링 대상 사이트

| 사이트 | URL | 수집 정보 | 주기 |
|--------|-----|----------|------|
| 복지로 | bokjiro.go.kr | 복지서비스 전체 | 매일 |
| 정부24 | gov.kr | 정부 서비스 | 매일 |
| 고용24 | work24.go.kr | 취업·청년 지원 | 매일 |
| 온통청년 | youthcenter.go.kr | 청년 정책 | 매일 |
| 소상공인진흥공단 | semas.or.kr | 소상공인 지원 | 매일 |
| 한국장학재단 | kosaf.go.kr | 장학금·학자금 | 매일 |

### 7.2 크롤링 자동화 흐름 (GitHub Actions)

```yaml
# .github/workflows/crawl.yml
name: 정부지원금 크롤링

on:
  schedule:
    - cron: '0 18 * * *'  # 매일 UTC 18:00 = KST 03:00
  workflow_dispatch:       # 수동 실행도 가능

jobs:
  crawl:
    runs-on: ubuntu-latest
    steps:
      - name: 저장소 체크아웃
        uses: actions/checkout@v4

      - name: Python 설치
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: 패키지 설치
        run: pip install requests beautifulsoup4 lxml

      - name: 크롤러 실행
        run: python scripts/crawler.py

      - name: 변경사항 커밋 & 푸시
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add data/grants.json
          git diff --staged --quiet || git commit -m "데이터 업데이트: $(date +'%Y-%m-%d')"
          git push

      - name: Cloudflare Pages 재배포 트리거
        run: |
          curl -X POST "${{ secrets.CF_DEPLOY_HOOK_URL }}"
```

### 7.3 크롤링 윤리 원칙

- 요청 간격 최소 **2초** 이상 유지 (서버 부하 방지)
- `robots.txt` 확인 후 허용 범위 내 크롤링
- 공공저작물 기준 준수 (저작권법 제7조)
- User-Agent에 사이트 정보 포함
- 원본 출처 링크 항상 표기

---

## 8. 배포 계획

### 8.1 전체 배포 아키텍처

```
[개발자 로컬 PC]
  └─ git push → GitHub 저장소 (main 브랜치)
                    │
                    ├─[코드 변경 감지]──────────────────────────┐
                    │                                           │
                    │                              [GitHub Actions]
                    │                         매일 오전 3시 자동 실행
                    │                              │
                    │                    Python 크롤러 실행
                    │                    (복지로, 정부24 등)
                    │                              │
                    │                    grants.json 업데이트
                    │                              │
                    │                    git commit & push
                    │                              │
                    └──────────────────────────────┘
                                  │
                    Cloudflare Pages 자동 빌드 감지
                                  │
                    OpenNext 어댑터로 Next.js 빌드
                    (npx @opennextjs/cloudflare)
                                  │
                    Cloudflare Workers에 배포
                                  │
                          ┌───────────────┐
                          │  사용자 요청  │
                          └──────┬────────┘
                                 │
                    Cloudflare CDN (300+ 글로벌 엣지)
                                 │
                    subsidea.kr 서비스 제공
                    무료 SSL + DDoS 방어 포함
```

### 8.2 Cloudflare Pages 무료 플랜 검증

기획한 모든 기능을 무료 플랜 내에서 운영 가능함을 검증한다.

| 항목 | 무료 한도 | 예상 사용량 | 판정 |
|------|---------|-----------|:----:|
| **대역폭** | **무제한** | 무관 | ✅ |
| **빌드 횟수** | 월 500회 | 매일 1회 = 월 30회 | ✅ |
| **파일 수** | 20,000개 | 지원금 페이지 수백 개 | ✅ |
| **커스텀 도메인** | 프로젝트당 1개 | subsidea.kr 1개 | ✅ |
| **Workers 요청** | 일 100,000회 | 초기 트래픽 수천 건 | ✅ |
| **빌드 시간** | 20분 제한 | Next.js 빌드 약 2~3분 | ✅ |
| **무료 SSL** | 자동 발급 | 자동 적용 | ✅ |
| **DDoS 방어** | 기본 포함 | 자동 적용 | ✅ |

> **결론:** 초기 운영부터 일 방문자 3,000명 규모까지 무료 플랜으로 충분히 운영 가능하다.

### 8.3 단계별 배포 절차

#### Step 1. GitHub 저장소 생성

```bash
# 로컬에서 Next.js 프로젝트 초기화
npx create-next-app@latest subsidea --typescript --tailwind --app

# OpenNext Cloudflare 어댑터 설치
npm install @opennextjs/cloudflare
npm install -D wrangler

# GitHub 저장소에 푸시
git init
git remote add origin https://github.com/[username]/subsidea.git
git push -u origin main
```

#### Step 2. Cloudflare Pages 프로젝트 연결

```
1. Cloudflare 대시보드 → Workers & Pages → Pages
2. "Git에 연결" 클릭
3. GitHub 계정 연동 → subsidea 저장소 선택
4. 빌드 설정 입력:
   - 프레임워크:    Next.js
   - 빌드 명령어:   npx @opennextjs/cloudflare
   - 출력 디렉토리: .open-next
   - Node.js 버전:  20.x
5. 호환성 플래그 설정:
   - nodejs_compat 활성화
   - 호환성 날짜: 2024-09-23 이후
6. "저장 및 배포" 클릭
```

#### Step 3. 커스텀 도메인 연결

```
1. Cloudflare Pages → subsidea 프로젝트 → 커스텀 도메인
2. "도메인 추가" → subsidea.kr 입력
3. 도메인이 Cloudflare에서 관리되는 경우 DNS 자동 설정
4. 도메인이 외부 등록기관인 경우:
   - 네임서버를 Cloudflare로 변경
   - NS: alex.ns.cloudflare.com
   - NS: nina.ns.cloudflare.com
5. SSL 인증서 자동 발급 확인 (수 분 내 완료)
```

#### Step 4. GitHub Actions Secrets 등록

```
GitHub 저장소 → Settings → Secrets and variables → Actions

등록 항목:
- CF_DEPLOY_HOOK_URL : Cloudflare Pages Deploy Hook URL
  (Pages 설정 → 배포 훅 → 훅 추가에서 생성)
```

#### Step 5. 배포 자동화 확인

```
체크리스트:
□ main 브랜치 push → Cloudflare Pages 자동 빌드 시작 확인
□ 빌드 완료 후 subsidea.kr 정상 접속 확인
□ GitHub Actions 크롤링 수동 실행 테스트
□ grants.json 업데이트 후 Cloudflare 재배포 트리거 확인
□ subsidea.kr/grant/[slug] 페이지 정상 렌더링 확인
□ 모바일 반응형 확인 (Chrome DevTools)
□ SSL 인증서 적용 확인 (https://)
```

### 8.4 환경별 URL 구조

| 환경 | URL | 용도 |
|------|-----|------|
| **프로덕션** | https://subsidea.kr | 실서비스 |
| **Pages 기본** | https://subsidea.pages.dev | Cloudflare 기본 도메인 |
| **PR 프리뷰** | https://[브랜치명].subsidea.pages.dev | PR별 미리보기 |
| **로컬 개발** | http://localhost:3000 | 개발용 |

### 8.5 배포 파이프라인 전체 흐름

```
[일반 코드 배포]
개발자 커밋
  └─ git push main
       └─ Cloudflare Pages 자동 감지
            └─ OpenNext 빌드 (약 2~3분)
                 └─ 전 세계 CDN 엣지 배포 완료

[데이터 자동 업데이트]
GitHub Actions (매일 오전 3시)
  └─ Python 크롤러 실행 (~5분)
       └─ grants.json 변경 감지
            └─ git commit & push
                 └─ Cloudflare Deploy Hook 호출
                      └─ Pages 재빌드 자동 실행
                           └─ 최신 데이터로 사이트 갱신 완료
```

### 8.6 장애 대응 계획

| 상황 | 원인 | 대응 방법 |
|------|------|----------|
| 빌드 실패 | 코드 오류 | GitHub Actions 로그 확인 후 수정 push |
| 크롤링 실패 | 대상 사이트 구조 변경 | 크롤러 스크립트 수정 후 수동 재실행 |
| 도메인 접속 불가 | DNS 전파 지연 | 최대 48시간 대기, Cloudflare 대시보드 확인 |
| Workers 오류 | OpenNext 호환성 | 호환성 플래그·날짜 재설정 |
| 데이터 오염 | 크롤링 오파싱 | Git 이전 커밋으로 grants.json 롤백 |

---

## 9. SEO 전략

### 9.1 온페이지 SEO

#### URL 구조
```
/grant/[지원금명-슬러그]    ← 지원금 상세
/category/[대상]            ← 대상별 목록
/topic/[분야]               ← 분야별 목록
/updates                    ← 최신 업데이트
```

#### 메타 태그 패턴
```html
<!-- 지원금 상세 페이지 예시 -->
<title>청년도약계좌 신청방법 2026 – 조건, 혜택, 은행 총정리 | 지원바다</title>
<meta name="description"
  content="청년도약계좌 신청 자격(만 19~34세), 지원 금액(최대 5,000만 원),
           신청 방법을 한눈에 정리했습니다. 2026년 최신 정보 기준.">
```

#### 구조화 데이터 (Schema.org)
```json
{
  "@type": "Article",
  "name": "청년도약계좌 신청방법",
  "dateModified": "2026-07-03",
  "author": { "@type": "Organization", "name": "지원바다" }
}
```

### 9.2 콘텐츠 SEO 우선순위

**1단계 (런칭 즉시 — 검색량 최상위)**

| 페이지 | 목표 키워드 |
|--------|------------|
| 청년도약계좌 가이드 | "청년도약계좌 조건", "청년도약계좌 신청방법" |
| 청년 월세지원 가이드 | "청년 월세지원 자격", "청년 월세지원 신청" |
| 청년내일채움공제 | "청년내일채움공제 신청방법" |
| 청년 구직활동지원금 | "구직활동지원금 신청", "청년 지원금 종류" |
| 정부지원금 총정리 | "2026 정부지원금 총정리" ← 허브 페이지 |

**2단계 (런칭 2~4주)**

| 페이지 | 목표 키워드 |
|--------|------------|
| 육아휴직 급여 계산 | "육아휴직 급여 계산기" |
| 출산지원금 종류 | "2026 출산지원금 종류" |
| 국가장학금 신청 | "국가장학금 자격" |
| 소상공인 대출 | "소상공인 정책자금 신청" |
| 에너지바우처 | "에너지바우처 신청방법" |

**3단계 (2개월차 — 롱테일)**

```
"소득분위 4분위 받을 수 있는 지원금"
"중복 신청 가능한 정부지원금"
"직장인 정부지원금 종류"
"지역별 청년 지원금 서울 경기"
"2026년 새로 생긴 정부지원금"
```

### 9.3 내부 링크 전략

```
정부지원금 총정리 (허브)
    ├── 청년 지원금 총정리 (중간 허브)
    │       ├── 청년도약계좌
    │       ├── 청년 월세지원
    │       └── 청년내일채움공제
    ├── 출산·육아 지원금 총정리
    └── 소상공인 지원금 총정리
```

> 모든 상세 페이지 하단에 **"함께 받을 수 있는 지원금"** 섹션으로 내부 링크 연결

---

## 10. 수익화 전략

### 10.1 구글 애드센스 승인 전략

**승인 체크리스트:**

- [ ] 페이지 수 **20개 이상** (애드센스 신청 전)
- [ ] 개인정보처리방침 페이지 포함
- [ ] 이용약관 페이지 포함
- [ ] 운영자 소개(About) 페이지 포함
- [ ] 문의 페이지 또는 이메일 기재
- [ ] 원본 콘텐츠 비중 70% 이상
- [ ] 모바일 반응형 완성

**광고 배치 전략:**

```
[헤더 아래] 리더보드 (728×90) — 데스크탑
[본문 상단] 인피드 광고 — 지원금 카드 사이
[본문 중간] 디스플레이 (336×280)
[사이드바] 직사각형 광고 (300×250) — 데스크탑
[본문 하단] 반응형 광고
```

> 광고 밀도: 콘텐츠 대비 광고 비율 30% 이하 유지 (승인 및 UX 기준)

### 10.2 카테고리별 예상 CPC

| 카테고리 | 예상 CPC | 이유 |
|---------|---------|------|
| 소상공인 대출 | 500~1,500원 | 금융·대출 광고 단가 최고 |
| 부동산·주거 | 300~800원 | 청약·전세 관련 |
| 청년 취업 | 200~500원 | 교육·취업 광고 |
| 복지·의료 | 100~300원 | 보험 관련 광고 |

### 10.3 수익 목표

| 시점 | 일 방문자 | 예상 월 수익 |
|------|---------|------------|
| 2개월차 (애드센스 승인 직후) | 100명 | 1~3만 원 |
| 4개월차 | 500명 | 5~15만 원 |
| 6개월차 | 1,000명 | 10~30만 원 |
| 12개월차 | 3,000명+ | 30~100만 원 |

---

## 11. 개발 로드맵

### Phase 1 — 기반 구축 (1~2주차)

```
□ GitHub 저장소 생성 (subsidea)
□ Next.js 15 + OpenNext 프로젝트 초기화
□ Cloudflare Pages 연결 및 자동 배포 확인
□ subsidea.kr 도메인 구매 및 DNS 연결
□ Apple 디자인 시스템 CSS 변수 구성
□ 공통 레이아웃 (네비게이션, 푸터) 개발
□ 홈페이지 UI 개발
□ PR 프리뷰 배포 확인
```

### Phase 2 — 콘텐츠 & 크롤러 (2~4주차)

```
□ Python 크롤러 1차 작성 (복지로, 고용24)
□ grants.json 데이터 구조 정의
□ GitHub Actions 크롤링 자동화 설정
□ Cloudflare Deploy Hook 연동
□ 지원금 상세 페이지 템플릿 개발
□ 1순위 지원금 20개 페이지 작성
□ 대상별/분야별 목록 페이지 개발
□ 검색 기능 구현
```

### Phase 3 — SEO & 수익화 (4~6주차)

```
□ Google Analytics 4 연동
□ Google Search Console 연동 및 사이트맵 제출
□ 구조화 데이터 (Schema.org) 적용
□ 메타 태그 최적화 전 페이지 적용
□ 개인정보처리방침·이용약관·소개 페이지 작성
□ Google 애드센스 신청
□ 광고 배치 최적화
```

### Phase 4 — 확장 (2개월차~)

```
□ 자격 체크 기능 개발 (/checker)
□ 업데이트 페이지 (/updates) 개발
□ 크롤링 소스 확장 (소상공인진흥공단, 장학재단 등)
□ 지원금 50개 → 100개로 확장
□ 소셜 공유 기능 추가
□ 뉴스레터 구독 기능 (선택)
```

---

## 부록

### A. 주요 참고 사이트

| 사이트 | URL | 용도 |
|--------|-----|------|
| 복지로 | bokjiro.go.kr | 지원금 데이터 소스 |
| 정부24 | gov.kr | 정부 서비스 소스 |
| 고용24 | work24.go.kr | 청년 취업 지원 |
| 온통청년 | youthcenter.go.kr | 청년 정책 |
| Cloudflare Pages | pages.cloudflare.com | 호스팅 플랫폼 |
| Cloudflare 대시보드 | dash.cloudflare.com | 배포·DNS 관리 |
| OpenNext 문서 | opennext.js.org/cloudflare | Next.js 어댑터 가이드 |
| Google Search Console | search.google.com/search-console | SEO 모니터링 |
| Google Analytics | analytics.google.com | 트래픽 분석 |
| Google AdSense | adsense.google.com | 수익화 |

### B. 월별 업데이트 캘린더

| 월 | 중점 콘텐츠 |
|----|------------|
| 1월 | 연말정산 가이드, 새해 변경 지원금 |
| 3월 | 국가장학금 1학기 신청, 청년 지원금 개편 |
| 6월 | 에너지바우처 하절기, 상반기 마감 정리 |
| 9월 | 국가장학금 2학기, 하반기 신규 지원금 |
| 11월 | 연말 마감 임박 지원금 총정리 |
| 수시 | 신규·변경·마감 지원금 즉시 업로드 |

### C. 비용 예산

| 항목 | 비용 | 주기 |
|------|------|------|
| 도메인 subsidea.kr | 약 15,000원 | 연간 |
| Cloudflare Pages 호스팅 | **무료** | - |
| Cloudflare Workers | **무료** (일 10만 요청 이하) | - |
| Cloudflare SSL·DDoS | **무료** | - |
| GitHub Actions | **무료** | - |
| Google Analytics | **무료** | - |
| Google Search Console | **무료** | - |
| Google AdSense | **무료** (수익 공유) | - |
| **총 비용** | **약 15,000원/년** | - |

### D. 기능별 플랫폼 지원 검증 결과

| 기능 | Cloudflare Pages | 비고 |
|------|:---:|------|
| GitHub 자동 배포 | ✅ | git push만으로 자동 빌드·배포 |
| Next.js 호스팅 | ✅ | OpenNext 어댑터 사용 (공식 권장) |
| 반응형 디자인 | ✅ | CSS/Tailwind 코드 레벨 구현 |
| Python 크롤링 | ✅ | GitHub Actions 조합으로 해결 |
| 자동 데이터 갱신 | ✅ | Actions → Deploy Hook → Pages 재빌드 |
| 무제한 대역폭 | ✅ | 무료 플랜 포함 |
| 무료 SSL | ✅ | 자동 발급·갱신 |
| 커스텀 도메인 | ✅ | subsidea.kr 연결 |
| 글로벌 CDN | ✅ | 300개+ 엣지 서버 |
| 구글 애드센스 | ✅ | 정적 HTML 스크립트 삽입 |
| PR 프리뷰 배포 | ✅ | 브랜치별 미리보기 URL 자동 생성 |
| DDoS 방어 | ✅ | Cloudflare 기본 포함 |

---

*본 기획안은 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*
*최종 수정: 2026-07-03 v2.0 — 배포 계획(섹션 8) 추가*
