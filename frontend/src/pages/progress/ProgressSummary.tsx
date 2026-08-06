import { TECHNIQUE_CATEGORIES } from "../../data/techniques.ts";
import { type RatingsMap } from "../../hooks/useTechniqueRatings.ts";

interface StatCellProps {
  label: string;
  value: string;
}

function StatCell({ label, value }: StatCellProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-2xl font-black text-content-primary tabular-nums">
        {value}
      </span>
      <span className="text-xs font-semibold tracking-widest uppercase text-content-muted text-center">
        {label}
      </span>
    </div>
  );
}

interface ProgressSummaryProps {
  ratings: RatingsMap;
  sessionsThisWeek: number;
}

export default function ProgressSummary({
  ratings,
  sessionsThisWeek,
}: ProgressSummaryProps) {
  if (Object.keys(ratings).length === 0) return null;

  const totalTechniques = TECHNIQUE_CATEGORIES.reduce(
    (sum, cat) => sum + cat.techniques.length,
    0,
  );
  const totalRated = Object.keys(ratings).length;

  const allRatings = Object.values(ratings).map((r) => r.rating);
  const overallAvg =
    allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
      : 0;

  const coveragePct = Math.round((totalRated / totalTechniques) * 100);

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card px-4 py-6">
      <div className="grid grid-cols-3 divide-x divide-chrome">
        <StatCell label="Avg Rating" value={overallAvg.toFixed(1)} />
        <StatCell label="Coverage" value={`${coveragePct}%`} />
        <StatCell label="Sessions This Week" value={String(sessionsThisWeek)} />
      </div>
    </div>
  );
}