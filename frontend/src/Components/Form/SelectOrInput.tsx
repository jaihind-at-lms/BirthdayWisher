import { useState } from 'react'
import type { JSX } from 'react'
import type { FieldError } from 'react-hook-form'

interface SelectOrInputProps {
  value: string
  onChange: (value: string) => void
  error?: FieldError | undefined
  options: string[]
  placeholder?: string
  className?: string
  maxLength?: number
}

const OTHER = 'Other'

const SelectOrInput = ({
  value,
  onChange,
  error,
  options,
  placeholder = 'Select…',
  className = '',
  maxLength,
}: SelectOrInputProps): JSX.Element => {
  const [isOther, setIsOther] = useState(
    options.length > 0 && !options.includes(value) && value !== ''
  )

  const handleSelectChange = (selected: string) => {
    if (selected === OTHER) {
      setIsOther(true)
      onChange('')
    } else {
      setIsOther(false)
      onChange(selected)
    }
  }

  return (
    <div>
      <select
        className={`form-select${className ? ` ${className}` : ''}${error ? ' is-invalid' : ''}`}
        value={isOther ? OTHER : value || ''}
        onChange={(e) => { handleSelectChange(e.target.value) }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        <option value={OTHER}>{OTHER}</option>
      </select>
      {isOther && (
        <input
          type="text"
          className={`form-control mt-2${className ? ` ${className}` : ''}${error ? ' is-invalid' : ''}`}
          value={value}
          onChange={(e) => { onChange(e.target.value) }}
          placeholder="Enter custom value"
          maxLength={maxLength}
          autoFocus
        />
      )}
      {error && (
        <div className="invalid-feedback d-block">{error.message}</div>
      )}
    </div>
  )
}

export default SelectOrInput
