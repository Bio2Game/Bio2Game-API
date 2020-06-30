import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Refactos extends BaseSchema {
  public async up () {
    this.schema.table('users', (table) => {
      table.renameColumn('languageCode', 'language_code')
      table.renameColumn('birthDate', 'birth_date')
      table.renameColumn('contributorType', 'contributor_type')
      table.renameColumn('emailContributor', 'contributor_email')
      table.renameColumn('mobileContributor', 'ontributor_mobile')
      table.renameColumn('isAnimator', 'is_animator')
    })

    this.schema.table('domains', (table) => {
      table.renameColumn('iconId', 'icon_id')
    })

    this.schema.table('questions', (table) => {
      table.renameColumn('quizId', 'quiz_id')
    })

    this.schema.table('comments', (table) => {
      table.renameColumn('userId', 'user_id')
      table.renameColumn('questionId', 'question_id')
      table.renameColumn('parentId', 'parent_id')
    })

    this.schema.table('responses', (table) => {
      table.renameColumn('userId', 'user_id')
      table.renameColumn('simpleUserId', 'simple_user_id')
      table.renameColumn('responsTimeSpent', 'respons_time_spent')
      table.renameColumn('questionId', 'question_id')
      table.renameColumn('quizId', 'quiz_id')
      table.renameColumn('reponsNb', 'repons_nb')
    })

    this.schema.table('quizzes', (table) => {
      table.renameColumn('domainId', 'domain_id')
      table.renameColumn('contributorId', 'contributor_id')
    })
    // this.schema.renameTable('playersAnimators', 'players_animators')

    this.schema.table('playersAnimators', (table) => {
      table.renameColumn('playerId', 'player_id')
    })

    this.schema.table('auth_tokens', (table) => {
      table.renameColumn('simpleUserId', 'simple_user_id')
      table.renameColumn('userId', 'user_id')
    })

    this.schema.table('parties', (table) => {
      table.renameColumn('playersSize', 'players_size')
      table.renameColumn('questionsList', 'questions_list')
      table.renameColumn('questionsSize', 'questions_size')
      table.renameColumn('quizId', 'quiz_id')
      table.renameColumn('contributorId', 'contributor_id')
    })
  }

  public async down () {
    this.schema.table('users', (table) => {
      table.renameColumn('language_code', 'languageCode')
      table.renameColumn('birth_date', 'birthDate')
      table.renameColumn('contributor_type', 'contributorType')
      table.renameColumn('contributor_email', 'emailContributor')
      table.renameColumn('ontributor_mobile', 'mobileContributor')
      table.renameColumn('is_animator', 'isAnimator')
    })

    this.schema.table('domains', (table) => {
      table.renameColumn('icon_id', 'iconId')
    })

    this.schema.table('questions', (table) => {
      table.renameColumn('quiz_id', 'quizId')
    })

    this.schema.table('comments', (table) => {
      table.renameColumn('user_id', 'userId')
      table.renameColumn('question_id', 'questionId')
      table.renameColumn('parent_id', 'parentId')
    })

    this.schema.table('responses', (table) => {
      table.renameColumn('user_id', 'userId')
      table.renameColumn('simple_user_id', 'simpleUserId')
      table.renameColumn('respons_time_spent', 'responsTimeSpent')
      table.renameColumn('question_id', 'questionId')
      table.renameColumn('quiz_id', 'quizId')
      table.renameColumn('repons_nb', 'reponsNb')
    })

    this.schema.table('quizzes', (table) => {
      table.renameColumn('domain_id', 'domainId')
      table.renameColumn('contributor_id', 'contributorId')
    })

    // this.schema.renameTable('players_animators','playersAnimators')

    this.schema.table('playersAnimators', (table) => {
      table.renameColumn('player_id', 'playerId')
      table.renameColumn('animator_id', 'animatorId')
    })

    this.schema.table('auth_tokens', (table) => {
      table.renameColumn('simple_user_id', 'simpleUserId')
      table.renameColumn('user_id', 'userId')
    })

    this.schema.table('parties', (table) => {
      table.renameColumn('players_size', 'playersSize')
      table.renameColumn('questions_list', 'questionsList')
      table.renameColumn('questions_size', 'questionsSize')
      table.renameColumn('quiz_id', 'quizId')
      table.renameColumn('contributor_id', 'contributorId')
    })
  }
}
