import { Socket } from 'socket.io'
import Game from './Game'

import { PlayerResponsePayload, PartialUser } from './types'

export default class Player {
  public socket: Socket

  public game: Game

  public id: number
  public username: string
  public email: string
  public simpleAuth: boolean

  public responses: PlayerResponsePayload[]

  public isOnline: boolean

  constructor (socket: Socket, user: PartialUser, game: Game) {
    this.socket = socket

    this.game = game

    this.id = user.id
    this.username = user.username
    this.email = user.email
    this.simpleAuth = user.uuid !== null

    this.connection()
  }

  public connection () {
    this.isOnline = true

    this.socket.once('disconnect', this.onDisconnect.bind(this))

    this.socket.emit('game', this.game.serialize())
    this.socket.emit('you', this.serialize())

    this.socket.on('responseGiven', data => {
      // Warning
      this.game.currentQuestion.onReponse(this, data)
    })
  }

  public onDisconnect () {
    this.isOnline = false

    this.game.room.emit('leave', this.serialize())

    if (this.game.status === 0) {
      this.game.players.splice(this.game.players.indexOf(this), 1)
    }
  }

  public serialize (){
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      simpleAuth: this.simpleAuth,
      isOnline: this.isOnline,
      responses: this.responses,
    }
  }

//   public asResponse () {
//     return {
//       id: this.id,
//       username: this.username,
//       responses: this.responses.map(response => {
//         return {
//           questionId: response.id,
//           response: response.response,
//           time: response.time,
//         }
//       }),
//     }
//   }
}
