import * as d3 from 'd3'
import type { MindNode } from '../hooks/useMindmap'

export type PositionedNode = {
  id: string
  x: number
  y: number
  depth: number
  data: MindNode
}

export type Edge = { source: string; target: string }

export function computeRadialTree(rootData: MindNode, width: number, height: number) {
  const radius = Math.min(width, height) / 2 - 80
  const root = d3.hierarchy(rootData, (d: any) => {
    // respect _collapsed metadata
    if (d.metadata && d.metadata._collapsed) return null
    return d.children
  })

  const tree = d3.tree<MindNode>().size([2 * Math.PI, radius])
  const treeRoot = tree(root)

  const nodes: PositionedNode[] = []
  const edges: Edge[] = []

  treeRoot.descendants().forEach((d) => {
    const r = d.y
    const angle = d.x - Math.PI / 2
    const x = r * Math.cos(angle)
    const y = r * Math.sin(angle)
    nodes.push({ id: d.data.id, x, y, depth: d.depth, data: d.data })
    if (d.parent) edges.push({ source: d.parent.data.id, target: d.data.id })
  })

  return { nodes, edges }
}
