
import Timer from './Timer'
import Game from './Game'
import Player from './Player'

import { Question, PlayerResponsePayload } from './types'

export default class Phase {
  public question: Question
  public timer: Timer
  private game: Game

  constructor (question: Question, game: Game) {
    this.question = question
    this.game = game
  }

  public async run () {
    await this.start()
    return this.response()
  }

  public async start () {
    this.timer = new Timer(this.question.time * 1000)

    this.game.room.emit('progress', {
      timeLeft: this.timer.getTimeLeft(),
      timeTotal: this.timer.time,
    })

    await this.timer.start()
  }

  public async response () {
    this.timer = new Timer(10 * 1000)

    this.game.party.responses = JSON.stringify(this.game.players.map((player: Player) => player.serialize()))

    this.game.party.save()

    this.game.onlinePlayers().forEach((player: Player) => {
      player.socket.emit('showResponse', player.responses.find((response: PlayerResponsePayload) =>
        response.id === this.question.id))
    })

    this.game.animator.socket.emit('playersResponses',
      this.game.onlinePlayers().map((player: Player) => player.serialize()))

    this.game.room.emit('progress', {
      timeLeft: this.timer.getTimeLeft(),
      timeTotal: this.timer.time,
    })

    this.game.status = 2

    await this.timer.start()
  }

  public onReponse (player: Player, data) {
    player.responses.push({
      id: data.id,
      response: data.response,
      time: this.timer.getCurrentTime(),
    })

    if (this.game.onlinePlayers().length === this.game.players.filter((u: Player) =>
      u.responses.some((response: PlayerResponsePayload) => response.id === data.id)
    ).length) {
      this.timer.stop()
    }
  }

  public serialize () {
    return {
      question: this.question,
      timer: this.timer?.serialize(),
    }
  }
}
