import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Question from 'App/Models/Question'

export default class QuestionsController {
  public async show({ response, params }: HttpContextContract) {
    try {
      const question = await Question.find(params.id)

      if (!question) {
        return response.status(404).json({ success: false })
      }

      return {
        success: true,
        question,
      }
    } catch (error) {
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user as User

    const data = request.only(['quizId'])

    const isAdmin = user.status === 1000

    try {
      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({
              table: 'questions',
              column: 'label',
              where: { quiz_id: data.quizId },
            }),
            rules.maxLength(255),
          ]),
          quizId: schema.number([
            rules.exists({
              table: 'quizzes',
              column: 'id',
              where: !isAdmin ? { contributor_id: user.id } : undefined,
            }),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      const question = await Question.create(payload)

      return {
        success: true,
        question,
      }
    } catch (error) {
      console.log(error)
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    const user = auth.user as User

    const data = request.only(['quizId'])

    const isAdmin = user.status === 1000

    try {
      const question = await Question.find(params.id)

      if (!question) {
        return response.status(404).json({ success: false })
      }

      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({
              table: 'questions',
              column: 'label',
              where: { quiz_id: data.quizId },
              whereNot: { id: params.id },
            }),
            rules.maxLength(255),
          ]),
          quizId: schema.number([
            rules.exists({
              table: 'quizzes',
              column: 'id',
              where: !isAdmin ? { contributor_id: user.id } : undefined,
            }),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      question.merge(payload)

      await question.save()

      return {
        success: true,
        question,
      }
    } catch (error) {
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  public async delete({ response, params, auth }: HttpContextContract) {
    const user = auth.user as User

    try {
      const question = await Question.query().where('id', params.id).preload('quiz').first()

      if (!question) {
        return response.status(404).json({ success: false })
      }

      if (question.quiz.contributorId !== user.id && user.status !== 1000) {
        return response.status(403).json({ success: false })
      }

      await question.delete()

      return {
        success: true,
        question,
      }
    } catch (error) {
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  private get validation() {
    return {
      schema: {
        profil: schema.number(),
        question: schema.string(),
        responses: schema.object().members({
          response0: schema.string(),
          response1: schema.string(),
          response2: schema.string(),
          response3: schema.string(),
        }),
        explication: schema.string.optional(),
        source: schema.string.optional({}, [rules.maxLength(255)]),
        status: schema.number(),
        time: schema.number.optional(),
        order: schema.number.optional(),
      },
      messages: {
        'label.required': 'Veuillez indiquer le titre de la question.',
        'label.unique': 'Ce titre est déjà utilisé par un autre question.',
        'label.maxLength':
          'Le titre de votre question ne peut pas dépasser {{ options.maxLength }} caractères.',
        'question.required': 'Veuillez indiquer le contenu de la question.',
        'source.maxLength':
          'Le contenu de votre question ne peut pas dépasser {{ options.maxLength }} caractères.',
        'status.required': 'Veuillez indiquer le status de votre question.',
        'quizId.required': "Veuillez renseigner l'id du quiz associé.",
        'quizId.exists': "Ce quiz n'existe pas.",
        'responses.response0.required': 'Veuillez renseigner la bonne réponse.',
        'responses.response1.required': 'Veuillez renseigner la mauvaise réponse n°1.',
        'responses.response2.required': 'Veuillez renseigner la mauvaise réponse n°2.',
        'responses.response3.required': 'Veuillez renseigner la réponse improbable.',
        'profil.required': 'Veuillez renseigner le profil du joueur.',
      },
    }
  }
}
