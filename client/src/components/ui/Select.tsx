import { useId } from 'react';
import type { SelectHTMLAttributes, Ref } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  ref?: Ref<HTMLSelectElement>;
}

export default function Select({
  label,
  error,
  helperText,
  options,
  placeholder,
  id,
  className = '',
  ref,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const descriptionId = error || helperText ? `${selectId}-description` : undefined;

  return (
    <div className="field">
      {label && (
        <label htmlFor={selectId} className="field-label">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={descriptionId}
        className={`field-control ${error ? 'field-control-error' : ''} ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p id={descriptionId} className={`field-help ${error ? 'field-error' : ''}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
