import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import sharp from 'sharp'
import Application from '@ioc:Adonis/Core/Application'
import { QuizStatus } from 'App/Models/Quiz'

export default class UsersController {
  public async index() {
    const contributors = await User.query()
      .where('status', '>', 0)
      .whereHas('quizzes', (query) => {
        query.where('status', QuizStatus.Public)
      })
      .preload('quizzes', (query) =>
        query
          .where('status', QuizStatus.Public)
          .preload('domain', (query2) => query2.preload('icon'))
          .groupLimit(5)
      )
    return { contributors }
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const validationSchema = schema.create({
      username: schema.string.optional({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', whereNot: { id: auth.user?.id } }),
      ]),
      name: schema.string.optional({ trim: true }),
      email: schema.string.optional({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', whereNot: { id: auth.user?.id } }),
      ]),
      old_password: schema.string.optional({ trim: true }, [
        rules.exists({ table: 'users', column: 'password' }),
      ]),
      password: schema.string.optional({ trim: true }, [rules.confirmed()]),
      description: schema.string.optional(),
      sex: schema.number.optional(),
      birth_date: schema.date.optional(),
      localisation: schema.string.optional({ trim: true }),
      website: schema.string.optional({ trim: true }),
      contributor_mobile: schema.string.optional({ trim: true }),
      contributor_type: schema.number.optional(),
      status: schema.number.optional(),
      is_animator: schema.boolean.optional(),
      animators: schema.array.optional().members(schema.number()),
    })

    try {
      const { animators, ...payload } = await request.validate({
        schema: validationSchema,
        messages: {
          'username.unique': 'Ce pseudo est déjà utilisé.',
          'email.email': 'Merci de rentrer une adresse email valide.',
          'email.unique': 'Cette adresse email est déjà utilisé.',
          'old_password.exists': 'Le mot de passe est incorect.',
          'confirmed': 'Veuillez confirmer votre mot de passe.',
        },
      })

      const user = await User.findOrFail(auth.user?.id)

      user.merge(payload)

      await user.save()

      if (animators) await user.related('animators').sync(animators)

      return response.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès',
      })
    } catch (error) {
      console.log(error)

      return response.status(422).json({
        success: false,
        messages: error.messages,
        error: error,
      })
    }
  }

  public async uploadAvatar({ request, auth }: HttpContextContract) {
    const image = request.file('avatar', {
      size: '4mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    if (!image) {
      return 'Please upload file'
    }

    if (image.hasErrors) {
      return image.errors
    }

    const name = new Date().getTime() + '.' + (image.extname || 'png')

    sharp(image.tmpPath)
      .resize({ width: 256, withoutEnlargement: true })
      .resize({ height: 256, withoutEnlargement: true })
      .rotate() // necessary to rotate back to what it should be (from exif)
      .toFile(`${Application.makePath('files/avatar_uploads')}/${name}`)
      .catch(console.error)

    const user = auth.user as User
    user.avatarPath = name
    await user.save()

    return name
  }

  public async animators({ auth }: HttpContextContract) {
    const user = auth.user as User
    await user.load('animators')

    const animators = await User.query().where('isAnimator', 1)

    return {
      current_animators_ids: user.animators.map((r) => r.id),
      all_animators: animators.map((animator) => ({
        id: animator.id,
        name: animator.name,
        username: animator.username,
      })),
    }
  }
}
