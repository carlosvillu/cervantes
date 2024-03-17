import {type AnyZodObject, type ZodArray} from 'zod'

import type {Fetcher, RequestFetcher, ResponseFetcher} from './Fetcher.js'

export class NodeFetcher implements Fetcher {
  static create() {
    return new NodeFetcher()
  }

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
      const resp = await fetch(url, {
        ...options,
        headers: {...options.headers, 'Content-Type': 'application/json; charset=utf-8'}
      })
      const respCloned = resp.clone()

      const json = await resp.json()

      if (resp.ok) {
        schema.parse(json)
        return [undefined, json as O]
      }

      throw respCloned // eslint-disable-line 
    } catch (resp) {
      return [resp as Response, undefined]
    }
  }
}
