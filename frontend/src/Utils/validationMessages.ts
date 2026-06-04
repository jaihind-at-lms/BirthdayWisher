/**
 * Form validation error messages.
 * Centralised here so copy changes happen in one place, not scattered across schemas.
 *
 * Intended for use with form validation libraries (e.g. Yup, Zod, React Hook Form).
 *
 * @example
 *   import validationMessages from '@project/Utils/validationMessages'
 *   schema.email().required(validationMessages.email.required)
 */
const validationMessages = {
  name: {
    required: 'Field is required.',
    min: 'Field should be minimum 3 characters.',
    max: 'Field should be maximum 150 characters.',
  },
  email: {
    required: 'Please enter your email address.',
    invalid: 'Please enter a valid email address.',
    max: 'Email should be maximum 62 characters.',
    noSpaceRequired: 'Email cannot include spaces.',
  },
  password: {
    required: 'Please enter new password.',
    requiredPass: 'Please enter password.',
    invalid:
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character.',
    max: 'Password should be maximum 32 characters.',
    oldPassword: 'Please enter old password.',
  },
  confirmPassword: {
    required: 'Please enter confirm password.',
    invalid: 'New and confirm password must be same.',
  },
  oldPassword: {
    required: 'Please enter old password.',
    samePassword: 'New password should not be same as old password.',
    invalid:
      'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character.',
  },
  phoneno: {
    required: 'Please enter contact number.',
    min: 'Contact number must be at least 8 characters.',
    max: 'Contact number must be at most 15 characters.',
    matches: 'Contact number must only contain digits.',
    blankSpace: 'Contact number cannot contain only backspaces.',
  },
  date: {
    startDate: 'Please select start date.',
    endDate: 'Please select end date.',
  },
  month: {
    startMonth: 'Please select start month.',
    endMonth: 'Please select end month.',
    required: 'Please select month.',
    before: 'End month should not be before start month.',
  },
  year: {
    startYear: 'Please select start year.',
    endYear: 'Please select end year.',
    required: 'Please select year.',
    before: 'End year should not be before start year.',
  },
  address: {
    required: 'Please enter address.',
    noSpaceRequired: 'Address cannot include spaces.',
    min: 'Address should be minimum 5 characters.',
    max: 'Address should be maximum 255 characters.',
    blankSpace: 'Address cannot contain only backspaces.',
  },
  zipCode: {
    required: 'Please enter postal code.',
    min: 'Please enter valid postal code.',
    max: 'Postal code should be maximum 7 characters.',
    blankSpace: 'Postal code cannot contain only backspaces.',
  },
  city: {
    required: 'Please select city.',
  },
  state: {
    required: 'Please select state.',
  },
  country: {
    required: 'Please select country.',
  },
} as const

export type ValidationMessages = typeof validationMessages
export default validationMessages
