import { useId } from 'react';
import type { InputHTMLAttributes, Ref } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  ref?: Ref<HTMLInputElement>;
}

export default function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ref,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = error || helperText ? `${inputId}-description` : undefined;

  return (
    <div className="field">
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={descriptionId}
        className={`field-control ${error ? 'field-control-error' : ''} ${className}`}
        {...rest}
      />
      {(error || helperText) && (
        <p id={descriptionId} className={`field-help ${error ? 'field-error' : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
