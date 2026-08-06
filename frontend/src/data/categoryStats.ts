import type { TechniqueCategory, TechniqueRating } from "./techniques";

export interface CategoryStats {
  rated: number;
  total: number;
  average: number | null; // null when nothing in the category is rated
}

export function getCategoryStats(
  category: TechniqueCategory,
  ratings: Record<string, TechniqueRating>,
): CategoryStats {
  const ratedTechniques = category.techniques.filter((t) => ratings[t.id]);
  const total = category.techniques.length;
  const rated = ratedTechniques.length;

  const average =
    rated > 0
      ? ratedTechniques.reduce((sum, t) => sum + (ratings[t.id]?.rating ?? 0), 0) / rated
      : null;

  return { rated, total, average };
}