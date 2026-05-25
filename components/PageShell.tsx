import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-background-alternative to-background-normal min-h-full">
      <div className="w-full max-w-lg">
        <header className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest text-sub-heavy uppercase mb-2">
            BDACS Onboarding
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-label-strong">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-label-neutral text-sm md:text-base">{description}</p>
          )}
        </header>
        {children}
      </div>
    </main>
  );
}
