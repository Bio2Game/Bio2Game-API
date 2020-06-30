import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import Quiz from 'App/Models/Quiz'
import Question from 'App/Models/Question'

enum Languages {
  FR = 'fr',
  EN = 'en',
}
export default class QuestionsController {
  public async index () {
    const questions = await Question.query().preload('quiz', (query) => query.preload('author'))
    return { success: true, questions }
  }

  public async create ({ request, response}: HttpContextContract){
    const { quizId } = request.only(['quizId'])

    const validationSchema = schema.create({
      label: schema.string({ trim: true }, [
        rules.unique({ table: 'questions', column: 'label', where: { 'quiz_id': quizId } }),
        rules.maxLength(255),
      ]),
      profil: schema.number(),
      question: schema.string({}, [
        rules.maxLength(255),
      ]),
      responses: schema.object().members({
        response0: schema.string(),
        response1: schema.string(),
        response2: schema.string(),
        response3: schema.string(),
      }),
      explication: schema.string.optional(),
      source: schema.string.optional({}, [
        rules.maxLength(255),
      ]),
      status: schema.number(),
      time: schema.number.optional(),
      language: schema.enum(Object.values(Languages)),
      quizId: schema.number([
        rules.exists({ table: 'quizzes', column: 'id' }),
      ]),
    })

    try {
      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'label.required': 'Veuillez indiquer le titre de la question.',
          'label.unique': 'Ce titre est déjà utilisé par un autre question.',
          'label.maxLength': 'Le titre de votre question ne peut pas dépasser {{ maxLength }} caractères.',
          'question.required': 'Veuillez indiquer le contenu de la question.',
          'question.maxLength': 'Le contenu de votre question ne peut pas dépasser {{ maxLength }} caractères.',
          'source.maxLength': 'Le contenu de votre question ne peut pas dépasser {{ maxLength }} caractères.',
          'status.required': 'Veuillez indiquer le status de votre question.',
          'quizId.required': 'Veuillez renseigner l\'id du quiz associé.',
          'quizId.exists': 'Ce quiz n\'existe pas.',
        },
      })

      await Question.create({ ...payload, responses: JSON.stringify(payload.responses) })

      return {
        success: true,
        // quiz,
      }
    } catch (error) {
      console.error(error)
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }
}
