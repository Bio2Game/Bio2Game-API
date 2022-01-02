/*
|--------------------------------------------------------------------------
| Validating Environment Variables
|--------------------------------------------------------------------------
|
| In this file we define the rules for validating environment variables.
| By performing validation we ensure that your application is running in
| a stable environment with correct configuration values.
|
| This file is read automatically by the framework during the boot lifecycle
| and hence do not rename or move this file to a different location.
|
*/

import Env from '@ioc:Adonis/Core/Env'

export default Env.rules({
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  APP_KEY: Env.schema.string(),
  APP_NAME: Env.schema.string(),
  NODE_ENV: Env.schema.enum(['development', 'production', 'testing'] as const),
  CACHE_VIEWS: Env.schema.boolean(),

  WEB_URL: Env.schema.string(),

  // Variables for the database
  DB_CONNECTION: Env.schema.string(),
  DB_HOST: Env.schema.string(), // no format because "host" format don't accept docker container names
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_NAME: Env.schema.string(),

  // Variables for social auth
  GOOGLE_CLIENT_ID: Env.schema.string(),
  GOOGLE_CLIENT_SECRET: Env.schema.string(),
  TWITTER_CLIENT_ID: Env.schema.string(),
  TWITTER_CLIENT_SECRET: Env.schema.string(),
  FACEBOOK_CLIENT_ID: Env.schema.string(),
  FACEBOOK_CLIENT_SECRET: Env.schema.string(),
  LINKEDIN_CLIENT_ID: Env.schema.string(),
  LINKEDIN_CLIENT_SECRET: Env.schema.string(),

  // Variable for mailer
  SPARKPOST_API_KEY: Env.schema.string(),
})
