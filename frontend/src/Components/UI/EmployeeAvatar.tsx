import { useState } from 'react'
import type { JSX } from 'react'

import { getDriveThumbnail } from '@project/Utils/imageHelper'

interface EmployeeAvatarProps {
  name: string
  imageUrl: string | null
  size?: number
}

const EmployeeAvatar = ({ name, imageUrl, size = 36 }: EmployeeAvatarProps): JSX.Element => {
  const thumb = getDriveThumbnail(imageUrl, size * 2)
  const [failed, setFailed] = useState(false)

  if (thumb && !failed) {
    return (
      <img
        src={thumb}
        alt={name}
        className="rounded-circle border object-fit-cover flex-shrink-0"
        width={size}
        height={size}
        onError={() => { setFailed(true) }}
      />
    )
  }

  const initial = name.charAt(0).toUpperCase()

  return (
    <div
      className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center text-info fw-semibold flex-shrink-0"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initial}
    </div>
  )
}

export default EmployeeAvatar
