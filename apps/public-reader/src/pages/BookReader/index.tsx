import {FC, useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {BookPreview} from '../../ui/BookPreview'

interface Book {
  id: string
  title: string
  summary: string
  rootChapterID: string
}

interface Chapter {
  id: string
  title: string
}

interface Body {
  content: string
}

interface Link {
  id: string
  body: string
  kind: string
  toChapter: {
    id: string
  }
}

interface ChapterData {
  chapter: Chapter
  body: Body
}

export const Component: FC = () => {
  const {bookID, chapterID} = useParams<{bookID: string; chapterID: string}>()
  const navigate = useNavigate()

  const [book, setBook] = useState<Book | null>(null)
  const [chapterData, setChapterData] = useState<ChapterData | null>(null)
  const [links, setLinks] = useState<Link[]>([])

  useEffect(() => {
    if (bookID) {
      fetch(`/api/public/books/${bookID}`)
        .then(response => response.json())
        .then(data => setBook(data))
    }
  }, [bookID])

  useEffect(() => {
    if (bookID && chapterID) {
      fetch(`/api/public/books/${bookID}/chapters/${chapterID}`)
        .then(response => response.json())
        .then(data => setChapterData(data))

      fetch(`/api/public/books/${bookID}/chapters/${chapterID}/links`)
        .then(response => response.json())
        .then(data => setLinks(data.links))
    }
  }, [bookID, chapterID])

  const onLinkClick = ({bookID, chapterID}: {bookID: string; chapterID: string}) => {
    navigate(`/read/${bookID}/${chapterID}`)
  }

  if (!book || !chapterData) {
    return <div>Loading...</div>
  }

  return (
    <main className="h-full fixed w-full bg-gray-900">
      <BookPreview
        book={book}
        chapter={chapterData.chapter}
        body={chapterData.body}
        links={links}
        onLinkClick={onLinkClick}
      />
    </main>
  )
}
