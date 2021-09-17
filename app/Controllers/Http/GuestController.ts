import Guest from 'App/Models/Guest'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async guest({ auth }: HttpContextContract) {
    const guest = await auth.use('guest').authenticate()
    return guest ? guest.toJSON() : false
  }

  public async register({ auth, request, response }: HttpContextContract) {
    try {
      const guest = await Guest.create(request.only(['username']))

      const token = await auth.use('guest').login(guest)

      return token.toJSON()
    } catch (error) {
      console.log(error)
      response.status(401).json({
        success: false,
        messages: error.messages || error,
      })
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('guest').logout()

    response.status(200).json({
      success: true,
      message: 'Vous êtes déconnecté avec succès',
    })
  }
}
