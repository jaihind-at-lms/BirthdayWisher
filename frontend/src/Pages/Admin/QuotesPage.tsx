import type { JSX } from 'react'

import { env } from '@project/Utils/envValidation'
import SheetPage from './SheetPage'

const QuotesPage = (): JSX.Element => (
  <SheetPage tab={env.VITE_SHEET_QUOTES_TAB} title="Quotes" />
)
export default QuotesPage
