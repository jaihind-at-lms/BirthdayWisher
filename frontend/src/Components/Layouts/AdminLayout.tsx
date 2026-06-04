import type { JSX, ReactNode } from 'react'

import Header from '@project/Components/Header'
import Sidebar from '@project/Components/Sidebar/Sidebar'

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps): JSX.Element => {
  const closeOffcanvas = () => {
    const el = document.getElementById('sidebarOffcanvas')
    if (!el) return
    import('bootstrap').then(({ Offcanvas }) => {
      Offcanvas.getInstance(el)?.hide()
    })
  }

  return (
    <div className="d-flex flex-column vh-100 overflow-hidden bg-light">
      {/* Mobile offcanvas sidebar */}
      <div
        className="offcanvas offcanvas-start d-lg-none border-0"
        tabIndex={-1}
        id="sidebarOffcanvas"
      >
        <div className="offcanvas-body p-0">
          <Sidebar onNavClick={closeOffcanvas} />
        </div>
      </div>

      {/* Desktop layout — pure flex, no grid */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside
          className="d-none d-lg-flex flex-column border-end bg-white overflow-hidden"
          style={{ width: 220, flexShrink: 0 }}
        >
          <Sidebar />
        </aside>

        {/* Main area */}
        <div className="d-flex flex-column flex-grow-1 overflow-hidden">
          <Header />
          <main className="flex-grow-1 overflow-hidden p-3 p-lg-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
