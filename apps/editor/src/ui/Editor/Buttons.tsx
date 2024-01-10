import {FC} from 'react'

import type {Editor} from '@tiptap/react'

import {classNames} from '../../js/css'

export const Buttons: FC<{editor: Editor}> = ({editor}) => {
  return (
    <>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={classNames(
          'p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600',
          editor.isActive('bold') ? 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600' : ''
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-bold"
        >
          <path d="M14 12a4 4 0 0 0 0-8H6v8"></path>
          <path d="M15 20a4 4 0 0 0 0-8H6v8Z"></path>
        </svg>
        <span className="sr-only">Bold</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={classNames(
          'p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600',
          editor.isActive('italic') ? 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600' : ''
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-italic"
        >
          <line x1="19" x2="10" y1="4" y2="4"></line>
          <line x1="14" x2="5" y1="20" y2="20"></line>
          <line x1="15" x2="9" y1="4" y2="20"></line>
        </svg>
        <span className="sr-only">Italic</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={classNames(
          'p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600',
          editor.isActive('underline') ? 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600' : ''
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-underline"
        >
          <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
          <line x1="4" x2="20" y1="20" y2="20"></line>
        </svg>
        <span className="sr-only">underline</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={classNames(
          'p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600',
          editor.isActive('strike') ? 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600' : ''
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-strikethrough"
        >
          <path d="M16 4H9a3 3 0 0 0-2.83 4"></path>
          <path d="M14 12a4 4 0 0 1 0 8H6"></path>
          <line x1="4" x2="20" y1="12" y2="12"></line>
        </svg>

        <span className="sr-only">strike</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        className={classNames(
          'p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600',
          editor.isActive('bulletList') ? 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600' : ''
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-list"
        >
          <line x1="8" x2="21" y1="6" y2="6"></line>
          <line x1="8" x2="21" y1="12" y2="12"></line>
          <line x1="8" x2="21" y1="18" y2="18"></line>
          <line x1="3" x2="3.01" y1="6" y2="6"></line>
          <line x1="3" x2="3.01" y1="12" y2="12"></line>
          <line x1="3" x2="3.01" y1="18" y2="18"></line>
        </svg>
        <span className="sr-only">bullet list</span>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        className={classNames(
          'p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600',
          editor.isActive('orderedList') ? 'text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-600' : ''
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-list-ordered"
        >
          <line x1="10" x2="21" y1="6" y2="6"></line>
          <line x1="10" x2="21" y1="12" y2="12"></line>
          <line x1="10" x2="21" y1="18" y2="18"></line>
          <path d="M4 6h1v4"></path>
          <path d="M4 10h2"></path>
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
        </svg>
        <span className="sr-only">number list</span>
      </button>
    </>
  )
}
