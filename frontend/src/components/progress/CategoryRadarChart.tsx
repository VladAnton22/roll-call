import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { TECHNIQUE_CATEGORIES } from "../../data/techniques";
import { type RatingsMap } from "../../hooks/useTechniqueRatings";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function buildRadarData(ratings: RatingsMap) {
  return TECHNIQUE_CATEGORIES.map((cat) => {
    const rated = cat.techniques.filter((t) => ratings[t.id] !== undefined);
    const avg =
      rated.length > 0
        ? rated.reduce((sum, t) => sum + ratings[t.id].rating, 0) / rated.length
        : 0;

    return { label: cat.name, avg: parseFloat(avg.toFixed(2)) };
  });
}

interface CategoryRadarChartProps {
  ratings: RatingsMap;
}

export default function CategoryRadarChart({
  ratings,
}: CategoryRadarChartProps) {
  const hasAnyRatings = Object.keys(ratings).length > 0;

  if (!hasAnyRatings) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-chrome bg-surface-card">
        <p className="text-content-subtle text-sm text-center px-6">
          Rate some techniques in the Library to see your radar chart.
        </p>
      </div>
    );
  }

  const data = buildRadarData(ratings);

  // Read from the CSS custom properties at render time
  const brand = getCSSVar("--color-brand");
  const brandSubtle = getCSSVar("--color-brand-subtle");
  const brandBorder = getCSSVar("--color-brand-border");
  const chrome = getCSSVar("--color-chrome");
  const contentMuted = getCSSVar("--color-content-muted");
  const contentFaint = getCSSVar("--color-content-faint");

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.avg),
        backgroundColor: `color-mix(in srgb, ${brand} 25%, transparent)`,
        borderColor: brandSubtle,
        borderWidth: 2,
        pointBackgroundColor: brandBorder,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: contentFaint,
          font: { size: 10 },
          backdropColor: "transparent",
        },
        grid: { color: chrome },
        angleLines: { color: chrome },
        pointLabels: {
          color: contentMuted,
          font: { size: 11, weight: "bold" as const },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { r: number } }) =>
            ` avg ${ctx.parsed.r.toFixed(2)} / 5`,
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-chrome bg-surface-card px-4 py-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-content-muted mb-4">
        Game Overview
      </p>
      <Radar data={chartData} options={options} />
      <p className="text-xs text-content-faint text-center mt-2">
        Scale 0 – 5 · spokes with no ratings plot at 0
      </p>
    </div>
  );
}
