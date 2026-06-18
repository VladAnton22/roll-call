interface FormFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export default function FormField({ label, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-content-subtle">
        {label}
        {hint && (
          <span className="ml-1 normal-case font-normal text-content-subtle">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}