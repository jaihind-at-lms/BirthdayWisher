import type { JSX } from 'react'

import { env } from '@project/Utils/envValidation'
import SheetPage from './SheetPage'

const DesignationsPage = (): JSX.Element => (
  <SheetPage tab={env.VITE_SHEET_DESIGNATIONS_TAB} title="Designations" />
)
export default DesignationsPage
