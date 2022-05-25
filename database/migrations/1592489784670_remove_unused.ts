import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  public async up() {
    this.schema.table('users', (table) => {
      table.renameColumn('pseudo', 'username')
      table.renameColumn('mobilContributor', 'mobileContributor')
      table.dropColumns(
        'lastConnexionDate',
        'contributorEmailResponse',
        'geolocalizationType',
        'currentGeolocalisationID',
        'account_status'
      )
    })

    this.schema.table('domains', (table) => {
      table.dropColumns('activationDate', 'endDate', 'uniqName')
    })

    this.schema.table('questions', (table) => {
      table.dropColumns(
        'nbOfPoint',
        'nbOPlus',
        'nbOfMinus',
        'natureCode',
        'uniqId',
        'startDate',
        'endDate',
        'language'
      )
    })

    this.schema.table('comments', (table) => {
      table.renameColumn('comment', 'content')
      table.renameColumn('responsId', 'parentId')
      table.dropColumn('uniqName')
    })
  }

  public async down() {
    this.schema.table('users', (table) => {
      table.renameColumn('username', 'pseudo')
      table.date('lastConnexionDate')
      table.renameColumn('mobileContributor', 'mobilContributor')
      table.text('contributorEmailResponse')
      table.integer('geolocalizationType')
      table.integer('currentGeolocalisationID')
      table.string('account_status').defaultTo('active')
    })

    this.schema.table('domains', (table) => {
      table.date('activationDate')
      table.date('endDate')
      table.string('uniqName', 30).notNullable().unique()
    })

    this.schema.table('questions', (table) => {
      table.integer('nbOfPoint').unsigned().notNullable().defaultTo(0)
      table.integer('nbOPlus').notNullable().defaultTo(0)
      table.integer('nbOfMinus').notNullable().defaultTo(0)
      table.integer('natureCode')
      table.string('uniqId').notNullable().defaultTo('')
      table.date('startDate')
      table.date('endDate').defaultTo(null)
    })

    this.schema.table('comments', (table) => {
      table.renameColumn('content', 'comment')
      table.renameColumn('parentId', 'responsId')
      table.string('uniqName').unique()
      table.foreign('userId')
      table.foreign('responsId')
      table.foreign('questionId')
    })
  }
}
