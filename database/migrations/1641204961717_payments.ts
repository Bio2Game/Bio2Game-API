import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Socials extends BaseSchema {
  protected tableName = 'payments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').notNullable()
      table.string('identity')
      table.string('email')
      table.string('reason')
      table.string('name')
      table.timestamp('start_date')
      table.string('duration')
      table.integer('students')
      table.boolean('results')
      table.boolean('iframe')
      table.integer('costs')
      table.boolean('donations')
      table.timestamp('created_at')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
