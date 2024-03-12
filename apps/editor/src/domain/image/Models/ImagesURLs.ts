import {z} from 'zod'

import {ImageURL} from './ImageURL'

const ImagesURLsValidations = z.object({
  urls: z.instanceof(ImageURL, {message: 'urls required'}).array()
})
export class ImagesURLs {
  static create({urls}: z.infer<typeof ImagesURLsValidations>) {
    ImagesURLsValidations.parse({urls})

    return new ImagesURLs(urls, false)
  }

  static empty() {
    return new ImagesURLs(undefined, true)
  }

  constructor(public readonly _urls: ImageURL[] = [], public readonly empty?: boolean) {}

  urls(): string[] {
    return this._urls.map(url => url.value)
  }
}
