import { useEffect, useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import type { JSX } from 'react'

interface FileInputProps {
  value: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSizeBytes?: number
  compact?: boolean
}

const FileInput = ({
  value,
  onChange,
  accept = 'image/*',
  maxSizeBytes = 1024 * 1024,
  compact = false,
}: FileInputProps): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const humanSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))}MB`
    return `${Math.round(bytes / 1024)}KB`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null

    if (file && maxSizeBytes && file.size > maxSizeBytes) {
      setError(`File is too large. Maximum allowed size is ${humanSize(maxSizeBytes)}.`)
      onChange(null)
      setPreview(null)
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    setError(null)
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
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  useEffect(() => {
    if (!value) {
      setPreview(null)
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [value])

  const handleClick = () => inputRef.current?.click()
  const sizeLabel = humanSize(maxSizeBytes)

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="d-none"
        onChange={handleChange}
      />
      <div
        role="button"
        tabIndex={0}
        className={compact
          ? 'd-flex align-items-center gap-3 p-3 rounded-3 border border-secondary bg-white shadow-sm'
          : 'border rounded-3 p-4 text-center text-secondary bg-white shadow-sm'}
        style={{ borderStyle: 'dashed', cursor: 'pointer' }}
        onClick={handleClick}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick()
          }
        }}
      >
        {preview ? (
          compact ? (
            <div className="d-flex align-items-center gap-3 w-100">
              <div>
                <img
                  src={preview}
                  alt="Selected file preview"
                  className="rounded border"
                  style={{ width: 70, height: 70, objectFit: 'cover' }}
                />
              </div>
              <div className="text-start flex-grow-1">
                <div className="fw-semibold text-truncate">{value?.name || 'Selected file'}</div>
                <div className="small text-muted">Click to replace</div>
                <div className="small text-muted">Allowed: {sizeLabel}</div>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center"
                onClick={(event) => {
                  event.stopPropagation()
                  handleRemove()
                }}
                aria-label="Remove selected file"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center gap-3">
              <div className="position-relative">
                <img
                  src={preview}
                  alt="Selected file preview"
                  className="rounded-circle border"
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger rounded-circle position-absolute top-0 end-0 d-flex align-items-center justify-content-center"
                  style={{ width: 26, height: 26, transform: 'translate(30%, -30%)' }}
                  onClick={(event) => {
                    event.stopPropagation()
                    handleRemove()
                  }}
                >
                  <X size={14} />
                </button>
              </div>
              <div>
                <div className="fw-semibold">{value?.name || 'Selected file'}</div>
                <div className="small text-muted">Click to change</div>
              </div>
            </div>
          )
        ) : compact ? (
          <div className="d-flex align-items-center gap-3 w-100">
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-10" style={{ width: 48, height: 48 }}>
              <Upload size={18} />
            </div>
            <div className="text-start flex-grow-1">
              <div className="fw-semibold">Upload photo</div>
              <div className="small text-muted">PNG, JPG, JPEG up to {sizeLabel}</div>
            </div>
            <span className="badge bg-secondary bg-opacity-10 text-secondary py-2 px-3">Browse</span>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center gap-2">
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-secondary bg-opacity-10 mx-auto" style={{ width: 54, height: 54 }}>
              <Upload size={24} />
            </div>
            <div className="fw-semibold">Upload employee photo</div>
            <div className="small text-muted">PNG, JPG, JPEG up to {sizeLabel}</div>
            <div className="btn btn-sm btn-outline-secondary mt-2">Choose file</div>
          </div>
        )}
      </div>
      {error && <div className="invalid-feedback d-block mt-2">{error}</div>}
      {!error && !compact && (
        <div className="form-text small text-muted mt-2">Allowed size: {sizeLabel}. Accepted types: images.</div>
      )}
    </div>
  )
}

export default FileInput
