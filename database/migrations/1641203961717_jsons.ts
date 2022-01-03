import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Socials extends BaseSchema {
  protected tableName = 'questions'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.json('responses').alter()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.text('responses').alter()
    })
  }
}
