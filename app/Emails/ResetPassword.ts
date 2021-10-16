import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class ResetPassword extends BaseMailer {
  constructor(private email: string, private token: string) {
    super()
  }

  public prepare(message: MessageContract) {
    message
      .from('no-reply@bio2game.com', 'Bio2Game')
      .to(this.email)
      .subject('Changement de mot de passe sur Bio2Game.com')
      .htmlView('emails/forget-password', {
        token: this.token,
        domain: Env.get('WEB_URL') || 'https://www.bio2game.com',
      })
  }
}
