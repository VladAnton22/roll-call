import { TECHNIQUE_CATEGORIES } from "../../data/techniques.ts";
import { type RatingsMap } from "../../hooks/useTechniqueRatings.ts";
import { getCategoryStats } from "../../data/categoryStats.ts";
import { categoryPracticeCounts } from "../../data/categoryPractice.ts";
import getRatingColors from "../../data/ratingColors.ts";
import type { Session } from "../../hooks/useSessionLog.ts";

interface PracticeVsProficiencyProps {
  ratings: RatingsMap;
  sessions: Session[];
}


export default function PracticeVsProficiency({
  ratings,
  sessions,
}: PracticeVsProficiencyProps) {
  if (Object.keys(ratings).length === 0) return null;

  const practice = categoryPracticeCounts(sessions);

  const rows = TECHNIQUE_CATEGORIES.map((cat) => {
    const { average } = getCategoryStats(cat, ratings);
    return {
      id: cat.id,
      name: cat.name,
      proficiency: average, // number | null
      practiceCount: practice[cat.id] ?? 0,
    };
  });

  const maxPractice = Math.max(1, ...rows.map((r) => r.practiceCount));

  const sorted = [...rows].sort((a, b) => {
    if (a.proficiency === null) return 1;
    if (b.proficiency === null) return -1;
    return a.proficiency - b.proficiency;
  });

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card px-4 py-6">
      <p className="font-bold text-content-primary mb-1">Practice vs Proficiency</p>
      <p className="text-xs text-content-muted mb-6">
        How good you are (top bar) versus how often you train it (bottom bar). A
        short bar over a short bar is a <span className="text-weak-text">neglected weak spot</span>.
      </p>

      <div className="space-y-4">
        {sorted.map((row) => {
          const proficiencyPct =
            row.proficiency === null ? 0 : (row.proficiency / 5) * 100;
          const practicePct = (row.practiceCount / maxPractice) * 100;
          const proficiencyBar =
            row.proficiency === null
              ? "bg-chrome"
              : getRatingColors(row.proficiency).bgSelected;

          return (
            <div key={row.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold text-content-secondary">
                  {row.name}
                </span>
                <span className="text-xs text-content-subtle tabular-nums">
                  {row.proficiency === null
                    ? "unrated"
                    : row.proficiency.toFixed(1)}
                  {" · "}
                  {row.practiceCount}{" "}
                  {row.practiceCount === 1 ? "session" : "sessions"}
                </span>
              </div>

              <div className="h-1.5 bg-chrome rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${proficiencyBar}`}
                  style={{ width: `${proficiencyPct}%` }}
                />
              </div>
              <div className="h-1.5 bg-chrome rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-content-muted transition-all duration-500"
                  style={{ width: `${practicePct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}