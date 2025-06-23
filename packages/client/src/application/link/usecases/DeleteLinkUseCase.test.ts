/**
 * DeleteLinkUseCase Tests
 */

import {beforeEach, describe, expect, it, vi} from 'vitest'

import {SuccessMessage} from '../../../domain/_shared/SuccessMessage.js'
import type {LinkRepository} from '../../../domain/link/LinkRepository.js'
import {ValidationError} from '../../../infrastructure/http/errors/ValidationError.js'
import {DeleteLinkUseCase} from './DeleteLinkUseCase.js'

describe('DeleteLinkUseCase', () => {
  let mockLinkRepository: LinkRepository
  let deleteLinkUseCase: DeleteLinkUseCase

  beforeEach(() => {
    mockLinkRepository = {
      create: vi.fn(),
      findByID: vi.fn(),
      getLinksFromChapter: vi.fn(),
      delete: vi.fn()
    }
    deleteLinkUseCase = new DeleteLinkUseCase(mockLinkRepository)
  })

  describe('execute', () => {
    it('should delete a link successfully with valid ID', async () => {
      // Arrange
      const input = {
        id: 'test-link-id'
      }

      const mockSuccessMessage = SuccessMessage.fromAPI({
        message: 'Link deleted successfully'
      })

      vi.mocked(mockLinkRepository.delete).mockResolvedValue(mockSuccessMessage)

      // Act
      const result = await deleteLinkUseCase.execute(input)

      // Assert
      expect(result).toBe(mockSuccessMessage)
      expect(mockLinkRepository.delete).toHaveBeenCalledWith('test-link-id')
    })

    it('should throw ValidationError when ID is missing', async () => {
      // Arrange
      const input = {
        id: ''
      }

      // Act & Assert
      await expect(deleteLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(deleteLinkUseCase.execute(input)).rejects.toThrow('Link ID is required')
    })

    it('should throw ValidationError when ID is only whitespace', async () => {
      // Arrange
      const input = {
        id: '   '
      }

      // Act & Assert
      await expect(deleteLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(deleteLinkUseCase.execute(input)).rejects.toThrow('Link ID cannot be empty')
    })

    it('should handle repository errors properly', async () => {
      // Arrange
      const input = {
        id: 'test-link-id'
      }

      const repositoryError = new Error('Repository error')
      vi.mocked(mockLinkRepository.delete).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(deleteLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(deleteLinkUseCase.execute(input)).rejects.toThrow('Link deletion failed: Repository error')
    })

    it('should handle not found errors properly', async () => {
      // Arrange
      const input = {
        id: 'nonexistent-link-id'
      }

      const repositoryError = new Error('Link not found')
      vi.mocked(mockLinkRepository.delete).mockRejectedValue(repositoryError)

      // Act & Assert
      await expect(deleteLinkUseCase.execute(input)).rejects.toThrow(ValidationError)
      await expect(deleteLinkUseCase.execute(input)).rejects.toThrow('Link deletion failed: Link not found')
    })
  })
})
