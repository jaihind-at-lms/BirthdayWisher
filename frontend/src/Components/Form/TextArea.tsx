import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import type { JSX } from 'react'

interface TextAreaProps {
  registration: UseFormRegisterReturn
  error?: FieldError | undefined
  className?: string
  placeholder?: string
  rows?: number
  maxLength?: number
}

const TextArea = ({
  registration,
  error,
  className = '',
  placeholder,
  rows = 3,
  maxLength,
}: TextAreaProps): JSX.Element => (
  <div>
    <textarea
      {...registration}
      rows={rows}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`form-control${error ? ' is-invalid' : ''}${className ? ` ${className}` : ''}`}
    />
    {error && (
      <div className="invalid-feedback d-block">{error.message}</div>
    )}
  </div>
)

export default TextArea
