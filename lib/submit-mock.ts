/** 로컬·미리보기: 시트/Slack 없이 제출 완료 화면만 체험 */
export function isMockSubmit(): boolean {
  if (process.env.MOCK_SUBMIT === "true") return true;
  if (process.env.NODE_ENV !== "development") return false;
  const sheetId = process.env.GOOGLE_SHEET_ID?.trim();
  const serviceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  return !sheetId || !serviceAccount;
}
