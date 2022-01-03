import Timer from './Timer'
import Game from './Game'
import Player from './Player'

import { Question, PlayerResponsePayload, PlayerResponse } from './types'

const refs = ['right_answers', 'wrong_answers', 'wrong_answers', 'really_wrong_answers']

export default class Phase {
  public question: Question
  public timer: Timer
  private game: Game

  public position: Number

  constructor(question: Question, game: Game) {
    this.question = question
    this.game = game
    this.position = this.game.questions.indexOf(question)
  }

  public async run() {
    await this.start()
    return this.response()
  }

  public async start() {
    this.timer = new Timer(this.question.time * 1000)

    this.game.room.emit('progress', {
      timeLeft: this.timer.getTimeLeft(),
      timeTotal: this.timer.time,
    })

    await this.timer.start()
  }

  public async response() {
    this.timer = new Timer(10 * 1000)

    this.game.party.responses = JSON.stringify(
      this.game.players.map((player: Player) => player.asResponse())
    )

    this.game.party.save()

    this.game.onlinePlayers().forEach((player: Player) => {
      player.socket.emit(
        'show_response',
        player.responses.find((response: PlayerResponse) => response.id === this.question.id)
      )
    })

    this.game.animator.socket.emit('game', this.game.serialize())

    this.game.room.emit('progress', {
      timeLeft: this.timer.getTimeLeft(),
      timeTotal: this.timer.time,
    })

    this.game.status = 2

    await this.timer.start()
  }

  public onReponse(player: Player, data: PlayerResponsePayload) {
    const time = Number((this.timer.getCurrentTime() / 1000).toFixed(1))
    player.responses.push({
      id: data.id,
      response: data.response,
      time,
    })

    this.saveAnswer(player, data, time)

    if (this.game.pause) {
      return
    }

    if (
      this.game.onlinePlayers().length ===
      this.game.players.filter((u: Player) =>
        u.responses.some((response: PlayerResponse) => response.id === data.id)
      ).length
    ) {
      this.timer.stop()
    }
  }

  private saveAnswer(player: Player, data: PlayerResponsePayload, time: number) {
    const question = this.game.stats.find((question) => question.id === data.id)
    if (!question) return

    const answerType = refs[data.response.toString()]

    question.answers.push({
      user_id: player.id,
      username: player.username,
      response: this.game.currentQuestion.question.responses[`response${data.response}`],
      responseNb: data.response,
      time,
    })
    question[answerType]++

    this.game.animator.socket.emit('stats', this.game.stats)
  }

  public allAnswersReceived() {
    return (
      this.game.onlinePlayers().length ===
      this.game.players.filter((u: Player) =>
        u.responses.some((response: PlayerResponse) => response.id === this.question.id)
      ).length
    )
  }

  public serialize() {
    return {
      question: this.question,
      timer: this.timer?.serialize(),
      position: this.position,
    }
  }
}
