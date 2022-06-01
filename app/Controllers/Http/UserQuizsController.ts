import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { QuestionStatus } from 'App/Models/Question'

import Quiz, { QuizStatus } from 'App/Models/Quiz'
import Response from 'App/Models/Response'

export default class UserQuizsController {
  public async show({ params, auth, response }: HttpContextContract) {
    let authMethod: 'user' | 'guest'
    if (await auth.use('user').check()) {
      authMethod = 'user'
    } else if (await auth.use('guest').check()) {
      authMethod = 'guest'
    } else {
      return response.status(403).json({
        success: false,
        messages: 'Not allowed',
      })
    }

    const quiz = await Quiz.query()
      .where('status', '!=', QuizStatus.Dev)
      .where('id', params.id)
      .preload('questions', (query) =>
        params.type === 'quiz'
          ? query
              .where('status', QuestionStatus.Public)
              .preload('user_response', (query2) =>
                query2.where(`${authMethod}Id`, auth.use(authMethod).user!.id)
              )
              .orderBy('id')
          : query.where('status', QuestionStatus.Public)
      )
      .preload('author')
      .first()

    if (!quiz) {
      return response.status(404).json({
        success: false,
        messages: 'Not found',
      })
    }

    quiz.questions = quiz.questions.sort(
      (a, b) => a[a.order !== null ? 'order' : 'id'] - b[b.order !== null ? 'order' : 'id']
    )

    return {
      success: true,
      quiz,
    }
  }

  public async store({ request, params, auth }: HttpContextContract) {
    const data = request.only(['question_id', 'response_id', 'response', 'time', 'strategy'])

    await auth.use(data.strategy).check()

    const response = await Response.create({
      quizId: params.id,
      questionId: data.question_id,
      reponsNb: data.response_id,
      response: data.response,
      responsTimeSpent: data.time,
      userId: auth.use('user').user?.id,
      guestId: auth.use('guest').user?.id,
      type: params.type,
    })

    return { success: true, response }
  }
}
