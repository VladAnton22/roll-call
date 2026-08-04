import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!user) return null;

  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-surface-hover transition-colors"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden text-sm font-medium text-content-primary sm:inline">
          {user.username}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-chrome bg-surface-card py-1 shadow-lg">
          <div className="truncate border-b border-chrome px-3 py-2 text-xs text-content-muted">
            {user.email}
          </div>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="w-full px-3 py-2 text-left text-sm text-content-primary hover:bg-surface-hover"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}