# BDACS 신규 입사자 디지털 명함 온보딩

신규 입사자가 입사 코드(PIN)로 접속해 명함 정보를 입력·검수한 뒤 디지털 명함 미리보기를 확인하고, 제출 시 Google 스프레드시트에 저장되며 Slack 채널로 알림이 전송됩니다.

## 사용자 플로우

1. **입사 코드 입력** — HR에서 전달받은 PIN
2. **정보 입력** — 국/영문 이름, 휴대폰, `@bdacs.co.kr` 이메일, 직무
3. **자가 검수** — 입력 내용 및 명함 축소 미리보기 확인
4. **디지털 명함 완성** — BDACS 브랜드 명함 미리보기 후 제출
5. **제출 완료** — Google Sheets 저장 + Slack 알림

## 로컬 실행

```bash
npm install
cp .env.example .env.local
# .env.local 값 채우기
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `ONBOARDING_PIN` | O | 신규 입사자에게 전달할 입사 코드 |
| `GOOGLE_SHEET_ID` | O | 스프레드시트 ID (URL의 `/d/` 와 `/edit` 사이) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | O | 서비스 계정 JSON (base64 또는 원문) |
| `SLACK_WEBHOOK_URL` | O | Incoming Webhook URL |
| `NEXT_PUBLIC_SHEET_VIEW_URL` | X | Slack·운영용 시트 보기 링크 |

### Google Sheets 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. **Google Sheets API** 활성화
3. **서비스 계정** 생성 → JSON 키 다운로드
4. 새 Google 스프레드시트 생성
5. 스프레드시트 **공유** → 서비스 계정 이메일(`...@....iam.gserviceaccount.com`)을 **편집자**로 추가
6. 스프레드시트 ID를 `GOOGLE_SHEET_ID`에 설정
7. 서비스 계정 JSON을 base64로 인코딩해 `GOOGLE_SERVICE_ACCOUNT_JSON`에 설정:

```bash
base64 -i service-account.json | tr -d '\n' | pbcopy
```

첫 제출 시 아래 헤더가 자동 생성됩니다:

| 제출일시 | 국문이름 | 영문이름 | 휴대폰 | 이메일 | 직무 | 상태 |

### Slack Incoming Webhook 설정

1. [Slack API](https://api.slack.com/apps) → Create New App → From scratch
2. **Incoming Webhooks** 활성화 → Add New Webhook to Workspace
3. 명함 제작 요청용 채널 선택 → Webhook URL 복사
4. `SLACK_WEBHOOK_URL`에 붙여넣기
5. (선택) 시트 공유 링크를 `NEXT_PUBLIC_SHEET_VIEW_URL`에 설정

## Vercel 배포

1. GitHub에 푸시 후 [Vercel](https://vercel.com)에서 Import
2. **Environment Variables**에 `.env.example` 항목 모두 등록
3. Deploy 후 배포 URL + `ONBOARDING_PIN`을 신규 입사자에게 전달

## 운영 (총무행정팀)

- 신규 입사자에게 **앱 URL + 입사 코드** 전달
- 제출 시 Slack 채널 알림 확인 → Google 시트에서 상세 내역 확인 → 실물 명함 제작
- PIN 유출·퇴사 시 `ONBOARDING_PIN` 변경 후 Vercel 환경변수 업데이트

## 명함 디자인 커스터마이즈

인쇄용 시안(Figma/PDF/PNG)을 받으면 `components/DigitalNamecard.tsx`와 `public/assets/namecard/`를 시안에 맞게 수정합니다. 현재는 BDACS 메일 서명 브랜드 색·로고를 기준으로 한 플레이스홀더 레이아웃입니다.

## 기술 스택

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- react-hook-form + zod
- Google Sheets API (googleapis)
- Slack Incoming Webhook
