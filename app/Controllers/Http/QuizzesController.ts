import Quiz, { QuizStatus } from 'App/Models/Quiz'

export default class QuizzesController {
  public async index() {
    const quizzes = await Quiz.query()
      .preload('author')
      .preload('domain', (query) => query.preload('icon'))
      .whereHas('questions', (query) => query.where('status', QuizStatus.Public))
      .where('status', QuizStatus.Public)
      .orderBy('updated_at', 'desc')

    return { quizzes }
  }

  public async indexQuestions() {
    const quizzes = await Quiz.query()
      .preload('author')
      .preload('domain', (query) => query.preload('icon'))
      .whereHas('questions', (query) => query.where('status', QuizStatus.Public))
      .preload('questions')
      .where('status', QuizStatus.Public)
      .orderBy('updated_at', 'desc')

    return { quizzes }
  }
}
