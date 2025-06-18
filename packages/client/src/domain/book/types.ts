import type {BookStatus as _BookStatus} from './Book.js'
export {Book, BookValidationSchema} from './Book.js'
export type BookStatus = _BookStatus
export {BookCover, BookCoverValidationSchema} from './BookCover.js'
export {CreateBookRequest, CreateBookRequestValidationSchema} from './CreateBookRequest.js'
export {UpdateBookRequest, UpdateBookRequestValidationSchema} from './UpdateBookRequest.js'
export {CreateBookCoverRequest, CreateBookCoverRequestValidationSchema} from './CreateBookCoverRequest.js'

export interface BookMetadata {
  id: string
  title: string
  summary: string
  status: BookStatus
  wordCount: number
  chapterCount?: number
  hasRootChapter: boolean
  hasCover: boolean
}

export interface BookValidation {
  isValid: boolean
  errors: string[]
}

export interface BookPermissions {
  canEdit: boolean
  canDelete: boolean
  canPublish: boolean
  canUnpublish: boolean
  canAddChapters: boolean
  canSetCover: boolean
}

export type BookSortField = 'title' | 'createdAt' | 'updatedAt' | 'status'
export type BookSortOrder = 'asc' | 'desc'

export interface BookFilter {
  status?: BookStatus
  published?: boolean
  hasRootChapter?: boolean
  searchTerm?: string
}

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'
