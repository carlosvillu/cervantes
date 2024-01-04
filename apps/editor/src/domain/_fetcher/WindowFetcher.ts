import type {AnyZodObject} from 'zod'

import {Config} from '../_config'
import type {Fetcher, RequestFetcher, ResponseFetcher} from './Fetcher'

export class WindowFetcher implements Fetcher {
  static create(config: Config) {
    return new WindowFetcher(config)
  }

  constructor(private readonly config: Config) {}

  get = async <O>(url: string, options: RequestInit, schema: AnyZodObject): Promise<ResponseFetcher<O>> => {
    return this.#request(url, {...options, method: 'get'}, schema)
  }

  post = async <O>(url: string, options: RequestFetcher, schema: AnyZodObject): Promise<ResponseFetcher<O>> => {
    return this.#request<O>(url, {...options, method: 'post', body: JSON.stringify(options.body)}, schema)
  }

  #request = async <O>(url: string, options: RequestInit, schema: AnyZodObject): Promise<ResponseFetcher<O>> => {
    try {
      const {access} = JSON.parse(window.localStorage.getItem('AUTH_CREDENTIALS') ?? '{}') as {
        access?: string
        referesh?: string
      }

      const resp = await window.fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json; charset=utf-8',
          ...(access && {Authorization: `Bearer ${access}`})
        }
      })

      const json = await resp.json()

      if (resp.ok) {
        schema.parse(json)
        return [undefined, json]
      }

      throw resp // eslint-disable-line 
    } catch (resp) {
      return [resp as Response, undefined]
    }
  }
}
