import { Socket } from 'socket.io'
import Game from './Game'

export default class Animator {
  public socket: Socket

  public game: Game

  public id: number
  public username: string
  public email: string
  public avatar_path: string

  public website: string

  public isOnline: boolean
  public isAnimator: boolean = true

  constructor (socket, user, game) {
    this.socket = socket

    this.game = game

    this.id = user.id
    this.username = user.pseudo
    this.email = user.email
    this.avatar_path = user.avatar_path

    this.website = user.website

    this.connection()
  }

  public connection () {
    this.socket.emit('game', this.game.serialize())
    this.socket.emit('you', this.serialize())

    this.socket.on('startGame', () => {
      console.log('Lancement de la partie !')
      this.game.start()
    })

    this.socket.on('stopGame', async () => {
      console.log('Arrêt de la partie !')
      await this.game.stop()
    })

    this.socket.on('kickUser', id => {
      console.log('Exclusion d\'un utilisateur')
      this.game.players.find(u => u.id === id)?.socket.disconnect()
    })

    this.socket.on('pause', () => {
      this.game.setPause()
      console.log('i want a pause', this.game.currentQuestion.timer.getTimeLeft())
    })

    this.socket.on('resume', () => {
      this.game.setResume()
      console.log('i want to work', this.game.currentQuestion.timer.getTimeLeft())
    })
  }

  public serialize (){
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      website: this.website,
      avatar_path: this.avatar_path,
      isOnline: this.isOnline,
      animator: true,
    }
  }
}
