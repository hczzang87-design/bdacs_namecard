# BDACS 명함 온보딩 — 작업 이관 (Compact)

> 다른 PC에서 작업을 이어갈 때 **이 문서만** 먼저 읽으면 됩니다.  
> 상세 셋업·연동: [README.md](./README.md)

**최종 갱신**: 2026-05-25  
**Git**: https://github.com/hczzang87-design/bdacs_namecard.git (`main`)

---

## 1. 프로젝트 한 줄 요약

신규 입사자가 **PIN → 정보 입력 → 검수 → 제출** 후, **자신의 BDACS 명함**을 정면 3D 연출로 확인하는 온보딩 웹앱.  
제출 데이터는 **Google Sheets** 저장 후 **Slack** 알림 (시트 실패 시 Slack 미전송).

---

## 2. 다른 PC에서 시작하기 (권장: Git clone)

```bash
git clone https://github.com/hczzang87-design/bdacs_namecard.git
cd bdacs_namecard
npm install
cp .env.example .env.local
# .env.local 값 채우기 (아래 표)
npm run dev
```

→ http://localhost:3000

`.env.local`은 **Git에 없음**. 이전 PC 파일을 USB/메신저로 복사하거나, 팀에서 값을 다시 받아야 합니다.

| 변수 | 필수 | 설명 |
|------|------|------|
| `ONBOARDING_PIN` | O | 입사 코드 (로컬 테스트 예: `0000`) |
| `GOOGLE_SHEET_ID` | O* | 스프레드시트 ID |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | O* | 서비스 계정 JSON (base64 또는 원문) |
| `SLACK_WEBHOOK_URL` | O* | Slack Incoming Webhook |
| `NEXT_PUBLIC_SHEET_VIEW_URL` | X | Slack·운영용 시트 링크 |

\* 없으면 개발 서버에서 **제출 완료·명함 reveal 연출만** 가능 (mock). 시트·Slack에는 저장 안 됨.

---

## 3. 사용자 플로우 (현재 구현)

```
/ (PIN)
  → /onboarding (정보 입력, sessionStorage)
  → /onboarding/review (검수 + 작은 명함 미리보기)
  → /onboarding/complete
       ① 제출 전: 입력 요약 + [다시 검수] [제출하기]
       ② 제출 중: 로딩 (~1.4초 이상)
       ③ 제출 후: 어두운 화면 + 정면 3D 플로팅 명함 reveal + 완료 문구
```

- PIN 통과: httpOnly 쿠키 `onboarding_session` (24시간), `middleware.ts`가 `/onboarding`, `/api/submit` 보호
- 이메일: `@bdacs.co.kr` 만 허용 (`lib/validation.ts`)
- 제출 순서: Sheets append 성공 → Slack (`app/api/submit/route.ts`)

---

## 4. 구현 완료 / 미완

| 기능 | 상태 | 비고 |
|------|------|------|
| PIN 인증 | ✅ | `app/api/auth/pin/route.ts` |
| 3단계 UI + zod 검증 | ✅ | |
| sessionStorage 단계 유지 | ✅ | `lib/onboarding-storage.ts` |
| Google Sheets + Slack | ✅ | `.env` 연동 필요 |
| 로컬 mock 제출 | ✅ | 시트 미설정 시 `lib/submit-mock.ts` |
| PDF 명함 시안 (85×55mm) | ✅ 1차 | `public/assets/namecard/front.png`, `back.png` |
| 제출 후 3D reveal | ✅ | `components/NamecardReveal.tsx` |
| DS v0.3 (Pretendard, Primary 등) | ✅ 1차 | `app/globals.css`, 버튼·StepIndicator |
| Vercel 배포 | ⬜ | README 배포 섹션 참고 |
| 명함 픽셀 퍼펙트 / Figma 정밀 맞춤 | ⬜ | 시안·좌표 보완 필요 |
| 중복 제출 방지, SSO, 관리자 | ⬜ | 2차 |

---

## 5. 핵심 파일 맵

| 역할 | 경로 |
|------|------|
| PIN API | `app/api/auth/pin/route.ts` |
| 제출 API | `app/api/submit/route.ts` |
| 라우트 보호 | `middleware.ts` |
| 3단계 — 제출·reveal | `app/onboarding/complete/page.tsx` |
| 검수 미리보기 (작게) | `components/DigitalNamecard.tsx` |
| 제출 후 3D 명함 | `components/NamecardReveal.tsx` |
| 명함 PNG 시안 | `public/assets/namecard/` |
| mock 제출 판별 | `lib/submit-mock.ts` |
| 시트 / Slack | `lib/sheets.ts`, `lib/slack.ts` |
| 환경변수 템플릿 | `.env.example` |

**디자인 시스템 참고 (외부)**  
`/Users/tori/Desktop/ux_autopilot/ux_design_system_v0.3.md` — 레포에는 미포함, 필요 시 별도 복사.

---

## 6. UX·제품 방향 (기억할 것)

1. **핵심 경험**: 제출 **후** 프로세싱 → **정면** 3D 플로팅 명함 등장 (위/아래 시점 X).
2. **주의**: 인쇄 그대로 반영 → 검수·제출 전 정확도 안내.
3. **운영**: 시트 한 줄 + Slack → 총무행정팀 → UX 제작 리소스.

`PageShell` = 페이지 제목·설명 껍데기. `StepIndicator` = 상단 ①②③.  
3단계 **reveal** 화면에서는 몰입을 위해 둘 다 **숨김**.

---

## 7. 로컬 빠른 테스트

1. `.env.local`에 `ONBOARDING_PIN=0000`만 설정
2. `npm run dev` → PIN `0000` → 입력 → 검수 → **제출하기**
3. 로딩 후 명함 reveal + 완료 문구 (mock 안내 노란 박스)

실제 시트/Slack 테스트: 4개 변수 모두 채운 뒤 서버 재시작.

---

## 8. Git

```bash
git pull origin main
```

- **올리지 말 것**: `.env.local`, `node_modules`, `.next`
- 최초 업로드 커밋: `feat: BDACS 신규 입사자 명함 온보딩 앱 구현`

---

## 9. 다음 작업 우선순위

1. `.env.local` 실연동 E2E (PIN → 제출 → 시트·Slack)
2. 명함 시안 정밀화 (`NamecardReveal` / PNG 또는 Figma 좌표)
3. Vercel 배포 + 환경변수
4. (2차) 중복 제출 방지, reveal 연출 미세 조정

---

## 10. 트러블슈팅

| 증상 | 해결 |
|------|------|
| CSS `@import` 파싱 오류 | Pretendard는 `app/layout.tsx` `<link>` 로 로드 (globals.css `@import url` 사용 금지) |
| 제출 실패 | `.env.local` 시트/Slack 확인, dev 서버 재시작 |
| `/onboarding/complete` 바로 리다이렉트 | `sessionStorage` 없음 → 1·2단계부터 다시 |
| 포트 충돌 | `lsof -i :3000` 후 기존 `next dev` 종료 |

문의·핸드오프 업데이트 시 이 파일과 `README.md`를 함께 수정하세요.
