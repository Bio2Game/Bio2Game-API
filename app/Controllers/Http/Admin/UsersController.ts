import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

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
      })
    }
  }
}
