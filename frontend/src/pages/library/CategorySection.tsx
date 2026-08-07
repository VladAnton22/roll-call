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
  const accentColor =
    average !== null ? getRatingColors(average).bgSelected : "bg-chrome";

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 hover:bg-surface-hover transition-colors text-left px-3 py-3"
      >
        <div className={`w-1.5 self-stretch rounded-full shrink-0 ${accentColor}`} />

        <div className="flex flex-1 items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <p className="font-bold text-content-primary text-base truncate">
              {category.name}
            </p>
            <p className="text-xs text-content-subtle tabular-nums mt-0.5">
              {rated}/{total}
              {average !== null && ` · avg ${average.toFixed(1)}`}
            </p>
          </div>

          <ChevronRightIcon
            className={`w-4 h-4 text-content-subtle shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
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