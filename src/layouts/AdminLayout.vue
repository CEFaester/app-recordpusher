<!-- Lavet med hjælp fra AI -->
<script setup>
import { ref } from 'vue'
import { isAdminAuthenticated, loginAdmin, logoutAdmin } from '@/services/adminService'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) return

  try {
    isLoading.value = true
    errorMessage.value = ''
    await loginAdmin(username.value, password.value)
    username.value = ''
    password.value = ''
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <!-- LOGIN-VISNING (Vises indtil man er logget ind) -->
  <div v-if="!isAdminAuthenticated" class="login-wrapper">
    <div class="login-card">
      <header class="login-header">
        <span class="login-eyebrow">RECORDPUSHER</span>
        <h1 class="login-title">Admin Login</h1>
        <p class="login-desc">Log ind for at administrere events og pointbutik.</p>
      </header>

      <form class="login-form" @submit.prevent="handleLogin">
        <label class="form-label">
          Brugernavn
          <input
            v-model="username"
            type="text"
            class="form-input"
            autocomplete="username"
            required
          />
        </label>

        <label class="form-label">
          Adgangskode
          <input
            v-model="password"
            type="password"
            class="form-input"
            autocomplete="current-password"
            required
          />
        </label>

        <p v-if="errorMessage" class="login-error" role="alert">{{ errorMessage }}</p>

        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Logger ind...' : 'Log ind' }}
        </button>
      </form>

      <RouterLink :to="{ name: 'home' }" class="back-link">← Tilbage til appen</RouterLink>
    </div>
  </div>

  <!-- ADMIN PANEL (Vises når man er logget ind) -->
  <div v-else class="admin-wrapper">
    <header class="admin-topbar">
      <div class="topbar-inner">
        <div class="topbar-brand">
          <span class="brand-title">ADMIN</span>
          <RouterLink :to="{ name: 'home' }" class="back-to-app">← Til app</RouterLink>
        </div>

        <nav class="admin-nav">
          <RouterLink :to="{ name: 'admin-dashboard' }" class="nav-link">
            Oversigt
          </RouterLink>
          <RouterLink :to="{ name: 'admin-events' }" class="nav-link">
            Events
          </RouterLink>
          <RouterLink :to="{ name: 'admin-points' }" class="nav-link">
            Point Butik
          </RouterLink>
          <button type="button" class="logout-btn" @click="logoutAdmin">
            Log ud
          </button>
        </nav>
      </div>
    </header>

    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
/* =========================================
   LOGIN SKÆRM
   ========================================= */
.login-wrapper {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-md;
  background-color: $color-background;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: $color-primary;
  padding: $space-lg;
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  box-sizing: border-box;
}

.login-header {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.login-eyebrow {
  font-size: $font-size-small;
  font-weight: 700;
  color: $color-accent-primary;
}

.login-title {
  font-size: $font-size-large;
  font-weight: 700;
  color: $color-text;
  margin: 0;
}

.login-desc {
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.75;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.form-label {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  font-size: $font-size-small;
  font-weight: 600;
  color: $color-text;
}

.form-input {
  width: 100%;
  padding: $space-sm;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background-color: $color-background;
  color: $color-text;
  font-family: inherit;
  font-size: $font-size-base;
  box-sizing: border-box;
}

.login-error {
  margin: 0;
  padding: $space-xs $space-sm;
  background-color: $color-background;
  border-left: 3px solid $color-accent-primary;
  color: $color-accent-primary;
  font-size: $font-size-small;
  font-weight: 600;
}

.login-btn {
  width: 100%;
  padding: $space-sm $space-md;
  background-color: $color-accent-primary;
  color: $color-text-inverted;
  border: none;
  font-family: inherit;
  font-size: $font-size-base;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.back-link {
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.75;
  text-decoration: none;
  align-self: flex-start;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
}

/* =========================================
   ADMIN LAYOUT
   ========================================= */
.admin-wrapper {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: $color-background;
  box-sizing: border-box;
  overflow-x: clip;
}

.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background-color: $color-primary;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.topbar-inner {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: $space-md clamp($space-md, 3vw, $space-xl);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-sm $space-lg;
  box-sizing: border-box;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: $space-md;
}

.brand-title {
  font-size: $font-size-base;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: $color-text;
}

.back-to-app {
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.7;
  text-decoration: none;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
}

.admin-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-xs;
}

.nav-link {
  padding: $space-xs $space-md;
  font-size: $font-size-small;
  font-weight: 600;
  color: $color-text;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.router-link-exact-active {
    background-color: $color-accent-primary;
    color: $color-text-inverted;
  }
}

.logout-btn {
  margin-left: $space-xs;
  padding: $space-xs $space-sm;
  background: transparent;
  border: 1px solid $color-text;
  color: $color-text;
  font-family: inherit;
  font-size: $font-size-small;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.admin-main {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp($space-md, 3vw, $space-xl);
  box-sizing: border-box;
}
</style>