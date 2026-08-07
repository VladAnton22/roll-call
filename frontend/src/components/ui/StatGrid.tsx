import type { ReactNode } from "react";

export default function StatGrid({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-chrome bg-surface-card px-4 py-6">
      <div className="grid grid-cols-3 divide-x divide-chrome">{children}</div>
    </div>
  );
}