import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FixDefaultsValues extends BaseSchema {
  protected tableName = 'fix_defaults_values'

  public async up () {
    this.schema.table('questions', (table) => {
      table.string('explication').notNullable().defaultTo('').alter()
    })
  }

  public async down () {
    this.schema.table('questions', (table) => {
      table.text('explication').notNullable().alter()
    })
  }
}
