import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Formation, { FormationStatus } from 'App/Models/Formation'

export default class FormationsController {
  public async index() {
    const formations = await Formation.query()
      .preload('author')
      .preload('quizzes')
      .preload('domain')
      .where('status', FormationStatus.Public)
      .orderBy('updated_at', 'desc')
    return { formations }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const formation = await Formation.query()
        .preload('quizzes', (query) => query.preload('domain', (query2) => query2.preload('icon')))
        .preload('author')
        .where('id', params.id)
        .where('status', '!=', FormationStatus.Private)
        .first()

      if (!formation) {
        return response.status(404).json({ success: false })
      }

      return {
        success: true,
        formation,
      }
    } catch (error) {
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }
}
