import { useId } from 'react';
import type { TextareaHTMLAttributes, Ref } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

export default function Textarea({
  label,
  error,
  helperText,
  id,
  className = '',
  ref,
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const descriptionId = error || helperText ? `${textareaId}-description` : undefined;

  return (
    <div className="field">
      {label && (
        <label htmlFor={textareaId} className="field-label">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
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
