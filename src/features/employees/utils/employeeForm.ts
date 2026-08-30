import type { EmployeeFormValues } from '../../../schemas/employeeSchema'
import type { Employee, EmployeeWritePayload } from '../types'
import { isImageSrc } from './isImageSrc'

const emptyFormValues: EmployeeFormValues = {
  name: '',
  email: '',
  mobile: '',
  country: '',
  state: '',
  district: '',
  avatar: '',
}

export function getEmployeeFormValues(
  employee?: Employee | null,
): EmployeeFormValues {
  if (!employee) {
    return emptyFormValues
  }

  const mobile = employee.mobile?.trim()
  const avatar = employee.avatar?.trim()

  return {
    name: employee.name ?? '',
    email: employee.email ?? '',
    mobile:
      !mobile || /^invalid faker method/i.test(mobile) ? '' : mobile,
    country: employee.country ?? '',
    state: employee.state ?? '',
    district: employee.district ?? '',
    avatar: isImageSrc(avatar) ? avatar : '',
  }
}

export function toEmployeeWritePayload(
  values: EmployeeFormValues,
  countryId?: string,
  existingEmployee?: Employee | null,
): EmployeeWritePayload {
  return {
    name: values.name,
    email: values.email,
    mobile: values.mobile,
    country: values.country,
    state: values.state,
    district: values.district,
    countryId,
    department: existingEmployee?.department,
    emailId: existingEmployee?.emailId,
    avatar: isImageSrc(values.avatar)
      ? values.avatar
      : existingEmployee?.avatar,
  }
}
