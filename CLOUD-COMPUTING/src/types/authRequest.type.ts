export interface AuthRequestBody {
  email: string
  password: string
  confirmPassword?: string
  username: string
  firstName: string
  lastName: string
  full_name: string
  phoneNumber: string
  gender?: 'MALE' | 'FEMALE'
  birth_date?: string
  location?: string
  idToken?: string
}
