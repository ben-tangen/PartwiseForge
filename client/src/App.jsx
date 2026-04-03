import { useState } from 'react'

function App() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [messages, setMessages] = useState([])
  const [activeView, setActiveView] = useState('ai-chat')
  const [isShelfOpen, setIsShelfOpen] = useState(false)

  async function askAI() {
    setError("")
    if (!prompt.trim()) return
    
    // Add user message to conversation history
    const userMessage = { role: "user", content: prompt }
    const updatedMessages = [...messages, userMessage]
    
    setLoading(true)
    setPrompt("") // Clear input
    
    try {
      const res = await fetch('/api/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ messages: updatedMessages })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Request failed')
      } else {
        // Add assistant reply to conversation history
        const assistantMessage = { role: "assistant", content: data?.reply || '' }
        setMessages([...updatedMessages, assistantMessage])
        
        // Log the full conversation to console
        console.log('AI reply:', data?.reply || '')
        console.log('Full conversation:', [...updatedMessages, assistantMessage])
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
    setActiveView(view)
    closeShelf()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setIsShelfOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Open menu"
            aria-expanded={isShelfOpen}
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
            </span>
          </button>

          <div className="text-center">
            <div className="text-lg font-semibold tracking-wide">Partwise Forge</div>
            <div className="text-xs uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
              PC learning workspace
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Logout
          </button>
        </div>
      </header>

      {isShelfOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px]"
          onClick={closeShelf}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 border-r border-white/60 bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-transform duration-300 ease-out dark:border-gray-800 dark:bg-gray-950/95 ${isShelfOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Navigation shelf"
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
            Menu
          </div>

          <nav className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => selectView('ai-chat')}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeView === 'ai-chat' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'}`}
            >
              AI chat bot
            </button>
            <button
              type="button"
              onClick={() => selectView('tutor')}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeView === 'tutor' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'}`}
            >
              Partwise Tutor
            </button>
          </nav>

          <div className="mt-auto rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
            The shelf stays available from every screen.
          </div>
        </div>
      </aside>

      <main className="mx-auto max-w-5xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        {activeView === 'ai-chat' ? (
          <section className="space-y-6">
            <div className="text-center">
              <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white">
                AI Chat Bot
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Ask questions about PC parts, builds, and listings.</p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask AI something..."
                  className="input input-bordered min-w-[240px] flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && !loading && prompt.trim() && askAI()}
                />
                <button
                  onClick={askAI}
                  disabled={loading || !prompt.trim()}
                  className={`btn btn-primary ${loading || !prompt.trim() ? 'btn-disabled opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Thinking...' : 'Ask AI'}
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-400 bg-red-100 p-3 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                  Error: {error}
                </div>
              )}
            </div>

            {messages.length > 0 && (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 ${
                      msg.role === 'user'
                        ? 'ml-6 bg-blue-100 dark:bg-blue-900/30'
                        : 'mr-6 bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <div className="mb-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      {msg.role === 'user' ? 'You' : 'AI'}
                    </div>
                    <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                Partwise Tutor
              </div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Learn how to build PCs</h1>
              <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
                This area will become the guided tutor experience for selecting compatible parts and assembling a build step by step.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="font-semibold text-gray-900 dark:text-white">1. Part selection</div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Learn what each component does and how parts fit together.</div>
                </div>
                <div className="rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-900/20">
                  <div className="font-semibold text-gray-900 dark:text-white">2. Assembly</div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Follow the correct order for putting the PC together.</div>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                  <div className="font-semibold text-gray-900 dark:text-white">3. Hints</div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Get feedback when an answer or step is incorrect.</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-dashed border-gray-300 bg-white/60 p-6 text-sm text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                Status
              </div>
              <p>The tutor shell is ready. The menu shelf and page layout now support switching between the AI chat and tutor surfaces.</p>
            </div>
          </section>
        )}
      </main>
      </div>
  )
}

export default App;
