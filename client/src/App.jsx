import { useState } from 'react'
import favicon from '/favicon.png'

function App() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [messages, setMessages] = useState([])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Partwise Forge
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Powered by AI</p>
        </div>

        {/* Input Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-3 items-center flex-wrap">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI something..."
              className="flex-1 min-w-[320px] px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && !loading && prompt.trim() && askAI()}
            />
            <button 
              onClick={askAI} 
              disabled={loading || !prompt.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
            >
              {loading ? 'Thinking...' : 'Ask AI'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
              Error: {error}
            </div>
          )}
        </div>

        {/* Conversation History */}
        {messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-100 dark:bg-blue-900/30 ml-8'
                    : 'bg-gray-100 dark:bg-gray-700 mr-8'
                }`}
              >
                <div className="font-semibold mb-1 text-sm text-gray-600 dark:text-gray-400">
                  {msg.role === 'user' ? '👤 You' : '🤖 AI'}
                </div>
                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App;
