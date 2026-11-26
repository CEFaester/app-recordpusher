<!-- Lavet med hjælp fra AI -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import IconArrow from '@/components/icons/IconArrow.vue'
import IconQRCode from '@/components/icons/IconQRCode.vue'
import MembershipModal from '@/components/MembershipModal.vue'
import {
  currentUser,
  isAuthLoading,
  loginUser,
  registerUser,
  logoutUser
} from '@/services/userService'

const router = useRouter()

const isRegistering = ref(false)
const isCardOpen = ref(false)
const isSubmitting = ref(false)
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleAuth = async () => {
  if (!email.value || !password.value || (isRegistering.value && !name.value)) {
    errorMessage.value = 'Udfyld venligst alle felter.'
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = ''

    if (isRegistering.value) {
      await registerUser({
        name: name.value,
        email: email.value,
        password: password.value
      })
    } else {
      await loginUser(email.value, password.value)
    }

    name.value = ''
    email.value = ''
    password.value = ''
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isSubmitting.value = false
  }
}

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  errorMessage.value = ''
}

const handleLogout = () => {
  logoutUser()
}

const profileMenu = [
  { id: 1, label: 'Mine Events', routeName: 'saved-events' },
  { id: 2, label: 'Din Musik Smag', routeName: '' },
  { id: 3, label: 'Ordrehistorik', routeName: '' },
  { id: 4, label: 'Indstillinger', routeName: '' }
]

const navigateTo = (routeName) => {
  if (!routeName) return
  router.push({ name: routeName })
}
</script>

<template>
  <div class="profile-view">
    <p v-if="isAuthLoading" class="loading-text">Indlæser profil...</p>

    <!-- =========================================
         VISES NÅR MAN IKKE ER LOGGET IND
         ========================================= -->
    <section v-else-if="!currentUser" class="auth-section">
      <header class="auth-header">
        <h2 class="title">{{ isRegistering ? 'Opret Profil' : 'Log Ind' }}</h2>
        <p class="subtitle">
          {{ isRegistering 
            ? 'Opret en konto for at samle point og se dit medlemskort.' 
            : 'Log ind for at se dine point og dit medlemskort.' }}
        </p>
      </header>

      <form @submit.prevent="handleAuth" class="auth-form">
        <div v-if="isRegistering" class="input-group">
          <label for="name">Navn</label>
          <input type="text" id="name" v-model="name" placeholder="Dit navn" class="form-input" />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" placeholder="din@email.dk" class="form-input" />
        </div>

        <div class="input-group">
          <label for="password">Adgangskode</label>
          <input type="password" id="password" v-model="password" placeholder="********" class="form-input" />
        </div>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>

        <button type="submit" class="primary-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Vent venligst...' : (isRegistering ? 'Opret konto' : 'Log ind') }}
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
      <header class="profile-header">
        <div class="avatar">
          <img v-if="currentUser.avatarUrl" :src="currentUser.avatarUrl" alt="Profilbillede" />
          <span v-else class="avatar-placeholder">{{ currentUser.name.charAt(0) }}</span>
        </div>

        <div class="user-info">
          <h2 class="user-greeting">Hej, {{ currentUser.name }}</h2>
          <p class="user-subtitle">Medlem siden {{ currentUser.memberSince }}</p>
          <p class="user-member-code">ID: {{ currentUser.memberCode }}</p>
        </div>
      </header>

      <button class="points-banner" @click="router.push({ name: 'points' })">
        <div class="banner-text">
          <span class="banner-label">DIN MUSIK. DIT FÆLLESKAB.</span>
          <span class="banner-amount">{{ currentUser.points }} point</span>
        </div>
        <IconArrow class="banner-icon" />
      </button>

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

      <button @click="handleLogout" class="secondary-btn logout-btn">Log ud</button>

      <MembershipModal 
        :is-open="isCardOpen" 
        :user-id="currentUser.memberCode" 
        @close="isCardOpen = false" 
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  margin-top: $space-sm;
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

.card-trigger-btn { 
  background-color: $color-primary; 
  border: none; 
  padding: $space-sm; 
  color: $color-text; 
  cursor: pointer; 
  display: flex; 
  
  .qr-mini-icon { 
    width: 28px; height: 28px; 
  } 
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-member-code { 
  font-family: monospace; 
  font-size: $font-size-small; 
  font-weight: 700; 
  color: $color-accent-primary; 
  margin: 2px 0 0 0; 
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
  padding: $space-lg $space-md;
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
    gap: 6px;
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
  padding: $space-xl 0;
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
  border: 2px solid $color-accent-primary;
}
</style>