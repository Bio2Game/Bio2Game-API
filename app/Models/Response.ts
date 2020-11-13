import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Quiz from 'App/Models/Quiz'
import Question from 'App/Models/Question'
import User from 'App/Models/User'

export default class Response extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public simpleUserId: string

  @column()
  public responsTimeSpent: number

  @column()
  public questionId: number

  @column()
  public quizId: number

  @column()
  public response: string

  @column()
  public reponsNb: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Quiz)
  public quiz: BelongsTo<typeof Quiz>

  @belongsTo(() => Question)
  public question: BelongsTo<typeof Question>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
