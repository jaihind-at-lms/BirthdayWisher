import { useState, useEffect, useRef, useCallback } from 'react'
import { Modal as BsModal } from 'bootstrap'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import type { JSX } from 'react'

import Input from '@project/Components/Form/Input'
import Select from '@project/Components/Form/Select'
import TextArea from '@project/Components/Form/TextArea'
import Checkbox from '@project/Components/Form/Checkbox'
import FileInput from '@project/Components/Form/FileInput'
import Button from '@project/Components/Form/Button'
import SelectOrInput from '@project/Components/Form/SelectOrInput'
import {
  useCreateEmployeeMutation,
  useGetSheetRecordsQuery,
} from '@project/Store/Api'
import { addEmployeeSchema } from '@project/Schemas/employee.schema'
import { date18YearsAgo } from '@project/Utils/dateUtils'
import type { AddEmployeeFormValues } from '@project/Schemas/employee.schema'

interface AddEmployeeModalProps {
  show: boolean
  onClose: () => void
}

const MODAL_ID = 'addEmployeeModal'

const TITLE_OPTIONS = ['Mr', 'Ms']

const AddEmployeeModal = ({ show, onClose }: AddEmployeeModalProps): JSX.Element => {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation()
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const { data: departmentOptions } = useGetSheetRecordsQuery('departments')
  const { data: designationOptions } = useGetSheetRecordsQuery('designations')

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<AddEmployeeFormValues>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      title: '',
      name: '',
      email: '',
      employeeId: '',
      department: '',
      designation: '',
      dateOfBirth: '',
      sendWelcome: false,
      welcomeTextLine1: '',
      welcomeTextLine2: '',
    },
  })

  const sendWelcome = watch('sendWelcome')
  const maxDateOfBirth = date18YearsAgo()

  useEffect(() => {
    if (!modalRef.current) return
    const modal = BsModal.getOrCreateInstance(modalRef.current)
    if (show) modal.show()
    else modal.hide()
  }, [show])

  const onSubmit = useCallback(async (values: AddEmployeeFormValues) => {
    if (!photo) {
      setPhotoError('Photo is required')
      return
    }
    setPhotoError(null)

    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('name', values.name)
    fd.append('email', values.email)
    fd.append('employeeId', values.employeeId)
    fd.append('department', values.department)
    fd.append('designation', values.designation)
    fd.append('dateOfBirth', values.dateOfBirth)
    fd.append('photo', photo)
    fd.append('sendWelcome', values.sendWelcome ? 'true' : 'false')
    if (values.welcomeTextLine1) fd.append('welcomeTextLine1', values.welcomeTextLine1)
    if (values.welcomeTextLine2) fd.append('welcomeTextLine2', values.welcomeTextLine2)
    const result = await createEmployee(fd)
    if (result.error) return
    reset()
    setPhoto(null)
    setPhotoError(null)
    onClose()
  }, [photo, createEmployee, reset, onClose])

  return (
    <div ref={modalRef} className="modal fade" id={MODAL_ID} tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Plus size={20} />
              Add New Employee
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}>
            <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="form-label fw-semibold small text-secondary">Title <span className="text-danger">*</span></label>
                  <Select registration={register('title')} placeholder="Select title" className="form-select-sm" error={errors.title}>
                    {TITLE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </Select>
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-semibold small text-secondary">
                    Name <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="text"
                    registration={register('name')}
                    className="form-control-sm"
                    placeholder="Full name"
                    error={errors.name}
                    maxLength={50}
                  />
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-semibold small text-secondary">
                    Email <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="email"
                    registration={register('email')}
                    className="form-control-sm"
                    placeholder="Email address"
                    error={errors.email}
                    maxLength={60}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">
                    Employee ID <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="text"
                    registration={register('employeeId', { setValueAs: (v: string) => v.toUpperCase() })}
                    className="form-control-sm text-uppercase"
                    placeholder="Employee ID"
                    error={errors.employeeId}
                    maxLength={10}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Date of Birth <span className="text-danger">*</span></label>
                  <Input
                    type="date"
                    registration={register('dateOfBirth')}
                    className="form-control-sm"
                    error={errors.dateOfBirth}
                    maxLength={10}
                    max={maxDateOfBirth}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Department <span className="text-danger">*</span></label>
                  <SelectOrInput
                    value={watch('department')}
                    onChange={(v) => { setValue('department', v, { shouldValidate: true }) }}
                    options={departmentOptions || []}
                    placeholder="Select department"
                    error={errors.department}
                    className="form-select-sm"
                    maxLength={100}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Designation <span className="text-danger">*</span></label>
                  <SelectOrInput
                    value={watch('designation')}
                    onChange={(v) => { setValue('designation', v, { shouldValidate: true }) }}
                    options={designationOptions || []}
                    placeholder="Select designation"
                    error={errors.designation}
                    className="form-select-sm"
                    maxLength={100}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">Photo <span className="text-danger">*</span></label>
                  <FileInput value={photo} onChange={(f) => { setPhoto(f); setPhotoError(null) }} compact />
                  {photoError && <div className="invalid-feedback d-block">{photoError}</div>}
                </div>
                <div className="col-12">
                  <div className="border-top pt-3">
                    <Checkbox id="sendWelcome" registration={register('sendWelcome')}>
                      Do you want to send welcome email?
                    </Checkbox>
                  </div>
                </div>
                {sendWelcome && (
                  <>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-secondary">Welcome Text Line 1</label>
                      <TextArea
                        registration={register('welcomeTextLine1')}
                        placeholder="First line of welcome message…"
                        rows={3}
                        className="form-control-sm"
                        maxLength={500}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-secondary">Welcome Text Line 2</label>
                      <TextArea
                        registration={register('welcomeTextLine2')}
                        placeholder="Second line of welcome message…"
                        rows={3}
                        className="form-control-sm"
                        maxLength={500}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer border-top">
              <button type="button" className="btn btn-outline-secondary px-4 py-3 fw-semibold shadow-sm" style={{ minWidth: 120 }} onClick={onClose}>
                Cancel
              </button>
              <Button type="submit" loading={isLoading} variant="btn-info" className="px-4" style={{ minWidth: 120 }}>
                <span className="text-white">Create Employee</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddEmployeeModal
