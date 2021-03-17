import { DateTime } from 'luxon'
import { column, BaseModel, hasMany, HasMany, beforeCreate } from '@ioc:Adonis/Lucid/Orm'

const uuid = require('uuid')

import Party from 'App/Models/Party'

export default class Guest extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public username: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Party)
  public parties: HasMany<typeof Party>

  @beforeCreate()
  public static generateUUID (guest: Guest) {
    guest.id = uuid.v4()
  }
}
