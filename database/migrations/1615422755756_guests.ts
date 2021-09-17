import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Guests extends BaseSchema {
  protected tableName = 'guests'

  public async up() {
    this.schema.createTable('guests', (table) => {
      table.string('id').primary()
      table.string('username', 255).notNullable()
      table.timestamps()
    })

    this.schema.createTable('guest_tokens', (table) => {
      table.increments('id').primary()
      table.string('user_id').references('id').inTable('guests').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.string('token', 64).notNullable()
      table.timestamp('expires_at').nullable()
      table.timestamp('created_at').nullable()
    })

    this.schema.table('responses', (table) => {
      table.renameColumn('simple_user_id', 'guest_id')
    })

    this.schema.renameTable('api_tokens', 'user_tokens')
  }

  public async down() {
    this.schema.dropTable('guest_tokens')
    this.schema.dropTable('guests')

    this.schema.renameTable('user_tokens', 'api_tokens')

    this.schema.table('responses', (table) => {
      table.renameColumn('guest_id', 'simple_user_id')
    })
  }
}
