import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import type { InputHTMLAttributes, JSX, ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: FieldError | undefined
  registration: UseFormRegisterReturn
  icon?: ReactNode
}

const Input = ({
  error,
  registration,
  id,
  className,
  type,
  icon,
  ...inputProps
}: InputProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false)
  const fieldId = id ?? registration.name
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const hasIcon = !!icon
  const extraPadding = `${hasIcon ? ' ps-5' : ''}${isPassword ? ' pe-5' : ''}`

  return (
    <div>
      <div className="position-relative">
        <input
          id={fieldId}
          type={inputType}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={`form-control${error ? ' is-invalid' : ''}${extraPadding}${className ? ` ${className}` : ''}`}
          {...inputProps}
          {...registration}
        />
        {icon && (
          <div className="position-absolute start-0 top-50 translate-middle-y ps-3 text-secondary">
            {icon}
          </div>
        )}
        {isPassword && (
          <button
            className="btn position-absolute end-0 top-50 translate-middle-y d-flex align-items-center border-0 bg-transparent pe-3"
            type="button"
            onClick={() => { setShowPassword((p) => !p) }}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <div id={`${fieldId}-error`} className="invalid-feedback d-block">
          {error.message}
        </div>
      )}
    </div>
  )
}

export default Input
