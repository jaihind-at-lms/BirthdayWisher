import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import type { JSX, ReactNode } from 'react'

interface SelectProps {
  registration: UseFormRegisterReturn
  error?: FieldError | undefined
  children: ReactNode
  className?: string
  placeholder?: string
}

const Select = ({
  registration,
  error,
  children,
  className = '',
  placeholder,
}: SelectProps): JSX.Element => (
  <div>
    <select
      {...registration}
      className={`form-select${error ? ' is-invalid' : ''}${className ? ` ${className}` : ''}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
    {error && (
      <div className="invalid-feedback d-block">{error.message}</div>
    )}
  </div>
)

export default Select
