import { env } from './envValidation'
import type { Employee } from '@project/Types/Features/employee'

const DRIVE_FILE_ID = /[-\w]{25,}/;

export function getDriveThumbnail(url: string | null, size = 100): string | null {
  if (!url) return null;
  const id = url.match(DRIVE_FILE_ID)?.[0];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=s${size}` : null;
}

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
