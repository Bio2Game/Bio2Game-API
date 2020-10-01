import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Party extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public playersSize: number

  @column()
  public questionsList: string

  @column()
  public questionsSize: number

  @column()
  public quizId: number

  @column()
  public contributorId: number

  @column()
  public responses: string

  @column()
  public finished: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
