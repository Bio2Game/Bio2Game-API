import Party from 'App/Models/Party'

import GameManager from './GameManager'
import Player from './Player'
import Phase from './Phase'
import Timer from './Timer'
import Animator from './Animator'

import { Question, UserAuthPayload, BannedPlayer, QuestionsResponses } from './types'

import { BroadcastOperator, Socket } from 'socket.io'

import moment from 'moment'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

export default class Game {
  public id: string
  public name: string
  public status: number = 0
  public currentQuestion: Phase
  public questions: Question[]
  public animatorId: number
  public animator: Animator
  public startDate: string
  public players: Player[] = []
  public bannedPlayers: BannedPlayer[] = []
  public stats: QuestionsResponses[] = []
  public finished: Timer
  public manager: GameManager
  public room: BroadcastOperator<DefaultEventsMap>
  public pause: boolean
  public party: Party
  public started: boolean

  constructor(manager: GameManager, name: string, questions: Question[], animatorId: number) {
    this.id = this.createCode()
    this.name = name
    this.questions = questions
    this.animatorId = animatorId
    this.startDate = moment().format()

    this.manager = manager

    this.room = manager.io.to(this.id)

    this.pause = false
    this.started = false
  }

  public onConnect(socket: Socket, { user }: UserAuthPayload) {
    if (user && user.id === this.animatorId) {
      if (this.animator) {
        this.animator.socket.disconnect()
        this.animator.socket = socket

        return this.animator.connection()
      }

      this.animator = new Animator(socket, user, this)
      return this.animator.connection()
    }

    if (
      this.bannedPlayers.some(
        (player) => player.id === user.id || player.ip === socket.conn.remoteAddress
      )
    ) {
      socket.emit('gameError', {
        error: 403,
        message: 'Vous avez été banni de cette partie.',
      })
      return socket.disconnect()
    }

    const playerExists = this.players.find((player) => player.id === user.id)

    if (playerExists) {
      playerExists.socket.disconnect()
      playerExists.socket = socket

      return playerExists.connection()
    } else if (this.status > 0) {
      socket.emit('gameError', {
        error: 403,
        message: 'Cette partie a déjà été lancé.',
      })
      return socket.disconnect()
    }

    if (this.players.some((player) => player.id === user.id)) {
      return socket.disconnect()
    }

    const player = new Player(socket, user, this)
    this.players.push(player)

    return player.connection()
  }

  public async start() {
    if (this.started) {
      return
    }

    this.started = true

    this.party = new Party()

    this.party.$attributes = {
      code: this.id,
      name: this.name,
      questionsList: JSON.stringify(
        this.questions.map((question) => {
          return {
            id: question.id,
            label: question.label,
            question: question.question,
            responses: question.responses,
          }
        })
      ),
      questionsSize: this.questions.length,
      playersSize: this.players.length,
      contributorId: this.animatorId,
      responses: '{}',
      finished: false,
    }

    await this.party.save()

    for (const question of this.questions) {
      this.status = 1

      this.currentQuestion = new Phase(question, this)

      this.room.emit('game', this.serialize())

      this.stats.push({
        id: question.id,
        label: question.label,
        right_answers: 0,
        wrong_answers: 0,
        really_wrong_answers: 0,
        answers: [],
      })

      await this.currentQuestion.run()

      this.room.emit('game', this.serialize())
    }

    this.party.finished = true

    this.party.save()

    this.status = 3

    this.finished = new Timer(2 * 60 * 1000)

    this.room.emit('game', this.serialize())

    await this.finished.start()

    return this.stop()
  }

  public setPause() {
    if (this.finished) {
      return
    }
    this.pause = true
    this.currentQuestion.timer.pause()
    this.room.emit('pause')
  }

  public setResume() {
    if (this.finished) {
      return
    }
    this.pause = false

    if (this.currentQuestion.allAnswersReceived() && this.status === 1) {
      return this.currentQuestion.timer.stop()
    }

    this.currentQuestion.timer.resume()

    this.room.emit('progress', {
      timeLeft: this.currentQuestion.timer.getTimeLeft(),
      timeTotal: this.currentQuestion.timer.time,
    })
  }

  public async stop() {
    const users = [...this.players, this.animator]
    await Promise.all(users.map(async (user) => await user.socket.disconnect()))
    this.manager.deleteGame(this.id)
  }

  public onlinePlayers() {
    return this.players.filter((u) => u.isOnline)
  }

  public createCode() {
    const caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += caracters[Math.floor(Math.random() * caracters.length)]
    }
    return code
  }

  public serialize() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      currentQuestion: this.currentQuestion ? this.currentQuestion.serialize() : null,
      finished: this.finished ? this.finished.serialize() : null,
      questions: this.questions,
      animatorId: this.animatorId,
      animator: this.animator ? this.animator.serialize() : null,
      startDate: this.startDate,
      players: this.players.map((player) => player.serialize()),
      pause: this.pause,
    }
  }
}
