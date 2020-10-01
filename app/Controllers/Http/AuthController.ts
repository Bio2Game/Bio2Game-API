import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async user ({ auth }: HttpContextContract) {
    const user = await auth.authenticate()
    return user ? user.toJSON() : false
  }

  public async register ({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true }),
    })

    try {
      const payload = await request.validate({
        schema: validationSchema,
        messages: {
          'username.required': 'Un pseudo est requis pour votre inscription.',
          'username.unique': 'Ce pseudo est déjà utilisé.',
          'email.required': 'Une adresse email est requise pour votre inscription.',
          'email.email': 'Merci de rentrer une adresse email valide.',
          'email.unique': 'Cette adresse email est déjà utilisé.',
          'password.required': 'Veuillez indiquer un mot de passe fort.',
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

  public async login ({ auth, request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [ rules.email() ]),
      password: schema.string({ trim: true }),
    })

    try {
      const { email, password } = await request.validate({
        schema: validationSchema,
        messages: {
          'email.required': 'Veuillez entrer votre adresse email.',
          'email.email': 'Merci de rentrer une adresse email valide.',
          'password.required': 'Veuillez entrer votre mot de passe.',
        },
      })

      const token = await auth.attempt(email, password)

      return token.toJSON()
    } catch (error) {
      if(error.code === 'E_INVALID_AUTH_UID') {
        return response.status(401).json({
          success: false,
          messages: {
            errors: [{
              rule: 'exist',
              field: 'email',
              message: 'Cette adresse email n\'existe pas.',
            }],
          },
        })
      }
      if(error.code === 'E_INVALID_AUTH_PASSWORD') {
        return response.status(401).json({
          success: false,
          messages: {
            errors: [{
              rule: 'exist',
              field: 'password',
              message: 'Ce mot de passe est incorrect.',
            }],
          },
        })
      }
      console.log(error)
      response.status(401).json({
        success: false,
        messages: error.messages || error,
      })
    }
  }

  public async logout ({ auth, response }: HttpContextContract) {
    await auth.logout()

    response.status(200).json({
      success: true,
      message: 'Vous êtes déconnecté avec succès',
    })
  }
}
