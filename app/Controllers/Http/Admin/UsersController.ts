import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

export default class UsersController {
  public async index () {
    const users = await User.query().orderBy('created_at', 'desc')
    return { success: true, users }
  }

  public async show ({ response, params }: HttpContextContract){
    try {
      const user = await User.find(params.id)

      if(!user) {
        response.status(404).json({ success: false })
      }

      return {
        success: true,
        user,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const validationSchema = schema.create({
      username: schema.string.optional({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', whereNot: { 'id': params.id } }),
      ]),
      name: schema.string.optional({ trim: true }),
      email: schema.string.optional({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', whereNot: { 'id': params.id } }),
      ]),
      old_password: schema.string.optional({ trim: true }, [
        rules.exists({ table: 'users', column: 'password' }),
      ]),
      password: schema.string.optional({ trim: true }, [rules.confirmed()]),
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

      const user = await User.findOrFail(params.id)

      user.merge(payload)

      await user.save()

      response.status(200).json({
        success: true,
        user,
      })
    } catch (error) {
      console.log(error)

      response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  public async delete ({ response, params }: HttpContextContract){
    try {
      const user = await User.find(params.id)

      if(!user) {
        response.status(404).json({ success: false })
      }

      await user?.delete()

      return {
        success: true,
        user,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }
}
