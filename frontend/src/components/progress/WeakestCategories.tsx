import { TECHNIQUE_CATEGORIES } from "../../data/techniques";
import { type RatingsMap } from "../../hooks/useTechniqueRatings";

interface CategoryScore {
  name: string;
  avg: number;
  ratedCount: number;
  total: number;
}

function buildCategoryScores(ratings: RatingsMap): CategoryScore[] {
  return TECHNIQUE_CATEGORIES.map((cat) => {
    const rated = cat.techniques.filter((t) => ratings[t.id] !== undefined);
    const avg =
      rated.length > 0
        ? rated.reduce((sum, t) => sum + ratings[t.id].rating, 0) / rated.length
        : 0;
    return {
      name: cat.name,
      avg: parseFloat(avg.toFixed(2)),
      ratedCount: rated.length,
      total: cat.techniques.length,
    };
  });
}

const BAR_COLORS: Record<number, string> = {
  0: "bg-rating-1-border",
  1: "bg-rating-1-border",
  2: "bg-rating-2-selected",
  3: "bg-rating-3-selected",
  4: "bg-rating-4-selected",
  5: "bg-rating-5-selected",
};

function barColor(avg: number): string {
  return BAR_COLORS[Math.round(avg)] ?? "bg-content-faint";
}

interface WeakestCategoriesProps {
  ratings: RatingsMap;
}

export default function WeakestCategories({ ratings }: WeakestCategoriesProps) {
  const scores = buildCategoryScores(ratings).filter((c) => c.ratedCount > 0);

  if (scores.length === 0) return null;

  const sorted = [...scores].sort((a, b) => a.avg - b.avg);
  const weakest = sorted.slice(0, 3);

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card px-4 py-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-content-muted mb-4">
        Focus Areas
      </p>

      <div className="space-y-3">
        {weakest.map((cat, i) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-content-faint w-4">
                  {i + 1}.
                </span>
                <span className="text-sm font-semibold text-content-secondary">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-content-subtle tabular-nums">
                  {cat.ratedCount}/{cat.total} rated
                </span>
                <span className="text-sm font-bold text-content-primary tabular-nums w-8 text-right">
                  {cat.avg.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-chrome rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor(cat.avg)}`}
                style={{ width: `${(cat.avg / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}