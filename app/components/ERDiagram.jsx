'use client'

import { useEffect, useRef } from 'react'
import s from './ERDiagram.module.css'

/**
 * Mermaid erDiagram підтримує лише конкретні типи зв'язків.
 * AI (Groq) часто генерує невалідні комбінації на зразок }|o--|{
 * Ця функція нормалізує будь-який relationship до валідного Mermaid синтаксису.
 *
 * Валідні токени: ||, |{, }|, |o, o|, o{, }o
 * Валідний формат: ENTITY REL--REL ENTITY : "label"
 */
function sanitizeMermaidDiagram(raw) {
  if (!raw) return raw

  // Нормалізуємо кожен рядок зі зв'язком
  return raw.split('\n').map(line => {
    // Рядок зі зв'язком містить -- або ..
    if (!line.includes('--') && !line.includes('..')) return line

    // Замінюємо всю послідовність між двома іменами сутностей
    // Патерн: WORD <будь-який набір символів зв'язку> WORD : label
    return line.replace(
      /([A-Za-z_][A-Za-z0-9_]*)\s+([\|o\{\}]+[-\.]{2,}[\|o\{\}]+)\s+([A-Za-z_][A-Za-z0-9_]*)/g,
      (match, left, rel, right) => {
        const normalized = normalizeRelationship(rel)
        return `${left} ${normalized} ${right}`
      }
    )
  }).join('\n')
}

/**
 * Перетворює будь-яку комбінацію символів зв'язку на валідний Mermaid токен.
 * Визначає кардинальність з обох боків і тип лінії (-- або ..)
 */
function normalizeRelationship(rel) {
  const isDotted = rel.includes('..')
  const line = isDotted ? '..' : '--'

  // Витягуємо ліву та праву частини (до і після -- або ..)
  const parts = isDotted ? rel.split('..') : rel.split('--')
  const leftPart  = parts[0] || '||'
  const rightPart = parts[parts.length - 1] || '||'

  const leftToken  = parseCardinality(leftPart, 'left')
  const rightToken = parseCardinality(rightPart, 'right')

  return `${leftToken}${line}${rightToken}`
}

/**
 * Розпізнає кардинальність з набору символів.
 * Повертає валідний Mermaid токен: ||, |{, }|, |o, o|, o{, }o
 */
function parseCardinality(symbols, side) {
  const hasMany   = symbols.includes('{') || symbols.includes('}')
  const hasOptional = symbols.includes('o')

  if (side === 'left') {
    // Ліва частина — читаємо зліва направо
    if (hasMany && hasOptional) return 'o{'
    if (hasMany)               return '|{'
    if (hasOptional)           return 'o|'
    return '||'
  } else {
    // Права частина — читаємо справа наліво
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
        // Санітайземо діаграму перед рендером — виправляємо невалідний AI-синтаксис
        const safeDiagram = sanitizeMermaidDiagram(diagram)
        const { svg } = await mermaid.render(id, safeDiagram)
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
    <div className={s.outer}>
      <div ref={ref} className={s.inner}>
        <div className={s.placeholder}>⏳ Рендеринг діаграми...</div>
      </div>
    </div>
  )
}