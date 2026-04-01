import { useState, useEffect } from 'react'

const STORAGE_KEY = 'db-assistant-history'
const MAX_ITEMS = 5

export function useHistory() {
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { setHistory(JSON.parse(saved)) } catch {}
    }
  }, [])

  function save(domain, dbType, result) {
    const item = {
      id: Date.now().toString(),
      domain,
      dbType,
      result,
      createdAt: new Date().toLocaleString('uk-UA'),
    }
    setHistory(prev => {
      const updated = [item, ...prev].slice(0, MAX_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  function clear() {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    history,
    showHistory,
    setShowHistory,
    save,
    clear,
  }
}