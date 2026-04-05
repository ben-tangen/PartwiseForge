function TopBar({ isShelfOpen, onToggleShelf, onLogout }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onToggleShelf}
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
          onClick={onLogout}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default TopBar
