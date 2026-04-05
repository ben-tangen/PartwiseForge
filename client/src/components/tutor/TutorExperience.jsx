import { useEffect, useMemo, useState } from 'react'
import { gradeTutorAnswer, loadTutorProgress, saveTutorProgress } from '../../services/tutorApi'
import {
  getTutorOptions,
  tutorGradingFlow,
  tutorOverviewCards,
  tutorPartOrder,
  tutorParts,
} from '../../data/tutorData'
import { evaluateTutorSelection } from '../../utils/tutorCompatibility'

function normalizePersistedStackItem(item) {
  if (typeof item === 'string') {
    return {
      partKey: item,
      optionKey: item,
      label: item,
      partLabel: item,
      summary: '',
      attributes: {},
      compatible: true,
    }
  }

  if (!item || typeof item !== 'object') {
    return null
  }

  if (typeof item.partKey !== 'string' || typeof item.label !== 'string') {
    return null
  }

  return {
    partKey: item.partKey,
    optionKey: String(item.optionKey || item.partKey),
    label: item.label,
    partLabel: String(item.partLabel || item.label),
    summary: String(item.summary || ''),
    attributes: item.attributes && typeof item.attributes === 'object' ? item.attributes : {},
    compatible: Boolean(item.compatible ?? true),
  }
}

function getTutorRoute() {
  const hash = window.location.hash.replace(/^#/, '')
  const [root, partKey, step] = hash.split('/')

  if (root !== 'tutor') {
    return { stage: 'overview', partKey: null }
  }

  if (partKey === 'complete' || step === 'complete') {
    return { stage: 'complete', partKey: null }
  }

  if (step === 'complete') {
    return { stage: 'complete', partKey: null }
  }

  if (partKey && step === 'selection') {
    return { stage: 'selection', partKey }
  }

  if (partKey && step === 'lesson') {
    return { stage: 'lesson', partKey }
  }

  if (root === 'tutor' && partKey === 'begin') {
    return { stage: 'overview', partKey: null }
  }

  return { stage: 'overview', partKey: null }
}

function buildTutorHash(stage, partKey = null) {
  if (stage === 'overview') {
    return '#tutor'
  }

  if (stage === 'complete') {
    return '#tutor/complete'
  }

  if (partKey) {
    return `#tutor/${partKey}/${stage}`
  }

  return '#tutor'
}

function TutorExperience() {
  const [isStarted, setIsStarted] = useState(false)
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [flowStage, setFlowStage] = useState('lesson')
  const [q1Answer, setQ1Answer] = useState('')
  const [q1Status, setQ1Status] = useState('idle')
  const [q1Feedback, setQ1Feedback] = useState('')
  const [selectedOptionKey, setSelectedOptionKey] = useState('')
  const [selectionStatus, setSelectionStatus] = useState('idle')
  const [selectionFeedback, setSelectionFeedback] = useState('')
  const [selectionReasons, setSelectionReasons] = useState([])
  const [buildStack, setBuildStack] = useState([])
  const [loadingProgress, setLoadingProgress] = useState(true)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function run() {
      try {
        const data = await loadTutorProgress()
        if (!isMounted) {
          return
        }

        const persistedStack = Array.isArray(data.buildStack)
          ? data.buildStack.map(normalizePersistedStackItem).filter(Boolean)
          : []
        setBuildStack(persistedStack)
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load tutor progress:', error)
        }
      } finally {
        if (isMounted) {
          setLoadingProgress(false)
        }
      }
    }

    run()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    function syncFromHash() {
      const route = getTutorRoute()

      if (route.stage === 'overview') {
        setIsStarted(false)
        setFlowStage('lesson')
        return
      }

      if (route.stage === 'complete') {
        setIsStarted(true)
        setCurrentPartIndex(tutorPartOrder.length)
        setFlowStage('complete')
        return
      }

      const targetIndex = Math.max(0, tutorPartOrder.indexOf(route.partKey))
      if (route.partKey && targetIndex >= 0) {
        setIsStarted(true)
        setCurrentPartIndex(targetIndex)
        setFlowStage(route.stage)
      }
    }

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)

    return () => {
      window.removeEventListener('hashchange', syncFromHash)
    }
  }, [])

  useEffect(() => {
    if (!isStarted) {
      return
    }

    setQ1Answer('')
    setQ1Status('idle')
    setQ1Feedback('')
    setSelectedOptionKey('')
    setSelectionStatus('idle')
    setSelectionFeedback('')
    setSelectionReasons([])
  }, [currentPartIndex, isStarted])

  const currentPartKey = tutorPartOrder[currentPartIndex] ?? null
  const currentPart = currentPartKey ? tutorParts[currentPartKey] : null
  const completedCount = buildStack.length
  const progressLabel = `${completedCount}/${tutorPartOrder.length} complete`
  const canContinueToSelection = q1Status === 'correct'
  const canMoveToNextPart = selectionStatus === 'correct'
  const isComplete = currentPartIndex >= tutorPartOrder.length
  const overviewButtonLabel = loadingProgress || buildStack.length > 0 ? 'Continue' : 'Begin'

  const stackLookup = useMemo(() => {
    return new Map(buildStack.map((entry) => [entry.partKey, entry]))
  }, [buildStack])

  async function persistStack(nextStack) {
    setSaveError('')
    try {
      await saveTutorProgress(nextStack)
    } catch (error) {
      console.error('Failed to save tutor progress:', error)
      setSaveError('The stack update could not be saved right now.')
    }
  }

  async function startTutor() {
    const startIndex = Math.min(buildStack.length, tutorPartOrder.length)
    setCurrentPartIndex(startIndex)
    setIsStarted(true)
    setFlowStage(startIndex >= tutorPartOrder.length ? 'complete' : 'lesson')
    window.location.hash = startIndex >= tutorPartOrder.length
      ? buildTutorHash('complete')
      : buildTutorHash('lesson', tutorPartOrder[startIndex])
  }

  async function submitLessonAnswer() {
    if (!currentPart) {
      return
    }

    try {
      const result = await gradeTutorAnswer(currentPart.key, q1Answer)
      setQ1Status(result.correct ? 'correct' : 'incorrect')
      setQ1Feedback(result.feedback || (result.correct ? 'Correct.' : `Hint: ${currentPart.questionHint}`))
    } catch (error) {
      setQ1Status('incorrect')
      setQ1Feedback(`Hint: ${currentPart.questionHint}`)
    }
  }

  async function chooseOption(optionKey) {
    if (!currentPart) {
      return
    }

    setSelectedOptionKey(optionKey)
    const evaluation = evaluateTutorSelection(currentPart.key, optionKey, buildStack)

    setSelectionStatus(evaluation.compatible ? 'correct' : 'incorrect')
    setSelectionReasons(evaluation.reasons)
    setSelectionFeedback(
      evaluation.compatible
        ? `${evaluation.option?.label} fits the build and was added to your stack.`
        : evaluation.reasons[0] || 'That option is not compatible with this build.'
    )

    if (!evaluation.compatible) {
      return
    }

    const nextStack = [
      ...buildStack.filter((entry) => entry.partKey !== currentPart.key),
      evaluation.stackEntry,
    ]

    setBuildStack(nextStack)
    await persistStack(nextStack)
  }

  function goToNextPart() {
    const nextIndex = currentPartIndex + 1
    if (nextIndex >= tutorPartOrder.length) {
      setCurrentPartIndex(nextIndex)
      setFlowStage('complete')
      window.location.hash = buildTutorHash('complete')
      return
    }

    setCurrentPartIndex(nextIndex)
    setFlowStage('lesson')
    window.location.hash = buildTutorHash('lesson', tutorPartOrder[nextIndex])
  }

  if (!isStarted) {
    return (
      <section className="space-y-6">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
          <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Partwise Tutor
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Learn how to build PCs</h1>
          <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
            This tutor teaches part selection, compatibility, and assembly in a guided flow. Start with reading, answer a question, then pick a compatible part for your build stack.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {tutorOverviewCards.map((card) => (
              <div key={card.title} className="rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/60">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
                  {card.title}
                </div>
                <p className="mt-3 text-gray-700 dark:text-gray-200">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={startTutor} className="btn btn-primary">
              {overviewButtonLabel}
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {completedCount > 0 ? `You already have ${completedCount} part${completedCount === 1 ? '' : 's'} saved in your stack.` : 'Nothing is saved yet.'}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            Grading flow
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tutorGradingFlow.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
                <div className="font-semibold text-gray-800 dark:text-white">{item.title}</div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (isComplete) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
          Tutor complete
        </div>
        <h1 className="mt-2 text-4xl font-bold text-gray-800 dark:text-white">You finished the current build path</h1>
        <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
          Your stack is saved, your compatibility choices passed, and you can revisit the tutor or continue refining the build later.
        </p>

        <div className="mt-8 space-y-3">
          {buildStack.map((entry, index) => (
            <div
              key={`${entry.partKey}-${entry.optionKey}`}
              className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md dark:border-gray-700"
              style={{ marginLeft: `${index * 8}px` }}
            >
              <div className="text-xs uppercase tracking-[0.28em] text-white/70">Slot {index + 1}</div>
              <div className="mt-1 text-lg font-semibold">{entry.label}</div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const currentOptions = getTutorOptions(currentPartKey)
  const currentStackEntry = stackLookup.get(currentPartKey)

  return (
    <section className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_340px] xl:items-start">
      <aside className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
        <div className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
          Part Sections
        </div>
        <div className="space-y-2">
          {tutorPartOrder.map((partKey, index) => {
            const part = tutorParts[partKey]
            const partState = stackLookup.get(partKey)
            const isActive = partKey === currentPartKey
            const isComplete = Boolean(partState)

            return (
              <button
                key={partKey}
                type="button"
                onClick={() => {
                  setCurrentPartIndex(index)
                  setFlowStage('lesson')
                  window.location.hash = buildTutorHash('lesson', partKey)
                }}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                    : 'border-gray-200 bg-gray-100 text-gray-800 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{part.label}</span>
                  <span className={`text-xs ${isComplete ? 'text-emerald-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    {isComplete ? 'Complete' : isActive ? 'Current' : 'Learning'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      <article className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              {currentPart.label}
            </div>
            <h1 className="mt-2 text-4xl font-bold text-gray-800 dark:text-white">{currentPart.lessonTitle}</h1>
            <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
              Read the part summary first. Then answer the question. Once you are correct, move on to the selection step and pick the part that belongs in the stack.
            </p>
          </div>
          <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-300">
            {progressLabel}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-900/20">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
              What it is
            </div>
            <p className="mt-3 text-gray-700 dark:text-gray-200">{currentPart.whatItIs}</p>
          </div>
          <div className="rounded-2xl bg-indigo-50 p-5 dark:bg-indigo-900/20">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
              What it does
            </div>
            <p className="mt-3 text-gray-700 dark:text-gray-200">{currentPart.whatItDoes}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 p-5 text-gray-700 dark:border-gray-700 dark:text-gray-200">
          <div className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
            Compatibility matters
          </div>
          <p className="mt-3">{currentPart.compatibility}</p>
          {currentStackEntry && (
            <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-300">
              You already added a compatible {currentPart.label.toLowerCase()} to this stack.
            </p>
          )}
        </div>

        {flowStage === 'lesson' && (
          <section className="mt-8 rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/60">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Question 1
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">{currentPart.questionPrompt}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Write a short answer based on the reading above.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={q1Answer}
                onChange={(e) => setQ1Answer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitLessonAnswer()}
                className="input input-bordered flex-1"
                placeholder="Type your answer here"
              />
              <button type="button" onClick={submitLessonAnswer} className="btn btn-primary">
                Check answer
              </button>
            </div>
            {q1Feedback && (
              <div
                className={`mt-4 rounded-xl border p-3 text-sm ${
                  q1Status === 'correct'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                    : 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                }`}
              >
                {q1Feedback}
              </div>
            )}
            <div className="mt-5 flex justify-end">
              <button type="button" onClick={() => setFlowStage('selection')} disabled={!canContinueToSelection} className="btn btn-primary">
                Next
              </button>
            </div>
          </section>
        )}

        {flowStage === 'selection' && (
          <section className="mt-8 rounded-2xl bg-gray-50 p-5 dark:bg-gray-800/60">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">
              Question 2
            </div>
            <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
              Choose a part to add to your build
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Pick the compatible option. If it is correct, the card turns green and is saved to your stack.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {currentOptions.map((option) => {
                const isSelected = selectedOptionKey === option.key
                const wasCorrect = selectionStatus === 'correct' && isSelected
                const wasIncorrect = selectionStatus === 'incorrect' && isSelected

                return (
                  <button
                    type="button"
                    key={option.key}
                    onClick={() => chooseOption(option.key)}
                    disabled={selectionStatus === 'correct'}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      wasCorrect
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                        : wasIncorrect
                          ? 'border-red-500 bg-red-500 text-white shadow-md'
                          : isSelected
                            ? 'border-blue-500 bg-blue-600 text-white shadow-md'
                            : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'
                    } ${selectionStatus === 'correct' ? 'cursor-not-allowed opacity-90' : ''}`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className={`mt-2 text-sm ${wasCorrect || wasIncorrect ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
                      {option.summary}
                    </div>
                  </button>
                )
              })}
            </div>

            {selectionFeedback && (
              <div
                className={`mt-4 rounded-xl border p-3 text-sm ${
                  selectionStatus === 'correct'
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                    : 'border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                }`}
              >
                {selectionFeedback}
                {selectionReasons.length > 0 && selectionStatus === 'incorrect' && (
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {selectionReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button type="button" onClick={goToNextPart} disabled={!canMoveToNextPart} className="btn btn-primary">
                Next part
              </button>
            </div>
          </section>
        )}
      </article>

      <aside className="space-y-6 xl:sticky xl:top-24">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                Build stack
              </div>
              <div className="mt-1 text-2xl font-bold text-gray-800 dark:text-white">{buildStack.length} chosen</div>
            </div>
            <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {progressLabel}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {buildStack.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                Your selected parts will appear here.
              </div>
            ) : (
              buildStack.map((entry, index) => (
                <div
                  key={`${entry.partKey}-${entry.optionKey}`}
                  className="rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md dark:border-gray-700"
                  style={{ marginLeft: `${index * 8}px` }}
                >
                  <div className="text-xs uppercase tracking-[0.28em] text-white/70">Slot {index + 1}</div>
                  <div className="mt-1 text-lg font-semibold">{entry.label}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {saveError && (
          <div className="rounded-xl border border-amber-400 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            {saveError}
          </div>
        )}
      </aside>
    </section>
  )
}

export default TutorExperience
