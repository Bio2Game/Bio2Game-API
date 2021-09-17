import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'

import User from 'App/Models/User'

export default class Admin {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if (!(auth.user instanceof User && auth.user.status > 999)) {
      /**
       * Unable to authenticate as admin
       */
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS')
    }
    await next()
  }
}
