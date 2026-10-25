export interface ProfileRequestBody {
  username: string
  profile_pic: string
  firstName: string
  lastName: string
  full_name: string
  phoneNumber: string
  birth_date: string
  location: string
  gender: 'MALE' | 'FEMALE'
}

export interface ProfileRequestRegisterBody {
  username: string
  firstName: string
  lastName: string
  full_name: string
  phoneNumber: string
  birth_date?: string
  location?: string
  gender?: 'MALE' | 'FEMALE'
}
