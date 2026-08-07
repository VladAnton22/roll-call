interface StatCellProps {
  label: string;
  value: string;
}

export default function StatCell({ label, value }: StatCellProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-2">
      <span className="text-3xl font-black text-content-primary tabular-nums">
        {value}
      </span>
      <span className="text-xs font-semibold tracking-widest uppercase text-content-muted text-center">
        {label}
      </span>
    </div>
  );
}