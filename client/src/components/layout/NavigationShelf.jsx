function NavigationShelf({ isOpen, activeView, onSelectView, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px]"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 border-r border-white/60 bg-white/95 shadow-2xl shadow-slate-950/10 backdrop-blur-xl transition-transform duration-300 ease-out dark:border-gray-800 dark:bg-gray-950/95 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Navigation shelf"
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
            Menu
          </div>

          <nav className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onSelectView('ai-chat')}
              className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${activeView === 'ai-chat' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'}`}
            >
              AI chat bot
            </button>
            <button
              type="button"
              onClick={() => onSelectView('tutor')}
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
    </>
  )
}

export default NavigationShelf
