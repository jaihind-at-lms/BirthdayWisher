import { useCallback, useEffect, useRef, useState } from 'react'

import { ArrowLeft, Eye, Save, Upload } from 'lucide-react'
import type { ChangeEvent, JSX } from 'react'

import Button from '@project/Components/Form/Button'
import {
  useCreateTemplateMutation,
  usePreviewTemplateMutation,
  useUpdateTemplateMutation,
} from '@project/Store/Api'
import type {
  PhotoConfig,
  QuoteConfig,
  Template,
  TextConfig,
} from '@project/Types/Features/template'

interface TemplateEditorProps {
  template: Template | null
  onClose: () => void
}

const DEFAULT_PHOTO: PhotoConfig = {
  cx: 0.5,
  cy: 0.38,
  size: 0.4,
  shape: 'circle',
  align: 'center',
  borderColor: '#000000',
  borderWidth: 4,
}

const DEFAULT_GREETING: TextConfig = {
  cx: 0.5,
  cy: 0.05,
  fontSize: 60,
  color: '#FFFFFF',
  bold: true,
  align: 'center',
  text: 'Happy Birthday!',
}

const DEFAULT_NAME: TextConfig = {
  cx: 0.5,
  cy: 0.6,
  fontSize: 54,
  color: '#FFFFFF',
  bold: true,
  align: 'center',
}

const DEFAULT_QUOTE: QuoteConfig = {
  cx: 0.5,
  cy: 0.68,
  fontSize: 35,
  color: '#FFFFFF',
  bold: false,
  align: 'center',
  maxWidth: 700,
}

const TemplateEditor = ({ template, onClose }: TemplateEditorProps): JSX.Element => {
  const isEdit = !!template

  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation()
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation()
  const [previewTemplate, { isLoading: isPreviewing }] = usePreviewTemplateMutation()

  // Form state
  const [name, setName] = useState(template?.name ?? '')
  const [active, setActive] = useState(template?.active ?? true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(
    template ? template.imageUrl : ''
  )

  // Config state
  const [photo, setPhoto] = useState<PhotoConfig>(
    template?.photo && Object.keys(template.photo).length > 0 ? template.photo : DEFAULT_PHOTO
  )
  const [greeting, setGreeting] = useState<TextConfig>(
    template?.greeting && Object.keys(template.greeting).length > 0 ? template.greeting : DEFAULT_GREETING
  )
  const [nameConfig, setNameConfig] = useState<TextConfig>(
    template?.nameConfig && Object.keys(template.nameConfig).length > 0 ? template.nameConfig : DEFAULT_NAME
  )
  const [quote, setQuote] = useState<QuoteConfig>(
    template?.quote && Object.keys(template.quote).length > 0 ? template.quote : DEFAULT_QUOTE
  )

  // Test data for preview
  const [testName, setTestName] = useState('John Doe')
  const [testQuote, setTestQuote] = useState('Wishing you all the happiness in the world on your special day!')
  const [testImage, setTestImage] = useState<File | null>(null)
  const [testImagePreview, setTestImagePreview] = useState('')

  // Generated preview
  const [previewUrl, setPreviewUrl] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const testImageInputRef = useRef<HTMLInputElement>(null)

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleTestImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setTestImage(file)
      setTestImagePreview(URL.createObjectURL(file))
    }
  }

  const handlePreview = useCallback(async () => {
    if (!template?.id) return

    const fd = new FormData()
    fd.append('name', testName)
    fd.append('quote', testQuote)
    fd.append('photo', JSON.stringify(photo))
    fd.append('greeting', JSON.stringify(greeting))
    fd.append('nameConfig', JSON.stringify(nameConfig))
    fd.append('quoteConfig', JSON.stringify(quote))
    if (testImage) fd.append('testImage', testImage)

    const result = await previewTemplate({ id: template.id, data: fd })
    if ('data' in result && result.data) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(result.data)
    }
  }, [template, testName, testQuote, testImage, photo, greeting, nameConfig, quote, previewTemplate, previewUrl])

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return

    const fd = new FormData()
    fd.append('name', name)
    fd.append('active', String(active))
    fd.append('photo', JSON.stringify(photo))
    fd.append('greeting', JSON.stringify(greeting))
    fd.append('nameConfig', JSON.stringify(nameConfig))
    fd.append('quote', JSON.stringify(quote))

    if (imageFile) {
      fd.append('image', imageFile)
    } else if (!isEdit) {
      return // Image required for create
    }

    if (isEdit && template) {
      const result = await updateTemplate({ id: template.id, data: fd })
      if (!('error' in result)) onClose()
    } else {
      const result = await createTemplate(fd)
      if (!('error' in result)) onClose()
    }
  }, [name, active, photo, greeting, nameConfig, quote, imageFile, isEdit, template, createTemplate, updateTemplate, onClose])

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary btn-sm" onClick={onClose} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <h4 className="fw-bold mb-0">{isEdit ? 'Edit Template' : 'Create Template'}</h4>
      </div>

      <div className="row g-4">
        {/* Left: Controls */}
        <div className="col-12 col-lg-7">
          {/* Basic Info */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Basic Info</h6>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label small fw-medium">Template Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elegant Purple"
                  />
                </div>
                <div className="col-12 col-md-4 d-flex align-items-end">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="templateActive"
                      checked={active}
                      onChange={(e) => setActive(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="templateActive">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Template Image Upload */}
              <div className="mt-3">
                <label className="form-label small fw-medium">
                  Background Image {!isEdit && <span className="text-danger">*</span>}
                </label>
                <div className="d-flex align-items-center gap-3">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Template preview"
                      className="rounded border"
                      style={{ width: 80, height: 80, objectFit: 'cover' }}
                    />
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} className="me-1" />
                    {imagePreview ? 'Change' : 'Upload'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Config */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Photo Position & Style</h6>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <label className="form-label small">X Position</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={photo.cx ?? 0.5}
                    onChange={(e) => setPhoto((p) => ({ ...p, cx: +e.target.value }))}
                  />
                  <small className="text-muted">{(photo.cx ?? 0.5).toFixed(2)}</small>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Y Position</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={photo.cy ?? 0.38}
                    onChange={(e) => setPhoto((p) => ({ ...p, cy: +e.target.value }))}
                  />
                  <small className="text-muted">{(photo.cy ?? 0.38).toFixed(2)}</small>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Size</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0.1"
                    max="0.8"
                    step="0.01"
                    value={photo.size ?? 0.4}
                    onChange={(e) => setPhoto((p) => ({ ...p, size: +e.target.value }))}
                  />
                  <small className="text-muted">{(photo.size ?? 0.4).toFixed(2)}</small>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Shape</label>
                  <select
                    className="form-select form-select-sm"
                    value={photo.shape ?? 'circle'}
                    onChange={(e) => setPhoto((p) => ({ ...p, shape: e.target.value as 'circle' | 'rounded' | 'square' }))}
                  >
                    <option value="circle">Circle</option>
                    <option value="rounded">Rounded</option>
                    <option value="square">Square</option>
                  </select>
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label small">Align</label>
                  <select
                    className="form-select form-select-sm"
                    value={photo.align ?? 'center'}
                    onChange={(e) => setPhoto((p) => ({ ...p, align: e.target.value as 'left' | 'center' | 'right' }))}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label small">Border Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={photo.borderColor ?? '#000000'}
                    onChange={(e) => setPhoto((p) => ({ ...p, borderColor: e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-4">
                  <label className="form-label small">Border Width</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="0"
                    max="20"
                    value={photo.borderWidth ?? 4}
                    onChange={(e) => setPhoto((p) => ({ ...p, borderWidth: +e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Greeting Config */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Greeting Text</h6>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label small">Text</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={greeting.text ?? 'Happy Birthday!'}
                    onChange={(e) => setGreeting((g) => ({ ...g, text: e.target.value }))}
                    placeholder="Happy Birthday!"
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Font Size</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="0"
                    max="120"
                    value={greeting.fontSize ?? 60}
                    onChange={(e) => setGreeting((g) => ({ ...g, fontSize: +e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={greeting.color ?? '#FFFFFF'}
                    onChange={(e) => setGreeting((g) => ({ ...g, color: e.target.value }))}
                  />
                </div>
                <div className="col-4">
                  <label className="form-label small">X Position</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={greeting.cx ?? 0.5}
                    onChange={(e) => setGreeting((g) => ({ ...g, cx: +e.target.value }))}
                  />
                  <small className="text-muted">{(greeting.cx ?? 0.5).toFixed(2)}</small>
                </div>
                <div className="col-4">
                  <label className="form-label small">Y Position</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={greeting.cy ?? 0.05}
                    onChange={(e) => setGreeting((g) => ({ ...g, cy: +e.target.value }))}
                  />
                  <small className="text-muted">{(greeting.cy ?? 0.05).toFixed(2)}</small>
                </div>
                <div className="col-4 d-flex flex-column">
                  <label className="form-label small">Style</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="greetingBold"
                        checked={greeting.bold ?? true}
                        onChange={(e) => setGreeting((g) => ({ ...g, bold: e.target.checked }))}
                      />
                      <label className="form-check-label small" htmlFor="greetingBold">
                        Bold
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <label className="form-label small">Align</label>
                  <select
                    className="form-select form-select-sm"
                    value={greeting.align ?? 'center'}
                    onChange={(e) => setGreeting((g) => ({ ...g, align: e.target.value as 'left' | 'center' | 'right' }))}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Name Config */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Name Text</h6>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <label className="form-label small">Font Size</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="10"
                    max="120"
                    value={nameConfig.fontSize ?? 54}
                    onChange={(e) => setNameConfig((n) => ({ ...n, fontSize: +e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={nameConfig.color ?? '#FFFFFF'}
                    onChange={(e) => setNameConfig((n) => ({ ...n, color: e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">X Position</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={nameConfig.cx ?? 0.5}
                    onChange={(e) => setNameConfig((n) => ({ ...n, cx: +e.target.value }))}
                  />
                  <small className="text-muted">{(nameConfig.cx ?? 0.5).toFixed(2)}</small>
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Y Position</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={nameConfig.cy ?? 0.6}
                    onChange={(e) => setNameConfig((n) => ({ ...n, cy: +e.target.value }))}
                  />
                  <small className="text-muted">{(nameConfig.cy ?? 0.6).toFixed(2)}</small>
                </div>
                <div className="col-6">
                  <label className="form-label small">Align</label>
                  <select
                    className="form-select form-select-sm"
                    value={nameConfig.align ?? 'center'}
                    onChange={(e) => setNameConfig((n) => ({ ...n, align: e.target.value as 'left' | 'center' | 'right' }))}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="col-6 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="nameBold"
                      checked={nameConfig.bold ?? true}
                      onChange={(e) => setNameConfig((n) => ({ ...n, bold: e.target.checked }))}
                    />
                    <label className="form-check-label small" htmlFor="nameBold">
                      Bold
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Config */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Quote Text</h6>
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <label className="form-label small">Font Size</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="10"
                    max="80"
                    value={quote.fontSize ?? 35}
                    onChange={(e) => setQuote((q) => ({ ...q, fontSize: +e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Color</label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    value={quote.color ?? '#FFFFFF'}
                    onChange={(e) => setQuote((q) => ({ ...q, color: e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label small">Max Width</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    min="200"
                    max="1000"
                    step="10"
                    value={quote.maxWidth ?? 700}
                    onChange={(e) => setQuote((q) => ({ ...q, maxWidth: +e.target.value }))}
                  />
                </div>
                <div className="col-6 col-md-3 d-flex align-items-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="quoteBold"
                      checked={quote.bold ?? false}
                      onChange={(e) => setQuote((q) => ({ ...q, bold: e.target.checked }))}
                    />
                    <label className="form-check-label small" htmlFor="quoteBold">
                      Bold
                    </label>
                  </div>
                </div>
                <div className="col-4">
                  <label className="form-label small">X Position</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={quote.cx ?? 0.5}
                    onChange={(e) => setQuote((q) => ({ ...q, cx: +e.target.value }))}
                  />
                  <small className="text-muted">{(quote.cx ?? 0.5).toFixed(2)}</small>
                </div>
                <div className="col-4">
                  <label className="form-label small">Y Position</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={quote.cy ?? 0.68}
                    onChange={(e) => setQuote((q) => ({ ...q, cy: +e.target.value }))}
                  />
                  <small className="text-muted">{(quote.cy ?? 0.68).toFixed(2)}</small>
                </div>
                <div className="col-4">
                  <label className="form-label small">Align</label>
                  <select
                    className="form-select form-select-sm"
                    value={quote.align ?? 'center'}
                    onChange={(e) => setQuote((q) => ({ ...q, align: e.target.value as 'left' | 'center' | 'right' }))}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview & Test Data */}
        <div className="col-12 col-lg-5">
          <div className="position-sticky" style={{ top: '1rem' }}>
            {/* Test Data Inputs */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <h6 className="fw-semibold mb-3">Test Data (for Preview)</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small">Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder="Employee name"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small">Quote</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows={2}
                      value={testQuote}
                      onChange={(e) => setTestQuote(e.target.value)}
                      placeholder="Birthday wish quote"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small">Test Photo</label>
                    <div className="d-flex align-items-center gap-2">
                      {testImagePreview && (
                        <img
                          src={testImagePreview}
                          alt="Test"
                          className="rounded-circle border"
                          style={{ width: 40, height: 40, objectFit: 'cover' }}
                        />
                      )}
                      <input
                        ref={testImageInputRef}
                        type="file"
                        accept="image/*"
                        className="d-none"
                        onChange={handleTestImageChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => testImageInputRef.current?.click()}
                      >
                        <Upload size={14} className="me-1" />
                        {testImagePreview ? 'Change' : 'Upload'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Button */}
            {isEdit && (
              <Button
                variant="btn-info"
                className="w-100 mb-3 py-2"
                loading={isPreviewing}
                onClick={handlePreview}
              >
                <Eye size={16} />
                Generate Preview
              </Button>
            )}

            {/* Preview Image */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body p-2">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Generated preview"
                    className="w-100 rounded"
                  />
                ) : imagePreview ? (
                  <div className="position-relative">
                    <img
                      src={imagePreview}
                      alt="Template background"
                      className="w-100 rounded opacity-75"
                    />
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <p className="text-muted small mb-0">
                        {isEdit ? 'Click "Generate Preview" to see the card' : 'Save template first to preview'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center rounded bg-light"
                    style={{ height: 300 }}
                  >
                    <p className="text-muted mb-0">Upload a background image to begin</p>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <Button
              variant="btn-info"
              className="w-100 py-2"
              loading={isCreating || isUpdating}
              onClick={handleSubmit}
              disabled={!name.trim() || (!isEdit && !imageFile)}
            >
              <Save size={16} />
              {isEdit ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateEditor
