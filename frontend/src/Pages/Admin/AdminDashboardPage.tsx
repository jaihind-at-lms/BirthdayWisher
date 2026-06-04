import { useCallback, useState, useEffect, useRef } from 'react'
import { Users, Cake, Gift, CalendarDays, Camera } from 'lucide-react'
import { Modal as BsModal } from 'bootstrap'
import type { JSX } from 'react'

import Spinner from '@project/Components/UI/Spinner'
import EmployeeAvatar from '@project/Components/UI/EmployeeAvatar'
import {
  useGetDashboardStatsQuery,
  useUpdateEmployeeMutation,
} from '@project/Store/Api'
import type { Employee } from '@project/Types/Features/employee'
import Input from '@project/Components/Form/Input'
import { useForm } from 'react-hook-form'
import { getDriveThumbnail } from '@project/Utils/imageHelper'

const STAT_CARDS = [
  { key: 'totalEmployees', label: 'Total Employees', icon: Users, color: 'primary', bg: 'primary' },
  { key: 'birthdaysThisMonth', label: 'Birthdays This Month', icon: Cake, color: 'info', bg: 'info' },
  { key: 'todayBirthdayCount', label: "Today's Birthdays", icon: Gift, color: 'success', bg: 'success' },
  { key: 'upcomingCount', label: 'Upcoming (7 Days)', icon: CalendarDays, color: 'warning', bg: 'warning' },
] as const

const CHANGE_IMAGE_MODAL_ID = 'changeImageModal'

const ChangeImageModal = ({ employee, onClose }: { employee: Employee | null; onClose: () => void }) => {
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation()
  const modalRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<{ imageUrl: string }>({
    defaultValues: { imageUrl: '' },
  })

  useEffect(() => {
    if (!modalRef.current) return
    const modal = BsModal.getOrCreateInstance(modalRef.current)
    if (employee) {
      modal.show()
    } else {
      modal.hide()
    }
    return () => { modal.dispose() }
  }, [employee])

  const onSubmit = useCallback(async (values: { imageUrl: string }) => {
    if (!employee) return
    const empId = employee['Employee ID'] || employee['Employee Id'] || employee['employee id'] || ''
    await updateEmployee({ id: empId, data: { 'Employee Image': values.imageUrl } })
    onClose()
  }, [employee, updateEmployee, onClose])

  if (!employee) return null

  const name = employee['Employee Name'] || employee['Employee name'] || ''
  const currentImage = employee['Employee Image'] || employee['Employee image'] || null
  const thumb = getDriveThumbnail(currentImage, 120)

  return (
    <div ref={modalRef} className="modal fade" id={CHANGE_IMAGE_MODAL_ID} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">Change Image</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} />
          </div>
          <div className="modal-body">
            {thumb && (
              <div className="text-center mb-3">
                <img src={thumb} alt={name} className="rounded-3 border object-fit-cover"
                  width={80} height={80} />
              </div>
            )}
            <p className="text-secondary mb-3">
              Update image for <strong>{name}</strong>
            </p>
            <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Image URL</label>
                <Input
                  type="text"
                  placeholder="Paste Google Drive image URL"
                  registration={register('imageUrl', { required: 'Image URL is required' })}
                  error={errors.imageUrl}
                />
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-info btn-sm text-white d-flex align-items-center gap-1" disabled={isLoading}>
                  {isLoading ? <><span className="spinner-border spinner-border-sm" /> Saving…</> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

const getEmployeeNameCol = (emp: Employee): string =>
  emp['Employee Name'] || emp['Employee name'] || emp['Name'] || emp['name'] || '-'

const getEmployeeIdCol = (emp: Employee): string =>
  emp['Employee ID'] || emp['Employee Id'] || emp['employee id'] || emp['ID'] || emp['id'] || ''

const getEmployeeImageCol = (emp: Employee): string | null =>
  emp['Employee Image'] || emp['Employee image'] || null

const AdminDashboardPage = (): JSX.Element => {
  const { data: stats, isLoading, isError, error } = useGetDashboardStatsQuery(undefined)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handlePreviewChange = useCallback((emp: Employee) => {
    setSelectedEmployee(emp)
    const url = getEmployeeImageCol(emp)
    setPreviewImage(url)
  }, [])

  if (isLoading) return <Spinner />

  if (isError) {
    return (
      <div className="alert alert-danger">
        Failed to load dashboard data. {(error as { message?: string })?.message ?? 'Please try again.'}
      </div>
    )
  }

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dashboard</h4>
          <p className="text-secondary mb-0 small">HR Mail Automation overview</p>
        </div>
      </div>

      {/* Stats cards — fixed */}
      <div className="row g-3 mb-4 flex-shrink-0">
        {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
          <div className="col-lg-3 col-md-6 col-12" key={key}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className={`rounded-3 bg-${bg} bg-opacity-10 d-flex align-items-center justify-content-center flex-shrink-0`}
                  style={{ width: 52, height: 52 }}>
                  <Icon size={22} className={`text-${color}`} />
                </div>
                <div>
                  <p className="text-secondary small mb-0">{label}</p>
                  <h3 className={`fw-bold mb-0 text-${color}`}>
                    {stats ? stats[key as keyof typeof stats] : '-'}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming birthdays table — scrollable */}
      <div className="flex-grow-1 overflow-y-auto">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom d-flex align-items-center justify-content-between py-3">
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <CalendarDays size={18} className="text-info" />
              Upcoming Birthdays
            </h5>
            <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-3">
              Next 7 days
            </span>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4 py-3 small fw-semibold text-uppercase text-secondary">Employee</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary">ID</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary">Department</th>
                    <th className="py-3 small fw-semibold text-uppercase text-secondary">Birthday</th>
                    <th className="text-end pe-4 py-3 small fw-semibold text-uppercase text-secondary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.upcomingBirthdays?.length ? (
                    stats.upcomingBirthdays.map((emp, i) => {
                      const name = getEmployeeNameCol(emp)
                      const empId = getEmployeeIdCol(emp)
                      const imageUrl = getEmployeeImageCol(emp)
                      return (
                        <tr key={empId || i} className="border-bottom border-light">
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <EmployeeAvatar name={name} imageUrl={imageUrl} size={38} />
                              <span className="fw-semibold">{name}</span>
                            </div>
                          </td>
                          <td className="text-secondary py-3">{empId}</td>
                          <td className="text-secondary py-3">{emp['Department'] || emp['department'] || '-'}</td>
                          <td className="py-3">
                            <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2">
                              {(emp['Birthday'] || emp['birthday'] || emp['DOB'] || emp['dob'] || '-')}
                            </span>
                          </td>
                          <td className="text-end pe-4 py-3">
                            <button
                              className="btn btn-outline-info btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3"
                              onClick={() => { handlePreviewChange(emp) }}
                            >
                              <Camera size={14} />
                              Change Photo
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-secondary py-5">
                        <Gift size={32} className="mb-2 text-info opacity-50" />
                        <p className="mb-0">No upcoming birthdays in the next 7 days.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ChangeImageModal
        employee={selectedEmployee}
        onClose={() => { setSelectedEmployee(null); setPreviewImage(null) }}
      />
    </div>
  )
}

export default AdminDashboardPage
