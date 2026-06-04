import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Menu } from 'lucide-react'
import type { JSX } from 'react'

import { AppPaths } from '@project/Routes/paths'
import { selectUserInfo } from '@project/Store/Feature'
import { useLogoutMutation } from '@project/Store/Api'
import { useAppDispatch, useAppSelector } from '@project/Store/hooks'

const Header = (): JSX.Element => {
  const userInfo = useAppSelector(selectUserInfo)
  const [logout] = useLogoutMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = useCallback(async () => {
    try {
      await logout({ refreshToken: '' }).unwrap()
    } catch {
      /* already handled by baseQuery */
    }
    navigate(AppPaths.LOGIN, { replace: true })
  }, [logout, dispatch, navigate])

  return (
    <header className="bg-white border-bottom px-3 px-lg-4 py-2 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn d-lg-none d-flex align-items-center p-1 text-secondary border-0"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarOffcanvas"
        >
          <Menu size={22} />
        </button>
        <img
          src="https://lmsin.com/images/lms-logo.png"
          alt="LMS"
          height={28}
          className="d-lg-none"
        />
        <span className="d-none d-lg-inline fw-semibold text-secondary small">
          HR Mail Automation
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2 text-secondary">
          <div className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center p-2">
            <User size={15} className="text-info" />
          </div>
          <span className="fw-semibold small d-none d-md-inline">
            {userInfo
              ? `${userInfo.firstName} ${userInfo.lastName}`.trim()
              : ''}
          </span>
        </div>

        <button
          className="btn btn-outline-info btn-sm d-flex align-items-center gap-1 rounded-pill px-3"
          onClick={handleLogout}
        >
          <LogOut size={14} />
          <span className="d-none d-sm-inline small">Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header
