import {FC, useEffect, useState} from 'react'
import {useActionData, useFetcher, useLoaderData, useNavigation} from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  Node,
  Panel,
  useEdgesState,
  useNodesState,
  useReactFlow
} from 'reactflow'

import Dagre from '@dagrejs/dagre'

import {BookJSON} from '../../domain/book/Models/Book.js'
import {FormCreateOrEditChapter} from '../../ui/FormCreateOrEditChapter/index.js'
import {FormNewLink} from '../../ui/FormNewLink/index.js'
import {Notification} from '../../ui/Notification/index.js'
import {OverlayWide} from '../../ui/OverlayWide/index.js'

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
  const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(initialNodes, initialEdges, {
    direction: 'TB'
  })
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges)

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
    if (navigation.state === 'idle') setOpenOVerlayChapter(false)
    if (navigation.state === 'idle') setOpenOVerlayLink(false)
  }, [navigation.state])

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
        onNodesChange={nodes => {
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
