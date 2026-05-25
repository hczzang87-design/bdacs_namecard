import type { OnboardingFormData } from "./validation";

export const STORAGE_KEY = "bdacs-onboarding";

export function saveOnboardingData(data: OnboardingFormData): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadOnboardingData(): OnboardingFormData | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingFormData;
  } catch {
    return null;
  }
}

export function clearOnboardingData(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
