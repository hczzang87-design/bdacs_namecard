import { PageShell } from "@/components/PageShell";
import { StepIndicator } from "@/components/StepIndicator";
import { OnboardingForm } from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <PageShell
      title="명함 정보 입력"
      description="실물 명함에 인쇄될 정보를 정확히 입력해 주세요."
    >
      <StepIndicator current={1} />
      <OnboardingForm />
    </PageShell>
  );
}
