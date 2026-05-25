"use client";

import Image from "next/image";
import type { OnboardingFormData } from "@/lib/validation";
import { normalizePhone } from "@/lib/validation";

/** 인쇄 시안: 85mm × 55mm */
const CARD_ASPECT = "85 / 55";

type DigitalNamecardProps = {
  data: OnboardingFormData;
  size?: "default" | "compact";
  animate?: boolean;
  /** 완료 화면 등에서 앞·뒤 모두 표시 */
  showBothSides?: boolean;
};

function CardFrame({
  label,
  children,
  isCompact,
}: {
  label?: string;
  children: React.ReactNode;
  isCompact: boolean;
}) {
  return (
    <div className={isCompact ? "w-full max-w-[340px]" : "w-full max-w-[510px]"}>
      {label && (
        <p className="text-xs font-medium text-[#666] mb-2 tracking-wide">{label}</p>
      )}
      <div
        className="relative w-full overflow-hidden rounded-sm shadow-lg ring-1 ring-black/5"
        style={{ aspectRatio: CARD_ASPECT }}
      >
        {children}
      </div>
    </div>
  );
}

function NamecardFront({ isCompact }: { isCompact: boolean }) {
  return (
    <Image
      src="/assets/namecard/front.png"
      alt="BDACS 명함 앞면"
      fill
      className="object-cover"
      sizes={isCompact ? "340px" : "510px"}
      priority
    />
  );
}

function NamecardBack({
  data,
  isCompact,
}: {
  data: OnboardingFormData;
  isCompact: boolean;
}) {
  const phone = normalizePhone(data.phone);

  return (
    <>
      <Image
        src="/assets/namecard/back.png"
        alt=""
        fill
        className="object-cover"
        sizes={isCompact ? "340px" : "510px"}
        aria-hidden
      />
      {/* 하단 샘플 인명·연락처 영역을 덮고 입력값 표시 */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-white" />
      <div
        className={`absolute inset-x-0 bottom-0 flex items-end justify-between ${
          isCompact ? "px-[5%] pb-[5%]" : "px-[6%] pb-[6%]"
        } h-[38%]`}
      >
        <div className="max-w-[58%]">
          <p
            className={`font-bold text-[#1a1a1a] leading-tight ${
              isCompact ? "text-sm" : "text-base md:text-lg"
            }`}
          >
            {data.nameKo}{" "}
            <span className="font-semibold">{data.nameEn}</span>
          </p>
          <p
            className={`text-[#888] mt-0.5 ${
              isCompact ? "text-[10px]" : "text-xs"
            }`}
          >
            {data.jobTitle}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className={`font-medium text-[#1a1a1a] tabular-nums ${
              isCompact ? "text-[10px]" : "text-xs"
            }`}
          >
            {phone}
          </p>
          <p
            className={`text-[#1a1a1a] mt-0.5 break-all max-w-[140px] ml-auto ${
              isCompact ? "text-[9px]" : "text-[10px] md:text-xs"
            }`}
          >
            {data.email}
          </p>
        </div>
      </div>
    </>
  );
}

export function DigitalNamecard({
  data,
  size = "default",
  animate = false,
  showBothSides = false,
}: DigitalNamecardProps) {
  const isCompact = size === "compact";

  const wrapperClass = [
    "flex flex-col items-center gap-6 w-full",
    animate ? "animate-card-reveal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (showBothSides) {
    return (
      <div className={wrapperClass}>
        <CardFrame label="앞면" isCompact={isCompact}>
          <NamecardFront isCompact={isCompact} />
        </CardFrame>
        <CardFrame label="뒷면 (입력 정보 반영)" isCompact={isCompact}>
          <NamecardBack data={data} isCompact={isCompact} />
        </CardFrame>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <CardFrame isCompact={isCompact}>
        <NamecardBack data={data} isCompact={isCompact} />
      </CardFrame>
    </div>
  );
}
