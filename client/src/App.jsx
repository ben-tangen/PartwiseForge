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

  async function handleLogout() {
    setError("")
    try {
      const res = await fetch('/registration/logout/', {
        method: 'GET',
        credentials: 'same-origin'
      })
      if (res.ok) {
        // Redirect to sign-in page after logout
        window.location.href = '/registration/sign_in/'
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data?.error || 'Logout failed')
      }
    } catch (e) {
      setError('Network error')
    }
  }
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 600 }}>Partwise Forge</div>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={handleLogout} style={{ padding: '6px 10px' }}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI something..."
          style={{ flex: '1 1 320px', padding: 8 }}
        />
        <button onClick={askAI} disabled={loading || !prompt.trim()}>
          {loading ? 'Thinking...' : 'Ask AI'}
        </button>
      </div>
      {error && <p style={{ color: 'crimson' }}>Error: {error}</p>}
      {/* Reply is logged to console; nothing rendered here */}
    </>
  )
}

export default App;
