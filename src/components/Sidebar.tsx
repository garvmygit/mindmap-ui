import React, { useMemo, useState } from 'react'
import { useMindmap } from '../hooks/useMindmap'

export default function Sidebar() {
  const { data, selectedId, setSelectedId, updateNode } = useMindmap()
  const [editing, setEditing] = useState(false)

  function find(node: any, id: string | null): any {
    if (!id) return null
    if (node.id === id) return node
    if (!node.children) return null
    for (const c of node.children) {
      const r = find(c, id)
      if (r) return r
    }
    return null
  }

  const selected = useMemo(() => (selectedId ? find(data, selectedId) : null), [selectedId, data])

  if (!selected) return (
    <div className="p-4">
      <h2 className="text-sm text-gray-400">No node selected</h2>
      <p className="text-xs text-gray-500 mt-2">Click a node on the map to view details.</p>
    </div>
  )

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{selected.title}</h2>
        <div className="flex gap-2">
          <button onClick={() => setEditing((s) => !s)} className="text-sm text-gray-300">{editing ? 'Done' : 'Edit'}</button>
          <button onClick={() => setSelectedId(null)} className="text-sm text-red-400">Close</button>
        </div>
      </div>

      {editing ? (
        <div className="mt-4 space-y-2">
          <label className="block text-xs text-gray-400">Title</label>
          <input className="w-full p-2 bg-gray-800 rounded" defaultValue={selected.title} onBlur={(e) => updateNode(selected.id, { title: e.target.value })} />
          <label className="block text-xs text-gray-400">Description</label>
          <textarea className="w-full p-2 bg-gray-800 rounded" defaultValue={selected.description} onBlur={(e) => updateNode(selected.id, { description: e.target.value })} />
        </div>
      ) : (
        <div className="mt-4 text-sm text-gray-200 space-y-2">
          <div><strong className="text-gray-300">Summary:</strong> <span className="text-gray-400">{selected.summary}</span></div>
          <div><strong className="text-gray-300">Description:</strong></div>
          <p className="text-gray-400 whitespace-pre-wrap">{selected.description}</p>
          {selected.metadata && (
            <div className="mt-3 text-xs text-gray-400">
              <strong>Metadata</strong>
              <pre className="mt-1 text-xs text-gray-300 bg-gray-900 p-2 rounded">{JSON.stringify(selected.metadata, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
