export interface Author {
  name: string
  id: string
  profile_image: string
  bio: string
}

export interface Metadata {
  publish_date: string
  last_updated: string
  tags: string[]
  category: string
  reading_time: number
  likes: number
  views: number
  mental_state?: MentalState
  image_link: string
}

export enum ContentType {
  HEADER = 'header',
  SUBHEADER = 'subheader',
  PARAGRAPH = 'paragraph',
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  QUOTE = 'quote',
  LIST = 'list',
  EMBED = 'embed'
}

export enum MentalState {
  MDD = 'MDD',
  ASD = 'ASD',
  LONELINESS = 'Loneliness',
  BIPOLAR = 'bipolar',
  ANXIETY = 'anxiety',
  PTSD = 'PTSD',
  SLEEP_DISORDER = 'sleep disord',
  PSYCHOTIC_DEPRESSION = 'psychot depresn',
  ED = 'ED',
  ADHD = 'ADHD',
  PDD = 'PDD',
  OCD = 'OCD'
}

export interface Content {
  type: ContentType
  level?: number
  text?: string
  src?: string
  caption?: string
  alt_text?: string
  style?: string
  items?: string[]
  platform?: string
  url?: string
  description?: string
  author?: string
  author_role?: string
}

export interface Article {
  id: string
  title: string
  author: Author
  metadata: Metadata
  content: Content[]
}

export interface GetArticlesResponse {
  count: number
  articles: GetArticle[]
}
export interface GetArticle {
  id: string
  title: string
  author?: Author
  metadata?: Metadata
  content?: Content[]
}
