import type {AnyZodObject} from 'zod'

export interface RequestFetcher {
  body: {[k: string]: string | number | undefined}
}

export type ResponseFetcher<O> = [undefined, O] | [Response, undefined]

export interface Fetcher {
  get: <O>(url: string, options: RequestInit, schema: AnyZodObject) => Promise<ResponseFetcher<O>>
  post: <O>(url: string, options: RequestFetcher, schema: AnyZodObject) => Promise<ResponseFetcher<O>>
}
