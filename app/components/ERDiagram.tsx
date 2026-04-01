'use client'

import { useEffect, useRef } from 'react'

interface ERDiagramProps {
  diagram: string
}

export default function ERDiagram({ diagram }: ERDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !diagram) return

    const renderDiagram = async () => {
      try {
        const mermaid = (await import('mermaid')).default

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#1e40af',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#3b82f6',
            lineColor: '#64748b',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            background: '#0f172a',
            mainBkg: '#1e293b',
            nodeBorder: '#3b82f6',
            clusterBkg: '#1e293b',
            titleColor: '#e2e8f0',
            edgeLabelBackground: '#1e293b',
            attributeBackgroundColorEven: '#1e293b',
            attributeBackgroundColorOdd: '#0f172a',
          },
          er: {
            diagramPadding: 20,
            layoutDirection: 'TB',
            minEntityWidth: 100,
            minEntityHeight: 75,
            entityPadding: 15,
            useMaxWidth: true,
          },
        })

        const id = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(id, diagram)
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      } catch (err) {
        console.error('Mermaid render error:', err)
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="color:#f87171;padding:12px;font-size:12px;font-family:monospace">
              Помилка рендеру діаграми. Синтаксис:<br><br>
              <pre style="color:#86efac">${diagram}</pre>
            </div>
          `
        }
      }
    }

    renderDiagram()
  }, [diagram])

  return (
    <div className="w-full overflow-auto">
      <div
        ref={ref}
        className="min-h-64 flex items-center justify-center"
      >
        <div className="text-gray-500 text-sm">⏳ Рендеринг діаграми...</div>
      </div>
    </div>
  )
}