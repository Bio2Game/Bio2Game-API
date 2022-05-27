import GameManager from '../socket.io/GameManager'

import Ws from 'App/Services/Ws'
Ws.boot()

try {
  new GameManager(Ws.io)
} catch (error) {
  console.error(error)
}
