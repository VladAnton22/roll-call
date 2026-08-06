import type { TechniqueCategory, TechniqueRating } from "../../data/techniques.ts";
import TechniqueRow from "./TechniqueRow.tsx";
import { ChevronRightIcon } from "../../components/icons";
import { getCategoryStats } from "../../data/categoryStats.ts";
import getRatingColors from "../../data/ratingColors.ts";

interface CategorySectionProps {
  category: TechniqueCategory;
  ratings: Record<string, TechniqueRating>;
  isOpen: boolean;
  onToggle: () => void;
  onTechniqueClick: (techniqueId: string, techniqueName: string) => void;
}

export default function CategorySection({
  category,
  ratings,
  isOpen,
  onToggle,
  onTechniqueClick,
}: CategorySectionProps) {
  const { rated, total, average } = getCategoryStats(category, ratings);
  const barColor = average !== null ? getRatingColors(average).bgSelected : "bg-chrome";

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors text-left gap-4"
      >
        <div className="flex items-center gap-3 min-w-0">
          <ChevronRightIcon
            className={`w-4 h-4 text-content-subtle shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
          />
          <span className="font-bold text-content-primary text-base truncate">
            {category.name}
          </span>
          {average !== null && (
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-xs text-content-subtle">avg</span>
              <span className="text-sm font-bold text-content-secondary">
                {average.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-content-subtle tabular-nums">
            {rated}/{total}
          </span>
          <div className="w-16 h-1.5 bg-chrome rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${(rated / total) * 100}%` }}
            />
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-chrome divide-y divide-chrome/60">
          {category.techniques.map((technique) => (
            <TechniqueRow
              key={technique.id}
              technique={technique}
              rating={ratings[technique.id]}
              onClick={onTechniqueClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}