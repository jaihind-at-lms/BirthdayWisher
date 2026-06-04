import { z } from 'zod'

const title = z.string().min(1, 'Please select a title').max(20, 'Title must be at most 20 characters')
const name = z.string().min(1, 'Please enter full name').max(50, 'Name must be at most 50 characters')
const email = z.string().min(1, 'Please enter email').max(60, 'Email must be at most 60 characters').email('Please enter a valid email')
const employeeId = z.string().min(1, 'Please enter employee ID').max(10, 'Employee ID must be at most 10 characters')
const department = z.string().min(1, 'Please select a department').max(100, 'Department must be at most 100 characters')
const designation = z.string().min(1, 'Please select a designation').max(100, 'Designation must be at most 100 characters')
const dateOfBirth = z.string().min(1, 'Please select date of birth').max(10, 'Invalid date')

export const addEmployeeSchema = z.object({
  title,
  name,
  email,
  employeeId,
  department,
  designation,
  dateOfBirth,
  sendWelcome: z.boolean(),
  welcomeTextLine1: z.string().max(500, 'Welcome text must be at most 500 characters').optional(),
  welcomeTextLine2: z.string().max(500, 'Welcome text must be at most 500 characters').optional(),
})

export type AddEmployeeFormValues = z.infer<typeof addEmployeeSchema>

export const editEmployeeSchema = z.object({
  title,
  name,
  email,
  employeeId,
  department,
  designation,
  dateOfBirth,
})

export type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>
