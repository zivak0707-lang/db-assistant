'use client'

import { RefObject } from 'react'
import ERDiagram from './ERDiagram'

interface TabERProps {
  diagram: string
  erRef: RefObject<HTMLDivElement>
  onDownload: () => void
}

export default function TabER({ diagram, erRef, onDownload }: TabERProps) {
  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={onDownload}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md transition-colors"
        >
          🖼 Зберегти SVG
        </button>
      </div>
      <div ref={erRef}>
        <ERDiagram diagram={diagram} />
      </div>
    </div>
  )
}