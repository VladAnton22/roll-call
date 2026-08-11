import { TECHNIQUE_CATEGORIES } from "../../data/techniques.ts";

interface TechniquePickerProps {
  selectedIds: string[];
  onToggle: (techniqueId: string) => void;
}

export default function TechniquePicker({
  selectedIds,
  onToggle,
}: TechniquePickerProps) {
  const selected = new Set(selectedIds);

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
      {TECHNIQUE_CATEGORIES.map((category) => (
        <div key={category.id}>
          <p className="text-xs font-semibold text-content-subtle mb-1.5">
            {category.name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {category.techniques.map((technique) => {
              const isSelected = selected.has(technique.id);
              return (
                <button
                  key={technique.id}
                  type="button"
                  onClick={() => onToggle(technique.id)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold border transition-colors ${
                    isSelected
                      ? "bg-brand text-white border-brand"
                      : "bg-surface-input text-content-muted border-chrome hover:border-chrome-strong"
                  }`}
                >
                  {technique.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}