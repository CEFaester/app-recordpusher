import { ref } from 'vue'

const DB_URL = 'https://record-pusher-app-default-rtdb.europe-west1.firebasedatabase.app'
const STORAGE_KEY = 'rp_admin_logged_in'

export const isAdminAuthenticated = ref(sessionStorage.getItem(STORAGE_KEY) === 'true')

/**
 * Tjekker brugernavn og adgangskode op mod /admin.json i Firebase
 */
export const loginAdmin = async (username, password) => {
  const response = await fetch(`${DB_URL}/admin.json`)
  if (!response.ok) {
    throw new Error('Kunne ikke oprette forbindelse til databasen.')
  }

  const adminData = await response.json()
  if (!adminData) {
    throw new Error('Ingen admin-bruger fundet i Firebase under /admin.')
  }

  const isValidUser = adminData.username === username.trim()
  const isValidPass = String(adminData.password) === String(password)

  if (!isValidUser || !isValidPass) {
    throw new Error('Forkert brugernavn eller adgangskode.')
  }

  isAdminAuthenticated.value = true
  sessionStorage.setItem(STORAGE_KEY, 'true')
  return true
}

/**
 * Logger admin ud
 */
export const logoutAdmin = () => {
  isAdminAuthenticated.value = false
  sessionStorage.removeItem(STORAGE_KEY)
}