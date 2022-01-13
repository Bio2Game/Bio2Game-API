import { Client } from 'discord.js'

import Env from '@ioc:Adonis/Core/Env'

class Bot {
  private booted = false
  public client = new Client({
    intents: 'DIRECT_MESSAGES',
  })

  public boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.booted = true
    this.client.login(Env.get('DISCORD_TOKEN'))
  }
}

export default new Bot()
