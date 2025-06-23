import type {LinkKind as _LinkKind} from './Link.js'
export {Link, LinkValidationSchema} from './Link.js'
export type LinkKind = _LinkKind
export {CreateLinkRequest, CreateLinkRequestValidationSchema} from './CreateLinkRequest.js'
export type {LinkRepository} from './LinkRepository.js'

export interface LinkValidation {
  isValid: boolean
  errors: string[]
}

export interface LinkMetadata {
  id: string
  from: string
  to: string
  kind: LinkKind
  body: string
  hasDescription: boolean
}
