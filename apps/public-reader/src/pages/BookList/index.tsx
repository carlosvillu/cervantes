import {FC, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

interface Book {
  id: string
  title: string
  summary: string
  rootChapterID: string
}

export const Component: FC = () => {
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    fetch('/api/public/books')
      .then(response => response.json())
      .then(data => setBooks(data.books))
  }, [])

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Published Books</h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {books.map(book => (
            <div key={book.id} className="group relative">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img
                  src={`https://picsum.photos/seed/${book.id}/400/600`}
                  alt={book.title}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link to={`/read/${book.id}/${book.rootChapterID}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {book.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{book.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
