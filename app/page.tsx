import { redirect } from "next/navigation";
import { hasValidSession } from "@/lib/session";
import { PageShell } from "@/components/PageShell";
import { PinForm } from "@/components/PinForm";

export default async function HomePage() {
  if (await hasValidSession()) {
    redirect("/onboarding");
  }

  return (
    <PageShell
      title="디지털 명함 만들기"
      description="BDACS에 오신 것을 환영합니다. 입사 코드를 입력하고 나만의 명함 정보를 등록해 보세요."
    >
      <PinForm />
    </PageShell>
  );
}
