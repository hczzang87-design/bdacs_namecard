"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  onboardingSchema,
  type OnboardingFormData,
} from "@/lib/validation";
import { saveOnboardingData, loadOnboardingData } from "@/lib/onboarding-storage";

const inputClass =
  "w-full rounded-lg border border-[#d4d4d4] px-4 py-3 text-[#061235] placeholder:text-[#a4a2a2] focus:outline-none focus:ring-2 focus:ring-[#293377]/30 focus:border-[#293377]";

export function OnboardingForm() {
  const router = useRouter();
  const saved = loadOnboardingData();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: saved ?? {
      nameKo: "",
      nameEn: "",
      phone: "",
      email: "",
      jobTitle: "",
    },
  });

  function onSubmit(data: OnboardingFormData) {
    saveOnboardingData(data);
    router.push("/onboarding/review");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="이름 (국문)" error={errors.nameKo?.message}>
        <input
          {...register("nameKo")}
          placeholder="홍길동"
          className={inputClass}
        />
      </Field>

      <Field label="이름 (영문)" error={errors.nameEn?.message}>
        <input
          {...register("nameEn")}
          placeholder="Gil-dong Hong"
          className={inputClass}
        />
      </Field>

      <Field label="휴대폰 번호" error={errors.phone?.message}>
        <input
          {...register("phone")}
          type="tel"
          placeholder="010-1234-5678"
          className={inputClass}
        />
      </Field>

      <Field label="이메일" error={errors.email?.message}>
        <input
          {...register("email")}
          type="email"
          placeholder="name@bdacs.co.kr"
          className={inputClass}
        />
      </Field>

      <Field label="직무명" error={errors.jobTitle?.message}>
        <input
          {...register("jobTitle")}
          placeholder="UX Designer"
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        className="w-full rounded-lg bg-[#061235] text-white py-3 font-medium hover:bg-[#293377] transition-colors mt-6"
      >
        다음: 정보 검수
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#061235] mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
