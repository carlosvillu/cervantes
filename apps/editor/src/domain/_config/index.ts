export interface Base {
  [key: string]: string
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

  get(key: string): string {
    return this.#config[key]
  }

  set(key: string, value: string) {
    this.#config[key] = value
  }

  has(key: string) {
    return this.#config[key] !== undefined
  }
}
