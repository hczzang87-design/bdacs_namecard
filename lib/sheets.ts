import { google } from "googleapis";
import type { OnboardingFormData } from "./validation";
import { normalizePhone } from "./validation";

function getServiceAccountCredentials(): Record<string, unknown> {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not configured.");
  }

  try {
    const decoded = Buffer.from(raw, "base64").toString("utf-8");
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return JSON.parse(raw) as Record<string, unknown>;
  }
}

export async function appendToSheet(
  data: OnboardingFormData,
): Promise<{ rowNumber: number }> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is not configured.");
  }

  const credentials = getServiceAccountCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const submittedAt = new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  const phone = normalizePhone(data.phone);

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "A:G",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          submittedAt,
          data.nameKo,
          data.nameEn,
          phone,
          data.email,
          data.jobTitle,
          "제출완료",
        ],
      ],
    },
  });

  const updatedRange = response.data.updates?.updatedRange ?? "";
  const match = updatedRange.match(/(\d+)$/);
  const rowNumber = match ? parseInt(match[1], 10) : 0;

  return { rowNumber };
}

export async function ensureSheetHeaders(): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheetId) return;

  const credentials = getServiceAccountCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "A1:G1",
  });

  if (existing.data.values?.length) return;

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: "A1:G1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          "제출일시",
          "국문이름",
          "영문이름",
          "휴대폰",
          "이메일",
          "직무",
          "상태",
        ],
      ],
    },
  });
}
