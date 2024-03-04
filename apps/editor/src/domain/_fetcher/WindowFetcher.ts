import {type AnyZodObject, type ZodArray, z} from 'zod'

import {Config} from '../_config'
import type {Fetcher, RequestFetcher, ResponseFetcher} from './Fetcher'

export class WindowFetcher implements Fetcher {
  static create(config: Config) {
    return new WindowFetcher(config)
  }

  constructor(private readonly config: Config) {}

  get = async <O>(
    url: string,
    options: RequestInit,
    schema: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<ResponseFetcher<O>> => {
    return this.#request(url, {...options, method: 'get'}, schema)
  }

  del = async <O>(
    url: string,
    options: RequestInit,
    schema: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<ResponseFetcher<O>> => {
    return this.#request(url, {...options, method: 'delete'}, schema)
  }

  post = async <O>(
    url: string,
    options: RequestFetcher,
    schema: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<ResponseFetcher<O>> => {
    const body = options.body instanceof FormData ? options.body : JSON.stringify(options.body)
    return this.#request<O>(url, {...options, method: 'post', body}, schema)
  }

  put = async <O>(
    url: string,
    options: RequestFetcher,
    schema: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<ResponseFetcher<O>> => {
    return this.#request<O>(url, {...options, method: 'put', body: JSON.stringify(options.body)}, schema)
  }

  #request = async <O>(
    url: string,
    options: RequestInit,
    schema: AnyZodObject | ZodArray<AnyZodObject>
  ): Promise<ResponseFetcher<O>> => {
    try {
      const generateOptions = () => {
        const isForm = options.body instanceof FormData
        const {access} = JSON.parse(window.localStorage.getItem('AUTH_CREDENTIALS') ?? '{}') as {
          access?: string
          refresh?: string
        }
        return {
          ...options,
          headers: {
            ...options.headers,
            ...(!isForm && {'Content-Type': 'application/json; charset=utf-8'}),
            ...(access && {Authorization: `Bearer ${access}`})
          }
        }
      }

      let resp = await window.fetch(url, generateOptions())
      const respCloned = resp.clone()

      if (resp.status === 403) {
        await this.#revalidateCredentials()
        resp = await window.fetch(url, generateOptions())
      }

      const json = await resp.json()

      if (resp.ok) {
        schema.parse(json)
        return [undefined, json]
      }

      throw respCloned // eslint-disable-line 
    } catch (resp) {
      return [resp as Response, undefined]
    }
  }

  async #revalidateCredentials() {
    const RevalidateAuthValidations = z.object({
      access: z.string({required_error: 'Access is requires'}),
      refresh: z.string({required_error: 'Refresh is required'})
    })

    try {
      const {refresh} = JSON.parse(window.localStorage.getItem('AUTH_CREDENTIALS') ?? '{}') as {
        access?: string
        refresh?: string
      }

      const resp = await window.fetch(this.config.get('API_HOST') + '/auth/refresh', {
        method: 'post',
        body: JSON.stringify({refresh}),
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })

      const json = await resp.json()

      if (resp.ok) {
        RevalidateAuthValidations.parse(json)
        window.localStorage.setItem('AUTH_CREDENTIALS', JSON.stringify(json))
        return [undefined, json]
      }

      throw resp // eslint-disable-line 
    } catch (resp) {
      return [resp as Response, undefined]
    }
  }
}
