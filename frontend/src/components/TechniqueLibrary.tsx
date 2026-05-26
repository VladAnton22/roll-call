import { useState } from "react";
import { TECHNIQUE_CATEGORIES } from "../data/techniques.ts";
import type { Confidence } from "../data/techniques.ts";
import { useTechniqueRatings } from "../hooks/useTechniqueRatings.ts";
import CategorySection from "./CategorySection.tsx";
import RatingModal from "./RatingModal.tsx";

interface ActiveTechnique {
  id: string;
  name: string;
}

export default function TechniqueLibrary() {
  const { ratings, setRating, clearRating, getRating, ratedCount } = useTechniqueRatings();
  const [activeTechnique, setActiveTechnique] = useState<ActiveTechnique | null>(null);
  const [search, setSearch] = useState("");

  const totalTechniques = TECHNIQUE_CATEGORIES.reduce(
    (sum, cat) => sum + cat.techniques.length,
    0
  );

  // Filter categories/techniques by search query
  const filteredCategories = search.trim()
    ? TECHNIQUE_CATEGORIES.map((cat) => ({
        ...cat,
        techniques: cat.techniques.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((cat) => cat.techniques.length > 0)
    : TECHNIQUE_CATEGORIES;

  function handleTechniqueClick(id: string, name: string) {
    setActiveTechnique({ id, name });
  }

  function handleSave(rating: 1 | 2 | 3 | 4 | 5, confidence: Confidence) {
    if (!activeTechnique) return;
    setRating(activeTechnique.id, rating, confidence);
  }

  function handleClear() {
    if (!activeTechnique) return;
    clearRating(activeTechnique.id);
  }

  return (
    <div className="min-h-screen bg-surface-base text-content-primary">
      {/* Top nav */}
      <header className="sticky top-0 z-30 bg-surface-base/80 backdrop-blur-md border-b border-chrome">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* <div></div> */}
            <span className="font-black text-content-primary tracking-tight text-lg">BJJ Tracker</span>
          </div>
 
          <div className="flex items-center gap-2 bg-surface-elevated border border-chrome-strong rounded-full px-3 py-1.5">
            <div className="w-20 h-1.5 bg-chrome rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-subtle rounded-full transition-all duration-500"
                style={{ width: `${(ratedCount / totalTechniques) * 100}%` }}
              />
            </div>
            <span className="text-xs text-content-muted tabular-nums font-medium">
              {ratedCount}/{totalTechniques}
            </span>
          </div>
        </div>
      </header>
 
      <main className="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-3">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-content-primary mb-1">Technique Library</h1>
          <p className="text-sm text-content-subtle">
            Tap any technique to rate it. Score = Rating (1-5) + Confidence (L/M/H).
          </p>
        </div>
 
        {/* Search */}
        <div className="relative mb-5">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-subtle"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search techniques..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-input border border-chrome-strong rounded-xl pl-10 pr-4 py-2.5 text-sm text-content-secondary placeholder-content-faint focus:outline-none focus:border-brand-border focus:ring-1 focus:ring-brand-border transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-content-subtle hover:text-content-muted"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
 
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              ratings={ratings}
              onTechniqueClick={handleTechniqueClick}
            />
          ))
        ) : (
          <div className="text-center py-16 text-content-faint">
            <p className="text-lg font-semibold">No techniques found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </main>
 
      {activeTechnique && (
        <RatingModal
          techniqueName={activeTechnique.name}
          currentRating={getRating(activeTechnique.id)}
          onSave={handleSave}
          onClear={handleClear}
          onClose={() => setActiveTechnique(null)}
        />
      )}
    </div>
  );
}