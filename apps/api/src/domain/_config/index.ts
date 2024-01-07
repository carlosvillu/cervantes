export interface Base {
  [key: string]: unknown
}
export class Config {
  #config: Base

  static create(base: Base) {
    return new Config(base)
  }

  constructor(base: Base) {
    this.#config = {
      ...base
    }
  }

  get(key: string) {
    return this.#config[key]
  }

  set(key: string, value: unknown) {
    this.#config[key] = value
  }

  has(key: string) {
    return this.#config[key] !== undefined
  }
}
