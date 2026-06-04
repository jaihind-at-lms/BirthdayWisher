/**
 * Reusable controlled form field: label + input + inline error message.
 *
 * Designed to work with React Hook Form's `register` API.
 * Forwards all standard input attributes so it works as a drop-in for any
 * text-like input (text, password, email, number, etc.).
 *
 * @example
 *   <FormField
 *     label="Username"
 *     error={errors.username}
 *     registration={register('username')}
 *   />
 */
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import type { InputHTMLAttributes, JSX } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** Visible label text rendered above the input. */
  label: string
  /** Field error from RHF's `formState.errors`. Renders the message when present. */
  error?: FieldError | undefined
  /** Return value of `register('fieldName')` — wires RHF into the input. */
  registration: UseFormRegisterReturn
}

const Input = ({
  label,
  error,
  registration,
  id,
  ...inputProps
}: InputProps): JSX.Element => {
  // Fall back to the field name as the id so label htmlFor always works
  const fieldId = id ?? registration.name

  return (
    <div className="form-field">
      <label htmlFor={fieldId} className="form-field__label">
        {label}
      </label>
      <input
        id={fieldId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`form-field__input${error ? ' form-field__input--error' : ''}`}
        {...inputProps}
        {...registration}
      />
      {error && (
        <span
          id={`${fieldId}-error`}
          role="alert"
          className="form-field__error"
        >
          {error.message}
        </span>
      )}
    </div>
  )
}

export default Input
