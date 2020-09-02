import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'

export default class UsersController {
  public async index () {
    const users = await User.query().orderBy('updated_at', 'desc')
    return { success: true, users }
  }

  public async update ({ request, response, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      name: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', whereNot: { 'id': auth.user?.id } }),
      ]),
      old_password: schema.string.optional({ trim: true }, [
        rules.exists({ table: 'users', column: 'password'}),
      ]),
      password: schema.string.optional({ trim: true }),
      sex: schema.number(),
      birthDate: schema.date(),
      localisation: schema.string({ trim: true }),
    })

    try {
      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'username.required': 'Votre pseudo ne peut pas être supprimé.',
          'username.unique': 'Ce pseudo est déjà utilisé.',
          'email.required': 'Votre adresse email ne peut pas être supprimé.',
          'email.email': 'Merci de rentrer une adresse email valide.',
          'email.unique': 'Cette adresse email est déjà utilisé.',
          'password.confirmed': 'Veuillez confirmer votre mot de passe.',
        },
      })

      await User.create(payload)

      response.status(200).json({
        success: true,
        message: 'Merci de vous être inscrit !',
      })
    } catch (error) {
      console.log(error)

      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }
}
