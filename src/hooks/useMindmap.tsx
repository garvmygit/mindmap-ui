import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import rawData from '../../data/mindmap.json'

export type MindNode = {
  id: string
  title: string
  summary?: string
  description?: string
  metadata?: Record<string, any>
  children?: MindNode[]
}

type Context = {
  data: MindNode
  setData: (d: MindNode) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  toggleNode: (id: string) => void
  expandAll: () => void
  collapseAll: () => void
  updateNode: (id: string, patch: Partial<MindNode>) => void
  requestFitView: () => void
  requestResetView: () => void
  fitSignal: number
  resetSignal: number
}

const MindmapContext = createContext<Context | undefined>(undefined)

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v))
}

function findById(node: MindNode, id: string): MindNode | null {
  if (node.id === id) return node
  if (!node.children) return null
  for (const c of node.children) {
    const r = findById(c, id)
    if (r) return r
  }
  return null
}

function mapTree(node: MindNode, fn: (n: MindNode) => MindNode): MindNode {
  const copy = fn({ ...node })
  if (copy.children) {
    copy.children = copy.children.map((c) => mapTree(c, fn))
  }
  return copy
}

export function MindmapProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<MindNode>(() => deepClone(rawData as MindNode))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [fitSignal, setFitSignal] = useState(0)
  const [resetSignal, setResetSignal] = useState(0)

  // Add collapsed flag to nodes in-memory via metadata._collapsed to control rendering
  useEffect(() => {
    setData((d) => mapTree(d, (n) => ({ ...n, metadata: { ...n.metadata } })))
  }, [])

  function toggleNode(id: string) {
    setData((prev) =>
      mapTree(prev, (n) => {
        if (n.id === id) {
          const meta = { ...n.metadata }
          meta._collapsed = !meta._collapsed
          return { ...n, metadata: meta }
        }
        return n
      })
    )
  }

  function expandAll() {
    setData((prev) => mapTree(prev, (n) => ({ ...n, metadata: { ...n.metadata, _collapsed: false } })))
  }

  function collapseAll() {
    setData((prev) => mapTree(prev, (n) => ({ ...n, metadata: { ...n.metadata, _collapsed: true } })))
  }

  function updateNode(id: string, patch: Partial<MindNode>) {
    setData((prev) =>
      mapTree(prev, (n) => {
        if (n.id === id) return { ...n, ...patch }
        return n
      })
    )
  }

  function requestFitView() {
    setFitSignal((s) => s + 1)
  }

  function requestResetView() {
    setResetSignal((s) => s + 1)
  }

  const value = useMemo(
    () => ({ data, setData, selectedId, setSelectedId, toggleNode, expandAll, collapseAll, updateNode, requestFitView, requestResetView, fitSignal, resetSignal }),
    [data, selectedId, fitSignal, resetSignal]
  )

  return <MindmapContext.Provider value={value}>{children}</MindmapContext.Provider>
}

export function useMindmap() {
  const ctx = useContext(MindmapContext)
  if (!ctx) throw new Error('useMindmap must be used within MindmapProvider')
  return ctx
}
