interface ProgressRingProps {
  value: number;
  label: string;
}

export function ProgressRing({ value, label }: ProgressRingProps) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div className="progress-ring" aria-label={`${label} ${normalized}%`}>
      <span>{normalized}%</span>
    </div>
  );
}
