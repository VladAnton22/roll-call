import StatCell from "../../components/ui/StatCell.tsx";
import StatGrid from "../../components/ui/StatGrid.tsx";

interface SessionStatsProps {
  sessionsThisWeek: number;
  minutesThisWeek: number;
}

function formatHours(mins: number): string {
  const hours = mins / 60;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
}

export default function SessionStats({
  sessionsThisWeek,
  minutesThisWeek,
}: SessionStatsProps) {
  const avgMins =
    sessionsThisWeek > 0 ? Math.round(minutesThisWeek / sessionsThisWeek) : 0;

  return (
    <StatGrid>
      <StatCell label="Sessions This Week" value={String(sessionsThisWeek)} />
      <StatCell label="Hours This Week" value={formatHours(minutesThisWeek)} />
      <StatCell
        label="Avg Min / Session"
        value={sessionsThisWeek > 0 ? String(avgMins) : "—"}
      />
    </StatGrid>
  );
}