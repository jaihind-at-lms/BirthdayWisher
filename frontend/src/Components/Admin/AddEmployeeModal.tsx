import { useState, useEffect, useRef, useCallback } from 'react'
import { Modal as BsModal } from 'bootstrap'
import { useForm } from 'react-hook-form'
import { Plus } from 'lucide-react'
import type { JSX } from 'react'

import Input from '@project/Components/Form/Input'
import Select from '@project/Components/Form/Select'
import TextArea from '@project/Components/Form/TextArea'
import Checkbox from '@project/Components/Form/Checkbox'
import FileInput from '@project/Components/Form/FileInput'
import Button from '@project/Components/Form/Button'
import SelectOrInput from '@project/Components/Form/SelectOrInput'
import { env } from '@project/Utils/envValidation'
import {
  useCreateEmployeeMutation,
  useGetSheetRecordsQuery,
} from '@project/Store/Api'

interface FormValues {
  title: string
  name: string
  email: string
  employeeId: string
  department: string
  designation: string
  dateOfBirth: string
  sendWelcomeEmail: boolean
  welcomeTextLine1: string
  welcomeTextLine2: string
}

interface AddEmployeeModalProps {
  show: boolean
  onClose: () => void
}

const MODAL_ID = 'addEmployeeModal'

const TITLE_OPTIONS = ['Mr', 'Ms']

const AddEmployeeModal = ({ show, onClose }: AddEmployeeModalProps): JSX.Element => {
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation()
  const [photo, setPhoto] = useState<File | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const modalRef = useRef<HTMLDivElement>(null)

  const { data: deptRecords } = useGetSheetRecordsQuery(env.VITE_SHEET_DEPARTMENTS_TAB)
  const { data: desigRecords } = useGetSheetRecordsQuery(env.VITE_SHEET_DESIGNATIONS_TAB)

  const departmentOptions = [...new Set((deptRecords ?? []).map((r) => Object.values(r).find(Boolean) ?? '').filter(Boolean))]
  const designationOptions = [...new Set((desigRecords ?? []).map((r) => Object.values(r).find(Boolean) ?? '').filter(Boolean))]

  const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      title: '',
      name: '',
      email: '',
      employeeId: '',
      department: '',
      designation: '',
      dateOfBirth: '',
      sendWelcomeEmail: false,
      welcomeTextLine1: '',
      welcomeTextLine2: '',
    },
  })

  const sendWelcomeEmail = watch('sendWelcomeEmail')

  useEffect(() => {
    if (!modalRef.current) return
    const modal = BsModal.getOrCreateInstance(modalRef.current)
    if (show) modal.show()
    else modal.hide()
  }, [show])

  const onSubmit = useCallback(async (values: FormValues) => {
    const errs: Partial<Record<keyof FormValues, string>> = {}
    if (!values.department) errs.department = 'Department is required'
    if (!values.designation) errs.designation = 'Designation is required'
    if (!photo) errs.photo = 'Photo is required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    const fd = new FormData()
    fd.append('title', values.title)
    fd.append('name', values.name)
    fd.append('email', values.email)
    fd.append('employeeId', values.employeeId)
    fd.append('department', values.department)
    fd.append('designation', values.designation)
    fd.append('dateOfBirth', values.dateOfBirth)
    if (photo) fd.append('photo', photo)
    fd.append('sendWelcomeEmail', values.sendWelcomeEmail ? 'true' : 'false')
    if (values.welcomeTextLine1) fd.append('welcomeTextLine1', values.welcomeTextLine1)
    if (values.welcomeTextLine2) fd.append('welcomeTextLine2', values.welcomeTextLine2)
    await createEmployee(fd)
    reset()
    setPhoto(null)
    setErrors({})
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
                  <Select registration={register('title', { required: 'Title is required' })} placeholder="Select title">
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
                    registration={register('name', { required: 'Name is required' })}
                    className="form-control-sm"
                    placeholder="Full name"
                  />
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-semibold small text-secondary">
                    Email <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="email"
                    registration={register('email', { required: 'Email is required' })}
                    className="form-control-sm"
                    placeholder="Email address"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">
                    Employee ID <span className="text-danger">*</span>
                  </label>
                  <Input
                    type="text"
                    registration={register('employeeId', { required: 'Employee ID is required' })}
                    className="form-control-sm"
                    placeholder="Employee ID"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Date of Birth <span className="text-danger">*</span></label>
                  <Input
                    type="date"
                    registration={register('dateOfBirth', { required: 'Date of birth is required' })}
                    className="form-control-sm"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Department <span className="text-danger">*</span></label>
                  <SelectOrInput
                    value={watch('department')}
                    onChange={(v) => { setValue('department', v); setErrors((p) => { const n = { ...p }; delete n.department; return n }) }}
                    options={departmentOptions}
                    placeholder="Select department"
                    error={errors.department ? { message: errors.department, type: 'required' } : undefined}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Designation <span className="text-danger">*</span></label>
                  <SelectOrInput
                    value={watch('designation')}
                    onChange={(v) => { setValue('designation', v); setErrors((p) => { const n = { ...p }; delete n.designation; return n }) }}
                    options={designationOptions}
                    placeholder="Select designation"
                    error={errors.designation ? { message: errors.designation, type: 'required' } : undefined}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">Photo <span className="text-danger">*</span></label>
                  <FileInput value={photo} onChange={(f) => { setPhoto(f); setErrors((p) => { const n = { ...p }; delete n.photo; return n }) }} />
                  {errors.photo && <div className="invalid-feedback d-block">{errors.photo}</div>}
                </div>
                <div className="col-12">
                  <div className="border-top pt-3">
                    <Checkbox id="sendWelcomeEmail" registration={register('sendWelcomeEmail')}>
                      Do you want to send welcome email?
                    </Checkbox>
                  </div>
                </div>
                {sendWelcomeEmail && (
                  <>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-secondary">Welcome Text Line 1</label>
                      <TextArea
                        registration={register('welcomeTextLine1')}
                        placeholder="First line of welcome message…"
                        rows={3}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small text-secondary">Welcome Text Line 2</label>
                      <TextArea
                        registration={register('welcomeTextLine2')}
                        placeholder="Second line of welcome message…"
                        rows={3}
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
