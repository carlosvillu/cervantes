import {Resend} from 'resend'

import {Email} from '../_kernel/Email.js'
import {VerifyEmail} from '../_transactional/user/validationToken.js'
import {ValidationToken} from '../auth/Models/ValidationToken.js'
import {Emailer} from './Emailer.js'

const {RESEND_API_KEY} = process.env

export class ResendEmailer implements Emailer {
  static FROM = 'bookadventur.es <hello@bookadventur.es>'
  static create() {
    const resend = new Resend(RESEND_API_KEY)

    return new ResendEmailer(resend)
  }

  constructor(private readonly resend: Resend) {}

  async sendValidationToken(validationToken: ValidationToken, email: Email): Promise<ValidationToken> {
    await this.resend.emails.send({
      from: ResendEmailer.FROM,
      to: email.value,
      subject: 'Validate your email',
      react: <VerifyEmail validationCode={validationToken.token!} />
    })
    return validationToken
  }
}
