import { Content, ContentType, MentalState } from '../types/articleTypes'

export const validateContent = (content: Content): string | null => {
  switch (content.type) {
    case ContentType.HEADER:
    case ContentType.SUBHEADER:
      if (!content.text) return `${content.type} requires text field`
      if (!content.level || content.level < 1 || content.level > 6)
        return 'Level must be between 1 and 6'
      break
    case ContentType.PARAGRAPH:
    case ContentType.TEXT:
      if (!content.text) return 'Text content requires text field'
      break
    case ContentType.IMAGE:
      if (!content.src) return 'Image content requires src field'
      break
    case ContentType.VIDEO:
      if (!content.src) return 'Video content requires src field'
      break
    case ContentType.QUOTE:
      if (!content.text || !content.author) return 'Quote requires text and author fields'
      break
    case ContentType.LIST:
      if (!content.items || !Array.isArray(content.items))
        return 'List content requires items array'
      if (content.style && !['ordered', 'unordered', 'bullet'].includes(content.style)) {
        return 'List style must be either ordered, unordered, or bullet'
      }
      break
    case ContentType.EMBED:
      if (!content.platform || !content.url) return 'Embed content requires platform and url fields'
      break
    default:
      return 'Invalid content type'
  }
  return null
}

export const validateMentalState = (mentalState: string): string | null => {
  if (mentalState && !Object.values(MentalState).includes(normalizeMentalState(mentalState))) {
    return `Invalid mental state. Must be one of: ${Object.values(MentalState).join(', ')}`
  }
  return null
}

export const normalizeMentalState = (mentalState: string): MentalState => {
  const normalized = mentalState.trim().toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_')

  switch (normalized) {
    case 'minimal':
      return MentalState.MINIMAL
    case 'mild':
      return MentalState.MILD
    case 'moderate':
      return MentalState.MODERATE
    case 'moderately_severe':
      return MentalState.MODERATELY_SEVERE
    case 'severe':
      return MentalState.SEVERE
    case 'high_risk':
    case 'high_risk_safety_override':
      return MentalState.HIGH_RISK
    case 'mdd':
    case 'pdd':
    case 'psychot_depresn':
    case 'psychotic_depression':
    case 'depresn':
    case 'depression':
    default:
      return MentalState.DEPRESSION
  }
}

export const validateImageLink = (imageLink: string): string | null => {
  if (imageLink && !imageLink.startsWith('https://')) {
    return 'Image link must start with https://'
  }
  if (
    imageLink &&
    !imageLink.endsWith('.jpg') &&
    !imageLink.endsWith('.png') &&
    !imageLink.endsWith('.jpeg')
  ) {
    return 'Image link must end with .jpg or .png'
  }
  return null
}
