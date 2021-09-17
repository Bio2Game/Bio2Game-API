import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'

import Domain from 'App/Models/Domain'
import User from 'App/Models/User'
import Quiz from 'App/Models/Quiz'

export default class Formation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public label: string

  @column()
  public description: string

  @column()
  public content: string

  @column()
  public url: string

  @column()
  public domainId: number

  @column()
  public level: number

  @column()
  public status: number

  @column()
  public duration: number

  @column()
  public leaves: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Domain, { localKey: 'id', foreignKey: 'domainId' })
  public domain: BelongsTo<typeof Domain>

  @belongsTo(() => User, { localKey: 'id', foreignKey: 'userId' })
  public author: BelongsTo<typeof User>

  @manyToMany(() => Quiz)
  public quizzes: ManyToMany<typeof Quiz>
}
