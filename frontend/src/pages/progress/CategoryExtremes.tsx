import { TECHNIQUE_CATEGORIES } from "../../data/techniques.ts";
import { type RatingsMap } from "../../hooks/useTechniqueRatings.ts";
import { getCategoryStats } from "../../data/categoryStats.ts";

interface CategoryExtremesProps {
  ratings: RatingsMap;
}

export default function CategoryExtremes({ ratings }: CategoryExtremesProps) {
  const categoryAvgs = TECHNIQUE_CATEGORIES.map((cat) => {
    const { average } = getCategoryStats(cat, ratings);
    return { name: cat.name, avg: average };
  }).filter((c): c is { name: string; avg: number } => c.avg !== null);

  if (categoryAvgs.length === 0) return null;

  const strongest = categoryAvgs.reduce((a, b) => (a.avg >= b.avg ? a : b));
  const weakest = categoryAvgs.reduce((a, b) => (a.avg <= b.avg ? a : b));

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-strong-border bg-strong px-3 py-2.5 flex flex-col justify-between">
        <div className="my-auto">
          <p className="text-xs font-semibold text-strong-text mb-0.5">
            STRONGEST
          </p>
          <p className="text-sm font-bold text-strong-text">{strongest.name}</p>
        </div>
        <p className="my-auto text-sm font-semibold text-strong-text">
          {strongest.avg.toFixed(1)}/5
        </p>
      </div>

      <div className="rounded-xl border border-weak-border bg-weak px-3 py-2.5 flex flex-col justify-between">
        <p className="text-xs font-semibold tracking-widest text-weak-text mb-0.5">
        WEAKEST
        </p>
        <p className="text-sm font-bold text-weak-text">{weakest.name}</p>
        <p className="my-auto text-sm font-semibold text-weak-text">
        {weakest.avg.toFixed(1)}/5
        </p>
      </div>
    </div>
  );
}