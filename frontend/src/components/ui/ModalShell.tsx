import { CloseIcon } from "../icons";

interface ModalShellProps {
  eyebrow: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function ModalShell({
  eyebrow,
  title,
  onClose,
  children,
  footer,
}: ModalShellProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-surface-elevated border border-chrome rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-chrome">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-content-subtle mb-1">
                {eyebrow}
              </p>
              <h2 className="text-xl font-bold text-content-primary leading-tight">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="mt-1 text-content-subtle hover:text-content-muted transition-colors shrink-0"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          {footer}
        </div>
      </div>
    </div>
  );
}