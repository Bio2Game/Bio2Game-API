import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

enum SocialAccounts {
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
  FACEBOOK = 'facebook',
}

export default class SocialsController {
  /**
   * Google authentification
   */

  public async googleRedirection({ ally }: HttpContextContract) {
    return ally.use('google').redirectUrl()
  }

  public async googleCallback({ auth, response, ally }: HttpContextContract) {
    const google = ally.use('google')

    if (google.accessDenied()) return response.unauthorized()

    if (google.stateMisMatch()) return response.requestTimeout()

    if (google.hasError()) return response.badRequest(google.getError())

    const { email, nickName, avatarUrl } = await google.user()

    const user = await User.updateOrCreate(
      {
        email: email!,
      },
      {
        avatarPath: avatarUrl ?? undefined,
        username: nickName,
        loginSource: SocialAccounts.GOOGLE,
      }
    )

    await user.load('donations')

    const { token } = await auth.use('user').generate(user)

    return response.ok({ user, token })
  }

  /**
   * Linkedin authentification
   */

  public async linkedinRedirection({ ally }: HttpContextContract) {
    return ally.use('linkedin').redirectUrl()
  }

  public async linkedinCallback({ auth, response, ally }: HttpContextContract) {
    const linkedin = ally.use('linkedin')

    if (linkedin.accessDenied()) return response.unauthorized()

    if (linkedin.stateMisMatch()) return response.requestTimeout()

    if (linkedin.hasError()) return response.badRequest(linkedin.getError())

    const { email, name, avatarUrl } = await linkedin.user()

    const user = await User.firstOrCreate(
      {
        email: email!,
      },
      {
        avatarPath: avatarUrl ?? undefined,
        username: name,
        loginSource: SocialAccounts.LINKEDIN,
      }
    )

    await user.load('donations')

    const { token } = await auth.use('user').generate(user)

    return response.ok({ user, token })
  }

  /**
   * Facebook authentification
   */

  public async facebookRedirection({ ally }: HttpContextContract) {
    return ally.use('facebook').redirectUrl()
  }

  public async facebookCallback({ auth, response, ally }: HttpContextContract) {
    const facebook = ally.use('facebook')

    if (facebook.accessDenied()) return response.unauthorized()

    if (facebook.stateMisMatch()) return response.requestTimeout()

    if (facebook.hasError()) return response.badRequest(facebook.getError())

    const { email, name, avatarUrl } = await facebook.user()

    const user = await User.firstOrCreate(
      {
        email: email!,
      },
      {
        avatarPath: avatarUrl ?? undefined,
        username: name,
        loginSource: SocialAccounts.FACEBOOK,
      }
    )

    await user.load('donations')

    const { token } = await auth.use('user').generate(user)

    return response.ok({ user, token })
  }
}
