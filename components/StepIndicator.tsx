const STEPS = [
  { id: 1, label: "정보 입력" },
  { id: 2, label: "검수" },
  { id: 3, label: "명함 완성" },
] as const;

type StepIndicatorProps = {
  current: 1 | 2 | 3;
};

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <nav aria-label="진행 단계" className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, index) => {
        const isActive = step.id === current;
        const isDone = step.id < current;
        return (
          <div key={step.id} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={`w-8 h-px ${isDone || isActive ? "bg-primary" : "bg-line-normal"}`}
              />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive ? "bg-primary text-static-white" : ""}
                  ${isDone ? "bg-sub-normal text-static-white" : ""}
                  ${!isActive && !isDone ? "bg-background-alternative text-label-assistive" : ""}
                `}
              >
                {isDone ? "✓" : step.id}
              </div>
              <span
                className={`text-xs ${isActive ? "text-label-strong font-medium" : "text-label-assistive"}`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
