import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  public async up() {
    this.schema.table('users', (table) => {
      table.string('remember_me_token').nullable()
    })

    this.schema.createTable('api_tokens', (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('username')
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.string('token', 64).notNullable()

      table.timestamp('expires_at').nullable()
      table.timestamp('created_at').nullable()
    })

    this.schema.dropTable('tokens')

    this.schema.table('quizzes', (table) => {
      table.integer('level').notNullable().defaultTo(0)
    })

    this.schema.table('comments', (table) => {
      table.integer('like').defaultTo(0).unsigned()
      table.integer('dislike').defaultTo(0).unsigned()
      table.integer('status').defaultTo(0)
    })

    this.schema.table('parties', (table) => {
      table.dropColumn('quiz_id')
    })
  }

  public async down() {
    this.schema.table('users', (table) => {
      table.dropColumn('remember_me_token')
    })

    this.schema.dropTable('api_tokens')

    this.schema.createTable('tokens', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('token', 255).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })

    this.schema.table('quizzes', (table) => {
      table.dropColumn('level')
    })

    this.schema.table('comments', (table) => {
      table.dropColumn('like')
      table.dropColumn('dislike')
      table.dropColumn('status')
    })

    this.schema.table('parties', (table) => {
      table.integer('quiz_id')
    })
  }
}
