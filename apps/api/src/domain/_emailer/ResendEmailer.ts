import {Resend} from 'resend'

import {Email} from '../_kernel/Email.js'
import {ValidationToken} from '../auth/Models/ValidationToken.js'
import {Emailer} from './Emailer.js'

const {RESEND_API_KEY} = process.env

export class ResendEmailer implements Emailer {
  static FROM = 'hello@bookadventur.es'
  static create() {
    const resend = new Resend(RESEND_API_KEY)

    return new ResendEmailer(resend)
  }

  constructor(private readonly resend: Resend) {}

  async sendValidationToken(validationToken: ValidationToken, email: Email): Promise<ValidationToken> {
    await this.resend.emails.send({
      from: ResendEmailer.FROM,
      to: email.value,
      subject: '[BOOKADVENTUR.ES] Validate your email',
      html: `<p>Send this token <strong>${validationToken.token!}</strong>!</p>`
    })
    return validationToken
  }
}
