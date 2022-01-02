/**
 * Config source: https://git.io/JOdi5
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { AllyConfig } from '@ioc:Adonis/Addons/Ally'

/*
|--------------------------------------------------------------------------
| Ally Config
|--------------------------------------------------------------------------
|
| The `AllyConfig` relies on the `SocialProviders` interface which is
| defined inside `contracts/ally.ts` file.
|
*/
const allyConfig: AllyConfig = {
  /*
	|--------------------------------------------------------------------------
	| Google driver
	|--------------------------------------------------------------------------
	*/
  google: {
    driver: 'google',
    clientId: Env.get('GOOGLE_CLIENT_ID'),
    clientSecret: Env.get('GOOGLE_CLIENT_SECRET'),
    callbackUrl: `${Env.get('WEB_URL')}/login/callback/google`,
  },
  /*
	|--------------------------------------------------------------------------
	| Twitter driver
	|--------------------------------------------------------------------------
	*/
  twitter: {
    driver: 'twitter',
    clientId: Env.get('TWITTER_CLIENT_ID'),
    clientSecret: Env.get('TWITTER_CLIENT_SECRET'),
    callbackUrl: `${Env.get('WEB_URL')}/login/callback/twitter`,
  },
  /*
  |--------------------------------------------------------------------------
  | LinkedIn driver
  |--------------------------------------------------------------------------
  */
  linkedin: {
    driver: 'linkedin',
    clientId: Env.get('LINKEDIN_CLIENT_ID'),
    clientSecret: Env.get('LINKEDIN_CLIENT_SECRET'),
    callbackUrl: `${Env.get('WEB_URL')}/login/callback/linkedin`,
    scopes: ['r_emailaddress', 'r_liteprofile'],
  },
  /*
  |--------------------------------------------------------------------------
  | Facebook driver
  |--------------------------------------------------------------------------
  */
  facebook: {
    driver: 'facebook',
    clientId: Env.get('FACEBOOK_CLIENT_ID'),
    clientSecret: Env.get('FACEBOOK_CLIENT_SECRET'),
    callbackUrl: `${Env.get('WEB_URL')}/login/callback/facebook`,
    // scopes: ['email'],
    // userFields: ['name_format', 'picture', 'email'],
  },
}

export default allyConfig
