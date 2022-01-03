import { DateTime } from 'luxon'

export interface Question {
  id: number
  label: string
  profil: number
  question: string
  responses: string
  explication: string
  source: string
  status: number
  time: number
  language: string
  quizId: number
  createdAt: DateTime
  updatedAt: DateTime
}

export interface PartialUser {
  id: number
  username: string
  name?: string
  email: string
  avatar?: string
  website?: string
}

export interface BannedPlayer {
  id: number
  username: string
  name?: string
  email: string
  avatar?: string
  ip?: string
}

export interface PlayerResponse {
  id: number
  response: number
  time: number
}

export interface PlayerResponsePayload {
  id: number
  response: number
}

export interface CreateGamePayload {
  name: string
  questions: Question[]
  animatorId: number
}

export interface JoinGamePayload {
  gameId: string
  auth: UserAuthPayload
}

export interface UserAuthPayload {
  token: string
  user: PartialUser
}

export interface QuestionsResponses {
  id: number
  label: string
  right_answers: number
  wrong_answers: number
  really_wrong_answers: number
  answers: QuestionResponse[]
}

export interface QuestionResponse {
  user_id: number
  username: string
  time: number
  response: string
  responseNb: number
}
