import React from 'react'
import MindMapCanvas from './components/MindMapCanvas'
import Sidebar from './components/Sidebar'
import Toolbar from './components/Toolbar'
import { MindmapProvider } from './hooks/useMindmap'

export default function App() {
  return (
    <MindmapProvider>
      <div className="h-screen w-screen flex flex-col">
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
          <h1 className="text-lg font-semibold">Mindmap</h1>
          <Toolbar />
        </header>
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative">
            <MindMapCanvas />
          </div>
          <aside className="w-96 border-l border-gray-800 bg-gray-950">
            <Sidebar />
          </aside>
        </main>
      </div>
    </MindmapProvider>
  )
}
