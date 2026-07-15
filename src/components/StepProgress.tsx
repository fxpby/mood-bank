type StepProgressProps = {
  value: string;
};

type ParsedStepProgress = {
  current: number;
  total: number;
  label: string;
};

export function StepProgress({ value }: StepProgressProps) {
  const progress = parseStepProgress(value);

  if (!progress) {
    return <span className="step-progress__fallback">{value}</span>;
  }

  const current = progress.current;

  return (
    <div
      className="step-progress"
      role="progressbar"
      aria-label={`第 ${current} 步，共 ${progress.total} 步：${progress.label}`}
      aria-valuemin={1}
      aria-valuemax={progress.total}
      aria-valuenow={current}
      aria-valuetext={`${current} / ${progress.total}，${progress.label}`}
    >
      <div className="step-progress__meta">
        <strong>{progress.label}</strong>
        <span>
          {current} / {progress.total}
        </span>
      </div>
      <div
        className="step-progress__track"
        style={{ gridTemplateColumns: `repeat(${progress.total}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {Array.from({ length: progress.total }, (_, index) => {
          const segmentStep = index + 1;
          const state =
            segmentStep < current ? "is-complete" : segmentStep === current ? "is-current" : "";

          return <span className={state} key={segmentStep} />;
        })}
      </div>
    </div>
  );
}

export function parseStepProgress(value: string): ParsedStepProgress | null {
  const match = value.trim().match(/^(\d+)\s*\/\s*(\d+)\s+(.+)$/);

  if (!match) return null;

  const current = Number(match[1]);
  const total = Number(match[2]);
  const label = match[3].trim();

  if (
    !Number.isInteger(current) ||
    !Number.isInteger(total) ||
    current < 1 ||
    total < 1 ||
    current > total ||
    !label
  ) {
    return null;
  }

  return { current, total, label };
}
