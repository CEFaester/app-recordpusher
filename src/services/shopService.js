// Midlertidig mock-data (fjernes når Firebase kobles på)
const MOCK_SHOP_ITEMS = [
  { id: 1, name: 'Eksklusiv T-shirt', cost: 500, icon: '👕' },
  { id: 2, name: 'Kold Sodavand', cost: 150, icon: '🥤' },
  { id: 3, name: 'Musik Plakat', cost: 300, icon: '🖼️' },
  { id: 4, name: 'Øl', cost: 200, icon: '🍺' },
  { id: 5, name: 'Film Plakat', cost: 100, icon: '🖼️' },
  { id: 6, name: 'Puslespil', cost: 150, icon: '🧩' }
]

// Indsæt firebase URL her:
// const DB_URL = 'https://DIT-PROJEKT-default-rtdb.europe-west1.firebasedatabase.app'

/**
 * Henter alle varer til butikken
 */
export const getShopItems = async () => {
  // --- FREMTIDIGT FIREBASE API-KALD ---
  // const response = await fetch(`${DB_URL}/shopItems.json`)
  // if (!response.ok) throw new Error('Kunne ikke hente butiksvarer')
  // const data = await response.json()
  // return data ? Object.values(data) : []

  // --- NUVÆRENDE SIMULERET API-KALD ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_SHOP_ITEMS)
    }, 300)
  })
}

/**
 * Henter én specifik vare ud fra dens ID til betalingssiden
 */
export const getShopItemById = async (id) => {
  // --- FREMTIDIGT FIREBASE API-KALD ---
  // const items = await getShopItems()
  // return items.find((item) => String(item.id) === String(id)) || null

  // --- NUVÆRENDE SIMULERET API-KALD ---
  return new Promise((resolve) => {
    setTimeout(() => {
      const found = MOCK_SHOP_ITEMS.find((item) => String(item.id) === String(id))
      resolve(found || null)
    }, 300)
  })
}