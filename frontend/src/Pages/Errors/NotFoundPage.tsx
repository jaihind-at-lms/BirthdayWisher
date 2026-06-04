import { useNavigate } from 'react-router-dom'
import type { JSX } from 'react'

const NotFoundPage = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>404 — Page Not Found</h1>
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

export default NotFoundPage
