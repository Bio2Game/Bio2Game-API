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
  email: string
  uuid: number | null
}

export interface PlayerResponsePayload {
  id: number
  response: string
  time: number
}

export interface CreateGamePayload {
  quizId: number
  name: string
  questions: Question[]
  animatorId: number
}

export interface JoinGamePayload {
  gameId: string
  user: UserAuthPayload
}

export interface UserAuthPayload {
  auth: boolean
  token: string
  user: number | null
}
