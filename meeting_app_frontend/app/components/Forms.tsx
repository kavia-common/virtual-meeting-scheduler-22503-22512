import { ReactNode } from "react";

/**
 * PUBLIC_INTERFACE
 * Button component with variants.
 */
export function Button({
  children,
  variant = "primary",
  type = "button",
  disabled,
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const cls =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
      ? "btn-secondary"
      : "btn-ghost";
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}

/**
 * PUBLIC_INTERFACE
 * TextInput, TextArea, DateTimeInput
 */
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const { label, id, className, ...rest } = props;
  return (
    <div>
      {label ? <label htmlFor={id} className="label">{label}</label> : null}
      <input id={id} className={`input ${className ?? ""}`} {...rest} />
    </div>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  const { label, id, className, ...rest } = props;
  return (
    <div>
      {label ? <label htmlFor={id} className="label">{label}</label> : null}
      <textarea id={id} className={`input min-h-28 ${className ?? ""}`} {...rest} />
    </div>
  );
}

export function DateTimeInput({
  label,
  id,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div>
      {label ? <label htmlFor={id} className="label">{label}</label> : null}
      <input id={id} type="datetime-local" className="input" {...rest} />
    </div>
  );
}
