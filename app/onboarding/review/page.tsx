"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { StepIndicator } from "@/components/StepIndicator";
import { ReviewSummary } from "@/components/ReviewSummary";
import { loadOnboardingData } from "@/lib/onboarding-storage";
import type { OnboardingFormData } from "@/lib/validation";

export default function ReviewPage() {
  const router = useRouter();
  const [data, setData] = useState<OnboardingFormData | null>(null);

  useEffect(() => {
    const saved = loadOnboardingData();
    if (!saved) {
      router.replace("/onboarding");
      return;
    }
    setData(saved);
  }, [router]);

  if (!data) {
    return (
      <PageShell title="정보 검수" description="불러오는 중…">
        <div className="h-48 animate-pulse bg-[#f0f0f0] rounded-xl" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="정보 검수"
      description="아래 내용이 맞는지 확인해 주세요. 수정이 필요하면 이전 단계로 돌아갈 수 있습니다."
    >
      <StepIndicator current={2} />
      <ReviewSummary data={data} />
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          type="button"
          onClick={() => router.push("/onboarding")}
          className="flex-1 rounded-lg border border-[#d4d4d4] text-[#061235] py-3 font-medium hover:bg-[#f5f5f5] transition-colors"
        >
          수정하기
        </button>
        <button
          type="button"
          onClick={() => router.push("/onboarding/complete")}
          className="flex-1 rounded-lg bg-[#061235] text-white py-3 font-medium hover:bg-[#293377] transition-colors"
        >
          완료하고 명함 만들기
        </button>
      </div>
    </PageShell>
  );
}
