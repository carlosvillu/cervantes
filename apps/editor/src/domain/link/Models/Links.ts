import {z} from 'zod'

import {Link} from './Link.js'

const LinksValidations = z.object({links: z.instanceof(Link, {message: 'Links required'}).array()})

export class Links {
  static create({links}: z.infer<typeof LinksValidations>) {
    LinksValidations.parse({links})
    return new Links(links, false)
  }

  static empty() {
    return new Links(undefined, true)
  }

  constructor(public readonly links: Link[] = [], public readonly empty?: boolean) {}

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  toJSON() {
    return {
      links: this.links.map(link => link.toJSON())
    }
  }
}
