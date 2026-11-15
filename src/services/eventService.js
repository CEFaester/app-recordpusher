// Midlertidige eksempelevents fra prototypen. Kan senere erstattes af data fra Firebase.
export const events = [
  {
    id: 'fredagslyt',
    title: 'Fredagslyt hos RecordPusher',
    poster: 'FREDAGS\nLYT.',
    theme: 'yellow',
    shortDate: 'FRE 13. NOV · 17:00',
    date: 'Fredag 13. november · 17:00–19:00',
    meta: 'Gratis · Pladebutik, bar og god musik',
    description: 'Vi sætter plader på, åbner baren og lytter sammen. Kom med en ven, eller kom som du er. Der er plads til nye ansigter.',
    points: 25
  },
  {
    id: 'vinyl-venner',
    title: 'Vinyl & venner',
    poster: 'VINYL &\nVENNER.',
    theme: 'red',
    shortDate: 'LØR 21. NOV · 14:00',
    date: 'Lørdag 21. november · 14:00',
    meta: 'Gratis · Tag en plade og en ven med',
    description: 'Tag din yndlingsplade med, del din musik og mød andre, der elsker vinyl. Alle er velkomne.',
    points: 25
  }
]

const storageKey = 'recordpusher-saved-events'

// Gemte events opbevares lokalt, så de stadig er gemt efter genindlæsning.
export function getSavedEventIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(saved) ? saved.filter(id => events.some(event => event.id === id)) : []
  } catch {
    return []
  }
}

export function saveEventIds(ids) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(ids))
    return true
  } catch {
    return false
  }
}
