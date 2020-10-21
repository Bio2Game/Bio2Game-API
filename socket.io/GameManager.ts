// import AuthToken from 'App/Models/AuthToken'

import { Server, Socket } from 'socket.io'

import Game from './Game'

import { JoinGamePayload, CreateGamePayload } from './types'

export default class GameManager {
  public games: Game[] = []
  public io: Server

  constructor (io: Server){
    this.io = io

    io.on('connection', this.registerEvents.bind(this))
  }

  public registerEvents (socket: Socket) {
    socket.on('joinGame', async ({ gameId, token }: JoinGamePayload) => {
      const game = this.games.find(game => game.id === gameId)

      if(!token) {
        socket.emit('authError', {
          error: 404,
          message: 'Non connecté',
        })
        console.log('Déconnexion auth !')
        return socket.disconnect()
      }

      if(!game) {
        socket.emit('gameError', {
          error: 404,
          message: 'Impossible de trouver cette partie',
        })
        console.log('Déconnexion game !')
        return socket.disconnect()
      }

      /**
       * TODO
       * Move auth from game to here
       */

      socket.join(game.id)

      await game.onConnect(socket, token)
    })

    socket.on('createGame', async ({ name, questions, animatorId }: CreateGamePayload) => {
      const game = new Game(this, name, questions, animatorId)
      this.games.push(game)

      return socket.emit('game_created', game.id)
    })
  }

  public deleteGame (gameId: string) {
    const gameIndex = this.games.findIndex(g => g.id === gameId)
    this.games.splice(gameIndex, 1)
  }
}
