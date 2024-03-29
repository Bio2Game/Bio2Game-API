import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Formation from 'App/Models/Formation'
import User from 'App/Models/User'

export default class FormationsController {
  public async index({ auth }: HttpContextContract) {
    if (!auth.user) {
      return { formations: [] }
    }
    let formations: Formation[]
    if (auth.user instanceof User && auth.user.status === 1000) {
      formations = await Formation.query()
        .preload('author')
        .preload('quizzes')
        .preload('domain', (query) => query.preload('icon'))
        .orderBy('updated_at', 'desc')
    } else {
      formations = await Formation.query()
        .where('user_id', auth.user.id)
        .preload('quizzes')
        .preload('domain', (query) => query.preload('icon'))
        .orderBy('updated_at', 'desc')
    }

    return { formations }
  }

  public async show({ response, params, auth }: HttpContextContract) {
    const user = auth.user as User
    try {
      const formation = await Formation.query()
        .preload('quizzes', (query) => query.preload('domain', (query2) => query2.preload('icon')))
        .preload('author')
        .where({
          id: params.id,
          user_id: user.id,
        })
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

  public async store({ request, response, auth }: HttpContextContract) {
    const user = auth.user as User

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

      if (payload.user_id !== user.id && user.status !== 1000) {
        return response.status(403).json({ success: false })
      }

      const formation = await Formation.create(payload)

      await formation.related('quizzes').sync(payload.quizzes)

      return {
        success: true,
        formation,
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

    try {
      const formation = await Formation.find(params.id)

      if (!formation) {
        return response.status(404).json({ success: false })
      }

      if (formation.userId !== user.id && user.status !== 1000) {
        return response.status(403).json({ success: false })
      }

      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({ table: 'formations', column: 'label', whereNot: { id: params.id } }),
            rules.maxLength(255),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      formation.merge(payload)

      await formation.save()

      await formation.related('quizzes').sync(payload.quizzes)

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

  public async delete({ response, params, auth }: HttpContextContract) {
    const user = auth.user as User

    try {
      const formation = await Formation.find(params.id)

      if (!formation) {
        return response.status(404).json({ success: false })
      }

      if (formation.userId !== user.id && user.status !== 1000) {
        return response.status(403).json({ success: false })
      }

      await formation.delete()

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

  private get validation() {
    return {
      schema: {
        description: schema.string({}, [rules.maxLength(255)]),
        content: schema.string({}),
        url: schema.string({ trim: true }, [rules.regex(/^[-a-z0-9]+$/), rules.maxLength(255)]),
        level: schema.number(),
        status: schema.number(),
        duration: schema.number(),
        leaves: schema.number(),
        user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
        domain_id: schema.number([rules.exists({ table: 'domains', column: 'id' })]),
        quizzes: schema.array().members(schema.number()),
      },
      messages: {
        'label.required': 'Veuillez indiquer le nom du formation.',
        'label.unique': 'Ce nom est déjà utilisé par un autre formation.',
        'label.maxLength':
          'Le nom de votre formation ne peut pas dépasser {{ options.maxLength }} caractères.',
        'description.required': 'Veuillez indiquer la description de votre formation.',
        'description.maxLength':
          'La description de votre formation ne peut pas dépasser {{ options.maxLength }} caractères.',
        'content.required': 'Veuillez indiquer le contenu de la formation.',
        'url.required': "Veuillez indiquer l'url de votre formation.",
        'url.regex': "Veuillez respecter le format de l'url.",
        'url.maxLength':
          "L'url de votre formation ne peut pas dépasser {{ options.maxLength }} caractères.",
        'level.required': 'Veuillez renseigner le profil ciblé.',
        'status.required': 'Veuillez indiquer le status de votre formation.',
        'duration.required': 'Veuillez indiquer la durée de votre formation.',
        'leaves.required': 'Veuillez indiquer le nombre de feuilles de votre formation.',
        'user_id.required': "Veuillez renseigner l'id du contributeur.",
        'user_id.exists': "Ce contributeur n'existe pas.",
        'domain_id.required': "Veuillez renseigner l'id du domaine associé.",
        'domain_id.exists': "Ce domaine n'existe pas.",
      },
    }
  }
}
