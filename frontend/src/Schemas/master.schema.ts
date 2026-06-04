import { z } from 'zod'

export const masterRecordSchema = z.record(
  z.string(),
  z.string().min(1, 'This field is required').max(100, 'Must be at most 100 characters'),
)

export type MasterRecordFormValues = Record<string, string>
