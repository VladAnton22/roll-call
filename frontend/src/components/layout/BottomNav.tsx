import { NavLink } from "react-router";
import { NavLibraryIcon, NavProgressIcon, NavSessionsIcon } from "../icons";

export default function BottomNav() {
    const base = "flex flex-col items-center gap-1 text-xs font-medium transition-colors py-2 px-6";
    const active = "text-brand-text";
    const inactive = "text-content-subtle hover:text-content-muted";

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface-base/80 backdrop-blur-md border-t border-chrome">
            <div className="max-w-2xl mx-auto flex justify-around">
                <NavLink to="/" end className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                    <NavLibraryIcon />
                    Library
                </NavLink>
                <NavLink to="/progress" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                    <NavProgressIcon />
                    Progress
                </NavLink>
                <NavLink to="/sessions" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
                    <NavSessionsIcon />
                    Sessions
                </NavLink>
            </div>
        </nav>
    )
}