import { NextResponse } from "next/server";
import { hasValidSession } from "@/lib/session";
import { appendToSheet, ensureSheetHeaders } from "@/lib/sheets";
import { notifySlack } from "@/lib/slack";
import { isMockSubmit } from "@/lib/submit-mock";
import { onboardingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!(await hasValidSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값이 올바르지 않습니다.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    if (isMockSubmit()) {
      console.info(
        "[submit] 미리보기 모드: Google 시트·Slack 연동 없이 성공 응답",
      );
      return NextResponse.json({ ok: true, rowNumber: 0, mock: true });
    }

    await ensureSheetHeaders();
    const { rowNumber } = await appendToSheet(parsed.data);
    await notifySlack(parsed.data, rowNumber);
    return NextResponse.json({ ok: true, rowNumber });
  } catch (error) {
    console.error("Submit failed:", error);
    const message =
      error instanceof Error ? error.message : "제출 중 오류가 발생했습니다.";
    return NextResponse.json(
      {
        error:
          "제출에 실패했습니다. 잠시 후 다시 시도해 주세요. 문제가 계속되면 총무행정팀에 문의해 주세요.",
        detail: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}
