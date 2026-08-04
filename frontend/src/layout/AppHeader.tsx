import { UserMenu } from "../components/UserMenu";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-chrome bg-surface-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <span className="text-xl font-black text-content-primary">RollCall</span>
        <UserMenu />
      </div>
    </header>
  );
}