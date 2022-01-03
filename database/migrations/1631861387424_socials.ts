import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Socials extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('password', 180).alter().nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.table(this.tableName, () => {
      // /!\ Not reversible
      // table.string('password', 180).alter().notNullable()
    })
  }
}
