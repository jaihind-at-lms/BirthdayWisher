import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import { Modal as BsModal } from 'bootstrap'
import { useForm } from 'react-hook-form'
import type { JSX } from 'react'

import Spinner from '@project/Components/UI/Spinner'
import Input from '@project/Components/Form/Input'
import Button from '@project/Components/Form/Button'
import {
  useGetSheetRecordsQuery,
  useCreateSheetRecordMutation,
  useUpdateSheetRecordMutation,
  useDeleteSheetRecordMutation,
  type SheetRecord,
} from '@project/Store/Api'

interface SheetPageProps {
  tab: string
  title: string
  icon?: JSX.Element
}

const FORM_MODAL_ID = 'sheetFormModal'
const DELETE_MODAL_ID = 'sheetDeleteModal'

function columnLabel(key: string): string {
  return key.replace(/\s+/g, ' ').trim()
}

function SheetPage({ tab, title, icon }: SheetPageProps): JSX.Element {
  const { data: rawRecords, isLoading, isError, error } = useGetSheetRecordsQuery(tab)
  const [createRecord, { isLoading: isCreating }] = useCreateSheetRecordMutation()
  const [updateRecord, { isLoading: isUpdating }] = useUpdateSheetRecordMutation()
  const [deleteRecord, { isLoading: isDeleting }] = useDeleteSheetRecordMutation()

  const records = rawRecords ?? []
  const [searchTerm, setSearchTerm] = useState('')
  const [editTarget, setEditTarget] = useState<{ row: number; data: SheetRecord } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ row: number; name: string } | null>(null)

  const filtered = records.filter((rec) => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return Object.values(rec).some((v) => v?.toLowerCase().includes(q))
  })

  // Determine columns from first record
  const columns = records.length > 0 ? Object.keys(records[0]) : []

  // ── Form modal ──────────────────────────────────────────────────────────

  const formModalRef = useRef<HTMLDivElement>(null)

  const getFormDefaults = useCallback(() => {
    if (editTarget && editTarget.row >= 0) {
      return Object.fromEntries(columns.map((c) => [c, editTarget.data[c] ?? '']))
    }
    return Object.fromEntries(columns.map((c) => [c, '']))
  }, [editTarget, columns])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Record<string, string>>({
    defaultValues: getFormDefaults(),
  })

  useEffect(() => {
    reset(getFormDefaults())
  }, [editTarget])

  useEffect(() => {
    if (!formModalRef.current) return
    const modal = BsModal.getOrCreateInstance(formModalRef.current)
    if (editTarget !== null) modal.show()
    else modal.hide()
  }, [editTarget])

  const openCreateModal = () => {
    reset(Object.fromEntries(columns.map((c) => [c, ''])))
    setEditTarget({ row: -1, data: {} })
  }

  const openEditModal = (row: number, data: SheetRecord) => {
    setEditTarget({ row, data })
  }

  const closeFormModal = () => {
    setEditTarget(null)
  }

  const onFormSubmit = useCallback(async (values: Record<string, string>) => {
    if (editTarget && editTarget.row >= 0) {
      await updateRecord({ tab, row: editTarget.row, data: values })
    } else {
      await createRecord({ tab, data: values })
    }
    closeFormModal()
  }, [tab, editTarget, createRecord, updateRecord])

  // ── Delete modal ────────────────────────────────────────────────────────

  const deleteModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!deleteModalRef.current) return
    const modal = BsModal.getOrCreateInstance(deleteModalRef.current)
    if (deleteTarget) modal.show()
    else modal.hide()
  }, [deleteTarget])

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    await deleteRecord({ tab, row: deleteTarget.row })
    setDeleteTarget(null)
  }, [tab, deleteTarget, deleteRecord])

  if (isLoading) return <Spinner />

  if (isError) {
    return (
      <div className="alert alert-danger">
        Failed to load {title.toLowerCase()}. {(error as { message?: string })?.message ?? 'Please try again.'}
      </div>
    )
  }

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      {/* Header — fixed */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 flex-shrink-0">
        <div className="d-flex align-items-center gap-2">
          {icon}
          <div>
            <h4 className="fw-bold mb-1">{title}</h4>
            <p className="text-secondary mb-0 small">
              {records.length} record{records.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
            <input
              type="text"
              className="form-control form-control-sm ps-5 rounded-pill border-light"
              style={{ width: 220 }}
              placeholder="Search…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="btn position-absolute end-0 top-50 translate-middle-y border-0 text-secondary pe-3 py-0"
                onClick={() => setSearchTerm('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <button
            className="btn btn-info btn-sm text-white d-flex align-items-center gap-1 rounded-pill px-3"
            onClick={openCreateModal}
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
      </div>

      {/* Table — scrollable */}
      <div className="flex-grow-1 overflow-y-auto">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead className="table-light border-bottom">
                  <tr>
                    <th className="ps-4 py-3 small fw-semibold text-uppercase text-secondary" style={{ width: 40 }}>#</th>
                    {columns.map((col) => (
                      <th key={col} className="py-3 small fw-semibold text-uppercase text-secondary">
                        {columnLabel(col)}
                      </th>
                    ))}
                    <th className="text-end pe-4 py-3 small fw-semibold text-uppercase text-secondary" style={{ width: 120 }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((rec, i) => (
                      <tr key={i} className="border-bottom border-light">
                        <td className="ps-4 py-3 text-secondary">{i + 1}</td>
                        {columns.map((col) => (
                          <td key={col} className="py-3">
                            {col.toLowerCase().includes('image') || col.toLowerCase().includes('photo')
                              ? rec[col]
                                ? <span className="badge bg-success bg-opacity-10 text-success">Set</span>
                                : <span className="badge bg-secondary bg-opacity-10 text-secondary">None</span>
                              : rec[col] || <span className="text-secondary" style={{ fontSize: 13 }}>—</span>
                            }
                          </td>
                        ))}
                        <td className="text-end pe-4 py-3">
                          <div className="d-flex gap-1 justify-content-end">
                            <button
                              className="btn btn-outline-info btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-2"
                              onClick={() => openEditModal(i, rec)}
                              title="Edit"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-2"
                              onClick={() => {
                                const name = rec[columns[1]] || rec[columns[0]] || `#${i + 1}`
                                setDeleteTarget({ row: i, name: String(name) })
                              }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 2} className="text-center text-secondary py-5">
                        <p className="mb-0">{searchTerm ? 'No records match your search.' : 'No records found.'}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── Create / Edit modal ─────────────────────────────────────────────── */}
      <div ref={formModalRef} className="modal fade" id={FORM_MODAL_ID} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">
                {editTarget ? 'Edit Record' : 'Add New Record'}
              </h5>
              <button type="button" className="btn-close" onClick={closeFormModal} />
            </div>
            <form onSubmit={(e) => { void handleSubmit(onFormSubmit)(e) }}>
              <div className="modal-body">
                <div className="row g-3">
                  {columns.map((col) => (
                    <div className="col-12" key={col}>
                      <label className="form-label fw-semibold small text-secondary">{columnLabel(col)}</label>
                      <Input
                        type="text"
                        registration={register(col, { required: `${columnLabel(col)} is required` })}
                        error={errors[col]}
                        placeholder={`Enter ${columnLabel(col).toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-top">
                <button type="button" className="btn btn-outline-secondary px-4 py-3 fw-semibold shadow-sm" style={{ minWidth: 120 }} onClick={closeFormModal}>
                  Cancel
                </button>
                <Button type="submit" loading={isCreating || isUpdating} variant="btn-info" className="px-4" style={{ minWidth: 120 }}>
                  <span className="text-white">{editTarget && editTarget.row >= 0 ? 'Update' : 'Create'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── Delete confirmation modal ────────────────────────────────────────── */}
      <div ref={deleteModalRef} className="modal fade" id={DELETE_MODAL_ID} tabIndex={-1}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content border-0 shadow">
            <div className="modal-body text-center py-4">
              <Trash2 size={36} className="text-danger mb-3" />
              <h5 className="fw-bold mb-2">Delete Record</h5>
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

export default SheetPage
