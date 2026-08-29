export interface Employee {
  id: string
  name: string
  mobile: string
  country: string
  state: string
  district: string
  createdAt: string
  email?: string
  emailId?: string
  avatar?: string
  countryId?: string
  department?: string
}

export interface EmployeeWritePayload {
  name: string
  email: string
  mobile: string
  country: string
  state: string
  district: string
  countryId?: string
  department?: string
  emailId?: string
  avatar?: string
}
