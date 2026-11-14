<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getShopItemById } from '@/services/shopService'
import IconArrow from '@/components/icons/IconArrow.vue'

const route = useRoute()

const item = ref(null)
const isLoading = ref(true)

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

// =========================================
// SWIPE-KNAP LOGIK
// =========================================
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

const onPointerUp = () => {
  if (!isDragging.value) return
  isDragging.value = false

  if (maxDrag > 0 && dragX.value >= maxDrag * 0.85 && item.value) {
    dragX.value = maxDrag
    redeemCode.value = `RP-${item.value.id}-${Math.floor(100000 + Math.random() * 900000)}`
    
    setTimeout(() => {
      isPurchased.value = true
    }, 150)
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