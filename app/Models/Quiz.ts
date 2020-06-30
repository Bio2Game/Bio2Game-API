import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Question)
  public questions: HasMany<typeof Question>

  @hasOne(() => Domain)
  public domain: HasOne<typeof Domain>

  @hasOne(() => User)
  public author: HasOne<typeof User>
}
