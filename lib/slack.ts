import type { OnboardingFormData } from "./validation";
import { normalizePhone } from "./validation";

export async function notifySlack(
  data: OnboardingFormData,
  rowNumber?: number,
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("SLACK_WEBHOOK_URL is not configured.");
  }

  const phone = normalizePhone(data.phone);
  const sheetUrl = process.env.NEXT_PUBLIC_SHEET_VIEW_URL;
  const sheetLine = sheetUrl
    ? `\n• 시트: <${sheetUrl}|Google 스프레드시트 열기>${rowNumber ? ` (행 ${rowNumber})` : ""}`
    : rowNumber
      ? `\n• 시트 행: ${rowNumber}`
      : "";

  const text = [
    "*[명함 온보딩] 신규 입사자 정보 제출*",
    `• 이름: ${data.nameKo} / ${data.nameEn}`,
    `• 직무: ${data.jobTitle}`,
    `• 연락처: ${phone}`,
    `• 이메일: ${data.email}`,
    sheetLine,
    "",
    "_실물 명함 제작을 진행해 주세요._",
  ].join("\n");

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Slack webhook failed: ${response.status} ${body}`);
  }
}
