import type { JSX } from 'react'

const Spinner = (): JSX.Element => (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="spinner-border text-info" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

export default Spinner
