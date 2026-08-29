export interface Employee {
  id: string
  name: string
  email: string
  mobile: string
  country: string
  state: string
  district: string
  createdAt: string
  emailId?: string
  avatar?: string
  countryId?: string
}

export interface EmployeeWritePayload {
  name: string
  email: string
  mobile: string
  country: string
  state: string
  district: string
  countryId?: string
}
