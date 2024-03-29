/**
 * Contract source: https://git.io/Jfefs
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

/**
 * Replace `contracts/hash.ts` with this
 */

declare module '@ioc:Adonis/Core/Hash' {
  import { HashDrivers } from '@ioc:Adonis/Core/Hash'

  interface HashersList {
    bcrypt: {
      config: BcryptConfig
      implementation: BcryptContract
    }
    custom: {
      config: { saltRounds: number; driver: 'custom-bcrypt' }
      implementation: HashDriverContract
    }
    argon: {
      config: ArgonConfig
      implementation: ArgonContract
    }
  }
}
