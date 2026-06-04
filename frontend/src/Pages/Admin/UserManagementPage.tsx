import { useState, useRef, useEffect, useCallback } from 'react'
import { Pencil, Plus, Search, X, Trash2 } from 'lucide-react'
import { Modal as BsModal } from 'bootstrap'
import type { JSX } from 'react'

import Spinner from '@project/Components/UI/Spinner'
import EmployeeAvatar from '@project/Components/UI/EmployeeAvatar'
import AddEmployeeModal from '@project/Components/Admin/AddEmployeeModal'
import EditEmployeeModal from '@project/Components/Admin/EditEmployeeModal'
import { useGetEmployeesQuery, useDeleteEmployeeMutation } from '@project/Store/Api'
import type { Employee } from '@project/Types/Features/employee'
import { env } from '@project/Utils/envValidation'

const DELETE_MODAL_ID = 'employeeDeleteModal'

const UserManagementPage = (): JSX.Element => {
  const { data: rawEmployees, isLoading, isError, error } = useGetEmployeesQuery(undefined)
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const deleteModalRef = useRef<HTMLDivElement>(null)

  const employees = rawEmployees ?? []

  const filtered = employees.filter((emp) => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return Object.values(emp).some((v) => String(v ?? '').toLowerCase().includes(q))
  })

  useEffect(() => {
    if (!deleteModalRef.current) return
    const modal = BsModal.getOrCreateInstance(deleteModalRef.current)
    if (deleteTarget) modal.show()
    else modal.hide()
  }, [deleteTarget])

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    const result = await deleteEmployee(deleteTarget.id)
    if (result.error) return
    setDeleteTarget(null)
  }, [deleteTarget, deleteEmployee])

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
                    <th className="ps-4 py-3 small fw-semibold text-uppercase text-secondary">
                      Employee
                    </th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary">ID</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary">Email</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary">Department</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary">Designation</th>
                    <th className="text-end pe-4 py-3 small fw-semibold text-uppercase text-secondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((emp, i) => {
                      return (
                        <tr key={emp.id || i} className="border-bottom border-light">
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <EmployeeAvatar name={emp.name} imageUrl={env.VITE_API_BASE_URL+emp.photoUrl+ '?v='+emp.updatedAt} size={40} />
                              <div>
                                <div className="fw-semibold">{emp.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-secondary py-3">{emp.employeeId}</td>
                          <td className="text-secondary py-3">{emp['email'] || '-'}</td>
                          <td className="py-3">
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
                              {emp['departmentName'] || '-'}
                            </span>
                          </td>
                          <td className="text-secondary py-3">{emp['designationName'] || '-'}</td>
                          <td className="text-end pe-4 py-3">
                            <div className="d-flex gap-1 justify-content-end">
                              <button
                                className="btn btn-outline-info btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-2"
                                onClick={() => { setSelectedEmployee(emp) }}
                                title="Edit"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-2"
                                onClick={() => {
                                  setDeleteTarget({ id: emp.id, name: emp.name })
                                }}
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
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

      <div ref={deleteModalRef} className="modal fade" id={DELETE_MODAL_ID} tabIndex={-1}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content border-0 shadow">
            <div className="modal-body text-center py-4">
              <Trash2 size={36} className="text-danger mb-3" />
              <h5 className="fw-bold mb-2">Delete Employee</h5>
              <p className="text-secondary small mb-0">
                Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
              </p>
            </div>
            <div className="modal-footer border-top justify-content-center">
              <button type="button" className="btn btn-outline-secondary px-4 py-3 fw-semibold shadow-sm" style={{ minWidth: 120 }} onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger px-4 py-3 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2" style={{ minWidth: 120 }} disabled={isDeleting} onClick={confirmDelete}>
                {isDeleting ? <><span className="spinner-border spinner-border-sm" /> Deleting…</> : <><Trash2 size={16} /> Delete</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagementPage
