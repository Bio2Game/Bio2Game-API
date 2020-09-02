import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Question from 'App/Models/Question'
import User from 'App/Models/User'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public questionId: number

  @column()
  public parentId: number

  @column()
  public content: string

  @column()
  public like: number

  @column()
  public dislike: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Comment, { localKey: 'parentId', foreignKey: 'id' })
  public replies: HasMany<typeof Comment>

  @belongsTo(() => Question, { localKey: 'questionId', foreignKey: 'id' })
  public question: BelongsTo<typeof Question>

  @belongsTo(() => User, { localKey: 'userId', foreignKey: 'id' })
  public author: BelongsTo<typeof User>
}
