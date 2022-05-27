import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Domain from 'App/Models/Domain'

import lodash from 'lodash'

export default class DomainsController {
  public async index() {
    const domains = await Domain.query().preload('icon').orderBy('updated_at', 'desc')
    return { success: true, domains }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      const domain = await Domain.find(params.id)

      if (!domain) {
        return response.status(404).json({ success: false })
      }

      return {
        success: true,
        domain,
      }
    } catch (error) {
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(this.generateValidation())

      let imageName: string | undefined
      if (payload.image) {
        imageName = `${lodash.snakeCase(payload.label)}.${new Date().getTime()}.${
          payload.image.subtype
        }`
        await payload.image.move(Application.makePath('files/illustrations'), { name: imageName })
      }

      const domain = await Domain.create({
        ...payload,
        image: imageName,
      })

      await domain.load('icon')

      return {
        success: true,
        domain,
      }
    } catch (error) {
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    try {
      const domain = await Domain.find(params.id)

      if (!domain) return response.status(404).json({ success: false })

      const payload = await request.validate(this.generateValidation(params.id))

      let imageName: string | undefined

      if (payload.image) {
        console.log(payload.image)
        imageName = `${lodash.snakeCase(payload.label)}.${new Date().getTime()}.${
          payload.image.subtype
        }`
        await payload.image.move(Application.makePath('files/illustrations'), { name: imageName })
      }

      domain.merge({
        ...payload,
        image: imageName,
      })

      await domain.save()

      await domain.load('icon')

      return {
        success: true,
        domain,
      }
    } catch (error) {
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    try {
      const domain = await Domain.find(params.id)

      if (!domain) {
        return response.status(404).json({ success: false })
      }

      await domain.delete()

      return {
        success: true,
        domain,
      }
    } catch (error) {
      return response.status(422).json({
        success: false,
        messages: error.messages,
        error,
      })
    }
  }

  private generateValidation(domainId = null) {
    return {
      schema: schema.create({
        label: schema.string({ trim: true }, [
          rules.unique({
            table: 'domains',
            column: 'label',
            whereNot: domainId ? { id: domainId } : undefined,
          }),
          rules.maxLength(255),
        ]),
        icon_id: schema.number([rules.exists({ table: 'icons', column: 'id' })]),
        keyswords: schema.string({}, [rules.maxLength(255)]),
        image: schema.file.optional({
          size: '2mb',
          extnames: ['jpg', 'png', 'jpeg'],
        }),
      }),
      messages: {
        'label.required': 'Veuillez indiquer le nom du domaine.',
        'label.unique': 'Ce nom est déjà utilisé par un autre domaine.',
        'label.maxLength':
          'Le nom de votre domaine ne peut pas dépasser {{ options.maxLength }} caractères.',
        'icon_id.required': "Veuillez renseigner l'id de l'icone.",
        'icon_id.exists': "Cette icone n'existe pas.",
        'keyswords.maxLength':
          'Vos mots clés ne peuvent pas dépasser {{ options.maxLength }} caractères au total.',
        'image.file': 'Veuillez renseigner un fichier',
        'image.file.extname': 'Vous ne pouvez importer que des images',
        'image.file.size': "L'image ne doit pas dépasser 2mo",
      },
    }
  }
}
