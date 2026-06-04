import { useCallback, useState, useEffect, useRef } from 'react'
import { Modal as BsModal } from 'bootstrap'
import type { JSX } from 'react'

import { useUploadEmployeePhotoMutation } from '@project/Store/Api'
import type { Employee } from '@project/Types/Features/employee'

export const CHANGE_IMAGE_MODAL_ID = 'changeImageModal'

interface ChangeImageModalProps {
  employee: Employee | null
  onClose: () => void
}

const ChangeImageModal = ({ employee, onClose }: ChangeImageModalProps): JSX.Element => {
  const [uploadPhoto, { isLoading }] = useUploadEmployeePhotoMutation()
  const [file, setFile] = useState<File | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const previewUrl = file ? URL.createObjectURL(file) : null

  useEffect(() => {
    if (!modalRef.current) return
    const modal = BsModal.getOrCreateInstance(modalRef.current)
    if (employee) modal.show()
    else modal.hide()
  }, [employee])

  const handleSubmit = useCallback(async () => {
    if (!employee || !file) return
    const empId = employee.employeeId || ''
    await uploadPhoto({ id: empId, photo: file })
    setFile(null)
    onClose()
  }, [employee, file, uploadPhoto, onClose])

  const name = employee?.name || ''

  return (
    <div ref={modalRef} className="modal fade" id={CHANGE_IMAGE_MODAL_ID} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content border-0 shadow">
          {employee ? (
            <>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Change Photo</h5>
                <button type="button" className="btn-close" onClick={onClose} />
              </div>
              <div className="modal-body">
                {(previewUrl || file) && (
                  <div className="text-center mb-3">
                    <img
                      src={previewUrl!}
                      alt={name}
                      className="rounded-3 border object-fit-cover"
                      width={80}
                      height={80}
                    />
                  </div>
                )}
                <p className="text-secondary mb-3">
                  Upload new photo for <strong>{name}</strong>
                </p>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Photo</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] ?? null)
                    }}
                  />
                </div>
                <div className="d-flex gap-2 justify-content-end">
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-info btn-sm text-white d-flex align-items-center gap-1"
                    disabled={isLoading || !file}
                    onClick={handleSubmit}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" /> Uploading…
                      </>
                    ) : (
                      'Upload'
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ChangeImageModal
