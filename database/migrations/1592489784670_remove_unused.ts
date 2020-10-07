import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  public async up () {
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

    this.schema.dropTable('usersDomains')

    this.schema.table('questions', (table) => {
      table.dropColumns(
        'nbOfPoint',
        'nbOPlus',
        'nbOfMinus',
        'natureCode',
        'uniqId',
        'startDate' ,
        'endDate',
        'language'
      )
    })

    this.schema.dropTable('nature')

    this.schema.dropTable('status')

    this.schema.table('comments', (table) => {
      table.renameColumn('comment', 'content')
      table.renameColumn('responsId', 'parentId')
      table.dropColumn('uniqName')
    })

    this.schema.dropTable('userGeolocalizationLogs')

    this.schema.dropTable('questiongeolocalizations')

    this.schema.dropTable('geolocalizationsList')

    this.schema.dropTable('geolocalisationType')

    this.schema.dropTable('languages')

    this.schema.dropTable('country')

    this.schema.dropTable('usersLangues')
  }

  public async down () {
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
      table.string('uniqName',30).notNullable().unique()
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

    this.schema.createTable('nature', (table) => {
      table.increments()
      table.integer('code').unsigned().notNullable()
      table.string('label').notNullable()
      table.timestamps()
    })

    this.schema.createTable('status', (table) => {
      table.increments()
      table.integer('code').unsigned().notNullable()
      table.string('label').notNullable()
      table.timestamps()
    })

    this.schema.table('comments', (table) => {
      table.renameColumn('content', 'comment')
      table.renameColumn('parentId', 'responsId')
      table.string('uniqName').unique()
      table.foreign('userId')
      table.foreign('responsId')
      table.foreign('questionId')
    })

    this.schema.createTable('userGeolocalizationLogs', (table) => {
      table.increments()
      table.integer('userId').unsigned().notNullable()
      table.date('endDate').defaultTo(null)
      table.integer('geolocalizationType')
      table.string('Lat')
      table.string('Lng')
      table.string('manualGeolocalizationId')
      table.foreign('userId')
      table.foreign('manualGeolocalizationId')
      table.foreign('geolocalizationType')
      table.timestamps()
    })

    this.schema.createTable('questiongeolocalizations', (table) => {
      table.increments()
      table.integer('questionId').unsigned().notNullable()
      table.date('endDate').defaultTo(null)
      table.integer('geolocalizationType')
      table.string('Lat')
      table.string('Lng')
      table.string('manualGeolocalizationId')
      table.foreign('manualGeolocalizationId')
      table.foreign('geolocalizationType')
      table.foreign('questionId')
      table.timestamps()
    })

    this.schema.createTable('geolocalizationsList', (table) => {
      table.increments()
      table.date('endDate').defaultTo(null)
      table.string('label')
      table.string('Lat')
      table.string('Lng')
      table.integer('radius')
      table.integer('level1').defaultTo(null)
      table.integer('level2').defaultTo(null)
      table.integer('level3').defaultTo(null)
      table.integer('level4').defaultTo(null)
      table.string('uniqName').unique()
      table.timestamps()
    })

    this.schema.createTable('geolocalisationType', (table) => {
      table.increments()
      table.integer('code',3).unsigned().notNullable()
      table.integer('label').notNullable()
      table.timestamps()
    })

    this.schema.createTable('languages', (table) => {
      table.increments()
      table.integer('code',3).unsigned().notNullable()
      table.string('label').notNullable()
      table.timestamps()
    })
    this.schema.createTable('country', (table) => {
      table.increments()
      table.integer('code',3).unsigned().notNullable()
      table.string('label').notNullable()
      table.timestamps()
    })
    this.schema.createTable('usersLangues', (table) => {
      table.increments()
      table.integer('userId').unsigned().notNullable()
      table.string('langueCode',3).notNullable()
      table.foreign('userId')
      table.foreign('langueCode')
      table.timestamps()
    })
  }
}
