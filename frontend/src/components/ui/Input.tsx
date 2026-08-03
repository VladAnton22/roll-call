import type { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-chrome bg-surface-input " +
        "px-3 py-2 text-content-primary placeholder:text-content-subtle " +
        "focus:outline-none focus:ring-2 focus:ring-brand-subtle " +
        (props.className ?? "")
      }
    />
  );
}