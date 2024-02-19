import {Email} from '../_kernel/Email.js'
import {ValidationToken} from '../auth/Models/ValidationToken.js'

export interface Emailer {
  sendValidationToken: (validationToken: ValidationToken, email: Email) => Promise<ValidationToken>
}
