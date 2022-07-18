import React from 'react'

const Toast = () => {
  return (
    <div role="alert" aria-live="assertive" aria-atomic="true" className="toast" data-bs-autohide="false">
      <div className="toast-header">
        <img src="..." className="rounded me-2" alt="..." />
        <strong className="me-auto">Bootstrap</strong>
        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div className="toast-body">
        A new product was added to your favorites.
      </div>
    </div>
  )
}

export default Toast
