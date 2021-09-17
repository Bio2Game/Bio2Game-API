/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import bcrypt from 'bcrypt'
import Hash, { HashDriverContract } from '@ioc:Adonis/Core/Hash'

/**
 * Implementation of custom bcrypt driver
 */
class CustomBcryptDriver implements HashDriverContract {
  constructor(private config: { saltRounds: number }) {}

  /**
   * Ignore these. The PHC format requires it
   */
  public params = {}
  public ids = []

  /**
   * Has to be false, since bcrypt cannot find if password needs
   * a re-hash or not
   */
  public needsReHash() {
    return false
  }

  /**
   * Alias for [[this.make]]
   */
  public hash(value: string) {
    process.emitWarning('DeprecationWarning', 'Hash.hash() is deprecated. Use Hash.make() instead')
    return this.make(value)
  }

  /**
   * Hash value
   */
  public async make(value: string) {
    return bcrypt.hash(value, this.config.saltRounds)
  }

  /**
   * Verify value
   */
  public async verify(hashedValue: string, plainValue: string) {
    return bcrypt.compare(plainValue, hashedValue)
  }
}

Hash.extend('custom-bcrypt', function () {
  return new CustomBcryptDriver(arguments[2])
})
