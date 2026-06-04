export interface Employee {
  [key: string]: string | null
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
