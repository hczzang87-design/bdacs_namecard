import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, SESSION_VALUE } from "@/lib/session";

export async function POST(request: Request) {
  const body = (await request.json()) as { pin?: string };
  const pin = body.pin?.trim();

  if (!pin) {
    return NextResponse.json({ error: "PIN을 입력해 주세요." }, { status: 400 });
  }

  const expectedPin = process.env.ONBOARDING_PIN;
  if (!expectedPin) {
    return NextResponse.json(
      { error: "서버 설정이 완료되지 않았습니다." },
      { status: 500 },
    );
  }

  if (pin !== expectedPin) {
    return NextResponse.json(
      { error: "입사 코드가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return response;
}
