import { useCallback, useState, useEffect, useRef } from 'react'
import { Pencil, Plus, Search, X } from 'lucide-react'
import { Modal as BsModal } from 'bootstrap'
import { useForm } from 'react-hook-form'
import type { JSX } from 'react'

import Spinner from '@project/Components/UI/Spinner'
import Input from '@project/Components/Form/Input'
import Button from '@project/Components/Form/Button'
import EmployeeAvatar from '@project/Components/UI/EmployeeAvatar'
import AddEmployeeModal from '@project/Components/Employee/AddEmployeeModal'
import { getEmployeeImageUrl } from '@project/Utils/imageHelper'
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
} from '@project/Store/Api'
import type { Employee } from '@project/Types/Features/employee'

const EDIT_MODAL_ID = 'editEmployeeModal'

const IMG_KEYS = new Set([
  'employee image', 'employee photo', 'image', 'photo',
])

function getEditableFields(emp: Employee): [string, string][] {
  return Object.entries(emp).filter(([k]) => !IMG_KEYS.has(k.toLowerCase().trim()))
}

function getEmployeeName(emp: Employee): string {
  const title = emp['Title'] || emp['title'] || ''
  const name = emp['Employee Name'] || emp['Employee name'] || emp['Name'] || emp['name'] || '-'
  return title ? `${title}. ${name}` : name
}

function getEmployeeId(emp: Employee): string {
  return emp['Employee ID'] || emp['Employee Id'] || emp['employee id'] || emp['ID'] || emp['id'] || ''
}

const columns = [
  { key: 'Employee ID', label: 'ID', width: 100 },
  { key: 'Employee Name', label: 'Name', width: 200 },
  { key: 'Email', label: 'Email', width: 220 },
  { key: 'Department', label: 'Department', width: 140 },
  { key: 'Designation', label: 'Designation', width: 160 },
  { key: 'Birthday', label: 'Birthday', width: 120 },
]

const EditEmployeeModal = ({
  employee,
  onClose,
}: {
  employee: Employee | null
  onClose: () => void
}) => {
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation()
  const modalRef = useRef<HTMLDivElement>(null)

  const fields = employee ? getEditableFields(employee) : []
  const defaultValues = Object.fromEntries(
    fields.map(([k]) => [k, employee?.[k] ?? ''])
  )

  const { register, handleSubmit, reset } = useForm<Record<string, string>>({
    defaultValues,
  })

  useEffect(() => {
    if (employee) reset(defaultValues)
  }, [employee])

  useEffect(() => {
    if (!modalRef.current) return
    const modal = BsModal.getOrCreateInstance(modalRef.current)
    if (employee) modal.show()
    else modal.hide()
    return () => { modal.dispose() }
  }, [employee])

  const onSubmit = useCallback(
    async (values: Record<string, string>) => {
      if (!employee) return
      const empId = getEmployeeId(employee)
      await updateEmployee({ id: empId, data: values })
      onClose()
    },
    [employee, updateEmployee, onClose]
  )

  if (!employee) return null

  return (
    <div ref={modalRef} className="modal fade" id={EDIT_MODAL_ID} tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <EmployeeAvatar name={getEmployeeName(employee)} imageUrl={getEmployeeImageUrl(employee)} size={28} />
              Edit — {getEmployeeName(employee)}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
          </div>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}>
            <div className="modal-body">
              <div className="row g-3">
                {fields.map(([key]) => (
                  <div className="col-md-6" key={key}>
                    <label className="form-label fw-semibold small text-secondary">{key}</label>
                    <Input
                      type="text"
                      registration={register(key)}
                      className="form-control-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer border-top">
              <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal" onClick={onClose}>
                Cancel
              </button>
              <Button type="submit" loading={isLoading} variant="btn-info">
                <span className="text-white">Save Changes</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const UserManagementPage = (): JSX.Element => {
  const { data: rawEmployees, isLoading, isError, error } = useGetEmployeesQuery(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const employees = rawEmployees ?? []

  const filtered = employees.filter((emp) => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return Object.values(emp).some((v) => v?.toLowerCase().includes(q))
  })

  if (isLoading) return <Spinner />

  if (isError) {
    return (
      <div className="alert alert-danger">
        Failed to load employees. {(error as { message?: string })?.message ?? 'Please try again.'}
      </div>
    )
  }

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 flex-shrink-0">
        <div>
          <h4 className="fw-bold mb-1">Employees</h4>
          <p className="text-secondary mb-0 small">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
            <input
              type="text"
              className="form-control form-control-sm ps-5 rounded-pill border-light"
              style={{ width: 260 }}
              placeholder="Search by name, email, department…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value) }}
            />
            {searchTerm && (
              <button className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-secondary pe-3 py-0"
                onClick={() => { setSearchTerm('') }}>
                <X size={14} />
              </button>
            )}
          </div>
          <button
            className="btn btn-info btn-sm text-white d-flex align-items-center gap-1 rounded-pill px-3"
            onClick={() => { setShowAddModal(true) }}
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
      </div>

      <div className="flex-grow-1 overflow-y-auto">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4 py-3 small fw-semibold text-uppercase text-secondary" style={{ width: 220 }}>
                      Employee
                    </th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary" style={{ width: 100 }}>ID</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary">Email</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary" style={{ width: 130 }}>Department</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary" style={{ width: 150 }}>Designation</th>
                    <th className="text-end pe-4 py-3 small fw-semibold text-uppercase text-secondary" style={{ width: 100 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((emp, i) => {
                      const empId = getEmployeeId(emp)
                      const name = getEmployeeName(emp)
                      const imageUrl = getEmployeeImageUrl(emp)
                      return (
                        <tr key={empId || i} className="border-bottom border-light">
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <EmployeeAvatar name={name} imageUrl={imageUrl} size={40} />
                              <div>
                                <div className="fw-semibold">{name}</div>
                                {emp['Username'] && (
                                  <div className="text-secondary" style={{ fontSize: 12 }}>
                                    @{emp['Username']}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-secondary py-3">{empId}</td>
                          <td className="text-secondary py-3">{emp['Email'] || emp['email'] || '-'}</td>
                          <td className="py-3">
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                              {emp['Department'] || emp['department'] || '-'}
                            </span>
                          </td>
                          <td className="text-secondary py-3">{emp['Designation'] || emp['designation'] || '-'}</td>
                          <td className="text-end pe-4 py-3">
                            <button
                              className="btn btn-outline-info btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3"
                              onClick={() => { setSelectedEmployee(emp) }}
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-secondary py-5">
                        <Search size={32} className="mb-2 text-secondary opacity-25" />
                        <p className="mb-0">No employees found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <EditEmployeeModal
        employee={selectedEmployee}
        onClose={() => { setSelectedEmployee(null) }}
      />

      <AddEmployeeModal
        show={showAddModal}
        onClose={() => { setShowAddModal(false) }}
      />
    </div>
  )
}

export default UserManagementPage
