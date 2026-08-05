import { useCallback, useEffect,useRef, useState } from 'react'

import { Modal as BsModal } from 'bootstrap'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import type { JSX } from 'react'

import TemplateEditor from '@project/Components/Admin/TemplateEditor'
import Button from '@project/Components/Form/Button'
import Spinner from '@project/Components/UI/Spinner'
import {
  useDeleteTemplateMutation,
  useGetTemplatesQuery,
} from '@project/Store/Api'
import type { Template } from '@project/Types/Features/template'

const DELETE_MODAL_ID = 'templateDeleteModal'

const TemplatesPage = (): JSX.Element => {
  const { data: templates, isLoading, isError } = useGetTemplatesQuery(undefined)
  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation()

  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)

  const deleteModalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!deleteModalRef.current) return
    const modal = BsModal.getOrCreateInstance(deleteModalRef.current)
    if (deleteTarget) modal.show()
    else modal.hide()
  }, [deleteTarget])

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return
    await deleteTemplate(deleteTarget.id)
    setDeleteTarget(null)
  }, [deleteTarget, deleteTemplate])

  const handleEditClick = (template: Template) => {
    setIsCreating(false)
    setEditingTemplate(template)
  }

  const handleCreateClick = () => {
    setEditingTemplate(null)
    setIsCreating(true)
  }

  const handleEditorClose = () => {
    setEditingTemplate(null)
    setIsCreating(false)
  }

  if (isLoading) return <Spinner />

  // Show editor view
  if (isCreating || editingTemplate) {
    return (
      <TemplateEditor
        template={editingTemplate}
        onClose={handleEditorClose}
      />
    )
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Birthday Templates</h4>
        <Button variant="btn-info" className="px-4 py-2" onClick={handleCreateClick}>
          <Plus size={18} />
          Add Template
        </Button>
      </div>

      {isError && (
        <div className="alert alert-danger">Failed to load templates.</div>
      )}

      {/* Template Grid */}
      <div className="row g-4">
        {templates?.map((t) => (
          <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm border-0">
              <div className="position-relative">
                <img
                  src={t.imageUrl}
                  alt={t.name}
                  className="card-img-top"
                  style={{ height: 200, objectFit: 'cover' }}
                />
                {!t.active && (
                  <span className="badge bg-warning position-absolute top-0 end-0 m-2">
                    Inactive
                  </span>
                )}
              </div>
              <div className="card-body">
                <h6 className="card-title fw-semibold mb-1">{t.name}</h6>
                <small className="text-muted">{t.file}</small>
              </div>
              <div className="card-footer bg-transparent border-0 d-flex gap-2 pb-3">
                <button
                  className="btn btn-sm btn-outline-primary flex-fill"
                  onClick={() => handleEditClick(t)}
                  aria-label={`Edit ${t.name}`}
                >
                  <Pencil size={14} className="me-1" />
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setDeleteTarget({ id: t.id, name: t.name })}
                  aria-label={`Delete ${t.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {templates?.length === 0 && (
          <div className="col-12 text-center py-5 text-muted">
            <p className="mb-2">No templates configured yet.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <div ref={deleteModalRef} className="modal fade" id={DELETE_MODAL_ID} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title">Delete Template</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setDeleteTarget(null)}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action
              cannot be undone.
            </div>
            <div className="modal-footer border-0">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <Button
                variant="btn-danger"
                loading={isDeleting}
                className="px-4 py-2"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplatesPage
