import type {LinkKind as _LinkKind} from './Link'
export {Link, LinkValidationSchema} from './Link'
export type LinkKind = _LinkKind
export {CreateLinkRequest, CreateLinkRequestValidationSchema} from './CreateLinkRequest'

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
