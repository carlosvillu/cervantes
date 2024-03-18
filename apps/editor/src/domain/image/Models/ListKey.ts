import {z} from 'zod'

import {Key} from './Key'

const ListKeyValidations = z.object({
  keys: z.instanceof(Key, {message: 'keys required'}).array()
})
export class ListKey {
  static create({keys}: z.infer<typeof ListKeyValidations>) {
    ListKeyValidations.parse({keys})

    return new ListKey(keys, false)
  }

  static empty() {
    return new ListKey(undefined, true)
  }

  constructor(public readonly _keys: Key[] = [], public readonly empty?: boolean) {}

  keys(): string[] {
    return this._keys.map(url => url.value)
  }

  urls() {
    return this._keys.map(key => key.url())
  }

  isEmpty() {
    return this.empty !== undefined && this.empty
  }
}
