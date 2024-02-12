import {FC, useEffect, useState} from 'react'

import type {BodyJSON} from '../../domain/body/Models/Body'
import type {BookJSON} from '../../domain/book/Models/Book'
import type {ChapterJSON} from '../../domain/chapter/Models/Chapter'
import type {LinkJSON} from '../../domain/link/Models/Link'
import {classNames} from '../../js/css'
import previewBackground from '../../statics/previewbackground.jpg'

interface LinkClickParams {
  bookID: String
  chapterID: String
}

interface Props {
  book: BookJSON
  chapter: ChapterJSON
  rootChapter: ChapterJSON
  body: BodyJSON
  links: LinkJSON[]
  onLinkClick: (params: LinkClickParams) => void
}

const TRANSITION_DURATION = 300

export const BookPreview: FC<Props> = ({book, chapter, body, rootChapter, links, onLinkClick}) => {
  const [isVisible, setIsVisible] = useState(true)
  const bookID = String(book.id)

  const handleLinkClick = (chapterID: String) => {
    setIsVisible(false)
    setTimeout(() => {
      onLinkClick({bookID, chapterID})
      setIsVisible(true)
    }, TRANSITION_DURATION)
  }

  useEffect(() => {
    setIsVisible(false)
    const timeoutId = setTimeout(() => setIsVisible(true), TRANSITION_DURATION)
    return () => clearTimeout(timeoutId)
  }, [chapter.id])

  return (
    <div
      className={classNames(
        `relative h-full transition-opacity ease-in duration-${TRANSITION_DURATION}`,
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div
        className={'absolute inset-0 z-0 bg-cover bg-center h-full'}
        style={{backgroundImage: `url(${previewBackground})`}}
      ></div>
      <div
        className={`flex flex-col h-full relative overflow-auto hide-scrollbar font-prose transition-opacity ease-in duration-${TRANSITION_DURATION}`}
      >
        <div className="text-center text-white p-4 z-10 bg-gray-900/80">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <h2 className="text-2xl">{chapter.title}</h2>
        </div>
        <div className="flex flex-1 relative items-center justify-center	">
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-gray-900/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-800/80 to-transparent"></div>
          <div
            className="z-10 relative bg-slate-100/40 p-4 my-6 mx-2 h-fit rounded-2xl text-center text-pretty backdrop-blur-sm text-2xl"
            dangerouslySetInnerHTML={{__html: body.content.slice(1, -1)}}
          />
        </div>
        <div className="bg-gray-800/80 z-10">
          <ul className="flex flex-col justify-around items-center p-2 cursor-pointer">
            {links.map(link => {
              const linkChapter = link.toChapter
              const linkChapterId = String(linkChapter?.id)
              return (
                <li
                  key={link.id}
                  className="m-2 pointer bg-slate-100/10 text-slate-100/80  px-4 py-2 rounded-lg hover:bg-slate-100/20 hover:text-slate-100 transition-all duration-200 ease-in-out w-full text-center text-2xl backdrop-blur-sm max-w-2xl"
                  onClick={() => handleLinkClick(linkChapterId)}
                >
                  {link.kind === 'direct' ? 'Continuar' : link.body}
                </li>
              )
            })}
            {!links.length && (
              <li
                className="m-2 pointer bg-slate-100/10 text-slate-100/80  px-4 py-2 rounded-lg hover:bg-slate-100/20 hover:text-slate-100 transition-all duration-200 ease-in-out w-full text-center text-2xl backdrop-blur-sm"
                onClick={() => handleLinkClick(String(rootChapter.id))}
              >
                Volver a emperzar
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
