import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Quiz from 'App/Models/Quiz'
import Response from 'App/Models/Response'

export default class UserQuizsController {
  public async show ({ params, auth, response }: HttpContextContract) {
    const quiz = await Quiz.query()
      .where({
        status: 1,
        id: params.id,
      })
      .preload('questions', (query) =>
        query.where('status', 1)
          .preload('user_response', query =>
            query.where('userId', auth.user!.id)
          ).orderBy('id')
      ).first()

    if(!quiz) {
      return response.status(404).json({
        success: false,
        messages: 'Not found',
      })
    }

    return {
      success: true,
      quiz,
    }
  }

  public async store ({ request, params, auth }: HttpContextContract){
    const data = request.only(['question_id', 'response_id', 'response', 'time'])

    const response = await Response.create({
      quizId: params.id,
      questionId: data.question_id,
      reponsNb: data.response_id,
      response: data.response,
      responsTimeSpent: data.time,
      userId: auth.user!.id,
    })

    return { success: true, response }
  }

  //   async autoresponse ({auth,params, session}){
  //       const question = await Question.find(params.id);

  //       const infos = {
  //         responsTimeSpent: question.time,
  //         questionId: question.id,
  //         quizId: question.quizId,
  //         response: "Pas de réponse",
  //         reponsNb: 3
  //       }

  //       if(!auth.user){
  //         infos.simpleUserId = session.get('simpleAuth');
  //       }else{
  //         infos.userId = auth.user.id;
  //       }

  //       Response.create(infos)
  //   }
}
