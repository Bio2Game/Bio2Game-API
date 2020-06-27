import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'

import Quiz from 'App/Models/Quiz'
import Comment from 'App/Models/Comment'
import Party from 'App/Models/Party'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public languageCode: string

  @column()
  public sex: number

  @column.date()
  public birthDate: DateTime

  @column()
  public localisation: string

  @column()
  public status: number

  @column()
  public contributorType: number

  @column()
  public emailContributor: string

  @column()
  public mobileContributor: string

  @column()
  public website: string

  @column()
  public avatar_path: string

  @column()
  public isAnimator: boolean

  @column()
  public login_source: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Quiz)
  public quizs: HasMany<typeof Quiz>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Party)
  public parties: HasMany<typeof Party>

  @manyToMany(() => User, {
    pivotTable: 'playersAnimators',
    localKey: 'id',
    pivotForeignKey: 'playerId',
    pivotRelatedForeignKey: 'animatorId',
    relatedKey: 'id',
  })
  public animators: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'playersAnimators',
    localKey: 'id',
    pivotForeignKey: 'animatorId',
    pivotRelatedForeignKey: 'playerId',
    relatedKey: 'id',
  })
  public players: ManyToMany<typeof User>
}
