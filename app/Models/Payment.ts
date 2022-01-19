import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'

export default class Question extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public identity: string | null

  @column()
  public email: string | null

  @column()
  public reason: string | null

  @column()
  public name: string | null

  @column()
  public startDate: DateTime | null

  @column()
  public duration: string | null

  @column()
  public students: number | null

  @column()
  public results: boolean

  @column()
  public iframe: boolean

  @column()
  public costs: number

  @column()
  public donations: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @belongsTo(() => User, { localKey: 'id', foreignKey: 'userId' })
  public user: BelongsTo<typeof User>
}
