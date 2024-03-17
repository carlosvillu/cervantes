import {z} from 'zod'

import {URL} from './URL.js'

const ListURLValidations = z.object({
  urls: z.instanceof(URL, {message: 'URL required'}).array()
})
export class ListURL {
  static create({urls}: z.infer<typeof ListURLValidations>) {
    ListURLValidations.parse({urls})

    return new ListURL(urls, false)
  }

  static empty() {
    return new ListURL(undefined, true)
  }

  constructor(public readonly _urls: URL[] = [], public readonly empty?: boolean) {}

  get urls() {
    return this._urls?.map(url => url.value)
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }
}
