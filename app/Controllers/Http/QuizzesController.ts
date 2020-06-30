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
      .preload('author').preload('domain').preload('domain', (query) => query.preload('icon')).preload('questions')
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
        rules.exists({ table: 'domains', column: 'id' }),
      ]),
      language: schema.enum(Object.values(Languages)),
      localisation: schema.string.optional({}, [
        rules.maxLength(255),
      ]),
    })

    try {
      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'label.required': 'Veuillez indiquer le nom du quiz.',
          'label.unique': 'Ce nom est déjà utilisé par un autre quiz.',
          'label.maxLength': 'Le nom de votre quiz ne peut pas dépasser {{ maxLength }} caractères.',
          'description.required': 'Veuillez indiquer la description de votre quiz.',
          'description.maxLength': 'La description de votre quiz ne peut pas dépasser {{ maxLength }} caractères.',
          'status.required': 'Veuillez indiquer le status de votre quiz.',
          'url.required': 'Veuillez indiquer l\'url de votre quiz.',
          'url.regex': 'Veuillez respecter le format de l\'url.',
          'url.maxLength': 'L\'url de votre quiz ne peut pas dépasser {{ maxLength }} caractères.',
          'contributorId.required': 'Veuillez renseigner l\'id du contributeur.',
          'contributorId.exists': 'Ce contributeur n\'existe pas.',
          'domainId.required': 'Veuillez renseigner l\'id du domaine associé.',
          'domainId.exists': 'Ce domaine n\'existe pas.',
          'localisation.maxLength': 'Votre localisation ne peux pas dépasser {{ maxLength }} caractères.',
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
