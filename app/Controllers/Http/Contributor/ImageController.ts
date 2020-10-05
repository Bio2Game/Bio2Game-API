import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

import sharp from 'sharp'

export default class ImageController {
  public async store ({ request }: HttpContextContract) {
    const image = request.file('image', {
      size: '4mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!image) {
      return 'Please upload file'
    }

    if (image.hasErrors) {
      return image.errors
    }

    const name = new Date().getTime() + (image?.extname || '.png')

    if (image) {
      sharp(image.tmpPath)
        .resize({ width: 1024, withoutEnlargement: true })
        .resize({ height: 1024, withoutEnlargement: true })
        .rotate() // necessary to rotate back to what it should be (from exif)
        .toFile(`${Application.publicPath('/images/illustrations')}/${name}`)
        .catch(console.error)
    }

    return `/images/${name}`
  }
}
