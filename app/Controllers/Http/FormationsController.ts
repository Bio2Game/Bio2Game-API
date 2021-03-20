import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Formation from 'App/Models/Formation'

export default class FormationsController {
  public async index () {
    const formations = await Formation.query()
      .preload('author').preload('quizzes')
      .where('status', 1).orderBy('updated_at', 'desc')
    return { formations }
  }

  public async list () {
    const formations = await Formation.query()
      .preload('author').preload('quizzes').orderBy('updated_at', 'desc')
    return { formations }
  }

  public async show ({ response, params }: HttpContextContract){
    try {
      const formation = await Formation.query().preload('quizzes').where('id', params.id).first()

      if(!formation) {
        response.status(404).json({ success: false })
      }

      return {
        success: true,
        formation,
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
            rules.unique({ table: 'formations', column: 'label' }),
            rules.maxLength(255),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      const formation = await Formation.create(payload)

      await formation.related('quizzes').sync(payload.quizzes)

      return {
        success: true,
        formation,
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
      const formation = await Formation.find(params.id)

      if(!formation) {
        response.status(404).json({ success: false })
      }

      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({ table: 'formations', column: 'label', whereNot: { 'id': params.id } }),
            rules.maxLength(255),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      formation?.merge(payload)

      await formation?.save()

      await formation?.related('quizzes').sync(payload.quizzes)

      return {
        success: true,
        formation,
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
      const formation = await Formation.find(params.id)

      if(!formation) {
        response.status(404).json({ success: false })
      }

      await formation?.delete()

      return {
        success: true,
        formation,
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
        content: schema.string({}),
        url: schema.string({ trim: true }, [
          rules.regex(/^[-a-z0-9]+$/),
          rules.maxLength(255),
        ]),
        level: schema.number(),
        keyswords: schema.string({}, [
          rules.maxLength(255),
        ]),
        status: schema.number(),
        duration: schema.number(),
        leaves: schema.number(),
        user_id: schema.number([
          rules.exists({ table: 'users', column: 'id' }),
        ]),
        domain_id: schema.number([
          rules.exists({ table: 'domains', column: 'id' }),
        ]),
        quizzes: schema.array().members(schema.number()),
      },
      messages: {
        'label.required': 'Veuillez indiquer le nom du formation.',
        'label.unique': 'Ce nom est déjà utilisé par un autre formation.',
        'label.maxLength': 'Le nom de votre formation ne peut pas dépasser {{ maxLength }} caractères.',
        'description.required': 'Veuillez indiquer la description de votre formation.',
        'description.maxLength': 'La description de votre formation ne peut pas dépasser {{ maxLength }} caractères.',
        'content.required': 'Veuillez indiquer le contenu de la formation.',
        'url.required': 'Veuillez indiquer l\'url de votre formation.',
        'url.regex': 'Veuillez respecter le format de l\'url.',
        'url.maxLength': 'L\'url de votre formation ne peut pas dépasser {{ maxLength }} caractères.',
        'level.required': 'Veuillez renseigner le profil ciblé.',
        'keyswords.required': 'Veuillez renseigner les mots clés de la formation.',
        'keyswords.maxLength': 'Vos mots clés ne peuvent pas dépasser {{ maxLength }} caractères au total.',
        'status.required': 'Veuillez indiquer le status de votre formation.',
        'duration.required': 'Veuillez indiquer la durée de votre formation.',
        'leaves.required': 'Veuillez indiquer le nombre de feuilles de votre formation.',
        'user_id.required': 'Veuillez renseigner l\'id du contributeur.',
        'user_id.exists': 'Ce contributeur n\'existe pas.',
        'domain_id.required': 'Veuillez renseigner l\'id du domaine associé.',
        'domain_id.exists': 'Ce domaine n\'existe pas.',
      },
    }
  }
}
