import React from 'react'
import { useMindmap } from '../hooks/useMindmap'

export default function Toolbar() {
  const { expandAll, collapseAll, requestFitView, requestResetView } = useMindmap()

  return (
    <div className="flex gap-2">
      <button onClick={expandAll} className="px-3 py-1 bg-gray-800 rounded">Expand All</button>
      <button onClick={collapseAll} className="px-3 py-1 bg-gray-800 rounded">Collapse All</button>
      <button onClick={() => requestFitView()} className="px-3 py-1 bg-gray-800 rounded">Fit View</button>
      <button onClick={() => requestResetView()} className="px-3 py-1 bg-gray-800 rounded">Reset View</button>
    </div>
  )
}
