import type { TechniqueRating } from "../../data/techniques.ts";
import getRatingColors from "../../data/ratingColors.ts";

interface ScoreBadgeProps {
  rating: TechniqueRating;
  size?: "sm" | "md";
}
 
export default function ScoreBadge({ rating, size = "md" }: ScoreBadgeProps) {
  const { rating: r, confidence: c } = rating;
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";
  const colors = getRatingColors(r)
  const badgeColor = `${colors.bg} ${colors.text} ${colors.border}`
 
  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg border tabular-nums ${badgeColor} ${sizeClass}`}
      title={`Rating: ${r}, Confidence: ${c}`}
    >
      {r}{c}
    </span>
  );
}