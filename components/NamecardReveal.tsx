"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { OnboardingFormData } from "@/lib/validation";
import { normalizePhone } from "@/lib/validation";

const CARD_ASPECT = "85 / 55";

type NamecardRevealProps = {
  data: OnboardingFormData;
  playEntrance?: boolean;
};

export function NamecardReveal({
  data,
  playEntrance = true,
}: NamecardRevealProps) {
  const [showBack, setShowBack] = useState(true);
  const [entered, setEntered] = useState(!playEntrance);
  const [floating, setFloating] = useState(false);
  const phone = normalizePhone(data.phone);

  useEffect(() => {
    if (!playEntrance) {
      setFloating(true);
      return;
    }
    const enterId = requestAnimationFrame(() => setEntered(true));
    const floatTimer = setTimeout(() => setFloating(true), 700);
    return () => {
      cancelAnimationFrame(enterId);
      clearTimeout(floatTimer);
    };
  }, [playEntrance]);

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="namecard-scene w-full max-w-[min(100%,420px)]"
        style={{ aspectRatio: CARD_ASPECT }}
      >
        <div
          className={`namecard-float-wrap relative h-full w-full ${entered ? "namecard-entered" : ""} ${floating ? "namecard-float-active" : ""}`}
        >
          <div
            className="namecard-flipper relative h-full w-full"
            style={{
              transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <div className="namecard-face absolute inset-0 overflow-hidden rounded-[6px] shadow-2xl">
              <Image
                src="/assets/namecard/front.png"
                alt="BDACS 명함 앞면"
                fill
                className="object-cover"
                sizes="420px"
                priority
              />
            </div>

            <div
              className="namecard-face absolute inset-0 overflow-hidden rounded-[6px] shadow-2xl"
              style={{ transform: "rotateY(180deg)" }}
            >
              <Image
                src="/assets/namecard/back.png"
                alt=""
                fill
                className="object-cover"
                sizes="420px"
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 h-[38%] bg-white" />
              <div className="absolute inset-x-0 bottom-0 flex h-[38%] items-end justify-between px-[6%] pb-[6%]">
                <div className="max-w-[58%]">
                  <p className="text-base font-bold leading-tight text-label-strong md:text-lg">
                    {data.nameKo}{" "}
                    <span className="font-semibold">{data.nameEn}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-label-neutral">
                    {data.jobTitle}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium tabular-nums text-label-strong">
                    {phone}
                  </p>
                  <p className="mt-0.5 ml-auto max-w-[150px] break-all text-[10px] text-label-strong md:text-xs">
                    {data.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => setShowBack(false)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            !showBack
              ? "bg-primary text-static-white"
              : "border border-sub-heavy bg-background-normal text-label-normal hover:bg-background-alternative"
          }`}
        >
          앞면
        </button>
        <button
          type="button"
          onClick={() => setShowBack(true)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            showBack
              ? "bg-primary text-static-white"
              : "border border-sub-heavy bg-background-normal text-label-normal hover:bg-background-alternative"
          }`}
        >
          뒷면
        </button>
      </div>
    </div>
  );
}
