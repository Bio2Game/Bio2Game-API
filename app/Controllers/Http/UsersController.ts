import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UsersController {
  public async index() {
    const contributors = await User.query()
      .where('status', '>', 0)
      .preload('quizzes', (query) =>
        query
          .where('status', 1)
          .preload('domain', (query) => query.preload('icon'))
          .limit(5)
      )
      .whereHas('quizzes', (query) => {
        query.where('status', 1)
      })
    return { contributors }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      username: schema.string.optional({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', whereNot: { id: auth.user?.id } }),
      ]),
      name: schema.string.optional({ trim: true }),
      email: schema.string.optional({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', whereNot: { id: auth.user?.id } }),
      ]),
      old_password: schema.string.optional({ trim: true }, [
        rules.exists({ table: 'users', column: 'password' }),
      ]),
      password: schema.string.optional({ trim: true }, [rules.confirmed()]),
      description: schema.string.optional(),
      sex: schema.number.optional(),
      birth_date: schema.date.optional(),
      localisation: schema.string.optional({ trim: true }),
      website: schema.string.optional({ trim: true }),
      contributor_mobile: schema.string.optional({ trim: true }),
      contributor_type: schema.number.optional(),
      status: schema.number.optional(),
    })

    try {
      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'username.unique': 'Ce pseudo est déjà utilisé.',
          'email.email': 'Merci de rentrer une adresse email valide.',
          'email.unique': 'Cette adresse email est déjà utilisé.',
          'old_password.exists': 'Le mot de passe est incorect.',
          'confirmed': 'Veuillez confirmer votre mot de passe.',
        },
      })

      const user = await User.findOrFail(auth.user?.id)

      user.merge(payload)

      await user.save()

      response.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès',
      })
    } catch (error) {
      console.log(error)

      response.status(422).json({
        success: false,
        messages: error.messages,
        error: error,
      })
    }
  }
}
