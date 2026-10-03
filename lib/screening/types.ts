// lib/screening/types.ts

export type ScreeningQuestionType =
  | 'yes_no'
  | 'text'
  | 'number'
  | 'multiple_choice'

export type ScreeningQuestionInput = {
  id?: string              // ada kalau edit
  question: string
  description?: string
  type: ScreeningQuestionType
  options?: string[]       // untuk multiple_choice
  isRequired: boolean
  sortOrder: number
}

export type ScreeningAnswerInput = {
  questionId: string
  answerText?: string
  answerBool?: boolean
  answerNumber?: number
  answerChoice?: string
}

export const QUESTION_TYPE_LABEL: Record<ScreeningQuestionType, string> = {
  yes_no: 'Ya / Tidak',
  text: 'Jawaban Singkat',
  number: 'Angka',
  multiple_choice: 'Pilihan Ganda',
}

export const MAX_QUESTIONS = 10