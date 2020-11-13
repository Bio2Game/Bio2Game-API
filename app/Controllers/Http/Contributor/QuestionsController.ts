import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
// import Quiz from 'App/Models/Quiz'
import Question from 'App/Models/Question'

export default class QuestionsController {
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
      })
    }
  }

  public async store ({ request, response, auth }: HttpContextContract){
    const data = request.only(['quiz_id'])

    try {
      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({
              table: 'questions',
              column: 'label',
              where: { 'quiz_id': data.quiz_id },
            }),
            rules.maxLength(255),
          ]),
          quiz_id: schema.number([
            rules.exists({ table: 'quizzes', column: 'id', where: { 'contributor_id': auth?.user?.id } }),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      const question = await Question.create({ ...payload, responses: JSON.stringify(payload.responses) })

      return {
        success: true,
        question,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages || error,
      })
    }
  }

  public async update ({ request, response, params, auth }: HttpContextContract){
    const data = request.only(['quiz_id'])

    try {
      const question = await Question.find(params.id)

      if(!question) {
        return response.status(404).json({ success: false })
      }

      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({
              table: 'questions',
              column: 'label',
              where: { 'quiz_id': data.quiz_id },
              whereNot: { 'id': params.id },
            }),
            rules.maxLength(255),
          ]),
          quiz_id: schema.number([
            rules.exists({ table: 'quizzes', column: 'id', where: { 'contributor_id': auth?.user?.id } }),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      question.merge({ ...payload, responses: JSON.stringify(payload.responses) })

      await question.save()

      return {
        success: true,
        question,
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
      const question = await Question.find(params.id)

      if(!question) {
        return response.status(404).json({ success: false })
      }

      await question.delete()

      return {
        success: true,
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
      },
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
        'responses.response0.required': 'Veuillez renseigner la bonne réponse.',
        'responses.response1.required': 'Veuillez renseigner la mauvaise réponse n°1.',
        'responses.response2.required': 'Veuillez renseigner la mauvaise réponse n°2.',
        'responses.response3.required': 'Veuillez renseigner la réponse improbable.',
        'profil.required': 'Veuillez renseigner le profil du joueur.',
      },
    }
  }
}
