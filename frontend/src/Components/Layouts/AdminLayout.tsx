import type { JSX, ReactNode } from 'react'

import Header from '@project/Components/Header'

interface AdminLayoutProps {
  children: ReactNode
}

/**
 * Admin layout: persistent sidebar + top header + content area.
 * Used for admin and super_admin roles.
 */
const AdminLayout = ({ children }: AdminLayoutProps): JSX.Element => (
  <div className="layout layout--admin">
    <Header />
    <div className="layout__body">
      <aside className="layout__sidebar">
        {/* Sidebar nav rendered here — driven by the route config */}
      </aside>
      <main className="layout__content">{children}</main>
    </div>
  </div>
)

export default AdminLayout
