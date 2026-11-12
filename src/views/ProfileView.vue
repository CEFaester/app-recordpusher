<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import IconArrow from '@/components/icons/IconArrow.vue'

const router = useRouter()

// =========================================
// TILSTANDE & FORMULAR (Login/Opret)
// =========================================
const isLoggedIn = ref(true)
const isRegistering = ref(false)
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleAuth = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Udfyld venligst både email og adgangskode.'
    return
  }
  isLoggedIn.value = true
  errorMessage.value = ''
}

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  errorMessage.value = ''
}

const handleLogout = () => {
  isLoggedIn.value = false
  email.value = ''
  password.value = ''
}

// =========================================
// PROFIL DATA (Gøres klar til database)
// =========================================
const userProfile = ref({
  name: 'Carl Emil',
  subtitle: 'Medlem siden 2026',
  points: 1450,
  avatarUrl: ''
})

// Menu-punkterne
const profileMenu = [
  { id: 1, label: 'Mine Events', routeName: 'profile' },
  { id: 2, label: 'Din Musik Smag', routeName: 'profile' },
  { id: 3, label: 'Ordrehistorik', routeName: 'profile' },
  { id: 4, label: 'Indstillinger', routeName: 'profile' }
]

// Navigation for menupunkter
const navigateTo = (routeName) => {
  console.log(`Navigerer til: ${routeName}`)
  // router.push({ name: routeName }) // Aktiver dette, når ruterne er defineret
}
</script>

<template>
  <div class="profile-view">
    
    <!-- =========================================
         VISES NÅR MAN IKKE ER LOGGET IND
         ========================================= -->
    <section v-if="!isLoggedIn" class="auth-section">
      <header class="auth-header">
        <h2 class="title">{{ isRegistering ? 'Opret Profil' : 'Log Ind' }}</h2>
        <p class="subtitle">
          {{ isRegistering 
            ? 'Opret en konto for at samle point og se dit medlemskort.' 
            : 'Log ind for at se dine point og dit medlemskort.' }}
        </p>
      </header>

      <form @submit.prevent="handleAuth" class="auth-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="din@email.dk" class="form-input" />
        </div>

        <div class="input-group">
          <label for="password">Adgangskode</label>
          <input type="password" id="password" v-model="password" placeholder="********" class="form-input" />
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="primary-btn">
          {{ isRegistering ? 'Opret konto' : 'Log ind' }}
        </button>
      </form>

      <button type="button" class="text-btn" @click="toggleMode">
        {{ isRegistering ? 'Har du allerede en konto? Log ind her' : 'Ny her? Opret en profil' }}
      </button>
    </section>


    <!-- =========================================
         VISES NÅR MAN ER LOGGET IND
         ========================================= -->
    <section v-else class="profile-content">
      
      <!-- 1. Header -->
      <header class="profile-header">
        <div class="avatar">
          <!-- Viser et rigtigt billede hvis avatarUrl findes, ellers første bogstav i navnet -->
          <img v-if="userProfile.avatarUrl" :src="userProfile.avatarUrl" alt="Profilbillede" />
          <span v-else class="avatar-placeholder">{{ userProfile.name.charAt(0) }}</span>
        </div>
        <div class="user-info">
          <h2 class="user-greeting">Hej, {{ userProfile.name }}</h2>
          <p class="user-subtitle">{{ userProfile.subtitle }}</p>
        </div>
      </header>

      <!-- 2. Point Boks -->
      <button class="points-banner" @click="router.push({ name: 'points' })">
        <div class="banner-text">
          <span class="banner-label">DIN MUSIK. DIT FÆLLESKAB.</span>
          <span class="banner-amount">{{ userProfile.points }} point</span>
        </div>
        <IconArrow class="banner-icon" />
      </button>

      <!-- 3. Kolonne med Menu Punkter -->
      <nav class="profile-menu-list">
        <button 
          v-for="item in profileMenu" 
          :key="item.id" 
          class="menu-item"
          @click="navigateTo(item.routeName)"
        >
          <span class="menu-label">{{ item.label }}</span>
          <IconArrow class="menu-icon" />
        </button>
      </nav>

      <!-- Log ud knap i bunden -->
      <button @click="handleLogout" class="secondary-btn logout-btn">Log ud</button>
    </section>

  </div>
</template>

<style lang="scss" scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  margin-top: $space-md;
}

/* Typografi generelt */
.title {
  font-size: $font-size-large;
  font-weight: 700;
  color: $color-text;
  margin-bottom: $space-xs;
}

.subtitle {
  font-size: $font-size-small;
  color: $color-text;
  line-height: 1.4;
  margin-bottom: $space-lg;
}

.auth-section {
  display: flex;
  flex-direction: column;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: $font-size-small;
    font-weight: 600;
    color: $color-text;
  }
}

.form-input {
  padding: $space-sm;
  font-size: 1rem;
  border: 1px solid $color-primary;
  background-color: $color-primary;
  color: $color-text;
  font-family: inherit; 
}

.error-msg {
  color: $color-accent-primary; // Rød fejlfarve
  font-size: $font-size-small;
  font-weight: 500;
}

/* =========================================
   KNAPPER
   ========================================= */
.primary-btn {
  background-color: $color-accent-secondary;
  color: $color-text;
  border: none;
  padding: $space-sm;
  font-size: $font-size-base;
  font-weight: 600;
  margin-top: $space-sm;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.8;
  }
}

.secondary-btn {
  background-color: $color-secondary;
  color: $color-text;
  border: none;
  padding: $space-sm;
  font-size: $font-size-base;
  font-weight: 600;
  margin-top: $space-xl;
  cursor: pointer;
}

.text-btn {
  background: none;
  border: none;
  color: $color-text;
  font-size: $font-size-base;
  font-weight: 600;
  margin-top: $space-lg;
  padding: $space-sm;
  cursor: pointer;
  text-decoration: underline;
}

/* =========================================
   PROFIL INDHOLD (Klargjort til senere)
   ========================================= */
.profile-content {
  display: flex;
  flex-direction: column;
}

.placeholder-box {
  background-color: $color-accent-secondary;
  padding: $space-xl;
  text-align: center;
  border: 1px dashed $color-accent-primary;
  color: $color-text;
  margin-top: $space-md;
}


/* =========================================
   PROFIL INDHOLDET
   ========================================= */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

/* 1. Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: $space-md;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background-color: $color-accent-primary; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; 
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    color: $color-text-inverted;
    font-size: $font-size-large;
    font-weight: 700;
  }
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-greeting {
  font-size: $font-size-large;
  font-weight: 700;
  color: $color-text;
  margin: 0;
}

.user-subtitle {
  font-size: $font-size-small;
  color: $color-text;
  margin: 0;
}

/* 2. Point Boks */
.points-banner {
  background-color: $color-accent-primary;
  border: none;
  padding: $space-md;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
  
  &:active {
    background-color: color.adjust($color-accent-primary, $lightness: -10%);
  }

  .banner-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .banner-label {
    font-size: $font-size-small;
    font-weight: 500;
    color: $color-accent-secondary;

  }

  .banner-amount {
    font-size: $font-size-large;
    font-weight: 700;
    color: $color-text-inverted;
  }

  .banner-icon {
    width: 20px;
    height: 20px;
    color: $color-text-inverted;
  }
}

/* 3. Menu Kolonne */
.profile-menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 1px solid color.adjust($color-text, $saturation: -30%, $lightness: 50%);
  padding: $space-md 0;
  cursor: pointer;
  color: $color-text;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.6;
  }

  // Fjerner stregen fra det sidste element i listen
  &:last-child {
    border-bottom: none;
  }

  .menu-label {
    font-size: 1rem;
    font-weight: 500;
  }

  .menu-icon {
    width: 15px;
    height: 15px;
    opacity: 0.5; // Gør pilen lidt nedtonet
  }
}

.logout-btn {
  margin-top: $space-xl;
  color: $color-accent-primary;
  background-color: transparent;
  border: 1px solid $color-accent-primary;
}
</style>