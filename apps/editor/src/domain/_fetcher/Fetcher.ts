import type {AnyZodObject} from 'zod'

export interface RequestFetcher {
  body: FormData | {[k: string]: string | number | boolean | undefined | {[k: string]: unknown}}
}

export type ResponseFetcher<O> = [undefined, O] | [Response, undefined]

export interface Fetcher {
  get: <O>(url: string, options: RequestInit, schema: AnyZodObject) => Promise<ResponseFetcher<O>>
  del: <O>(url: string, options: RequestInit, schema: AnyZodObject) => Promise<ResponseFetcher<O>>
  post: <O>(url: string, options: RequestFetcher, schema: AnyZodObject) => Promise<ResponseFetcher<O>>
  put: <O>(url: string, options: RequestFetcher, schema: AnyZodObject) => Promise<ResponseFetcher<O>>
}
