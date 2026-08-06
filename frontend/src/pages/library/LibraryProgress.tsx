interface LibraryProgressProps {
  rated: number;
  total: number;
}

export default function LibraryProgress({ rated, total }: LibraryProgressProps) {
  const percent = total > 0 ? Math.round((rated / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card px-5 py-4">
      <div className="flex items-baseline justify-between gap-4">
        <span>
          <span className="text-sm font-semibold text-content-primary">{rated}/{total}</span>
          <span className="text-content-subtle"> techniques rated</span>
        </span>
        <span className="text-sm font-bold tabular-nums text-brand-text">
          {percent}%
        </span>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-chrome">
        <div
          className="h-full rounded-full bg-brand transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={rated}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}