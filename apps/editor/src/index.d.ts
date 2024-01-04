import type {Domain} from './domain'

declare global {
  interface Window {
    domain: Domain
  }
}
