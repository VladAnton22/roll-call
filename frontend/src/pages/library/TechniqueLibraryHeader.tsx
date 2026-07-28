interface TechniqueLibraryHeaderProps {
  ratedCount: number;
  total: number;
}

export default function TechniqueLibraryHeader({
  ratedCount,
  total,
}: TechniqueLibraryHeaderProps) {
  return (
    <div className="mb-6">
      <div className="max-w-2xl mb-2 flex justify-between gap-4">
        <h1 className="text-2xl font-black tracking-tight text-content-primary mb-1">
          Technique Library
        </h1>
        <div className="flex items-center gap-2 bg-surface-elevated border border-chrome-strong rounded-full px-3 py-1.5">
          <div className="w-20 h-1.5 bg-chrome rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-subtle rounded-full transition-all duration-500"
              style={{ width: `${(ratedCount / total) * 100}%` }}
            />
          </div>
          <span className="text-xs text-content-muted tabular-nums font-medium">
            {ratedCount}/{total}
          </span>
        </div>
      </div>
      <p className="text-sm text-content-subtle">
        Tap any technique to rate it. Score = Rating (1-5) + Confidence (L/M/H).
      </p>
    </div>
  );
}
