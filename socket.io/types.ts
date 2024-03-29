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
  avatar_path?: string
  website?: string
}

export interface BannedPlayer {
  id: number
  username: string
  name?: string
  email: string
  avatar_path?: string
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
  question_id: number
  question_desc: string
  right_answers: number
  wrong_answers: number
  really_wrong_answers: number
}
