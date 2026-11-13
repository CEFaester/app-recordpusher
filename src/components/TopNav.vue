<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import IconBack from '@/components/icons/IconBack.vue'
import IconQRCode from '@/components/icons/IconQRCode.vue'
import MembershipModal from '@/components/MembershipModal.vue' // Importer modalen

// Reaktiv tilstand der styrer pop-uppen
const isQrModalOpen = ref(false)

// Simuleret bruger-id
const currentUserId = ref('CEF-849201')

const route = useRoute()
const router = useRouter()

const openMembershipCard = () => {
  console.log('Åbner medlemskort...')
}
</script>

<template>
  <header class="top-nav">
    <div class="nav-left">
      <template v-if="route.name === 'home'">
        <img src="@/assets/logo.png" alt="Logo" class="nav-logo" />
      </template>
      
      <template v-else>
        <button class="icon-btn" @click="router.back()">
          <IconBack class="nav-icon" />
        </button>
      </template>
    </div>

    <div class="nav-right">
      <button class="icon-btn" @click="isQrModalOpen = true">
        <IconQRCode class="nav-icon" />
      </button>
    </div>
    <MembershipModal 
      :is-open="isQrModalOpen" 
      :user-id="currentUserId" 
      @close="isQrModalOpen = false" 
    />
  </header>
</template>

<style lang="scss" scoped>
.top-nav {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: $app-max-width;
  height: 64px;
  background-color: $color-background;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $space-md;
  z-index: 100;
  padding-top: env(safe-area-inset-top, 0px); 
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
}

.nav-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.icon-btn {
  background: none;
  border: none;
  padding: $space-xs;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text;

  .nav-icon {
    width: 32px;
    height: 32px;
  }
}
</style>