import GameManager from '../socket.io/GameManager'

import Ws from 'App/Services/Ws'
Ws.boot()

new GameManager(Ws.io)
