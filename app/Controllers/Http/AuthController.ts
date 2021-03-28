import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Mail from '@ioc:Adonis/Addons/Mail'
import Encryption from '@ioc:Adonis/Core/Encryption'

import { string } from '@poppinss/utils/build/helpers'

export default class AuthController {
  public async user ({ auth }: HttpContextContract) {
    const user = await auth.use('user').authenticate()
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
      if(error.code === 'E_VALIDATION_FAILURE') {
        return response.status(422).json({
          success: false,
          messages: error.messages,
        })
      }
      response.status(500).json({
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

      const token = await auth.use('user').attempt(email, password)

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
      response.status(401).json({
        success: false,
        messages: error.messages || error,
      })
    }
  }

  public async resetPassword ({ auth, request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }, [ rules.email() ]),
    })

    try {
      const { email } = await request.validate({
        schema: validationSchema,
        messages: {
          'email.required': 'Veuillez entrer votre adresse email.',
          'email.email': 'Merci de rentrer une adresse email valide.',
        },
      })

      const userProvider = await auth.use('user').provider.findByUid(email)

      if(!userProvider.user) {
        return response.status(404).json({
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

      userProvider.setRememberMeToken(string.generateRandom(20))
      await auth.use('user').provider.updateRememberMeToken(userProvider)

      await Mail.send((message) => {
        message
          .from('no-reply@bio2game.com')
          .to(userProvider.user!.email)
          .subject('Changement de mot de passe sur Bio2Game.com')
          .htmlView('emails/forget-password', {
            token: Encryption.encrypt({
              id: userProvider.user!.id,
              token: userProvider.getRememberMeToken(),
            }),
          })
      }).catch(() => null)

      return response.json({ success: true })
    } catch (error) {
      if(error.code === 'E_VALIDATION_FAILURE') {
        return response.status(422).json({
          success: false,
          messages: error.messages,
        })
      }
      return response.status(500).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async updatePasswordByToken ({ auth, request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      token: schema.string({ trim: true }),
      password: schema.string({ trim: true }, [ rules.confirmed() ]),
    })

    try {
      const { token, password } = await request.validate({
        schema: validationSchema,
        messages: {
          'token.required': 'Le token est manquant.',
          'password.required': 'Veuillez indiquer votre nouveau mot de passe.',
          'password.confirmed': 'Les mots de passe ne correspondent pas.',
        },
      })

      const payload: any = Encryption.decrypt(token)

      if(!payload || !payload.id || !payload.token) {
        return response.status(404).json({
          success: false,
          messages: {
            errors: [{
              rule: 'invalid',
              field: 'token',
              message: 'Ce token est invalide',
            }],
          },
        })
      }

      const userProvider = await auth.use('user').provider.findByRememberMeToken(payload.id, payload.token)

      if(!userProvider.user) {
        return response.status(404).json({
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

      userProvider.setRememberMeToken(string.generateRandom(20))
      await auth.use('user').provider.updateRememberMeToken(userProvider)

      userProvider.user.password = password

      return response.json({ success: true })
    } catch (error) {
      if(error.code === 'E_VALIDATION_FAILURE') {
        return response.status(422).json({
          success: false,
          messages: error.messages,
        })
      }
      return response.status(500).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async logout ({ auth, response }: HttpContextContract) {
    await auth.use('user').logout()

    response.status(200).json({
      success: true,
      message: 'Vous êtes déconnecté avec succès',
    })
  }
}
