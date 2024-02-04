import {ActionFunctionArgs, LoaderFunctionArgs, useLoaderData} from 'react-router-dom'
import {MarkerType, ReactFlowProvider} from 'reactflow'

import {LinkJSON} from '../../domain/link/Models/Link.js'
import {Links} from '../../domain/link/Models/Links.js'
import {LayoutFlow} from './LayoutFlow.js'

import 'reactflow/dist/style.css'
import './index.css'

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID} = params as {bookID: string}
  const book = await window.domain.FindByIDBookUseCase.execute({id: bookID})
  const user = await window.domain.CurrentUserUseCase.execute()
  const chapters = await window.domain.GetAllChapterUseCase.execute({bookID})
  const linksMatrix: Links[] = await Promise.all(
    chapters.ids().map(id => {
      return window.domain.GetAllLinkUseCase.execute({from: id})
    })
  )

  const markerEnd = {
    type: MarkerType.Arrow,
    width: 20,
    height: 20
  }

  const edges = linksMatrix
    .filter(links => links.links.length)
    .map(l => l.toJSON().links)
    .flat(Infinity)
    .map(link => {
      link = link as unknown as LinkJSON
      return {markerEnd, id: link.id, source: link.from, target: link.to, animated: true, label: link.body}
    })

  const nodes = chapters.toJSON().chapters.map((chapter, index) => {
    return {id: chapter.id, data: {label: chapter.title}, position: {x: 0, y: 100 * index}}
  })

  return {edges, nodes, book: book.toJSON(), user: user.toJSON(), chapters: chapters.toJSON().chapters}
}

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const {intent} = Object.fromEntries(formData) as {
    intent: 'new-link' | 'new-chapter' | 'remove-link' | 'remove-chapter'
  }

  if (intent === 'remove-chapter') {
    const {chapterID, bookID} = Object.fromEntries(formData) as {
      chapterID: string
      bookID: string
    }

    await window.domain.RemoveByIDChapterUseCase.execute({id: chapterID, bookID})

    return {success: true}
  }

  if (intent === 'remove-link') {
    const {linkID} = Object.fromEntries(formData) as {
      linkID: string
    }

    await window.domain.RemoveByIDLinkUseCase.execute({id: linkID})

    return {success: true}
  }

  if (intent === 'new-link') {
    const {id, bookID, userID, chapterID, kind, body, to} = Object.fromEntries(formData) as {
      intent: string
      id: string
      from: string
      to: string
      body: string
      chapterID: string
      kind: string
      bookID: string
      userID: string
    }

    const link = await window.domain.CreateLinkUseCase.execute({id, from: chapterID, to, body, bookID, userID, kind})

    if (link.isEmpty()) return {success: false}

    return {success: true}
  }

  if (intent === 'new-chapter') {
    const {id, userID, bookID, title, summary} = Object.fromEntries(formData) as {
      bookID: string
      id: string
      userID: string
      summary: string
      title: string
    }
    const chapter = await window.domain.CreateChapterUseCase.execute({bookID, id, summary, title, userID})

    if (chapter.isEmpty()) return {success: false}

    return {success: true}
  }
}

export const Component = () => {
  const {nodes} = useLoaderData() as {nodes: Array<Map<string, unknown>>}

  if (nodes.length === 0) return null

  if (nodes)
    return (
      <>
        <div
          style={{width: 'calc(100dvw - var(--adjust-map-width))', height: 'calc(100dvh - var(--adjust-map-heigth))'}}
        >
          <ReactFlowProvider>
            <LayoutFlow />
          </ReactFlowProvider>
        </div>
      </>
    )
}
