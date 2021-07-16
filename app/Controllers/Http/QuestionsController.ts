import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Question from 'App/Models/Question'

export default class QuestionsController {
  public async index () {
    const questions = await Question.query()
      .preload('quiz', (query) => query.preload('author'))
    return { success: true, questions }
  }

  public async show ({ response, params }: HttpContextContract){
    try {
      const question = await Question.find(params.id)

      if(!question) {
        response.status(404).json({ success: false })
      }

      return {
        success: true,
        question,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
        error: error,
      })
    }
  }
}
