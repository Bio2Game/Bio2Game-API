import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import { schema } from '@ioc:Adonis/Core/Validator'
import Icon from 'App/Models/Icon'

import lodash from 'lodash'

export default class IconsController {
  public async index () {
    const icons = await Icon.all()
    return { success: true, icons }
  }

  public async show ({ response, params }: HttpContextContract){
    try {
      const icon = await Icon.find(params.id)

      if(!icon) {
        response.status(404).json({ success: false })
      }

      return {
        success: true,
        icon,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async store ({ request, response}: HttpContextContract){
    const validationSchema = schema.create({
      icon: schema.file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg', 'svg'],
      }) as any,
    })

    try {
      const { icon: image } = await request.validate({
        schema: validationSchema,
        messages: {
          'icon.file.extname': 'Vous ne pouvez importer que des images',
          'icon.file.size': 'L\'image ne doit pas dépasser 2mo',
        },
      })

      console.log(image)

      const iconName = `${lodash.snakeCase(image.fieldName)}.${new Date().getTime()}.${image.subtype}`
      await image.move(Application.publicPath('/images/icons'), { name: iconName })
      const icon = await Icon.create({ reference: iconName })

      return {
        success: true,
        icon,
      }
    } catch (error) {
      console.error(error)
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }

  public async delete ({ response, params }: HttpContextContract){
    try {
      const icon = await Icon.find(params.id)

      if(!icon) {
        response.status(404).json({ success: false })
      }

      await icon?.delete()

      return {
        success: true,
        icon,
      }
    } catch (error) {
      response.status(422).json({
        success: false,
        messages: error.messages,
      })
    }
  }
}
