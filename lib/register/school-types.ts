// lib/register/school-types.ts
export type SchoolPlanId = 'basic' | 'pro' | 'plus'

export type PaymentMethodId =
  | 'qris'
  | 'gopay'
  | 'gojek'
  | 'bca'
  | 'mandiri'
  | 'bri'

export type SchoolRegisterData = {
  // Step 1 — Plan
  plan?: SchoolPlanId
  planPrice?: number

  // Step 2 — Payment
  paymentMethod?: PaymentMethodId
  paymentReference?: string
  paidAt?: string

  // Step 3 — Account
  email?: string
  password?: string
  fullName?: string
  position?: string

  // Step 4 — School
  schoolName?: string
  npsn?: string
  level?: 'smk'
  accreditation?: string
  address?: string
  city?: string
  province?: string
  bkkName?: string
  bkkContact?: string
  bkkEmail?: string
  bkkPhone?: string
}