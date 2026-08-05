export interface PhotoConfig {
  cx?: number
  cy?: number
  size?: number
  shape?: 'circle' | 'rounded' | 'square'
  align?: 'left' | 'center' | 'right'
  borderColor?: string
  borderWidth?: number
}

export interface TextConfig {
  cx?: number
  cy?: number
  fontSize?: number
  color?: string
  bold?: boolean
  align?: 'left' | 'center' | 'right'
  text?: string
}

export interface QuoteConfig {
  cx?: number
  cy?: number
  fontSize?: number
  color?: string
  bold?: boolean
  align?: 'left' | 'center' | 'right'
  maxWidth?: number
}

export interface OverlayConfig {
  enabled?: boolean
  yStart?: number
  colorStart?: string
  colorEnd?: string
}

export interface Template {
  id: number
  name: string
  file: string
  imageUrl: string
  photo: PhotoConfig
  greeting: TextConfig
  nameConfig: TextConfig
  quote: QuoteConfig
  overlay: OverlayConfig
  active: boolean
  createdAt: string
  updatedAt: string
}
