import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import Icon from 'App/Models/Icon'

export default class Domain extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public label: string

  @column()
  public iconId: number

  @column()
  public image?: string

  @column()
  public keyswords: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Icon, { localKey: 'id', foreignKey: 'iconId' })
  public icon: BelongsTo<typeof Icon>
}
