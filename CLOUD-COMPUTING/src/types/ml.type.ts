export interface QuizInputData {
  age: string
  feeling_nervous: boolean
  panic: boolean
  breathing_rapidly: boolean
  sweating: boolean
  trouble_in_concentration: boolean
  having_trouble_in_sleeping: boolean
  having_trouble_with_work: boolean
  hopelessness: boolean
  anger: boolean
  over_react: boolean
  change_in_eating: boolean
  suicidal_thought: boolean
  feeling_tired: boolean
  close_friend: boolean
  social_media_addiction: boolean
  weight_gain: boolean
  introvert: boolean
  popping_up_stressful_memory: boolean
  having_nightmares: boolean
  avoids_people_or_activities: boolean
  feeling_negative: boolean
  trouble_concentrating: boolean
  blaming_yourself: boolean
  hallucinations: boolean
  repetitive_behaviour: boolean
  seasonally: boolean
  increased_energy: boolean
}

export interface AudioInputData {
  buffer: Buffer
  originalname: string
  mimetype: string
}

export interface PredictionResponse {
  prediction: string
  confidence: number
}
export interface HandwritingInputData {
  buffer: Buffer
  mimetype: string
  originalname: string
}

export enum MLRequestType {
  QUIZ = 'quiz_requests',
  HANDWRITING = 'handwriting_requests',
  AUDIO = 'audio_requests'
}

export interface MLHistoryQuery {
  type: MLRequestType
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  sortBy?: 'timestamp' | 'prediction'
  sortOrder?: 'asc' | 'desc'
}

export interface MLHistoryResponse {
  history: MLHistoryItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface MLHistoryItem {
  id: string
  prediction: {
    result: string
  }
  inputData: Record<string, unknown>
  timestamp: string
  metadata?: Record<string, unknown>
}
