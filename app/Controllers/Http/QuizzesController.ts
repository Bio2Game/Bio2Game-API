import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Quiz from 'App/Models/Quiz'

enum Languages {
  FR = 'fr',
  EN = 'en',
}

export default class QuizzesController {
  public async index () {
    const quizzes = await Quiz.query()
      .preload('author').preload('domain').preload('domain', (query) => query.preload('icon'))
      .where('status', 1).orderBy('updated_at', 'desc')
    return { success: true, quizzes }
  }

  public async create ({ request, response}: HttpContextContract){
    const validationSchema = schema.create({
      label: schema.string({ trim: true }, [
        rules.unique({ table: 'quizzes', column: 'label' }),
        rules.maxLength(255),
      ]),
      description: schema.string({}, [
        rules.maxLength(255),
      ]),
      status: schema.number(),
      url: schema.string({ trim: true }, [
        rules.regex(/^[-a-z0-9]+$/),
        rules.maxLength(255),
      ]),
      contributorId: schema.number([
        rules.exists({ table: 'users', column: 'id' }),
      ]),
      domainId: schema.number([
        // rules.exists({ table: 'domains', column: 'id' }),
      ]),
      language: schema.enum(Object.values(Languages)),
      localisation: schema.string.optional({}, [
        rules.maxLength(255),
      ]),
    })

    console.log(request.all())

    try {
      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'label.required': 'Veuillez indiquer le nom du quiz.',
          'label.unique': 'Ce nom est déjà utilisé par un autre quiz.',
          'label.maxLength': 'Le nom de votre quiz ne peut pas dépasser {{ maxLength }} caractères.',
          'description.required': 'Veuillez indiquer la description de votre quiz.',
        },
      })

      //   payload.url = data.label.toLowerCase().normalize('NFKD')
      // .replace(/[^\x00-\x7F]+/g, '').replace(/[^a-zA-Z0-9]+/g, '-')

      const quiz = await Quiz.create(payload)

      return {
        success: true,
        quiz,
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
