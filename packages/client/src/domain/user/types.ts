export {User, UserValidationSchema, type UserAction} from './User.js'
export type {UserRepository} from './UserRepository.js'

export interface UserProfile {
  id: string
  username: string
  email: string
  verified: boolean
}

export interface UserValidation {
  isValid: boolean
  errors: string[]
}

export interface UserPermissions {
  canCreateBooks: boolean
  canPublishBooks: boolean
  canUploadImages: boolean
  canGenerateImages: boolean
  canUpdateProfile: boolean
}
