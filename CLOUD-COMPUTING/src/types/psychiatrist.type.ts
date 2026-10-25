export interface Psychiatrist {
  id: string
  fullName: string
  title: string
  mainRole: string
  specializations: string[]
  ratings: number
  reviewCount: number
  patientsCount: number
  experienceYears: number
  aboutMe: string
  languages: string[]
  photoUrl: string
  education: Education[]
  workingHours: WorkingHours[]
  certifications: string[]
  location: Location
  consultationFee: number
  features: Features
  availability: Availability[]
  contact: Contact
}

interface Education {
  degree: string
  institution: string
  yearOfGraduation: number
}

interface WorkingHours {
  day: string
  startTime: string
  endTime: string
}

interface Location {
  address: string
  latitude: string
  longitude: string
}

interface Features {
  bookAppointment: boolean
  chat: boolean
  videoConsultation: boolean
}

interface Availability {
  date: string
  timeSlots: string[]
}

interface Contact {
  phoneNumber: string
  email: string
}
