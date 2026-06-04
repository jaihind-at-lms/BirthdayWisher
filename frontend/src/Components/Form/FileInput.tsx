import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import type { JSX } from 'react'

interface FileInputProps {
  value: File | null
  onChange: (file: File | null) => void
  accept?: string
}

const FileInput = ({ value, onChange, accept = 'image/*' }: FileInputProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="d-none"
        onChange={handleChange}
      />
      {preview ? (
        <div className="position-relative d-inline-block">
          <img
            src={preview}
            alt="Preview"
            className="rounded border"
            style={{ width: 120, height: 120, objectFit: 'cover' }}
          />
          <button
            type="button"
            className="btn btn-sm btn-outline-danger rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
            style={{ width: 24, height: 24, transform: 'translate(30%, -30%)' }}
            onClick={handleRemove}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={16} />
          {value ? value.name : 'Upload Photo'}
        </button>
      )}
    </div>
  )
}

export default FileInput
