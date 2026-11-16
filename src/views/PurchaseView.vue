<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getShopItemById } from '@/services/shopService'
import { currentUser, spendUserPoints } from '@/services/userService'
import IconArrow from '@/components/icons/IconArrow.vue'

const route = useRoute()

const item = ref(null)
const isLoading = ref(true)
const purchaseError = ref('')

onMounted(async () => {
  try {
    isLoading.value = true
    item.value = await getShopItemById(route.params.id)
  } catch (error) {
    console.error('Fejl ved hentning af vare:', error)
  } finally {
    isLoading.value = false
  }
})

const trackRef = ref(null)
const dragX = ref(0)
const isDragging = ref(false)
const isPurchased = ref(false)
const redeemCode = ref('')

const THUMB_WIDTH = 56
const TRACK_PADDING = 4
let startX = 0
let maxDrag = 0

const swipeProgress = computed(() => {
  if (maxDrag <= 0) return 0
  return Math.min(1, dragX.value / maxDrag)
})

const onPointerDown = (e) => {
  if (isPurchased.value || !trackRef.value) return
  purchaseError.value = ''
  isDragging.value = true
  maxDrag = trackRef.value.clientWidth - THUMB_WIDTH - TRACK_PADDING * 2
  startX = e.clientX - dragX.value
  e.currentTarget.setPointerCapture(e.pointerId)
}

const onPointerMove = (e) => {
  if (!isDragging.value) return
  const nextX = e.clientX - startX
  dragX.value = Math.max(0, Math.min(nextX, maxDrag))
}

const onPointerUp = async () => {
  if (!isDragging.value) return
  isDragging.value = false

  if (maxDrag > 0 && dragX.value >= maxDrag * 0.85 && item.value) {
    dragX.value = maxDrag

    try {
      // Trækker point fra brugeren i Firebase
      await spendUserPoints(item.value.cost)
      redeemCode.value = `RP-${item.value.id}-${Math.floor(100000 + Math.random() * 900000)}`
      isPurchased.value = true
    } catch (err) {
      // Hvis man ikke er logget ind eller mangler point, nulstilles swipe-knappen
      dragX.value = 0
      purchaseError.value = err.message
    }
  } else {
    dragX.value = 0
  }
}

const qrCodeUrl = computed(() => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(redeemCode.value)}`
})
</script>

<template>
  <div class="purchase-view">
    <p v-if="isLoading" class="status-text">Henter vare...</p>
    <p v-else-if="!item" class="status-text">Varen blev ikke fundet.</p>

    <!-- TILSTAND 1: FØR KØB -->
    <template v-else-if="!isPurchased">
      <div class="product-showcase">
        <div class="product-visual">{{ item.icon }}</div>
        
        <div class="product-details">
          <h1 class="product-name">{{ item.name }}</h1>
          <div class="product-price">{{ item.cost }} POINT</div>
        </div>
      </div>
      
      <p v-if="purchaseError" class="purchase-error">{{ purchaseError }}</p>

      <div class="swipe-container">
        <div ref="trackRef" class="swipe-track">
          <div 
            class="swipe-fill" 
            :style="{ width: `${dragX + THUMB_WIDTH + TRACK_PADDING}px` }"
          ></div>

          <span 
            class="swipe-label"
            :style="{ opacity: 1 - swipeProgress * 1.4 }"
          >
            Swipe for at købe
          </span>

          <div
            class="swipe-thumb"
            :class="{ 'is-dragging': isDragging }"
            :style="{ transform: `translateX(${dragX}px)` }"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
          >
            <IconArrow class="thumb-icon" />
          </div>
        </div>
      </div>
    </template>

    <!-- TILSTAND 2: EFTER SWIPE -->
    <div v-else class="receipt-view">
      <header class="receipt-header">
        <span class="receipt-badge">KØB GODKENDT</span>
        <h1 class="receipt-title">{{ item.name }}</h1>
        <p class="receipt-subtitle">Vis denne QR-kode ved udlevering ({{ item.cost }} point)</p>
      </header>

      <div class="qr-card">
        <img :src="qrCodeUrl" :alt="`QR kode for ${item.name}`" class="qr-image" />
        <span class="redeem-code">{{ redeemCode }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.purchase-view {
  display: flex;
  flex-direction: column;
  margin-top: $space-md;
}

/* =========================================
   STOR VAREVISNING
   ========================================= */
.product-showcase {
  background-color: $color-primary;
  padding: $space-xl $space-lg;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 52dvh;
  gap: $space-lg;
}

.product-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 7rem; // Stort ikon/emoji

  img {
    width: 100%;
    max-height: 240px;
    object-fit: contain;
  }
}

.product-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-sm;
}

.product-name {
  font-size: $font-size-large;
  font-weight: 700;
  color: $color-text;
  margin: 0;
}

.product-price {
  background-color: $color-accent-secondary;
  color: $color-text;
  padding: $space-xs $space-md;
  font-size: $font-size-base;
  font-weight: 700;
}

/* =========================================
   SWIPE-KNAP LIGE OVER BOTTOMNAV
   ========================================= */

.purchase-error {
  color: $color-accent-primary;
  font-size: $font-size-small;
  font-weight: 600;
  text-align: center;
}

.swipe-container {
  position: fixed;
  // 64px er højden på din BottomNav + lidt luft ($space-md)
  bottom: calc(64px + env(safe-area-inset-bottom, 0px) + $space-md);
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - ($space-md * 2));
  max-width: calc(#{$app-max-width} - ($space-md * 2));
  z-index: 90;
}

.swipe-track {
  position: relative;
  width: 100%;
  height: 64px;
  background-color: $color-primary;
  border: 2px solid $color-accent-primary;
  border-radius: 999px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
  touch-action: none; // Forhindrer browseren i at scrolle mens man swiper
}

.swipe-fill {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: $color-accent-secondary;
  border-radius: 999px;
  pointer-events: none;
}

.swipe-label {
  position: relative;
  z-index: 1;
  font-size: $font-size-base;
  font-weight: 700;
  color: $color-text;
  padding-left: 36px; // Forskubber teksten lidt så den ikke rammer knappen
  pointer-events: none;
}

.swipe-thumb {
  position: absolute;
  left: 4px;
  top: 4px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: $color-accent-primary;
  color: $color-text-inverted;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 2;
  touch-action: none;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &.is-dragging {
    cursor: grabbing;
    transition: none; // Fjerner forsinkelse mens fingeren bevæger sig
  }

  .thumb-icon {
    width: 32px;
    height: 32px;
  }
}

/* =========================================
   QR-KODE KVITTERING (EFTER SWIPE)
   ========================================= */
.receipt-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: $space-lg;
  margin-top: $space-md;
}

.receipt-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-xs;
}

.receipt-badge {
  background-color: $color-accent-secondary;
  color: $color-text;
  font-size: $font-size-small;
  font-weight: 700;
  padding: 4px $space-sm;
}

.receipt-title {
  font-size: $font-size-large;
  font-weight: 700;
  color: $color-text;
  margin: $space-xs 0 0 0;
}

.receipt-subtitle {
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.8;
  margin: 0;
}

.qr-card {
  background-color: $color-background;
  padding: $space-lg;
  border: 2px solid $color-primary;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-md;
}

.qr-image {
  width: 220px;
  height: 220px;
  display: block;
}

.redeem-code {
  font-family: monospace;
  font-size: $font-size-base;
  font-weight: 700;
  letter-spacing: 1px;
  color: $color-text;
}
</style>