import {FC} from 'react'
import {useNavigate} from 'react-router-dom'

import type {BodyJSON} from '../../domain/body/Models/Body'
import type {BookJSON} from '../../domain/book/Models/Book'
import type {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import type {LinkJSON} from '../../domain/link/Models/Link'
import previewBackground from '../../statics/previewbackground.jpg'

interface Props {
  book: BookJSON
  chapter: ChapterJSON
  body: BodyJSON
  links: LinkJSON[]
}

const MOCKED_ROOT_CHAPTER = '01HP17MPVZHZR45DX06NCND4KF'

export const BookPreview: FC<Props> = ({book, chapter, body, links}) => {
  const navigate = useNavigate()
  const bookId = String(book.id)

  const handleLinkClick = (link: LinkJSON) => {
    const chapter = link.toChapter
    const chapterId = String(chapter?.id)
    const url = `/book/${bookId}/preview/${chapterId}`
    if (url) navigate(url)
  }

  return (
    <div className="flex flex-col h-full relative  font-prose">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{backgroundImage: `url(${previewBackground})`}}
      ></div>
      <div className="text-center text-white p-4 z-10 bg-gray-900/80">
        <h1 className="text-3xl font-bold">{book.title}</h1>
        <h2 className="text-2xl">{chapter.title}</h2>
      </div>
      <div className="flex flex-1 overflow-auto relative items-center justify-center	">
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-800/80 to-transparent"></div>
        <div
          className="z-10 relative bg-slate-100/40 p-4 m-4 h-fit rounded-lg text-center text-pretty backdrop-blur-sm text-2xl"
          dangerouslySetInnerHTML={{__html: body.content.slice(1, -1)}}
        />
      </div>
      <div className="bg-gray-800/80 z-10">
        <ul className="flex flex-col justify-around items-center p-2 cursor-pointer">
          {links.map(link => {
            return (
              <li
                key={link.id}
                className="m-2 pointer bg-slate-100/10 text-slate-100/80  px-4 py-2 rounded-lg hover:bg-slate-100/20 hover:text-slate-100 transition-all duration-200 ease-in-out w-full text-center text-2xl"
                onClick={() => handleLinkClick(link)}
              >
                {link.body}
              </li>
            )
          })}
          {!links.length && (
            <li
              className="m-2 pointer bg-slate-100/10 text-slate-100/80  px-4 py-2 rounded-lg hover:bg-slate-100/20 hover:text-slate-100 transition-all duration-200 ease-in-out w-full text-center text-2xl"
              onClick={() => navigate(`/book/${bookId}/preview/${MOCKED_ROOT_CHAPTER}`)}
            >
              Volver a emperzar
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}