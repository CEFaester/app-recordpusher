// API URL til Firebase Realtime Database
const DB_URL = 'https://record-pusher-app-default-rtdb.europe-west1.firebasedatabase.app'

/**
 * Henter alle varer fra /shopItems.json i Firebase
 */
export const getShopItems = async () => {
  const response = await fetch(`${DB_URL}/shopItems.json`)
  if (!response.ok) throw new Error('Kunne ikke hente butiksvarer')
  
  const data = await response.json()
  if (!data) return []

  return Object.entries(data).map(([id, item]) => ({
    id,
    ...item
  }))
}

/**
 * Henter én specifik vare ud fra dens ID til betalingssiden
 */
export const getShopItemById = async (id) => {
  const response = await fetch(`${DB_URL}/shopItems/${id}.json`)
  if (!response.ok) throw new Error('Kunne ikke hente varen.')

  const item = await response.json()
  return item ? { id, ...item } : null
}

/**
 * Opretter en ny vare i Firebase (bruges på AdminPointsView)
 */
export const createShopItem = async (newItem) => {
  const response = await fetch(`${DB_URL}/shopItems.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newItem)
  })

  if (!response.ok) throw new Error('Kunne ikke oprette varen i databasen.')

  const { name: id } = await response.json()
  return { id, ...newItem }
}

/**
 * Sletter en vare i Firebase (bruges på AdminPointsView)
 */
export const deleteShopItem = async (id) => {
  const response = await fetch(`${DB_URL}/shopItems/${id}.json`, {
    method: 'DELETE'
  })

  if (!response.ok) throw new Error('Kunne ikke slette varen.')
  return true
}

/**
 * Opdaterer en eksisterende vare i Firebase
 */
export const updateShopItem = async (id, updatedItem) => {
  const response = await fetch(`${DB_URL}/shopItems/${id}.json`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedItem)
  })

  if (!response.ok) throw new Error('Kunne ikke opdatere varen i databasen.')

  return { id, ...updatedItem }
}