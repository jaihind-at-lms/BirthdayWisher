import type { UseFormRegisterReturn } from 'react-hook-form'
import type { JSX, ReactNode } from 'react'

interface CheckboxProps {
  registration: UseFormRegisterReturn
  id: string
  children: ReactNode
}

const Checkbox = ({ registration, id, children }: CheckboxProps): JSX.Element => (
  <div className="form-check">
    <input
      type="checkbox"
      id={id}
      className="form-check-input"
      {...registration}
    />
    <label className="form-check-label" htmlFor={id}>
      {children}
    </label>
  </div>
)

export default Checkbox
