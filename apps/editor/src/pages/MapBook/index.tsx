import {useEffect} from 'react'
import {LoaderFunctionArgs, useLoaderData} from 'react-router-dom'
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

import {LinkJSON} from '../../domain/link/Models/Link.js'
import {Links} from '../../domain/link/Models/Links.js'

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
  const [nodes, , onNodesChange] = useNodesState(layoutedNodes)
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges)

  useEffect(() => {
    window.requestAnimationFrame(() => {
      fitView()
    })
  }, []) // eslint-disable-line 

  return (
    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
      <Controls />
      {/* @ts-expect-error */}
      <Background variant="dots" gap={12} size={1} />
      <Panel position="top-right">
        <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Create Chapter
        </button>
      </Panel>
    </ReactFlow>
  )
}

export const loader = async ({params}: LoaderFunctionArgs) => {
  const {bookID} = params as {bookID: string}
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
  return {edges, nodes}
}

export const Component = () => {
  const {nodes} = useLoaderData() as {nodes: Array<Map<string, unknown>>}

  if (nodes.length === 0) return null

  if (nodes)
    return (
      <div style={{width: 'calc(100dvw - var(--adjust-map-width))', height: 'calc(100dvh - var(--adjust-map-heigth))'}}>
        <ReactFlowProvider>
          <LayoutFlow />
        </ReactFlowProvider>
      </div>
    )
}
