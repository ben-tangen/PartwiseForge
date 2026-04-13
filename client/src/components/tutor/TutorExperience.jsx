import { useEffect, useMemo, useState } from 'react'
import { gradeTutorAnswer, loadTutorProgress, saveTutorProgress } from '../../services/tutorApi'
import {
  getTutorOptions,
  getTutorOptionImage,
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

  if (partKey === 'assemble') {
    return { stage: 'assembly', partKey: null }
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

  if (stage === 'assembly') {
    return '#tutor/assemble'
  }

  if (partKey) {
    return `#tutor/${partKey}/${stage}`
  }

  return '#tutor'
}

function formatSpecKey(key) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatSpecValue(value) {
  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return String(value)
}

function getEntrySpecs(entry) {
  if (!entry?.attributes || typeof entry.attributes !== 'object') {
    return []
  }

  return Object.entries(entry.attributes)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .slice(0, 3)
    .map(([key, value]) => ({
      label: formatSpecKey(key),
      value: formatSpecValue(value),
    }))
}

function getResumePartIndex(stackEntries) {
  const savedParts = new Set(stackEntries.map((entry) => entry.partKey))
  const firstMissingIndex = tutorPartOrder.findIndex((partKey) => !savedParts.has(partKey))
  return firstMissingIndex === -1 ? tutorPartOrder.length : firstMissingIndex
}

function isNvmeStorage(entry) {
  return Boolean(entry?.partKey === 'storage' && entry?.attributes?.type === 'NVMe')
}

function isAioCooler(entry) {
  if (!entry || entry.partKey !== 'cooler') {
    return false
  }

  const text = `${entry.label || ''} ${entry.summary || ''}`.toLowerCase()
  return entry.optionKey === 'h150i-elite' || text.includes('aio') || text.includes('liquid')
}

function getAssemblySteps(buildStack) {
  const partByKey = new Map(buildStack.map((entry) => [entry.partKey, entry]))
  const coolerEntry = partByKey.get('cooler')
  const storageEntry = partByKey.get('storage')
  const hasNvme = isNvmeStorage(storageEntry)
  const hasAio = isAioCooler(coolerEntry)

  const allSteps = [
    {
      id: 'bench-mobo',
      title: 'Motherboard on workspace',
      partKey: 'mobo',
      hint: 'Start by placing the motherboard on a clean workspace first.',
    },
    {
      id: 'bench-cpu',
      title: 'Install CPU on motherboard',
      partKey: 'cpu',
      hint: 'CPU is an early motherboard step before the board goes in the case.',
    },
    {
      id: 'bench-ram',
      title: 'Install RAM on motherboard',
      partKey: 'ram',
      hint: 'RAM should be installed on the motherboard before case install.',
    },
    {
      id: 'bench-nvme',
      title: 'Install NVMe storage on motherboard',
      partKey: 'storage',
      hint: 'NVMe is usually easiest to install on the board before case install.',
      include: hasNvme,
    },
    {
      id: 'bench-air-cooler',
      title: 'Mount air cooler on motherboard',
      partKey: 'cooler',
      hint: 'For air coolers, mount it on the motherboard before moving into the case.',
      include: !hasAio && Boolean(coolerEntry),
    },
    {
      id: 'case-mobo',
      title: 'Place motherboard into case',
      partKey: 'mobo',
      hint: 'After bench prep, install the motherboard into the case.',
    },
    {
      id: 'case-psu',
      title: 'Install PSU in case',
      partKey: 'psu',
      hint: 'PSU goes in early in the case stage to support routing power cables.',
    },
    {
      id: 'case-aio',
      title: 'Install AIO cooler in case',
      partKey: 'cooler',
      hint: 'AIO radiator/pump installation happens during the case stage.',
      include: hasAio,
    },
    {
      id: 'case-gpu',
      title: 'Install GPU in case',
      partKey: 'gpu',
      hint: 'GPU is normally one of the later major installs.',
    },
    {
      id: 'case-extra-storage',
      title: 'Install extra storage in case',
      partKey: 'storage',
      hint: 'SATA/HDD style storage is usually installed in the case stage.',
      include: Boolean(storageEntry) && !hasNvme,
    },
  ]

  return allSteps
    .filter((step) => step.include !== false)
    .filter((step) => partByKey.has(step.partKey))
}

function SavedBuildCard({ entry, onRemove }) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const specs = getEntrySpecs(entry)
  const imagePath = getTutorOptionImage(entry.optionKey)
  const showImage = Boolean(imagePath) && !imageLoadFailed
  const partInitials = String(entry.partLabel || entry.label || '?')
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return (
    <article className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <button
        type="button"
        onClick={() => onRemove(entry.partKey)}
        className="absolute right-3 top-3 rounded-md border border-red-300 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/30"
      >
        Remove
      </button>

      <div className="flex items-start gap-4 pr-20">
        {showImage ? (
          <img
            src={encodeURI(imagePath)}
            alt={`${entry.label} reference`}
            className="h-20 w-20 shrink-0 rounded-xl border border-gray-300 object-cover dark:border-gray-700"
            onError={() => setImageLoadFailed(true)}
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-slate-100 text-sm font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {partInitials}
          </div>
        )}

        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">
            {entry.partLabel}
          </div>
          <div className="mt-1 text-base font-semibold leading-snug text-gray-900 dark:text-white">
            {entry.label}
          </div>
          {entry.summary && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{entry.summary}</p>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {specs.length > 0 ? (
          specs.map((spec) => (
            <p key={`${entry.partKey}-${spec.label}`} className="text-xs text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gray-700 dark:text-gray-200">{spec.label}:</span> {spec.value}
            </p>
          ))
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">Specs pending</p>
        )}
      </div>
    </article>
  )
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
  const [assemblyPlacements, setAssemblyPlacements] = useState({})
  const [assemblyHint, setAssemblyHint] = useState('Drag parts onto each step in order. Motherboard goes first.')

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

      if (route.stage === 'assembly') {
        setIsStarted(true)
        setCurrentPartIndex(tutorPartOrder.length)
        setFlowStage('assembly')
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
  const assemblySteps = useMemo(() => getAssemblySteps(buildStack), [buildStack])
  const nextAssemblyStep = assemblySteps.find((step) => !assemblyPlacements[step.id])
  const isAssemblyComplete = assemblySteps.length > 0 && assemblySteps.every((step) => Boolean(assemblyPlacements[step.id]))
  const benchSteps = assemblySteps.filter((step) => step.id.startsWith('bench-'))
  const caseSteps = assemblySteps.filter((step) => step.id.startsWith('case-'))
  const overviewButtonLabel = loadingProgress || buildStack.length > 0 ? 'Continue' : 'Begin'

  const stackLookup = useMemo(() => {
    return new Map(buildStack.map((entry) => [entry.partKey, entry]))
  }, [buildStack])
  const selectedMoboImage = getTutorOptionImage(stackLookup.get('mobo')?.optionKey || '')
  const selectedCaseImage = getTutorOptionImage(stackLookup.get('case')?.optionKey || '')

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
    const startIndex = getResumePartIndex(buildStack)
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

  async function clearSavedBuild() {
    setBuildStack([])
    setCurrentPartIndex(0)
    setFlowStage('lesson')
    setIsStarted(false)
    window.location.hash = buildTutorHash('overview')
    await persistStack([])
  }

  async function removePartFromStack(partKey) {
    const nextStack = buildStack.filter((entry) => entry.partKey !== partKey)
    const nextPartIndex = getResumePartIndex(nextStack)

    setBuildStack(nextStack)
    setCurrentPartIndex(nextPartIndex)
    setFlowStage(nextPartIndex >= tutorPartOrder.length ? 'complete' : 'lesson')

    if (isStarted) {
      window.location.hash = nextPartIndex >= tutorPartOrder.length
        ? buildTutorHash('complete')
        : buildTutorHash('lesson', tutorPartOrder[nextPartIndex])
    }

    await persistStack(nextStack)
  }

  function startAssemblyMode() {
    setAssemblyPlacements({})
    setAssemblyHint('Drag parts onto each step in order. Motherboard goes first.')
    setFlowStage('assembly')
    window.location.hash = buildTutorHash('assembly')
  }

  function resetAssemblyMode() {
    setAssemblyPlacements({})
    setAssemblyHint('Assembly steps reset. Start by placing the motherboard first.')
  }

  function onPartDragStart(event, partKey) {
    event.dataTransfer.setData('text/part-key', partKey)
    event.dataTransfer.effectAllowed = 'move'
  }

  function handleAssemblyDrop(event, targetStep) {
    event.preventDefault()
    const draggedPartKey = event.dataTransfer.getData('text/part-key')

    if (!draggedPartKey) {
      return
    }

    if (targetStep.partKey !== draggedPartKey) {
      setAssemblyHint(`That slot expects ${tutorParts[targetStep.partKey]?.label || targetStep.partKey}.`)
      return
    }

    if (nextAssemblyStep && nextAssemblyStep.id !== targetStep.id) {
      setAssemblyHint(nextAssemblyStep.hint)
      return
    }

    if (assemblyPlacements[targetStep.id]) {
      setAssemblyHint('That step is already complete. Continue to the next step.')
      return
    }

    setAssemblyPlacements((previous) => ({
      ...previous,
      [targetStep.id]: draggedPartKey,
    }))
    setAssemblyHint(`Nice. ${targetStep.title} completed.`)
  }

  function allowAssemblyDrop(event) {
    event.preventDefault()
  }

  function getCanvasZoneClass(stepId) {
    const zoneClasses = {
      'bench-mobo': 'left-[6%] top-[6%] h-[16%] w-[42%]',
      'bench-cpu': 'left-[30%] top-[32%] h-[20%] w-[20%]',
      'bench-ram': 'right-[10%] top-[24%] h-[30%] w-[18%]',
      'bench-nvme': 'left-[26%] bottom-[10%] h-[13%] w-[28%]',
      'bench-air-cooler': 'left-[56%] top-[58%] h-[20%] w-[30%]',
      'case-mobo': 'left-[8%] top-[20%] h-[34%] w-[36%]',
      'case-psu': 'right-[6%] bottom-[8%] h-[22%] w-[24%]',
      'case-aio': 'right-[6%] top-[8%] h-[20%] w-[24%]',
      'case-gpu': 'left-[8%] top-[62%] h-[14%] w-[52%]',
      'case-extra-storage': 'right-[6%] top-[38%] h-[18%] w-[24%]',
    }

    return zoneClasses[stepId] || 'left-[10%] top-[10%] h-[20%] w-[20%]'
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
            <button
              type="button"
              onClick={startTutor}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
            >
              {overviewButtonLabel}
            </button>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={clearSavedBuild}
                className="rounded-xl border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-900/40"
              >
                Clear saved build
              </button>
            )}
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

  if (isComplete && flowStage === 'assembly') {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              Build mode
            </div>
            <h1 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white">Put parts together</h1>
            <p className="mt-2 max-w-3xl text-gray-600 dark:text-gray-300">
              Drag each part onto the matching step. Follow the required sequence: motherboard first, bench installs, then case installs.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={resetAssemblyMode} className="btn btn-outline">
              Reset steps
            </button>
            <button
              type="button"
              onClick={() => {
                setFlowStage('complete')
                window.location.hash = buildTutorHash('complete')
              }}
              className="btn btn-primary"
            >
              Back to summary
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-900/20 dark:text-blue-200">
          {isAssemblyComplete ? 'Build order complete. Great job following the sequence.' : assemblyHint}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 xl:sticky xl:top-24 xl:h-fit">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Parts tray</div>
            <div className="mt-4 space-y-3">
              {buildStack.map((entry) => (
                <button
                  key={`tray-${entry.partKey}-${entry.optionKey}`}
                  type="button"
                  draggable
                  onDragStart={(event) => onPartDragStart(event, entry.partKey)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 text-left shadow-sm transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <img
                    src={encodeURI(getTutorOptionImage(entry.optionKey) || '')}
                    alt=""
                    className="h-12 w-12 rounded-lg border border-gray-300 object-cover dark:border-gray-700"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-blue-300">{entry.partLabel}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{entry.label}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <div className="font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">Order hint</div>
              <p className="mt-2">
                Place parts in sequence. The highlighted zone is the next valid placement.
              </p>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Motherboard bench</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">Prep components before case install</span>
              </div>

              <div
                className="relative h-[460px] overflow-hidden rounded-xl border border-slate-700/80"
                style={{
                  backgroundColor: '#0f172a',
                  backgroundImage: selectedMoboImage
                    ? `linear-gradient(135deg, rgba(15,23,42,0.65), rgba(30,41,59,0.7)), url("${encodeURI(selectedMoboImage)}")`
                    : 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95)), repeating-linear-gradient(90deg, rgba(148,163,184,0.08) 0 1px, transparent 1px 32px), repeating-linear-gradient(0deg, rgba(148,163,184,0.08) 0 1px, transparent 1px 32px)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {benchSteps.map((step, index) => {
                  const placed = Boolean(assemblyPlacements[step.id])
                  const isNext = nextAssemblyStep?.id === step.id
                  const placedEntry = stackLookup.get(step.partKey)
                  const placedImage = getTutorOptionImage(placedEntry?.optionKey || '')

                  return (
                    <div
                      key={step.id}
                      onDragOver={allowAssemblyDrop}
                      onDrop={(event) => handleAssemblyDrop(event, step)}
                      className={`absolute rounded-xl border p-2 transition ${getCanvasZoneClass(step.id)} ${
                        placed
                          ? 'border-emerald-400 bg-emerald-500/25'
                          : isNext
                            ? 'border-blue-300 bg-blue-500/20 ring-2 ring-blue-300/60'
                            : 'border-slate-400/60 bg-slate-700/20'
                      }`}
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">Step {index + 1}</div>
                      <div className="mt-1 text-xs font-semibold leading-tight text-white">{step.title}</div>
                      {placed ? (
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-900/30 p-1.5">
                          {placedImage && (
                            <img src={encodeURI(placedImage)} alt="" className="h-8 w-8 rounded-md border border-emerald-300/40 object-cover" />
                          )}
                          <span className="line-clamp-2 text-[11px] text-emerald-100">{placedEntry?.label || tutorParts[step.partKey]?.label}</span>
                        </div>
                      ) : (
                        <div className="mt-1 text-[11px] text-slate-200">{isNext ? 'Drop here next' : 'Locked until prior steps'}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500 dark:text-gray-400">Case interior</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">Final installation sequence</span>
              </div>

              <div
                className="relative h-[460px] overflow-hidden rounded-xl border border-slate-700/80"
                style={{
                  backgroundColor: '#0b1220',
                  backgroundImage: selectedCaseImage
                    ? `linear-gradient(120deg, rgba(17,24,39,0.62), rgba(30,41,59,0.72)), url("${encodeURI(selectedCaseImage)}")`
                    : 'linear-gradient(120deg, rgba(17,24,39,0.96), rgba(30,41,59,0.96)), radial-gradient(circle at 18% 16%, rgba(96,165,250,0.14), transparent 36%), radial-gradient(circle at 84% 72%, rgba(45,212,191,0.12), transparent 34%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {caseSteps.map((step, index) => {
                  const placed = Boolean(assemblyPlacements[step.id])
                  const isNext = nextAssemblyStep?.id === step.id
                  const placedEntry = stackLookup.get(step.partKey)
                  const placedImage = getTutorOptionImage(placedEntry?.optionKey || '')

                  return (
                    <div
                      key={step.id}
                      onDragOver={allowAssemblyDrop}
                      onDrop={(event) => handleAssemblyDrop(event, step)}
                      className={`absolute rounded-xl border p-2 transition ${getCanvasZoneClass(step.id)} ${
                        placed
                          ? 'border-emerald-400 bg-emerald-500/25'
                          : isNext
                            ? 'border-blue-300 bg-blue-500/20 ring-2 ring-blue-300/60'
                            : 'border-slate-400/60 bg-slate-700/20'
                      }`}
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-200">Step {benchSteps.length + index + 1}</div>
                      <div className="mt-1 text-xs font-semibold leading-tight text-white">{step.title}</div>
                      {placed ? (
                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-900/30 p-1.5">
                          {placedImage && (
                            <img src={encodeURI(placedImage)} alt="" className="h-8 w-8 rounded-md border border-emerald-300/40 object-cover" />
                          )}
                          <span className="line-clamp-2 text-[11px] text-emerald-100">{placedEntry?.label || tutorParts[step.partKey]?.label}</span>
                        </div>
                      ) : (
                        <div className="mt-1 text-[11px] text-slate-200">{isNext ? 'Drop here next' : 'Locked until prior steps'}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            <div className="rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
              {assemblySteps.map((step, index) => {
                const placed = Boolean(assemblyPlacements[step.id])
                return (
                  <div key={`legend-${step.id}`} className="flex items-center justify-between py-1">
                    <span className="truncate">{index + 1}. {step.title}</span>
                    <span className={`ml-3 rounded-full px-2 py-0.5 text-[11px] font-semibold ${placed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                      {placed ? 'Placed' : 'Pending'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (isComplete) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-950/10 dark:border-gray-800 dark:bg-gray-900/90">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              Tutor complete
            </div>
            <h1 className="mt-2 text-4xl font-bold text-gray-800 dark:text-white">You finished the current build path</h1>
            <p className="mt-4 max-w-3xl text-gray-600 dark:text-gray-300">
              Your stack is saved, your compatibility choices passed, and you can revisit the tutor or continue refining the build later.
            </p>
          </div>
          <button
            type="button"
            onClick={startAssemblyMode}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
          >
            Build / Put Parts Together
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {buildStack.map((entry, index) => (
            <SavedBuildCard
              key={`${entry.partKey}-${entry.optionKey}-${index}`}
              entry={entry}
              onRemove={removePartFromStack}
            />
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

        {Array.isArray(currentPart.buyingTips) && currentPart.buyingTips.length > 0 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 dark:border-amber-900/60 dark:bg-amber-900/10">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700 dark:text-amber-300">
              What to look for
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-900 dark:text-amber-100">
              {currentPart.buyingTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

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
              <div className="grid grid-cols-1 gap-4">
                {buildStack.map((entry, index) => (
                  <SavedBuildCard
                    key={`${entry.partKey}-${entry.optionKey}-${index}`}
                    entry={entry}
                    onRemove={removePartFromStack}
                  />
                ))}
              </div>
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
