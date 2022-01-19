import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Guest from 'App/Models/Guest'
import User from 'App/Models/User'
import { DateTime } from 'luxon'

import Env from '@ioc:Adonis/Core/Env'

import Stripe from 'stripe'
import Bot from 'App/Services/Bot'
import Payment from 'App/Models/Payment'
import { MessageEmbedOptions } from 'discord.js'
import { stripIndents } from 'common-tags'

const stripe = new Stripe(Env.get('STRIPE_SECRET'), {
  apiVersion: '2020-08-27',
})

interface SessionCreationData {
  identity: string | null
  email: string | null
  reason: string | null
  name?: string
  startDate?: DateTime
  duration: string | null
  students: number | null
  results?: boolean
  iframe?: boolean
  costs: number
  donations: number
}

export default class PaymentsController {
  public async create({ auth, request, response }: HttpContextContract) {
    const isUser = auth.isAuthenticated && auth.defaultGuard === 'user'
    const payload = await request.validate({
      schema: schema.create({
        identity: schema.string.nullable({ trim: true }, !isUser ? [rules.required] : undefined),
        email: schema.string.nullable(
          { trim: true },
          !isUser ? [rules.required, rules.email()] : [rules.email()]
        ),
        reason: schema.enum.nullable(['event', 'formation']),
        name: schema.string.optional({ trim: true }, [rules.requiredWhen('reason', '!=', null)]),
        startDate: schema.date.optional(undefined, [rules.requiredWhen('reason', '=', 'event')]),
        duration: schema.enum.nullable(
          ['day', 'week', 'month'],
          [rules.requiredWhen('reason', '=', 'event')]
        ),
        students: schema.enum.nullable(
          [40, 150, 500, 1000],
          [rules.requiredWhen('reason', '=', 'formation')]
        ),
        results: schema.boolean.optional(),
        iframe: schema.boolean.optional(),

        costs: schema.number(),
        donations: schema.number(),
      }),
      messages: {
        'identity.required': 'Veuillez indiquer notre nom et prénom.',
        'email.required': 'Veuillez indiquer votre adresse email.',
        'email.email': 'Veuillez indiquer une adresse email valide.',
        'reason.enum': 'Veuillez indiquer une raison valide.',
        'name.requiredWhen': 'Veuillez indiquer un nom.',
        'startDate.requiredWhen': 'Veuillez indiquer une date de lancement.',
        'duration.requiredWhen': 'Veuillez indiquer une durée.',
        'duration.enum': 'Veuillez indiquer une durée valide.',
        'students.requiredWhen': "Veuillez indiquer un nombre d'édudiants.",
        'students.enum': "Veuillez indiquer un nombre d'édudiants valide.",
      },
    })

    const product = this.generateProduct(payload, auth.user)

    try {
      const session = await stripe.checkout.sessions.create(product)

      return response.ok({ id: session.id })
    } catch (error) {
      console.error(error)
      return response.internalServerError({
        error,
      })
    }
  }

  public async webhook({ request, response }: HttpContextContract) {
    let event: any = request.body
    const endpointSecret = Env.get('STRIPE_ENDPOINT_SECRET')
    if (endpointSecret) {
      try {
        const signature = request.header('stripe-signature')

        if (!signature) throw new Error('Missing signature')

        event = stripe.webhooks.constructEvent(request.raw()!, signature, endpointSecret)
      } catch (error) {
        console.error(error)
        return response.badRequest(`Webhook Error: ${error.message}`)
      }
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.payment_status === 'paid') {
          this.paymentCompleted(session)
        }

        break
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session

        this.paymentCompleted(session)

        break
      }
    }

    return response.noContent()
  }

  private async paymentCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const adminContact = await Bot.client.users.fetch(Env.get('DISCORD_ADMIN_ID')).catch(() => null)
    if (!adminContact) return

    const data = session.metadata ?? {}

    await Payment.create({
      userId: data.user_id ? Number(data.user_id) : undefined,
      identity: data.identity,
      email: data.email,
      reason: data.reason,
      name: data.name,
      startDate: data.startDate ? DateTime.fromFormat(data.startDate, 'yyyy-MM-dd') : null,
      duration: data.duration,
      students: Number(data.students),
      results: data.results === 'true',
      iframe: data.iframe === 'true',
      costs: Number(data.costs),
      donations: Number(data.donations),
    })

    const embed = {
      title: 'Un nouveau paiement a été effectué sur Bio2Game !',
      color: 0x9dcd09,
      fields: [
        {
          name: 'Adresse email',
          value: session.customer_email,
          inline: true,
        },
        {
          name: data.user_id ? 'ID du compte' : 'Identité',
          value: data.user_id || data.identity,
          inline: true,
        },
        {
          name: 'Montant',
          value: `${session.amount_total! / 100}€`,
          inline: true,
        },
        data.reason
          ? {
              name: 'Informations',
              value:
                data.reason === 'event'
                  ? stripIndents`
                    Motif: **Évènement**
                    Nom de l'évènement: **${data.name}**
                    Date de début: **${
                      data.startDate
                        ? DateTime.fromFormat(data.startDate, 'yyyy-MM-dd').toFormat(
                            'dd LLLL yyyy',
                            { locale: 'fr' }
                          )
                        : 'Non défini'
                    }**
                    Durée: **${this.parseDuration(data.duration) ?? 'Non défini'}**
                  `
                  : stripIndents`
                    Motif: **Formation**
                    Nom de la formation: **${data.name}**
                    Etudiants: **${data.students ?? 'Non défini'}**
                  `,
            }
          : {},
        {
          name: 'Options',
          value: stripIndents`
            Widget: ${data.iframe === 'true' ? '✅' : '❌'}
            Résultats: ${data.results === 'true' ? '✅' : '❌'}
          `,
        },
      ],
    } as MessageEmbedOptions

    try {
      await adminContact.send({ embeds: [embed] })
    } catch (error) {
      console.error(error)
    }
  }

  private generateProduct(
    data: SessionCreationData,
    user?: User | Guest
  ): Stripe.Checkout.SessionCreateParams {
    const items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (data.costs) {
      items.push({
        quantity: 1,
        price_data: {
          currency: 'EUR',
          unit_amount: data.costs * 100,
          product_data: {
            name: 'Coûts de fonctionnement',
          },
        },
      })
    }

    if (data.donations) {
      items.push({
        quantity: 1,
        price_data: {
          currency: 'EUR',
          unit_amount: data.donations * 100,
          product_data: {
            name: 'Donation',
          },
        },
      })
    }

    return {
      payment_method_types: ['card', 'bancontact'],
      line_items: items,
      metadata: {
        ...data,
        user_id: user?.id.toString() ?? '',
        startDate: data.startDate?.toFormat('yyyy-MM-dd') ?? null,
        results: data.results === null ? data.results : `${data.results}`,
        iframe: data.iframe === null ? data.iframe : `${data.iframe}`,
      },
      customer_email: (user as User)?.email ?? data.email!,
      mode: 'payment',
      success_url: `${Env.get('WEB_URL')}?donation=success`,
      cancel_url: Env.get('WEB_URL'),
    }
  }

  private parseDuration(value: string): string {
    switch (value) {
      case 'day':
        return 'Une journée'
      case 'week':
        return 'Une semaine'
      case 'month':
        return 'Un mois'
      default:
        return value
    }
  }
}
