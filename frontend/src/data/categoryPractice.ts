import { TECHNIQUE_CATEGORIES } from "./techniques.ts";

export interface PracticeSession {
  techniqueIds: string[];
}

const CATEGORY_BY_TECHNIQUE: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const category of TECHNIQUE_CATEGORIES) {
    for (const technique of category.techniques) {
      map[technique.id] = category.id;
    }
  }
  return map;
})();

export function categoryPracticeCounts(
  sessions: PracticeSession[],
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const category of TECHNIQUE_CATEGORIES) counts[category.id] = 0;

  for (const session of sessions) {
    const touched = new Set<string>();
    for (const techniqueId of session.techniqueIds ?? []) {
      const categoryId = CATEGORY_BY_TECHNIQUE[techniqueId];
      if (categoryId) touched.add(categoryId);
    }
    for (const categoryId of touched) counts[categoryId] += 1;
  }
  return counts;
}