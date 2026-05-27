interface TechniqueLibraryHeaderProps {
  ratedCount: number;
  total: number;
}

export default function TechniqueLibraryHeader({ ratedCount, total }: TechniqueLibraryHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-surface-base/80 backdrop-blur-md border-b border-chrome">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <span className="font-black text-content-primary tracking-tight text-lg">RollCall</span>

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
    </header>
  );
}