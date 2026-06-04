import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Quote,
  Building2,
  Briefcase,
} from 'lucide-react'
import type { JSX } from 'react'
import type { LucideIcon } from 'lucide-react'

import { AppPaths } from '@project/Routes/paths'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: AppPaths.ADMIN_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: AppPaths.ADMIN_USERS, label: 'Employees', icon: Users },
]

const MASTER_SECTION: NavItem[] = [
  { to: AppPaths.ADMIN_QUOTES, label: 'Quotes', icon: Quote },
  { to: AppPaths.ADMIN_DEPARTMENTS, label: 'Departments', icon: Building2 },
  { to: AppPaths.ADMIN_DESIGNATIONS, label: 'Designations', icon: Briefcase },
]

const Sidebar = ({ onNavClick }: { onNavClick?: () => void }): JSX.Element => (
  <div className="d-flex flex-column h-100 py-3">
    <div className="d-flex align-items-center gap-2 px-3 pb-3 mb-2 border-bottom">
      <img
        src="https://lmsin.com/images/lms-logo.png"
        alt="LMS"
        height={28}
      />
      <span className="fw-semibold text-secondary small">HR Panel</span>
    </div>

    <nav className="flex-grow-1">
      <div className="text-uppercase text-secondary px-3 mb-2" style={{ fontSize: 10 }}>
        Main Menu
      </div>
      <ul className="nav flex-column gap-1 px-2 mb-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li className="nav-item" key={to}>
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded-3 py-2 px-3 ${isActive ? 'active bg-info bg-opacity-10 text-info fw-semibold' : 'text-secondary'}`
              }
              onClick={onNavClick}
            >
              <Icon size={18} />
              <span style={{ fontSize: 14 }}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="text-uppercase text-secondary px-3 mb-2" style={{ fontSize: 10 }}>
        Masters
      </div>
      <ul className="nav flex-column gap-1 px-2">
        {MASTER_SECTION.map(({ to, label, icon: Icon }) => (
          <li className="nav-item" key={to}>
            <NavLink
              to={to}
              end
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded-3 py-2 px-3 ${isActive ? 'active bg-info bg-opacity-10 text-info fw-semibold' : 'text-secondary'}`
              }
              onClick={onNavClick}
            >
              <Icon size={18} />
              <span style={{ fontSize: 14 }}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>

    <div className="px-3 py-2 border-top text-center text-secondary" style={{ fontSize: 10 }}>
      v2.0.0
    </div>
  </div>
)

export default Sidebar
