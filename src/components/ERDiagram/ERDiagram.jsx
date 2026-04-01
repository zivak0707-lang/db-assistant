import React, { useEffect, useRef } from 'react'
import styles from './ERDiagram.module.css'

function sanitizeMermaidDiagram(raw) {
  if (!raw) return raw
  return raw.split('\n').map(line => {
    if (!line.includes('--') && !line.includes('..')) return line
    return line.replace(
      /([A-Za-z_][A-Za-z0-9_]*)\s+([\|o\{\}]+[-\.]{2,}[\|o\{\}]+)\s+([A-Za-z_][A-Za-z0-9_]*)/g,
      (match, left, rel, right) => `${left} ${normalizeRelationship(rel)} ${right}`
    )
  }).join('\n')
}

function normalizeRelationship(rel) {
  const isDotted = rel.includes('..')
  const line = isDotted ? '..' : '--'
  const parts = isDotted ? rel.split('..') : rel.split('--')
  const leftPart  = parts[0] || '||'
  const rightPart = parts[parts.length - 1] || '||'
  return `${parseCardinality(leftPart, 'left')}${line}${parseCardinality(rightPart, 'right')}`
}

function parseCardinality(symbols, side) {
  const hasMany     = symbols.includes('{') || symbols.includes('}')
  const hasOptional = symbols.includes('o')
  if (side === 'left') {
    if (hasMany && hasOptional) return 'o{'
    if (hasMany)               return '|{'
    if (hasOptional)           return 'o|'
    return '||'
  } else {
    if (hasMany && hasOptional) return '}o'
    if (hasMany)               return '}|'
    if (hasOptional)           return '|o'
    return '||'
  }
}

export default function ERDiagram({ diagram }) {
  const ref = useRef(null)

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
        const safeDiagram = sanitizeMermaidDiagram(diagram)
        const { svg } = await mermaid.render(id, safeDiagram)
        if (ref.current) ref.current.innerHTML = svg
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
    <div className={styles.outer}>
      <div ref={ref} className={styles.inner}>
        <div className={styles.placeholder}>⏳ Рендеринг діаграми...</div>
      </div>
    </div>
  )
}
