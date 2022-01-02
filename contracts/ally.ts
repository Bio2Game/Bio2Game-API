/**
 * Contract source: https://git.io/JOdiQ
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

declare module '@ioc:Adonis/Addons/Ally' {
  interface SocialProviders {
    google: {
      config: GoogleDriverConfig
      implementation: GoogleDriverContract
    }
    twitter: {
      config: TwitterDriverConfig
      implementation: TwitterDriverContract
    }
    linkedin: {
      config: LinkedInDriverConfig
      implementation: LinkedInDriverContract
    }
    facebook: {
      config: FacebookDriverConfig
      implementation: FacebookDriverContract
    }
  }
}
