import { cookies } from "next/headers";

export const SESSION_COOKIE = "onboarding_session";
export const SESSION_VALUE = "authenticated";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function hasValidSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === SESSION_VALUE;
}
