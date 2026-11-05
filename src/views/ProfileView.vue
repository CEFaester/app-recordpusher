<script setup>
import { ref } from 'vue'


const isLoggedIn = ref(false)
const isRegistering = ref(false)

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleAuth = () => {
  // Simpel validering fordi det er en prototype.
  if (!email.value || !password.value) {
    errorMessage.value = 'Udfyld venligst både email og adgangskode.'
    return
  }

  // Her vil Firebase koden ligge i fremtiden
  console.log(`Forsøger at ${isRegistering.value ? 'oprette' : 'logge ind'} med:`, email.value)
  
  // Sætter brugeren til at være logget ind
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
</script>

<template>
  <div class="profile-view">
    
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
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="din@email.dk" 
            class="form-input"
          />
        </div>

        <div class="input-group">
          <label for="password">Adgangskode</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="********" 
            class="form-input"
          />
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

    <section v-else class="profile-content">
      <h2 class="title">Min Profil</h2>
      <p class="subtitle">Du er logget ind som: <strong>{{ email }}</strong></p>
      
      <div class="placeholder-box">
        <p>Her kommer dine profiloplysninger...</p>
      </div>

      <button @click="handleLogout" class="secondary-btn">Log ud</button>
    </section>

  </div>
</template>

<style lang="scss" scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
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
  font-size: 0.85rem;
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
  font-size: 1rem;
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
  border-radius: 8px;
  padding: $space-sm;
  font-size: 1rem;
  font-weight: 600;
  margin-top: $space-xl;
  cursor: pointer;
}

.text-btn {
  background: none;
  border: none;
  color: $color-text;
  font-size: 0.9rem;
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
  border-radius: 12px;
  text-align: center;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  margin-top: $space-md;
}
</style>