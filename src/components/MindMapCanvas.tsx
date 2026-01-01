import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { useMindmap } from '../hooks/useMindmap'
import { computeRadialTree } from '../utils/layout'

export default function MindMapCanvas() {
  const { data, selectedId, setSelectedId, toggleNode, fitSignal, resetSignal } = useMindmap()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const zoomRef = useRef<any>(null)
  const [size, setSize] = useState({ width: 800, height: 600 })
  const [hovered, setHovered] = useState<{ id: string; x: number; y: number; summary?: string } | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect()
      setSize({ width: rect.width, height: rect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('transform', `translate(${size.width / 2}, ${size.height / 2})`)

    const { nodes, edges } = computeRadialTree(data as any, size.width, size.height)

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.25, 4]).on('zoom', (event) => {
      g.attr('transform', `translate(${size.width / 2 + event.transform.x}, ${size.height / 2 + event.transform.y}) scale(${event.transform.k})`)
    })
    svg.call(zoom as any)
    zoomRef.current = zoom

    // groups
    const linksG = g.append('g').attr('class', 'links').attr('stroke', '#374151').attr('fill', 'none')
    const nodesG = g.append('g').attr('class', 'nodes')

    // edges with transitions
    const link = linksG.selectAll('path').data(edges, (d: any) => `${d.source}-${d.target}`)
    link
      .join(
        (enter) => enter.append('path').attr('stroke-width', 1.5).attr('stroke-opacity', 0).attr('d', (d: any) => {
          const s = nodes.find((n) => n.id === d.source)!
          const t = nodes.find((n) => n.id === d.target)!
          return `M${s.x},${s.y} L ${t.x},${t.y}`
        }).transition().duration(500).attr('stroke-opacity', 1),
        (update) => update.transition().duration(600).attr('d', (d: any) => {
          const s = nodes.find((n) => n.id === d.source)!
          const t = nodes.find((n) => n.id === d.target)!
          return `M${s.x},${s.y} L ${t.x},${t.y}`
        }),
        (exit) => exit.transition().duration(300).attr('stroke-opacity', 0).remove()
      )

    // nodes with transitions
    const node = nodesG.selectAll<SVGGElement, any>('g.node').data(nodes, (d: any) => d.id)

    const nodeEnter = node.join(
      (enter) => {
        const ng = enter.append('g').attr('class', 'node').attr('transform', `translate(0,0)`).attr('opacity', 0).attr('cursor', 'pointer')
        ng.append('circle').attr('r', 1).attr('fill', (d: any) => colorForDepth(d.depth))
        ng.append('text').attr('x', 12).attr('dy', '0.32em').text((d: any) => d.data.title).attr('font-size', 12).attr('fill', '#E5E7EB')
        ng.transition().duration(600).attr('opacity', 1).attr('transform', (d: any) => `translate(${d.x},${d.y})`).select('circle').attr('r', 8)
        return ng
      },
      (update) => {
        update.transition().duration(600).attr('transform', (d: any) => `translate(${d.x},${d.y})`)
        update.select('circle').transition().duration(600).attr('fill', (d: any) => colorForDepth(d.depth))
        update.select('text').text((d: any) => d.data.title)
        return update
      },
      (exit) => exit.transition().duration(300).attr('opacity', 0).remove()
    )

    nodeEnter.on('mouseover', (event, d: any) => {
      setHovered({ id: d.id, x: event.clientX, y: event.clientY, summary: d.data.summary })
    }).on('mousemove', (event) => {
      setHovered((h) => (h ? { ...h, x: event.clientX, y: event.clientY } : h))
    }).on('mouseout', () => setHovered(null)).on('click', (event, d: any) => {
      setSelectedId(d.id)
      toggleNode(d.id)
    })

    // highlight selected
    nodesG.selectAll('g.node').select('circle').attr('stroke', (d: any) => (d.id === selectedId ? '#FBBF24' : 'none')).attr('stroke-width', 2)

    return () => {}
  }, [data, size, selectedId])

  // Fit-to-view behavior: respond to context signals
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current) return
    // compute nodes positions using existing layout helper
    const { nodes } = computeRadialTree(data as any, size.width, size.height)
    if (!nodes.length) return

    const minX = Math.min(...nodes.map((n) => n.x))
    const maxX = Math.max(...nodes.map((n) => n.x))
    const minY = Math.min(...nodes.map((n) => n.y))
    const maxY = Math.max(...nodes.map((n) => n.y))
    const bboxW = maxX - minX
    const bboxH = maxY - minY
    const pad = 160
    const k = Math.max(0.25, Math.min(4, Math.min((size.width - pad) / (bboxW || 1), (size.height - pad) / (bboxH || 1))))
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    const tx = -k * centerX
    const ty = -k * centerY

    const svg = d3.select(svgRef.current)
    svg.transition().duration(750).call(zoomRef.current.transform as any, d3.zoomIdentity.translate(tx, ty).scale(k))
  }, [fitSignal])

  useEffect(() => {
    if (!svgRef.current || !zoomRef.current) return
    const svg = d3.select(svgRef.current)
    svg.transition().duration(600).call(zoomRef.current.transform as any, d3.zoomIdentity.translate(0, 0).scale(1))
  }, [resetSignal])

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg ref={svgRef} width="100%" height="100%" />
      {hovered && (
        <div style={{ position: 'fixed', left: hovered.x + 12, top: hovered.y + 12 }} className="tooltip">
          <div className="font-semibold">{hovered.id}</div>
          <div className="text-xs text-gray-300">{hovered.summary}</div>
        </div>
      )}
    </div>
  )
}

function colorForDepth(depth: number) {
  const palette = ['#F97316', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']
  return palette[depth % palette.length]
}
