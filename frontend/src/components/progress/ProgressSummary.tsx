import { TECHNIQUE_CATEGORIES } from "../../data/techniques";
import { type RatingsMap } from "../../hooks/useTechniqueRatings";

interface SummaryStats {
  totalRated: number;
  totalTechniques: number;
  overallAvg: number;
  strongestCategory: {
    name: string;
    avg: number;
  } | null;
  weakestCategory: {
    name: string;
    avg: number;
  } | null;
}

function computeStats(ratings: RatingsMap): SummaryStats {
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

  const categoryAvgs = TECHNIQUE_CATEGORIES.map((cat) => {
    const rated = cat.techniques.filter((t) => ratings[t.id] !== undefined);
    const avg =
      rated.length > 0
        ? rated.reduce((sum, t) => sum + ratings[t.id].rating, 0) / rated.length
        : null;
    return { name: cat.name, avg };
  }).filter((c): c is { name: string; avg: number } => c.avg !== null);

  const strongest =
    categoryAvgs.length > 0
      ? categoryAvgs.reduce((a, b) => (a.avg >= b.avg ? a : b))
      : null;
  const weakest =
    categoryAvgs.length > 0
      ? categoryAvgs.reduce((a, b) => (a.avg <= b.avg ? a : b))
      : null;

  return {
    totalRated,
    totalTechniques,
    overallAvg,
    strongestCategory: strongest,
    weakestCategory: weakest,
  };
}

interface StatCellProps {
  label: string;
  value: string;
  sub?: string;
}

function StatCell({ label, value, sub }: StatCellProps) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-2">
      <span className="text-2xl font-black text-content-primary tabular-nums">
        {value}
      </span>
      {sub && <span className="text-xs text-content-subtle">{sub}</span>}
      <span className="text-xs font-semibold tracking-widest uppercase text-content-muted text-center">
        {label}
      </span>
    </div>
  );
}

interface ProgressSummaryProps {
  ratings: RatingsMap;
}

export default function ProgressSummary({ ratings }: ProgressSummaryProps) {
  if (Object.keys(ratings).length === 0) return null;

  const {
    totalRated,
    totalTechniques,
    overallAvg,
    strongestCategory,
    weakestCategory,
  } = computeStats(ratings);

  const completionPct = Math.round((totalRated / totalTechniques) * 100);

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card px-4 py-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-content-muted mb-5">
        Summary
      </p>

      <div className="grid grid-cols-3 divide-x divide-chrome mb-5">
        <StatCell
          label="Rated"
          value={`${totalRated}/${totalTechniques}`}
          sub={`${completionPct}% complete`}
        />
        <StatCell
          label="Avg Rating"
          value={overallAvg.toFixed(1)}
          sub="out of 5"
        />
        <StatCell label="Coverage" value={`${completionPct}%`} />
      </div>

      {(strongestCategory || weakestCategory) && (
        <div className="grid grid-cols-2 gap-3">
          {strongestCategory && (
            <div className="rounded-xl border flex flex-row justify-between border-strong-border bg-strong px-3 py-2.5">
                <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-strong-text mb-0.5">
                Strongest
              </p>
              <p className="text-sm font-bold text-strong-text">
                {strongestCategory.name}
              </p>
              </div>
              <p className="my-auto text-md font-semibold text-strong-text">
                {strongestCategory.avg.toFixed(1)}/5
              </p>
            </div>
          )}
          {weakestCategory && (
            <div className="rounded-xl border flex flex-row justify-between border-weak-border bg-weak px-3 py-2.5">
              <div className="my-auto">
                <p className="text-xs font-semibold tracking-widest uppercase text-weak-text mb-0.5">
                  Needs Work
                </p>
                <p className="text-sm font-bold text-weak-text">
                  {weakestCategory.name}
                </p>
              </div>
              <p className="my-auto font-semibold text-md text-weak-text">
                {weakestCategory.avg.toFixed(1)}/5
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
