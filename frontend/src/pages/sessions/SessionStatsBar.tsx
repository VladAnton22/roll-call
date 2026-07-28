interface SessionStatsBarProps {
  total: number;
  totalHours: number;
  giCount: number;
  nogiCount: number;
}

export default function SessionStatsBar({
  total,
  totalHours,
  giCount,
  nogiCount,
}: SessionStatsBarProps) {
  const stats = [
    { label: "Sessions", value: total },
    { label: "Hours trained", value: totalHours },
    { label: "Gi / No-Gi", value: `${giCount} / ${nogiCount}` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value }) => (
        <div
          key={label}
          className="bg-surface-card border border-chrome rounded-2xl px-4 py-3 text-center"
        >
          <p className="text-xl font-black text-content-primary">{value}</p>
          <p className="text-xs text-content-subtle mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}