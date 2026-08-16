import type {
  PropsWithChildren,
  ReactNode,
} from 'react'
import { X } from 'lucide-react'

interface ModalProps extends PropsWithChildren {
  title: string
  description?: string
  footer?: ReactNode
  onClose: () => void
}

export function Modal({
  title,
  description,
  footer,
  onClose,
  children,
}: ModalProps) {
  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="modal-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {children}

        {footer}
      </section>
    </div>
  )
}