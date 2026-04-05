function AiChatView({ prompt, setPrompt, loading, error, messages, onAskAI }) {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-800 dark:text-white">AI Chat Bot</h1>
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
            onKeyDown={(e) => e.key === 'Enter' && !loading && prompt.trim() && onAskAI()}
          />
          <button
            onClick={onAskAI}
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
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">{msg.content}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AiChatView
