"use client";

import type { OnboardingFormData } from "@/lib/validation";
import { normalizePhone } from "@/lib/validation";
import { DigitalNamecard } from "./DigitalNamecard";

type ReviewSummaryProps = {
  data: OnboardingFormData;
};

export function ReviewSummary({ data }: ReviewSummaryProps) {
  const phone = normalizePhone(data.phone);

  const rows = [
    { label: "이름 (국문)", value: data.nameKo },
    { label: "이름 (영문)", value: data.nameEn },
    { label: "휴대폰", value: phone },
    { label: "이메일", value: data.email },
    { label: "직무", value: data.jobTitle },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#e8e8e8] bg-[#fafafa] divide-y divide-[#e8e8e8]">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-1 sm:gap-4"
          >
            <dt className="text-sm font-medium text-[#666] sm:w-28 shrink-0">
              {row.label}
            </dt>
            <dd className="text-[#061235] font-medium">{row.value}</dd>
          </div>
        ))}
      </div>

      <div>
        <p className="text-sm text-[#666] mb-3">명함 미리보기</p>
        <div className="flex justify-center">
          <DigitalNamecard data={data} size="compact" />
        </div>
      </div>
    </div>
  );
}
