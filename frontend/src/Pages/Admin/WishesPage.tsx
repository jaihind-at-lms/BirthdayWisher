import type { JSX } from 'react'

import { env } from '@project/Utils/envValidation'
import SheetPage from './SheetPage'

const WishesPage = (): JSX.Element => (
  <SheetPage tab={env.VITE_SHEET_WISHES_TAB} title="Wishes" />
)
export default WishesPage
