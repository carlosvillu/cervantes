import {FC, useCallback, useEffect, useState} from 'react'
import {useActionData, useFetcher, useLoaderData, useNavigation} from 'react-router-dom'
import ReactFlow, {
  Background,
  ControlButton,
  Controls,
  Edge,
  MarkerType,
  Node,
  Panel,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
  useReactFlow
} from 'reactflow'

import debug from 'debug'

import Dagre from '@dagrejs/dagre'

import {BookJSON} from '../../domain/book/Models/Book.js'
import {debounce} from '../../js/function/index.js'
import {FormCreateOrEditChapter} from '../../ui/FormCreateOrEditChapter/index.js'
import {FormNewLink} from '../../ui/FormNewLink/index.js'
import {Notification} from '../../ui/Notification/index.js'
import {OverlayWide} from '../../ui/OverlayWide/index.js'

const MAP_STATE_KEY = '__MAP_STATE_KEY__'
const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
const nodeWidth = 172
const nodeHeight = 36
const log = debug('cervantes:editor:pages:MapBook:LayoutFlow')

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
const saveMap = debounce((instance: ReactFlowInstance, bookID: string) => {
  if (!instance) return
  log('Saving Map State')
  const currentState = JSON.parse(window.localStorage.getItem(MAP_STATE_KEY) ?? '{}')
  const nextCurrentState = {
    ...currentState,
    [bookID]: instance.toObject()
  }
  window.localStorage.setItem(MAP_STATE_KEY, JSON.stringify(nextCurrentState))
}, 150)

export const LayoutFlow: FC<{}> = () => {
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>()

  const [openOverlayChapter, setOpenOVerlayChapter] = useState(false)
  const [openOverlayLink, setOpenOVerlayLink] = useState(false)

  const [chapterFrom, setChapterFrom] = useState('')
  const [chapterTo, setChapterTo] = useState('')

  const fetcherRemoveLink = useFetcher()
  const fetcherRemoveChapter = useFetcher()
  const navigation = useNavigation()
  const {book} = useLoaderData() as {book: BookJSON}
  const {success} = (useActionData() ?? {}) as {success?: boolean}
  const createdFailed = success === false
  // @ts-expect-error
  window.rfInstance = rfInstance

  useEffect(() => {
    let nodes: Node[] = initialNodes
    const mapState = JSON.parse(window.localStorage.getItem(MAP_STATE_KEY) ?? '{}') as {
      [k: string]: {
        nodes?: Node[]
        edges?: Edge[]
      }
    }
    const bookMapState = mapState[book.id!] ?? {}

    if (!bookMapState.nodes && !bookMapState.edges) {
      const layout = getLayoutedElements(initialNodes, initialEdges, {
        direction: 'TB'
      })

      nodes = layout.nodes
    }

    if (bookMapState) {
      nodes = nodes.map(node => {
        const prevNode = bookMapState.nodes?.find(n => node.id === n.id)
        if (!prevNode) return node

        return {
          ...node,
          position: prevNode.position,
          positionAbsolute: prevNode.positionAbsolute
        }
      })
    }

    setNodes(nodes)
    setEdges(initialEdges)
    window.requestAnimationFrame(() => fitView())
  }, [initialEdges, initialNodes, setEdges, setNodes, fitView, rfInstance, book])

  useEffect(() => {
    if (navigation.state === 'idle') setOpenOVerlayChapter(false)
    if (navigation.state === 'idle') setOpenOVerlayLink(false)
  }, [navigation.state])

  const alingNodes = useCallback(() => {
    const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(nodes, edges, {
      direction: 'TB'
    })
    setNodes(layoutedNodes)
    setEdges(layoutedEdges)
    window.requestAnimationFrame(() => {
      fitView()
      window.requestAnimationFrame(() => saveMap(rfInstance, book.id))
    })
  }, [edges, nodes, setEdges, setNodes, fitView, rfInstance, book])

  return (
    <>
      {createdFailed ? <Notification status="error" title="Unexpected error" /> : null}
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
          action={`/book/${book.id as string}/map`}
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
        onInit={instance => {
          setRfInstance(instance)
        }}
        onNodesChange={nodes => {
          saveMap(rfInstance, book.id)
          if (nodes.some(node => node.type === 'remove')) {
            nodes
              .filter(node => node.type === 'remove')
              .forEach(node => {
                const formData = new FormData()
                // @ts-expect-error
                formData.append('chapterID', node.id)
                formData.append('bookID', book.id!)
                formData.append('intent', 'remove-chapter')
                fetcherRemoveChapter.submit(formData, {method: 'post'})
              })
          }
          if (nodes.some(node => node.type === 'dimensions')) fitView()
          onNodesChange(nodes)
        }}
        onEdgesChange={edges => {
          saveMap(rfInstance, book.id)
          edges
            .filter(edge => edge.type === 'remove')
            .forEach(edge => {
              const formData = new FormData()
              // @ts-expect-error
              formData.append('linkID', edge.id)
              formData.append('intent', 'remove-link')
              fetcherRemoveLink.submit(formData, {method: 'post'})
            })
          onEdgesChange(edges)
        }}
        onConnect={conn => {
          setChapterFrom(conn.source!)
          setChapterTo(conn.target!)
          setOpenOVerlayLink(true)
        }}
        fitView
      >
        <Controls>
          <ControlButton onClick={alingNodes}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="currentColor">
              <path d="M7.10508 8.78991C7.45179 10.0635 8.61653 11 10 11H14C16.4703 11 18.5222 12.7915 18.9274 15.1461C20.1303 15.5367 21 16.6668 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.7334 15.7849 15.6501 16.8949 15.2101C16.5482 13.9365 15.3835 13 14 13H10C8.87439 13 7.83566 12.6281 7 12.0004V15.1707C8.16519 15.5825 9 16.6938 9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.6938 3.83481 15.5825 5 15.1707V8.82929C3.83481 8.41746 3 7.30622 3 6C3 4.34315 4.34315 3 6 3C7.65685 3 9 4.34315 9 6C9 7.26661 8.21506 8.34988 7.10508 8.78991ZM6 7C6.55228 7 7 6.55228 7 6C7 5.44772 6.55228 5 6 5C5.44772 5 5 5.44772 5 6C5 6.55228 5.44772 7 6 7ZM6 19C6.55228 19 7 18.5523 7 18C7 17.4477 6.55228 17 6 17C5.44772 17 5 17.4477 5 18C5 18.5523 5.44772 19 6 19ZM18 19C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17C17.4477 17 17 17.4477 17 18C17 18.5523 17.4477 19 18 19Z"></path>
            </svg>
          </ControlButton>
        </Controls>
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
