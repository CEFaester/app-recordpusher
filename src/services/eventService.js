/**
 * Lavet med hjælp fra AI
 */

// Samme Firebase-database som shopService.js og userService.js.
const DB_URL = 'https://record-pusher-app-default-rtdb.europe-west1.firebasedatabase.app'
const EVENTS_URL = `${DB_URL}/events`

// Firebase returnerer et objekt med ID som nøgle, ikke et almindeligt array.
export const getEvents = async () => {
  const response = await fetch(`${EVENTS_URL}.json`)
  if (!response.ok) throw new Error('Kunne ikke hente events fra Firebase.')
  const data = await response.json()
  if (!data) return []

  return Object.entries(data)
    .filter(([, event]) => event && typeof event === 'object' && typeof event.title === 'string')
    .map(([id, event]) => ({
      ...event,
      id,
      poster: event.poster || event.title.toUpperCase(),
      theme: event.theme === 'red' ? 'red' : 'yellow'
    }))
    .sort((a, b) => `${a.day || '9999'} ${a.startTime || ''}`.localeCompare(`${b.day || '9999'} ${b.startTime || ''}`))
}

// Datoen sammenlignes i dansk tid, så forsiden viser det næste kommende event.
export const getUpcomingEvents = (events) => {
  const today = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Copenhagen', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date())
  return events.filter((event) => !event.day || event.day >= today)
}

// POST opretter en ny nøgle i Firebase. Vi gemmer ikke ID'et to gange.
export const createEvent = async (newEvent) => {
  const response = await fetch(`${EVENTS_URL}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newEvent)
  })
  if (!response.ok) throw new Error('Kunne ikke oprette eventet i Firebase.')
  const { name: id } = await response.json()
  return { ...newEvent, id }
}

// PATCH ændrer kun felterne på det valgte event, ikke resten af databasen.
export const updateEvent = async (id, updatedEvent) => {
  const response = await fetch(`${EVENTS_URL}/${encodeURIComponent(id)}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedEvent)
  })
  if (!response.ok) throw new Error('Kunne ikke opdatere eventet i Firebase.')
  return { ...updatedEvent, id }
}

export const deleteEvent = async (id) => {
  const response = await fetch(`${EVENTS_URL}/${encodeURIComponent(id)}.json`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Kunne ikke slette eventet i Firebase.')
  return true
}

// Admin indtaster dato og klokkeslæt én gang. Vi danner teksterne til kort og detaljevisning.
export const formatEventDates = (day, startTime, endTime) => {
  const calendarDate = new Date(`${day}T12:00:00Z`)
  const short = new Intl.DateTimeFormat('da-DK', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC'
  }).format(calendarDate).toUpperCase().replace(/\./g, '').replace(/\s*,\s*/g, ' ')
  const long = new Intl.DateTimeFormat('da-DK', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  }).format(calendarDate)
  return {
    shortDate: `${short} · ${startTime}`,
    date: `${long.charAt(0).toUpperCase() + long.slice(1)} · ${startTime}${endTime ? `–${endTime}` : ''}`
  }
}
