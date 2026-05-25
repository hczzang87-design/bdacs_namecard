"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function PinFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/onboarding";
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "인증에 실패했습니다.");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label
          htmlFor="pin"
          className="block text-sm font-medium text-[#061235] mb-2"
        >
          입사 코드
        </label>
        <input
          id="pin"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="HR에서 안내받은 코드 입력"
          className="w-full rounded-lg border border-[#d4d4d4] px-4 py-3 text-[#061235] placeholder:text-[#a4a2a2] focus:outline-none focus:ring-2 focus:ring-[#293377]/30 focus:border-[#293377]"
          autoComplete="off"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !pin.trim()}
        className="w-full rounded-lg bg-[#061235] text-white py-3 font-medium hover:bg-[#293377] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "확인 중…" : "시작하기"}
      </button>
    </form>
  );
}

export function PinForm() {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse bg-[#f5f5f5] rounded-lg" />}>
      <PinFormInner />
    </Suspense>
  );
}
