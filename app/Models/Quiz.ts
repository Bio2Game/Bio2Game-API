import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Question from 'App/Models/Question'
import Domain from 'App/Models/Domain'
import User from 'App/Models/User'

export default class Quiz extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public label: string

  @column()
  public description: string

  @column()
  public url: string

  @column()
  public language: string

  @column()
  public domainId: number

  @column()
  public status: number

  @column()
  public contributorId: number

  @column()
  public localisation: string

  @column()
  public level: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Question)
  public questions: HasMany<typeof Question>

  @belongsTo(() => Domain, { localKey: 'id', foreignKey: 'domainId' })
  public domain: BelongsTo<typeof Domain>

  @belongsTo(() => User, { localKey: 'id', foreignKey: 'contributorId' })
  public author: BelongsTo<typeof User>
}
