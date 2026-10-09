import type { ContractorConfig } from '../config/contractor'

export interface FormValues {
  acres: string
  vegetation: string
  clearingType: string
  terrain: string
  access: string
  location: string
  photo: File | null
  description: string
  name: string
  email: string
  phone: string
}

export type FormErrors = Partial<Record<keyof FormValues, string>>

export const emptyForm: FormValues = {
  acres: '',
  vegetation: '',
  clearingType: '',
  terrain: '',
  access: '',
  location: '',
  photo: null,
  description: '',
  name: '',
  email: '',
  phone: '',
}

export function validate(values: FormValues, config: ContractorConfig): FormErrors {
  const errors: FormErrors = {}
  const acres = Number(values.acres)

  if (!values.acres.trim()) errors.acres = 'Enter the approximate acreage.'
  else if (!Number.isFinite(acres) || acres <= 0) errors.acres = 'Enter a number greater than 0.'
  else if (acres > config.maxAcres)
    errors.acres = `For projects over ${config.maxAcres} acres, please call ${config.phone}.`

  if (!values.vegetation) errors.vegetation = 'Select the type of growth.'
  if (!values.clearingType) errors.clearingType = 'Select a clearing type.'
  if (!values.terrain) errors.terrain = 'Select the terrain.'
  if (!values.access) errors.access = 'Select equipment access.'
  if (!values.location.trim()) errors.location = 'Enter a city or ZIP code.'
  if (!values.name.trim()) errors.name = 'Enter your name.'

  if (!values.email.trim()) errors.email = 'Enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email.'

  const digits = values.phone.replace(/\D/g, '')
  if (!digits) errors.phone = 'Enter your phone number.'
  else if (digits.length < 10) errors.phone = 'Enter a 10-digit phone number.'

  return errors
}

/** Formats US phone numbers as the user types: (555) 123-4567 */
export function formatPhone(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}
