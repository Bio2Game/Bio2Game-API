import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Formations extends BaseSchema {
  public async up () {
    this.schema.createTable('formations', (table) => {
      table.increments('id')
      table.string('label').notNullable().unique()
      table.string('description').notNullable()
      table.text('content').notNullable()
      table.string('url').notNullable()
      table.integer('level').notNullable().defaultTo(0)
      table.integer('status').notNullable().defaultTo(0)
      table.integer('duration').notNullable()
      table.integer('leaves').notNullable()
      table.integer('user_id').unsigned()
      table.integer('domain_id').unsigned()
      table.timestamps()
    })

    this.schema.createTable('formation_quiz', (table) => {
      table.integer('formation_id').unsigned()
      table.integer('quiz_id').unsigned()
    })
  }

  public async down () {
    this.schema.dropTable('formations')
    this.schema.dropTable('formation_quiz')
  }
}
