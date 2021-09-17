import { Socket } from 'socket.io'
import Game from './Game'

import { PlayerResponse, PartialUser, PlayerResponsePayload } from './types'

export default class Player {
  public socket: Socket

  public game: Game

  public id: number
  public username: string
  public email: string
  public avatar_path?: string

  public isGuest: boolean

  public responses: PlayerResponse[]

  public isOnline: boolean

  constructor(socket: Socket, user: PartialUser, game: Game) {
    this.socket = socket

    this.game = game

    this.id = user.id
    this.username = user.username
    this.avatar_path = user.avatar_path
    this.email = user.email
    this.isGuest = !user.email

    this.responses = []
  }

  public connection() {
    this.isOnline = true

    this.game.room.emit('player_join', this.serialize())

    this.socket.once('disconnect', this.onDisconnect.bind(this))

    this.socket.emit('game', this.game.serialize())
    this.socket.emit('you', this.serialize(true))

    this.socket.on('responseGiven', (data: PlayerResponsePayload) => {
      this.game.currentQuestion.onReponse(this, data)
    })
  }

  public onDisconnect() {
    this.isOnline = false

    this.game.room.emit('player_leave', this.serialize())

    if (this.game.status === 0) {
      this.game.players.splice(this.game.players.indexOf(this), 1)
    }
  }

  public serialize(responses = false) {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      avatar_path: this.avatar_path,
      isGuest: this.isGuest,
      isOnline: this.isOnline,
      responses: responses ? this.responses : undefined,
    }
  }

  public asResponse() {
    return {
      id: this.id,
      username: this.username,
      responses: this.responses,
    }
  }
}
