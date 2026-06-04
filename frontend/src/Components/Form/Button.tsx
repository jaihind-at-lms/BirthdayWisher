import type { ButtonHTMLAttributes, JSX, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: string
  loading?: boolean
}

const Button = ({
  children,
  variant = 'btn-info',
  loading = false,
  disabled,
  className = '',
  ...rest
}: ButtonProps): JSX.Element => (
  <button
    disabled={disabled || loading}
    className={`btn ${variant} fw-semibold text-white py-3 shadow-sm d-flex align-items-center justify-content-center gap-2 ${className}`.trim()}
    {...rest}
  >
    {loading ? (
      <>
        <span className="spinner-border spinner-border-sm" role="status" />
        {children}
      </>
    ) : (
      children
    )}
  </button>
)

export default Button
