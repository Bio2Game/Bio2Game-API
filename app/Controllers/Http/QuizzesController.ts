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
      .preload('author').preload('domain', (query) => query.preload('icon'))
      .whereHas('questions', query => query.where('status', 1))
      .where('status', 1).orderBy('updated_at', 'desc')
    return { quizzes }
  }

  public async indexQuestions () {
    const quizzes = await Quiz.query()
      .preload('author').preload('domain', (query) => query.preload('icon'))
      .whereHas('questions', query => query.where('status', 1))
      .preload('questions')
      .where('status', 1).orderBy('updated_at', 'desc')
    return { quizzes }
  }

  public async show ({ response, params }: HttpContextContract){
    try {
      const quiz = await Quiz.find(params.id)

      if(!quiz) {
        return response.status(404).json({ success: false })
      }

      quiz.questions = quiz.questions.sort(
        (a, b) => a[a.order !== null ? 'order' : 'id'] - b[b.order !== null ? 'order' : 'id']
      )

      return {
        success: true,
        quiz,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async store ({ request, response }: HttpContextContract){
    try {
      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({ table: 'quizzes', column: 'label' }),
            rules.maxLength(255),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      const quiz = await Quiz.create(payload)

      return {
        success: true,
        quiz,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async update ({ request, response, params }: HttpContextContract){
    try {
      const quiz = await Quiz.find(params.id)

      if(!quiz) {
        response.status(404).json({ success: false })
      }

      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({ table: 'quizzes', column: 'label', whereNot: { 'id': params.id } }),
            rules.maxLength(255),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      quiz?.merge(payload)

      await quiz?.save()

      return {
        success: true,
        quiz,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async delete ({ response, params }: HttpContextContract){
    try {
      const quiz = await Quiz.find(params.id)

      if(!quiz) {
        response.status(404).json({ success: false })
      }

      await quiz?.delete()

      return {
        success: true,
        quiz,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  private get validation () {
    return {
      schema: {
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
      },
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
    }
  }
}
