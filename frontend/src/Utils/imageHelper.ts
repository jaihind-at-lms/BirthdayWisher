import { env } from './envValidation'
import type { Employee } from '@project/Types/Features/employee'

export function getEmployeeImageUrl(emp: Employee): string | null {
  const driveKey = Object.keys(emp).find(
    (k) => k.toLowerCase().includes('image') || k.toLowerCase().includes('photo')
  )
  if (driveKey && emp[driveKey]) return emp[driveKey]

  const empId = emp['Employee ID'] || emp['Employee Id'] || emp['employee id'] || emp['ID'] || emp['id']
  if (empId) {
    const origin = env.VITE_API_BASE_URL.replace(/\/api\/?$/, '')
    return `${origin}/uploads/${empId}.png?t=${Date.now()}`
  }

  return null
}
