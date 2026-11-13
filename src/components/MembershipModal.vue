<script setup>
defineProps({
  isOpen: Boolean,
  userId: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <!-- Den mørke baggrund der fader ind -->
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click="$emit('close')"></div>
    </Transition>

    <!-- Selve hvid boks der glider ned fra toppen -->
    <Transition name="slide-down">
      <div v-if="isOpen" class="modal-content">
        
        <div class="modal-header">
          <h3>Dit Medlemskort</h3>
          <button class="close-btn" @click="$emit('close')" aria-label="Luk">&times;</button>
        </div>

        <div class="qr-container">
          <!-- API'et genererer en rigtig QR-kode ud fra brugerens ID -->
          <img 
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${userId}`" 
            alt="QR Kode" 
            class="qr-image" 
          />
        </div>
        
        <p class="user-id">ID: <span>{{ userId }}</span></p>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
/* =========================================
   OVERLAY
   ========================================= */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 999;
}

/* =========================================
   MODAL INDHOLD
   ========================================= */
.modal-content {
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + $space-md); // Tilføjer safe area inset for toppen
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - (2 * $space-lg)); // Tilføjer lidt margin på siderne
  max-width: calc(#{$app-max-width} - (2 * $space-xl));
  background-color: $color-background;
  padding: calc(env(safe-area-inset-top, 0px) + $space-lg) $space-lg $space-xl $space-lg;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $space-lg;

  h3 {
    margin: 0;
    font-size: $font-size-base;
    color: $color-text;
  }
}

.close-btn {
  background: none;
  border: none;
  color: $color-text;
  font-weight: 600;
  font-size: 3rem;
  cursor: pointer;
  padding: $space-xs 0;
}

.qr-container {
  background-color: #ffffff;
  padding: $space-sm;
  margin-bottom: $space-md;
}

.qr-image {
  width: 200px;
  height: 200px;
  display: block;
}

.user-id {
  font-size: 0.9rem;
  color: $color-text;
  margin: 0;

  span {
    font-weight: 700;
    color: $color-text;
    letter-spacing: 1px;
  }
}

/* =========================================
   ANIMATIONER
   ========================================= */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  /* Skubber boksen op uden for skærmen, kombineret med centreringen */
  transform: translate(-50%, -100%); 
}
</style>