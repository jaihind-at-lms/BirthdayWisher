import { Outlet } from 'react-router-dom'
import type { JSX } from 'react'

import AdminLayout from '@project/Components/Layouts/AdminLayout'
import type { RouteConfig } from '@project/Types/Features/routes'

interface LayoutRendererProps {
  layout: RouteConfig['layout']
}

const LayoutRenderer = ({ layout }: LayoutRendererProps): JSX.Element => {
  switch (layout) {
    case 'admin':
      return (
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      )
    case 'none':
    default:
      return <Outlet />
  }
}

export default LayoutRenderer
