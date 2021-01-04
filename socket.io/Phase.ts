
import Timer from './Timer'
import Game from './Game'
import Player from './Player'

import { Question, PlayerResponsePayload, PlayerResponse } from './types'

export default class Phase {
  public question: Question
  public timer: Timer
  private game: Game

  private refs: string[]

  public position: Number

  constructor (question: Question, game: Game) {
    this.question = question
    this.game = game
    this.position = this.game.questions.indexOf(question)

    this.refs = ['right_answers', 'wrong_answers', 'wrong_answers', 'really_wrong_answers']
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

    this.game.party.responses = JSON.stringify(this.game.players.map((player: Player) => player.asResponse()))

    this.game.party.save()

    this.game.onlinePlayers().forEach((player: Player) => {
      player.socket.emit('show_response', player.responses.find((response: PlayerResponse) =>
        response.id === this.question.id))
    })

    this.game.animator.socket.emit('game', this.game.serialize())

    this.game.room.emit('progress', {
      timeLeft: this.timer.getTimeLeft(),
      timeTotal: this.timer.time,
    })

    this.game.status = 2

    await this.timer.start()
  }

  public onReponse (player: Player, data: PlayerResponsePayload) {
    player.responses.push({
      id: data.id,
      response: data.response,
      time: this.timer.getCurrentTime(),
    })

    this.saveAnswer(data)

    if (this.game.pause) {
      return
    }

    if (this.game.onlinePlayers().length === this.game.players.filter((u: Player) =>
      u.responses.some((response: PlayerResponse) => response.id === data.id)
    ).length) {
      this.timer.stop()
    }
  }

  private saveAnswer (data: PlayerResponsePayload) {
    const question = this.game.stats.find(({ question_id }) => question_id === data.id)
    question![this.refs[data.response.toString()]]++

    this.game.animator.socket.emit('stats', this.game.stats)
  }

  public allAnswersReceived () {
    return this.game.onlinePlayers().length === this.game.players.filter((u: Player) =>
      u.responses.some((response: PlayerResponse) => response.id === this.question.id)
    ).length
  }

  public serialize () {
    return {
      question: this.question,
      timer: this.timer?.serialize(),
      position: this.position,
    }
  }
}
