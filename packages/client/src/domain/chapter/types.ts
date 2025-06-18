export {Chapter, ChapterValidationSchema} from './Chapter'
export {ChapterCover, ChapterCoverValidationSchema} from './ChapterCover'
export {CreateChapterRequest, CreateChapterRequestValidationSchema} from './CreateChapterRequest'
export {UpdateChapterRequest, UpdateChapterRequestValidationSchema} from './UpdateChapterRequest'
export {CreateChapterCoverRequest, CreateChapterCoverRequestValidationSchema} from './CreateChapterCoverRequest'

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
