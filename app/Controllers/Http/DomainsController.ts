import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Domain from 'App/Models/Domain'

import lodash from 'lodash'

export default class DomainsController {
  public async index () {
    const domains = await Domain.query().preload('icon').orderBy('updated_at', 'desc')
    return { success: true, domains }
  }

  public async show ({ response, params }: HttpContextContract){
    try {
      const domain = await Domain.find(params.id)

      if(!domain) {
        response.status(404).json({ success: false })
      }

      return {
        success: true,
        domain,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async store ({ request, response}: HttpContextContract){
    try {
      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({ table: 'domains', column: 'label' }),
            rules.maxLength(255),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      let image: string | undefined

      if(payload.image){
        image = `${lodash.snakeCase(payload.label)}.${new Date().getTime()}.${payload.image.subtype}`
        await payload.image.move(Application.publicPath('/images/illustrations'), {name: image})
      }

      const domain = await Domain.create({
        ...payload,
        image,
      })

      return {
        success: true,
        domain,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async update ({ request, response, params }: HttpContextContract){
    try {
      const domain = await Domain.find(params.id)

      if(!domain) {
        response.status(404).json({ success: false })
      }

      const payload = await request.validate({
        schema: schema.create({
          label: schema.string({ trim: true }, [
            rules.unique({ table: 'domains', column: 'label', whereNot: { 'id': params.id } }),
            rules.maxLength(255),
          ]),
          ...this.validation.schema,
        }),
        messages: this.validation.messages,
      })

      let image: string | undefined

      if(payload.image){
        image = `${lodash.snakeCase(payload.label)}.${new Date().getTime()}.${payload.image.subtype}`
        await payload.image.move(Application.publicPath('/images/illustrations'), {name: image})
      }

      domain?.merge({
        ...payload,
        image,
      })

      await domain?.save()

      return {
        success: true,
        domain,
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
      const domain = await Domain.find(params.id)

      if(!domain) {
        response.status(404).json({ success: false })
      }

      await domain?.delete()

      return {
        success: true,
        domain,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  private get validation () {
    return {
      schema: {
        iconId: schema.number([
          rules.exists({ table: 'icons', column: 'id' }),
        ]),
        keyswords: schema.string({}, [
          rules.maxLength(255),
        ]),
        image: schema.file.optional({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        }) as any,
      },
      messages: {
        'label.required': 'Veuillez indiquer le nom du domaine.',
        'label.unique': 'Ce nom est déjà utilisé par un autre domaine.',
        'label.maxLength': 'Le nom de votre domaine ne peut pas dépasser {{ maxLength }} caractères.',
        'iconId.required': 'Veuillez renseigner l\'id de l\'icone.',
        'iconId.exists': 'Cette icone n\'existe pas.',
        'keyswords.maxLength': 'Vos mots clés ne peuvent pas dépasser {{ maxLength }} caractères au total.',
        'image.file.extname': 'Vous ne pouvez importer que des images',
        'image.file.size': 'L\'image ne doit pas dépasser 2mo',
      },
    }
  }
}
