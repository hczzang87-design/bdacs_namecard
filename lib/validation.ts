import { z } from "zod";

export const onboardingSchema = z.object({
  nameKo: z
    .string()
    .min(1, "국문 이름을 입력해 주세요.")
    .max(50, "국문 이름은 50자 이내로 입력해 주세요."),
  nameEn: z
    .string()
    .min(1, "영문 이름을 입력해 주세요.")
    .max(80, "영문 이름은 80자 이내로 입력해 주세요."),
  phone: z
    .string()
    .min(1, "휴대폰 번호를 입력해 주세요.")
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 13;
      },
      { message: "올바른 휴대폰 번호를 입력해 주세요." },
    ),
  email: z
    .string()
    .min(1, "이메일을 입력해 주세요.")
    .email("올바른 이메일 형식이 아닙니다.")
    .refine((val) => val.endsWith("@bdacs.co.kr"), {
      message: "BDACS 이메일(@bdacs.co.kr)을 사용해 주세요.",
    }),
  jobTitle: z
    .string()
    .min(1, "직무명을 입력해 주세요.")
    .max(80, "직무명은 80자 이내로 입력해 주세요."),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("82")) {
    const rest = digits.slice(2);
    if (rest.length === 10) {
      return `+82 ${rest.slice(0, 2)} ${rest.slice(2, 6)} ${rest.slice(6)}`;
    }
  }
  if (digits.length === 11 && digits.startsWith("010")) {
    return `+82 ${digits.slice(1, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10 && digits.startsWith("10")) {
    return `+82 ${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }
  return phone.trim();
}
