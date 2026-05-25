"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { StepIndicator } from "@/components/StepIndicator";
import { NamecardReveal } from "@/components/NamecardReveal";
import {
  loadOnboardingData,
  clearOnboardingData,
} from "@/lib/onboarding-storage";
import type { OnboardingFormData } from "@/lib/validation";

type Phase = "confirm" | "submitting" | "reveal";

const MIN_SUBMIT_MS = 1400;

function minDelay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function CompletePage() {
  const router = useRouter();
  const [data, setData] = useState<OnboardingFormData | null>(null);
  const [phase, setPhase] = useState<Phase>("confirm");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPreviewSubmit, setIsPreviewSubmit] = useState(false);
  const [showSuccessCopy, setShowSuccessCopy] = useState(false);

  useEffect(() => {
    const saved = loadOnboardingData();
    if (!saved) {
      router.replace("/onboarding");
      return;
    }
    setData(saved);
  }, [router]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => setShowSuccessCopy(true), 900);
    return () => clearTimeout(t);
  }, [phase]);

  async function handleSubmit() {
    if (!data || phase === "submitting") return;
    setErrorMessage("");
    setPhase("submitting");

    try {
      const [res] = await Promise.all([
        fetch("/api/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }),
        minDelay(MIN_SUBMIT_MS),
      ]);

      const result = (await res.json()) as { error?: string; mock?: boolean };

      if (!res.ok) {
        setErrorMessage(
          result.error ?? "제출에 실패했습니다. 다시 시도해 주세요.",
        );
        setPhase("confirm");
        return;
      }

      setIsPreviewSubmit(Boolean(result.mock));
      clearOnboardingData();
      setPhase("reveal");
    } catch {
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      setPhase("confirm");
    }
  }

  if (!data) {
    return (
      <PageShell title="명함 제출" description="불러오는 중…">
        <div className="h-48 animate-pulse rounded-lg bg-background-alternative" />
      </PageShell>
    );
  }

  if (phase === "submitting") {
    return (
      <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-background-alternative px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <div
            className="reveal-spinner h-12 w-12 rounded-full border-[3px] border-line-normal border-t-primary"
            aria-hidden
          />
          <div>
            <p className="text-lg font-semibold text-label-strong">
              명함을 완성하고 있습니다
            </p>
            <p className="mt-2 text-sm text-label-neutral">
              입력하신 정보를 안전하게 전달하는 중입니다…
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (phase === "reveal") {
    return (
      <main className="relative flex min-h-full flex-1 flex-col bg-[#1a1a1f] px-4 py-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(178,18,89,0.12)_0%,transparent_55%)]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center">
          <p
            className={`mb-8 text-center text-sm font-medium tracking-wide text-static-white/70 transition-opacity duration-500 ${showSuccessCopy ? "opacity-100" : "opacity-0"}`}
          >
            BDACS ONBOARDING
          </p>

          <NamecardReveal data={data} playEntrance />

          <div
            className={`mt-10 max-w-sm text-center transition-all duration-700 ${showSuccessCopy ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          >
            <h1 className="text-xl font-bold text-static-white md:text-2xl">
              제출이 완료되었습니다
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-static-white/75">
              아래가 곧 제작될 당신의 BDACS 명함입니다.
              <br />
              총무행정팀에 정보가 전달되었으며, 실물 명함 제작이 진행됩니다.
            </p>
            {isPreviewSubmit && (
              <p className="mt-4 rounded-lg border border-[#ffaa33]/40 bg-[#ffaa33]/15 px-3 py-2 text-xs text-static-white/90">
                로컬 미리보기: Google 시트·Slack에는 저장되지 않았습니다.
              </p>
            )}
            <p className="mt-6 text-xs text-static-white/50">
              BDACS의 새로운 동료가 되신 것을 진심으로 환영합니다.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <PageShell
      title="명함 정보 제출"
      description="제출하시면 BDACS 명함이 완성됩니다. 인쇄에 그대로 반영되므로 아래 내용을 다시 한번 확인해 주세요."
    >
      <StepIndicator current={3} />

      <div className="mb-6 rounded-lg border border-line-normal bg-background-normal p-5">
        <dl className="divide-y divide-line-normal">
          {[
            ["이름 (국문)", data.nameKo],
            ["이름 (영문)", data.nameEn],
            ["직무", data.jobTitle],
            ["휴대폰", data.phone],
            ["이메일", data.email],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-4"
            >
              <dt className="shrink-0 text-sm font-medium text-label-neutral sm:w-28">
                {label}
              </dt>
              <dd className="text-sm font-semibold text-label-strong">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mb-6 rounded-lg bg-background-alternative px-4 py-3 text-sm text-label-neutral">
        제출 후에는 인쇄용 명함에 동일하게 반영됩니다. 철자·이메일·직무명이
        정확한지 꼭 확인해 주세요.
      </p>

      {errorMessage && (
        <p
          className="mb-4 text-center text-sm text-status-negative"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => router.push("/onboarding/review")}
          className="flex-1 rounded-lg border border-sub-heavy bg-background-normal py-3 text-sm font-medium text-sub-heavy transition-colors hover:bg-background-alternative"
        >
          다시 검수
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 rounded-lg bg-primary py-3 text-sm font-medium text-static-white transition-colors hover:bg-primary-heavy"
        >
          제출하기
        </button>
      </div>
    </PageShell>
  );
}
