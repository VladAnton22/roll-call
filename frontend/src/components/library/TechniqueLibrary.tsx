import { useState } from "react";
import { TECHNIQUE_CATEGORIES } from "../../data/techniques.ts";
import type { Confidence } from "../../data/techniques.ts";
import { useTechniqueRatings } from "../../hooks/useTechniqueRatings.ts";
import CategorySection from "./CategorySection.tsx";
import RatingModal from "./RatingModal.tsx";
import TechniqueSearchBar from "./TechniqueSearchBar.tsx";
import TechniqueLibraryHeader from "./TechniqueLibraryHeader.tsx";

interface ActiveTechnique {
  id: string;
  name: string;
}

export default function TechniqueLibrary() {
  const { ratings, setRating, clearRating, getRating, ratedCount } =
    useTechniqueRatings();
  const [activeTechnique, setActiveTechnique] =
    useState<ActiveTechnique | null>(null);
  const [search, setSearch] = useState("");

  const totalTechniques = TECHNIQUE_CATEGORIES.reduce(
    (sum, cat) => sum + cat.techniques.length,
    0,
  );

  // Filter categories/techniques by search query
  const filteredCategories = search.trim()
    ? TECHNIQUE_CATEGORIES.map((cat) => ({
        ...cat,
        techniques: cat.techniques.filter((t) =>
          t.name.toLowerCase().includes(search.toLowerCase()),
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
      <main className="max-w-2xl mx-auto px-4 pb-24 pt-6 space-y-3">
        <TechniqueLibraryHeader ratedCount={ratedCount} total={totalTechniques} />
        <TechniqueSearchBar value={search} onChange={setSearch} />

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
