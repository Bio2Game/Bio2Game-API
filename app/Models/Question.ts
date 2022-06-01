import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Quiz from 'App/Models/Quiz'
import Response from 'App/Models/Response'

export enum QuestionStatus {
  Hidden,
  Public,
}

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public label: string

  @column()
  public profil: number

  @column()
  public question: string

  @column()
  public responses: Object

  @column()
  public explication: string

  @column()
  public source: string

  @column()
  public status: QuestionStatus

  @column()
  public time: number

  @column()
  public quizId: number

  @column()
  public order: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Quiz, { localKey: 'id', foreignKey: 'quizId' })
  public quiz: BelongsTo<typeof Quiz>

  @belongsTo(() => Response, { localKey: 'questionId', foreignKey: 'id' })
  public user_response: BelongsTo<typeof Response>
}
