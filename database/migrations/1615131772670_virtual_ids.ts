import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VirtualIds extends BaseSchema {
  public async up () {
    this.schema.table('questions', (table) => {
      table.integer('order')
    })
  }

  public async down () {
    this.schema.table('questions', (table) => {
      table.dropColumn('order')
    })
  }
}
