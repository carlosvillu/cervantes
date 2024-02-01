import {useEffect, useState} from 'react'
import {ActionFunctionArgs, LoaderFunctionArgs, useActionData, useLoaderData} from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from 'reactflow'

import Dagre from '@dagrejs/dagre'

import {BookJSON} from '../../domain/book/Models/Book.js'
import {LinkJSON} from '../../domain/link/Models/Link.js'
import {Links} from '../../domain/link/Models/Links.js'
import {FormCreateOrEditChapter} from '../../ui/FormCreateOrEditChapter/index.js'
import {FormNewLink} from '../../ui/FormNewLink/index.js'
import {Notification} from '../../ui/Notification/index.js'
import {OverlayWide} from '../../ui/OverlayWide/index.js'

import 'reactflow/dist/style.css'
import './index.css'

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
const nodeWidth = 172
const nodeHeight = 36

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: {direction: 'TB' | 'LR'}) => {
  g.setGraph({rankdir: options.direction})

  edges.forEach(edge => g.setEdge(edge.source, edge.target))
  nodes.forEach(node => g.setNode(node.id, {width: nodeWidth, height: nodeHeight}))

  Dagre.layout(g)

  return {
    nodes: nodes.map(node => {
      const {x, y} = g.node(node.id)

      return {...node, position: {x, y}}
    }),
    edges
  }
}

const LayoutFlow = () => {
  const {edges: initialEdges, nodes: initialNodes} = useLoaderData() as {
    nodes: Array<{
      id: string
      data: {label: string}
      position: {x: number; y: number}
    }>
    edges: Array<{
      markerEnd: {
        type: MarkerType
        width: number
        height: number
      }
      id: string
      source: string
      target: string
      animated: boolean
    }>
  }

  const {fitView} = useReactFlow()
  const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(initialNodes, initialEdges, {
    direction: 'TB'
  })
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

  const [openOverlayChapter, setOpenOVerlayChapter] = useState(false)
  const [openOverlayLink, setOpenOVerlayLink] = useState(false)

  const [chapterFrom, setChapterFrom] = useState('')
  const [chapterTo, setChapterTo] = useState('')

  const {book} = useLoaderData() as {book: BookJSON}
  const {success} = (useActionData() ?? {}) as {success?: boolean}
  const createdFailed = success === false

  useEffect(() => {
    window.requestAnimationFrame(() => {
      fitView()
    })
  }, [])// eslint-disable-line 

  useEffect(() => {
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
  }, [layoutedEdges, layoutedEdges])// eslint-disable-line 

  useEffect(() => {
    if (success === true) setOpenOVerlayChapter(false)
    if (success === true) setOpenOVerlayLink(false)
  }, [success])

  return (
    <>
      {createdFailed ? <Notification status="error" title="Error creating the chapter" /> : null}
      <OverlayWide open={openOverlayChapter} onClose={force => setOpenOVerlayChapter(force ?? !openOverlayChapter)}>
        <FormCreateOrEditChapter
          action={`/book/${book.id as string}/map`}
          onClickCancel={() => {
            ;(document.getElementById('form-new-chapter') as HTMLFormElement).reset()
            setOpenOVerlayChapter(false)
          }}
        />
      </OverlayWide>
      <OverlayWide open={openOverlayLink} onClose={force => setOpenOVerlayLink(force ?? !openOverlayLink)}>
        <FormNewLink
          from={chapterFrom}
          to={chapterTo}
          onClickCancel={() => {
            ;(document.getElementById('form-new-link') as HTMLFormElement).reset()
            setOpenOVerlayLink(false)
          }}
        />
      </OverlayWide>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={nodes => {
          if (nodes.some(node => node.type === 'dimensions')) fitView()
          onNodesChange(nodes)
        }}
        onEdgesChange={edges => {
          onEdgesChange(edges)
        }}
        onConnect={conn => {
          setChapterFrom(conn.source!)
          setChapterTo(conn.target!)
          setOpenOVerlayLink(true)
        }}
        fitView
      >
        <Controls />
        {/* @ts-expect-error */}
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-right">
          <button
            onClick={() => {
              setOpenOVerlayChapter(true)
            }}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Chapter
          </button>
        </Panel>
      </ReactFlow>
    </>
  )
}

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
    intent: 'tooglePublishStatus' | 'new-chapter'
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
