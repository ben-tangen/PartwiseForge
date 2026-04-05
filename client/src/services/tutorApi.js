export async function loadTutorProgress() {
  const response = await fetch('/api/tutor/progress/', {
    credentials: 'same-origin',
  })

  if (!response.ok) {
    return { buildStack: [] }
  }

  return response.json()
}

export async function saveTutorProgress(buildStack) {
  const response = await fetch('/api/tutor/progress/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ buildStack }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data?.error || 'Failed to save tutor progress')
  }

  return response.json()
}

export async function gradeTutorAnswer(partKey, answer) {
  const response = await fetch('/api/tutor/grade/q1/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ partKey, answer }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error || 'Tutor grading failed')
  }

  return data
}
