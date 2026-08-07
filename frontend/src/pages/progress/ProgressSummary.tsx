import { TECHNIQUE_CATEGORIES } from "../../data/techniques.ts";
import { type RatingsMap } from "../../hooks/useTechniqueRatings.ts";
import StatCell from "../../components/ui/StatCell.tsx";
import StatGrid from "../../components/ui/StatGrid.tsx";

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
      ? allRatings.reduce((s, r) => s + r, 0) / allRatings.length
      : 0;

  const coveragePct = Math.round((totalRated / totalTechniques) * 100);

  return (
    <StatGrid>
      <StatCell label="Avg Rating" value={overallAvg.toFixed(1)} />
      <StatCell label="Coverage" value={`${coveragePct}%`} />
      <StatCell label="Sessions This Week" value={String(sessionsThisWeek)} />
    </StatGrid>
  );
}