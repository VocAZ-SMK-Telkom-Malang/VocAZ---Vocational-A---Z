// lib/matching/types.ts

export type MatchWeights = {
  skills: number        // default 40
  experience: number    // default 20
  education: number     // default 15
  certifications: number // default 15
  location: number      // default 10
}

export const DEFAULT_WEIGHTS: MatchWeights = {
  skills: 40,
  experience: 20,
  education: 15,
  certifications: 15,
  location: 10,
}

export type SkillMatchDetail = {
  skillId: string
  skillName: string
  required: boolean
  matched: boolean
  matchedByName?: string  // kalau fuzzy match (misal "React Native" untuk "React")
  proficiency?: string
  score: number
}

export type MatchBreakdown = {
  totalScore: number
  skills: {
    score: number
    weight: number
    matched: number
    total: number
    details: SkillMatchDetail[]
  }
  experience: {
    score: number
    weight: number
    months: number
    description: string
  }
  education: {
    score: number
    weight: number
    description: string
  }
  certifications: {
    score: number
    weight: number
    count: number
    description: string
  }
  location: {
    score: number
    weight: number
    description: string
  }
}