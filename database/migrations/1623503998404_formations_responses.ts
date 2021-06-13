import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FormationsResponses extends BaseSchema {
  protected tableName = 'formations_responses'

  public async up () {
    this.schema.table('responses', (table) => {
      table.string('type').notNullable().defaultTo('quiz')
    })
  }

  public async down () {
    this.schema.table('responses', (table) => {
      table.dropColumn('type')
    })
  }
}
