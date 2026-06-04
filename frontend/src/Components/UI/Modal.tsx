import type { JSX, ReactNode } from 'react'

interface ModalProps {
  id: string
  title: string
  children: ReactNode
  size?: 'sm' | 'lg' | 'xl'
}

const Modal = ({ id, title, children, size }: ModalProps): JSX.Element => (
  <div className="modal fade" id={id} tabIndex={-1} aria-hidden="true">
    <div className={`modal-dialog${size ? ` modal-${size}` : ''}`}>
      <div className="modal-content border-0 shadow">
        <div className="modal-header border-bottom">
          <h5 className="modal-title fw-bold">{title}</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" />
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  </div>
)

export default Modal
