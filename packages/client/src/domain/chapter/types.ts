export {Chapter, ChapterValidationSchema} from './Chapter.js'
export {ChapterCover, ChapterCoverValidationSchema} from './ChapterCover.js'
export {CreateChapterRequest, CreateChapterRequestValidationSchema} from './CreateChapterRequest.js'
export {UpdateChapterRequest, UpdateChapterRequestValidationSchema} from './UpdateChapterRequest.js'
export {CreateChapterCoverRequest, CreateChapterCoverRequestValidationSchema} from './CreateChapterCoverRequest.js'
export type {ChapterRepository} from './ChapterRepository.js'

export interface ChapterMetadata {
  id: string
  title: string
  summary: string
  wordCount: number
  hasCover: boolean
  hasContent: boolean
  linkCount?: number
}

export interface ChapterValidation {
  isValid: boolean
  errors: string[]
}

export interface ChapterPermissions {
  canEdit: boolean
  canDelete: boolean
  canAddLinks: boolean
  canSetCover: boolean
  canAddContent: boolean
}

export type ChapterSortField = 'title' | 'createdAt' | 'updatedAt'
export type ChapterSortOrder = 'asc' | 'desc'
