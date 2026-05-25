# 이 Mac에서 작업 이어가기

이 문서는 다른 PC에서 이관된 **BDACS 명함 온보딩** 프로젝트를 이 환경에서 바로 개발할 수 있도록 정리한 것입니다.

## 현재 상태 (이 Mac 기준)

| 항목 | 상태 |
|------|------|
| 구현 코드 (`app/`, `components/`, `lib/`) | 이관 완료 |
| `npm install` / `npm run build` | 성공 확인됨 |
| `.env.example`, `.gitignore` | 추가됨 (이관 시 누락되어 있었음) |
| Git 저장소 | 없음 — 필요 시 아래 «Git 초기화» 참고 |
| `.env.local` | **직접 생성 필요** (팀 비밀값) |

프로젝트 경로: `/Users/tori/Desktop/Cursor_coding/Namecard_onboarding`

## 1. 환경 변수 설정 (필수)

```bash
cd /Users/tori/Desktop/Cursor_coding/Namecard_onboarding
cp .env.example .env.local
```

`.env.local`에 아래 값을 채웁니다. (이전 PC의 `.env.local`이 있다면 그대로 복사해도 됩니다.)

| 변수 | 설명 |
|------|------|
| `ONBOARDING_PIN` | 신규 입사자 입사 코드 |
| `GOOGLE_SHEET_ID` | 스프레드시트 ID |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | 서비스 계정 JSON (base64 또는 원문) |
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook |
| `NEXT_PUBLIC_SHEET_VIEW_URL` | (선택) 시트 보기 URL |

상세 셋업: [README.md](./README.md)

## 2. 개발 서버 실행

```bash
npm run dev
```

브라우저: http://localhost:3000

### UI·제출 완료 화면 미리보기

`ONBOARDING_PIN`만 있고 Google 시트 설정이 비어 있으면, **개발 서버(`npm run dev`)에서 제출하기를 눌러도** 제출 완료 화면까지 볼 수 있습니다. (시트·Slack에는 저장되지 않으며, 완료 화면에 노란 안내 문구가 표시됩니다.)

실제 시트/Slack 연동 테스트는 `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON`, `SLACK_WEBHOOK_URL`을 채운 뒤 서버를 재시작하세요.

## 3. E2E 테스트 체크리스트

환경 변수를 모두 채운 뒤:

1. `/` — PIN 입력 → `/onboarding` 이동
2. 1단계 정보 입력 → 검수 → 완료 화면
3. 제출 → Google 시트에 행 추가 확인
4. Slack 채널 알림 확인 (시트 저장 **성공 후에만** Slack 전송)

## 4. 사용자 플로우 (참고)

```
/ (PIN) → /onboarding → /onboarding/review → /onboarding/complete (제출)
```

- PIN 통과 시 `onboarding_session` httpOnly 쿠키 (24시간)
- 폼 데이터는 `sessionStorage` (`lib/onboarding-storage.ts`)
- 이메일: `@bdacs.co.kr` 만 허용

## 5. 다음에 할 일 (우선순위)

1. **`.env.local` 설정** 후 위 E2E 테스트
2. **인쇄 시안 반영** — `components/DigitalNamecard.tsx`, `public/assets/namecard/`
3. **Vercel 배포** — README «Vercel 배포» 섹션
4. (2차) 중복 제출 방지, Google SSO, 관리자 대시보드

## 6. Git 초기화 (선택)

현재 이 폴더에는 `.git`이 없습니다. 버전 관리를 쓰려면:

```bash
git init
git add .
git commit -m "feat: BDACS 명함 온보딩 도구 구현"
# 원격이 있으면
git remote add origin <저장소 URL>
git push -u origin main
```

## 7. 핵심 파일 위치

| 역할 | 경로 |
|------|------|
| PIN API | `app/api/auth/pin/route.ts` |
| 제출 API | `app/api/submit/route.ts` |
| 라우트 보호 | `middleware.ts` |
| 명함 UI (시안 수정) | `components/DigitalNamecard.tsx` |
| 시트 연동 | `lib/sheets.ts` |
| Slack | `lib/slack.ts` |
