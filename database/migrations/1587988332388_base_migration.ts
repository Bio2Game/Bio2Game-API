import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
  public async up () {
    this.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('pseudo').notNullable().unique()
      table.string('password').notNullable()
      table.string('email').notNullable().unique()
      table.string('name').notNullable().defaultTo('')
      table.date('lastConnexionDate')
      table.string('languageCode',3).defaultTo('FR')
      table.integer('sex').notNullable().defaultTo(0)
      table.date('birthDate')
      table.string('localisation').notNullable().defaultTo('')
      table.integer('status').defaultTo(0)
      table.integer('contributorType').defaultTo(0)
      table.string('emailContributor')
      table.string('mobilContributor')
      table.text('contributorEmailResponse')
      table.integer('geolocalizationType')
      table.integer('currentGeolocalisationID')
      table.string('website')
      table.string('account_status').defaultTo('pending')
      table.string('avatar_path').defaultTo(null)
      table.boolean('isAnimator').defaultTo(false)
      table.string('login_source').defaultTo('normal')
      table.timestamps()
    })

    this.schema.createTable('tokens', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.string('token', 255).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })

    this.schema.createTable('domains', (table) => {
      table.increments()
      table.string('label').notNullable().unique()
      table.integer('iconId')
      table.string('image').notNullable()
      table.string('keyswords').notNullable()
      table.date('activationDate')
      table.date('endDate')
      table.string('uniqName',30).notNullable().unique()
      table.timestamps()
    })

    this.schema.createTable('usersDomains', (table) => {
      table.increments()
      table.integer('userId').unsigned().notNullable()
      table.integer('domainId').unsigned().notNullable()
      table.timestamps()
    })

    this.schema.createTable('icons', (table) => {
      table.increments()
      table.string('reference')
      table.timestamps()
    })

    this.schema.createTable('questions', (table) => {
      table.increments()
      table.string('label', 30).notNullable()
      // Profil du joueur 0: informé,  1: consommateur, 2: producteur, 3: expert
      table.integer('profil').notNullable().defaultTo(0)
      table.string('question').notNullable()
      table.json('responses').notNullable()
      table.text('explication').notNullable()
      table.string ('source').notNullable().defaultTo('')
      table.integer('nbOfPoint').unsigned().notNullable().defaultTo(0)
      table.integer('nbOPlus').notNullable().defaultTo(0)
      table.integer('nbOfMinus').notNullable().defaultTo(0)
      table.integer('status')
      table.integer('time').defaultTo(15)
      table.integer('natureCode')
      table.string('uniqId').notNullable().defaultTo('')
      table.string('language',2).notNullable().defaultTo('FR')
      table.date('startDate')
      table.date('endDate').defaultTo(null)
      table.integer('quizId').unsigned().notNullable()
      table.timestamps()
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
    this.schema.createTable('comments', (table) => {
      table.increments()
      table.integer('userId').unsigned().notNullable()
      table.integer('questionId').unsigned().notNullable()
      table.integer('responsId').unsigned().notNullable()
      table.text('comment').notNullable()
      table.string('uniqName').unique()
      table.foreign('userId')
      table.foreign('responsId')
      table.foreign('questionId')
      table.timestamps()
    })
    this.schema.createTable('responses', (table) => {
      table.increments()
      table.integer('userId')
      table.string('simpleUserId')
      table.integer('responsTimeSpent')
      table.integer('questionId').unsigned().notNullable()
      table.integer('quizId').unsigned().notNullable()
      table.string('response').defaultTo('')
      table.integer('reponsNb')
      table.timestamps()
    })
    this.schema.createTable('quizzes', (table) => {
      table.increments()
      table.string('label').notNullable().unique()
      table.string('description').notNullable()
      table.string('url').notNullable()
      table.string('language',2).defaultTo('FR')
      table.integer('domainId')
      table.integer('status').notNullable().defaultTo(0)
      table.integer('contributorId').unsigned()
      table.string('localisation').defaultTo('')
      table.timestamps()
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
    this.schema.createTable('playersAnimators', (table) => {
      table.integer('playerId').unsigned().notNullable()
      table.integer('animatorId').unsigned().notNullable()
      table.timestamps()
    })
    this.schema.createTable('simple_auths', (table) => {
      table.increments()
      table.string('uuid')
      table.string('pseudo')
      table.timestamps()
    })
    this.schema.createTable('auth_tokens', (table) => {
      table.increments()
      table.string('token')
      table.string('simpleUserId')
      table.integer('userId')
      table.timestamps()
    })
    this.schema.createTable('parties', (table) => {
      table.increments()
      table.string('code')
      table.string('name')
      table.integer('playersSize')
      table.text('questionsList')
      table.integer('questionsSize')
      table.integer('quizId')
      table.integer('contributorId')
      table.text('responses')
      table.boolean('finished').defaultTo(false).notNullable()
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable('users')
    this.schema.dropTable('tokens')
    this.schema.dropTable('domains')
    this.schema.dropTable('usersDomains')
    this.schema.dropTable('icons')
    this.schema.dropTable('questions')
    this.schema.dropTable('nature')
    this.schema.dropTable('status')
    this.schema.dropTable('comments')
    this.schema.dropTable('responses')
    this.schema.dropTable('quizzes')
    this.schema.dropTable('userGeolocalizationLogs')
    this.schema.dropTable('questiongeolocalizations')
    this.schema.dropTable('geolocalizationsList')
    this.schema.dropTable('geolocalisationType')
    this.schema.dropTable('languages')
    this.schema.dropTable('country')
    this.schema.dropTable('usersLangues')
    this.schema.dropTable('playersAnimators')
    this.schema.dropTable('simple_auths')
    this.schema.dropTable('auth_tokens')
    this.schema.dropTable('parties')
  }
}
