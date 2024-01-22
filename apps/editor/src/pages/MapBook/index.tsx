// @ts-nocheck
import React, {useCallback} from 'react'
import ReactFlow, {
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from 'reactflow'

import Dagre from '@dagrejs/dagre'

import {initialEdges, initialNodes} from './nodes-edges.js'

import 'reactflow/dist/style.css'

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({rankdir: options.direction})

  edges.forEach(edge => g.setEdge(edge.source, edge.target))
  nodes.forEach(node => g.setNode(node.id, node))

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
  const {fitView} = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onLayout = useCallback(
    (direction = 'TB') => {
      const layouted = getLayoutedElements(nodes, edges, {direction})

      setNodes([...layouted.nodes])
      setEdges([...layouted.edges])

      window.requestAnimationFrame(() => {
        fitView()
      })
    },
    [nodes, edges]
  )

  return (
    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
      <Panel position="top-right">
        <button onClick={() => onLayout('TB')}>vertical layout</button>
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </Panel>
      <Controls />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  )
}

export const Component = () => {
  return (
    <div style={{width: 'calc(100vw - 336px)', height: 'calc(100vh - 180px)'}}>
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    </div>
  )
}
