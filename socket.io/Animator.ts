import { Socket } from 'socket.io'
import Game from './Game'

import { PartialUser } from './types'

export default class Animator {
  public socket: Socket

  public game: Game

  public id: number
  public username: string
  public name?: string
  public email: string
  public avatar?: string

  public website?: string

  public isOnline: boolean
  public isAnimator: boolean = true

  constructor(socket: Socket, user: PartialUser, game: Game) {
    this.socket = socket

    this.game = game

    this.id = user.id
    this.username = user.username
    this.name = user.name
    this.email = user.email
    this.avatar = user.avatar

    this.website = user.website
  }

  public connection() {
    this.socket.emit('game', this.game.serialize())
    this.socket.emit('you', this.serialize())
    this.socket.emit('stats', this.game.stats)

    this.socket.on('startGame', () => {
      console.log('Lancement de la partie !')
      this.game.start()
    })

    this.socket.on('stopGame', async () => {
      console.log('Arrêt de la partie !')
      await this.game.stop()
    })

    this.socket.on('banPlayer', (origin_player) => {
      const player = this.game.players.find((u) => u.id === origin_player.id)
      if (player) {
        this.game.bannedPlayers.push({
          id: player.id,
          username: player.username,
          email: player.email,
          avatar: player.avatar,
          ip: player.socket.conn.remoteAddress,
        })
        player.socket.emit('gameError', {
          error: 403,
          message: 'Vous avez été banni de cette partie.',
        })
        return player.socket.disconnect()
      }

      return this.game.bannedPlayers.push(origin_player)
    })

    this.socket.on('pause', () => {
      this.game.setPause()
    })

    this.socket.on('resume', () => {
      this.game.setResume()
    })
  }

  public serialize() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      website: this.website,
      avatar: this.avatar,
      isOnline: this.isOnline,
      animator: true,
    }
  }
}
