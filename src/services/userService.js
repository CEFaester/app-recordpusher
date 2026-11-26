/**
 * Lavet med hjælp fra AI
 */

import { ref } from 'vue'

// Indsæt linket til din database her (uden skråstreg til sidst)
const DB_URL = 'https://record-pusher-app-default-rtdb.europe-west1.firebasedatabase.app'
const STORAGE_KEY = 'rp_logged_in_user_id'

export const currentUser = ref(null)
export const isAuthLoading = ref(false)

/**
 * Henter brugeren fra Firebase ved opstart/refresh, hvis man allerede er logget ind
 */
export const initAuth = async () => {
  const savedUserId = localStorage.getItem(STORAGE_KEY)
  if (!savedUserId) return

  try {
    isAuthLoading.value = true
    const response = await fetch(`${DB_URL}/users/${savedUserId}.json`)
    const data = await response.json()

    if (data) {
      currentUser.value = {
        id: savedUserId,
        ...data,
        savedEvents: data.savedEvents || []
      }
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.error('Fejl ved hentning af bruger:', error)
  } finally {
    isAuthLoading.value = false
  }
}

/**
 * Logger ind ved at matche email og adgangskode mod /users.json
 */
export const loginUser = async (email, password) => {
  const response = await fetch(`${DB_URL}/users.json`)
  if (!response.ok) throw new Error('Kunne ikke få kontakt til databasen.')

  const usersObj = await response.json()
  if (!usersObj) throw new Error('Forkert email eller adgangskode.')

  const foundEntry = Object.entries(usersObj).find(
    ([, user]) =>
      user.email?.toLowerCase() === email.trim().toLowerCase() &&
      user.password === password
  )

  if (!foundEntry) {
    throw new Error('Forkert email eller adgangskode.')
  }

  const [id, userData] = foundEntry
  currentUser.value = {
    id,
    ...userData,
    savedEvents: userData.savedEvents || []
  }
  localStorage.setItem(STORAGE_KEY, id)
  return currentUser.value
}

/**
 * Opretter ny bruger i Firebase med POST og logger ind med det samme
 */
export const registerUser = async ({ name, email, password }) => {
  const checkRes = await fetch(`${DB_URL}/users.json`)
  const existingUsers = await checkRes.json()

  if (existingUsers) {
    const emailTaken = Object.values(existingUsers).some(
      (user) => user.email?.toLowerCase() === email.trim().toLowerCase()
    )
    if (emailTaken) {
      throw new Error('Der findes allerede en profil med denne email.')
    }
  }

  const newUser = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    memberCode: `RP-${Math.floor(100000 + Math.random() * 900000)}`,
    memberSince: String(new Date().getFullYear()),
    points: 500,
    savedEvents: []
  }

  const createRes = await fetch(`${DB_URL}/users.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  })

  if (!createRes.ok) throw new Error('Kunne ikke oprette profil.')

  const { name: newId } = await createRes.json()
  currentUser.value = { id: newId, ...newUser }
  localStorage.setItem(STORAGE_KEY, newId)
  return currentUser.value
}

/**
 * Logger brugeren ud
 */
export const logoutUser = () => {
  currentUser.value = null
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Gemmer eller fjerner et event på brugerens profil i Firebase
 */
export const toggleUserSavedEvent = async (eventId) => {
  if (!currentUser.value) return false

  const currentList = currentUser.value.savedEvents || []
  const updatedList = currentList.includes(eventId)
    ? currentList.filter((id) => id !== eventId)
    : [...currentList, eventId]

  const response = await fetch(`${DB_URL}/users/${currentUser.value.id}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ savedEvents: updatedList })
  })

  if (!response.ok) throw new Error('Kunne ikke gemme eventet.')

  currentUser.value.savedEvents = updatedList
  return true
}

/**
 * Trækker point fra brugeren i Firebase ved køb i butikken
 */
export const spendUserPoints = async (cost) => {
  if (!currentUser.value) throw new Error('Du skal være logget ind for at købe.')
  if (currentUser.value.points < cost) throw new Error('Du har ikke nok point.')

  const updatedPoints = currentUser.value.points - cost

  const response = await fetch(`${DB_URL}/users/${currentUser.value.id}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points: updatedPoints })
  })

  if (!response.ok) throw new Error('Kunne ikke opdatere dine point.')

  currentUser.value.points = updatedPoints
  return updatedPoints
}