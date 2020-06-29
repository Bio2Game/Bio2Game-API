import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Quiz from 'App/Models/Quiz'

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
  public responses: JSON

  @column()
  public explication: string

  @column()
  public source: string

  @column()
  public status: number

  @column()
  public time: number

  @column()
  public language: string

  @column()
  public quizId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Quiz, { localKey: 'questionId', foreignKey: 'id' })
  public quiz: BelongsTo<typeof Quiz>
}
