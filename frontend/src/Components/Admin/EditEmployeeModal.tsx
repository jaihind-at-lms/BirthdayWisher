import { useCallback, useState, useEffect, useRef } from 'react'
import { Modal as BsModal } from 'bootstrap'
import { useForm } from 'react-hook-form'

import Input from '@project/Components/Form/Input'
import Select from '@project/Components/Form/Select'
import FileInput from '@project/Components/Form/FileInput'
import Button from '@project/Components/Form/Button'
import SelectOrInput from '@project/Components/Form/SelectOrInput'
import EmployeeAvatar from '@project/Components/UI/EmployeeAvatar'
import { getEmployeeImageUrl } from '@project/Utils/imageHelper'
import { env } from '@project/Utils/envValidation'
import {
  useUpdateEmployeeMutation,
  useUploadEmployeePhotoMutation,
  useGetSheetRecordsQuery,
} from '@project/Store/Api'
import type { Employee } from '@project/Types/Features/employee'

export const EDIT_MODAL_ID = 'editEmployeeModal'
const TITLE_OPTIONS = ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof']

interface EditFormValues {
  title: string
  name: string
  email: string
  employeeId: string
  department: string
  designation: string
  dateOfBirth: string
}

function getEmployeeName(emp: Employee): string {
  const title = emp['Title'] || emp['title'] || ''
  const name = emp['Employee Name'] || emp['Employee name'] || emp['Name'] || emp['name'] || '-'
  return title ? `${title}. ${name}` : name
}

const EditEmployeeModal = ({
  employee,
  onClose,
}: {
  employee: Employee | null
  onClose: () => void
}) => {
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation()
  const [uploadPhoto, { isLoading: isUploading }] = useUploadEmployeePhotoMutation()
  const [photo, setPhoto] = useState<File | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const { data: deptRecords } = useGetSheetRecordsQuery(env.VITE_SHEET_DEPARTMENTS_TAB)
  const { data: desigRecords } = useGetSheetRecordsQuery(env.VITE_SHEET_DESIGNATIONS_TAB)

  const departmentOptions = [...new Set((deptRecords ?? []).map((r) => Object.values(r).find(Boolean) ?? '').filter(Boolean))]
  const designationOptions = [...new Set((desigRecords ?? []).map((r) => Object.values(r).find(Boolean) ?? '').filter(Boolean))]

  const getDefaults = useCallback((): EditFormValues => ({
    title: employee?.['Title'] || '',
    name: employee?.['Employee Name'] || employee?.['Name'] || '',
    email: employee?.['Email'] || '',
    employeeId: employee?.['Employee ID'] || employee?.['Employee Id'] || '',
    department: employee?.['Department'] || '',
    designation: employee?.['Designation'] || '',
    dateOfBirth: employee?.['Date of Birth'] || employee?.['Birthday'] || employee?.['DOB'] || '',
  }), [employee])

  const { register, handleSubmit, reset, watch, setValue } = useForm<EditFormValues>({
    defaultValues: getDefaults(),
  })

  useEffect(() => {
    if (employee) reset(getDefaults())
  }, [employee])

  useEffect(() => {
    if (!modalRef.current) return
    const modal = BsModal.getOrCreateInstance(modalRef.current)
    if (employee) modal.show()
    else modal.hide()
  }, [employee])

  const onSubmit = useCallback(async (values: EditFormValues) => {
    if (!employee) return
    const empId = employee['Employee ID'] || employee['Employee Id'] || employee['employee id'] || ''
    const data: Record<string, string> = {
      'Title': values.title,
      'Employee Name': values.name,
      'Email': values.email,
      'Employee ID': values.employeeId,
      'Department': values.department,
      'Designation': values.designation,
      'Date of Birth': values.dateOfBirth,
    }
    await updateEmployee({ id: empId, data })
    if (photo) {
      await uploadPhoto({ id: empId, photo })
    }
    setPhoto(null)
    onClose()
  }, [employee, updateEmployee, uploadPhoto, photo, onClose])

  const name = employee ? getEmployeeName(employee) : ''
  const imageUrl = employee ? getEmployeeImageUrl(employee) : ''

  return (
    <div ref={modalRef} className="modal fade" id={EDIT_MODAL_ID} tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          {employee ? (<>
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <EmployeeAvatar name={name} imageUrl={imageUrl} size={28} />
              Edit — {name}
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
                  <label className="form-label fw-semibold small text-secondary">Name <span className="text-danger">*</span></label>
                  <Input type="text" registration={register('name', { required: 'Name is required' })}
                    className="form-control-sm" placeholder="Full name" />
                </div>
                <div className="col-md-5">
                  <label className="form-label fw-semibold small text-secondary">Email <span className="text-danger">*</span></label>
                  <Input type="email" registration={register('email', { required: 'Email is required' })}
                    className="form-control-sm" placeholder="Email address" />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Employee ID <span className="text-danger">*</span></label>
                  <Input type="text" registration={register('employeeId', { required: 'Employee ID is required' })}
                    className="form-control-sm" placeholder="Employee ID" />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Date of Birth <span className="text-danger">*</span></label>
                  <Input type="date" registration={register('dateOfBirth', { required: 'Date of birth is required' })}
                    className="form-control-sm" />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Department <span className="text-danger">*</span></label>
                  <SelectOrInput
                    value={watch('department')}
                    onChange={(v) => setValue('department', v)}
                    options={departmentOptions}
                    placeholder="Select department" />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold small text-secondary">Designation <span className="text-danger">*</span></label>
                  <SelectOrInput
                    value={watch('designation')}
                    onChange={(v) => setValue('designation', v)}
                    options={designationOptions}
                    placeholder="Select designation" />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold small text-secondary">Photo</label>
                  <FileInput value={photo} onChange={setPhoto} />
                  {!photo && imageUrl && (
                    <div className="mt-2">
                      <EmployeeAvatar name={name} imageUrl={imageUrl} size={40} />
                      <span className="text-secondary small ms-2">Current photo</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer border-top">
              <button type="button" className="btn btn-outline-secondary px-4 py-3 fw-semibold shadow-sm" style={{ minWidth: 120 }} onClick={onClose}>
                Cancel
              </button>
              <Button type="submit" loading={isUpdating || isUploading} variant="btn-info" className="px-4" style={{ minWidth: 120 }}>
                <span className="text-white">Save Changes</span>
              </Button>
            </div>
          </form>
          </>) : null}
        </div>
      </div>
    </div>
  )
}

export default EditEmployeeModal
