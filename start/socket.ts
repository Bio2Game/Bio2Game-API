import socketIo from 'socket.io'
import Server from '@ioc:Adonis/Core/Server'
import GameManager from '../socket.io/GameManager'

const io = socketIo(Server.instance!, {
  path: '/socket',
})

new GameManager(io)
