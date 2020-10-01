import Party from 'App/Models/Party'
import Quiz from 'App/Models/Quiz'

import GameManager from './GameManager'
import Player from './Player'
import Phase from './Phase'
import Timer from './Timer'
import Animator from './Animator'

import { Question } from './types'

import { Namespace, Socket } from 'socket.io'

import moment from 'moment'

export default class Game {
  public id: string
  public name: string
  public status: number = 0
  public quiz: any
  public currentQuestion: any
  public questions: Question[]
  public currentResponses: null
  public animatorId: number
  public animator: Animator
  public startDate: string
  public players: Player[] = []
  public finished: Timer
  public manager: GameManager
  public room: Namespace
  public pause: boolean
  public party: Party

  constructor (manager: GameManager, name: string, quiz: Quiz, questions: Question[], animatorId: number) {
    this.id = this.createCode()
    this.name = name
    this.quiz = quiz
    this.currentQuestion = null
    this.questions = questions
    this.currentResponses = null
    this.animatorId = animatorId
    this.startDate = moment().format()

    this.manager = manager

    this.room = manager.io.to(this.id)

    this.pause = false
  }

  public async onConnect (socket: Socket, token: string) {
    const auth = (await AuthToken.query().with('user').with('simpleAuth').where('token', '=', token).first()).toJSON()

    const user = auth.user || auth.simpleAuth

    if (auth.user && user.id === this.animatorId) {
      if (this.animator) {
        this.animator.socket.disconnect()
        this.animator.socket = socket

        return this.animator.connection()
      }

      this.animator = new Animator(socket, user, this)
      return
    }

    const playerExists = this.players.find(player => player.id === user.id)

    if (playerExists) {
      playerExists.socket.disconnect()
      playerExists.socket = socket

      return playerExists.connection()
    }else if(this.status > 0){
      socket.emit('gameError', {
        error: 403,
        message: 'Cette partie a déjà été lancé',
      })
      return socket.disconnect()
    }

    if (this.players.some(player => player.id === user.id)) {
      return socket.disconnect()
    }

    const player = new Player(socket, user, this)

    this.players.push(player)

    this.room.emit('join', player.serialize())

    // this.players.concat([this.animator]).forEach(p => p.socket.emit('join', player.serialize()));
  }

  public async start () {
    this.party = new Party()

    this.party.$attributes = {
      code: this.id,
      name: this.name,
      questionsList: JSON.stringify(this.questions.map(question => {
        return {
          id: question.id,
          label: question.label,
          question: question.question,
          responses: JSON.parse(question.responses),
        }
      })),
      questionsSize: this.questions.length,
      playersSize: this.players.length,
      quizId: this.quiz.id,
      contributorId: this.animatorId,
      responses: '{}',
      finished: false,
    }

    await this.party.save()

    for (const question of this.questions) {
      this.status = 1

      this.currentQuestion = new Phase(question, this)

      this.room.emit('game', this.serialize())

      await this.currentQuestion.run()

      this.room.emit('game', this.serialize())
    }

    this.party.finished = true

    this.party.save()

    this.status = 3

    this.finished = new Timer(2* 60 * 1000)

    this.room.emit('game', this.serialize())

    await this.finished.start()

    return this.stop()
  }

  public setPause () {
    if(this.finished !== null) {
      return
    }
    this.currentQuestion.timer.pause()
    this.room.emit('pause')
  }

  public setResume () {
    if(this.finished !== null) {
      return
    }
    this.currentQuestion.timer.resume()
    this.room.emit('progress', {
      timeLeft: this.currentQuestion.timer.getTimeLeft(),
      timeTotal: this.currentQuestion.timer.time,
    })
  }

  public async stop () {
    const users = [...this.players, this.animator]
    await Promise.all(users.map(async user => await user.socket.disconnect()))
    this.manager.deleteGame(this.id)
  }

  public onlinePlayers () {
    return this.players.filter(u => u.isOnline)
  }

  public createCode () {
    const caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += caracters[Math.floor(Math.random() * caracters.length)]
    }
    return code
  }

  public serialize (){
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      quiz: this.quiz,
      currentQuestion: this.currentQuestion ? this.currentQuestion.serialize() : null,
      finished: this.finished ? this.finished.serialize() : null,
      questions: this.questions,
      currentResponses: this.currentResponses,
      animatorId: this.animatorId,
      animator: this.animator ? this.animator.serialize() : null,
      startDate: this.startDate,
      players: this.players.map(player => player.serialize()),
    }
  }
}
