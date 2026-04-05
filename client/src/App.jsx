import { useEffect, useState } from 'react'
import TopBar from './components/layout/TopBar'
import NavigationShelf from './components/layout/NavigationShelf'
import AiChatView from './components/chat/AiChatView'
import TutorExperience from './components/tutor/TutorExperience'

function getViewFromHash() {
  const hash = window.location.hash.replace(/^#/, '')
  if (hash.startsWith('tutor')) {
    return 'tutor'
  }

  return 'ai-chat'
}

function App() {
  const [activeView, setActiveView] = useState(() => getViewFromHash())
  const [isShelfOpen, setIsShelfOpen] = useState(false)

  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    function handleHashChange() {
      setActiveView(getViewFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  async function askAI() {
    setError('')
    if (!prompt.trim()) return

    const userMessage = { role: 'user', content: prompt }
    const updatedMessages = [...messages, userMessage]

    setLoading(true)
    setPrompt('')

    try {
      const res = await fetch('/api/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ messages: updatedMessages }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Request failed')
      } else {
        const assistantMessage = { role: 'assistant', content: data?.reply || '' }
        setMessages([...updatedMessages, assistantMessage])
      }
    } catch (e) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/registration/logout/', {
        method: 'GET',
        credentials: 'same-origin',
      })
    } finally {
      window.location.assign('/registration/sign_in/')
    }
  }

  function closeShelf() {
    setIsShelfOpen(false)
  }

  function selectView(view) {
    if (view === 'tutor') {
      window.location.hash = 'tutor'
    } else {
      window.location.hash = 'ai-chat'
    }
    closeShelf()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 text-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 dark:text-gray-100">
      <TopBar isShelfOpen={isShelfOpen} onToggleShelf={() => setIsShelfOpen((prev) => !prev)} onLogout={handleLogout} />
      <NavigationShelf
        isOpen={isShelfOpen}
        activeView={activeView}
        onSelectView={selectView}
        onClose={closeShelf}
      />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        {activeView === 'ai-chat' ? (
          <AiChatView
            prompt={prompt}
            setPrompt={setPrompt}
            loading={loading}
            error={error}
            messages={messages}
            onAskAI={askAI}
          />
        ) : (
          <TutorExperience />
        )}
      </main>
    </div>
  )
}

export default App
