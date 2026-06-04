import type { JSX } from 'react'

import { env } from '@project/Utils/envValidation'
import SheetPage from './SheetPage'

const DepartmentsPage = (): JSX.Element => (
  <SheetPage tab={env.VITE_SHEET_DEPARTMENTS_TAB} title="Departments" />
)
export default DepartmentsPage
