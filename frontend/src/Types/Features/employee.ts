export interface Employee {
  id: number
  employeeId: string
  title: string | null
  name: string
  email: string
  departmentId: number | null
  departmentName: string | null
  designationId: number | null
  designationName: string | null
  dateOfBirth: string | null
  photoUrl: string | null
  createdAt: string
  updatedAt: string
  _nextBirthday?: string
}

export interface DashboardStats {
  totalEmployees: number
  birthdaysThisMonth: number
  todayBirthdayCount: number
  todayBirthdays: Employee[]
  upcomingBirthdays: (Employee & { _nextBirthday: string })[]
  upcomingCount: number
  employeesWithImage: number
  employeesWithoutImage: number
}
