import { useNavigate } from 'react-router-dom'
import type { JSX } from 'react'

const UnauthorizedPage = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>403 — Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      <button
        type="button"
        onClick={() => {
          void navigate(-1)
        }}
      >
        Go Back
      </button>
    </div>
  )
}

export default UnauthorizedPage
