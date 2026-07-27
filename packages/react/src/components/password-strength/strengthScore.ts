export type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong'

export const STRENGTH_LEVELS: StrengthLevel[] = ['weak', 'fair', 'good', 'strong']

export interface StrengthWeights {
  extraLength: number
  lowercase: number
  longPassword: number
  minLength: number
  multipleSpecial: number
  numbers: number
  special: number
  uppercase: number
}

export const defaultWeights: StrengthWeights = {
  extraLength: 1,
  lowercase: 1,
  longPassword: 1,
  minLength: 1,
  multipleSpecial: 1,
  numbers: 1,
  special: 1,
  uppercase: 1
}

export const defaultMessages: Record<StrengthLevel, string> = {
  fair: 'Fair',
  good: 'Good',
  strong: 'Strong',
  weak: 'Weak'
}

export const defaultThresholds: [number, number, number] = [2, 4, 6]

const SPECIAL_CHARS = /[!"#$%&()*,.:<>?@^{|}]/
const MULTIPLE_SPECIAL_CHARS = /[!"#$%&()*,.:<>?@^{|}].*[!"#$%&()*,.:<>?@^{|}]/

interface CalculateScoreOptions {
  minLength: number
  scorer?: (password: string) => number
  weights: StrengthWeights
}

// Ported from chassis-css's vanilla strength.js `_calculateScore` — kept in lockstep with it so
// a password scores identically whether evaluated by the vanilla JS or this component.
export const calculateScore = (
  password: string,
  { minLength, scorer, weights }: CalculateScoreOptions
): number => {
  if (!password) return 0
  if (scorer) return scorer(password)

  let score = 0

  if (password.length >= minLength) score += weights.minLength
  if (password.length >= minLength + 4) score += weights.extraLength
  if (/[a-z]/.test(password)) score += weights.lowercase
  if (/[A-Z]/.test(password)) score += weights.uppercase
  if (/\d/.test(password)) score += weights.numbers
  if (SPECIAL_CHARS.test(password)) score += weights.special
  if (MULTIPLE_SPECIAL_CHARS.test(password)) score += weights.multipleSpecial
  if (password.length >= 16) score += weights.longPassword

  return score
}

export const scoreToStrength = (
  score: number,
  thresholds: [number, number, number]
): StrengthLevel | null => {
  if (score === 0) return null

  const [weak, fair, good] = thresholds
  if (score <= weak) return 'weak'
  if (score <= fair) return 'fair'
  if (score <= good) return 'good'
  return 'strong'
}
