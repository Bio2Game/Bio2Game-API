import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserDescriptions extends BaseSchema {
  protected tableName = 'user_descriptions'

  public async up() {
    this.schema.table('users', (table) => {
      table.string('description')
    })
  }

  public async down() {
    this.schema.table('users', (table) => {
      table.dropColumn('description')
    })
  }
}
