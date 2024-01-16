import {z} from 'zod'

import {Body} from './Body.js'

const BodiesValidations = z.object({bodies: z.instanceof(Body, {message: 'Bodies required'}).array()})

export class Bodies {
  static create({bodies}: z.infer<typeof BodiesValidations>) {
    BodiesValidations.parse({bodies})
    return new Bodies(bodies, false)
  }

  static empty() {
    return new Bodies(undefined, true)
  }

  constructor(public readonly bodies: Body[] = [], public readonly empty?: boolean) {}

  isEmpty() {
    return this.empty !== undefined && this.empty
  }

  toJSON() {
    return {
      bodies: this.bodies.map(book => book.toJSON())
    }
  }
}
