interface PrimaryButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  type?: "button" | "submit";
}

export default function PrimaryButton({
  onClick,
  disabled = false,
  children,
  fullWidth = false,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-3 px-4 rounded-xl font-bold text-sm transition-all duration-150 ${
        fullWidth ? "w-full" : ""
      } ${
        disabled
          ? "bg-surface-elevated text-content-faint cursor-not-allowed"
          : "bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand-shadow"
      }`}
    >
      {children}
    </button>
  );
}